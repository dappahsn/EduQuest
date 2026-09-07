import React, { useState } from 'react';
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

  // Parental PIN Lock States
  const [parentalPin, setParentalPin] = useState(() => localStorage.getItem('eduquest_parental_pin') || '');
  const [isPinModalOpen, setIsPinModalOpen] = useState(false);
  const [pinStep, setPinStep] = useState(1);
  const [mathChallenge, setMathChallenge] = useState({ num1: 7, num2: 8, answer: 56 });
  const [mathAnswer, setMathAnswer] = useState('');
  const [pinInput, setPinInput] = useState('');

  const openPinModal = () => {
    playSfx('button-click');
    const n1 = Math.floor(Math.random() * 6) + 4; // 4..9
    const n2 = Math.floor(Math.random() * 6) + 4; // 4..9
    setMathChallenge({ num1: n1, num2: n2, answer: n1 * n2 });
    setMathAnswer('');
    setPinInput('');
    setPinStep(1);
    setIsPinModalOpen(true);
  };

  const handleVerifyMath = () => {
    if (parseInt(mathAnswer, 10) === mathChallenge.answer) {
      playSfx('correct');
      setPinStep(2);
    } else {
      playSfx('wrong');
      showToast('Jawaban belum tepat! Verifikasi ini khusus orang tua.');
    }
  };

  const handleSavePin = () => {
    if (pinInput.length !== 4) {
      showToast('PIN harus terdiri dari 4 digit angka!');
      return;
    }
    localStorage.setItem('eduquest_parental_pin', pinInput);
    setParentalPin(pinInput);
    setIsPinModalOpen(false);
    playSfx('achievement');
    showToast('Kunci PIN Pengawasan berhasil diaktifkan! 🔒');
  };

  const handleDisablePin = () => {
    localStorage.removeItem('eduquest_parental_pin');
    setParentalPin('');
    setIsPinModalOpen(false);
    playSfx('button-click');
    showToast('Kunci PIN Pengawasan telah dinonaktifkan.');
  };

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
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '14px', fontWeight: 800 }}>Kunci PIN Pengawasan</span>
                {parentalPin ? (
                  <span style={{
                    backgroundColor: '#ecfdf5',
                    color: '#059669',
                    fontSize: '10px',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    border: '1px solid #a7f3d0'
                  }}>
                    Aktif 🔒
                  </span>
                ) : (
                  <span style={{
                    backgroundColor: '#f1f5f9',
                    color: '#64748b',
                    fontSize: '10px',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '9999px'
                  }}>
                    Nonaktif
                  </span>
                )}
              </div>
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)', display: 'block', marginTop: '2px' }}>
                {parentalPin ? 'Pengaturan profil anak terlindungi dengan PIN' : 'Lindungi pengaturan profil anak dengan kode PIN'}
              </span>
            </div>
            <button
              type="button"
              onClick={openPinModal}
              style={{
                backgroundColor: parentalPin ? '#0284c7' : 'var(--color-surface-container-high)',
                color: parentalPin ? '#ffffff' : 'var(--color-text-main)',
                padding: '8px 16px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                fontWeight: 800,
                fontSize: '12px',
                cursor: 'pointer',
                boxShadow: parentalPin ? '0 4px 10px rgba(2, 132, 199, 0.3)' : 'none',
                transition: 'all 0.15s ease'
              }}
            >
              {parentalPin ? 'Kelola PIN' : 'Aktifkan'}
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

      {/* Parental Gate & PIN Modal */}
      {isPinModalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px'
          }}
          onClick={() => setIsPinModalOpen(false)}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '420px',
              backgroundColor: '#ffffff',
              borderRadius: '28px',
              padding: '24px',
              boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="material-symbols-outlined" style={{ color: '#0284c7', fontSize: '24px' }}>
                  shield
                </span>
                <h3 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                  Zona Orang Tua & Guru
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsPinModalOpen(false)}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: '#f1f5f9',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#64748b'
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
              </button>
            </div>

            {/* Step 1: Adult Math Challenge (Verification) */}
            {pinStep === 1 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                  Untuk memastikan Anda adalah orang tua atau guru, silakan selesaikan hitungan sederhana di bawah ini:
                </p>
                <div style={{
                  padding: '16px',
                  backgroundColor: '#f0f9ff',
                  borderRadius: '16px',
                  border: '1.5px solid #bae6fd',
                  textAlign: 'center'
                }}>
                  <span style={{ fontSize: '20px', fontWeight: 900, color: '#0284c7' }}>
                    {mathChallenge.num1} × {mathChallenge.num2} = ?
                  </span>
                </div>
                <input
                  type="number"
                  value={mathAnswer}
                  onChange={(e) => setMathAnswer(e.target.value)}
                  placeholder="Ketik jawaban hasil perkalian..."
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '12px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '15px',
                    fontWeight: 700,
                    textAlign: 'center',
                    outline: 'none'
                  }}
                  autoFocus
                />
                <button
                  type="button"
                  onClick={handleVerifyMath}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '9999px',
                    backgroundColor: '#0284c7',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '14px',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 6px 14px rgba(2, 132, 199, 0.35)'
                  }}
                >
                  Lanjut ke Pengaturan PIN
                </button>
              </div>
            )}

            {/* Step 2: PIN Setup or Management */}
            {pinStep === 2 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                  {parentalPin ? 'Ubah PIN atau nonaktifkan kunci pengawasan orang tua:' : 'Buat 4 digit PIN pengawasan orang tua:'}
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: '#334155' }}>
                    {parentalPin ? 'PIN Baru (4 Digit Angka)' : 'Masukkan PIN (4 Digit Angka)'}
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ''))}
                    placeholder="Contoh: 1234"
                    style={{
                      width: '100%',
                      padding: '12px',
                      borderRadius: '12px',
                      border: '1.5px solid #cbd5e1',
                      fontSize: '18px',
                      fontWeight: 800,
                      textAlign: 'center',
                      letterSpacing: '0.3em',
                      outline: 'none'
                    }}
                    autoFocus
                  />
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                  {parentalPin && (
                    <button
                      type="button"
                      onClick={handleDisablePin}
                      style={{
                        flex: 1,
                        padding: '12px',
                        borderRadius: '9999px',
                        backgroundColor: '#fee2e2',
                        color: '#b91c1c',
                        fontWeight: 800,
                        fontSize: '13px',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      Nonaktifkan
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleSavePin}
                    style={{
                      flex: 2,
                      padding: '12px',
                      borderRadius: '9999px',
                      backgroundColor: '#0284c7',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '13px',
                      border: 'none',
                      cursor: 'pointer',
                      boxShadow: '0 6px 14px rgba(2, 132, 199, 0.35)'
                    }}
                  >
                    Simpan PIN
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <BottomNavDock />
    </div>
  );
}
