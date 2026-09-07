import React from 'react';
import styles from '../../pages/auth/Auth.module.css';

export default function DesktopAuthShowcase({
  badge = '✨ EDUQUEST ADVENTURE',
  title = 'Jelajahi 5 Dunia Ajaib EduQuest',
  description = 'Belajar matematika, sains, bahasa, dan logika jadi petualangan seru dengan misi dan tantangan edukasi interaktif!',
  illustration,
  features = [
    { icon: 'explore', text: '5 Kepulauan Interaktif' },
    { icon: 'psychology', text: 'Tantangan Belajar Seru' },
    { icon: 'military_tech', text: 'Koin & Lencana Prestasi' }
  ]
}) {
  return (
    <div className={styles.desktopShowcasePanel}>
      {/* Brand Header */}
      <div className={styles.desktopShowcaseHeader}>
        <div className={styles.brandBadge}>
          <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#0284c7' }}>
            rocket_launch
          </span>
          <span className={styles.brandName}>EduQuest</span>
        </div>
        <span className={styles.showcaseTag}>{badge}</span>
      </div>

      {/* Large Vector Artwork */}
      <div className={styles.desktopIllustrationWrap}>
        {illustration || (
          <img
            src="/images/auth-traveler.jpg"
            alt="EduQuest Explorer"
            className={styles.desktopArtworkImg}
          />
        )}
      </div>

      {/* Narrative & Feature Highlights */}
      <div className={styles.desktopShowcaseFooter}>
        <h2 className={styles.desktopShowcaseTitle}>{title}</h2>
        <p className={styles.desktopShowcaseDesc}>{description}</p>

        <div className={styles.showcasePillGroup}>
          {features.map((feat, idx) => (
            <div key={idx} className={styles.showcaseChip}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#0284c7' }}>
                {feat.icon}
              </span>
              <span>{feat.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
