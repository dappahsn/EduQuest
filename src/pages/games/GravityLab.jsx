import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { useAudio } from '../../context/AudioContext';
import styles from './GravityLab.module.css';

// ---------------------------------------------------------------------------
// TEST OBJECTS DATA
// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// TEST OBJECTS DATA WITH 3D ASSETS
// ---------------------------------------------------------------------------
const TEST_OBJECTS = [
  { id: 'raka', name: 'Astronot', mass: 72, emoji: '👨‍🚀', image: '/images/raka-astronaut.png' },
  { id: 'rover', name: 'Rover', mass: 180, emoji: '🚜', image: '/images/items/rover_3d.jpg' },
  { id: 'meteorite', name: 'Meteorit', mass: 12, emoji: '🪨', image: '/images/items/meteorite_3d.jpg' },
  { id: 'tank', name: 'Ransel', mass: 24, emoji: '🎒', image: '/images/items/oxygen_tank_3d.jpg' },
];

// ---------------------------------------------------------------------------
// 3D HELICAL SPRING & SCALE MECHANISM COMPONENT
// ---------------------------------------------------------------------------
function SpringScale3D({ stretch, isEarth, activeObj }) {
  const numTurns = 6;
  const baseHeight = 52;
  const totalH = baseHeight + stretch;
  const turnH = totalH / numTurns;
  const startY = 30;
  const leftX = 74;
  const rightX = 126;
  const yCoilEnd = startY + totalH;

  const backLoops = [];
  const frontLoops = [];

  for (let i = 0; i < numTurns; i++) {
    const y0 = startY + i * turnH;
    const yMid = y0 + turnH * 0.5;
    const y1 = y0 + turnH;

    // Back half of helical turn (darker shaded metallic cylinder)
    backLoops.push(
      <path
        key={`back-${i}`}
        d={`M ${leftX} ${y0} C ${leftX} ${y0 - turnH * 0.28} ${rightX} ${y0} ${rightX} ${yMid}`}
        fill="none"
        stroke={isEarth ? 'url(#spring-earth-back)' : 'url(#spring-moon-back)'}
        strokeWidth="5"
        strokeLinecap="round"
      />
    );

    // Front half of helical turn (bright 3D cylindrical specular highlight & shadow)
    frontLoops.push(
      <path
        key={`front-${i}`}
        d={`M ${rightX} ${yMid} C ${rightX} ${y0 + turnH * 1.28} ${leftX} ${y0 + turnH} ${leftX} ${y1}`}
        fill="none"
        stroke={isEarth ? 'url(#spring-earth-front)' : 'url(#spring-moon-front)'}
        strokeWidth="6.5"
        strokeLinecap="round"
        filter="url(#coil-shadow)"
      />
    );
  }

  const clipId = `item-clip-${isEarth ? 'earth' : 'moon'}`;

  return (
    <svg className={styles.springSvg} viewBox="0 0 200 255">
      <defs>
        {/* Metallic Chrome Gradient for Anchor & Carabiner */}
        <linearGradient id="chrome-mount-grad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#334155" />
          <stop offset="25%" stopColor="#64748b" />
          <stop offset="50%" stopColor="#f8fafc" />
          <stop offset="75%" stopColor="#64748b" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>

        {/* 3D Earth Spring (Cyan/Blue Chrome Cylinder) */}
        <linearGradient id="spring-earth-front" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="25%" stopColor="#e0f2fe" />
          <stop offset="55%" stopColor="#0284c7" />
          <stop offset="100%" stopColor="#0369a1" />
        </linearGradient>
        <linearGradient id="spring-earth-back" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#075985" />
          <stop offset="100%" stopColor="#082f49" />
        </linearGradient>

        {/* 3D Moon Spring (Golden Brass Chrome Cylinder) */}
        <linearGradient id="spring-moon-front" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="25%" stopColor="#fef9c3" />
          <stop offset="55%" stopColor="#ca8a04" />
          <stop offset="100%" stopColor="#854d0e" />
        </linearGradient>
        <linearGradient id="spring-moon-back" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#713f12" />
          <stop offset="100%" stopColor="#451a03" />
        </linearGradient>

        {/* 3D Tray Radial Gradient */}
        <radialGradient id={`tray-grad-${isEarth ? 'earth' : 'moon'}`} cx="50%" cy="30%" r="70%">
          <stop offset="0%" stopColor={isEarth ? '#38bdf8' : '#fde047'} stopOpacity="0.55" />
          <stop offset="60%" stopColor="#0f172a" stopOpacity="0.95" />
          <stop offset="100%" stopColor={isEarth ? '#0284c7' : '#ca8a04'} stopOpacity="0.9" />
        </radialGradient>

        <filter id="coil-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2.5" stdDeviation="2" floodColor="#000000" floodOpacity="0.75" />
        </filter>

        <clipPath id={clipId}>
          <rect x="68" y={yCoilEnd - 18} width="64" height="64" rx="16" />
        </clipPath>
      </defs>

      {/* Top 3D Ceiling Mount Bracket */}
      <rect x="55" y="4" width="90" height="12" rx="4" fill="url(#chrome-mount-grad)" stroke="#94a3b8" strokeWidth="1" />
      <circle cx="68" cy="10" r="2.5" fill="#f8fafc" stroke="#334155" strokeWidth="1" />
      <circle cx="132" cy="10" r="2.5" fill="#f8fafc" stroke="#334155" strokeWidth="1" />
      {/* Heavy mount eyelet */}
      <circle cx="100" cy="19" r="5.5" fill="none" stroke="url(#chrome-mount-grad)" strokeWidth="3.5" />
      <line x1="100" y1="24.5" x2="74" y2={startY} stroke="url(#chrome-mount-grad)" strokeWidth="5" strokeLinecap="round" />

      {/* 3D Helical Coil Spring */}
      <g>
        {backLoops}
        {frontLoops}
      </g>

      {/* Transition Hook from Coil to Center */}
      <path
        d={`M ${leftX} ${yCoilEnd} Q ${leftX} ${yCoilEnd + 12} 100 ${yCoilEnd + 12}`}
        fill="none"
        stroke={isEarth ? 'url(#spring-earth-front)' : 'url(#spring-moon-front)'}
        strokeWidth="5"
        strokeLinecap="round"
      />

      {/* 3D Tension Carabiner / Gauge Hub */}
      <g transform={`translate(100, ${yCoilEnd + 24})`}>
        <circle cx="0" cy="0" r="13" fill="#090d16" stroke="url(#chrome-mount-grad)" strokeWidth="2.5" />
        <circle cx="0" cy="0" r="9.5" fill="none" stroke={isEarth ? '#38bdf8' : '#facc15'} strokeWidth="1.2" strokeDasharray="2 2" />
        <circle cx="0" cy="0" r="2.5" fill="#f8fafc" />
        <line x1="0" y1="0" x2="0" y2="7" stroke={isEarth ? '#38bdf8' : '#facc15'} strokeWidth="2" strokeLinecap="round" />
        <path d="M -9 -3 A 9 9 0 0 1 9 -3" fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />
      </g>

      {/* Suspension Cables to 3D Tray */}
      <line x1="100" y1={yCoilEnd + 37} x2="62" y2={yCoilEnd + 54} stroke="url(#chrome-mount-grad)" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="100" y1={yCoilEnd + 37} x2="138" y2={yCoilEnd + 54} stroke="url(#chrome-mount-grad)" strokeWidth="1.8" strokeLinecap="round" />

      {/* 3D Elliptical Platform Tray */}
      <ellipse
        cx="100"
        cy={yCoilEnd + 54}
        rx="46"
        ry="10"
        fill={`url(#tray-grad-${isEarth ? 'earth' : 'moon'})`}
        stroke={isEarth ? '#38bdf8' : '#facc15'}
        strokeWidth="2.5"
      />
      <ellipse cx="100" cy={yCoilEnd + 53} rx="38" ry="6.5" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.4" />

      {/* Contact Shadow under the 3D Item on the Tray */}
      <ellipse cx="100" cy={yCoilEnd + 50} rx="26" ry="5" fill="#000000" opacity="0.85" />

      {/* 3D Item Image resting on Tray */}
      <g>
        <image
          href={activeObj.image}
          x="68"
          y={yCoilEnd - 18}
          width="64"
          height="64"
          preserveAspectRatio="xMidYMid slice"
          clipPath={`url(#${clipId})`}
        />
        {/* 3D Glass Specular Ring around Image */}
        <rect
          x="68"
          y={yCoilEnd - 18}
          width="64"
          height="64"
          rx="16"
          fill="none"
          stroke={isEarth ? 'rgba(56, 189, 248, 0.75)' : 'rgba(254, 240, 138, 0.75)'}
          strokeWidth="2.5"
        />
      </g>

      {/* Item Name Label under Platform */}
      <text
        x="100"
        y={yCoilEnd + 74}
        textAnchor="middle"
        fill={isEarth ? '#f8fafc' : '#fef08a'}
        fontSize="11"
        fontWeight="900"
        letterSpacing="0.2px"
      >
        {isEarth ? activeObj.name : `${activeObj.name} (6× Lebih Ringan)`}
      </text>
    </svg>
  );
}

// ---------------------------------------------------------------------------
// SECTORS CURRICULUM DEFINITIONS (SIMPLE & CONCISE)
// ---------------------------------------------------------------------------
const SECTORS = [
  {
    sectorNum: 1,
    title: 'Sektor 1: Neraca Pegas',
    hint: '💡 Gravitasi Bulan = 1/6 Bumi. Maka berat di Bulan = berat di Bumi ÷ 6.',
    eduTitle: '⚖️ Massa vs Berat',
    eduText: 'Massa benda selalu sama di mana pun, tetapi berat di Bulan 6× lebih ringan!',
  },
  {
    sectorNum: 2,
    title: 'Sektor 2: Lompatan & Ruang Hampa',
    hint: '💡 Di Bulan kamu melompat 6× lebih tinggi. Tanpa udara, semua benda jatuh bersamaan!',
    eduTitle: '🪶 Uji Jatuh Apollo 15',
    eduText: 'Di ruang hampa tanpa udara, bulu dan palu jatuh dengan kecepatan yang sama persis!',
  },
  {
    sectorNum: 3,
    title: 'Sektor 3: Keseimbangan Jungkat-Jungkit',
    hint: '💡 Karena gravitasi Bulan 1/6 Bumi, butuh 6 Rover di Bulan untuk mengimbangi 1 Rover di Bumi.',
    eduTitle: '👑 Keseimbangan Kosmik',
    eduText: 'Tepat! 6 Rover di Bulan memiliki berat yang sama dengan 1 Rover di Bumi.',
  },
];

export default function GravityLab({ onGameComplete = null, questId: propQuestId }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const targetQuestId = propQuestId || searchParams.get('questId') || 'quest-ap-2';

  const { completeQuest } = useGame();
  const { playSfx } = useAudio();

  // Sector State
  const [currentSectorIdx, setCurrentSectorIdx] = useState(0);
  const currentSector = SECTORS[currentSectorIdx];

  // UI State
  const [showHint, setShowHint] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState(currentSector.subtitle);
  const [statusType, setStatusType] = useState('idle');
  const [showSectorSuccess, setShowSectorSuccess] = useState(false);
  const [showGameComplete, setShowGameComplete] = useState(false);

  // Sector 1 State: Spring scale & quiz
  const [selectedObjId, setSelectedObjId] = useState('raka');
  const [sec1QuizAnswer, setSec1QuizAnswer] = useState(null);

  // Sector 2 State: Jump & drop animations
  const [jumpProgress, setJumpProgress] = useState({ earth: 0, moon: 0 });
  const [isJumping, setIsJumping] = useState(false);
  const [dropProgress, setDropProgress] = useState({ hammer: 0, featherEarth: 0, featherMoon: 0 });
  const [isDropping, setIsDropping] = useState(false);
  const [activeTestMode, setActiveTestMode] = useState('jump'); // 'jump' or 'drop'
  const [sec2QuizAnswer, setSec2QuizAnswer] = useState(null);

  // Sector 3 State: Seesaw balance
  const [moonItemsCount, setMoonItemsCount] = useState(1);
  const targetMoonItems = 6; // Exactly 6 items to balance 1 Earth item

  // Animation frame refs
  const animRef = useRef(null);

  // Reset/Initialize on sector switch
  useEffect(() => {
    setShowHint(false);
    setFeedbackMsg('');
    setStatusType('idle');
    setShowSectorSuccess(false);
    setSelectedObjId('raka');
    setSec1QuizAnswer(null);
    setSec2QuizAnswer(null);
    setMoonItemsCount(1);
    setIsJumping(false);
    setIsDropping(false);
    setJumpProgress({ earth: 0, moon: 0 });
    setDropProgress({ hammer: 0, featherEarth: 0, featherMoon: 0 });
  }, [currentSectorIdx]);

  // Clean up animation on unmount
  useEffect(() => {
    return () => {
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  // -------------------------------------------------------------------------
  // SECTOR 1 LOGIC: SPRING SCALE
  // -------------------------------------------------------------------------
  const activeObj = TEST_OBJECTS.find((o) => o.id === selectedObjId) || TEST_OBJECTS[0];
  const earthWeightN = Math.round(activeObj.mass * 9.8);
  const moonWeightN = Math.round(activeObj.mass * 1.62);
  const earthScaleKg = activeObj.mass;
  const moonScaleKg = Math.round((activeObj.mass / 6) * 10) / 10;

  // Spring stretch px: Earth stretches full, Moon stretches ~1/6
  const springStretchEarth = Math.min(80, Math.round((activeObj.mass / 180) * 65 + 20));
  const springStretchMoon = Math.min(30, Math.round(springStretchEarth / 6 + 5));

  const handleSelectObject = (objId) => {
    playSfx('button-click');
    setSelectedObjId(objId);
    const obj = TEST_OBJECTS.find((o) => o.id === objId);
    setFeedbackMsg(`${obj.name} diuji pada timbangan.`);
    setStatusType('idle');
  };

  const handleSec1QuizSelect = (ans) => {
    playSfx('button-click');
    setSec1QuizAnswer(ans);
    if (ans === '12 kg') {
      playSfx('correct');
      setFeedbackMsg('🎉 Benar! 72 kg ÷ 6 = 12 kg (6× lebih ringan di Bulan).');
      setStatusType('success');
    } else {
      playSfx('wrong');
      setFeedbackMsg('❌ Coba lagi! Gravitasi Bulan adalah 1/6 Bumi (72 ÷ 6).');
      setStatusType('error');
    }
  };

  // -------------------------------------------------------------------------
  // SECTOR 2 LOGIC: JUMP & DROP PHYSICS
  // -------------------------------------------------------------------------
  const triggerJumpSimulation = () => {
    if (isJumping) return;
    playSfx('button-click');
    setIsJumping(true);
    setFeedbackMsg('🚀 Melompat dengan tolakan kaki yang sama!');
    setStatusType('idle');

    const startTime = performance.now();
    const duration = 4200; // 4.2s for Moon to land

    const animateJump = (now) => {
      const elapsed = (now - startTime) / 1000;

      // Earth Jump: v0 = 3.43 m/s, g = 9.8 m/s^2 -> max height = 0.6m, flight time = 0.7s
      let earthY = 0;
      if (elapsed < 0.7) {
        // Parabola: y = v0*t - 0.5*g*t^2 normalized to 0..45px
        earthY = Math.max(0, 4 * 45 * (elapsed / 0.7) * (1 - elapsed / 0.7));
      }

      // Moon Jump: v0 = 3.43 m/s, g = 1.62 m/s^2 -> max height = 3.6m (6x higher!), flight time = 4.2s
      let moonY = 0;
      if (elapsed < 4.2) {
        // Parabola: normalized to 0..210px
        moonY = Math.max(0, 4 * 210 * (elapsed / 4.2) * (1 - elapsed / 4.2));
      }

      setJumpProgress({ earth: Math.round(earthY), moon: Math.round(moonY) });

      if (elapsed < 4.2) {
        animRef.current = requestAnimationFrame(animateJump);
      } else {
        setIsJumping(false);
        setJumpProgress({ earth: 0, moon: 0 });
        setFeedbackMsg('✨ Di Bulan astronaut melayang 6× lebih tinggi!');
      }
    };

    animRef.current = requestAnimationFrame(animateJump);
  };

  const triggerDropSimulation = () => {
    if (isDropping) return;
    playSfx('button-click');
    setIsDropping(true);
    setFeedbackMsg('🪶🔨 Menjatuhkan palu & bulu...');
    setStatusType('idle');

    const startTime = performance.now();
    const duration = 3000;

    const animateDrop = (now) => {
      const elapsed = (now - startTime) / 1000;

      // Hammer falls fast in Earth (0.8s) and Moon (2.0s)
      const hammerProg = Math.min(100, (elapsed / 2.0) * 100);

      // Feather in Earth: air resistance slows it down (takes 3.5s)
      const featherEarthProg = Math.min(100, (elapsed / 3.2) * 100);

      // Feather in Moon: in vacuum, falls at exact same rate as hammer!
      const featherMoonProg = Math.min(100, (elapsed / 2.0) * 100);

      setDropProgress({
        hammer: Math.round(hammerProg),
        featherEarth: Math.round(featherEarthProg),
        featherMoon: Math.round(featherMoonProg),
      });

      if (elapsed < 3.2) {
        animRef.current = requestAnimationFrame(animateDrop);
      } else {
        setIsDropping(false);
        setDropProgress({ hammer: 100, featherEarth: 100, featherMoon: 100 });
        setFeedbackMsg('🎉 Tanpa udara, bulu & palu jatuh bersamaan!');
        setStatusType('success');
      }
    };

    animRef.current = requestAnimationFrame(animateDrop);
  };

  const handleSec2QuizSelect = (ans) => {
    playSfx('button-click');
    setSec2QuizAnswer(ans);
    if (ans === 'correct') {
      playSfx('correct');
      setFeedbackMsg('🎉 Benar! Tanpa udara gravitasi menarik benda sama cepat.');
      setStatusType('success');
    } else {
      playSfx('wrong');
      setFeedbackMsg('❌ Coba lagi! Tanpa udara semua benda jatuh bersamaan.');
      setStatusType('error');
    }
  };

  // -------------------------------------------------------------------------
  // SECTOR 3 LOGIC: SEESAW BALANCE
  // -------------------------------------------------------------------------
  // Beam angle: 0 deg is perfectly balanced
  // Left side: Moon (gravity 1.62). Each item has weight 180 * 1.62 = 292 N
  // Right side: Earth (gravity 9.8). 1 item has weight 180 * 9.8 = 1764 N
  // At 6 items on Moon: 6 * 292 = 1752 N ≈ 1764 N (Balanced!)
  const isBalanced = moonItemsCount === targetMoonItems;
  const beamAngle = Math.max(-20, Math.min(20, Math.round((1 - moonItemsCount / targetMoonItems) * 18)));

  const handleAddMoonItem = () => {
    playSfx('button-click');
    if (moonItemsCount < 10) {
      setMoonItemsCount((prev) => prev + 1);
    }
  };

  const handleRemoveMoonItem = () => {
    playSfx('button-click');
    if (moonItemsCount > 1) {
      setMoonItemsCount((prev) => prev - 1);
    }
  };

  // -------------------------------------------------------------------------
  // CHECK ANSWER PER SECTOR
  // -------------------------------------------------------------------------
  const handleCheckAnswer = () => {
    if (currentSector.sectorNum === 1) {
      if (sec1QuizAnswer === '12 kg') {
        playSfx('correct');
        setShowSectorSuccess(true);
      } else {
        playSfx('wrong');
        setFeedbackMsg('⚠️ Pilih jawaban terlebih dahulu!');
        setStatusType('error');
      }
    } else if (currentSector.sectorNum === 2) {
      if (sec2QuizAnswer === 'correct') {
        playSfx('correct');
        setShowSectorSuccess(true);
      } else {
        playSfx('wrong');
        setFeedbackMsg('⚠️ Pilih jawaban kuis terlebih dahulu!');
        setStatusType('error');
      }
    } else if (currentSector.sectorNum === 3) {
      if (isBalanced) {
        playSfx('correct');
        setShowSectorSuccess(true);
      } else {
        playSfx('wrong');
        setFeedbackMsg('⚠️ Belum seimbang! Atur jumlah Rover di Bulan.');
        setStatusType('error');
      }
    }
  };

  // -------------------------------------------------------------------------
  // NEXT SECTOR OR COMPLETE
  // -------------------------------------------------------------------------
  const handleNextSector = () => {
    if (currentSectorIdx < SECTORS.length - 1) {
      playSfx('level-up');
      setCurrentSectorIdx((prev) => prev + 1);
    } else {
      playSfx('quest-complete');
      setShowGameComplete(true);
      completeQuest(targetQuestId, 100, 180, 45, 'card-moon');
    }
  };

  return (
    <div className={styles.gameContainer}>
      {/* Top Navigation Bar */}
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
        </div>
      </div>

      {/* Status / Hint Banner */}
      {showHint ? (
        <div className={styles.hintBanner}>
          <span style={{ fontSize: '1.1rem' }}>💡</span>
          <div className={styles.hintText}>{currentSector.hint}</div>
          <button type="button" className={styles.hintClose} onClick={() => setShowHint(false)}>✕</button>
        </div>
      ) : feedbackMsg ? (
        <div className={`${styles.statusBanner} ${statusType === 'success' ? styles.statusSuccess : ''} ${statusType === 'error' ? styles.statusError : ''}`}>
          <span>{feedbackMsg}</span>
        </div>
      ) : null}

      {/* Main Laboratory Arena */}
      <div className={styles.arena}>
        {/* ===================================================================
            SECTOR 1: DUAL CHAMBER SPRING SCALES
            =================================================================== */}
        {currentSector.sectorNum === 1 && (
          <div className={styles.dualChamberGrid}>
            {/* Earth Chamber */}
            <div className={`${styles.chamberCard} ${styles.chamberCardEarth}`}>
              <div className={styles.chamberHeader}>
                <div className={styles.chamberTitleWrap}>
                  <img src="/images/planets/earth.jpg" alt="Bumi" className={styles.planetMiniThumb} />
                  <h3 className={styles.chamberTitle}>Bumi</h3>
                </div>
                <span className={`${styles.gravityPill} ${styles.gravityPillEarth}`}>1.0g</span>
              </div>

              {/* Digital LED readout (Clean 2-item display) */}
              <div className={styles.ledReadout}>
                <div className={styles.ledItem}>
                  <span className={styles.ledLabel}>Massa</span>
                  <span className={`${styles.ledValue} ${styles.ledValueEarth}`}>{activeObj.mass} kg</span>
                </div>
                <div className={styles.ledItem}>
                  <span className={styles.ledLabel}>Berat</span>
                  <span className={`${styles.ledValue} ${styles.ledValueEarth}`}>{earthScaleKg} kg</span>
                </div>
              </div>

              {/* Spring Scale Graphic */}
              <div className={styles.springRigContainer}>
                <SpringScale3D stretch={springStretchEarth} isEarth={true} activeObj={activeObj} />
              </div>
            </div>

            {/* Moon Chamber */}
            <div className={`${styles.chamberCard} ${styles.chamberCardMoon}`}>
              <div className={styles.chamberHeader}>
                <div className={styles.chamberTitleWrap}>
                  <img src="/images/planets/moon.jpg" alt="Bulan" className={styles.planetMiniThumb} />
                  <h3 className={styles.chamberTitle}>Bulan</h3>
                </div>
                <span className={`${styles.gravityPill} ${styles.gravityPillMoon}`}>1/6g</span>
              </div>

              {/* Digital LED readout (Clean 2-item display) */}
              <div className={styles.ledReadout}>
                <div className={styles.ledItem}>
                  <span className={styles.ledLabel}>Massa</span>
                  <span className={`${styles.ledValue} ${styles.ledValueMoon}`}>{activeObj.mass} kg</span>
                </div>
                <div className={styles.ledItem}>
                  <span className={styles.ledLabel}>Berat</span>
                  <span className={`${styles.ledValue} ${styles.ledValueMoon}`}>{moonScaleKg} kg</span>
                </div>
              </div>

              {/* Spring Scale Graphic (Only ~1/6 stretch) */}
              <div className={styles.springRigContainer}>
                <SpringScale3D stretch={springStretchMoon} isEarth={false} activeObj={activeObj} />
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            SECTOR 2: JUMP SIMULATOR & APOLLO 15 DROP TEST
            =================================================================== */}
        {currentSector.sectorNum === 2 && (
          <div className={styles.jumpSimContainer}>
            {/* Earth Chamber */}
            <div className={`${styles.jumpChamber} ${styles.chamberCardEarth}`}>
              <div className={styles.chamberHeader}>
                <div className={styles.chamberTitleWrap}>
                  <img src="/images/planets/earth.jpg" alt="Bumi" className={styles.planetMiniThumb} />
                  <span className={styles.chamberTitle}>Bumi (1.0g)</span>
                </div>
                <span className={`${styles.gravityPill} ${styles.gravityPillEarth}`}>Maks 0.6 m</span>
              </div>

              <div className={styles.jumpArenaView}>
                <div className={styles.heightRuler}>
                  <span>4m</span>
                  <span>3m</span>
                  <span>2m</span>
                  <span>1m</span>
                  <span>0m</span>
                </div>

                {activeTestMode === 'jump' ? (
                  <div
                    className={styles.jumpActor}
                    style={{
                      bottom: `${8 + jumpProgress.earth}px`,
                    }}
                  >
                    <img src="/images/raka-astronaut.png" alt="Raka" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                ) : (
                  <div style={{ position: 'absolute', bottom: `${8 + (100 - dropProgress.featherEarth) * 1.8}px`, fontSize: '1.8rem' }}>
                    🪶
                  </div>
                )}

                <div className={styles.jumpPlatform} />
              </div>

              <div className={styles.jumpStats}>
                <span>Waktu: {activeTestMode === 'jump' ? '0.7 dtk' : '3.2 dtk'}</span>
              </div>
            </div>

            {/* Moon Chamber */}
            <div className={`${styles.jumpChamber} ${styles.chamberCardMoon}`}>
              <div className={styles.chamberHeader}>
                <div className={styles.chamberTitleWrap}>
                  <img src="/images/planets/moon.jpg" alt="Bulan" className={styles.planetMiniThumb} />
                  <span className={styles.chamberTitle}>Bulan (1/6g)</span>
                </div>
                <span className={`${styles.gravityPill} ${styles.gravityPillMoon}`}>Maks 3.6 m (6×)</span>
              </div>

              <div className={styles.jumpArenaView}>
                <div className={styles.heightRuler}>
                  <span>4m</span>
                  <span>3m</span>
                  <span>2m</span>
                  <span>1m</span>
                  <span>0m</span>
                </div>

                {activeTestMode === 'jump' ? (
                  <div
                    className={styles.jumpActor}
                    style={{
                      bottom: `${8 + jumpProgress.moon}px`,
                    }}
                  >
                    <img src="/images/raka-astronaut.png" alt="Raka" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
                  </div>
                ) : (
                  <div style={{ position: 'absolute', bottom: `${8 + (100 - dropProgress.featherMoon) * 1.8}px`, fontSize: '1.8rem' }}>
                    🪶🔨
                  </div>
                )}

                <div className={styles.jumpPlatform} />
              </div>

              <div className={styles.jumpStats}>
                <span>Waktu: {activeTestMode === 'jump' ? '4.2 dtk (melayang)' : '2.0 dtk (bersamaan)'}</span>
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            SECTOR 3: COSMIC SEESAW BALANCE BEAM
            =================================================================== */}
        {currentSector.sectorNum === 3 && (
          <div className={styles.seesawContainer}>
            {/* Equilibrium Angle Badge */}
            <div className={`${styles.beamAngleDisplay} ${isBalanced ? styles.beamAngleBalanced : styles.beamAngleUnbalanced}`}>
              <span>{isBalanced ? '✅ SEIMBANG SEMPURNA!' : '⚖️ BELUM SEIMBANG'}</span>
            </div>

            {/* Seesaw SVG Balance Beam */}
            <svg className={styles.seesawSvg} viewBox="0 0 600 200">
              <defs>
                <filter id="pivot-glow">
                  <feGaussianBlur stdDeviation="4" result="glow" />
                  <feComposite in="SourceGraphic" in2="glow" operator="over" />
                </filter>
              </defs>

              {/* Fulcrum Triangle Base */}
              <polygon points="300,120 280,180 320,180" fill="#334155" stroke="#64748b" strokeWidth="2" />
              <circle cx="300" cy="120" r="8" fill="#38bdf8" filter="url(#pivot-glow)" />

              {/* Rotating Balance Beam Group */}
              <g transform={`rotate(${beamAngle}, 300, 120)`}>
                <rect x="70" y="115" width="460" height="10" rx="4" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
                <line x1="300" y1="110" x2="300" y2="130" stroke="#fef08a" strokeWidth="2" />

                {/* Left Pan (Moon side) */}
                <g transform="translate(90, 120)">
                  <line x1="0" y1="0" x2="0" y2="35" stroke="#94a3b8" strokeWidth="1.8" />
                  <line x1="-35" y1="35" x2="35" y2="35" stroke="#fcd34d" strokeWidth="3" strokeLinecap="round" />
                  <text x="0" y="52" textAnchor="middle" fill="#fef08a" fontSize="11" fontWeight="900">
                    BULAN 🌕
                  </text>
                  <image href="/images/items/rover_3d.jpg" x="-18" y="2" width="36" height="36" preserveAspectRatio="xMidYMid slice" />
                  <text x="0" y="-8" textAnchor="middle" fill="#fef08a" fontSize="11" fontWeight="900">
                    {moonItemsCount} Rover
                  </text>
                </g>

                {/* Right Pan (Earth side) */}
                <g transform="translate(510, 120)">
                  <line x1="0" y1="0" x2="0" y2="35" stroke="#94a3b8" strokeWidth="1.8" />
                  <line x1="-35" y1="35" x2="35" y2="35" stroke="#38bdf8" strokeWidth="3" strokeLinecap="round" />
                  <text x="0" y="52" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="900">
                    BUMI 🌍
                  </text>
                  <image href="/images/items/rover_3d.jpg" x="-18" y="2" width="36" height="36" preserveAspectRatio="xMidYMid slice" />
                  <text x="0" y="-8" textAnchor="middle" fill="#38bdf8" fontSize="11" fontWeight="900">
                    1 Rover
                  </text>
                </g>
              </g>

              <line x1="300" y1="80" x2="300" y2="105" stroke={isBalanced ? '#34d399' : '#fbbf24'} strokeWidth="2.5" strokeDasharray="3 3" />
            </svg>

            {/* Balance controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '6px' }}>
              <button
                type="button"
                className={styles.iconBtn}
                onClick={handleRemoveMoonItem}
                disabled={moonItemsCount <= 1}
              >
                <span>➖ Kurangi</span>
              </button>
              <span style={{ fontSize: '0.9rem', fontWeight: 900, color: '#f8fafc' }}>
                Beban Bulan: <span style={{ color: '#fef08a' }}>{moonItemsCount} Rover</span>
              </span>
              <button
                type="button"
                className={styles.iconBtn}
                onClick={handleAddMoonItem}
                disabled={moonItemsCount >= 10}
              >
                <span>➕ Tambah</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Interactive Bottom Tray */}
      <div className={styles.trayWrap}>
        {/* ===================================================================
            TRAY FOR SECTOR 1: OBJECT SELECTION & QUIZ
            =================================================================== */}
        {currentSector.sectorNum === 1 && (
          <>
            <div className={styles.objectsGrid}>
              {TEST_OBJECTS.map((obj) => {
                const isSelected = selectedObjId === obj.id;
                return (
                  <button
                    key={obj.id}
                    type="button"
                    className={`${styles.objectCard} ${isSelected ? styles.objectCardActive : ''}`}
                    onClick={() => handleSelectObject(obj.id)}
                  >
                    <img src={obj.image} alt={obj.name} className={styles.objectThumb3d} />
                    <div className={styles.objectMeta}>
                      <span className={styles.objectName}>{obj.name}</span>
                      <span className={styles.objectMass}>{obj.mass} kg</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Sector 1 Quiz Challenge */}
            <div className={styles.quizCardWrap}>
              <span className={styles.quizQuestion}>
                ❓ Berapa berat astronot (72 kg) di timbangan Bulan?
              </span>
              <div className={styles.quizOptionsGrid}>
                {['12 kg', '72 kg', '0 kg', '432 kg'].map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    className={`${styles.quizOptionBtn} ${sec1QuizAnswer === opt ? styles.quizOptionBtnSelected : ''}`}
                    onClick={() => handleSec1QuizSelect(opt)}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* ===================================================================
            TRAY FOR SECTOR 2: JUMP & DROP CONTROLS
            =================================================================== */}
        {currentSector.sectorNum === 2 && (
          <>
            <div className={styles.trayHeader}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  type="button"
                  className={`${styles.iconBtn} ${activeTestMode === 'jump' ? styles.iconBtnActive : ''}`}
                  onClick={() => {
                    playSfx('button-click');
                    setActiveTestMode('jump');
                  }}
                >
                  <span>🚀 Lompatan</span>
                </button>
                <button
                  type="button"
                  className={`${styles.iconBtn} ${activeTestMode === 'drop' ? styles.iconBtnActive : ''}`}
                  onClick={() => {
                    playSfx('button-click');
                    setActiveTestMode('drop');
                  }}
                >
                  <span>🪶🔨 Uji Jatuh</span>
                </button>
              </div>

              <button
                type="button"
                className={styles.btnPrimary}
                onClick={activeTestMode === 'jump' ? triggerJumpSimulation : triggerDropSimulation}
                disabled={isJumping || isDropping}
              >
                <span>▶ Mulai Uji</span>
              </button>
            </div>

            {/* Sector 2 Quiz Challenge */}
            <div className={styles.quizCardWrap}>
              <span className={styles.quizQuestion}>
                ❓ Kenapa bulu & palu jatuh bersamaan di ruang hampa Bulan?
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <button
                  type="button"
                  className={`${styles.quizOptionBtn} ${sec2QuizAnswer === 'correct' ? styles.quizOptionBtnSelected : ''}`}
                  onClick={() => handleSec2QuizSelect('correct')}
                >
                  Gravitasi sama & tanpa udara
                </button>
                <button
                  type="button"
                  className={`${styles.quizOptionBtn} ${sec2QuizAnswer === 'wrong1' ? styles.quizOptionBtnSelected : ''}`}
                  onClick={() => handleSec2QuizSelect('wrong1')}
                >
                  Bulu lebih berat di Bulan
                </button>
              </div>
            </div>
          </>
        )}

        {/* ===================================================================
            TRAY FOR SECTOR 3: SEESAW SUMMARY
            =================================================================== */}
        {currentSector.sectorNum === 3 && (
          <div className={styles.quizCardWrap}>
            <span className={styles.quizQuestion}>
              💡 Seimbangkan jungkat-jungkit: Berapa Rover di Bulan yang dibutuhkan untuk 1 Rover di Bumi?
            </span>
          </div>
        )}

        {/* Bottom Navigation & Lock Answer */}
        <div className={styles.bottomControls}>
          <div className={styles.sectorDots}>
            {SECTORS.map((sec, idx) => (
              <div
                key={sec.sectorNum}
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
            <span>Periksa Jawaban ➜</span>
          </button>
        </div>
      </div>

      {/* Sector Success Modal */}
      {showSectorSuccess && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalCard}>
            <div className={styles.modalIcon}>🌕✨</div>
            <span className={styles.modalBadge}>Sektor Selesai! 🎉</span>
            <h3 className={styles.modalTitle}>{currentSector.title}</h3>

            <div className={styles.eduBox}>
              <div className={styles.eduTitle}>{currentSector.eduTitle}</div>
              <div className={styles.eduContent}>{currentSector.eduText}</div>
            </div>

            <button
              type="button"
              className={styles.btnModalNext}
              onClick={handleNextSector}
            >
              {currentSectorIdx < SECTORS.length - 1
                ? 'Lanjut ke Sektor Berikutnya ➔'
                : 'Selesaikan Misi Gravitasi 🏆'}
            </button>
          </div>
        </div>
      )}

      {/* Final Mission Complete Modal */}
      {showGameComplete && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalCard}>
            <div className={styles.modalIcon}>🌕👨‍🚀</div>
            <span className={styles.modalBadge}>Misi Gravitasi Selesai!</span>
            <h3 className={styles.modalTitle}>Master Gravitasi Antariksa</h3>
            <p className={styles.modalDesc}>
              Selamat penjelajah! Kamu telah menguasai hukum gravitasi Newton dan memahami perbedaan berat di Bumi dan Bulan dengan sempurna!
            </p>

            <div className={styles.rewardGrid}>
              <div className={styles.rewardPill}>
                <span className={styles.rewardVal}>+180</span>
                <span className={styles.rewardLabel}>XP Kosmik</span>
              </div>
              <div className={styles.rewardPill}>
                <span className={styles.rewardVal}>+45</span>
                <span className={styles.rewardLabel}>Koin Emas</span>
              </div>
              <div className={styles.rewardPill}>
                <span className={styles.rewardVal}>🌕</span>
                <span className={styles.rewardLabel}>Kartu Bulan</span>
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
