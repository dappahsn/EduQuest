import React from 'react';
import { useGame } from '../../context/GameContext';

export default function LevelUpModal() {
  const { levelUpModal, setLevelUpModal } = useGame();

  if (!levelUpModal) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        backgroundColor: 'rgba(18, 26, 52, 0.75)',
        backdropFilter: 'blur(8px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--space-md)'
      }}
    >
      <div
        className="animate-pop-in"
        style={{
          width: '100%',
          maxWidth: '380px',
          backgroundColor: 'var(--color-surface-bright)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-lg) var(--space-md)',
          boxShadow: '0 20px 40px rgba(0, 97, 148, 0.35)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          position: 'relative',
          border: '3px solid var(--color-primary-fixed)'
        }}
      >
        {/* Sunburst background flare */}
        <div
          className="animate-sparkle"
          style={{
            position: 'absolute',
            top: '-20px',
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-secondary-container)',
            opacity: 0.45,
            filter: 'blur(30px)',
            pointerEvents: 'none'
          }}
        />

        {/* Crown Badge */}
        <div
          style={{
            backgroundColor: 'var(--color-tertiary-container)',
            color: 'var(--color-on-tertiary-container)',
            padding: '4px 14px',
            borderRadius: 'var(--radius-full)',
            fontSize: '11px',
            fontWeight: 800,
            letterSpacing: '0.04em',
            textTransform: 'uppercase',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            boxShadow: 'var(--shadow-tactile-tertiary)'
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>stars</span>
          <span>Level Up!</span>
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>stars</span>
        </div>

        {/* Big Celebration Trophy / Star */}
        <div
          className="animate-celebrate-pop"
          style={{
            width: '88px',
            height: '88px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-primary-fixed)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-primary)',
            margin: 'var(--space-md) 0 var(--space-xs)',
            boxShadow: '0 8px 24px rgba(0, 97, 148, 0.3)'
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '52px' }}>military_tech</span>
        </div>

        <h2 style={{ fontSize: '24px', fontWeight: 800, color: 'var(--color-primary)', margin: 0 }}>
          NAIK KE LEVEL {levelUpModal.newLevel}!
        </h2>
        <p style={{ fontSize: '14px', color: 'var(--color-text-muted)', margin: 'var(--space-xs) 0 var(--space-md)' }}>
          Hebat sekali! Pengetahuanmu semakin luas dan energimu pulih!
        </p>

        {/* Reward pills */}
        <div style={{ display: 'flex', gap: 'var(--space-xs)', marginBottom: 'var(--space-md)' }}>
          <div
            style={{
              backgroundColor: 'var(--color-surface-container-high)',
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: 800,
              fontSize: '13px',
              color: 'var(--color-primary)'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>diamond</span>
            <span>+50 Koin</span>
          </div>
          <div
            style={{
              backgroundColor: 'var(--color-surface-container-high)',
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontWeight: 800,
              fontSize: '13px',
              color: 'var(--color-error)'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>favorite</span>
            <span>+2 Energi</span>
          </div>
        </div>

        <button
          onClick={() => setLevelUpModal(null)}
          style={{
            width: '100%',
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-on-primary)',
            padding: '12px',
            borderRadius: 'var(--radius-full)',
            fontWeight: 800,
            fontSize: '15px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-tactile-primary)'
          }}
        >
          Lanjut Petualangan! 🚀
        </button>
      </div>
    </div>
  );
}
