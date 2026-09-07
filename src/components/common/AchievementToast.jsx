import React from 'react';
import { useGame } from '../../context/GameContext';

export default function AchievementToast() {
  const { toastMessage } = useGame();

  if (!toastMessage) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '72px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 9999,
        backgroundColor: 'rgba(15, 23, 42, 0.94)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        color: '#ffffff',
        padding: '9px 18px',
        borderRadius: '9999px',
        border: '1.5px solid rgba(52, 211, 153, 0.45)',
        boxShadow: '0 12px 32px rgba(0, 0, 0, 0.5), 0 0 16px rgba(16, 185, 129, 0.25)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        fontSize: '12.5px',
        fontWeight: 700,
        maxWidth: 'calc(100vw - 32px)',
        boxSizing: 'border-box',
        textAlign: 'center',
        lineHeight: 1.35,
        pointerEvents: 'none',
        animation: 'toastSlideDown 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards'
      }}
    >
      <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#10b981', flexShrink: 0 }}>
        check_circle
      </span>
      <span style={{ color: '#f8fafc', letterSpacing: '0.01em', wordBreak: 'break-word' }}>
        {toastMessage}
      </span>
    </div>
  );
}
