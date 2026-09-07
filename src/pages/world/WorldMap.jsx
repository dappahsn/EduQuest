import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GameHeader from '../../components/navigation/GameHeader';
import BottomNavDock from '../../components/navigation/BottomNavDock';
import CharacterAvatar from '../../components/character/CharacterAvatar';
import { useGame } from '../../context/GameContext';
import { audioManager } from '../../lib/audioManager';
import { 
  REGION_QUESTS, 
  isQuestDone, 
  getRegionProgress, 
  isPlanetCompleted 
} from '../../data/worldData';
import './WorldMap.css';

const REGION_DATA = {
  angka: {
    id: 'lembah-angka',
    title: 'Planet Lembah Angka',
    subtitle: 'Dunia Aljabar & Geometri Ajaib',
    icon: 'calculate',
    tier: 'Tingkat 1',
    progress: 0,
    locked: false,
    prevPlanetName: null,
    nextQuest: 'Jembatan Perkalian Kilat',
    xp: '+120 XP',
    color: '#0284c7',
    biomeImage: '/images/biome-angka.jpg',
    islandImage: '/images/planet-angka.png',
    themeClass: 'selected',
    themeColor: '#0284c7',
    bgLight: '#f0f9ff',
    lore: 'Planet 3D kristal safir dengan riam angka bercahaya dan cincin orbit matematika ajaib.'
  },
  sains: {
    id: 'hutan-sains',
    title: 'Planet Hutan Sains',
    subtitle: 'Biosfer Flora & Ekosistem Galaksi',
    icon: 'biotech',
    tier: 'Tingkat 2',
    progress: 0,
    locked: true,
    prevPlanetName: 'Planet Lembah Angka',
    nextQuest: 'Misteri Fotosintesis Daun',
    xp: '+140 XP',
    color: '#10b981',
    biomeImage: '/images/biome-sains.jpg',
    islandImage: '/images/planet-sains.png',
    themeClass: 'selected-forest',
    themeColor: '#10b981',
    bgLight: '#ecfdf5',
    lore: 'Planet 3D rimba zamrud penuh tanaman bercahaya, laboratorium pohon, dan biosfer kosmik.'
  },
  cerita: {
    id: 'negeri-cerita',
    title: 'Planet Negeri Cerita',
    subtitle: 'Dunia Dongeng & Aksara Bintang',
    icon: 'auto_stories',
    tier: 'Tingkat 3',
    progress: 0,
    locked: true,
    prevPlanetName: 'Planet Hutan Sains',
    nextQuest: 'Dongeng Timun Mas',
    xp: '+150 XP',
    color: '#f97316',
    biomeImage: '/images/biome-cerita.jpg',
    islandImage: '/images/planet-cerita.png',
    themeClass: 'selected-cerita',
    themeColor: '#f97316',
    bgLight: '#fff7ed',
    lore: 'Planet 3D kastel buku megah berlatar senja keemasan dengan cincin aksara bintang melayang.'
  },
  tekateki: {
    id: 'gunung-teka-teki',
    title: 'Planet Gunung Teka-Teki',
    subtitle: 'Benteng Logika & Roda Gigi Kosmik',
    icon: 'extension',
    tier: 'Tingkat 4',
    progress: 0,
    locked: true,
    prevPlanetName: 'Planet Negeri Cerita',
    nextQuest: 'Misi Robot Penyelamat',
    xp: '+160 XP',
    color: '#8b5cf6',
    biomeImage: '/images/biome-tekateki.jpg',
    islandImage: '/images/planet-tekateki.png',
    themeClass: 'selected-tekateki',
    themeColor: '#8b5cf6',
    bgLight: '#f5f3ff',
    lore: 'Planet 3D asteroid mekanik dengan gerbang roda gigi raksasa dan labirin teka-teki kristal.'
  },
  angkasa: {
    id: 'angkasa-pengetahuan',
    title: 'Planet Angkasa Pengetahuan',
    subtitle: 'Pusat Observatorium Inti Galaksi',
    icon: 'rocket_launch',
    tier: 'Tingkat 5',
    progress: 0,
    locked: true,
    prevPlanetName: 'Planet Gunung Teka-Teki',
    nextQuest: 'Penyusun Tata Surya Kosmik',
    xp: '+160 XP',
    color: '#6366f1',
    biomeImage: '/images/biome-angkasa.jpg',
    islandImage: '/images/planet-angkasa.png',
    themeClass: 'selected-angkasa',
    themeColor: '#6366f1',
    bgLight: '#eef2ff',
    lore: 'Pusat tata surya 3D dengan kubah observatorium emas dan cincin starlight nebula megah.'
  }
};

export default function WorldMap() {
  const navigate = useNavigate();
  const pageRef = useRef(null);
  const { 
    characterConfig, 
    claimDailyChest, 
    completedQuestIds = [],
    dailyQuests = [],
    dailyChestClaimed = false,
    showToast
  } = useGame();
  const [selectedRegionKey, setSelectedRegionKey] = useState('angka');
  const [hoveredIslandKey, setHoveredIslandKey] = useState(null);

  const completedDailyCount = (dailyQuests || []).filter((q) => q.completed).length;
  const totalDailyCount = (dailyQuests || []).length || 3;
  const allDailyCompleted = totalDailyCount > 0 && completedDailyCount >= totalDailyCount;

  const handleDailyChestClick = () => {
    if (dailyChestClaimed) {
      if (showToast) {
        showToast('Hadiah hari ini sudah diklaim! Datang lagi besok ya 🌟');
      }
      return;
    }
    // Klaim hadiah harian
    claimDailyChest(true);
  };

  const getNextQuestInfo = (regionId) => {
    const list = REGION_QUESTS[regionId] || [];
    const next = list.find((q) => !isQuestDone(q.id, completedQuestIds));
    if (next) {
      return { title: next.title, xp: `+${next.xp} XP`, id: next.id };
    }
    return { title: 'Semua Misi Selesai!', xp: '⭐⭐⭐', id: null };
  };

  const getCompletedCount = (regionId) => {
    const list = REGION_QUESTS[regionId] || [];
    const done = list.filter((q) => isQuestDone(q.id, completedQuestIds)).length;
    return { done, total: list.length || 3 };
  };

  const regions = useMemo(() => {
    // Unlocking is strictly based on completing the preceding planet in sequence:
    // Planet 1: Lembah Angka (always unlocked)
    // Planet 2: Hutan Sains (unlocked after completing Planet Lembah Angka)
    // Planet 3: Negeri Cerita (unlocked after completing Planet Hutan Sains)
    // Planet 4: Gunung Teka-Teki (unlocked after completing Planet Negeri Cerita)
    // Planet 5: Angkasa Pengetahuan (unlocked after completing Planet Gunung Teka-Teki)
    const isAngkaDone = isPlanetCompleted('angka', completedQuestIds);
    const isSainsDone = isPlanetCompleted('sains', completedQuestIds);
    const isCeritaDone = isPlanetCompleted('cerita', completedQuestIds);
    const isTekatekiDone = isPlanetCompleted('tekateki', completedQuestIds);

    const isSainsLocked = !isAngkaDone;
    const isCeritaLocked = !isSainsDone;
    const isTekatekiLocked = !isCeritaDone;
    const isAngkasaLocked = !isTekatekiDone;

    return {
      angka: {
        ...REGION_DATA.angka,
        progress: getRegionProgress('lembah-angka', completedQuestIds),
        locked: false,
        tier: 'Tingkat 1',
        nextQuest: getNextQuestInfo('lembah-angka').title,
        xp: getNextQuestInfo('lembah-angka').xp,
        counts: getCompletedCount('lembah-angka')
      },
      sains: {
        ...REGION_DATA.sains,
        progress: getRegionProgress('hutan-sains', completedQuestIds),
        locked: isSainsLocked,
        tier: 'Tingkat 2',
        prevPlanetName: 'Planet Lembah Angka',
        nextQuest: getNextQuestInfo('hutan-sains').title,
        xp: getNextQuestInfo('hutan-sains').xp,
        counts: getCompletedCount('hutan-sains')
      },
      cerita: {
        ...REGION_DATA.cerita,
        progress: getRegionProgress('negeri-cerita', completedQuestIds),
        locked: isCeritaLocked,
        tier: 'Tingkat 3',
        prevPlanetName: 'Planet Hutan Sains',
        nextQuest: getNextQuestInfo('negeri-cerita').title,
        xp: getNextQuestInfo('negeri-cerita').xp,
        counts: getCompletedCount('negeri-cerita')
      },
      tekateki: {
        ...REGION_DATA.tekateki,
        progress: getRegionProgress('gunung-teka-teki', completedQuestIds),
        locked: isTekatekiLocked,
        tier: 'Tingkat 4',
        prevPlanetName: 'Planet Negeri Cerita',
        nextQuest: getNextQuestInfo('gunung-teka-teki').title,
        xp: getNextQuestInfo('gunung-teka-teki').xp,
        counts: getCompletedCount('gunung-teka-teki')
      },
      angkasa: {
        ...REGION_DATA.angkasa,
        progress: getRegionProgress('angkasa-pengetahuan', completedQuestIds),
        locked: isAngkasaLocked,
        tier: 'Tingkat 5',
        prevPlanetName: 'Planet Gunung Teka-Teki',
        nextQuest: getNextQuestInfo('angkasa-pengetahuan').title,
        xp: getNextQuestInfo('angkasa-pengetahuan').xp,
        counts: getCompletedCount('angkasa-pengetahuan')
      }
    };
  }, [completedQuestIds]);

  const playerActiveRegionKey = useMemo(() => {
    if (regions.angka.progress < 100) return 'angka';
    if (!regions.sains.locked && regions.sains.progress < 100) return 'sains';
    if (!regions.cerita.locked && regions.cerita.progress < 100) return 'cerita';
    if (!regions.tekateki.locked && regions.tekateki.progress < 100) return 'tekateki';
    if (!regions.angkasa.locked && regions.angkasa.progress < 100) return 'angkasa';
    return 'angka';
  }, [regions]);

  const selectedRegion = regions[selectedRegionKey] || regions.angka;

  // Synchronize initial selection to player's active progression planet
  useEffect(() => {
    if (playerActiveRegionKey) {
      setSelectedRegionKey(playerActiveRegionKey);
    }
  }, [playerActiveRegionKey]);

  const handleSelectRegion = (key) => {
    const reg = regions[key];
    // If user clicks a planet that is already selected and unlocked, launch it directly!
    if (selectedRegionKey === key && !reg.locked) {
      audioManager.playSfx('game-start');
      navigate(`/world/${reg.id}`);
      return;
    }
    setSelectedRegionKey(key);
    audioManager.playSfx('button-click');
  };



  // Helper renderer for avatar pin
  const renderAvatarPin = (speechText) => (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <div className="avatar-speech-bubble">
        <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#0284c7' }}>explore</span>
        <span style={{ fontSize: '11px', fontWeight: 800, color: '#0f172a' }}>{speechText}</span>
        <div className="speech-triangle" />
      </div>
      <div className="player-avatar-pin">
        <div className="player-avatar-halo" />
        <div className="player-avatar-frame">
          <CharacterAvatar config={characterConfig} size="md" />
        </div>
      </div>
    </div>
  );

  // Helper renderer for a 3D interactive floating island with elevation on hover
  const renderIslandUnit = (key) => {
    const reg = regions[key];
    const isSelected = selectedRegionKey === key;
    const isHovered = hoveredIslandKey === key;
    const isAvatarHere = selectedRegionKey === key;

    const speechText = reg.locked
      ? `Terkunci (Selesaikan ${reg.prevPlanetName || 'planet sebelumnya'})`
      : key === 'angka' ? 'Mendarat di Planet Lembah Angka!'
      : key === 'sains' ? 'Eksplorasi Planet Hutan Sains!'
      : key === 'cerita' ? 'Jelajahi Planet Negeri Cerita!'
      : key === 'tekateki' ? 'Aktifkan Planet Gunung Teka-Teki!'
      : 'Pusat Planet Angkasa Pengetahuan!';

    return (
      <div
        key={key}
        className={`island-interactive-unit island-unit-${key} ${isSelected ? 'selected-island' : ''} ${isHovered ? 'hovered-island' : ''} ${reg.locked ? 'island-locked' : ''}`}
        onMouseEnter={() => {
          setHoveredIslandKey(key);
          audioManager.playSfx('button-hover');
        }}
        onMouseLeave={() => setHoveredIslandKey(null)}
        onClick={() => handleSelectRegion(key)}
      >
        {/* Active Player Avatar Pin (standing on top of currently selected planet) */}
        {isAvatarHere && (
          <div className="island-avatar-wrapper">
            {renderAvatarPin(speechText)}
          </div>
        )}

        {/* 3D Floating Planet Body with Spherical Atmosphere */}
        <div className="island-body-3d">
          {/* Luminous Atmospheric Halo Glow Behind Planet */}
          <div className="planet-atmosphere-halo" style={{ '--planet-color': reg.themeColor }} />

          {/* High-definition 3D Planet Diorama */}
          <img
            src={reg.islandImage}
            alt={reg.title}
            className="island-3d-img"
            draggable={false}
          />

          {/* 3D Spherical Fresnel Lighting Sphere */}
          <div className="planet-fresnel-sphere" style={{ '--planet-color': reg.themeColor }} />
        </div>

        {/* Cosmic Space Gravity Well */}
        <div className="planet-space-base">
          <div className="planet-space-gravity-shadow" />
        </div>

        {/* Floating Planet Name Badge (Positioned Below the Planet) */}
        <div className="island-floating-badge">
          <div className="island-badge-icon" style={{ backgroundColor: `${reg.themeColor}22`, color: reg.themeColor }}>
            <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>{reg.icon}</span>
          </div>
          <div className="island-badge-text">
            <span className="island-badge-name">{reg.title}</span>
            <div className="island-badge-sub">
              <span className="island-badge-tier" style={{ color: reg.themeColor }}>{reg.tier}</span>
              <span className="island-badge-prog" style={{ backgroundColor: reg.locked ? '#e2e8f0' : `${reg.themeColor}22`, color: reg.locked ? '#64748b' : reg.themeColor }}>
                {reg.locked ? (
                  <>
                    <span className="material-symbols-outlined" style={{ fontSize: '11px' }}>lock</span> Terkunci
                  </>
                ) : (
                  `${reg.progress}%`
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="worldmap-page" ref={pageRef}>
      <GameHeader />

      <main className="worldmap-layout">
        {/* MAP CANVAS (Dual-Mode: 16:9 Landscape on Desktop, 9:16 Full-Bleed on Mobile) */}
        <div className="worldmap-canvas">
          {/* Floating Canvas Top HUD */}
          <div className="canvas-top-hud">
            <button
              className={`canvas-hud-gift-btn ${
                dailyChestClaimed
                  ? 'claimed'
                  : allDailyCompleted
                  ? 'ready-to-claim'
                  : 'in-progress'
              }`}
              onClick={handleDailyChestClick}
              title={
                dailyChestClaimed
                  ? 'Hadiah harian sudah kamu klaim hari ini'
                  : allDailyCompleted
                  ? 'Semua misi selesai! Klik untuk klaim hadiah harian'
                  : `Misi harian: ${completedDailyCount}/${totalDailyCount}. Klik untuk klaim hadiah`
              }
            >
              {dailyChestClaimed ? (
                <>
                  <span className="material-symbols-outlined">check_circle</span>
                  <span>Terklaim ✓</span>
                </>
              ) : allDailyCompleted ? (
                <>
                  <span className="material-symbols-outlined">card_giftcard</span>
                  <span>Klaim 3/3!</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined">card_giftcard</span>
                  <span>{completedDailyCount}/{totalDailyCount} Hadiah</span>
                </>
              )}
            </button>
          </div>

          {/* Clean 3D Luminous Starlight Hyperlane (No Clutter, Pure Cosmic Conduit) */}
          <svg className="sea-routes-layer desktop-galaxy-hyperlane" viewBox="0 0 1440 760" preserveAspectRatio="none" fill="none">
            <defs>
              <filter id="hyperlaneGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="8" result="blur1" />
                <feGaussianBlur stdDeviation="3" result="blur2" />
                <feMerge>
                  <feMergeNode in="blur1" />
                  <feMergeNode in="blur2" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              <linearGradient id="cosmicHyperlaneGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#0284c7" />
                <stop offset="25%" stopColor="#10b981" />
                <stop offset="50%" stopColor="#f97316" />
                <stop offset="75%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#6366f1" />
              </linearGradient>
            </defs>

            {/* Outer Volumetric Cosmic Aura */}
            <path
              className="route-glow-ribbon"
              d="M 187 584 C 250 430, 340 300, 412 262 C 500 230, 620 320, 720 373 C 820 420, 940 230, 1032 262 C 1110 280, 1190 245, 1262 257"
              stroke="url(#cosmicHyperlaneGrad)"
              fill="none"
              filter="url(#hyperlaneGlow)"
            />

            {/* Core Focused Laser Conduit */}
            <path
              className="route-core-laser"
              d="M 187 584 C 250 430, 340 300, 412 262 C 500 230, 620 320, 720 373 C 820 420, 940 230, 1032 262 C 1110 280, 1190 245, 1262 257"
              stroke="url(#cosmicHyperlaneGrad)"
              fill="none"
            />

            {/* Traveling Starlight Photons */}
            <circle r="4.5" fill="#ffffff" filter="url(#hyperlaneGlow)">
              <animateMotion
                dur="7s"
                repeatCount="indefinite"
                path="M 187 584 C 250 430, 340 300, 412 262 C 500 230, 620 320, 720 373 C 820 420, 940 230, 1032 262 C 1110 280, 1190 245, 1262 257"
              />
            </circle>
            <circle r="3" fill="#bae6fd" filter="url(#hyperlaneGlow)">
              <animateMotion
                dur="7s"
                begin="-3.5s"
                repeatCount="indefinite"
                path="M 187 584 C 250 430, 340 300, 412 262 C 500 230, 620 320, 720 373 C 820 420, 940 230, 1032 262 C 1110 280, 1190 245, 1262 257"
              />
            </circle>
          </svg>

          {/* -------------------------------------------------------------
              A. DESKTOP 3D COSMIC PLANETS SOLAR SYSTEM
              ------------------------------------------------------------- */}
          <div className="desktop-archipelago-container">
            {['angka', 'sains', 'cerita', 'tekateki', 'angkasa'].map(key => renderIslandUnit(key))}
          </div>

          {/* Desktop Bottom-Center Start Launch Bar */}
          <div className="desktop-bottom-start-bar">
            <div className="start-bar-planet-preview">
              <div
                className="start-bar-planet-icon"
                style={{
                  backgroundColor: selectedRegion.themeColor,
                  boxShadow: `0 0 16px ${selectedRegion.themeColor}aa`
                }}
              >
                <span className="material-symbols-outlined">{selectedRegion.icon}</span>
              </div>
              <div className="start-bar-planet-text">
                <div className="start-bar-tag">
                  <span className="start-bar-tier" style={{ color: selectedRegion.themeColor }}>
                    {selectedRegion.tier}
                  </span>
                  <span className="start-bar-divider">•</span>
                  <span className="start-bar-progress">
                    {selectedRegion.locked
                      ? `Selesaikan ${selectedRegion.prevPlanetName || 'Planet Sebelumnya'}`
                      : `${selectedRegion.progress}% Selesai`}
                  </span>
                </div>
                <h3 className="start-bar-title">{selectedRegion.title}</h3>
              </div>
            </div>

            <Link
              to={`/world/${selectedRegion.id}`}
              className={`start-bar-launch-btn ${selectedRegion.locked ? 'btn-locked' : ''}`}
              style={{
                background: selectedRegion.locked
                  ? '#334155'
                  : `linear-gradient(135deg, ${selectedRegion.themeColor} 0%, #0284c7 100%)`,
                boxShadow: selectedRegion.locked
                  ? 'none'
                  : `0 6px 20px ${selectedRegion.themeColor}66, inset 0 1px 0 rgba(255,255,255,0.3)`
              }}
              onClick={(e) => {
                if (selectedRegion.locked) {
                  e.preventDefault();
                  audioManager.playSfx('button-click');
                  if (showToast) {
                    showToast(`Selesaikan ${selectedRegion.prevPlanetName || 'planet sebelumnya'} terlebih dahulu untuk membuka planet ini! 🚀`);
                  }
                } else {
                  audioManager.playSfx('game-start');
                }
              }}
            >
              <span className="material-symbols-outlined start-btn-icon">
                {selectedRegion.locked ? 'lock' : 'rocket_launch'}
              </span>
              <span className="start-btn-label">
                {selectedRegion.locked
                  ? `Terkunci (Selesaikan ${selectedRegion.prevPlanetName || 'Planet Sebelumnya'})`
                  : `Mulai Petualangan`}
              </span>
              {!selectedRegion.locked && (
                <span className="material-symbols-outlined start-btn-arrow">
                  arrow_forward
                </span>
              )}
            </Link>
          </div>

          {/* -------------------------------------------------------------
              B. MOBILE 3D COSMIC GALAXY (Ascending upward / ke atas)
              ------------------------------------------------------------- */}
          <div className="mobile-galaxy-container">
            {/* Ascending Starlight Hyperlane */}
            <svg
              className="mobile-hyperlane-svg"
              viewBox="0 0 400 800"
              preserveAspectRatio="none"
              fill="none"
            >
              <defs>
                <linearGradient id="mobileHyperlaneGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#0284c7" />
                  <stop offset="25%" stopColor="#10b981" />
                  <stop offset="50%" stopColor="#f97316" />
                  <stop offset="75%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
                <filter id="mobileGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feGaussianBlur stdDeviation="8" result="blur1" />
                  <feGaussianBlur stdDeviation="16" result="blur2" />
                  <feMerge>
                    <feMergeNode in="blur2" />
                    <feMergeNode in="blur1" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              {/* Outer Glow Ribbon */}
              <path
                d="M 104 616 C 130 546, 270 554, 296 488 C 310 420, 120 428, 104 360 C 90 290, 280 298, 296 232 C 300 164, 210 172, 200 104"
                stroke="url(#mobileHyperlaneGrad)"
                strokeWidth="12"
                strokeLinecap="round"
                fill="none"
                opacity="0.35"
                filter="url(#mobileGlow)"
              />
              {/* Middle Luminous Conduit */}
              <path
                d="M 104 616 C 130 546, 270 554, 296 488 C 310 420, 120 428, 104 360 C 90 290, 280 298, 296 232 C 300 164, 210 172, 200 104"
                stroke="url(#mobileHyperlaneGrad)"
                strokeWidth="3.5"
                strokeLinecap="round"
                fill="none"
                opacity="0.85"
              />
              {/* Core Laser Starlight */}
              <path
                d="M 104 616 C 130 546, 270 554, 296 488 C 310 420, 120 428, 104 360 C 90 290, 280 298, 296 232 C 300 164, 210 172, 200 104"
                stroke="#ffffff"
                strokeWidth="1.2"
                strokeLinecap="round"
                fill="none"
                opacity="0.9"
              />
              {/* Ascending Photon Pulses */}
              <circle r="3" fill="#ffffff" filter="url(#mobileGlow)">
                <animateMotion
                  dur="6s"
                  repeatCount="indefinite"
                  path="M 104 616 C 130 546, 270 554, 296 488 C 310 420, 120 428, 104 360 C 90 290, 280 298, 296 232 C 300 164, 210 172, 200 104"
                />
              </circle>
              <circle r="2" fill="#bae6fd" filter="url(#mobileGlow)">
                <animateMotion
                  dur="6s"
                  begin="-3s"
                  repeatCount="indefinite"
                  path="M 104 616 C 130 546, 270 554, 296 488 C 310 420, 120 428, 104 360 C 90 290, 280 298, 296 232 C 300 164, 210 172, 200 104"
                />
              </circle>
            </svg>

            {/* 5 Ascending 3D Planet Nodes */}
            {['angka', 'sains', 'cerita', 'tekateki', 'angkasa'].map(key => renderIslandUnit(key))}
          </div>
        </div>
      </main>

      <BottomNavDock />
    </div>
  );
}
