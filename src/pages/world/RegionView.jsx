import React from 'react';
import { useParams, Link } from 'react-router-dom';
import GameHeader from '../../components/navigation/GameHeader';
import BottomNavDock from '../../components/navigation/BottomNavDock';
import CharacterAvatar from '../../components/character/CharacterAvatar';
import { useGame } from '../../context/GameContext';

import { REGION_QUESTS, isQuestDone } from '../../data/worldData';

export default function RegionView() {
  const { regionId } = useParams();
  const { characterConfig, completedQuestIds = [] } = useGame();

  const rawQuests = REGION_QUESTS[regionId] || REGION_QUESTS['lembah-angka'];
  const quests = rawQuests.map((q, idx) => {
    // Strict sequential unlocking: a quest unlocks only if ALL preceding quests in this region are completed!
    const allPrecedingCompleted = rawQuests.slice(0, idx).every(prevQ => isQuestDone(prevQ.id, completedQuestIds));
    // A quest CANNOT be active or completed if any preceding quest is NOT completed!
    const isLocked = !allPrecedingCompleted;
    const isCompleted = allPrecedingCompleted && isQuestDone(q.id, completedQuestIds);
    const isActive = allPrecedingCompleted && !isCompleted;
    return {
      ...q,
      completed: isCompleted,
      active: isActive,
      locked: isLocked
    };
  });

  const isForest = regionId === 'hutan-sains';
  const regionTitle = isForest ? 'HUTAN SAINS' : regionId ? regionId.replace('-', ' ').toUpperCase() : 'LEMBAH ANGKA';

  return (
    <div style={{
      minHeight: '100vh',
      background: isForest
        ? 'radial-gradient(ellipse at 50% 10%, #d1fae5 0%, #ecfdf5 45%, #f0fdf4 100%)'
        : 'var(--color-surface)',
      paddingTop: '80px',
      paddingBottom: '96px',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    }}>
      {/* Subtle floating ambient forest particles */}
      {isForest && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '380px',
            background: 'radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.22) 0%, rgba(5, 150, 105, 0.08) 50%, transparent 80%)',
            pointerEvents: 'none',
            zIndex: 0
          }}
        />
      )}

      <GameHeader />

      <main style={{
        maxWidth: '520px',
        width: '100%',
        margin: '0 auto',
        padding: '0 var(--space-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-md)',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Breadcrumb back */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link
            to="/world"
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: isForest ? '#ffffff' : 'var(--color-surface-container-high)',
              border: isForest ? '1.5px solid #a7f3d0' : 'none',
              boxShadow: isForest ? '0 2px 8px rgba(16, 185, 129, 0.15)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isForest ? '#047857' : 'var(--color-text-main)',
              textDecoration: 'none'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_back</span>
          </Link>
          <div>
            <span style={{
              fontSize: '11px',
              fontWeight: 800,
              color: isForest ? '#059669' : 'var(--color-primary)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {isForest ? '🌿 PETA HUTAN ALAM' : 'Peta Pulau'}
            </span>
            <h1 style={{
              fontSize: '20px',
              fontWeight: 900,
              color: isForest ? '#064e3b' : 'var(--color-text-main)',
              margin: 0
            }}>
              {regionTitle}
            </h1>
          </div>
        </div>

        {/* Forest Hero Canopy Banner */}
        {isForest && (
          <div style={{
            background: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)',
            borderRadius: '24px',
            padding: '20px',
            color: '#ffffff',
            boxShadow: '0 12px 32px rgba(6, 78, 59, 0.35)',
            position: 'relative',
            overflow: 'hidden',
            border: '1.5px solid rgba(52, 211, 153, 0.35)'
          }}>
            {/* Ambient Leaf Motif */}
            <div style={{
              position: 'absolute',
              top: '-30px',
              right: '-15px',
              fontSize: '85px',
              opacity: 0.16,
              userSelect: 'none',
              pointerEvents: 'none'
            }}>
              🌿
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span style={{
                backgroundColor: 'rgba(52, 211, 153, 0.25)',
                border: '1px solid #34d399',
                color: '#a7f3d0',
                fontSize: '10px',
                fontWeight: 900,
                padding: '3px 10px',
                borderRadius: '9999px',
                letterSpacing: '0.5px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <span>🌿</span>
                <span>WILAYAH 02 • TINGKAT 3</span>
              </span>
              <span style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                fontSize: '10px',
                fontWeight: 800,
                padding: '3px 10px',
                borderRadius: '9999px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <span>🔬</span>
                <span>SAINS & BIOLOGI</span>
              </span>
            </div>

            <h2 style={{ fontSize: '20px', fontWeight: 900, margin: '0 0 6px 0', color: '#f0fdf4' }}>
              Rimba Hutan Sains & Flora
            </h2>
            <p style={{ fontSize: '12.5px', color: '#d1fae5', margin: 0, lineHeight: 1.5 }}>
              Selamat datang di kanopi rimba hijau! Ungkap misteri fotosintesis klorofil daun, siklus kupu-kupu, dan rahasia tanaman langka Nusantara.
            </p>
          </div>
        )}

        {/* Stepping-Stone Trail List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          {quests.map((q) => (
            <div
              key={q.id}
              className={q.locked ? '' : 'interactive-card'}
              style={{
                backgroundColor: q.locked
                  ? isForest
                    ? 'rgba(236, 253, 245, 0.65)'
                    : 'var(--color-surface-container-high)'
                  : isForest
                    ? 'linear-gradient(180deg, #ffffff 0%, #f0fdf4 100%)'
                    : 'var(--color-surface-container-lowest)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-sm) var(--space-md)',
                boxShadow: q.active
                  ? isForest
                    ? '0 10px 28px rgba(16, 185, 129, 0.22)'
                    : '0 8px 24px rgba(0, 97, 148, 0.2)'
                  : isForest
                    ? '0 4px 14px rgba(16, 185, 129, 0.08)'
                    : 'var(--shadow-card)',
                border: q.active
                  ? isForest
                    ? '2px solid #10b981'
                    : '2px solid var(--color-primary)'
                  : isForest
                    ? '1.5px solid #a7f3d0'
                    : '2px solid var(--color-outline-subtle)',
                opacity: q.locked ? 0.65 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-md)',
                position: 'relative'
              }}
            >
              {/* Stepping stone icon / pin */}
              <div style={{
                width: '58px',
                height: '58px',
                borderRadius: 'var(--radius-md)',
                background: q.completed 
                  ? isForest ? '#ecfdf5' : 'rgba(16, 185, 129, 0.12)' 
                  : q.active 
                    ? isForest
                      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                      : 'var(--color-primary-container)' 
                    : isForest ? 'rgba(209, 250, 229, 0.4)' : 'var(--color-surface-variant)',
                border: q.completed
                  ? '1.5px solid #10b981'
                  : q.active
                    ? isForest ? '2px solid #34d399' : '2px solid var(--color-primary)'
                    : isForest ? '1.5px solid #cbd5e1' : '1.5px solid var(--color-outline-subtle)',
                color: q.completed 
                  ? '#047857' 
                  : q.active 
                    ? isForest ? '#ffffff' : 'var(--color-on-primary-container)' 
                    : 'var(--color-outline)',
                boxShadow: q.active && isForest ? '0 4px 14px rgba(16, 185, 129, 0.45)' : 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                flexShrink: 0,
                position: 'relative'
              }}>
                <span style={{ 
                  fontSize: '10px', 
                  fontWeight: 800, 
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  lineHeight: 1,
                  opacity: q.locked ? 0.6 : 0.9
                }}>
                  {q.isBoss ? 'BOS' : 'MISI'}
                </span>
                <span style={{ 
                  fontSize: '20px', 
                  fontWeight: 900, 
                  lineHeight: 1.1,
                  marginTop: '2px'
                }}>
                  {q.number}
                </span>

                {/* Status indicator pin */}
                {q.completed && (
                  <div style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: '#10b981',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(16, 185, 129, 0.4)'
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '14px', fontWeight: 900 }}>check</span>
                  </div>
                )}
                {q.locked && (
                  <div style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '-6px',
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: '#94a3b8',
                    color: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>lock</span>
                  </div>
                )}
              </div>

              {/* Quest Details */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ 
                    fontSize: '11px', 
                    fontWeight: 800, 
                    color: q.completed 
                      ? '#047857' 
                      : q.active 
                        ? isForest ? '#059669' : 'var(--color-primary)' 
                        : 'var(--color-text-muted)' 
                  }}>
                    Misi {q.number} • {q.completed ? 'Selesai' : q.active ? 'Misi Aktif' : q.isBoss ? 'Terkunci (Bos Wilayah)' : 'Terkunci'}
                  </span>
                  {q.completed && (
                    <span style={{ fontSize: '12px', color: '#ffb690' }}>
                      {'⭐'.repeat(q.stars)}
                    </span>
                  )}
                  {q.active && (
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      backgroundColor: isForest ? '#d1fae5' : 'var(--color-secondary-container)',
                      color: isForest ? '#065f46' : 'var(--color-on-secondary-container)',
                      border: isForest ? '1px solid #a7f3d0' : 'none',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)'
                    }}>
                      +{q.xp} XP
                    </span>
                  )}
                </div>

                <h3 style={{
                  fontSize: '15px',
                  fontWeight: 800,
                  color: isForest ? '#064e3b' : 'var(--color-text-main)',
                  margin: '2px 0'
                }}>
                  {q.title}
                </h3>
                <p style={{
                  fontSize: '12px',
                  color: isForest ? '#047857' : 'var(--color-text-muted)',
                  margin: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  {q.desc}
                </p>

                {q.active && (
                  <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Link
                      to={`/game/${q.gameId}?questId=${q.id}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        background: isForest
                          ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                          : 'var(--color-primary)',
                        color: '#ffffff',
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '12px',
                        fontWeight: 800,
                        textDecoration: 'none',
                        boxShadow: isForest
                          ? '0 4px 14px rgba(16, 185, 129, 0.45)'
                          : 'var(--shadow-tactile-primary)'
                      }}
                    >
                      <span>Masuk Misi</span>
                      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_forward</span>
                    </Link>
                    <Link
                      to={`/quest/${q.id}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        backgroundColor: isForest ? '#d1fae5' : 'var(--color-surface-container-high)',
                        border: isForest ? '1px solid #a7f3d0' : 'none',
                        color: isForest ? '#065f46' : 'var(--color-primary)',
                        padding: '5px 10px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '11px',
                        fontWeight: 800,
                        textDecoration: 'none'
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>info</span>
                      <span>Info</span>
                    </Link>
                  </div>
                )}

                {q.completed && (
                  <div style={{ marginTop: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Link
                      to={`/game/${q.gameId}?questId=${q.id}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        backgroundColor: isForest ? '#d1fae5' : 'var(--color-surface-container-high)',
                        border: isForest ? '1px solid #a7f3d0' : 'none',
                        color: isForest ? '#065f46' : 'var(--color-primary)',
                        padding: '4px 10px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '11px',
                        fontWeight: 800,
                        textDecoration: 'none'
                      }}
                    >
                      <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>replay</span>
                      <span>Ulangi Misi</span>
                    </Link>
                    <Link
                      to={`/quest/${q.id}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '3px',
                        color: 'var(--color-text-muted)',
                        padding: '4px 6px',
                        fontSize: '11px',
                        fontWeight: 700,
                        textDecoration: 'none'
                      }}
                    >
                      <span>Detail</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      <BottomNavDock />
    </div>
  );
}
