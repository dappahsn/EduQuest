import React from 'react';
import { useGame } from '../../context/GameContext';

export default function RewardModal() {
  const { rewardModal, setRewardModal } = useGame();

  if (!rewardModal) return null;

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
          boxShadow: '0 20px 40px rgba(0, 108, 73, 0.3)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          border: '3px solid var(--color-secondary-container)'
        }}
      >
        <div
          style={{
            backgroundColor: 'var(--color-secondary)',
            color: 'var(--color-on-secondary)',
            padding: '4px 14px',
            borderRadius: 'var(--radius-full)',
            fontSize: '11px',
            fontWeight: 800,
            textTransform: 'uppercase',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            boxShadow: 'var(--shadow-tactile-secondary)'
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>card_giftcard</span>
          <span>Hadiah Diperoleh</span>
        </div>

        <div
          className="animate-celebrate-pop"
          style={{
            width: '88px',
            height: '88px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-secondary-container)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--color-on-secondary-container)',
            margin: 'var(--space-md) 0 var(--space-xs)',
            boxShadow: '0 8px 24px rgba(0, 108, 73, 0.3)'
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '52px' }}>inventory_2</span>
        </div>

        <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-text-main)', margin: 0 }}>
          {rewardModal.title || 'Peti Berhasil Dibuka!'}
        </h2>

        <div style={{ display: 'flex', gap: 'var(--space-xs)', margin: 'var(--space-md) 0' }}>
          {rewardModal.xp && (
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
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>star</span>
              <span>+{rewardModal.xp} XP</span>
            </div>
          )}
          {rewardModal.coins && (
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
                color: 'var(--color-secondary)'
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>diamond</span>
              <span>+{rewardModal.coins} Koin</span>
            </div>
          )}
        </div>

        <button
          onClick={() => setRewardModal(null)}
          style={{
            width: '100%',
            backgroundColor: 'var(--color-secondary)',
            color: 'var(--color-on-secondary)',
            padding: '12px',
            borderRadius: 'var(--radius-full)',
            fontWeight: 800,
            fontSize: '15px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-tactile-secondary)'
          }}
        >
          Simpan ke Ransel ✨
        </button>
      </div>
    </div>
  );
}
