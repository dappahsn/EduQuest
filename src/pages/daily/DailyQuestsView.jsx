import React from 'react';
import { Link } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import GameHeader from '../../components/navigation/GameHeader';
import BottomNavDock from '../../components/navigation/BottomNavDock';
import { isAllDailyQuestsCompleted } from '../../lib/dailyQuests';
import styles from './DailyQuestsView.module.css';

export default function DailyQuestsView() {
  const {
    dailyQuests = [],
    dailyQuestsDate,
    dailyChestClaimed,
    claimDailyQuestReward,
    claimDailyChest,
    streakDays
  } = useGame();

  const completedCount = (dailyQuests || []).filter((q) => q.completed).length;
  const totalCount = (dailyQuests || []).length || 3;
  const allCompleted = isAllDailyQuestsCompleted(dailyQuests);
  const overallPercent = Math.min(100, Math.round((completedCount / totalCount) * 100));

  const getCategoryTheme = (category) => {
    switch (category) {
      case 'math':
        return {
          iconClass: styles.questIconMath,
          fillClass: styles.fillMath,
          label: 'Matematika & Logika',
          dest: '/world/lembah-angka'
        };
      case 'science':
        return {
          iconClass: styles.questIconScience,
          fillClass: styles.fillScience,
          label: 'Sains & Eksplorasi',
          dest: '/world/hutan-sains'
        };
      case 'story':
        return {
          iconClass: styles.questIconStory,
          fillClass: styles.fillStory,
          label: 'Bahasa & Cerita',
          dest: '/world/negeri-cerita'
        };
      default:
        return {
          iconClass: styles.questIconMath,
          fillClass: styles.fillMath,
          label: 'Misi Petualang',
          dest: '/world'
        };
    }
  };

  return (
    <div className={styles.container}>
      <GameHeader />

      <main className={styles.main}>
        {/* =======================================================
            LEFT COLUMN: CHEST SHOWCASE & QUICK HUB (Desktop Sticky)
            ======================================================= */}
        <aside className={styles.leftColumn}>
          {/* Main Daily Chest Card */}
          <div
            className={`${styles.chestCard} ${
              dailyChestClaimed
                ? styles.chestCardClaimed
                : allCompleted
                ? styles.chestCardReady
                : ''
            }`}
          >
            <div className={styles.chestAmbientAura} />

            <div
              className={`${styles.chestAvatarCircle} ${
                allCompleted && !dailyChestClaimed ? 'animate-chest-wobble ' + styles.chestAvatarReady : ''
              } ${dailyChestClaimed ? styles.chestAvatarClaimed : ''}`}
            >
              {dailyChestClaimed ? '✨' : allCompleted ? '🎁' : '🧰'}
            </div>

            <span
              className={`${styles.chestBadgeTag} ${
                dailyChestClaimed
                  ? styles.tagClaimed
                  : allCompleted
                  ? styles.tagReady
                  : styles.tagPending
              }`}
            >
              {dailyChestClaimed
                ? 'Terklaim ✓'
                : allCompleted
                ? 'Siap Dibuka! ✨'
                : 'Peti Mistis Harian'}
            </span>

            <h2 className={styles.chestTitle}>
              {dailyChestClaimed
                ? 'Peti Harian Sudah Terbuka'
                : allCompleted
                ? 'Peti Harian Siap Dibuka!'
                : 'Peti Hadiah Harian'}
            </h2>

            <p className={styles.chestDesc}>
              {dailyChestClaimed
                ? 'Kembali lagi besok untuk rangkaian misi dan peti hadiah baru!'
                : allCompleted
                ? 'Hebat! Semua misi harian selesai. Buka peti sekarang untuk mengambil hadiahmu!'
                : 'Selesaikan ketiga misi harian untuk membuka peti hadiah mistis ini.'}
            </p>

            {/* Progress Bar inside Chest Card */}
            <div className={styles.chestProgressBarContainer}>
              <div className={styles.progressBarLabel}>
                <span>Progres Misi</span>
                <span>{completedCount} / {totalCount} Selesai ({overallPercent}%)</span>
              </div>
              <div className={styles.progressBarTrack}>
                <div
                  className={styles.progressBarFill}
                  style={{ width: `${overallPercent}%` }}
                />
              </div>
            </div>

            {/* Rewards Breakdown Pills */}
            <div className={styles.rewardPillsList}>
              <div className={styles.rewardPillItem} title="Poin Pengalaman">
                <span>🌟</span>
                <span>+200 XP</span>
              </div>
              <div className={styles.rewardPillItem} title="Koin EduQuest">
                <span>🪙</span>
                <span>+150 Koin</span>
              </div>
              <div className={styles.rewardPillItem} title="Pemulihan Energi">
                <span>⚡</span>
                <span>+2 Energi</span>
              </div>
              <div className={styles.rewardPillItem} title="Badge Spesial">
                <span>🎖️</span>
                <span>Bintang Harian</span>
              </div>
            </div>

            {/* Action Button */}
            {!dailyChestClaimed && allCompleted && (
              <button
                onClick={claimDailyChest}
                className={`animate-celebrate-pop ${styles.claimChestBtn}`}
              >
                Buka Peti Harian! 🎁
              </button>
            )}

            {dailyChestClaimed && (
              <div className={styles.claimedBadge}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>check_circle</span>
                <span>Hadiah Hari Ini Sudah Diambil</span>
              </div>
            )}
          </div>

          {/* Quick Hub Card: Streak & Direct World Jump */}
          <div className={styles.quickHubCard}>
            <div className={styles.quickHubHeader}>
              <h3 className={styles.quickHubTitle}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#f59e0b' }}>
                  local_fire_department
                </span>
                Aktivitas Petualang
              </h3>
              <div className={styles.streakBadge}>
                <span>🔥</span>
                <span>{streakDays || 1} Hari Beruntun</span>
              </div>
            </div>

            <p className={styles.quickHubText}>
              Selesaikan misi harian setiap hari untuk mengumpulkan ribuan XP dan menjaga api petualanganmu tetap menyala!
            </p>

            <Link to="/world" className={styles.goToWorldBtn}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                travel_explore
              </span>
              <span>Jelajahi Peta Galaksi</span>
            </Link>
          </div>
        </aside>

        {/* =======================================================
            RIGHT COLUMN: HEADER & QUESTS LIST
            ======================================================= */}
        <section className={styles.rightColumn}>
          {/* Header Bar */}
          <header className={styles.pageHeader}>
            <div className={styles.headerLeft}>
              <span className={styles.headerSubtitle}>
                Reset Harian (UTC: {dailyQuestsDate || 'Hari Ini'})
              </span>
              <h1 className={styles.headerTitle}>Misi Harian Petualang</h1>
            </div>

            <div className={styles.headerRight}>
              <div className={styles.timerCapsule} title="Waktu Tersisa Sebelum Reset Harian">
                <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#0284c7' }}>
                  schedule
                </span>
                <span>24 Jam</span>
              </div>
            </div>
          </header>

          {/* Quests List */}
          <div className={styles.questsList}>
            {dailyQuests.map((quest) => {
              const theme = getCategoryTheme(quest.category);
              const percent = Math.min(100, Math.round((quest.currentCount / quest.targetCount) * 100));

              return (
                <div
                  key={quest.id}
                  className={`${styles.questCard} ${quest.completed ? styles.questCardCompleted : ''}`}
                >
                  {/* Top Row: Icon, Title, Rewards */}
                  <div className={styles.questTopRow}>
                    <div className={styles.questInfoGroup}>
                      <div className={`${styles.questIconBox} ${theme.iconClass}`}>
                        <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
                          {quest.icon}
                        </span>
                      </div>

                      <div className={styles.questDetails}>
                        <span className={styles.questCategoryPill}>{theme.label}</span>
                        <h3 className={styles.questCardTitle}>{quest.title}</h3>
                        <p className={styles.questCardDesc}>{quest.description}</p>
                      </div>
                    </div>

                    <div className={styles.rewardBadgesGroup}>
                      <span className={styles.xpBadge}>+{quest.rewardXp} XP</span>
                      {quest.rewardCoins && (
                        <span className={styles.coinBadge}>+{quest.rewardCoins} 🪙</span>
                      )}
                    </div>
                  </div>

                  {/* Progress Row */}
                  <div className={styles.questProgressRow}>
                    <div className={styles.questProgressTrack}>
                      <div
                        className={`${styles.questProgressFill} ${theme.fillClass}`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className={styles.questCounterText}>
                      {quest.currentCount} / {quest.targetCount}
                    </span>
                  </div>

                  {/* Actions Row */}
                  <div className={styles.questActionRow}>
                    {quest.completed && !quest.claimed && (
                      <button
                        onClick={() => claimDailyQuestReward(quest.id)}
                        className={styles.claimRewardBtn}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '17px' }}>
                          redeem
                        </span>
                        <span>Klaim Hadiah (+{quest.rewardXp} XP) ✨</span>
                      </button>
                    )}

                    {quest.claimed && (
                      <div className={styles.claimedBadge}>
                        <span className="material-symbols-outlined" style={{ fontSize: '17px' }}>
                          check_circle
                        </span>
                        <span>Hadiah Sudah Diklaim</span>
                      </div>
                    )}

                    {!quest.completed && (
                      <Link to={theme.dest} className={styles.startQuestBtn}>
                        <span>Mulai Misi</span>
                        <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                          arrow_forward
                        </span>
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>

      <BottomNavDock />
    </div>
  );
}
