import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { useAudio } from '../../context/AudioContext';
import styles from './GearPuzzle.module.css';

// ---------------------------------------------------------------------------
// DATA 3 LEVEL ALGORITMA RODA GIGI (GUNUNG TEKA-TEKI MISI 02)
// ---------------------------------------------------------------------------
const GEAR_LEVELS = [
  {
    id: 'level-1',
    levelNum: 1,
    title: 'Level 1: Roda Berputar',
    missionText: 'Tebak arah putaran: Roda Target harus Putar Kiri (↺) atau Putar Kanan (↻)?',
    hint: '💡 Tips: Dua roda yang bersentuhan selalu berputar berlawanan arah!',
    viewBox: '0 0 600 320',
    gears: [
      {
        id: 'A',
        name: 'Roda A',
        cx: 140,
        cy: 160,
        rOuter: 68,
        rInner: 54,
        teeth: 14,
        speed: 'normal',
        idleSpinClass: styles.spinCW,
        activeSpinClass: styles.spinCW,
        teethLabel: 'Roda A',
        type: 'driver',
        dirLabel: '↻'
      },
      {
        id: 'B',
        name: 'Roda B',
        cx: 260,
        cy: 160,
        rOuter: 56,
        rInner: 42,
        teeth: 12,
        speed: 'normal',
        idleSpinClass: '',
        activeSpinClass: styles.spinCCW,
        teethLabel: 'Roda B',
        type: 'idler',
        dirLabel: '?'
      },
      {
        id: 'C',
        name: 'Roda Target',
        cx: 380,
        cy: 160,
        rOuter: 68,
        rInner: 54,
        teeth: 14,
        speed: 'normal',
        idleSpinClass: '',
        activeSpinClass: styles.spinCW,
        teethLabel: 'Roda Target',
        type: 'target',
        dirLabel: '?'
      }
    ],
    meshPoints: [
      { x: 200, y: 160 },
      { x: 320, y: 160 }
    ],
    options: [
      {
        id: 'opt-ccw',
        text: 'Putar Kiri ↺',
        icon: '↺',
        isCorrect: false,
        wrongFeedback: 'Aduh, tabrakan! Roda B juga berputar ke Kiri. Dua roda bertaut harus berputar berlawanan arah!'
      },
      {
        id: 'opt-cw',
        text: 'Putar Kanan ↻',
        icon: '↻',
        isCorrect: true
      }
    ],
    explanation: 'Hebat! Roda Target berputar ke Kanan (↻), pas berlawanan dengan Roda B. Mesin menyala! 🎉'
  },
  {
    id: 'level-2',
    levelNum: 2,
    title: 'Level 2: Rantai 4 Roda',
    missionText: 'Rantai 4 Roda: Ke arah mana Roda Target harus berputar agar mesin jalan?',
    hint: '💡 Tips: Setiap sambungan membalikkan arah: Kiri ➔ Kanan ➔ Kiri ➔ Kanan!',
    viewBox: '0 0 620 330',
    gears: [
      {
        id: 'A',
        name: 'Roda A',
        cx: 105,
        cy: 135,
        rOuter: 58,
        rInner: 45,
        teeth: 12,
        speed: 'normal',
        idleSpinClass: styles.spinCCW,
        activeSpinClass: styles.spinCCW,
        teethLabel: 'Roda A',
        type: 'driver',
        dirLabel: '↺'
      },
      {
        id: 'B',
        name: 'Roda B',
        cx: 205,
        cy: 195,
        rOuter: 52,
        rInner: 40,
        teeth: 11,
        speed: 'normal',
        idleSpinClass: '',
        activeSpinClass: styles.spinCW,
        teethLabel: 'Roda B',
        type: 'idler',
        dirLabel: '?'
      },
      {
        id: 'C',
        name: 'Roda C',
        cx: 310,
        cy: 135,
        rOuter: 62,
        rInner: 48,
        teeth: 13,
        speed: 'normal',
        idleSpinClass: '',
        activeSpinClass: styles.spinCCW,
        teethLabel: 'Roda C',
        type: 'idler',
        dirLabel: '?'
      },
      {
        id: 'D',
        name: 'Roda Target',
        cx: 415,
        cy: 195,
        rOuter: 52,
        rInner: 40,
        teeth: 11,
        speed: 'normal',
        idleSpinClass: '',
        activeSpinClass: styles.spinCW,
        teethLabel: 'Roda Target',
        type: 'target',
        dirLabel: '?'
      }
    ],
    meshPoints: [
      { x: 155, y: 165 },
      { x: 257, y: 165 },
      { x: 362, y: 165 }
    ],
    options: [
      {
        id: 'opt-ccw',
        text: 'Putar Kiri ↺',
        icon: '↺',
        isCorrect: false,
        wrongFeedback: 'Giginya bertabrakan! Karena Roda C berputar ke Kiri, Roda Target harus berputar ke Kanan!'
      },
      {
        id: 'opt-still',
        text: 'Berhenti & Diam ⏸',
        icon: '⏸',
        isCorrect: false,
        wrongFeedback: 'Mesin macet! Roda target harus ikut berputar agar mesin benteng kuno bisa jalan.'
      },
      {
        id: 'opt-cw',
        text: 'Putar Kanan ↻',
        icon: '↻',
        isCorrect: true
      }
    ],
    explanation: 'Pintar sekali! Semua 4 roda berputar kompak tanpa tabrakan! 🚀'
  },
  {
    id: 'level-3',
    levelNum: 3,
    title: 'Level 3: Roda Cepat & Lambat',
    missionText: 'Roda Kecil punya setengah gigi dari Roda Besar. Cari putaran yang cocok!',
    hint: '💡 Tips: Roda kecil berputar 2 kali lebih cepat dari roda besar!',
    viewBox: '0 0 600 320',
    gears: [
      {
        id: 'A',
        name: 'Roda Besar',
        cx: 175,
        cy: 160,
        rOuter: 96,
        rInner: 80,
        teeth: 24,
        speed: 'slow',
        idleSpinClass: styles.spinCWSlow,
        activeSpinClass: styles.spinCWSlow,
        teethLabel: 'Roda Besar (24 Gigi)',
        type: 'driver',
        dirLabel: '1x ↻'
      },
      {
        id: 'B',
        name: 'Roda Kecil',
        cx: 345,
        cy: 160,
        rOuter: 60,
        rInner: 46,
        teeth: 12,
        speed: 'fast',
        idleSpinClass: '',
        activeSpinClass: styles.spinCCWFast,
        teethLabel: 'Roda Kecil (12 Gigi)',
        type: 'target',
        dirLabel: '?'
      }
    ],
    meshPoints: [
      { x: 260, y: 160 }
    ],
    options: [
      {
        id: 'opt-1ccw',
        text: '1x Putar Kiri ↺',
        icon: '↺',
        isCorrect: false,
        wrongFeedback: 'Kurang cepat! Roda kecil punya gigi separuh dari roda besar, jadi berputar lebih cepat!'
      },
      {
        id: 'opt-2cw',
        text: '2x Putar Kanan ↻',
        icon: '↻',
        isCorrect: false,
        wrongFeedback: 'Arahnya terbalik! Roda bertaut selalu berputar ke arah yang berlawanan (Kiri ↺)!'
      },
      {
        id: 'opt-half',
        text: 'Lambat 0.5x ⏳',
        icon: '⏳',
        isCorrect: false,
        wrongFeedback: 'Terlalu lambat! Roda kecil berputar lebih cepat dari roda besar, bukan lebih lambat!'
      },
      {
        id: 'opt-2ccw',
        text: 'Cepat 2x Putar Kiri ⚡',
        icon: '⚡',
        isCorrect: true
      }
    ],
    explanation: 'Luar biasa! Karena ukurannya setengah, roda kecil berputar 2x lebih cepat ke Kiri! ⚡'
  }
];

// Helper: mathematically generate precision involute gear teeth profile with chamfers & root fillets
function generatePrecisionGearPath(cx, cy, rOuter, rInner, teeth) {
  const angleStep = (Math.PI * 2) / teeth;
  const pathParts = [];

  for (let i = 0; i < teeth; i++) {
    const aBase = i * angleStep;
    const a0 = aBase;
    const a1 = aBase + angleStep * 0.12;
    const a2 = aBase + angleStep * 0.28;
    const a3 = aBase + angleStep * 0.38;
    const a4 = aBase + angleStep * 0.62;
    const a5 = aBase + angleStep * 0.72;
    const a6 = aBase + angleStep * 0.88;

    const rRoot = rInner;
    const rCrest = rOuter;
    const rChamfer = rOuter - (rOuter - rInner) * 0.14;
    const rFillet = rRoot + (rOuter - rInner) * 0.12;

    const p0 = `${(cx + rRoot * Math.cos(a0)).toFixed(2)},${(cy + rRoot * Math.sin(a0)).toFixed(2)}`;
    const p1 = `${(cx + rFillet * Math.cos(a1)).toFixed(2)},${(cy + rFillet * Math.sin(a1)).toFixed(2)}`;
    const p2 = `${(cx + rChamfer * Math.cos(a2)).toFixed(2)},${(cy + rChamfer * Math.sin(a2)).toFixed(2)}`;
    const p3 = `${(cx + rCrest * Math.cos(a3)).toFixed(2)},${(cy + rCrest * Math.sin(a3)).toFixed(2)}`;
    const p4 = `${(cx + rCrest * Math.cos(a4)).toFixed(2)},${(cy + rCrest * Math.sin(a4)).toFixed(2)}`;
    const p5 = `${(cx + rChamfer * Math.cos(a5)).toFixed(2)},${(cy + rChamfer * Math.sin(a5)).toFixed(2)}`;
    const p6 = `${(cx + rFillet * Math.cos(a6)).toFixed(2)},${(cy + rFillet * Math.sin(a6)).toFixed(2)}`;

    if (i === 0) {
      pathParts.push(`M ${p0}`);
    } else {
      pathParts.push(`L ${p0}`);
    }
    pathParts.push(`L ${p1} L ${p2} L ${p3} L ${p4} L ${p5} L ${p6}`);
  }

  pathParts.push('Z');
  return pathParts.join(' ');
}

// Generate mechanical curved spoke cutout windows
function generateSpokeCutouts(cx, cy, rInner, count) {
  const cutouts = [];
  const step = (Math.PI * 2) / count;
  const rIn = rInner * 0.44;
  const rOut = rInner * 0.74;

  for (let i = 0; i < count; i++) {
    const aStart = i * step + step * 0.16;
    const aEnd = (i + 1) * step - step * 0.16;

    const p1 = `${(cx + rIn * Math.cos(aStart)).toFixed(2)},${(cy + rIn * Math.sin(aStart)).toFixed(2)}`;
    const p2 = `${(cx + rOut * Math.cos(aStart)).toFixed(2)},${(cy + rOut * Math.sin(aStart)).toFixed(2)}`;
    const p3 = `${(cx + rOut * Math.cos(aEnd)).toFixed(2)},${(cy + rOut * Math.sin(aEnd)).toFixed(2)}`;
    const p4 = `${(cx + rIn * Math.cos(aEnd)).toFixed(2)},${(cy + rIn * Math.sin(aEnd)).toFixed(2)}`;

    cutouts.push(`M ${p1} L ${p2} A ${rOut.toFixed(2)} ${rOut.toFixed(2)} 0 0 1 ${p3} L ${p4} A ${rIn.toFixed(2)} ${rIn.toFixed(2)} 0 0 0 ${p1} Z`);
  }
  return cutouts;
}

// Generate perimeter rivets on the rim
function generateRivets(cx, cy, radius, count) {
  const rivets = [];
  for (let i = 0; i < count; i++) {
    const ang = (i * Math.PI * 2) / count;
    rivets.push({
      x: +(cx + radius * Math.cos(ang)).toFixed(2),
      y: +(cy + radius * Math.sin(ang)).toFixed(2)
    });
  }
  return rivets;
}

// Generate 6-point hex nut vertices
function generateHexPoints(cx, cy, radius) {
  return [0, 60, 120, 180, 240, 300]
    .map((deg) => {
      const rad = (deg * Math.PI) / 180;
      return `${(cx + radius * Math.cos(rad)).toFixed(2)},${(cy + radius * Math.sin(rad)).toFixed(2)}`;
    })
    .join(' ');
}

// Helper to determine rotation class for target gear based on selected option
function getTargetRotationClass(selectedOptId, cssStyles) {
  if (!selectedOptId) return '';
  // Level 1:
  if (selectedOptId === 'opt-cw') return cssStyles.spinCW;
  if (selectedOptId === 'opt-ccw') return cssStyles.spinCCW;
  // Level 2:
  if (selectedOptId === 'opt-still') return '';
  // Level 3:
  if (selectedOptId === 'opt-2ccw') return cssStyles.spinCCWFast;
  if (selectedOptId === 'opt-1ccw') return cssStyles.spinCCW;
  if (selectedOptId === 'opt-2cw') return cssStyles.spinCWFast;
  if (selectedOptId === 'opt-half') return cssStyles.spinCCWSlow;
  return '';
}

export default function GearPuzzle({ questId: propQuestId }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const targetQuestId = propQuestId || searchParams.get('questId') || 'quest-gt-2';

  const { completeQuest } = useGame();
  const { playSfx, playBgm } = useAudio();

  // Current Level State
  const [currentLevelIdx, setCurrentLevelIdx] = useState(0);
  const currentLevel = GEAR_LEVELS[currentLevelIdx];

  // UI States
  const [selectedOptionId, setSelectedOptionId] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showVictoryModal, setShowVictoryModal] = useState(false);

  // Play background music on mount
  useEffect(() => {
    if (playBgm) {
      playBgm('puzzle-challenge');
    }
  }, [playBgm]);

  // Reset answer states when level changes
  useEffect(() => {
    setSelectedOptionId(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setShowHint(false);
  }, [currentLevelIdx]);

  // Handle option selection directly on the gear
  const handleSelectOption = (option) => {
    if (isAnswered && isCorrect) return; // Prevent clicking after right answer

    setSelectedOptionId(option.id);
    setIsAnswered(true);

    if (option.isCorrect) {
      setIsCorrect(true);
      playSfx('correct');
    } else {
      setIsCorrect(false);
      playSfx('wrong');
    }
  };

  // Cycle to next rotation option by tapping the target gear body directly
  const handleGearBodyClick = () => {
    if (isAnswered && isCorrect) return;
    const options = currentLevel.options;
    const curIdx = options.findIndex((o) => o.id === selectedOptionId);
    const nextIdx = (curIdx + 1) % options.length;
    handleSelectOption(options[nextIdx]);
  };

  // Handle progression to next level or game completion
  const handleNextStep = () => {
    if (currentLevelIdx < GEAR_LEVELS.length - 1) {
      playSfx('button-click');
      setCurrentLevelIdx((prev) => prev + 1);
    } else {
      // All levels finished!
      playSfx('quest-complete');
      setShowVictoryModal(true);
      if (completeQuest) {
        completeQuest(targetQuestId, 100, 180, 50, 'card-gears', 'outfit-engineer');
      }
    }
  };

  // Retry current level
  const handleResetLevel = () => {
    playSfx('button-click');
    setSelectedOptionId(null);
    setIsAnswered(false);
    setIsCorrect(false);
  };

  const handleFinishAndReturn = () => {
    playSfx('button-click');
    navigate('/world/gunung-teka-teki');
  };

  // Pre-calculated geometric rendering data for mechanical gears
  const gearRenderData = useMemo(() => {
    return currentLevel.gears.map((g) => {
      const spokeCount = g.teeth >= 20 ? 6 : g.teeth >= 12 ? 4 : 3;
      const rivetCount = spokeCount * 2;
      return {
        id: g.id,
        path: generatePrecisionGearPath(g.cx, g.cy, g.rOuter, g.rInner, g.teeth),
        spokes: generateSpokeCutouts(g.cx, g.cy, g.rInner, spokeCount),
        rivets: generateRivets(g.cx, g.cy, g.rInner * 0.85, rivetCount),
        hexPoints: generateHexPoints(g.cx, g.cy, g.rInner * 0.28),
        ballBearings: generateRivets(g.cx, g.cy, g.rInner * 0.35, 6)
      };
    });
  }, [currentLevel]);

  return (
    <div className={styles.gameContainer}>
      {/* ─── Top Control Bar ────────────────────────────────────────── */}
      <div className={styles.topControlBar}>
        <div className={styles.levelBadgeWrap}>
          <span className={styles.levelBadge}>Level {currentLevel.levelNum} / 3</span>
          <h2 className={styles.levelTitle}>{currentLevel.title}</h2>
        </div>

        <div className={styles.topActionBtns}>
          <button
            type="button"
            className={`${styles.iconBtn} ${showHint ? styles.iconBtnActive : ''}`}
            onClick={() => {
              playSfx('hint');
              setShowHint((prev) => !prev);
            }}
            title="Petunjuk Logika"
          >
            💡 Petunjuk
          </button>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={handleResetLevel}
            title="Ulangi Level"
          >
            🔄 Ulang
          </button>
        </div>
      </div>

      {/* ─── Compact Kid-Friendly Mission Strip ─────────────────────── */}
      <div className={styles.challengeBanner}>
        <span className={styles.challengeIcon}>🎯</span>
        <span className={styles.challengeInstruction}>{currentLevel.missionText}</span>
      </div>

      {/* ─── Hint Banner (Expandable) ───────────────────────────────── */}
      {showHint && (
        <div className={styles.hintBanner}>
          <div style={{ flex: 1 }}>{currentLevel.hint}</div>
          <button
            type="button"
            className={styles.hintCloseBtn}
            onClick={() => setShowHint(false)}
          >
            ✕
          </button>
        </div>
      )}

      {/* ─── Mechanical Gear Arena (SVG Vector Canvas) ──────────────── */}
      <div className={styles.gearStageWrapper}>
        <div className={styles.circuitGridOverlay} />

        <div className={styles.gearStageInner}>
          <svg
            className={styles.svgEngineCanvas}
            viewBox={currentLevel.viewBox}
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Radial gradient for Driver Gear (Cobalt & Cyan Cyber Alloy) */}
              <radialGradient id="gradDriver" cx="38%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#7dd3fc" />
                <stop offset="25%" stopColor="#38bdf8" />
                <stop offset="60%" stopColor="#0284c7" />
                <stop offset="85%" stopColor="#0369a1" />
                <stop offset="100%" stopColor="#082f49" />
              </radialGradient>

              {/* Radial gradient for Idler/Transmission Gear (Brushed Titanium Steel) */}
              <radialGradient id="gradIdler" cx="38%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#f8fafc" />
                <stop offset="25%" stopColor="#cbd5e1" />
                <stop offset="60%" stopColor="#64748b" />
                <stop offset="85%" stopColor="#334155" />
                <stop offset="100%" stopColor="#1e293b" />
              </radialGradient>

              {/* Radial gradient for Target/Question Gear (Chrono Brass & Radiant Gold) */}
              <radialGradient id="gradTarget" cx="38%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="25%" stopColor="#fde047" />
                <stop offset="55%" stopColor="#f59e0b" />
                <stop offset="85%" stopColor="#d97706" />
                <stop offset="100%" stopColor="#78350f" />
              </radialGradient>

              {/* Radial gradient for Target Gear (Radiant Emerald Success) */}
              <radialGradient id="gradTargetSuccess" cx="38%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#d1fae5" />
                <stop offset="25%" stopColor="#6ee7b7" />
                <stop offset="55%" stopColor="#10b981" />
                <stop offset="85%" stopColor="#059669" />
                <stop offset="100%" stopColor="#064e3b" />
              </radialGradient>

              {/* Radial gradient for Target Gear (Thermal Overheat Crimson Wrong) */}
              <radialGradient id="gradTargetWrong" cx="38%" cy="35%" r="65%">
                <stop offset="0%" stopColor="#fee2e2" />
                <stop offset="25%" stopColor="#fca5a5" />
                <stop offset="55%" stopColor="#ef4444" />
                <stop offset="85%" stopColor="#dc2626" />
                <stop offset="100%" stopColor="#7f1d1d" />
              </radialGradient>

              {/* Central Hub Collar turned metal */}
              <radialGradient id="gradHubCollar" cx="40%" cy="35%" r="60%">
                <stop offset="0%" stopColor="#cbd5e1" />
                <stop offset="50%" stopColor="#64748b" />
                <stop offset="100%" stopColor="#1e293b" />
              </radialGradient>

              {/* Brushed Hexagonal Bolt Nut */}
              <linearGradient id="gradHexNut" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f8fafc" />
                <stop offset="30%" stopColor="#cbd5e1" />
                <stop offset="70%" stopColor="#475569" />
                <stop offset="100%" stopColor="#1e293b" />
              </linearGradient>

              {/* Chrome ball bearing */}
              <radialGradient id="gradSteelBall" cx="35%" cy="35%" r="60%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="45%" stopColor="#94a3b8" />
                <stop offset="100%" stopColor="#334155" />
              </radialGradient>

              {/* Industrial chassis beam mounting plate */}
              <linearGradient id="gradChassisBeam" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#475569" />
                <stop offset="25%" stopColor="#334155" />
                <stop offset="70%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#0f172a" />
              </linearGradient>

              {/* Tactile Hub Actuator Button (Amber Idle) */}
              <radialGradient id="gradTargetAmberBtn" cx="42%" cy="38%" r="60%">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="40%" stopColor="#f59e0b" />
                <stop offset="90%" stopColor="#b45309" />
                <stop offset="100%" stopColor="#78350f" />
              </radialGradient>

              {/* Tactile Hub Actuator Button (Emerald Success) */}
              <radialGradient id="gradTargetSuccessBtn" cx="42%" cy="38%" r="60%">
                <stop offset="0%" stopColor="#a7f3d0" />
                <stop offset="40%" stopColor="#10b981" />
                <stop offset="90%" stopColor="#047857" />
                <stop offset="100%" stopColor="#064e3b" />
              </radialGradient>

              {/* Tactile Hub Actuator Button (Crimson Wrong) */}
              <radialGradient id="gradTargetWrongBtn" cx="42%" cy="38%" r="60%">
                <stop offset="0%" stopColor="#fecaca" />
                <stop offset="40%" stopColor="#ef4444" />
                <stop offset="90%" stopColor="#b91c1c" />
                <stop offset="100%" stopColor="#7f1d1d" />
              </radialGradient>

              {/* Meshing Contact Energy Halos */}
              <radialGradient id="gradMeshSync" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#6ee7b7" />
                <stop offset="50%" stopColor="#10b981" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
              <radialGradient id="gradMeshClash" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fca5a5" />
                <stop offset="60%" stopColor="#ef4444" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
              <radialGradient id="gradMeshIdle" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#fde047" />
                <stop offset="60%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>

              {/* 3D Depth Shadows & Energy Glow Filters */}
              <filter id="gearDropShadow" x="-20%" y="-20%" width="150%" height="150%">
                <feDropShadow dx="0" dy="6" stdDeviation="5" floodColor="#000000" floodOpacity="0.75" />
              </filter>
              <filter id="glowCyan" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#38bdf8" floodOpacity="0.85" />
              </filter>
              <filter id="glowAmber" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#f59e0b" floodOpacity="0.9" />
              </filter>
              <filter id="glowEmerald" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#10b981" floodOpacity="0.95" />
              </filter>
              <filter id="glowCrimson" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#ef4444" floodOpacity="0.95" />
              </filter>
            </defs>

            {/* Connecting Chassis Mount & Heavy Industrial Machine Rails */}
            <g className={styles.chassisMountGroup}>
              {currentLevel.gears.map((g, idx) => {
                if (idx === currentLevel.gears.length - 1) return null;
                const nextG = currentLevel.gears[idx + 1];
                return (
                  <g key={`rail-${g.id}-${nextG.id}`}>
                    {/* Outer heavy machine beam */}
                    <line
                      x1={g.cx}
                      y1={g.cy}
                      x2={nextG.cx}
                      y2={nextG.cy}
                      stroke="url(#gradChassisBeam)"
                      strokeWidth="18"
                      strokeLinecap="round"
                    />
                    {/* Inner recessed guide slot */}
                    <line
                      x1={g.cx}
                      y1={g.cy}
                      x2={nextG.cx}
                      y2={nextG.cy}
                      stroke="#090d16"
                      strokeWidth="6"
                      strokeLinecap="round"
                    />
                    {/* Metallic top bevel highlight groove */}
                    <line
                      x1={g.cx}
                      y1={g.cy - 7}
                      x2={nextG.cx}
                      y2={nextG.cy - 7}
                      stroke="rgba(255, 255, 255, 0.12)"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </g>
                );
              })}

              {/* Chassis mounting brackets behind each gear's axle */}
              {currentLevel.gears.map((g) => (
                <g key={`chassis-mount-${g.id}`}>
                  <circle
                    cx={g.cx}
                    cy={g.cy}
                    r={g.rInner * 0.44}
                    fill="#1e293b"
                    stroke="#334155"
                    strokeWidth="2"
                  />
                  {[-45, 45, 135, 225].map((deg) => {
                    const rad = (deg * Math.PI) / 180;
                    const sx = g.cx + (g.rInner * 0.33) * Math.cos(rad);
                    const sy = g.cy + (g.rInner * 0.33) * Math.sin(rad);
                    return (
                      <circle
                        key={`screw-${deg}`}
                        cx={sx}
                        cy={sy}
                        r="2.2"
                        fill="#090d16"
                        stroke="#64748b"
                        strokeWidth="0.8"
                      />
                    );
                  })}
                </g>
              ))}
            </g>

            {/* Meshing Spark / Friction Contact Indicator Points */}
            {currentLevel.meshPoints.map((pt, pIdx) => {
              const isTargetMesh = pIdx === currentLevel.meshPoints.length - 1;
              const isClash = isTargetMesh && isAnswered && !isCorrect;
              const isSync = isAnswered && isCorrect;

              return (
                <g key={`mesh-${pIdx}`} className={styles.meshNodeGroup}>
                  {/* Outer contact aura glow */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isClash ? '15' : isSync ? '13' : '9'}
                    fill={isClash ? 'url(#gradMeshClash)' : isSync ? 'url(#gradMeshSync)' : 'url(#gradMeshIdle)'}
                    opacity={isClash ? 0.95 : isSync ? 0.9 : 0.65}
                    className={isSync ? styles.meshPulseSync : isClash ? styles.meshPulseClash : ''}
                  />
                  {/* Center precision contact pip */}
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r={isClash ? '4' : isSync ? '3.5' : '2.5'}
                    fill="#ffffff"
                    filter="drop-shadow(0 0 4px #ffffff)"
                  />
                  {isClash && (
                    <g>
                      <rect
                        x={pt.x - 42}
                        y={pt.y - 30}
                        width="84"
                        height="20"
                        rx="6"
                        fill="rgba(220, 38, 38, 0.95)"
                        stroke="#fca5a5"
                        strokeWidth="1.2"
                        filter="drop-shadow(0 2px 6px rgba(0,0,0,0.6))"
                      />
                      <text
                        x={pt.x}
                        y={pt.y - 16}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize="9"
                        fontWeight="900"
                        letterSpacing="0.4"
                      >
                        ⚡ TABRAKAN!
                      </text>
                    </g>
                  )}
                </g>
              );
            })}

            {/* Render Each Mechanical Gear */}
            {currentLevel.gears.map((gear, idx) => {
              const gData = gearRenderData.find((p) => p.id === gear.id);
              const pathData = gData?.path || '';
              const isTarget = gear.type === 'target';
              const isDriver = gear.type === 'driver';

              // Determine rotation class
              let rotationClass = '';
              if (isDriver) {
                rotationClass = gear.idleSpinClass;
              } else if (isTarget) {
                if (selectedOptionId) {
                  rotationClass = getTargetRotationClass(selectedOptionId, styles);
                }
              } else if (isAnswered && isCorrect) {
                rotationClass = gear.activeSpinClass;
              }

              // Color Theme
              let fillGradient = 'url(#gradIdler)';
              let strokeColor = '#cbd5e1';
              let filter = 'none';

              if (isDriver) {
                fillGradient = 'url(#gradDriver)';
                strokeColor = '#7dd3fc';
                filter = 'url(#glowCyan)';
              } else if (isTarget) {
                if (isAnswered && isCorrect) {
                  fillGradient = 'url(#gradTargetSuccess)';
                  strokeColor = '#6ee7b7';
                  filter = 'url(#glowEmerald)';
                } else if (isAnswered && !isCorrect) {
                  fillGradient = 'url(#gradTargetWrong)';
                  strokeColor = '#fca5a5';
                  filter = 'url(#glowCrimson)';
                } else {
                  fillGradient = 'url(#gradTarget)';
                  strokeColor = '#fef08a';
                  filter = 'url(#glowAmber)';
                }
              }

              return (
                <g
                  key={`gear-unit-${gear.id}`}
                  className={isTarget ? styles.targetGearUnit : ''}
                >
                  {/* Holographic Targeting Reticle for Target Gear */}
                  {isTarget && (!isAnswered || !isCorrect) && (
                    <g pointerEvents="none" className={styles.targetReticleWrap}>
                      <circle
                        cx={gear.cx}
                        cy={gear.cy}
                        r={gear.rOuter + 14}
                        fill="none"
                        stroke="rgba(245, 158, 11, 0.45)"
                        strokeWidth="1.5"
                        className={styles.targetOrbitalRing}
                      />
                      {[-45, 45, 135, 225].map((deg) => {
                        const rad = (deg * Math.PI) / 180;
                        const bx = gear.cx + (gear.rOuter + 14) * Math.cos(rad);
                        const by = gear.cy + (gear.rOuter + 14) * Math.sin(rad);
                        return (
                          <circle
                            key={`bracket-${deg}`}
                            cx={bx}
                            cy={by}
                            r="3.5"
                            fill="#f59e0b"
                            stroke="#fef08a"
                            strokeWidth="1.2"
                            className={styles.targetReticleCorner}
                          />
                        );
                      })}
                    </g>
                  )}

                  {/* Interactive Target Gear Group (Click to cycle rotation options directly) */}
                  <g
                    className={`${isTarget ? styles.targetGearInteractive : ''} ${
                      isTarget && isAnswered && !isCorrect ? styles.gearMeshClash : ''
                    }`}
                    onClick={isTarget ? handleGearBodyClick : undefined}
                    style={{
                      cursor: isTarget && (!isAnswered || !isCorrect) ? 'pointer' : 'default'
                    }}
                    role={isTarget ? 'button' : undefined}
                    aria-label={isTarget ? 'Ketuk Roda Gigi Target untuk memutar dan mengubah arah putaran' : undefined}
                  >
                    {/* Rotating Group for Gear Body */}
                    <g
                      className={rotationClass}
                      style={{
                        transformOrigin: `${gear.cx}px ${gear.cy}px`
                      }}
                    >
                      {/* 3D Depth Silhouette Drop Shadow underneath gear body */}
                      <path
                        d={pathData}
                        fill="#030712"
                        opacity="0.6"
                        transform="translate(0, 5)"
                        filter="url(#gearDropShadow)"
                      />

                      {/* Main Precision-Machined Teeth & Disc Body */}
                      <path
                        d={pathData}
                        fill={fillGradient}
                        stroke={strokeColor}
                        strokeWidth={isTarget ? '2.5' : '2'}
                        filter={filter}
                      />

                      {/* Outer Bevel Highlight Ridge */}
                      <circle
                        cx={gear.cx}
                        cy={gear.cy}
                        r={gear.rInner * 0.94}
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.3)"
                        strokeWidth="1.5"
                      />

                      {/* Recessed Circular Rim Groove */}
                      <circle
                        cx={gear.cx}
                        cy={gear.cy}
                        r={gear.rInner * 0.88}
                        fill="none"
                        stroke="rgba(0, 0, 0, 0.55)"
                        strokeWidth="1"
                      />

                      {/* Mechanical Curved Spoke Cutouts with Embossed Inner Border */}
                      {gData?.spokes.map((spokePath, spIdx) => (
                        <g key={`spoke-${gear.id}-${spIdx}`}>
                          <path
                            d={spokePath}
                            fill="#090d16"
                            stroke="rgba(255, 255, 255, 0.22)"
                            strokeWidth="1.2"
                          />
                          <path
                            d={spokePath}
                            fill="none"
                            stroke="rgba(0, 0, 0, 0.65)"
                            strokeWidth="0.8"
                          />
                        </g>
                      ))}

                      {/* Gleaming Rim Rivets / Bolts */}
                      {gData?.rivets.map((rv, rIdx) => (
                        <g key={`rivet-${gear.id}-${rIdx}`}>
                          <circle
                            cx={rv.x}
                            cy={rv.y}
                            r="2.5"
                            fill="#1e293b"
                            stroke="rgba(255, 255, 255, 0.4)"
                            strokeWidth="0.8"
                          />
                          <circle
                            cx={rv.x - 0.6}
                            cy={rv.y - 0.6}
                            r="0.8"
                            fill="#ffffff"
                            opacity="0.9"
                          />
                        </g>
                      ))}

                      {/* Central Hub Step Collar */}
                      <circle
                        cx={gear.cx}
                        cy={gear.cy}
                        r={gear.rInner * 0.38}
                        fill="url(#gradHubCollar)"
                        stroke="rgba(255, 255, 255, 0.25)"
                        strokeWidth="1.5"
                      />

                      {/* Hexagon Flange Bolt Nut */}
                      {gData?.hexPoints && (
                        <polygon
                          points={gData.hexPoints}
                          fill="url(#gradHexNut)"
                          stroke="#f8fafc"
                          strokeWidth="1.2"
                          filter="drop-shadow(0 2px 3px rgba(0,0,0,0.6))"
                        />
                      )}

                      {/* Precision Steel Ball Bearings for Idler Gears */}
                      {!isDriver && !isTarget && (
                        <g>
                          {gData?.ballBearings.map((bb, bIdx) => (
                            <g key={`bb-${gear.id}-${bIdx}`}>
                              <circle
                                cx={bb.x}
                                cy={bb.y}
                                r="2.5"
                                fill="url(#gradSteelBall)"
                                stroke="#334155"
                                strokeWidth="0.6"
                              />
                              <circle
                                cx={bb.x - 0.6}
                                cy={bb.y - 0.6}
                                r="0.8"
                                fill="#ffffff"
                                opacity="0.9"
                              />
                            </g>
                          ))}
                          <circle
                            cx={gear.cx}
                            cy={gear.cy}
                            r={gear.rInner * 0.12}
                            fill="#0f172a"
                            stroke="#64748b"
                            strokeWidth="1"
                          />
                        </g>
                      )}

                      {/* Driver Electric Cyan Turbine Core */}
                      {isDriver && (
                        <circle
                          cx={gear.cx}
                          cy={gear.cy}
                          r={gear.rInner * 0.2}
                          fill="#0284c7"
                          stroke="#38bdf8"
                          strokeWidth="1.5"
                          className={styles.pulseEnergyCore}
                        />
                      )}
                    </g>
                  </g>

                  {/* Static Overlay: Driver Direction Badge (Does not spin with gear) */}
                  {isDriver && (
                    <g pointerEvents="none">
                      <circle
                        cx={gear.cx}
                        cy={gear.cy}
                        r={gear.rInner * 0.36}
                        fill="rgba(2, 132, 199, 0.88)"
                        stroke="#7dd3fc"
                        strokeWidth="1.8"
                        className={styles.pulseEnergyCore}
                      />
                      <text
                        x={gear.cx}
                        y={gear.cy + (gear.dirLabel?.length > 1 ? 5 : 7)}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize={gear.dirLabel?.length > 1 ? '13' : '20'}
                        fontWeight="900"
                        filter="drop-shadow(0 2px 4px rgba(0,0,0,0.7))"
                      >
                        {gear.dirLabel}
                      </text>
                    </g>
                  )}

                  {/* Static Overlay: Target Center Hub Button (Tactile 3D Button) */}
                  {isTarget && (
                    <g
                      onClick={handleGearBodyClick}
                      style={{ cursor: isAnswered && isCorrect ? 'default' : 'pointer' }}
                      className={styles.targetHubButton}
                    >
                      {/* Button drop shadow */}
                      <circle
                        cx={gear.cx}
                        cy={gear.cy + 2.5}
                        r={gear.rInner * 0.44}
                        fill="rgba(0, 0, 0, 0.55)"
                      />
                      {/* Button Disc with Rich Gradient */}
                      <circle
                        cx={gear.cx}
                        cy={gear.cy}
                        r={gear.rInner * 0.44}
                        fill={
                          isAnswered && isCorrect
                            ? 'url(#gradTargetSuccessBtn)'
                            : isAnswered && !isCorrect
                            ? 'url(#gradTargetWrongBtn)'
                            : 'url(#gradTargetAmberBtn)'
                        }
                        stroke={
                          isAnswered && isCorrect
                            ? '#6ee7b7'
                            : isAnswered && !isCorrect
                            ? '#fca5a5'
                            : '#fef08a'
                        }
                        strokeWidth="2.2"
                        className={!isAnswered ? styles.targetCoreAmber : ''}
                      />
                      {/* Specular sheen crescent highlight */}
                      <ellipse
                        cx={gear.cx}
                        cy={gear.cy - gear.rInner * 0.16}
                        rx={gear.rInner * 0.28}
                        ry={gear.rInner * 0.12}
                        fill="rgba(255, 255, 255, 0.4)"
                        pointerEvents="none"
                      />
                      {/* Big clear symbol */}
                      <text
                        x={gear.cx}
                        y={gear.cy + (isAnswered ? 0 : 1)}
                        textAnchor="middle"
                        fill="#ffffff"
                        fontSize={gear.rInner * 0.36}
                        fontWeight="900"
                        filter="drop-shadow(0 2px 3px rgba(0,0,0,0.7))"
                        pointerEvents="none"
                      >
                        {isAnswered && isCorrect ? '✓' : isAnswered && !isCorrect ? '✕' : '?'}
                      </text>
                      {/* Micro action subtitle */}
                      <text
                        x={gear.cx}
                        y={gear.cy + gear.rInner * 0.25}
                        textAnchor="middle"
                        fill={
                          isAnswered && isCorrect
                            ? '#d1fae5'
                            : isAnswered && !isCorrect
                            ? '#fee2e2'
                            : '#fef08a'
                        }
                        fontSize={Math.max(7, gear.rInner * 0.15)}
                        fontWeight="900"
                        letterSpacing="0.6"
                        filter="drop-shadow(0 1px 2px rgba(0,0,0,0.8))"
                        pointerEvents="none"
                      >
                        {isAnswered && isCorrect ? 'COCOK!' : isAnswered && !isCorrect ? 'TABRAKAN' : 'KETUK'}
                      </text>
                    </g>
                  )}

                  {/* Gear Label Pill below gear */}
                  <g pointerEvents="none">
                    <rect
                      x={gear.cx - 56}
                      y={gear.cy + gear.rOuter + 10}
                      width="112"
                      height="22"
                      rx="7"
                      fill="rgba(15, 23, 42, 0.92)"
                      stroke={
                        isTarget
                          ? isAnswered && isCorrect
                            ? '#10b981'
                            : isAnswered && !isCorrect
                            ? '#ef4444'
                            : '#f59e0b'
                          : isDriver
                          ? '#0284c7'
                          : 'rgba(148, 163, 184, 0.35)'
                      }
                      strokeWidth="1.2"
                      filter="drop-shadow(0 3px 6px rgba(0,0,0,0.4))"
                    />
                    <text
                      x={gear.cx}
                      y={gear.cy + gear.rOuter + 25}
                      textAnchor="middle"
                      fill={
                        isTarget
                          ? isAnswered && isCorrect
                            ? '#34d399'
                            : isAnswered && !isCorrect
                            ? '#fca5a5'
                            : '#fde047'
                          : isDriver
                          ? '#7dd3fc'
                          : '#cbd5e1'
                      }
                      fontSize="10"
                      fontWeight="800"
                      letterSpacing="0.4"
                    >
                      {gear.teethLabel}
                    </text>
                  </g>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* ─── Answer Console / Interaction Area ──────────────────────── */}
      <div className={styles.answerConsoleWrapper}>
        <div className={styles.answerConsoleHeader}>
          <div className={styles.targetStatusWrap}>
            <span className={styles.targetStatusLabel}>Tebak Arah Roda Target:</span>
            {isAnswered && (
              <span
                className={`${styles.targetStatusPill} ${
                  isCorrect ? styles.pillSuccess : styles.pillWrong
                }`}
              >
                <span>{isCorrect ? '✅' : '⚠️'}</span>
                <span>
                  {currentLevel.options.find((o) => o.id === selectedOptionId)?.text}
                </span>
              </span>
            )}
          </div>

          <span className={styles.stepPill}>
            Level {currentLevelIdx + 1} / 3
          </span>
        </div>

        {/* Direction Choice Cards (Kids can clearly see & choose the rotation direction) */}
        <div className={styles.choiceButtonsGrid}>
          {currentLevel.options.map((opt) => {
            const isSelected = selectedOptionId === opt.id;
            const isRight = isSelected && opt.isCorrect;
            const isWrong = isSelected && !opt.isCorrect;

            return (
              <button
                key={opt.id}
                type="button"
                className={`${styles.choiceCardBtn} ${
                  isRight
                    ? styles.choiceSuccess
                    : isWrong
                    ? styles.choiceWrong
                    : isSelected
                    ? styles.choiceActive
                    : ''
                }`}
                onClick={() => handleSelectOption(opt)}
              >
                <span className={styles.choiceCardIcon}>{opt.icon}</span>
                <span className={styles.choiceCardText}>{opt.text}</span>
                {isRight && <span className={styles.choiceBadge}>✅ Cocok!</span>}
                {isWrong && <span className={styles.choiceBadge}>❌ Tabrakan</span>}
              </button>
            );
          })}
        </div>

        {/* Feedback & Result Strip */}
        {isAnswered && (
          <div
            className={`${styles.feedbackResultStrip} ${
              isCorrect ? styles.feedbackSuccess : styles.feedbackWrong
            }`}
          >
            <div className={styles.feedbackContent}>
              <span style={{ fontSize: '1.25rem' }}>{isCorrect ? '✨' : '⚠️'}</span>
              <span>
                {isCorrect
                  ? currentLevel.explanation
                  : currentLevel.options.find((o) => o.id === selectedOptionId)?.wrongFeedback ||
                    'Giginya bertabrakan! Coba pilih arah putaran yang lain.'}
              </span>
            </div>

            {isCorrect && (
              <button
                type="button"
                className={styles.btnNextLevel}
                onClick={handleNextStep}
              >
                {currentLevelIdx < GEAR_LEVELS.length - 1 ? 'Level Berikutnya ➔' : 'Selesaikan Misi 🏆'}
              </button>
            )}
          </div>
        )}
      </div>

      {/* ─── Victory & Rewards Modal ─────────────────────────────────── */}
      {showVictoryModal && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalCard}>
            <div className={styles.modalTrophy}>⚙️</div>
            <span className={styles.modalBadge}>Misi 02 Selesai</span>
            <h3 className={styles.modalTitle}>Kode Roda Gigi Berhasil Dipecahkan!</h3>
            <p className={styles.modalText}>
              Kamu berhasil menaklukkan seluruh prinsip rotasi, paritas sambungan, dan rasio kecepatan mesin benteng kuno Gunung Teka-Teki!
            </p>

            <div className={styles.modalRewardsWrap}>
              <div className={styles.modalRewardPill}>
                <span>✨</span>
                <span>+180 XP</span>
              </div>
              <div className={styles.modalRewardPill}>
                <span>🪙</span>
                <span>+50 Koin</span>
              </div>
              <div className={styles.modalRewardPill}>
                <span>🎴</span>
                <span>Kartu Roda Gigi</span>
              </div>
            </div>

            <button
              type="button"
              className={styles.btnModalFinish}
              onClick={handleFinishAndReturn}
            >
              Klaim Hadiah & Kembali ke Peta ➔
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
