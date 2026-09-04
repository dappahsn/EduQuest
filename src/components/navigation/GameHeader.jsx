import React from 'react';
import { Link } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { useLanguage } from '../../context/LanguageContext';
import { useAudio } from '../../context/AudioContext';
import CharacterAvatar from '../character/CharacterAvatar';
import styles from './GameHeader.module.css';

function GameHeader(props) {
  const { t } = useLanguage();
  const { bgmEnabled, toggleBgm, playSfx } = useAudio();

  let game;
  try {
    game = useGame();
  } catch (e) {
    game = null;
  }

  const level = props.level ?? game?.level ?? 12;
  const username = props.username ?? game?.playerName ?? 'Raka';
  const xp = props.xp ?? game?.xp ?? 2450;
  const lives = props.lives ?? game?.energy ?? 3;
  const streak = props.streak ?? game?.streakDays ?? 7;
  const coins = props.coins ?? game?.coins ?? 840;
  const characterConfig = game?.characterConfig || {};

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        {/* Left: Brand + Profile Capsule */}
        <div className={styles.leftGroup}>
          <Link to="/world" className={styles.brandBadge} title="EduQuest Beranda">
            <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)', fontSize: '24px' }}>
              explore
            </span>
          </Link>

          <Link to="/character" className={styles.profileCapsule} title="Kustomisasi Karakter">
            <div className={styles.avatarWrapper}>
              <CharacterAvatar config={characterConfig} size="sm" />
              <span className={styles.levelBadge}>{level}</span>
            </div>

            <div className={styles.nameAndXp}>
              <div className={styles.nameRow}>
                <span className={styles.username}>{username}</span>
                <span className={styles.realmTag}>{t('realm')}</span>
              </div>
              <div className={styles.xpRow}>
                <div className={styles.xpBarTrack}>
                  <div className={styles.xpBarFill} style={{ width: '65%' }}></div>
                </div>
                <span className={styles.xpText}>{xp.toLocaleString()} XP</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Right: Vitals Group (Lives, Streak, Coins, Audio) */}
        <div className={styles.vitalsGroup}>
          <button
            type="button"
            onClick={() => { toggleBgm(); playSfx('button-click'); }}
            className={styles.vitalPill}
            title={bgmEnabled ? "Matikan Musik / Mute Music" : "Nyalakan Musik / Play Music"}
            style={{ border: 'none', cursor: 'pointer', padding: '4px 8px' }}
          >
            <span className="material-symbols-outlined" style={{ color: bgmEnabled ? 'var(--color-primary)' : 'var(--color-text-muted)', fontSize: '18px' }}>
              {bgmEnabled ? 'volume_up' : 'volume_off'}
            </span>
          </button>

          <div className={styles.vitalPill} title="Nyawa / Energi Petualang">
            <span className="material-symbols-outlined" style={{ color: 'var(--color-ruby)', fontSize: '18px' }}>
              favorite
            </span>
            <span className={styles.vitalText}>{lives}</span>
          </div>

          <div className={styles.vitalPill} title="Rentetan Harian (Streak)">
            <span className="material-symbols-outlined" style={{ color: 'var(--color-tertiary)', fontSize: '18px' }}>
              local_fire_department
            </span>
            <span className={styles.vitalText}>{streak}</span>
          </div>

          <div className={styles.vitalPill} title="Koin / Kristal Ajaib">
            <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)', fontSize: '18px' }}>
              diamond
            </span>
            <span className={styles.vitalText}>{coins}</span>
          </div>
        </div>
      </div>
    </header>
  );
}

export default React.memo(GameHeader);
