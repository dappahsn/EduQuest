import React from 'react';
import { useGame } from '../../context/GameContext';
import GameHeader from '../../components/navigation/GameHeader';
import BottomNavDock from '../../components/navigation/BottomNavDock';
import { isAllDailyQuestsCompleted } from '../../lib/dailyQuests';

export default function DailyQuestsView() {
  const {
    dailyQuests,
    dailyQuestsDate,
    dailyChestClaimed,
    claimDailyQuestReward,
    claimDailyChest
  } = useGame();

  const allCompleted = isAllDailyQuestsCompleted(dailyQuests);

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
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
              Reset Harian (UTC: {dailyQuestsDate})
            </span>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-text-main)', margin: 0 }}>
              Misi Harian Petualang
            </h1>
          </div>
          <div style={{
            backgroundColor: 'var(--color-surface-container-high)',
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            fontSize: '12px',
            fontWeight: 800,
            color: 'var(--color-text-main)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--color-tertiary)' }}>timer</span>
            <span>24 Jam</span>
          </div>
        </div>

        {/* Daily Chest Centerpiece Card */}
        <div style={{
          backgroundColor: 'var(--color-surface-bright)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-md)',
          boxShadow: 'var(--shadow-card)',
          border: '2px solid var(--color-primary-fixed)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          overflow: 'hidden'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <div
              className={allCompleted && !dailyChestClaimed ? 'animate-chest-wobble' : ''}
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: allCompleted ? 'var(--color-secondary-container)' : 'var(--color-surface-container-high)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '34px',
                boxShadow: allCompleted && !dailyChestClaimed ? '0 0 24px rgba(16, 185, 129, 0.5)' : 'none',
                transition: 'box-shadow 0.3s ease'
              }}
            >
              {dailyChestClaimed ? '✨' : '🎁'}
            </div>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-tertiary-container)', textTransform: 'uppercase' }}>
                Hadiah Utama Harian
              </span>
              <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-text-main)', margin: '2px 0 0' }}>
                {dailyChestClaimed ? 'Peti Harian Sudah Dibuka' : allCompleted ? 'Peti Siap Dibuka! ✨' : 'Peti Mistis Harian'}
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: '2px 0 0' }}>
                {dailyChestClaimed ? 'Kembali lagi besok untuk hadiah baru!' : 'Selesaikan ketiga misi harian untuk membuka.'}
              </p>
            </div>
          </div>

          {!dailyChestClaimed && allCompleted && (
            <button
              onClick={claimDailyChest}
              className="animate-celebrate-pop"
              style={{
                backgroundColor: 'var(--color-secondary)',
                color: 'var(--color-on-secondary)',
                border: 'none',
                padding: '10px 18px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 800,
                fontSize: '13px',
                cursor: 'pointer',
                boxShadow: 'var(--shadow-tactile-secondary)'
              }}
            >
              Buka Peti! 🎁
            </button>
          )}
        </div>

        {/* 3 Daily Quest Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          {dailyQuests.map((quest) => {
            const percent = Math.min(100, Math.round((quest.currentCount / quest.targetCount) * 100));
            return (
              <div
                key={quest.id}
                style={{
                  backgroundColor: 'var(--color-surface-container-lowest)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--space-md)',
                  boxShadow: 'var(--shadow-card)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px',
                  border: quest.completed ? '2px solid var(--color-secondary-container)' : '2px solid transparent'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--color-primary-fixed)',
                      color: 'var(--color-primary)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>{quest.icon}</span>
                    </div>
                    <div>
                      <h4 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--color-text-main)', margin: 0 }}>
                        {quest.title}
                      </h4>
                      <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>
                        {quest.description}
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 800, color: 'var(--color-primary)' }}>
                    <span>+{quest.rewardXp} XP</span>
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
                      backgroundColor: quest.completed ? 'var(--color-secondary)' : 'var(--color-primary)',
                      width: `${percent}%`,
                      transition: 'width 0.4s ease'
                    }} />
                  </div>
                  <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-text-main)' }}>
                    {quest.currentCount} / {quest.targetCount}
                  </span>
                </div>

                {/* Claim Button */}
                {quest.completed && !quest.claimed && (
                  <button
                    onClick={() => claimDailyQuestReward(quest.id)}
                    style={{
                      alignSelf: 'flex-end',
                      backgroundColor: 'var(--color-tertiary)',
                      color: 'var(--color-on-tertiary)',
                      padding: '6px 14px',
                      borderRadius: 'var(--radius-full)',
                      border: 'none',
                      fontSize: '12px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: 'var(--shadow-tactile-tertiary)',
                      marginTop: '4px'
                    }}
                  >
                    Klaim Hadiah (+{quest.rewardXp} XP) ✨
                  </button>
                )}

                {quest.claimed && (
                  <span style={{
                    alignSelf: 'flex-end',
                    fontSize: '12px',
                    fontWeight: 700,
                    color: 'var(--color-secondary)'
                  }}>
                    ✓ Hadiah Sudah Diklaim
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
