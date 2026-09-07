/**
 * Achievement System
 * 7 Initial Achievements connected to gameplay events
 */

export const INITIAL_ACHIEVEMENTS = [
  {
    id: 'first_quest',
    code: 'FIRST_STEP',
    title: 'Langkah Pertama',
    description: 'Selesaikan misi petualangan pertamamu di EduQuest!',
    tier: 'Perunggu',
    icon: 'military_tech',
    target: 1,
    rewardXp: 100,
    rewardCoins: 25
  },
  {
    id: 'first_profile',
    code: 'CUSTOM_PROFILE',
    title: 'Identitas Petualang',
    description: 'Atur profil dan pilih karakter petualang favoritmu.',
    tier: 'Perunggu',
    icon: 'badge',
    target: 1,
    rewardXp: 100,
    rewardCoins: 25
  },
  {
    id: 'math_master',
    code: 'MATH_CHAMP',
    title: 'Pemburu Angka',
    description: 'Selesaikan 5 tantangan matematika dan pecahan.',
    tier: 'Perak',
    icon: 'calculate',
    target: 5,
    rewardXp: 250,
    rewardCoins: 50
  },
  {
    id: 'card_collector',
    code: 'DISCOVERY_CARDS',
    title: 'Penemu Cilik',
    description: 'Buka dan miliki minimal 3 Kartu Pengetahuan langka.',
    tier: 'Perak',
    icon: 'style',
    target: 3,
    rewardXp: 200,
    rewardCoins: 50
  },
  {
    id: 'streak_7',
    code: 'STREAK_7_DAYS',
    title: 'Rentetan Membara',
    description: 'Pertahankan kebiasaan belajar selama 7 hari berturut-turut!',
    tier: 'Emas',
    icon: 'local_fire_department',
    target: 7,
    rewardXp: 500,
    rewardCoins: 100
  },
  {
    id: 'fashion_star',
    code: 'FASHIONISTA',
    title: 'Kolektor Busana',
    description: 'Kustomisasi penampilan karaktermu dengan kostum baru.',
    tier: 'Perunggu',
    icon: 'styler',
    target: 1,
    rewardXp: 80,
    rewardCoins: 20
  },
  {
    id: 'world_explorer',
    code: 'EXPLORE_3_REGIONS',
    title: 'Penjelajah Benua',
    description: 'Jelajahi minimal 3 kepulauan di Benua EduQuest.',
    tier: 'Emas',
    icon: 'explore',
    target: 3,
    rewardXp: 400,
    rewardCoins: 100
  }
];

export function checkAchievementsProgress(gameState) {
  const updates = [];

  const completedQuestsCount = (gameState.completedQuestIds || []).length;
  const cardsCount = (gameState.unlockedCardIds || []).length;
  const streak = gameState.streakDays || 1;
  const visitedRegions = (gameState.visitedRegionIds || ['lembah-angka']).length;
  const hasProfile = !!(gameState.playerName && gameState.characterConfig?.avatar);
  const hasCustomized = !!gameState.characterConfig?.hasCustomized;

  INITIAL_ACHIEVEMENTS.forEach((ach) => {
    let current = 0;
    if (ach.id === 'first_quest') current = completedQuestsCount;
    if (ach.id === 'first_profile') current = hasProfile ? 1 : 0;
    if (ach.id === 'math_master') current = completedQuestsCount;
    if (ach.id === 'card_collector') current = cardsCount;
    if (ach.id === 'streak_7') current = streak;
    if (ach.id === 'fashion_star') current = hasCustomized ? 1 : 0;
    if (ach.id === 'world_explorer') current = visitedRegions;

    const isUnlocked = current >= ach.target;
    updates.push({
      ...ach,
      progress: Math.min(ach.target, current),
      unlocked: isUnlocked
    });
  });

  return updates;
}
