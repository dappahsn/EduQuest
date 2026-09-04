/**
 * Daily Quest Engine
 * Uses consistent server/UTC date format (YYYY-MM-DD) for resets.
 */

export function getTodayDateString() {
  const now = new Date();
  return now.toISOString().slice(0, 10); // 'YYYY-MM-DD' in UTC
}

export const DEFAULT_DAILY_QUEST_POOL = [
  {
    id: 'daily-math-5',
    title: 'Pecahkan 5 Tantangan Angka',
    description: 'Selesaikan 5 soal hitungan di Lembah Angka atau Mini Game.',
    category: 'math',
    targetCount: 5,
    rewardXp: 100,
    rewardCoins: 20,
    icon: 'calculate'
  },
  {
    id: 'daily-sci-1',
    title: 'Jelajahi 1 Penemuan Sains',
    description: 'Buka dan baca 1 kartu konsep penemuan misteri alam.',
    category: 'science',
    targetCount: 1,
    rewardXp: 150,
    rewardCoins: 30,
    icon: 'biotech'
  },
  {
    id: 'daily-story-1',
    title: 'Selesaikan 1 Misi Cerita',
    description: 'Susun kalimat legenda Nusantara di Negeri Cerita.',
    category: 'story',
    targetCount: 1,
    rewardXp: 100,
    rewardCoins: 20,
    icon: 'auto_stories'
  }
];

export function generateDailyQuests(dateStr = getTodayDateString()) {
  return DEFAULT_DAILY_QUEST_POOL.map((q) => ({
    ...q,
    date: dateStr,
    currentCount: 0,
    completed: false,
    claimed: false
  }));
}

export function checkDailyReset(storedDate) {
  const today = getTodayDateString();
  return storedDate !== today;
}

export function isAllDailyQuestsCompleted(quests) {
  if (!quests || quests.length === 0) return false;
  return quests.every((q) => q.completed);
}
