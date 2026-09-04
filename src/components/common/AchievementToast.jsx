import React from 'react';
import { useGame } from '../../context/GameContext';

export default function AchievementToast() {
  const { toastMessage } = useGame();

  if (!toastMessage) return null;

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '100px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 90,
        backgroundColor: 'var(--color-text-main)',
        color: 'var(--color-surface-bright)',
        padding: '10px 20px',
        borderRadius: 'var(--radius-full)',
        boxShadow: '0 8px 24px rgba(18, 26, 52, 0.25)',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        fontWeight: 700,
        pointerEvents: 'none',
        animation: 'popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'var(--color-secondary-fixed)' }}>
        check_circle
      </span>
      <span>{toastMessage}</span>
    </div>
  );
}
