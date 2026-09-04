import React from 'react';
import { useNavigate } from 'react-router-dom';
import CharacterAvatar from '../../components/character/CharacterAvatar';
import { useGame } from '../../context/GameContext';

export default function OnboardingIntro() {
  const navigate = useNavigate();
  const { playerName, characterConfig } = useGame();

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--color-surface)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-md)'
    }}>
      <div style={{
        maxWidth: '440px',
        width: '100%',
        backgroundColor: 'var(--color-surface-bright)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-lg) var(--space-md)',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 'var(--space-sm)',
        border: '2px solid var(--color-secondary-container)'
      }}>
        {/* Step pill */}
        <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-secondary)', textTransform: 'uppercase' }}>
          Langkah 2 dari 2 • Mulai Petualangan
        </span>

        {/* Mascot Greeting */}
        <div style={{ position: 'relative', margin: 'var(--space-xs) 0' }}>
          <CharacterAvatar config={characterConfig} size="lg" animate={true} />
          <span style={{
            position: 'absolute',
            bottom: '-4px',
            right: '-4px',
            backgroundColor: 'var(--color-secondary)',
            color: '#fff',
            borderRadius: '50%',
            padding: '2px 6px',
            fontSize: '12px'
          }}>
            👋
          </span>
        </div>

        <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-text-main)', margin: 0 }}>
          "Halo {playerName}! Selamat Datang di EduQuest!"
        </h1>

        <p style={{ fontSize: '14px', lineHeight: 1.5, color: 'var(--color-text-muted)', margin: 0 }}>
          Di Benua EduQuest, ada <strong>5 Kepulauan Misterius</strong> yang menantimu.
          Setiap teka-teki yang kamu pecahkan akan memberimu kristal permata dan membuka hewan sahabat!
        </p>

        {/* Interactive Quick Step Card */}
        <div style={{
          backgroundColor: 'var(--color-surface-container-low)',
          borderRadius: 'var(--radius-md)',
          padding: 'var(--space-sm)',
          width: '100%',
          textAlign: 'left',
          display: 'flex',
          alignItems: 'center',
          gap: '10px'
        }}>
          <div style={{
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'var(--color-primary-fixed)',
            color: 'var(--color-primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '20px',
            flexShrink: 0
          }}>
            🎯
          </div>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
              Misi Pertamamu:
            </span>
            <p style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-text-main)', margin: 0 }}>
              Taklukkan Jembatan Perkalian di Lembah Angka!
            </p>
          </div>
        </div>

        {/* Direct Play Button (Child goes straight to game) */}
        <button
          onClick={() => navigate('/game/mini-nc')}
          style={{
            width: '100%',
            marginTop: 'var(--space-sm)',
            padding: '14px',
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-on-primary)',
            borderRadius: 'var(--radius-full)',
            fontWeight: 800,
            fontSize: '16px',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: 'var(--shadow-tactile-primary)'
          }}
        >
          <span>Mulai Main Sekarang!</span>
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>sports_esports</span>
        </button>

        {/* Or explore map first */}
        <button
          onClick={() => navigate('/world')}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--color-text-muted)',
            fontSize: '12px',
            fontWeight: 700,
            cursor: 'pointer',
            marginTop: '4px'
          }}
        >
          Lewati dan Lihat Peta Dunia →
        </button>
      </div>
    </div>
  );
}
