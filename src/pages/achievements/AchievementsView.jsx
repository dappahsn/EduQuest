import React from 'react';
import { useGame } from '../../context/GameContext';
import GameHeader from '../../components/navigation/GameHeader';
import BottomNavDock from '../../components/navigation/BottomNavDock';
import { checkAchievementsProgress } from '../../lib/achievements';

export default function AchievementsView() {
  const game = useGame();
  const achievements = checkAchievementsProgress(game);

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--color-surface)',
      paddingTop: '80px',
      paddingBottom: '96px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <GameHeader />

      <main style={{
        maxWidth: '520px',
        width: '100%',
        margin: '0 auto',
        padding: '0 var(--space-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-md)'
      }}>
        {/* Top Header Card */}
        <div style={{
          backgroundColor: 'var(--color-surface-bright)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-md)',
          boxShadow: 'var(--shadow-card)',
          border: '2px solid var(--color-primary-fixed)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <div style={{
              width: '54px',
              height: '54px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-tertiary-fixed)',
              color: 'var(--color-tertiary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              boxShadow: '0 4px 12px rgba(153, 65, 0, 0.2)'
            }}>
              🏆
            </div>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                Lencana Kehormatan
              </span>
              <h1 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text-main)', margin: 0 }}>
                Prestasi Petualang
              </h1>
              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: '2px 0 0' }}>
                {unlockedCount} dari {achievements.length} Prestasi Terbuka
              </p>
            </div>
          </div>

          <div style={{
            backgroundColor: 'var(--color-secondary-container)',
            color: 'var(--color-on-secondary-container)',
            padding: '6px 12px',
            borderRadius: 'var(--radius-full)',
            fontWeight: 800,
            fontSize: '12px'
          }}>
            {Math.round((unlockedCount / achievements.length) * 100)}%
          </div>
        </div>

        {/* List of 7 Achievements */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          {achievements.map((ach) => {
            const isClaimed = game.claimedAchievements.includes(ach.id);
            const percent = Math.min(100, Math.round((ach.progress / ach.target) * 100));

            return (
              <div
                key={ach.id}
                style={{
                  backgroundColor: 'var(--color-surface-container-lowest)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-md)',
                  boxShadow: 'var(--shadow-card)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  border: ach.unlocked ? '2px solid var(--color-tertiary-fixed)' : '2px solid transparent',
                  opacity: ach.unlocked ? 1 : 0.75
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: ach.unlocked ? 'var(--color-tertiary-fixed)' : 'var(--color-surface-container-high)',
                      color: ach.unlocked ? 'var(--color-tertiary)' : 'var(--color-outline)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>
                        {ach.icon}
                      </span>
                    </div>

                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--color-text-main)', margin: 0 }}>
                          {ach.title}
                        </h3>
                        <span style={{
                          fontSize: '10px',
                          fontWeight: 800,
                          backgroundColor: 'var(--color-surface-container-high)',
                          padding: '1px 6px',
                          borderRadius: 'var(--radius-full)',
                          color: 'var(--color-text-muted)'
                        }}>
                          {ach.tier}
                        </span>
                      </div>
                      <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: '2px 0 0' }}>
                        {ach.description}
                      </p>
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-primary)', display: 'block' }}>
                      +{ach.rewardXp} XP
                    </span>
                    <span style={{ fontSize: '11px', color: 'var(--color-secondary)', fontWeight: 800 }}>
                      +{ach.rewardCoins} 💎
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{
                    flex: 1,
                    height: '8px',
                    backgroundColor: 'var(--color-surface-container)',
                    borderRadius: 'var(--radius-full)',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      height: '100%',
                      backgroundColor: ach.unlocked ? 'var(--color-tertiary)' : 'var(--color-primary)',
                      width: `${percent}%`,
                      transition: 'width 0.4s ease'
                    }} />
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-text-main)' }}>
                    {ach.progress} / {ach.target}
                  </span>
                </div>

                {/* Claim Button */}
                {ach.unlocked && !isClaimed && (
                  <button
                    onClick={() => game.claimAchievementReward(ach.id)}
                    style={{
                      alignSelf: 'flex-end',
                      backgroundColor: 'var(--color-tertiary)',
                      color: 'var(--color-on-tertiary)',
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-full)',
                      border: 'none',
                      fontWeight: 800,
                      fontSize: '12px',
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-tactile-tertiary)',
                      marginTop: '4px'
                    }}
                  >
                    Klaim Hadiah Prestasi 🏆
                  </button>
                )}

                {isClaimed && (
                  <span style={{
                    alignSelf: 'flex-end',
                    fontSize: '11px',
                    fontWeight: 800,
                    color: 'var(--color-secondary)'
                  }}>
                    ✓ Hadiah Sudah Diterima
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </main>

      <BottomNavDock />
    </div>
  );
}
