import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { useAuth } from '../../hooks/useAuth';
import { useAudio } from '../../context/AudioContext';
import GameHeader from '../../components/navigation/GameHeader';
import BottomNavDock from '../../components/navigation/BottomNavDock';
import { getLevelProgress } from '../../lib/progression';
import { AVAILABLE_CHARACTERS, getCharacterById } from '../../data/characters';
import styles from './ProfileView.module.css';

const GRADE_OPTIONS = [
  { id: 'Kelas 1 SD', label: 'Kelas 1 SD', icon: '🎒', desc: 'Fase Fondasi Belajar Ceria' },
  { id: 'Kelas 2 SD', label: 'Kelas 2 SD', icon: '✏️', desc: 'Membaca & Berhitung Cepat' },
  { id: 'Kelas 3 SD', label: 'Kelas 3 SD', icon: '📚', desc: 'Eksplorasi Sains & Logika' },
  { id: 'Kelas 4 SD', label: 'Kelas 4 SD', icon: '🧭', desc: 'Petualangan Kepulauan Nusantara' },
  { id: 'Kelas 5 SD', label: 'Kelas 5 SD', icon: '🧪', desc: 'Riset & Percobaan Alam' },
  { id: 'Kelas 6 SD', label: 'Kelas 6 SD', icon: '🚀', desc: 'Persiapan Ujian & Kosmos' },
  { id: 'Petualang Muda', label: 'Petualang Muda (Umum)', icon: '🌟', desc: 'Belajar Mandiri Sepanjang Masa' }
];

export default function ProfileView() {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { playSfx } = useAudio();
  const {
    playerName,
    bio,
    grade,
    xp,
    coins,
    streakDays,
    level,
    characterConfig,
    completedQuestIds,
    claimedAchievements = [],
    updateProfile,
    showToast
  } = useGame();

  const progress = getLevelProgress(xp);

  // Active character details from 10 available characters
  const activeAvatarId = characterConfig?.avatar || 'raka_explorer';
  const currentCharacter = getCharacterById(activeAvatarId);

  // Edit Profile Modal State
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(playerName || 'Petualang Cilik');
  const [editBio, setEditBio] = useState(bio || 'Cerdas, berani, dan siap mengungkap misteri kepulauan!');
  const [editGrade, setEditGrade] = useState(grade || 'Kelas 4 SD');
  const [editAvatar, setEditAvatar] = useState(activeAvatarId);
  const [modalFilter, setModalFilter] = useState('all');
  const [isGradeDropdownOpen, setIsGradeDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsGradeDropdownOpen(false);
      }
    }
    if (isGradeDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isGradeDropdownOpen]);

  function openEditModal() {
    setEditName(playerName || 'Petualang Cilik');
    setEditBio(bio || 'Cerdas, berani, dan siap mengungkap misteri kepulauan!');
    setEditGrade(grade || 'Kelas 4 SD');
    setEditAvatar(characterConfig?.avatar || 'raka_explorer');
    setModalFilter('all');
    setIsGradeDropdownOpen(false);
    setIsEditing(true);
    if (playSfx) playSfx('button-click');
  }

  function closeEditModal() {
    setIsEditing(false);
    setIsGradeDropdownOpen(false);
  }

  async function handleSaveProfile(e) {
    e?.preventDefault();
    if (!editName.trim()) {
      showToast('Nama petualang tidak boleh kosong!');
      return;
    }

    if (playSfx) playSfx('achievement');

    await updateProfile({
      playerName: editName.trim(),
      bio: editBio.trim(),
      grade: editGrade,
      avatar: editAvatar
    });

    setIsEditing(false);
  }

  async function handleLogout() {
    if (playSfx) playSfx('button-click');
    await signOut();
    navigate('/auth/login');
  }

  const displayedModalCharacters = modalFilter === 'all'
    ? AVAILABLE_CHARACTERS
    : AVAILABLE_CHARACTERS.filter((c) => c.gender === modalFilter);

  const selectedGradeOption = GRADE_OPTIONS.find((g) => g.id === editGrade || g.label === editGrade) || GRADE_OPTIONS[3];

  return (
    <div className={styles.container}>
      <GameHeader />

      <main className={styles.main}>
        {/* Left Column: Hero Profile Card & Vitals */}
        <div className={styles.leftColumn}>
          <div className={styles.profileHeroCard}>
            {/* Settings Shortcut */}
            <Link to="/settings" className={styles.settingsShortcut} title="Pengaturan Akun">
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>settings</span>
            </Link>

            {/* Glowing Avatar */}
            <div className={styles.avatarContainer}>
              <div
                className={styles.avatarGlowCircle}
                style={{
                  borderColor: '#ffffff',
                  boxShadow: `0 10px 25px -4px ${currentCharacter.themeColor}50, 0 0 0 3px ${currentCharacter.themeColor}`
                }}
              >
                <img
                  src={currentCharacter.image}
                  alt={currentCharacter.name}
                  className={styles.avatarImage}
                />
              </div>
              <span className={styles.levelPillBadge}>
                Lv. {level}
              </span>
            </div>

            {/* Player Identity */}
            <h1 className={styles.playerNameText}>
              {playerName || 'Petualang Cilik'}
            </h1>
            <span className={styles.playerGradeText} style={{ color: currentCharacter.themeColor }}>
              {currentCharacter.title} • {grade || 'Kelas 4 SD'}
            </span>

            {/* Motto / Bio Quote */}
            <p className={styles.playerBioQuote}>
              "{bio || 'Cerdas, berani, dan siap mengungkap misteri kepulauan!'}"
            </p>

            {/* Edit Profile Action Button */}
            <button
              type="button"
              onClick={openEditModal}
              className={styles.editProfileBtn}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                edit
              </span>
              <span>Edit Profil & Karakter</span>
            </button>
          </div>

          {/* Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            className={styles.logoutBtn}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>logout</span>
            <span>Keluar dari Akun</span>
          </button>
        </div>

        {/* Right Column: Progress, Stats Bento, and Character Spotlight */}
        <div className={styles.rightColumn}>
          {/* Level & XP Progress Card */}
          <div className={styles.cardBox}>
            <div className={styles.progressHeader}>
              <span style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a' }}>
                Progres Tingkat Menuju Lv. {progress.nextLevel}
              </span>
              <span style={{ fontSize: '15px', fontWeight: 900, color: '#0284c7' }}>
                {progress.percentage}%
              </span>
            </div>
            <div className={styles.progressBarTrack}>
              <div
                className={styles.progressBarFill}
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 700 }}>
                {xp.toLocaleString()} XP Terkumpul
              </span>
              <span style={{ fontSize: '12px', color: '#0284c7', fontWeight: 700 }}>
                Kurang {progress.remainingXp.toLocaleString()} XP lagi
              </span>
            </div>
          </div>

          {/* 4 Bento Statistics Cards */}
          <div className={styles.bentoStatsGrid}>
            <div className={styles.bentoStatCard}>
              <span className={styles.statEmoji}>🔥</span>
              <span className={styles.statNumber} style={{ color: '#ea580c' }}>
                {streakDays} Hari
              </span>
              <span className={styles.statLabel}>Rentetan Belajar</span>
            </div>

            <div className={styles.bentoStatCard}>
              <span className={styles.statEmoji}>💎</span>
              <span className={styles.statNumber} style={{ color: '#0284c7' }}>
                {coins}
              </span>
              <span className={styles.statLabel}>Kristal Ajaib</span>
            </div>

            <div className={styles.bentoStatCard}>
              <span className={styles.statEmoji}>🗺️</span>
              <span className={styles.statNumber} style={{ color: '#059669' }}>
                {completedQuestIds.length}
              </span>
              <span className={styles.statLabel}>Misi Selesai</span>
            </div>

            <div className={styles.bentoStatCard}>
              <span className={styles.statEmoji}>🏆</span>
              <span className={styles.statNumber} style={{ color: '#d97706' }}>
                {claimedAchievements.length}
              </span>
              <span className={styles.statLabel}>Lencana Prestasi</span>
            </div>
          </div>

          {/* Character Spotlight Card */}
          <div className={styles.cardBox}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="material-symbols-outlined" style={{ color: currentCharacter.themeColor, fontSize: '22px' }}>
                  {currentCharacter.badgeIcon}
                </span>
                <span style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
                  Karakter Aktif Saat Ini
                </span>
              </div>
              <button
                type="button"
                onClick={openEditModal}
                style={{
                  fontSize: '12.5px',
                  fontWeight: 800,
                  color: '#0284c7',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <span>Ganti Karakter</span>
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>swap_horiz</span>
              </button>
            </div>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '16px',
              backgroundColor: '#f8fafc',
              borderRadius: '20px',
              border: '1.5px solid #e2e8f0'
            }}>
              <div style={{
                width: '72px',
                height: '72px',
                borderRadius: '50%',
                overflow: 'hidden',
                border: `3px solid ${currentCharacter.themeColor}`,
                boxShadow: `0 6px 16px ${currentCharacter.themeColor}35`,
                flexShrink: 0
              }}>
                <img
                  src={currentCharacter.image}
                  alt={currentCharacter.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h4 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                    {currentCharacter.name}
                  </h4>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 800,
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    backgroundColor: currentCharacter.gender === 'boy' ? '#e0f2fe' : '#ffe4e6',
                    color: currentCharacter.gender === 'boy' ? '#0284c7' : '#e11d48'
                  }}>
                    {currentCharacter.gender === 'boy' ? 'Cowok' : 'Cewek'}
                  </span>
                </div>
                <span style={{ fontSize: '12.5px', fontWeight: 700, color: currentCharacter.themeColor, display: 'block', marginTop: '2px' }}>
                  {currentCharacter.title}
                </span>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '6px 0 0 0', lineHeight: 1.45 }}>
                  {currentCharacter.tagline}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* =======================================================
          MODAL: EDIT PROFIL & GANTI KARAKTER
          ======================================================= */}
      {isEditing && (
        <div className={styles.modalOverlay} onClick={closeEditModal}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className={styles.modalHeader}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="material-symbols-outlined" style={{ color: '#0284c7', fontSize: '24px' }}>
                  badge
                </span>
                <h3 className={styles.modalTitle}>
                  Edit Profil Petualang
                </h3>
              </div>
              <button
                type="button"
                onClick={closeEditModal}
                className={styles.closeBtn}
                title="Tutup Modal"
              >
                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleSaveProfile} className={styles.modalBody}>
              {/* Nama Petualang */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Nama Lengkap / Panggilan Petualang
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  placeholder="Masukkan nama petualang..."
                  maxLength={30}
                  className={styles.formInput}
                  required
                />
              </div>

              {/* Motto / Bio Singkat */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Motto Petualang (Bio)
                </label>
                <input
                  type="text"
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  placeholder="Contoh: Selalu ceria meneliti sains dan alam!"
                  maxLength={80}
                  className={styles.formInput}
                />
              </div>

              {/* Tingkat / Kelas Belajar (Custom Dropdown) */}
              <div className={styles.formGroup}>
                <label className={styles.formLabel}>
                  Tingkat / Kelas Belajar
                </label>
                <div className={styles.dropdownWrapper} ref={dropdownRef}>
                  <button
                    type="button"
                    onClick={() => {
                      setIsGradeDropdownOpen((prev) => !prev);
                      if (playSfx) playSfx('button-click');
                    }}
                    className={`${styles.dropdownTrigger} ${isGradeDropdownOpen ? styles.dropdownTriggerOpen : ''}`}
                    aria-haspopup="listbox"
                    aria-expanded={isGradeDropdownOpen}
                  >
                    <div className={styles.dropdownSelectedInfo}>
                      <span className={styles.dropdownOptionIcon}>
                        {selectedGradeOption.icon}
                      </span>
                      <div className={styles.dropdownTextGroup}>
                        <span className={styles.dropdownSelectedTitle}>
                          {selectedGradeOption.label}
                        </span>
                        <span className={styles.dropdownSelectedDesc}>
                          {selectedGradeOption.desc}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`material-symbols-outlined ${styles.dropdownChevron} ${isGradeDropdownOpen ? styles.dropdownChevronOpen : ''}`}
                    >
                      expand_more
                    </span>
                  </button>

                  {isGradeDropdownOpen && (
                    <div className={styles.dropdownMenu} role="listbox">
                      {GRADE_OPTIONS.map((opt) => {
                        const isSelected = editGrade === opt.id || editGrade === opt.label;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            role="option"
                            aria-selected={isSelected}
                            onClick={() => {
                              setEditGrade(opt.id);
                              setIsGradeDropdownOpen(false);
                              if (playSfx) playSfx('button-click');
                            }}
                            className={`${styles.dropdownOption} ${isSelected ? styles.dropdownOptionSelected : ''}`}
                          >
                            <div className={styles.dropdownOptionLeft}>
                              <span className={styles.dropdownOptionIcon}>
                                {opt.icon}
                              </span>
                              <div className={styles.dropdownTextGroup}>
                                <span className={styles.dropdownOptionTitle}>
                                  {opt.label}
                                </span>
                                <span className={styles.dropdownOptionDesc}>
                                  {opt.desc}
                                </span>
                              </div>
                            </div>
                            {isSelected && (
                              <span className={`material-symbols-outlined ${styles.dropdownCheckmark}`}>
                                check_circle
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Pilihan Karakter (10 Karakter) */}
              <div className={styles.formGroup}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <label className={styles.formLabel}>
                    Pilih Karakter & Avatar Utama
                  </label>
                  <span style={{ fontSize: '11px', color: '#64748b', fontWeight: 700 }}>
                    10 Karakter (5 Raka & 5 Tara)
                  </span>
                </div>

                {/* Filter Tabs in Modal */}
                <div style={{
                  display: 'flex',
                  backgroundColor: '#f1f5f9',
                  borderRadius: '9999px',
                  padding: '3px',
                  gap: '3px'
                }}>
                  <button
                    type="button"
                    onClick={() => setModalFilter('all')}
                    style={{
                      flex: 1,
                      padding: '6px 10px',
                      borderRadius: '9999px',
                      border: 'none',
                      backgroundColor: modalFilter === 'all' ? '#ffffff' : 'transparent',
                      color: modalFilter === 'all' ? '#0f172a' : '#64748b',
                      fontSize: '11px',
                      fontWeight: 800,
                      cursor: 'pointer',
                      boxShadow: modalFilter === 'all' ? '0 2px 4px rgba(0,0,0,0.06)' : 'none'
                    }}
                  >
                    Semua (10)
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalFilter('boy')}
                    style={{
                      flex: 1,
                      padding: '6px 10px',
                      borderRadius: '9999px',
                      border: 'none',
                      backgroundColor: modalFilter === 'boy' ? '#0284c7' : 'transparent',
                      color: modalFilter === 'boy' ? '#ffffff' : '#64748b',
                      fontSize: '11px',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    👦 5 Raka
                  </button>
                  <button
                    type="button"
                    onClick={() => setModalFilter('girl')}
                    style={{
                      flex: 1,
                      padding: '6px 10px',
                      borderRadius: '9999px',
                      border: 'none',
                      backgroundColor: modalFilter === 'girl' ? '#e11d48' : 'transparent',
                      color: modalFilter === 'girl' ? '#ffffff' : '#64748b',
                      fontSize: '11px',
                      fontWeight: 800,
                      cursor: 'pointer'
                    }}
                  >
                    👧 5 Tara
                  </button>
                </div>

                {/* 10 Character Roster Grid */}
                <div className={styles.characterPickerGrid}>
                  {displayedModalCharacters.map((char) => {
                    const isSelected = editAvatar === char.id;
                    return (
                      <button
                        key={char.id}
                        type="button"
                        onClick={() => {
                          setEditAvatar(char.id);
                          if (playSfx) playSfx('coin');
                        }}
                        title={char.name}
                        className={`${styles.characterOptionBtn} ${isSelected ? styles.characterOptionSelected : ''}`}
                      >
                        <div style={{
                          width: '46px',
                          height: '46px',
                          borderRadius: '50%',
                          overflow: 'hidden',
                          border: isSelected
                            ? '2.5px solid #f59e0b'
                            : char.gender === 'boy'
                              ? '1.5px solid #bae6fd'
                              : '1.5px solid #fecdd3',
                          boxShadow: isSelected ? '0 4px 10px rgba(245, 158, 11, 0.4)' : 'none',
                          backgroundColor: char.gender === 'boy' ? '#e0f2fe' : '#ffe4e6'
                        }}>
                          <img
                            src={char.image}
                            alt={char.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                        <span style={{
                          fontSize: '10px',
                          fontWeight: isSelected ? 800 : 700,
                          color: isSelected ? '#0f172a' : '#475569',
                          textAlign: 'center',
                          lineHeight: 1.1
                        }}>
                          {char.gender === 'boy' ? 'Raka' : 'Tara'}
                        </span>
                        <span style={{
                          fontSize: '8.5px',
                          fontWeight: 700,
                          color: isSelected ? char.themeColor : '#94a3b8',
                          textAlign: 'center',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          maxWidth: '100%'
                        }}>
                          {char.shortTitle}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </form>

            {/* Modal Footer */}
            <div className={styles.modalFooter}>
              <button
                type="button"
                onClick={closeEditModal}
                className={styles.cancelModalBtn}
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleSaveProfile}
                className={styles.saveModalBtn}
              >
                Simpan Perubahan
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNavDock />
    </div>
  );
}
