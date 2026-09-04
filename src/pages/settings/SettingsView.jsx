import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useGame } from '../../context/GameContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAudio } from '../../context/AudioContext';
import GameHeader from '../../components/navigation/GameHeader';
import BottomNavDock from '../../components/navigation/BottomNavDock';

export default function SettingsView() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { showToast } = useGame();
  const { t, language, setLanguage } = useLanguage();
  const { bgmEnabled, sfxEnabled, bgmVolume, sfxVolume, toggleBgm, toggleSfx, setBgmVolume, setSfxVolume, playSfx } = useAudio();

  const handleToggleBgm = () => {
    const nextState = toggleBgm();
    playSfx('button-click');
    showToast(nextState ? (language === 'id' ? 'Musik aktif! 🎵' : 'Music enabled! 🎵') : (language === 'id' ? 'Musik dinonaktifkan 🔇' : 'Music disabled 🔇'));
  };

  const handleToggleSfx = () => {
    const nextState = toggleSfx();
    showToast(nextState ? (language === 'id' ? 'Efek suara aktif! 🔊' : 'SFX enabled! 🔊') : (language === 'id' ? 'Efek suara dinonaktifkan' : 'SFX disabled'));
  };

  async function handleLogout() {
    playSfx('button-click');
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
        {/* Breadcrumb Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link
            to="/profile"
            onClick={() => playSfx('button-click')}
            style={{
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
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_back</span>
          </Link>
          <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-text-main)', margin: 0 }}>
            {t('settingsTitle')}
          </h1>
        </div>

        {/* Audio Toggles Card */}
        <div style={{
          backgroundColor: 'var(--color-surface-container-lowest)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-md)',
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-md)'
        }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
            {t('soundMusic')}
          </span>

          {/* BGM Toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)' }}>music_note</span>
              <div>
                <span style={{ fontSize: '14px', fontWeight: 800, display: 'block' }}>{t('bgm')}</span>
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{t('bgmSub')}</span>
              </div>
            </div>
            <button
              onClick={handleToggleBgm}
              className="interactive-card"
              style={{
                backgroundColor: bgmEnabled ? 'var(--color-secondary)' : 'var(--color-surface-container-high)',
                color: bgmEnabled ? '#fff' : 'var(--color-text-muted)',
                padding: '6px 16px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                fontWeight: 800,
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              {bgmEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* BGM Volume Slider */}
          {bgmEnabled && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '36px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--color-text-muted)' }}>volume_down</span>
              <input
                type="range"
                min="0"
                max="100"
                value={Math.round(bgmVolume * 100)}
                onChange={(e) => setBgmVolume(Number(e.target.value) / 100)}
                style={{ flex: 1, accentColor: 'var(--color-primary)', height: '4px' }}
              />
              <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--color-text-muted)' }}>volume_up</span>
            </div>
          )}

          <div style={{ height: '1px', backgroundColor: 'var(--color-surface-container-high)' }} />

          {/* SFX Toggle */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)' }}>volume_up</span>
              <div>
                <span style={{ fontSize: '14px', fontWeight: 800, display: 'block' }}>{t('sfx')}</span>
                <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{t('sfxSub')}</span>
              </div>
            </div>
            <button
              onClick={handleToggleSfx}
              className="interactive-card"
              style={{
                backgroundColor: sfxEnabled ? 'var(--color-secondary)' : 'var(--color-surface-container-high)',
                color: sfxEnabled ? '#fff' : 'var(--color-text-muted)',
                padding: '6px 16px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                fontWeight: 800,
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              {sfxEnabled ? 'ON' : 'OFF'}
            </button>
          </div>

          {/* SFX Volume Slider */}
          {sfxEnabled && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', paddingLeft: '36px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--color-text-muted)' }}>volume_down</span>
              <input
                type="range"
                min="0"
                max="100"
                value={Math.round(sfxVolume * 100)}
                onChange={(e) => setSfxVolume(Number(e.target.value) / 100)}
                style={{ flex: 1, accentColor: 'var(--color-secondary)', height: '4px' }}
              />
              <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--color-text-muted)' }}>volume_up</span>
            </div>
          )}
        </div>

        {/* Bahasa Card */}
        <div style={{
          backgroundColor: 'var(--color-surface-container-lowest)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-md)',
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)' }}>language</span>
            <div>
              <span style={{ fontSize: '14px', fontWeight: 800, display: 'block' }}>{t('appLanguage')}</span>
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>{t('langSub')}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              onClick={() => {
                playSfx('button-click');
                setLanguage('id');
                showToast('Bahasa diubah ke Bahasa Indonesia 🇮🇩');
              }}
              className="interactive-card"
              style={{
                backgroundColor: language === 'id' ? 'var(--color-primary)' : 'var(--color-surface-container-high)',
                color: language === 'id' ? 'var(--color-on-primary)' : 'var(--color-text-main)',
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                fontWeight: 800,
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>🇮🇩</span>
              <span>ID</span>
            </button>
            <button
              onClick={() => {
                playSfx('button-click');
                setLanguage('en');
                showToast('Language switched to English 🇬🇧');
              }}
              className="interactive-card"
              style={{
                backgroundColor: language === 'en' ? 'var(--color-primary)' : 'var(--color-surface-container-high)',
                color: language === 'en' ? 'var(--color-on-primary)' : 'var(--color-text-main)',
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                fontWeight: 800,
                fontSize: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span>🇬🇧</span>
              <span>EN</span>
            </button>
          </div>
        </div>

        {/* Parental Area */}
        <div style={{
          backgroundColor: 'var(--color-surface-container-lowest)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-md)',
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-sm)'
        }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
            Zona Orang Tua & Guru
          </span>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: '14px', fontWeight: 800, display: 'block' }}>Kunci PIN Pengawasan</span>
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Lindungi pengaturan profil anak</span>
            </div>
            <button
              onClick={() => {
                playSfx('button-click');
                showToast('Fitur segera hadir!');
              }}
              style={{
                backgroundColor: 'var(--color-surface-container-high)',
                color: 'var(--color-text-muted)',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                fontWeight: 800,
                fontSize: '12px',
                cursor: 'pointer'
              }}
            >
              Aktifkan
            </button>
          </div>
        </div>

        {/* Sign Out Button */}
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
          <span>Keluar dari Akun EduQuest</span>
        </button>
      </main>

      <BottomNavDock />
    </div>
  );
}
