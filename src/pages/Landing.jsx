import React from 'react';
import { Link } from 'react-router-dom';
import CharacterAvatar from '../components/character/CharacterAvatar';
import { useLanguage } from '../context/LanguageContext';
import { useAudio } from '../context/AudioContext';
import { REGIONS } from '../data/seedData';
import styles from './Landing.module.css';

export default function Landing() {
  const { t, toggleLanguage, langName, langFlag, language } = useLanguage();
  const { bgmEnabled, toggleBgm, playSfx } = useAudio();

  const isId = language === 'id';

  const handleToggleAudio = () => {
    toggleBgm();
    playSfx('button-click');
  };

  // Color mapping helper for island badges
  const getThemeColors = (theme) => {
    switch (theme) {
      case 'blue':
        return { bg: '#e0f2fe', color: '#0369a1', iconBg: '#0284c7' };
      case 'emerald':
        return { bg: '#dcfce7', color: '#15803d', iconBg: '#16a34a' };
      case 'amber':
        return { bg: '#fef3c7', color: '#b45309', iconBg: '#f59e0b' };
      case 'purple':
        return { bg: '#f3e8ff', color: '#7e22ce', iconBg: '#9333ea' };
      default:
        return { bg: '#e0f2fe', color: '#0369a1', iconBg: '#0284c7' };
    }
  };

  return (
    <div className={styles.landingWrapper}>
      {/* 1. Top Navbar */}
      <header className={styles.topNavbar}>
        <Link to="/" className={styles.brandLink}>
          <div className={styles.brandIconCircle}>
            <span className="material-symbols-outlined" style={{ fontSize: '24px', color: '#0284c7' }}>
              explore
            </span>
          </div>
          <div className={styles.brandText}>
            <span className={styles.brandTitle}>{t('brandName')}</span>
            <span className={styles.brandTagline}>{t('tagline')}</span>
          </div>
        </Link>

        <div className={styles.navActions}>
          <button
            type="button"
            onClick={handleToggleAudio}
            className={styles.audioPill}
            title={bgmEnabled ? 'Matikan musik' : 'Nyalakan musik'}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
              {bgmEnabled ? 'volume_up' : 'volume_off'}
            </span>
            <span>{bgmEnabled ? t('musicOn') : t('musicOff')}</span>
          </button>

          <button
            type="button"
            onClick={toggleLanguage}
            className={styles.langPill}
            title="Ganti Bahasa / Switch Language"
          >
            <span>{langFlag}</span>
            <span>{langName}</span>
          </button>

          <Link to="/auth/login" className={styles.navLoginBtn}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>login</span>
            <span>{t('signIn')}</span>
          </Link>
        </div>
      </header>

      {/* 2. Hero Section (Split Layout on Desktop) */}
      <main className={styles.heroSection}>
        {/* Left Hero Content */}
        <div className={styles.heroContent}>
          <div className={styles.heroBadgePill}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>rocket_launch</span>
            <span>{isId ? 'PLATFORM BELAJAR PETUALANGAN ANAK' : 'CHILDREN ADVENTURE LEARNING'}</span>
          </div>

          <h1 className={styles.heroTitle}>
            {isId ? (
              <>
                Petualangan Ajaib
                <span className={styles.heroTitleAccent}>Dimulai Di Sini!</span>
              </>
            ) : (
              <>
                Magical Adventure
                <span className={styles.heroTitleAccent}>Starts Here!</span>
              </>
            )}
          </h1>

          <p className={styles.heroSubtitle}>
            {t('heroSubtitle')}
          </p>

          {/* Mascot Greeting */}
          <div className={styles.mascotCard}>
            <img
              src="/images/raka-avatar.png"
              alt="Raka Pemandu"
              className={styles.mascotAvatarImg}
            />
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

          {/* CTA Action Buttons */}
          <div className={styles.ctaRow}>
            <Link to="/auth/register" className={styles.btnPrimaryPill}>
              <span className="material-symbols-outlined">rocket_launch</span>
              <span>{t('startAdventure')}</span>
            </Link>

            <Link to="/auth/login" className={styles.btnSecondaryPill}>
              <span className="material-symbols-outlined">account_circle</span>
              <span>{t('signIn')}</span>
            </Link>
          </div>

          {/* Safety Trust Note */}
          <div className={styles.safetyPill}>
            <span className="material-symbols-outlined" style={{ color: '#059669', fontSize: '18px' }}>
              verified_user
            </span>
            <span>{t('safetyBadge')}</span>
          </div>
        </div>

        {/* Right Hero Visual Showcase */}
        <div className={styles.heroVisualColumn}>
          <div className={styles.heroIllustrationCard}>
            <img
              src="/images/hero-adventure.jpg"
              alt="Petualangan EduQuest"
              className={styles.heroArtworkImg}
            />

            {/* Floating Adventure Chips */}
            <div className={styles.floatingChip1}>
              <span className="material-symbols-outlined" style={{ color: '#0284c7', fontSize: '18px' }}>
                explore
              </span>
              <span>{isId ? '5 Kepulauan Ajaib' : '5 Magical Islands'}</span>
            </div>

            <div className={styles.floatingChip2}>
              <span className="material-symbols-outlined" style={{ color: '#f59e0b', fontSize: '18px' }}>
                pets
              </span>
              <span>{isId ? 'Sahabat Petualang' : 'Companion Pets'}</span>
            </div>
          </div>
        </div>
      </main>

      {/* 3. 5 Islands Showcase Grid */}
      <section className={styles.islandsSection}>
        <div className={styles.sectionHeader}>
          <span className={styles.sectionPretitle}>
            {isId ? 'DUNIA EDUQUEST' : 'EDUQUEST REALMS'}
          </span>
          <h2 className={styles.sectionTitle}>
            {isId ? 'Jelajahi 5 Kepulauan Petualangan' : 'Explore 5 Adventure Islands'}
          </h2>
          <p className={styles.sectionSubtitle}>
            {isId
              ? 'Setiap pulau menghadirkan tantangan ilmu yang berbeda dengan mini-game interaktif dan hadiah lencana emas.'
              : 'Every island offers unique learning challenges with interactive mini-games and gold badges.'}
          </p>
        </div>

        <div className={styles.islandsGrid}>
          {REGIONS.map((region) => {
            const colors = getThemeColors(region.colorTheme);
            return (
              <div key={region.id} className={styles.islandCard}>
                <div
                  className={styles.islandIconWrap}
                  style={{ backgroundColor: colors.iconBg, color: '#ffffff' }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '26px' }}>
                    {region.icon}
                  </span>
                </div>

                <span
                  className={styles.islandSubjectBadge}
                  style={{ backgroundColor: colors.bg, color: colors.color }}
                >
                  {region.subject}
                </span>

                <h3 className={styles.islandName}>{region.name}</h3>
                <p className={styles.islandDesc}>{region.description}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. Three Feature Pillars */}
      <section className={styles.islandsSection} style={{ paddingTop: '0' }}>
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIconCircle}>
              <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>sports_esports</span>
            </div>
            <h3 className={styles.featureTitle}>
              {isId ? 'Belajar Lewat Mini-Game Seru' : 'Gamified Interactive Learning'}
            </h3>
            <p className={styles.featureText}>
              {isId
                ? 'Konsep matematika dan sains yang rumit diubah menjadi game seru seperti Pizza Lab dan Solar System Builder.'
                : 'Complex math and science concepts are turned into exciting hands-on games and interactive puzzles.'}
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIconCircle}>
              <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>pets</span>
            </div>
            <h3 className={styles.featureTitle}>
              {isId ? 'Adopsi & Rawat Hewan Sahabat' : 'Adopt & Care for Pets'}
            </h3>
            <p className={styles.featureText}>
              {isId
                ? 'Buka sahabat lucu seperti Kucing Angka, Rubah Cerdik, dan Elang Logika yang menemanimu di setiap perjalanan.'
                : 'Unlock loyal animal companions that motivate and accompany young explorers on every mission.'}
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIconCircle}>
              <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>security</span>
            </div>
            <h3 className={styles.featureTitle}>
              {isId ? '100% Aman & Ramah Anak' : '100% Safe & Child-Friendly'}
            </h3>
            <p className={styles.featureText}>
              {isId
                ? 'Lingkungan bebas iklan pihak ketiga dengan antarmuka yang bersih, intuitif, dan ramah untuk anak usia 7–12 tahun.'
                : 'Zero third-party ads with clean, encouraging interfaces designed for kids aged 7-12 years.'}
            </p>
          </div>
        </div>
      </section>

      {/* 5. Bottom Call to Action Banner */}
      <section className={styles.bottomCtaBanner}>
        <div className={styles.ctaBannerCard}>
          <div className={styles.ctaBannerLeft}>
            <h2 className={styles.ctaBannerTitle}>
              {isId ? 'Siap Memulai Petualanganmu?' : 'Ready to Start Your Journey?'}
            </h2>
            <p className={styles.ctaBannerDesc}>
              {isId
                ? 'Bergabunglah bersama kami sekarang dan jadilah petualang hebat di 5 benua EduQuest!'
                : 'Join thousands of young explorers today and master knowledge through play!'}
            </p>
          </div>

          <Link to="/auth/register" className={styles.ctaBannerBtn}>
            <span className="material-symbols-outlined">rocket_launch</span>
            <span>{isId ? 'Daftar Gratis Sekarang' : 'Get Started for Free'}</span>
          </Link>
        </div>
      </section>

      {/* 6. Footer */}
      <footer className={styles.footer}>
        <p style={{ margin: '0' }}>
          © 2026 EduQuest. Belajar. Bermain. Menjadi Hebat. Seluruh hak cipta dilindungi.
        </p>
      </footer>
    </div>
  );
}

