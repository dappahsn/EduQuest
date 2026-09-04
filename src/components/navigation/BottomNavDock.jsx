import React from 'react';
import { NavLink } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { audioManager } from '../../lib/audioManager';
import styles from './BottomNavDock.module.css';

function BottomNavDock() {
  const { t, language } = useLanguage();

  return (
    <nav className={styles.dock}>
      <div className={styles.inner}>
        <NavLink
          to="/world"
          className={({ isActive }) => `${styles.tab} ${isActive ? styles.activeTab : ''}`}
          onClick={() => audioManager.playSfx('button-click')}
        >
          <span className="material-symbols-outlined">public</span>
          <span className={styles.tabLabel}>{t('navWorld')}</span>
        </NavLink>

        <NavLink
          to="/daily-quests"
          className={({ isActive }) => `${styles.tab} ${isActive ? styles.activeTab : ''}`}
          onClick={() => audioManager.playSfx('button-click')}
        >
          <span className="material-symbols-outlined">track_changes</span>
          <span className={styles.tabLabel}>{t('navDaily')}</span>
        </NavLink>

        <NavLink
          to="/collection"
          className={({ isActive }) => `${styles.tab} ${isActive ? styles.activeTab : ''}`}
          onClick={() => audioManager.playSfx('button-click')}
        >
          <span className="material-symbols-outlined">backpack</span>
          <span className={styles.tabLabel}>{t('navCollection')}</span>
        </NavLink>

        <NavLink
          to="/achievements"
          className={({ isActive }) => `${styles.tab} ${isActive ? styles.activeTab : ''}`}
          onClick={() => audioManager.playSfx('button-click')}
        >
          <span className="material-symbols-outlined">emoji_events</span>
          <span className={styles.tabLabel}>{language === 'id' ? 'Prestasi' : 'Badges'}</span>
        </NavLink>

        <NavLink
          to="/character"
          className={({ isActive }) => `${styles.tab} ${isActive ? styles.activeTab : ''}`}
          onClick={() => audioManager.playSfx('button-click')}
        >
          <span className="material-symbols-outlined">face</span>
          <span className={styles.tabLabel}>{t('navCharacter')}</span>
        </NavLink>
      </div>
    </nav>
  );
}

export default React.memo(BottomNavDock);
