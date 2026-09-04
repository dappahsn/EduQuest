import React from 'react';
import { Link } from 'react-router-dom';
import CharacterAvatar from '../components/character/CharacterAvatar';
import { useLanguage } from '../context/LanguageContext';
import { useAudio } from '../context/AudioContext';
import styles from './Landing.module.css';

export default function Landing() {
  const { t, toggleLanguage, langName, langFlag } = useLanguage();
  const { bgmEnabled, toggleBgm, playSfx } = useAudio();

  const handleToggleAudio = () => {
    toggleBgm();
    playSfx('button-click');
  };

  return (
    <div className={styles.landingContainer}>
      <header className={styles.topHeader}>
        <button
          type="button"
          onClick={handleToggleAudio}
          className={`${styles.audioPill} interactive-card`}
          title={bgmEnabled ? 'Matikan musik' : 'Nyalakan musik'}
          style={{ border: 'none', cursor: 'pointer' }}
        >
          <span className="material-symbols-outlined">
            {bgmEnabled ? 'volume_up' : 'volume_off'}
          </span>
          <span>{bgmEnabled ? t('musicOn') : t('musicOff')}</span>
        </button>

        <button
          type="button"
          onClick={toggleLanguage}
          className={`${styles.langPill} interactive-card`}
          title="Ganti Bahasa / Switch Language"
          style={{ border: 'none', cursor: 'pointer' }}
        >
          <span>{langFlag}</span>
          <span>{langName}</span>
        </button>
      </header>

      <main className={styles.heroSection}>
        <div className={styles.emblemWrapper}>
          <div className={styles.emblemGlow}></div>
          <div className={styles.emblemCircle}>
            <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--color-primary)' }}>
              explore
            </span>
          </div>
          <span className={styles.badgePill}>{t('brandName')}</span>
          <span className={styles.tagline}>{t('tagline')}</span>
        </div>

        <h1 className={styles.heroTitle}>
          {t('heroTitle')}
        </h1>
        <p className={styles.heroSubtitle}>
          {t('heroSubtitle')}
        </p>

        {/* Mascot Greeting */}
        <div className={styles.mascotCard}>
          <CharacterAvatar size="sm" />
          <div className={styles.speechBubble}>
            <div className={styles.speechHeader}>
              <span className={styles.mascotName}>{t('mascotName')}</span>
              <span className={styles.mascotRole}>{t('mascotRole')}</span>
            </div>
            <p className={styles.speechText}>
              {t('mascotSpeech')}
            </p>
          </div>
        </div>

        {/* Action Center */}
        <div className={styles.actionCenter}>
          <Link to="/auth/register" className={styles.btnPrimary}>
            <span className="material-symbols-outlined">rocket_launch</span>
            <span>{t('startAdventure')}</span>
          </Link>

          <Link to="/auth/login" className={styles.btnSecondary} style={{ width: '100%' }}>
            <span className="material-symbols-outlined">account_circle</span>
            <span>{t('signIn')}</span>
          </Link>
        </div>

        {/* Safety Note */}
        <div className={styles.safetyBadge}>
          <span className="material-symbols-outlined" style={{ color: 'var(--color-secondary)' }}>verified_user</span>
          <span>{t('safetyBadge')}</span>
        </div>
      </main>
    </div>
  );
}
