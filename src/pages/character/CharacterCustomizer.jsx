import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { useAudio } from '../../context/AudioContext';
import BottomNavDock from '../../components/navigation/BottomNavDock';
import styles from './CharacterCustomizer.module.css';

import { AVAILABLE_CHARACTERS } from '../../data/characters';
export { AVAILABLE_CHARACTERS };

export default function CharacterCustomizer() {
  const navigate = useNavigate();
  const { characterConfig, updateCharacter, coins, level, showToast } = useGame();
  const { playSfx } = useAudio();

  // Gender filter: 'all' | 'boy' | 'girl'
  const [filterGender, setFilterGender] = useState('all');

  // Currently selected character ID
  const [selectedId, setSelectedId] = useState(() => {
    const equipped = characterConfig?.avatar || 'raka_explorer';
    const found = AVAILABLE_CHARACTERS.find((c) => c.id === equipped);
    return found ? found.id : AVAILABLE_CHARACTERS[0].id;
  });

  const [spinDeg, setSpinDeg] = useState(0);
  const [isFlipping, setIsFlipping] = useState(false);
  const [isGleaming, setIsGleaming] = useState(false);

  // Filtered roster based on selected category
  const displayedCharacters = filterGender === 'all'
    ? AVAILABLE_CHARACTERS
    : AVAILABLE_CHARACTERS.filter((c) => c.gender === filterGender);

  const currentCharacter = AVAILABLE_CHARACTERS.find((c) => c.id === selectedId) || AVAILABLE_CHARACTERS[0];

  const isCurrentlyEquipped =
    (characterConfig?.avatar === currentCharacter.id) ||
    (!characterConfig?.avatar && currentCharacter.id === 'raka_explorer') ||
    (characterConfig?.avatar === 'boy_raka' && currentCharacter.id === 'raka_explorer') ||
    (characterConfig?.avatar === 'girl_tara' && currentCharacter.id === 'tara_adventurer');

  // Trigger 3D Coin-Spin Animation when switching characters
  const spinToCharacter = (targetId) => {
    if (isFlipping || targetId === selectedId) return;
    setIsFlipping(true);
    setIsGleaming(true);

    if (playSfx) playSfx('coin');

    // First half of coin rotation: spin 90deg edge-on
    setSpinDeg((prev) => prev + 90);

    // At edge-on point (180ms), switch the character data
    setTimeout(() => {
      setSelectedId(targetId);
      // Second half: complete rotation back to face
      setSpinDeg((prev) => prev + 90);
    }, 180);

    // Finish spinning
    setTimeout(() => {
      setIsFlipping(false);
      setIsGleaming(false);
    }, 400);
  };

  const handleNext = () => {
    if (isFlipping) return;
    const currentIdx = displayedCharacters.findIndex((c) => c.id === currentCharacter.id);
    const nextIdx = (currentIdx + 1) % displayedCharacters.length;
    spinToCharacter(displayedCharacters[nextIdx].id);
  };

  const handlePrev = () => {
    if (isFlipping) return;
    const currentIdx = displayedCharacters.findIndex((c) => c.id === currentCharacter.id);
    const prevIdx = (currentIdx - 1 + displayedCharacters.length) % displayedCharacters.length;
    spinToCharacter(displayedCharacters[prevIdx].id);
  };

  // Save selected character to game state
  const handleEquip = () => {
    if (isCurrentlyEquipped) return;

    if (playSfx) playSfx('achievement');

    updateCharacter({
      avatar: currentCharacter.id,
      avatarImage: currentCharacter.image,
      playerName: currentCharacter.gender === 'girl' ? 'Tara' : 'Raka',
      gender: currentCharacter.gender,
      hasCustomized: true
    });

    showToast(`✨ Karakter ${currentCharacter.name} berhasil dipilih! Siap beraksi! 🚀`);
  };

  // Support desktop keyboard navigation (ArrowLeft & ArrowRight)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
      if (e.key === 'ArrowRight') {
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        handlePrev();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [displayedCharacters, currentCharacter, isFlipping]);

  const renderActionButtons = () => (
    <>
      {isCurrentlyEquipped ? (
        <div className={styles.equippedStatusBox}>
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
            check_circle
          </span>
          <span>Karakter Sedang Digunakan</span>
        </div>
      ) : (
        <button
          type="button"
          onClick={handleEquip}
          className={styles.primaryEquipBtn}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
            stars
          </span>
          <span>Gunakan {currentCharacter.name}</span>
        </button>
      )}

      <Link
        to="/world"
        className={styles.secondaryExploreBtn}
      >
        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
          explore
        </span>
        <span>Jelajahi Peta Dunia</span>
      </Link>
    </>
  );

  return (
    <div className={styles.container}>
      <main className={styles.main}>
        {/* Top Header */}
        <section className={styles.topHeader}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <Link to="/world" className={styles.backBtn} title="Kembali ke Peta Dunia">
              <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>arrow_back</span>
            </Link>
            <div className={styles.headerTitleWrapper}>
              <span className={styles.headerEyebrow}>
                PILIH PETUALANGMU
              </span>
              <h1 className={styles.headerTitle}>
                Koleksi Karakter
              </h1>
            </div>
          </div>

          <div className={styles.headerBadges}>
            <div className={styles.coinBadge}>
              <span>🪙</span>
              <span>{coins}</span>
            </div>
            <div className={styles.levelBadge}>
              Lv. {level}
            </div>
          </div>
        </section>

        {/* Content Layout: 2 Columns on Desktop, Single Column on Mobile */}
        <div className={styles.contentLayout}>
          {/* Left Column: 3D Coin Showcase & Action CTA */}
          <div className={styles.showcaseColumn}>
            <section className={styles.showcaseCard}>
              {/* Badge Tag */}
              <div
                className={styles.badgePill}
                style={{
                  backgroundColor: `${currentCharacter.themeColor}18`,
                  color: currentCharacter.themeColor
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                  {currentCharacter.badgeIcon}
                </span>
                <span>{currentCharacter.badge}</span>
                {isCurrentlyEquipped && (
                  <span className={styles.activeEquippedTag}>
                    AKTIF
                  </span>
                )}
              </div>

              {/* 3D Coin Stage with Left & Right Interactive Buttons */}
              <div className={styles.coinStage}>
                {/* Left Coin Navigation Button */}
                <button
                  type="button"
                  onClick={handlePrev}
                  disabled={isFlipping}
                  title="Karakter Sebelumnya (←)"
                  className={`${styles.navArrowBtn} ${styles.navArrowLeft}`}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '24px', fontWeight: 800 }}>
                    chevron_left
                  </span>
                </button>

                {/* Right Coin Navigation Button */}
                <button
                  type="button"
                  onClick={handleNext}
                  disabled={isFlipping}
                  title="Karakter Berikutnya (→)"
                  className={`${styles.navArrowBtn} ${styles.navArrowRight}`}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '24px', fontWeight: 800 }}>
                    chevron_right
                  </span>
                </button>

                {/* Center Spinning Gold Coin */}
                <div
                  className={styles.coinFrame}
                  style={{
                    transform: `rotateY(${spinDeg}deg)`,
                    boxShadow: isGleaming
                      ? '0 0 35px 8px rgba(251, 191, 36, 0.7), 0 16px 36px -8px rgba(2, 132, 199, 0.4)'
                      : '0 16px 36px -8px rgba(2, 132, 199, 0.35), 0 0 0 4px #fbbf24, 0 0 0 8px rgba(254, 240, 138, 0.8)'
                  }}
                >
                  <img
                    src={currentCharacter.image}
                    alt={currentCharacter.name}
                    className={styles.avatarImg}
                  />

                  {isGleaming && (
                    <div className={styles.coinGleam} />
                  )}
                </div>
              </div>

              {/* Character Identity */}
              <div className={styles.charDetails}>
                <h2 className={styles.charName}>
                  {currentCharacter.name}
                </h2>
                <span
                  className={styles.charTitle}
                  style={{ color: currentCharacter.themeColor }}
                >
                  {currentCharacter.title}
                </span>
                <p className={styles.charTagline}>
                  {currentCharacter.tagline}
                </p>
              </div>
            </section>

            {/* Desktop Actions (Sticky with Showcase Column) */}
            <div className={styles.desktopActions}>
              {renderActionButtons()}
              <div className={styles.keyboardHint}>
                <span>💡</span>
                <span>Gunakan tombol panah <b>←</b> dan <b>→</b> di keyboard untuk beralih karakter</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Character Gallery & Roster Panel */}
          <div className={styles.rosterColumn}>
            <div className={styles.rosterPanel}>
              {/* Desktop Roster Header */}
              <div className={styles.desktopRosterHeader}>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    Koleksi Karakter Petualang
                  </h3>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: '3px 0 0 0' }}>
                    Pilih dari 10 petualang cilik seru dengan kostum tematik khas Nusantara & Sains!
                  </p>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#f1f5f9',
                  padding: '6px 12px',
                  borderRadius: '9999px',
                  fontSize: '12px',
                  fontWeight: 800,
                  color: '#475569'
                }}>
                  <span>✨</span>
                  <span>{displayedCharacters.length} Karakter Tersedia</span>
                </div>
              </div>

              {/* Gender Filter Tabs */}
              <div className={styles.filterTabs}>
                <button
                  type="button"
                  onClick={() => setFilterGender('all')}
                  className={`${styles.filterBtn} ${filterGender === 'all' ? styles.filterBtnActiveAll : ''}`}
                >
                  Semua (10)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFilterGender('boy');
                    if (currentCharacter.gender !== 'boy') {
                      const firstBoy = AVAILABLE_CHARACTERS.find((c) => c.gender === 'boy');
                      if (firstBoy) spinToCharacter(firstBoy.id);
                    }
                  }}
                  className={`${styles.filterBtn} ${filterGender === 'boy' ? styles.filterBtnActiveBoy : ''}`}
                >
                  👦 5 Raka (Cowok)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setFilterGender('girl');
                    if (currentCharacter.gender !== 'girl') {
                      const firstGirl = AVAILABLE_CHARACTERS.find((c) => c.gender === 'girl');
                      if (firstGirl) spinToCharacter(firstGirl.id);
                    }
                  }}
                  className={`${styles.filterBtn} ${filterGender === 'girl' ? styles.filterBtnActiveGirl : ''}`}
                >
                  👧 5 Tara (Cewek)
                </button>
              </div>

              {/* Character Roster Grid Section */}
              <section>
                <div className={styles.rosterHeaderMobile}>
                  <span style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a' }}>
                    {filterGender === 'boy' ? 'Koleksi 5 Raka (Cowok)' : filterGender === 'girl' ? 'Koleksi 5 Tara (Cewek)' : 'Pilih dari Koleksi Petualang'}
                  </span>
                  <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>
                    {Math.max(1, displayedCharacters.findIndex((c) => c.id === currentCharacter.id) + 1)} dari {displayedCharacters.length}
                  </span>
                </div>

                <div className={styles.characterGrid}>
                  {displayedCharacters.map((char) => {
                    const isSelected = char.id === currentCharacter.id;
                    const isEquipped =
                      (characterConfig?.avatar === char.id) ||
                      (!characterConfig?.avatar && char.id === 'raka_explorer') ||
                      (characterConfig?.avatar === 'boy_raka' && char.id === 'raka_explorer') ||
                      (characterConfig?.avatar === 'girl_tara' && char.id === 'tara_adventurer');

                    return (
                      <button
                        key={char.id}
                        type="button"
                        onClick={() => spinToCharacter(char.id)}
                        title={char.name}
                        className={`${styles.charCard} ${isSelected ? styles.charCardSelected : ''}`}
                      >
                        <div
                          className={styles.avatarWrapper}
                          style={{
                            border: isSelected
                              ? '3px solid #f59e0b'
                              : char.gender === 'boy'
                                ? '2px solid #bae6fd'
                                : '2px solid #fecdd3',
                            boxShadow: isSelected
                              ? '0 6px 14px rgba(245, 158, 11, 0.45), 0 0 0 2px #fef08a'
                              : '0 2px 6px rgba(15, 23, 42, 0.06)',
                            backgroundColor: char.gender === 'boy' ? '#e0f2fe' : '#ffe4e6'
                          }}
                        >
                          <img
                            src={char.image}
                            alt={char.name}
                            className={styles.avatarImg}
                          />
                          {isEquipped && (
                            <div className={styles.equippedBadge}>
                              PAKAI
                            </div>
                          )}
                        </div>
                        <div className={styles.charLabelWrapper}>
                          <span
                            className={styles.cardName}
                            style={{
                              fontWeight: isSelected ? 800 : 700,
                              color: isSelected ? '#0f172a' : '#475569'
                            }}
                          >
                            {char.gender === 'boy' ? 'Raka' : 'Tara'}
                          </span>
                          <span
                            className={styles.cardSubtitle}
                            style={{
                              fontWeight: isSelected ? 800 : 600,
                              color: isSelected ? char.themeColor : '#94a3b8'
                            }}
                          >
                            {char.shortTitle}
                          </span>
                          <span className={styles.desktopRolePill}>
                            {char.gender === 'boy' ? 'Cowok' : 'Cewek'}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </section>
            </div>

            {/* Mobile Actions (Only shown on Mobile below roster) */}
            <div className={styles.mobileActions}>
              {renderActionButtons()}
            </div>
          </div>
        </div>
      </main>

      <BottomNavDock />
    </div>
  );
}
