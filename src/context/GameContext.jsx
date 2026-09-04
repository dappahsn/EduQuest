import React, { createContext, useContext, useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { getLevelFromXp } from '../lib/progression';
import { generateDailyQuests, checkDailyReset, getTodayDateString, isAllDailyQuestsCompleted } from '../lib/dailyQuests';
import { INITIAL_ACHIEVEMENTS } from '../lib/achievements';
import { PET_REGISTRY } from '../lib/petsRegistry';
import { audioManager } from '../lib/audioManager';

const GameContext = createContext(null);

// Security & User Isolation: Namespace storage per user ID
const getStorageKey = (uid) => uid ? `eduquest_save_state_${uid}` : 'eduquest_save_state_guest';

const DEFAULT_GAME_STATE = {
  playerName: 'Raka',
  xp: 2450, // Matches Stitch Level 12 preview
  coins: 840,
  energy: 3,
  maxEnergy: 5,
  streakDays: 7,
  lastPlayedDate: getTodayDateString(),
  characterConfig: {
    avatar: 'boy_raka',
    hairstyle: 'short',
    hairColor: '#1a1a1a',
    skinTone: '#ffd8be',
    outfit: 'outfit-scout',
    shoes: 'shoes-sneakers',
    backpack: 'bag-canvas',
    accessories: 'hat-safari',
    outfitColor: 'sky',
    hasCustomized: true
  },
  activePetId: 'fox', // Lumi
  petsState: {
    fox: { level: 7, xp: 720, happiness: 98, unlocked: true },
    cat: { level: 5, xp: 50, happiness: 92, unlocked: true },
    panda: { level: 1, xp: 0, happiness: 85, unlocked: true },
    dino: { level: 1, xp: 0, happiness: 80, unlocked: false },
    dragon: { level: 1, xp: 0, happiness: 80, unlocked: false }
  },
  dailyQuestsDate: getTodayDateString(),
  dailyQuests: generateDailyQuests(),
  dailyChestClaimed: false,
  unlockedItemIds: [
    'hat-safari',
    'hat-astronaut',
    'hat-detective',
    'outfit-scout',
    'outfit-scientist',
    'bag-canvas',
    'shoes-sneakers'
  ],
  equippedItems: {
    accessories: 'hat-safari',
    outfit: 'outfit-scout',
    backpack: 'bag-canvas',
    shoes: 'shoes-sneakers'
  },
  unlockedCardIds: ['card-earth', 'card-sun', 'card-moon'],
  completedQuestIds: ['quest-la-1', 'quest-la-2'],
  visitedRegionIds: ['lembah-angka', 'hutan-sains', 'negeri-cerita'],
  claimedAchievements: ['first_quest']
};

function loadInitialState(uid) {
  const key = getStorageKey(uid);
  try {
    const saved = localStorage.getItem(key);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (checkDailyReset(parsed.dailyQuestsDate)) {
        parsed.dailyQuestsDate = getTodayDateString();
        parsed.dailyQuests = generateDailyQuests();
        parsed.dailyChestClaimed = false;
      }
      return { ...DEFAULT_GAME_STATE, ...parsed };
    }
  } catch (e) {
    console.warn('Could not read saved game state for user:', uid, e);
  }
  return { ...DEFAULT_GAME_STATE };
}

export function GameProvider({ children }) {
  const { user } = useAuth();
  const prevUserIdRef = useRef(user?.id);
  const [gameState, setGameState] = useState(() => loadInitialState(user?.id));

  const [levelUpModal, setLevelUpModal] = useState(null);
  const [rewardModal, setRewardModal] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  // User Isolation: When user changes, reset state completely to that user's partition
  useEffect(() => {
    const currentUid = user?.id || null;
    if (currentUid !== prevUserIdRef.current) {
      prevUserIdRef.current = currentUid;
      const isolatedState = loadInitialState(currentUid);
      if (user?.user_metadata?.username) {
        isolatedState.playerName = user.user_metadata.username;
      }
      setGameState(isolatedState);
    }
  }, [user?.id, user?.user_metadata?.username]);

  // Sync to local storage under user-namespaced key
  useEffect(() => {
    const key = getStorageKey(user?.id);
    try {
      localStorage.setItem(key, JSON.stringify(gameState));
    } catch (e) {
      console.warn('Could not save game state:', e);
    }
  }, [gameState, user?.id]);

  // Sync with Supabase on user change if available
  useEffect(() => {
    if (!user) return;
    async function loadFromDb() {
      try {
        const isPlaceholder = !import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL.includes('placeholder');
        if (isPlaceholder) return;

        // Fetch profile and quest progress in parallel to eliminate network waterfall
        const [profileRes, questsRes] = await Promise.all([
          supabase
            .from('profiles')
            .select('id, username, xp, coins, streak')
            .eq('id', user.id)
            .single(),
          supabase
            .from('quest_progress')
            .select('quest_id')
            .eq('user_id', user.id)
            .eq('status', 'completed')
        ]);

        const profile = profileRes.data;
        const quests = questsRes.data;

        if (profile) {
          setGameState((prev) => ({
            ...prev,
            playerName: profile.username || prev.playerName,
            xp: profile.xp ?? prev.xp,
            coins: profile.coins ?? prev.coins,
            streakDays: profile.streak ?? prev.streakDays
          }));
        }

        if (quests && quests.length > 0) {
          setGameState((prev) => ({
            ...prev,
            completedQuestIds: Array.from(new Set([...prev.completedQuestIds, ...quests.map((q) => q.quest_id)]))
          }));
        }
      } catch (err) {
        console.warn('Profile fetch note:', err.message);
      }
    }
    loadFromDb();
  }, [user]);

  function showToast(msg) {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  }

  // Complete a quest with level up detection and secure reward calculation
  async function completeQuest(questId, score = 100, earnedXp = 150, earnedCoins = 40, droppedCardId = null, droppedItemId = null, droppedPetId = null) {
    const sanitizedScore = Math.max(0, Math.min(100, Number(score) || 0));
    const isPlaceholder = !import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL.includes('placeholder');

    // Secure Server-Side RPC execution if connected to Supabase
    if (user && !isPlaceholder) {
      try {
        const { data, error } = await supabase.rpc('complete_quest_secure', {
          p_quest_id: questId,
          p_score: sanitizedScore,
          p_stars: sanitizedScore >= 90 ? 3 : sanitizedScore >= 70 ? 2 : 1,
          p_dropped_card_id: droppedCardId
        });

        if (!error && data && data.success) {
          const oldLevel = getLevelFromXp(gameState.xp);
          setGameState((prev) => ({
            ...prev,
            xp: data.new_xp,
            coins: data.new_coins,
            completedQuestIds: Array.from(new Set([...prev.completedQuestIds, questId])),
            unlockedCardIds: droppedCardId ? Array.from(new Set([...prev.unlockedCardIds, droppedCardId])) : prev.unlockedCardIds,
            unlockedItemIds: droppedItemId ? Array.from(new Set([...prev.unlockedItemIds, droppedItemId])) : prev.unlockedItemIds
          }));

          if (data.level_up) {
            setLevelUpModal({
              oldLevel,
              newLevel: data.new_level,
              rewards: { coins: 50, energy: 2 }
            });
          }

          return {
            isFirstTime: data.is_first_time,
            earnedXp: data.awarded_xp,
            earnedCoins: data.awarded_coins,
            droppedCardId,
            droppedItemId,
            droppedPetId,
            levelUp: data.level_up ? data.new_level : null
          };
        }
      } catch (e) {
        console.warn('RPC complete_quest_secure note:', e.message);
      }
    }

    // Local validated fallback (demo / offline)
    const isFirstTime = !gameState.completedQuestIds.includes(questId);
    const xpToAdd = isFirstTime ? earnedXp : 20; // Practice replay awards 20 XP
    const coinsToAdd = isFirstTime ? earnedCoins : 5;

    const oldLevel = getLevelFromXp(gameState.xp);
    const newTotalXp = gameState.xp + xpToAdd;
    const newLevel = getLevelFromXp(newTotalXp);

    setGameState((prev) => {
      const nextCompleted = isFirstTime ? [...prev.completedQuestIds, questId] : prev.completedQuestIds;
      const nextCards = droppedCardId && !prev.unlockedCardIds.includes(droppedCardId)
        ? [...prev.unlockedCardIds, droppedCardId]
        : prev.unlockedCardIds;
      const nextItems = droppedItemId && !prev.unlockedItemIds.includes(droppedItemId)
        ? [...prev.unlockedItemIds, droppedItemId]
        : prev.unlockedItemIds;
      const nextPetsState = droppedPetId && prev.petsState[droppedPetId]
        ? {
            ...prev.petsState,
            [droppedPetId]: {
              ...prev.petsState[droppedPetId],
              unlocked: true
            }
          }
        : prev.petsState;

      // Update daily math/science quest count if matching
      const updatedDailies = prev.dailyQuests.map((dq) => {
        let added = 0;
        if (dq.category === 'math' && questId.includes('la')) added = 1;
        if (dq.category === 'science' && questId.includes('hs')) added = 1;
        if (dq.category === 'story' && questId.includes('nc')) added = 1;
        const newCount = dq.currentCount + added;
        return {
          ...dq,
          currentCount: newCount,
          completed: dq.completed || newCount >= dq.targetCount
        };
      });

      return {
        ...prev,
        xp: newTotalXp,
        coins: prev.coins + coinsToAdd,
        completedQuestIds: nextCompleted,
        unlockedCardIds: nextCards,
        unlockedItemIds: nextItems,
        petsState: nextPetsState,
        dailyQuests: updatedDailies
      };
    });

    // Check Level Up Trigger
    if (newLevel > oldLevel) {
      audioManager.playSfx('level-up');
      setLevelUpModal({
        oldLevel,
        newLevel,
        rewards: {
          coins: 50,
          energy: 2
        }
      });
    } else {
      // Play XP/coin gain SFX when no level up
      audioManager.playSfx('xp-gain');
    }

    return {
      isFirstTime,
      earnedXp: xpToAdd,
      earnedCoins: coinsToAdd,
      droppedCardId,
      droppedItemId,
      droppedPetId,
      levelUp: newLevel > oldLevel ? newLevel : null
    };
  }

  function feedPet(petId = gameState.activePetId) {
    if (!gameState.petsState[petId]) return;
    setGameState((prev) => {
      const pet = prev.petsState[petId];
      const newXp = (pet.xp || 0) + 10;
      const newHappiness = Math.min(100, (pet.happiness || 80) + 2);
      const newLevel = Math.floor(newXp / 100) + 1;
      return {
        ...prev,
        petsState: {
          ...prev.petsState,
          [petId]: {
            ...pet,
            xp: newXp,
            level: newLevel,
            happiness: newHappiness
          }
        }
      };
    });
    showToast(`${PET_REGISTRY[petId]?.name || 'Sahabat'} sangat senang! (+10 XP) 🫐`);
    audioManager.playSfx('coin');
  }

  function equipPet(petId) {
    if (!PET_REGISTRY[petId]) return;
    setGameState((prev) => ({
      ...prev,
      activePetId: petId
    }));
    showToast(`${PET_REGISTRY[petId].name} sekarang menjadi teman petualanganmu!`);
  }

  async function updateCharacter(newConfig) {
    // Only allow cosmetic fields
    const allowed = ['avatar', 'hairstyle', 'hairColor', 'skinTone', 'outfit', 'shoes', 'backpack', 'accessories', 'outfitColor'];
    const sanitized = {};
    for (const key of allowed) {
      if (newConfig[key] !== undefined) {
        sanitized[key] = newConfig[key];
      }
    }

    setGameState((prev) => ({
      ...prev,
      characterConfig: {
        ...prev.characterConfig,
        ...sanitized,
        hasCustomized: true
      }
    }));

    const isPlaceholder = !import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL.includes('placeholder');
    if (user && !isPlaceholder) {
      try {
        await supabase.from('profiles').update({
          avatar_id: sanitized.avatar || 'raka_classic',
          updated_at: new Date().toISOString()
        }).eq('id', user.id);
      } catch (e) {
        console.warn('Sync character profile note:', e.message);
      }
    }

    showToast('Kustomisasi karakter berhasil disimpan! ✨');
  }

  function equipItem(slot, itemId) {
    setGameState((prev) => ({
      ...prev,
      equippedItems: {
        ...prev.equippedItems,
        [slot]: itemId
      }
    }));
    showToast('Perlengkapan berhasil dipakai!');
  }

  function unequipItem(slot) {
    setGameState((prev) => {
      const next = { ...prev.equippedItems };
      delete next[slot];
      return { ...prev, equippedItems: next };
    });
    showToast('Perlengkapan dilepas.');
  }

  function claimDailyQuestReward(questId) {
    setGameState((prev) => {
      const quest = prev.dailyQuests.find((q) => q.id === questId);
      if (!quest || quest.claimed || !quest.completed) return prev;

      const updated = prev.dailyQuests.map((q) =>
        q.id === questId ? { ...q, claimed: true } : q
      );

      return {
        ...prev,
        xp: prev.xp + quest.rewardXp,
        coins: prev.coins + quest.rewardCoins,
        dailyQuests: updated
      };
    });
    showToast('Hadiah harian berhasil diklaim!');
    audioManager.playSfx('coin');
  }

  function claimDailyChest() {
    if (gameState.dailyChestClaimed) return;
    if (!isAllDailyQuestsCompleted(gameState.dailyQuests)) return;

    setGameState((prev) => ({
      ...prev,
      dailyChestClaimed: true,
      coins: prev.coins + 150,
      xp: prev.xp + 200,
      energy: Math.min(prev.maxEnergy, prev.energy + 2)
    }));

    setRewardModal({
      title: 'Peti Harian Mistis Terbuka!',
      xp: 200,
      coins: 150,
      badge: 'Bintang Harian'
    });
    audioManager.playSfx('quest-complete');
  }

  async function claimAchievementReward(achId) {
    const ach = INITIAL_ACHIEVEMENTS.find((a) => a.id === achId);
    if (!ach || gameState.claimedAchievements.includes(achId)) return;

    const isPlaceholder = !import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL.includes('placeholder');
    if (user && !isPlaceholder) {
      try {
        await supabase.rpc('claim_achievement_secure', { p_achievement_id: achId });
      } catch (e) {
        console.warn('RPC claim_achievement_secure note:', e.message);
      }
    }

    setGameState((prev) => {
      if (prev.claimedAchievements.includes(achId)) return prev;
      return {
        ...prev,
        xp: prev.xp + ach.rewardXp,
        coins: prev.coins + ach.rewardCoins,
        claimedAchievements: [...prev.claimedAchievements, achId]
      };
    });
    showToast(`Prestasi "${ach.title}" berhasil diklaim! 🏆`);
    audioManager.playSfx('achievement');
  }

  async function unlockPet(petId) {
    if (!gameState.petsState[petId]) return;
    const isPlaceholder = !import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL.includes('placeholder');
    if (user && !isPlaceholder) {
      try {
        await supabase.rpc('unlock_pet_secure', { p_pet_id: petId });
      } catch (e) {
        console.warn('RPC unlock_pet_secure note:', e.message);
      }
    }

    setGameState((prev) => ({
      ...prev,
      petsState: {
        ...prev.petsState,
        [petId]: {
          ...prev.petsState[petId],
          unlocked: true
        }
      }
    }));
    showToast(`🎉 Sahabat Baru Terbuka: ${PET_REGISTRY[petId]?.name || petId}!`);
    audioManager.playSfx('pet-unlock');
  }

  async function unlockItem(itemId, costCoins = 0) {
    if (gameState.unlockedItemIds.includes(itemId)) return;
    if (costCoins > 0 && gameState.coins < costCoins) {
      showToast('Koin tidak mencukupi untuk membuka perlengkapan ini!');
      return;
    }

    const isPlaceholder = !import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL.includes('placeholder');
    if (user && !isPlaceholder) {
      try {
        await supabase.rpc('unlock_item_secure', { p_item_id: itemId });
      } catch (e) {
        console.warn('RPC unlock_item_secure note:', e.message);
      }
    }

    setGameState((prev) => ({
      ...prev,
      coins: Math.max(0, prev.coins - costCoins),
      unlockedItemIds: [...prev.unlockedItemIds, itemId]
    }));
    showToast('🎁 Perlengkapan Baru Terbuka!');
    audioManager.playSfx('item-unlock');
  }

  const calculatedLevel = useMemo(() => getLevelFromXp(gameState.xp), [gameState.xp]);

  const value = useMemo(() => ({
    ...gameState,
    level: calculatedLevel,
    completeQuest,
    feedPet,
    equipPet,
    unlockPet,
    updateCharacter,
    equipItem,
    unequipItem,
    unlockItem,
    claimDailyQuestReward,
    claimDailyChest,
    claimAchievementReward,
    showToast,
    levelUpModal,
    setLevelUpModal,
    rewardModal,
    setRewardModal,
    toastMessage
  }), [
    gameState,
    calculatedLevel,
    levelUpModal,
    rewardModal,
    toastMessage
  ]);

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}
