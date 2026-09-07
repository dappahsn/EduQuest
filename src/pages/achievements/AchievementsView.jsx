import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import GameHeader from '../../components/navigation/GameHeader';
import BottomNavDock from '../../components/navigation/BottomNavDock';
import { checkAchievementsProgress } from '../../lib/achievements';
import styles from './AchievementsView.module.css';

export default function AchievementsView() {
  const game = useGame();
  const achievements = checkAchievementsProgress(game);

  const [activeFilter, setActiveFilter] = useState('all');

  const totalCount = achievements.length;
  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const overallPercent = Math.min(100, Math.round((unlockedCount / totalCount) * 100));

  // Tier statistics
  const bronzeTotal = achievements.filter((a) => a.tier === 'Perunggu').length;
  const bronzeDone = achievements.filter((a) => a.tier === 'Perunggu' && a.unlocked).length;

  const silverTotal = achievements.filter((a) => a.tier === 'Perak').length;
  const silverDone = achievements.filter((a) => a.tier === 'Perak' && a.unlocked).length;

  const goldTotal = achievements.filter((a) => a.tier === 'Emas').length;
  const goldDone = achievements.filter((a) => a.tier === 'Emas' && a.unlocked).length;

  // Filtered list
  const filteredAchievements = achievements.filter((a) => {
    if (activeFilter === 'unlocked') return a.unlocked;
    if (activeFilter === 'locked') return !a.unlocked;
    return true;
  });

  const getTierIconClass = (tier, unlocked) => {
    if (!unlocked) return styles.iconLocked;
    if (tier === 'Emas') return styles.iconGold;
    if (tier === 'Perak') return styles.iconSilver;
    return styles.iconBronze;
  };

  const getTierTagClass = (tier) => {
    if (tier === 'Emas') return styles.tierTagGold;
    if (tier === 'Perak') return styles.tierTagSilver;
    return styles.tierTagBronze;
  };

  return (
    <div className={styles.container}>
      <GameHeader />

      <main className={styles.main}>
        {/* =======================================================
            LEFT COLUMN: TROPHY SHOWCASE & STATS (Desktop Sticky)
            ======================================================= */}
        <aside className={styles.leftColumn}>
          {/* Main Hero Card */}
          <div className={styles.heroCard}>
            <div className={styles.heroAmbientAura} />

            <div className={styles.trophyCircle}>
              🏆
            </div>

            <span className={styles.honorBadgeTag}>
              Lencana Kehormatan
            </span>

            <h2 className={styles.heroTitle}>
              Prestasi Petualang
            </h2>

            <p className={styles.heroDesc}>
              Kumpulkan seluruh lencana kehormatan untuk membuktikan kehebatanmu dan meraih gelar Legenda EduQuest!
            </p>

            {/* Overall Progress Bar */}
            <div className={styles.heroProgressBarContainer}>
              <div className={styles.heroProgressLabel}>
                <span>Kemajuan Koleksi</span>
                <span>{unlockedCount} dari {totalCount} Terbuka ({overallPercent}%)</span>
              </div>
              <div className={styles.heroProgressTrack}>
                <div
                  className={styles.heroProgressFill}
                  style={{ width: `${overallPercent}%` }}
                />
              </div>
            </div>

            {/* Tier Stats Breakdown */}
            <div className={styles.tierStatsGrid}>
              <div className={styles.tierStatItem}>
                <span className={styles.tierStatIcon}>🥉</span>
                <span className={styles.tierStatName}>Perunggu</span>
                <span className={styles.tierStatCount}>{bronzeDone}/{bronzeTotal}</span>
              </div>
              <div className={styles.tierStatItem}>
                <span className={styles.tierStatIcon}>🥈</span>
                <span className={styles.tierStatName}>Perak</span>
                <span className={styles.tierStatCount}>{silverDone}/{silverTotal}</span>
              </div>
              <div className={styles.tierStatItem}>
                <span className={styles.tierStatIcon}>🥇</span>
                <span className={styles.tierStatName}>Emas</span>
                <span className={styles.tierStatCount}>{goldDone}/{goldTotal}</span>
              </div>
            </div>

            {/* Total Potential Rewards Showcase */}
            <div className={styles.rewardsShowcaseBox}>
              <div className={styles.rewardTotalItem} title="Total Poin Pengalaman">
                <span>🌟</span>
                <span>+1,630 XP Total</span>
              </div>
              <div className={styles.rewardTotalItem} title="Total Permata EduQuest">
                <span>💎</span>
                <span>+370 Permata</span>
              </div>
            </div>
          </div>

          {/* Guide & Exploration Quick Card */}
          <div className={styles.guideCard}>
            <div className={styles.guideHeader}>
              <h3 className={styles.guideTitle}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#f59e0b' }}>
                  auto_awesome
                </span>
                Tips Penakluk Prestasi
              </h3>
            </div>

            <p className={styles.guideText}>
              Jelajahi setiap planet, selesaikan mini game angka, dan bangun kebiasaan belajar harian untuk membuka seluruh lencana!
            </p>

            <Link to="/world" className={styles.guideActionBtn}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                travel_explore
              </span>
              <span>Jelajahi Peta Galaksi 🪐</span>
            </Link>
          </div>
        </aside>

        {/* =======================================================
            RIGHT COLUMN: HEADER, FILTER TABS & ACHIEVEMENTS LIST
            ======================================================= */}
        <section className={styles.rightColumn}>
          {/* Header Bar with Filter Tabs */}
          <header className={styles.pageHeader}>
            <div className={styles.headerLeft}>
              <span className={styles.headerSubtitle}>
                Galeri Pencapaian
              </span>
              <h1 className={styles.headerTitle}>Daftar Prestasi Petualang</h1>
            </div>

            {/* Filter Tabs */}
            <div className={styles.filterTabsGroup}>
              <button
                className={`${styles.filterTabBtn} ${activeFilter === 'all' ? styles.filterTabActive : ''}`}
                onClick={() => setActiveFilter('all')}
              >
                Semua ({totalCount})
              </button>
              <button
                className={`${styles.filterTabBtn} ${activeFilter === 'unlocked' ? styles.filterTabActive : ''}`}
                onClick={() => setActiveFilter('unlocked')}
              >
                Terbuka ({unlockedCount})
              </button>
              <button
                className={`${styles.filterTabBtn} ${activeFilter === 'locked' ? styles.filterTabActive : ''}`}
                onClick={() => setActiveFilter('locked')}
              >
                Belum ({totalCount - unlockedCount})
              </button>
            </div>
          </header>

          {/* Achievements List */}
          <div className={styles.achievementsList}>
            {filteredAchievements.map((ach) => {
              const isClaimed = game.claimedAchievements.includes(ach.id);
              const percent = Math.min(100, Math.round((ach.progress / ach.target) * 100));

              return (
                <div
                  key={ach.id}
                  className={`${styles.achievementCard} ${ach.unlocked ? styles.achievementCardUnlocked : ''}`}
                  style={{ opacity: ach.unlocked ? 1 : 0.8 }}
                >
                  {/* Top Row: Icon, Title, Tier, Rewards */}
                  <div className={styles.achievementTopRow}>
                    <div className={styles.achievementInfoGroup}>
                      <div className={`${styles.achievementIconBox} ${getTierIconClass(ach.tier, ach.unlocked)}`}>
                        <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
                          {ach.icon}
                        </span>
                      </div>

                      <div className={styles.achievementDetails}>
                        <div className={styles.achievementHeaderLine}>
                          <h3 className={styles.achievementCardTitle}>{ach.title}</h3>
                          <span className={`${styles.tierTag} ${getTierTagClass(ach.tier)}`}>
                            {ach.tier}
                          </span>
                        </div>
                        <p className={styles.achievementCardDesc}>{ach.description}</p>
                      </div>
                    </div>

                    <div className={styles.rewardBadgesGroup}>
                      <span className={styles.xpBadge}>+{ach.rewardXp} XP</span>
                      <span className={styles.diamondBadge}>+{ach.rewardCoins} 💎</span>
                    </div>
                  </div>

                  {/* Progress Row */}
                  <div className={styles.achievementProgressRow}>
                    <div className={styles.achievementProgressTrack}>
                      <div
                        className={styles.achievementProgressFill}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <span className={styles.achievementCounterText}>
                      {ach.progress} / {ach.target}
                    </span>
                  </div>

                  {/* Actions Row */}
                  <div className={styles.achievementActionRow}>
                    {ach.unlocked && !isClaimed && (
                      <button
                        onClick={() => game.claimAchievementReward(ach.id)}
                        className={`animate-celebrate-pop ${styles.claimAchievementBtn}`}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '17px' }}>
                          emoji_events
                        </span>
                        <span>Klaim Hadiah Prestasi 🏆</span>
                      </button>
                    )}

                    {isClaimed && (
                      <div className={styles.claimedBadge}>
                        <span className="material-symbols-outlined" style={{ fontSize: '17px' }}>
                          check_circle
                        </span>
                        <span>Hadiah Sudah Diterima</span>
                      </div>
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
