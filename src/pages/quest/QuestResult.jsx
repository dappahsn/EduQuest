import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import GameHeader from '../../components/navigation/GameHeader';
import BottomNavDock from '../../components/navigation/BottomNavDock';
import CharacterAvatar from '../../components/character/CharacterAvatar';
import { getLevelProgress } from '../../lib/progression';

export default function QuestResult() {
  const navigate = useNavigate();
  const { xp, coins, streakDays, level, characterConfig } = useGame();
  const progress = getLevelProgress(xp);

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
        {/* Celebration Sunburst & Confetti Stage */}
        <div
          className="animate-pop-in"
          style={{
            position: 'relative',
            width: '100%',
            overflow: 'hidden',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(180deg, var(--color-primary-fixed) 0%, var(--color-surface-container-high) 50%, var(--color-surface-container) 100%)',
            padding: 'var(--space-md)',
            boxShadow: 'var(--shadow-card)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          {/* Ambient Glows */}
          <div style={{
            position: 'absolute',
            top: '-40px',
            width: '240px',
            height: '240px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-secondary-container)',
            opacity: 0.4,
            filter: 'blur(50px)',
            pointerEvents: 'none'
          }} />

          {/* Confetti SVG */}
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}>
            <circle cx="15%" cy="18%" fill="#c05400" opacity="0.8" r="5" />
            <polygon fill="#6cf8bb" opacity="0.9" points="40,30 46,38 34,38" />
            <rect fill="#007bb9" height="8" opacity="0.75" rx="2" width="8" x="80%" y="15%" />
            <circle cx="88%" cy="32%" fill="#c05400" opacity="0.7" r="4" />
            <polygon fill="#ffb690" opacity="0.85" points="85,90 92,95 85,100" />
            <circle cx="22%" cy="85%" fill="#007bb9" opacity="0.8" r="6" />
          </svg>

          {/* Celebration Crown Badge */}
          <div style={{
            position: 'relative',
            zIndex: 10,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'var(--color-tertiary-container)',
            color: 'var(--color-on-tertiary-container)',
            padding: '4px 16px',
            borderRadius: 'var(--radius-full)',
            fontSize: '11px',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            boxShadow: 'var(--shadow-tactile-tertiary)'
          }}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>stars</span>
            <span>Hore! Misi Berhasil Dituntaskan</span>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>stars</span>
          </div>

          {/* Dynamic Banner */}
          <div style={{ position: 'relative', zIndex: 10, marginTop: 'var(--space-xs)' }}>
            <h1 style={{ fontSize: '26px', fontWeight: 900, color: 'var(--color-primary)', margin: 0, letterSpacing: '-0.02em' }}>
              MISI SELESAI!
            </h1>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'var(--color-secondary)',
              color: 'var(--color-on-secondary)',
              padding: '4px 16px',
              borderRadius: 'var(--radius-full)',
              marginTop: '4px',
              boxShadow: 'var(--shadow-tactile-secondary)'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>military_tech</span>
              <span style={{ fontSize: '15px', fontWeight: 800 }}>TINGKAT LEVEL {level}!</span>
            </div>
          </div>

          {/* Burst Open Chest Centerpiece with Sparkle Flare */}
          <div style={{
            position: 'relative',
            zIndex: 10,
            margin: 'var(--space-sm) 0',
            width: '180px',
            height: '140px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Sparkle ambient flare */}
            <div
              className="animate-sparkle"
              style={{
                position: 'absolute',
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(255, 215, 0, 0.45) 0%, rgba(255,255,255,0) 70%)',
                pointerEvents: 'none'
              }}
            />

            <div
              className="animate-celebrate-pop"
              style={{
                width: '110px',
                height: '110px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-secondary-container)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 12px 28px rgba(0, 108, 73, 0.35)',
                fontSize: '64px'
              }}
            >
              🎁
            </div>

            {/* Ribbon tag */}
            <div style={{
              position: 'absolute',
              bottom: '-6px',
              backgroundColor: 'var(--color-surface-container-lowest)',
              color: 'var(--color-primary)',
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              boxShadow: 'var(--shadow-card)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '13px',
              fontWeight: 800
            }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--color-tertiary)', fontSize: '16px' }}>auto_awesome</span>
              <span>Peti Mistis Terbuka</span>
            </div>
          </div>

          {/* Raka Companion Speech Bubble */}
          <div style={{
            position: 'relative',
            zIndex: 10,
            width: '100%',
            backgroundColor: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(6px)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-sm)',
            boxShadow: 'var(--shadow-card)',
            display: 'flex',
            alignItems: 'center',
            gap: 'var(--space-sm)',
            marginTop: '8px'
          }}>
            <div style={{ position: 'relative' }}>
              <CharacterAvatar config={characterConfig} size="sm" />
              <span style={{
                position: 'absolute',
                bottom: '-2px',
                right: '-2px',
                backgroundColor: 'var(--color-secondary)',
                color: '#fff',
                borderRadius: '50%',
                width: '16px',
                height: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '11px'
              }}>
                ✓
              </span>
            </div>
            <div style={{ textAlign: 'left', minWidth: 0, flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-primary)' }}>Raka si Penjelajah</span>
                <span style={{
                  fontSize: '10px',
                  fontWeight: 800,
                  backgroundColor: 'var(--color-tertiary-fixed)',
                  color: 'var(--color-on-tertiary-fixed)',
                  padding: '1px 6px',
                  borderRadius: 'var(--radius-full)'
                }}>
                  Teman Misi
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'var(--color-text-main)', margin: '2px 0 0' }}>
                "Luar biasa! Pengetahuanmu semakin tajam hari ini!"
              </p>
            </div>
          </div>
        </div>

        {/* 3 Metric Badges */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-xs)' }}>
          <div
            className="interactive-card"
            style={{
              backgroundColor: 'var(--color-surface-container-low)',
              padding: 'var(--space-sm)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              boxShadow: 'var(--shadow-card)'
            }}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-primary-fixed)',
              color: 'var(--color-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '4px'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>star</span>
            </div>
            <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-primary)' }}>+150 XP</span>
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Skor Misi</span>
          </div>

          <div
            className="interactive-card"
            style={{
              backgroundColor: 'var(--color-surface-container-low)',
              padding: 'var(--space-sm)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              boxShadow: 'var(--shadow-card)'
            }}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-secondary-fixed)',
              color: 'var(--color-secondary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '4px'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>diamond</span>
            </div>
            <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-secondary)' }}>+40 Koin</span>
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Kristal Ajaib</span>
          </div>

          <div
            className="interactive-card"
            style={{
              backgroundColor: 'var(--color-surface-container-low)',
              padding: 'var(--space-sm)',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              boxShadow: 'var(--shadow-card)'
            }}
          >
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-tertiary-fixed)',
              color: 'var(--color-tertiary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '4px'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>local_fire_department</span>
            </div>
            <span style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-tertiary)' }}>{streakDays} Hari</span>
            <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Rentetan Api</span>
          </div>
        </div>

        {/* Level Progress Card */}
        <div style={{
          backgroundColor: 'var(--color-surface-container-lowest)',
          padding: 'var(--space-md)',
          borderRadius: 'var(--radius-md)',
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)' }}>trending_up</span>
              Perjalanan ke Level {progress.nextLevel}
            </span>
            <span style={{ fontSize: '16px', fontWeight: 900, color: 'var(--color-primary)' }}>
              {progress.percentage}%
            </span>
          </div>

          <div style={{
            width: '100%',
            height: '14px',
            backgroundColor: 'var(--color-surface-container)',
            borderRadius: 'var(--radius-full)',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              backgroundColor: 'var(--color-secondary-container)',
              width: `${progress.percentage}%`,
              transition: 'width 0.5s ease'
            }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 700 }}>
            <span>{progress.xpInCurrentLevel.toLocaleString()} XP didapat</span>
            <span>Butuh {progress.remainingXp.toLocaleString()} XP lagi</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <Link
            to="/world"
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-on-primary)',
              borderRadius: 'var(--radius-full)',
              fontWeight: 800,
              fontSize: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              textDecoration: 'none',
              boxShadow: 'var(--shadow-tactile-primary)'
            }}
          >
            <span>Lanjut Petualangan!</span>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_forward</span>
          </Link>

          <Link
            to="/collection"
            style={{
              width: '100%',
              padding: '12px',
              backgroundColor: 'var(--color-surface-container-high)',
              color: 'var(--color-text-main)',
              borderRadius: 'var(--radius-full)',
              fontWeight: 800,
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              textDecoration: 'none'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>backpack</span>
            <span>Lihat Hadiah di Koleksi</span>
          </Link>
        </div>
      </main>

      <BottomNavDock />
    </div>
  );
}
