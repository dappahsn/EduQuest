import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { useAudio } from '../../context/AudioContext';
import styles from './SolarSystemBuilder.module.css';

// ---------------------------------------------------------------------------
// 8 PLANETS DATA WITH SCIENTIFIC ACCURACY & CHARACTERISTICS
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// 8 PLANETS DATA WITH SCIENTIFIC ACCURACY & CHARACTERISTICS
// ---------------------------------------------------------------------------
const ALL_PLANETS = {
  mercury: {
    id: 'mercury',
    name: 'Merkurius',
    order: 1,
    category: 'inner',
    image: '/images/planets/mercury.jpg',
    color: '#94a3b8',
    size: 26,
    nickname: 'Planet Terpanas & Terdingin',
    desc: 'Terdekat ke Matahari & terkecil',
    fact: 'Merkurius mengitari Matahari paling cepat: 1 tahun di sana hanya 88 hari Bumi!',
  },
  venus: {
    id: 'venus',
    name: 'Venus',
    order: 2,
    category: 'inner',
    image: '/images/planets/venus.jpg',
    color: '#fbbf24',
    size: 32,
    nickname: 'Bintang Kejora',
    desc: 'Planet terpanas penuh gas rumah kaca',
    fact: 'Venus diselimuti awan asam pekat dengan suhu 465°C, cukup panas untuk melelehkan timah!',
  },
  earth: {
    id: 'earth',
    name: 'Bumi',
    order: 3,
    category: 'inner',
    image: '/images/planets/earth.jpg',
    color: '#38bdf8',
    size: 34,
    nickname: 'Planet Biru',
    desc: 'Rumah samudra dan kehidupan kita',
    fact: 'Bumi berada di "Zona Layak Huni" (Goldilocks Zone), tepat untuk menjaga air tetap cair!',
  },
  mars: {
    id: 'mars',
    name: 'Mars',
    order: 4,
    category: 'inner',
    image: '/images/planets/mars.png',
    color: '#ef4444',
    size: 28,
    nickname: 'Planet Merah',
    desc: 'Berpasir karat besi & puncak es',
    fact: 'Mars memiliki gunung terbesar di tata surya, Olympus Mons, 3 kali lebih tinggi dari Everest!',
  },
  jupiter: {
    id: 'jupiter',
    name: 'Jupiter',
    order: 5,
    category: 'outer',
    image: '/images/planets/jupiter.png',
    color: '#fb923c',
    size: 52,
    nickname: 'Raja Planet Gas',
    desc: 'Raksasa terbesar dengan bintik merah',
    fact: 'Jupiter memiliki Bintik Merah Raksasa, badai angin dahsyat yang sudah berputar ratusan tahun!',
  },
  saturn: {
    id: 'saturn',
    name: 'Saturnus',
    order: 6,
    category: 'outer',
    image: '/images/planets/saturn.png',
    color: '#fcd34d',
    hasRing: true,
    size: 44,
    nickname: 'Permata Cincin Es',
    desc: 'Dikelilingi ribuan cincin es memukau',
    fact: 'Cincin Saturnus terbuat dari pecahan es dan batu beku. Kepadatan Saturnus lebih ringan dari air!',
  },
  uranus: {
    id: 'uranus',
    name: 'Uranus',
    order: 7,
    category: 'outer',
    image: '/images/planets/uranus.png',
    color: '#22d3ee',
    size: 36,
    nickname: 'Raksasa Es Miring',
    desc: 'Atmosfer metana cyan berotasi rebah',
    fact: 'Uranus berputar menyamping 98°, seolah menggelinding di lintasan orbitnya!',
  },
  neptune: {
    id: 'neptune',
    name: 'Neptunus',
    order: 8,
    category: 'outer',
    image: '/images/planets/neptune.png',
    color: '#3b82f6',
    size: 36,
    nickname: 'Penguasa Badai Biru',
    desc: 'Planet terluar berangin supersonik',
    fact: 'Neptunus butuh 165 tahun Bumi untuk sekali mengelilingi Matahari!',
  },
};

// ---------------------------------------------------------------------------
// 3 PROGRESSIVE SECTORS WITH CONCENTRIC ELLIPTICAL ORBITS
// ---------------------------------------------------------------------------
const SECTOR_DATA = [
  {
    sectorNum: 1,
    id: 'sector-1',
    title: 'Sektor 1: Planet Batuan Dalam',
    subtitle: 'Susun 4 planet batuan terdekat dengan Matahari!',
    hint: '💡 Gunakan jembatan keledai: Me-Ve-Bu-Ma (Merkurius ➔ Venus ➔ Bumi ➔ Mars)!',
    eduTitle: '🪐 Mengenal Planet Batuan (Terrestrial)',
    eduText: 'Empat planet pertama berukuran lebih padat dan memiliki permukaan berbatu padat. Merkurius adalah yang terkecil dan terdekat, disusul Venus yang terpanas, Bumi rumah samudra kita, dan Mars si planet merah!',
    sunX: 70,
    sunY: 190,
    sunR: 48,
    slots: [
      { order: 1, label: 'Orbit 1', expectedId: 'mercury', x: 215, y: 190, rx: 145, ry: 95, slotSize: 26, distanceAU: '0.39 AU' },
      { order: 2, label: 'Orbit 2', expectedId: 'venus', x: 365, y: 190, rx: 295, ry: 135, slotSize: 32, distanceAU: '0.72 AU' },
      { order: 3, label: 'Orbit 3', expectedId: 'earth', x: 525, y: 190, rx: 455, ry: 165, slotSize: 34, distanceAU: '1.00 AU' },
      { order: 4, label: 'Orbit 4', expectedId: 'mars', x: 690, y: 190, rx: 620, ry: 180, slotSize: 28, distanceAU: '1.52 AU' },
    ],
    initialAvailable: ['earth', 'mercury', 'mars', 'venus'],
  },
  {
    sectorNum: 2,
    id: 'sector-2',
    title: 'Sektor 2: Raksasa Gas & Es Terluar',
    subtitle: 'Melewati Sabuk Asteroid! Tempatkan 4 planet raksasa di orbit luarnya.',
    hint: '💡 Urutan raksasa luar: Jupiter (terbesar) ➔ Saturnus (cincin) ➔ Uranus (cyan miring) ➔ Neptunus (biru terluar)!',
    eduTitle: '🚀 Sabuk Asteroid & Raksasa Kosmik',
    eduText: 'Di antara Mars dan Jupiter terdapat jutaan batu antariksa yang disebut Sabuk Asteroid. Di luarnya adalah Planet Raksasa: Jupiter & Saturnus yang tersusun dari gas hidrogen-helium, serta Uranus & Neptunus sang raksasa es!',
    sunX: 60,
    sunY: 190,
    sunR: 42,
    astRx: 135,
    astRy: 85,
    slots: [
      { order: 5, label: 'Orbit 5', expectedId: 'jupiter', x: 280, y: 190, rx: 220, ry: 118, slotSize: 52, distanceAU: '5.20 AU' },
      { order: 6, label: 'Orbit 6', expectedId: 'saturn', x: 440, y: 190, rx: 380, ry: 148, slotSize: 44, distanceAU: '9.58 AU' },
      { order: 7, label: 'Orbit 7', expectedId: 'uranus', x: 590, y: 190, rx: 530, ry: 168, slotSize: 36, distanceAU: '19.2 AU' },
      { order: 8, label: 'Orbit 8', expectedId: 'neptune', x: 735, y: 190, rx: 675, ry: 182, slotSize: 36, distanceAU: '30.1 AU' },
    ],
    initialAvailable: ['neptune', 'jupiter', 'uranus', 'saturn'],
  },
  {
    sectorNum: 3,
    id: 'sector-3',
    title: 'Sektor 3: Rekonstruksi Harmoni Kosmik (8 Planet)',
    subtitle: 'Badai gravitasi mengacaukan orbit! Perbaiki susunan lengkap 8 planet dari Matahari.',
    hint: '💡 Urutan lengkap 8 planet dari Matahari: Merkurius (1) ➔ Venus (2) ➔ Bumi (3) ➔ Mars (4) ➔ [Asteroid] ➔ Jupiter (5) ➔ Saturnus (6) ➔ Uranus (7) ➔ Neptunus (8)!',
    eduTitle: '👑 Harmoni Agung Tata Surya Kita',
    eduText: 'Luar biasa! Seluruh 8 planet kini berada di orbitnya masing-masing! Berkat gravitasi Matahari yang mahakuasa, planet-planet mengorbit secara teratur selama miliaran tahun. Planet terdekat melaju cepat, sedangkan planet luar meluncur tenang!',
    sunX: 40,
    sunY: 190,
    sunR: 30,
    astRx: 345,
    astRy: 136,
    slots: [
      { order: 1, label: '1', expectedId: 'mercury', x: 120, y: 190, rx: 80, ry: 52, slotSize: 18, distanceAU: '0.39 AU' },
      { order: 2, label: '2', expectedId: 'venus', x: 185, y: 190, rx: 145, ry: 78, slotSize: 22, distanceAU: '0.72 AU' },
      { order: 3, label: '3', expectedId: 'earth', x: 255, y: 190, rx: 215, ry: 100, slotSize: 24, distanceAU: '1.00 AU' },
      { order: 4, label: '4', expectedId: 'mars', x: 325, y: 190, rx: 285, ry: 120, slotSize: 20, distanceAU: '1.52 AU' },
      { order: 5, label: '5', expectedId: 'jupiter', x: 445, y: 190, rx: 405, ry: 150, slotSize: 40, distanceAU: '5.20 AU' },
      { order: 6, label: '6', expectedId: 'saturn', x: 550, y: 190, rx: 510, ry: 164, slotSize: 34, distanceAU: '9.58 AU' },
      { order: 7, label: '7', expectedId: 'uranus', x: 650, y: 190, rx: 610, ry: 175, slotSize: 26, distanceAU: '19.2 AU' },
      { order: 8, label: '8', expectedId: 'neptune', x: 745, y: 190, rx: 705, ry: 184, slotSize: 26, distanceAU: '30.1 AU' },
    ],
    initialAvailable: [],
    initialScrambledPlaced: {
      1: 'earth',
      2: 'mercury',
      3: 'venus',
      4: 'jupiter',
      5: 'mars',
      6: 'neptune',
      7: 'saturn',
      8: 'uranus',
    },
  },
];

// ---------------------------------------------------------------------------
// REALISTIC 3D PLANET GRAPHIC WITH NASA PHOTOGRAPHY
// ---------------------------------------------------------------------------
function RealisticPlanet({ planetKey, size = 30, uniqueId = '' }) {
  const p = ALL_PLANETS[planetKey];
  if (!p) return null;

  // Saturn: Authentic Hubble high-res photograph with wide open rings
  if (p.hasRing) {
    const ringW = size * 2.3;
    const ringH = ringW * (319 / 800); // 800x319 aspect ratio
    return (
      <g className={styles.realisticPlanetSaturn} pointerEvents="none">
        <image
          href={p.image}
          x={-ringW / 2}
          y={-ringH / 2}
          width={ringW}
          height={ringH}
          preserveAspectRatio="xMidYMid meet"
          style={{ filter: 'drop-shadow(0 0 8px rgba(251, 191, 36, 0.45))' }}
        />
      </g>
    );
  }

  const r = size / 2;
  const clipId = `clip-planet-${planetKey}${uniqueId ? '-' + uniqueId : ''}`;

  return (
    <g className={styles.realisticPlanetSphere} pointerEvents="none">
      <defs>
        <clipPath id={clipId}>
          <circle cx="0" cy="0" r={r} />
        </clipPath>
      </defs>

      {/* Atmospheric outer glow rim */}
      <circle
        cx="0"
        cy="0"
        r={r + 1.2}
        fill="none"
        stroke={p.color}
        strokeWidth="1.2"
        opacity="0.85"
        style={{ filter: `drop-shadow(0 0 5px ${p.color})` }}
      />

      {/* True-color NASA Planetary Sphere with 3D Spherical Terminator Shadow */}
      <g clipPath={`url(#${clipId})`}>
        <image
          href={p.image}
          x={-r}
          y={-r}
          width={size}
          height={size}
          preserveAspectRatio="xMidYMid slice"
        />
        {/* 3D Spherical Lighting Overlay: highlight facing Sun & terminator shadow */}
        <circle cx="0" cy="0" r={r} fill="url(#spherical-shadow)" />
      </g>
    </g>
  );
}

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------
export default function SolarSystemBuilder({ onGameComplete = null, questId: propQuestId }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const targetQuestId = propQuestId || searchParams.get('questId') || 'quest-ap-1';

  const { completeQuest } = useGame();
  const { playSfx } = useAudio();

  // Sector state
  const [currentSectorIdx, setCurrentSectorIdx] = useState(0);
  const currentSector = SECTOR_DATA[currentSectorIdx];

  // Placed map: { [orderNum]: planetKey }
  const [placedSlots, setPlacedSlots] = useState({});

  // Available planet keys in bottom tray
  const [availablePlanets, setAvailablePlanets] = useState([]);

  // Selected planet key (active in hand)
  const [selectedPlanetKey, setSelectedPlanetKey] = useState(null);

  // UI state
  const [showHint, setShowHint] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState(currentSector.subtitle);
  const [statusType, setStatusType] = useState('idle');
  const [arenaAnim, setArenaAnim] = useState('');
  const [showSectorSuccess, setShowSectorSuccess] = useState(false);
  const [showGameComplete, setShowGameComplete] = useState(false);
  const [isSimulatingOrbit, setIsSimulatingOrbit] = useState(false);

  // Initialize sector
  useEffect(() => {
    const sec = SECTOR_DATA[currentSectorIdx];
    if (sec.initialScrambledPlaced) {
      setPlacedSlots({ ...sec.initialScrambledPlaced });
      setAvailablePlanets([]);
    } else {
      setPlacedSlots({});
      setAvailablePlanets([...sec.initialAvailable]);
    }
    setSelectedPlanetKey(null);
    setShowHint(false);
    setFeedbackMsg(sec.subtitle);
    setStatusType('idle');
    setArenaAnim('');
    setShowSectorSuccess(false);
    setIsSimulatingOrbit(false);
  }, [currentSectorIdx]);

  // Click a planet in the tray
  const handleSelectPlanetInTray = (planetKey) => {
    playSfx('button-click');
    if (selectedPlanetKey === planetKey) {
      setSelectedPlanetKey(null);
      setFeedbackMsg(currentSector.subtitle);
    } else {
      setSelectedPlanetKey(planetKey);
      const p = ALL_PLANETS[planetKey];
      setFeedbackMsg(`🪐 ${p.name} dipilih! Ketuk slot orbit yang cocok di lintasan.`);
      setStatusType('idle');
    }
  };

  // Click an orbit slot in the arena
  const handleSlotClick = (slot) => {
    playSfx('button-click');

    // Case 1: In Sector 3 (Swap mode between 2 slots)
    if (currentSector.sectorNum === 3) {
      const currentInSlot = placedSlots[slot.order];

      if (selectedPlanetKey) {
        if (selectedPlanetKey === currentInSlot) {
          // Deselect if clicking the same planet
          setSelectedPlanetKey(null);
          setFeedbackMsg(currentSector.subtitle);
          return;
        }

        // Find which slot holds selectedPlanetKey
        const sourceSlotOrder = Object.keys(placedSlots).find((k) => placedSlots[k] === selectedPlanetKey);
        const targetCurrentPlanet = currentInSlot;

        const updated = { ...placedSlots };
        if (sourceSlotOrder) {
          updated[sourceSlotOrder] = targetCurrentPlanet;
        }
        updated[slot.order] = selectedPlanetKey;
        setPlacedSlots(updated);
        setSelectedPlanetKey(null);
        setFeedbackMsg(`Orbit ${slot.order} ditukar! Cek susunan lintasan.`);
      } else {
        // Select planet currently in this slot to move/swap
        if (currentInSlot) {
          setSelectedPlanetKey(currentInSlot);
          const p = ALL_PLANETS[currentInSlot];
          setFeedbackMsg(`🪐 ${p.name} di Orbit ${slot.order} dipilih. Ketuk slot lain untuk menukarnya!`);
        }
      }
      return;
    }

    // Case 2: Sector 1 and 2 (Tray to Slot)
    const existingInSlot = placedSlots[slot.order];

    if (selectedPlanetKey) {
      // Place selected planet into this slot
      const newPlaced = { ...placedSlots, [slot.order]: selectedPlanetKey };
      setPlacedSlots(newPlaced);

      // If slot previously had a planet, return it to tray
      let newAvailable = availablePlanets.filter((p) => p !== selectedPlanetKey);
      if (existingInSlot && existingInSlot !== selectedPlanetKey) {
        newAvailable = [...newAvailable, existingInSlot];
      }
      setAvailablePlanets(newAvailable);
      setSelectedPlanetKey(null);

      const p = ALL_PLANETS[selectedPlanetKey];
      setFeedbackMsg(`✨ ${p.name} ditempatkan di ${slot.label}!`);
    } else if (existingInSlot) {
      // Pick up planet from slot back to tray
      const newPlaced = { ...placedSlots };
      delete newPlaced[slot.order];
      setPlacedSlots(newPlaced);
      setAvailablePlanets([...availablePlanets, existingInSlot]);
      setSelectedPlanetKey(existingInSlot);
      const p = ALL_PLANETS[existingInSlot];
      setFeedbackMsg(`🪐 ${p.name} diangkat dari ${slot.label}.`);
    }
  };

  // Reset current sector
  const handleResetSector = () => {
    playSfx('button-click');
    const sec = SECTOR_DATA[currentSectorIdx];
    if (sec.initialScrambledPlaced) {
      setPlacedSlots({ ...sec.initialScrambledPlaced });
      setAvailablePlanets([]);
    } else {
      setPlacedSlots({});
      setAvailablePlanets([...sec.initialAvailable]);
    }
    setSelectedPlanetKey(null);
    setFeedbackMsg(sec.subtitle);
    setStatusType('idle');
    setArenaAnim('');
    setIsSimulatingOrbit(false);
  };

  // Check answers
  const handleCheckAnswer = useCallback(() => {
    // Verify all slots filled
    const allFilled = currentSector.slots.every((s) => Boolean(placedSlots[s.order]));
    if (!allFilled) {
      playSfx('wrong');
      setFeedbackMsg('⚠️ Masih ada orbit yang kosong! Tempatkan semua planet terlebih dahulu.');
      setStatusType('error');
      setArenaAnim('error');
      setTimeout(() => setArenaAnim(''), 500);
      return;
    }

    // Check accuracy
    const mistakes = currentSector.slots.filter((s) => placedSlots[s.order] !== s.expectedId);

    if (mistakes.length === 0) {
      // Perfect!
      playSfx('correct');
      setFeedbackMsg('🎉 Sempurna! Seluruh orbit kosmik selaras dan seimbang!');
      setStatusType('success');
      setArenaAnim('success');
      setIsSimulatingOrbit(true);
      setTimeout(() => setShowSectorSuccess(true), 1200);
    } else {
      playSfx('wrong');
      setArenaAnim('error');
      setTimeout(() => setArenaAnim(''), 500);

      const firstWrong = mistakes[0];
      const actualPlanet = ALL_PLANETS[placedSlots[firstWrong.order]];
      setFeedbackMsg(
        `❌ Belum tepat! ${actualPlanet.name} bukan di Orbit ${firstWrong.order}. Periksa urutan jaraknya!`
      );
      setStatusType('error');
    }
  }, [currentSector, placedSlots, playSfx]);

  // Next sector navigation
  const handleNextSector = () => {
    if (currentSectorIdx < SECTOR_DATA.length - 1) {
      playSfx('level-up');
      setCurrentSectorIdx((prev) => prev + 1);
    } else {
      playSfx('quest-complete');
      setShowGameComplete(true);
      completeQuest(targetQuestId, 100, 160, 45, 'card-sun');
    }
  };

  return (
    <div className={styles.gameContainer}>
      {/* Top Bar */}
      <div className={styles.topBar}>
        <div className={styles.sectorBadgeWrap}>
          <span className={styles.sectorBadge}>Sektor {currentSector.sectorNum} / 3</span>
          <h2 className={styles.sectorTitle}>{currentSector.title}</h2>
        </div>

        <div className={styles.topActions}>
          <button
            type="button"
            className={`${styles.iconBtn} ${showHint ? styles.iconBtnActive : ''}`}
            onClick={() => setShowHint((prev) => !prev)}
            title="Buka Petunjuk Sains"
          >
            <span>💡</span>
            <span>Petunjuk</span>
          </button>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={handleResetSector}
            title="Reset Posisi Planet"
          >
            <span>↺</span>
            <span>Ulangi</span>
          </button>
        </div>
      </div>

      {/* Status / Hint Banner */}
      {showHint ? (
        <div className={styles.hintBanner}>
          <span style={{ fontSize: '1.1rem' }}>💡</span>
          <div className={styles.hintText}>{currentSector.hint}</div>
          <button type="button" className={styles.hintClose} onClick={() => setShowHint(false)}>✕</button>
        </div>
      ) : (
        <div className={`${styles.statusBanner} ${statusType === 'success' ? styles.statusSuccess : ''} ${statusType === 'error' ? styles.statusError : ''}`}>
          <span>
            {statusType === 'success' && '✨'}
            {statusType === 'error' && '⚠️'}
            {statusType === 'idle' && '🚀'}
          </span>
          <span>{feedbackMsg}</span>
        </div>
      )}

      {/* Cosmic Stage Arena */}
      <div
        className={`${styles.arena} ${arenaAnim === 'success' ? styles.successPulse : ''} ${arenaAnim === 'error' ? styles.errorShake : ''}`}
      >
        <svg
          className={styles.orbitSvg}
          viewBox="0 0 820 380"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            {/* Sun Corona Gradients & Filter */}
            <radialGradient id="sun-outer-corona" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#ea580c" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#7c2d12" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="sun-corona-flare" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fffbeb" stopOpacity="0.9" />
              <stop offset="45%" stopColor="#fbbf24" stopOpacity="0.55" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="sun-surface-overlay" cx="35%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#fffbeb" stopOpacity="0.15" />
              <stop offset="60%" stopColor="#f59e0b" stopOpacity="0" />
              <stop offset="100%" stopColor="#b91c1c" stopOpacity="0.55" />
            </radialGradient>
            <filter id="sun-glow" x="-50%" y="-50%" width="200%" height="200%">
              <feGaussianBlur stdDeviation="8" result="glow" />
              <feComposite in="SourceGraphic" in2="glow" operator="over" />
            </filter>

            {/* 3D Spherical Terminator Shadow & Specular Highlight */}
            <radialGradient id="spherical-shadow" cx="32%" cy="30%" r="68%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.22" />
              <stop offset="40%" stopColor="#ffffff" stopOpacity="0" />
              <stop offset="70%" stopColor="#000000" stopOpacity="0.48" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0.9" />
            </radialGradient>
          </defs>

          {/* Concentric Elliptical Orbit Tracks (Curving around the Sun) */}
          {currentSector.slots.map((slot) => {
            const isTargeted = Boolean(selectedPlanetKey);
            const isPlaced = Boolean(placedSlots[slot.order]);
            const isSelectedSlot = selectedPlanetKey && placedSlots[slot.order] === selectedPlanetKey;

            return (
              <ellipse
                key={`ellipse-${slot.order}`}
                cx={currentSector.sunX}
                cy={currentSector.sunY}
                rx={slot.rx}
                ry={slot.ry}
                className={`${styles.orbitEllipse} ${
                  isSimulatingOrbit
                    ? styles.orbitEllipseSuccess
                    : isSelectedSlot
                    ? styles.orbitEllipseActive
                    : isTargeted && !isPlaced
                    ? styles.orbitEllipseTargeted
                    : ''
                }`}
              />
            );
          })}

          {/* Asteroid Belt representation in Sector 2 and 3 */}
          {currentSector.astRx && (
            <g className={styles.asteroidBeltGroup}>
              {/* Dual concentric dashed curves for asteroid dust field */}
              <ellipse
                cx={currentSector.sunX}
                cy={currentSector.sunY}
                rx={currentSector.astRx - 4}
                ry={currentSector.astRy - 3}
                className={styles.asteroidBeltOuter}
              />
              <ellipse
                cx={currentSector.sunX}
                cy={currentSector.sunY}
                rx={currentSector.astRx}
                ry={currentSector.astRy}
                className={styles.asteroidBeltMain}
              />
              <ellipse
                cx={currentSector.sunX}
                cy={currentSector.sunY}
                rx={currentSector.astRx + 4}
                ry={currentSector.astRy + 3}
                className={styles.asteroidBeltInner}
              />
              {/* Asteroid Belt Header text */}
              <text
                x={currentSector.sunX + currentSector.astRx}
                y={currentSector.sunY - (currentSector.sectorNum === 3 ? 46 : 38)}
                textAnchor="middle"
                fill="#cbd5e1"
                fontSize="8"
                fontWeight="800"
                letterSpacing="0.8"
                opacity="0.85"
              >
                ☄️ SABUK ASTEROID
              </text>
            </g>
          )}

          {/* Glowing Space Sun with Photorealistic SDO Image (Left Focus Anchor) */}
          <g transform={`translate(${currentSector.sunX}, ${currentSector.sunY})`} className={styles.sunCorona}>
            {/* Outer solar corona heat glow */}
            <circle
              cx="0"
              cy="0"
              r={currentSector.sunR + 24}
              fill="url(#sun-outer-corona)"
              opacity="0.35"
              filter="url(#sun-glow)"
            />
            <circle
              cx="0"
              cy="0"
              r={currentSector.sunR + 12}
              fill="url(#sun-corona-flare)"
              opacity="0.65"
            />

            {/* True Color SDO Photosphere with circular clip */}
            <clipPath id="sun-sphere-clip">
              <circle cx="0" cy="0" r={currentSector.sunR} />
            </clipPath>

            <g clipPath="url(#sun-sphere-clip)">
              <image
                href="/images/planets/sun.jpg"
                x={-currentSector.sunR}
                y={-currentSector.sunR}
                width={currentSector.sunR * 2}
                height={currentSector.sunR * 2}
                preserveAspectRatio="xMidYMid slice"
              />
              {/* Solar surface fiery overlay */}
              <circle
                cx="0"
                cy="0"
                r={currentSector.sunR}
                fill="url(#sun-surface-overlay)"
                opacity="0.3"
              />
            </g>

            {/* Glowing solar rim */}
            <circle
              cx="0"
              cy="0"
              r={currentSector.sunR}
              fill="none"
              stroke="#fef08a"
              strokeWidth="1.8"
              opacity="0.9"
            />

            {/* Sun label */}
            <text
              x="0"
              y={currentSector.sunR + 18}
              textAnchor="middle"
              fill="#fef08a"
              fontSize="10"
              fontWeight="900"
              letterSpacing="0.5"
            >
              Matahari ☀️
            </text>
          </g>

          {/* Orbit Slots with Realistic Planets */}
          {currentSector.slots.map((slot) => {
            const placedKey = placedSlots[slot.order];
            const isTargeted = Boolean(selectedPlanetKey);
            const isSelectedSlot = selectedPlanetKey && placedKey === selectedPlanetKey;
            const slotR = Math.max(slot.slotSize / 2 + 4, 18);

            return (
              <g
                key={`slot-${slot.order}`}
                transform={`translate(${slot.x}, ${slot.y})`}
                className={styles.orbitSlotWrap}
                onClick={() => handleSlotClick(slot)}
              >
                {/* Orbit number header above slot */}
                <text
                  x="0"
                  y={-slotR - 10}
                  textAnchor="middle"
                  fill="#93c5fd"
                  fontSize="9.5"
                  fontWeight="800"
                  letterSpacing="0.3"
                  pointerEvents="none"
                >
                  {slot.label}
                </text>

                {/* Stable transparent hitbox */}
                <circle cx="0" cy="0" r={slotR + 12} fill="transparent" pointerEvents="all" />

                {/* Target pulsating cue when user has planet ready */}
                {isTargeted && !placedKey && (
                  <circle
                    cx="0"
                    cy="0"
                    r={slotR + 5}
                    fill="rgba(56, 189, 248, 0.1)"
                    stroke="#38bdf8"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    className={styles.slotTargetGlow}
                    pointerEvents="none"
                  />
                )}

                  {/* Slot base ring (static) */}
                  <circle
                    cx="0"
                    cy="0"
                    r={slotR}
                    fill={placedKey ? 'rgba(15, 23, 42, 0.88)' : 'rgba(15, 23, 42, 0.65)'}
                    stroke={
                      isSelectedSlot
                        ? '#fbbf24'
                        : placedKey
                        ? '#38bdf8'
                        : isTargeted
                        ? 'rgba(56, 189, 248, 0.7)'
                        : 'rgba(147, 197, 253, 0.28)'
                    }
                    strokeWidth={isSelectedSlot ? 2.5 : placedKey ? 1.5 : 1.2}
                    strokeDasharray={placedKey ? undefined : '3 3'}
                    className={styles.slotBaseRing}
                    pointerEvents="none"
                  />

                  {/* Render Photorealistic Planet or Empty Orbit Plus Cue */}
                  {placedKey ? (
                    <RealisticPlanet
                      planetKey={placedKey}
                      size={slot.slotSize}
                      uniqueId={`s${currentSector.sectorNum}-${slot.order}`}
                    />
                  ) : (
                    <text
                      x="0"
                      y="1"
                      textAnchor="middle"
                      fill="rgba(147, 197, 253, 0.65)"
                      fontSize="13"
                      fontWeight="900"
                      dominantBaseline="central"
                      pointerEvents="none"
                    >
                      +
                    </text>
                  )}

                  {/* Labels underneath the slot */}
                  <g pointerEvents="none">
                    <text
                      x="0"
                      y={slotR + 14}
                      textAnchor="middle"
                      fill={placedKey ? '#f8fafc' : '#64748b'}
                      fontSize={placedKey ? '10' : '8.5'}
                      fontWeight={placedKey ? '800' : '700'}
                    >
                      {placedKey ? ALL_PLANETS[placedKey]?.name : 'Kosong'}
                    </text>
                    <text
                      x="0"
                      y={slotR + 25}
                      textAnchor="middle"
                      fill="#64748b"
                      fontSize="7.5"
                      fontWeight="700"
                    >
                      {slot.distanceAU}
                    </text>
                  </g>
                </g>
            );
          })}
        </svg>
      </div>

      {/* Planet Choice Tray (Sectors 1 & 2 use tray; Sector 3 uses direct slot-swap) */}
      <div className={styles.trayWrap}>
        <div className={styles.trayHeader}>
          <span className={styles.trayTitle}>
            {currentSector.sectorNum === 3 ? 'Mode Tukar Posisi (Swap):' : 'Pilihan Planet Tersedia:'}
          </span>
          <span className={styles.trayInstructions}>
            {currentSector.sectorNum === 3
              ? 'Ketuk dua planet berurutan di arena untuk menukar orbitnya!'
              : 'Pilih planet lalu ketuk slot orbitnya di atas'}
          </span>
        </div>

        {/* Planet cards grid with realistic 3D thumbnails */}
        <div className={styles.planetsGrid}>
          {(currentSector.sectorNum === 3
            ? currentSector.slots.map((s) => placedSlots[s.order]).filter(Boolean)
            : currentSector.initialAvailable
          ).map((pKey) => {
            const p = ALL_PLANETS[pKey];
            if (!p) return null;
            const isPlaced = Object.values(placedSlots).includes(pKey);
            const isSelected = selectedPlanetKey === pKey;

            return (
              <button
                key={p.id}
                type="button"
                className={`${styles.planetCard} ${isSelected ? styles.planetCardSelected : ''} ${
                  isPlaced && currentSector.sectorNum !== 3 ? styles.planetCardPlaced : ''
                }`}
                onClick={() => handleSelectPlanetInTray(pKey)}
                disabled={isPlaced && currentSector.sectorNum !== 3}
              >
                <div className={styles.planetCardThumbWrap}>
                  <img
                    src={p.image}
                    alt={p.name}
                    className={p.hasRing ? styles.saturnThumbImg : styles.planetThumbImg}
                  />
                  {!p.hasRing && <div className={styles.sphereShadowOverlay} />}
                </div>
                <div className={styles.planetCardMeta}>
                  <span className={styles.planetCardName}>{p.name}</span>
                  <span className={styles.planetCardDesc}>{p.desc}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Bottom controls */}
        <div className={styles.bottomControls}>
          <div className={styles.sectorDots}>
            {SECTOR_DATA.map((sec, idx) => (
              <div
                key={sec.id}
                className={`${styles.sectorDot} ${
                  idx === currentSectorIdx ? styles.sectorDotActive : ''
                } ${idx < currentSectorIdx ? styles.sectorDotDone : ''}`}
              />
            ))}
          </div>

          <button
            type="button"
            className={styles.btnPrimary}
            onClick={handleCheckAnswer}
            disabled={showSectorSuccess}
          >
            <span>🛰️</span>
            <span>
              {currentSector.sectorNum === 3
                ? 'Uji Harmoni Orbit Kosmik'
                : 'Kunci Susunan Orbit'}
            </span>
          </button>
        </div>
      </div>

      {/* Sector Success Modal */}
      {showSectorSuccess && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalCard}>
            <div className={styles.modalIcon}>🪐✨</div>
            <span className={styles.modalBadge}>Sektor Berhasil Ditembus!</span>
            <h3 className={styles.modalTitle}>{currentSector.title}</h3>
            <p className={styles.modalDesc}>
              Hebat! Seluruh planet pada sektor ini telah mengorbit dengan jarak dan kecepatan yang harmonis.
            </p>

            <div className={styles.eduBox}>
              <div className={styles.eduTitle}>{currentSector.eduTitle}</div>
              <div className={styles.eduContent}>{currentSector.eduText}</div>
            </div>

            <button
              type="button"
              className={styles.btnModalNext}
              onClick={handleNextSector}
            >
              {currentSectorIdx < SECTOR_DATA.length - 1
                ? 'Lanjut ke Sektor Berikutnya ➔'
                : 'Selesaikan Misi Tata Surya 🏆'}
            </button>
          </div>
        </div>
      )}

      {/* Final Mission Complete Modal */}
      {showGameComplete && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalCard}>
            <div className={styles.modalIcon}>☀️🌌</div>
            <span className={styles.modalBadge}>Misi Kosmik Selesai!</span>
            <h3 className={styles.modalTitle}>Master Arsitek Tata Surya</h3>
            <p className={styles.modalDesc}>
              Luar biasa penjelajah! Kamu berhasil menata seluruh 8 planet tata surya dengan presisi ilmiah yang sempurna!
            </p>

            <div className={styles.rewardGrid}>
              <div className={styles.rewardPill}>
                <span className={styles.rewardVal}>+160</span>
                <span className={styles.rewardLabel}>XP Kosmik</span>
              </div>
              <div className={styles.rewardPill}>
                <span className={styles.rewardVal}>+45</span>
                <span className={styles.rewardLabel}>Koin Emas</span>
              </div>
              <div className={styles.rewardPill}>
                <span className={styles.rewardVal}>☀️</span>
                <span className={styles.rewardLabel}>Kartu Matahari</span>
              </div>
              <div className={styles.rewardPill}>
                <span className={styles.rewardVal}>⭐</span>
                <span className={styles.rewardLabel}>3 Bintang</span>
              </div>
            </div>

            <button
              type="button"
              className={styles.btnModalNext}
              onClick={() => {
                if (onGameComplete) onGameComplete();
                else navigate('/world/angkasa-pengetahuan');
              }}
            >
              Kembali ke Angkasa Pengetahuan 🚀
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
