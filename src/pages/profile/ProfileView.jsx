import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { useAuth } from '../../hooks/useAuth';
import CharacterAvatar from '../../components/character/CharacterAvatar';
import GameHeader from '../../components/navigation/GameHeader';
import BottomNavDock from '../../components/navigation/BottomNavDock';
import { getLevelProgress } from '../../lib/progression';
import { getPetById } from '../../lib/petsRegistry';

export default function ProfileView() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const {
    playerName,
    xp,
    coins,
    streakDays,
    level,
    characterConfig,
    activePetId,
    completedQuestIds,
    unlockedCardIds
  } = useGame();

  const progress = getLevelProgress(xp);
  const activePet = getPetById(activePetId);

  async function handleLogout() {
    await signOut();
    navigate('/auth/login');
  }

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
        {/* Profile Card Showcase */}
        <div style={{
          backgroundColor: 'var(--color-surface-bright)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-md)',
          boxShadow: 'var(--shadow-card)',
          border: '2px solid var(--color-primary-fixed)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          position: 'relative'
        }}>
          {/* Settings Shortcut */}
          <Link
            to="/settings"
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-surface-container-high)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-text-main)',
              textDecoration: 'none'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>settings</span>
          </Link>

          {/* Avatar */}
          <div style={{ margin: 'var(--space-xs) 0' }}>
            <CharacterAvatar config={characterConfig} size="xl" />
          </div>

          <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-text-main)', margin: '4px 0 0' }}>
            {playerName}
          </h1>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-primary)' }}>
            Penjelajah Bintang • Tingkat Lv. {level}
          </span>

          <Link
            to="/character"
            style={{
              marginTop: '12px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: 'var(--color-primary-container)',
              color: 'var(--color-on-primary-container)',
              padding: '6px 16px',
              borderRadius: 'var(--radius-full)',
              fontSize: '12px',
              fontWeight: 800,
              textDecoration: 'none',
              boxShadow: 'var(--shadow-card)'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>styler</span>
            <span>Ubah Penampilan</span>
          </Link>
        </div>

        {/* Level & XP Progress Card */}
        <div style={{
          backgroundColor: 'var(--color-surface-container-lowest)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-md)',
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-text-main)' }}>
              Progres Tingkat Menuju Lv. {progress.nextLevel}
            </span>
            <span style={{ fontSize: '14px', fontWeight: 900, color: 'var(--color-primary)' }}>
              {progress.percentage}%
            </span>
          </div>
          <div style={{ width: '100%', height: '10px', backgroundColor: 'var(--color-surface-container)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
            <div style={{ width: `${progress.percentage}%`, height: '100%', backgroundColor: 'var(--color-secondary-container)', borderRadius: 'var(--radius-full)' }} />
          </div>
          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 700 }}>
            {xp.toLocaleString()} XP Terkumpul • Kurang {progress.remainingXp.toLocaleString()} XP lagi
          </span>
        </div>

        {/* 3 Quick Metric Bento Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-xs)' }}>
          <div style={{
            backgroundColor: 'var(--color-surface-container-lowest)',
            padding: 'var(--space-sm)',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
            boxShadow: 'var(--shadow-card)'
          }}>
            <span style={{ fontSize: '20px' }}>🔥</span>
            <span style={{ display: 'block', fontSize: '18px', fontWeight: 900, color: 'var(--color-tertiary)' }}>
              {streakDays} Hari
            </span>
            <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', fontWeight: 700 }}>Rentetan Belajar</span>
          </div>

          <div style={{
            backgroundColor: 'var(--color-surface-container-lowest)',
            padding: 'var(--space-sm)',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
            boxShadow: 'var(--shadow-card)'
          }}>
            <span style={{ fontSize: '20px' }}>💎</span>
            <span style={{ display: 'block', fontSize: '18px', fontWeight: 900, color: 'var(--color-primary)' }}>
              {coins}
            </span>
            <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', fontWeight: 700 }}>Kristal Ajaib</span>
          </div>

          <div style={{
            backgroundColor: 'var(--color-surface-container-lowest)',
            padding: 'var(--space-sm)',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
            boxShadow: 'var(--shadow-card)'
          }}>
            <span style={{ fontSize: '20px' }}>🗺️</span>
            <span style={{ display: 'block', fontSize: '18px', fontWeight: 900, color: 'var(--color-secondary)' }}>
              {completedQuestIds.length}
            </span>
            <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', fontWeight: 700 }}>Misi Tuntas</span>
          </div>
        </div>

        {/* Active Companion Card */}
        {activePet && (
          <div style={{
            backgroundColor: 'var(--color-surface-container-lowest)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-sm) var(--space-md)',
            boxShadow: 'var(--shadow-card)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: '50%',
                backgroundColor: activePet.colorScheme.bg,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px'
              }}>
                {activePet.avatarEmoji}
              </div>
              <div>
                <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                  Hewan Sahabat Aktif
                </span>
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--color-text-main)', margin: 0 }}>
                  {activePet.name}
                </h3>
              </div>
            </div>
            <Link
              to="/pets"
              style={{
                fontSize: '12px',
                fontWeight: 800,
                color: 'var(--color-primary)',
                textDecoration: 'none'
              }}
            >
              Lihat Sahabat →
            </Link>
          </div>
        )}

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          style={{
            marginTop: 'var(--space-sm)',
            padding: '12px',
            backgroundColor: 'var(--color-surface-container-high)',
            color: 'var(--color-error)',
            borderRadius: 'var(--radius-full)',
            border: 'none',
            fontWeight: 800,
            fontSize: '13px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>logout</span>
          <span>Keluar dari Akun</span>
        </button>
      </main>

      <BottomNavDock />
    </div>
  );
}
