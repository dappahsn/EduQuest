/**
 * EduQuest Progression & Level Calculations
 * Formula according to BUSINESS_RULES.md:
 * XP Required for Level L = 150 * (L - 1) + 50 * (L - 1)^2
 * Level 1: 0 XP
 * Level 2: 200 XP
 * Level 3: 500 XP
 * Level 12: 7,150 XP
 * Level 13: 9,000 XP
 */

export function getXpForLevel(level) {
  if (level <= 1) return 0;
  const lMinus1 = level - 1;
  return 150 * lMinus1 + 50 * (lMinus1 * lMinus1);
}

export function getLevelFromXp(totalXp) {
  if (!totalXp || totalXp <= 0) return 1;
  let level = 1;
  while (getXpForLevel(level + 1) <= totalXp) {
    level++;
  }
  return level;
}

export function getLevelProgress(totalXp) {
  const currentLevel = getLevelFromXp(totalXp);
  const currentLevelBaseXp = getXpForLevel(currentLevel);
  const nextLevelBaseXp = getXpForLevel(currentLevel + 1);
  const xpInCurrentLevel = totalXp - currentLevelBaseXp;
  const xpNeededForNext = nextLevelBaseXp - currentLevelBaseXp;
  const percentage = Math.min(100, Math.max(0, Math.round((xpInCurrentLevel / xpNeededForNext) * 100)));

  return {
    currentLevel,
    nextLevel: currentLevel + 1,
    currentLevelBaseXp,
    nextLevelBaseXp,
    xpInCurrentLevel,
    xpNeededForNext,
    percentage,
    remainingXp: Math.max(0, nextLevelBaseXp - totalXp)
  };
}

export const STREAK_MILESTONES = [3, 7, 14, 30, 60, 100];

export function calculateRewardBonus(baseXp, baseCoins, streakDays = 0) {
  let streakMultiplier = 1;
  if (streakDays >= 30) streakMultiplier = 1.5;
  else if (streakDays >= 14) streakMultiplier = 1.3;
  else if (streakDays >= 7) streakMultiplier = 1.2;
  else if (streakDays >= 3) streakMultiplier = 1.1;

  return {
    xp: Math.round(baseXp * streakMultiplier),
    coins: Math.round(baseCoins * streakMultiplier),
    bonusMultiplier: streakMultiplier
  };
}
