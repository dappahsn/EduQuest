import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { useAudio } from '../../context/AudioContext';
import styles from './RobotRescue.module.css';

// ---------------------------------------------------------------------------
// DATA 3 SEKTOR MISI ROBOT PENYELAMAT (GUNUNG TEKA-TEKI)
// ---------------------------------------------------------------------------
const SECTORS_DATA = [
  {
    id: 'sector-1',
    sectorNum: 1,
    title: 'Sektor 1: Koridor Gerbang Energi',
    subtitle: 'Ketuk petak di papan: injak saklar kuning ⏻ untuk mematikan laser, lalu tuju Baterai 🎯!',
    gridSize: 4, // 4x4
    startPos: { x: 0, y: 0 },
    startFacing: 'SOUTH',
    switchPos: { x: 0, y: 3 },
    laserGates: [
      { x: 2, y: 3 },
      { x: 3, y: 2 }
    ],
    targetPos: { x: 3, y: 3 },
    walls: [
      { x: 1, y: 1 },
      { x: 2, y: 1 }
    ],
    lava: [],
    allowJump: false,
    maxSteps: 15,
    hint: '💡 Ketuk saklar kuning di (0, 3) untuk mematikan gerbang laser merah, lalu ketuk Baterai Kristal di (3, 3)!'
  },
  {
    id: 'sector-2',
    sectorNum: 2,
    title: 'Sektor 2: Labirin Obsidian Berantai',
    subtitle: 'Navigasi labirin dinding obsidian, injak saklar kuning di (0, 4) untuk mematikan laser, lalu tuju Baterai 🎯!',
    gridSize: 5, // 5x5
    startPos: { x: 0, y: 0 },
    startFacing: 'EAST',
    switchPos: { x: 0, y: 4 },
    laserGates: [
      { x: 3, y: 4 },
      { x: 4, y: 2 }
    ],
    targetPos: { x: 4, y: 4 },
    walls: [
      { x: 2, y: 0 },
      { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 3, y: 1 },
      { x: 0, y: 3 }, { x: 1, y: 3 }, { x: 3, y: 3 }, { x: 4, y: 3 }
    ],
    lava: [],
    allowJump: false,
    maxSteps: 25,
    hint: '💡 Lewati lorong tengah berliku untuk menginjak saklar di (0, 4), lalu ketuk Baterai di (4, 4)!'
  },
  {
    id: 'sector-3',
    sectorNum: 3,
    title: 'Sektor 3: Reaktor Inti Siber',
    subtitle: 'Benteng siber 6x6! Hindari jebakan laser, tembus sayap kanan menuju saklar di (5, 0), lalu raih Baterai Inti 🎯!',
    gridSize: 6, // 6x6
    startPos: { x: 0, y: 0 },
    startFacing: 'EAST',
    switchPos: { x: 5, y: 0 },
    laserGates: [
      { x: 3, y: 0 }, // Jebakan laser jalan pintas atas
      { x: 2, y: 4 }, // Laser lorong bawah
      { x: 5, y: 4 }, // Gerbang brankas baterai inti
      { x: 4, y: 5 }  // Gerbang brankas baterai inti
    ],
    targetPos: { x: 5, y: 5 },
    walls: [
      { x: 1, y: 1 }, { x: 2, y: 1 }, { x: 4, y: 1 },
      { x: 4, y: 2 },
      { x: 1, y: 3 }, { x: 2, y: 3 },
      { x: 1, y: 4 },
      { x: 3, y: 5 }
    ],
    lava: [],
    allowJump: false,
    maxSteps: 35,
    hint: '💡 Lorong atas dilindungi laser! Berputarlah lewat lorong tengah ke saklar (5, 0), lalu jemput Baterai Inti di (5, 5)!'
  }
];

const FACING_ANGLES = {
  NORTH: 0,
  EAST: 90,
  SOUTH: 180,
  WEST: 270
};

// Helper Direction Vector & Rotation
const DIR_INFO = {
  NORTH: { dx: 0, dy: -1, angle: 0, label: 'Utara' },
  EAST: { dx: 1, dy: 0, angle: 90, label: 'Timur' },
  SOUTH: { dx: 0, dy: 1, angle: 180, label: 'Selatan' },
  WEST: { dx: -1, dy: 0, angle: 270, label: 'Barat' }
};

// ---------------------------------------------------------------------------
// 3D SCI-FI CHARACTER & SWITCH VECTOR MODELS
// ---------------------------------------------------------------------------
function BudiCharacter3D({ isJumping3D, isDying }) {
  return (
    <div className={`${styles.budiCharacterWrapper} ${isJumping3D ? styles.robotJumping3D : ''} ${isDying ? styles.robotDying : ''}`}>
      <svg
        className={styles.budiSvg}
        viewBox="0 0 76 96"
        width="38"
        height="48"
        style={{ overflow: 'visible', pointerEvents: 'none' }}
      >
        <defs>
          <filter id="budiGlow" x="-25%" y="-25%" width="150%" height="150%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
          <filter id="budiShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.55" />
          </filter>

          {/* Pearl White Helmet Gradient */}
          <linearGradient id="helmetGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="45%" stopColor="#f8fafc" />
            <stop offset="85%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>

          {/* Cyan Accent Gradient */}
          <linearGradient id="cyanTrimGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#0284c7" />
          </linearGradient>

          {/* Deep Visor Gradient */}
          <linearGradient id="visorGlassGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="50%" stopColor="#020617" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>

          {/* Specular Visor Reflection */}
          <linearGradient id="visorShineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.65" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.1" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* Arc Reactor Glowing Core */}
          <radialGradient id="reactorCoreGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="35%" stopColor="#38bdf8" />
            <stop offset="75%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#082f49" />
          </radialGradient>

          {/* Thruster Plasma Flame */}
          <linearGradient id="plasmaFlameGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="25%" stopColor="#67e8f9" />
            <stop offset="65%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="transparent" />
          </linearGradient>
        </defs>

        {/* 1. Dual Plasma Thruster Flame Jets */}
        <g className={styles.svgThrusterGroup}>
          <ellipse cx="31" cy="74" rx="4" ry="8" fill="url(#plasmaFlameGrad)" filter="url(#budiGlow)" />
          <ellipse cx="31" cy="71" rx="2" ry="4" fill="#ffffff" />
          <ellipse cx="45" cy="74" rx="4" ry="8" fill="url(#plasmaFlameGrad)" filter="url(#budiGlow)" />
          <ellipse cx="45" cy="71" rx="2" ry="4" fill="#ffffff" />
        </g>

        {/* Thruster Metal Mount */}
        <path d="M 25 63 L 51 63 L 48 69 L 28 69 Z" fill="#334155" stroke="#1e293b" strokeWidth="1" />
        <ellipse cx="31" cy="68" rx="3.5" ry="1.5" fill="#0f172a" />
        <ellipse cx="45" cy="68" rx="3.5" ry="1.5" fill="#0f172a" />

        {/* 2. Floating Robotic Hands */}
        <g className={styles.svgFloatingHandLeft}>
          <ellipse cx="11" cy="52" rx="6" ry="7" fill="url(#helmetGrad)" stroke="#64748b" strokeWidth="1" filter="url(#budiShadow)" />
          <circle cx="11" cy="52" r="2.5" fill="url(#cyanTrimGrad)" />
          <circle cx="11" cy="52" r="1.2" fill="#ffffff" />
        </g>
        <g className={styles.svgFloatingHandRight}>
          <ellipse cx="65" cy="52" rx="6" ry="7" fill="url(#helmetGrad)" stroke="#64748b" strokeWidth="1" filter="url(#budiShadow)" />
          <circle cx="65" cy="52" r="2.5" fill="url(#cyanTrimGrad)" />
          <circle cx="65" cy="52" r="1.2" fill="#ffffff" />
        </g>

        {/* 3. Torso Chassis & Arc Reactor */}
        <g filter="url(#budiShadow)">
          <rect x="33" y="38" width="10" height="5" rx="2" fill="#475569" />
          <rect x="23" y="41" width="30" height="24" rx="8" fill="url(#helmetGrad)" stroke="#94a3b8" strokeWidth="1.2" />
          <path d="M 27 47 Q 38 52 49 47" fill="none" stroke="#cbd5e1" strokeWidth="1" />
          
          <circle cx="38" cy="53" r="6.5" fill="#0f172a" stroke="#0284c7" strokeWidth="1.2" />
          <circle cx="38" cy="53" r="4.5" fill="url(#reactorCoreGrad)" filter="url(#budiGlow)" />
          <circle cx="38" cy="53" r="2" fill="#ffffff" />
        </g>

        {/* 4. Helmet & Head Details */}
        {/* Antenna Pole & Beacon */}
        <line x1="38" y1="12" x2="38" y2="4" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
        <circle cx="38" cy="4" r="3.5" fill="#fbbf24" stroke="#d97706" strokeWidth="1" />
        <circle cx="38" cy="4" r="1.5" fill="#ffffff" />
        <circle cx="38" cy="4" r="6" fill="none" stroke="#38bdf8" strokeWidth="0.8" opacity="0.6" className={styles.svgAntennaPulse} />

        {/* Ear Pods */}
        <g filter="url(#budiShadow)">
          <rect x="13" y="19" width="5" height="12" rx="2.5" fill="#334155" stroke="#1e293b" strokeWidth="1" />
          <circle cx="15.5" cy="25" r="2" fill="#38bdf8" />
          <rect x="58" y="19" width="5" height="12" rx="2.5" fill="#334155" stroke="#1e293b" strokeWidth="1" />
          <circle cx="60.5" cy="25" r="2" fill="#38bdf8" />
        </g>

        {/* Helmet Outer Shell */}
        <rect
          x="16"
          y="10"
          width="44"
          height="32"
          rx="16"
          fill="url(#helmetGrad)"
          stroke="#94a3b8"
          strokeWidth="1.5"
          filter="url(#budiShadow)"
        />

        {/* Visor Screen Glass */}
        <rect
          x="20"
          y="14"
          width="36"
          height="23"
          rx="11"
          fill="url(#visorGlassGrad)"
          stroke="#38bdf8"
          strokeWidth="1.2"
        />

        {/* Specular Curved Visor Reflection */}
        <path
          d="M 23 16 Q 38 18 49 20 Q 38 23 23 20 Z"
          fill="url(#visorShineGrad)"
        />

        {/* Expressive Glowing Eyes: Dead X eyes when isDying, else cute cyan eyes */}
        <g className={styles.svgBudiEyesGroup} filter="url(#budiGlow)">
          {isDying ? (
            <g stroke="#ef4444" strokeWidth="3" strokeLinecap="round">
              <line x1="28" y1="23" x2="34" y2="29" />
              <line x1="34" y1="23" x2="28" y2="29" />
              <line x1="42" y1="23" x2="48" y2="29" />
              <line x1="48" y1="23" x2="42" y2="29" />
            </g>
          ) : (
            <>
              <path
                d="M 27 26 Q 31 21 35 26"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
              <circle cx="31" cy="27" r="1" fill="#ffffff" />

              <path
                d="M 41 26 Q 45 21 49 26"
                fill="none"
                stroke="#38bdf8"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
              <circle cx="45" cy="27" r="1" fill="#ffffff" />
            </>
          )}
        </g>

        {/* Cute Glowing Cheek Blushes */}
        <ellipse cx="26" cy="31" rx="2.5" ry="1.2" fill={isDying ? '#ef4444' : '#38bdf8'} opacity="0.55" />
        <ellipse cx="50" cy="31" rx="2.5" ry="1.2" fill={isDying ? '#ef4444' : '#38bdf8'} opacity="0.55" />

        {/* Electric Zap Sparks when Dying */}
        {isDying && (
          <g className={styles.zapSparks}>
            <path d="M 8 16 L 16 26 L 12 28 L 20 40" stroke="#fef08a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 68 18 L 60 28 L 64 30 L 56 42" stroke="#fef08a" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <circle cx="38" cy="48" r="10" fill="rgba(239, 68, 68, 0.45)" filter="url(#budiGlow)" />
          </g>
        )}
      </svg>
    </div>
  );
}

function SciFiSwitch3D({ isSwitchActive, isNextStep = false, stepArrow = '▼' }) {
  let labelText = '⏻ SAKLAR';
  if (isSwitchActive) {
    labelText = '⚡ AKTIF';
  } else if (isNextStep) {
    labelText = `${stepArrow} SAKLAR`;
  }

  return (
    <div className={`${styles.switchPad3D} ${isSwitchActive ? styles.switchPadActive : ''}`}>
      <svg
        className={styles.switchSvg}
        viewBox="0 0 80 80"
        width="34"
        height="34"
      >
        <defs>
          <filter id="switchGlowFilter" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          <linearGradient id="switchArmorPlate" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="50%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          <radialGradient id="plungerAmberCore" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#fef08a" />
            <stop offset="30%" stopColor="#f59e0b" />
            <stop offset="75%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#78350f" />
          </radialGradient>

          <radialGradient id="plungerEmeraldCore" cx="45%" cy="40%" r="65%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="25%" stopColor="#a7f3d0" />
            <stop offset="60%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#064e3b" />
          </radialGradient>
        </defs>

        {/* 1. Heavy Octagonal Armor Base Chassis */}
        <polygon
          points="20,4 60,4 76,20 76,60 60,76 20,76 4,60 4,20"
          fill="url(#switchArmorPlate)"
          stroke={isSwitchActive ? '#10b981' : isNextStep ? '#22d3ee' : '#f59e0b'}
          strokeWidth="2.5"
          filter="drop-shadow(0px 2px 5px rgba(0,0,0,0.8))"
        />

        {/* 2. Four Heavy Corner Industrial Bolts */}
        <circle cx="14" cy="14" r="3.2" fill="#334155" stroke="#64748b" strokeWidth="1" />
        <circle cx="66" cy="14" r="3.2" fill="#334155" stroke="#64748b" strokeWidth="1" />
        <circle cx="14" cy="66" r="3.2" fill="#334155" stroke="#64748b" strokeWidth="1" />
        <circle cx="66" cy="66" r="3.2" fill="#334155" stroke="#64748b" strokeWidth="1" />

        {/* 3. Glowing Power Circuit Traces */}
        <g stroke={isSwitchActive ? '#34d399' : isNextStep ? '#38bdf8' : '#f59e0b'} strokeWidth="1.8" strokeLinecap="round" opacity="0.85" filter="url(#switchGlowFilter)">
          <line x1="40" y1="5" x2="40" y2="16" />
          <line x1="40" y1="64" x2="40" y2="75" />
          <line x1="5" y1="40" x2="16" y2="40" />
          <line x1="64" y1="40" x2="75" y2="40" />
          <line x1="20" y1="20" x2="26" y2="26" />
          <line x1="60" y1="20" x2="54" y2="26" />
          <line x1="20" y1="60" x2="26" y2="54" />
          <line x1="60" y1="60" x2="54" y2="54" />
        </g>

        {/* 4. Hydraulic Compression Well */}
        <circle
          cx="40"
          cy="40"
          r="23"
          fill="#090d16"
          stroke={isSwitchActive ? '#047857' : '#451a03'}
          strokeWidth="2"
        />

        {/* 5. Rotating Sci-Fi Dashed Circuit Ring */}
        <circle
          cx="40"
          cy="40"
          r="21"
          fill="none"
          stroke={isSwitchActive ? '#34d399' : isNextStep ? '#38bdf8' : '#fbbf24'}
          strokeWidth="1.2"
          strokeDasharray="4 3"
          className={styles.switchRotatingRing}
        />

        {/* 6. Central Tactile Pressure Disc / Plunger */}
        <g className={isSwitchActive ? styles.switchDepressedGroup : styles.switchRaisedGroup}>
          <circle
            cx="40"
            cy="40"
            r={isSwitchActive ? 16 : 17.5}
            fill={isSwitchActive ? 'url(#plungerEmeraldCore)' : 'url(#plungerAmberCore)'}
            stroke={isSwitchActive ? '#6ee7b7' : isNextStep ? '#a5f3fc' : '#fef08a'}
            strokeWidth={isSwitchActive ? 2 : 2.5}
            filter={isSwitchActive ? 'url(#switchGlowFilter)' : undefined}
          />

          {isSwitchActive ? (
            <g filter="url(#switchGlowFilter)">
              <path
                d="M 33 40 L 38 45 L 49 34"
                fill="none"
                stroke="#ffffff"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="40" cy="40" r="13" fill="none" stroke="#ffffff" strokeWidth="1" opacity="0.6" />
            </g>
          ) : (
            <g>
              <path
                d="M 35 34 A 7.5 7.5 0 1 0 45 34"
                fill="none"
                stroke="#451a03"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
              <line
                x1="40"
                y1="31"
                x2="40"
                y2="39"
                stroke="#451a03"
                strokeWidth="2.8"
                strokeLinecap="round"
              />
              <path
                d="M 35 34 A 7.5 7.5 0 1 0 45 34"
                fill="none"
                stroke="#fef08a"
                strokeWidth="1"
                strokeLinecap="round"
                opacity="0.75"
              />
            </g>
          )}
        </g>
      </svg>

      {/* Floor Label */}
      <div
        className={`${styles.switchFloorLabel} ${
          isSwitchActive
            ? styles.switchFloorLabelActive
            : isNextStep
            ? styles.switchFloorLabelNext
            : ''
        }`}
      >
        {labelText}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// ---------------------------------------------------------------------------
// AUDIO SYNTH HELPER: Realistic Sci-Fi Laser Zap SFX
// ---------------------------------------------------------------------------
const playLaserZapSfx = () => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sawtooth';
    const now = ctx.currentTime;
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.35);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.36);
  } catch (e) {
    // AudioContext fallback
  }
};

// ---------------------------------------------------------------------------
// BFS SHORTEST PATH FINDER (with allowLaser flag)
// ---------------------------------------------------------------------------
function findShortestPath(start, target, sector, switchActive, allowLaser = false) {
  if (start.x === target.x && start.y === target.y) return [];

  const size = sector.gridSize;
  const isWall = (x, y) => sector.walls.some((w) => w.x === x && w.y === y);
  const isLava = (x, y) => sector.lava.some((l) => l.x === x && l.y === y);
  const isLaser = (x, y) => {
    if (switchActive) return false;
    return sector.laserGates && sector.laserGates.some((lg) => lg.x === x && lg.y === y);
  };

  const queue = [{ x: start.x, y: start.y, path: [] }];
  const visited = new Set();
  visited.add(`${start.x},${start.y}`);

  const DIRS = [
    { dx: 1, dy: 0, facing: 'EAST', type: 'WALK' },
    { dx: -1, dy: 0, facing: 'WEST', type: 'WALK' },
    { dx: 0, dy: 1, facing: 'SOUTH', type: 'WALK' },
    { dx: 0, dy: -1, facing: 'NORTH', type: 'WALK' }
  ];

  const JUMP_DIRS = [
    { dx: 2, dy: 0, facing: 'EAST', type: 'JUMP' },
    { dx: -2, dy: 0, facing: 'WEST', type: 'JUMP' },
    { dx: 0, dy: 2, facing: 'SOUTH', type: 'JUMP' },
    { dx: 0, dy: -2, facing: 'NORTH', type: 'JUMP' }
  ];

  while (queue.length > 0) {
    const current = queue.shift();

    if (current.x === target.x && current.y === target.y) {
      return current.path;
    }

    // 1. Regular 1-step walk
    for (const d of DIRS) {
      const nx = current.x + d.dx;
      const ny = current.y + d.dy;
      const key = `${nx},${ny}`;

      if (nx >= 0 && nx < size && ny >= 0 && ny < size && !visited.has(key)) {
        const laserBlock = !allowLaser && isLaser(nx, ny);
        if (!isWall(nx, ny) && !isLava(nx, ny) && !laserBlock) {
          visited.add(key);
          queue.push({
            x: nx,
            y: ny,
            path: [...current.path, { x: nx, y: ny, facing: d.facing, type: 'WALK' }]
          });
        }
      }
    }

    // 2. Jump (if allowed in this sector)
    if (sector.allowJump) {
      for (const jd of JUMP_DIRS) {
        const nx = current.x + jd.dx;
        const ny = current.y + jd.dy;
        const midX = (current.x + nx) / 2;
        const midY = (current.y + ny) / 2;
        const key = `${nx},${ny}`;

        const laserBlock = !allowLaser && isLaser(nx, ny);
        // Can leap over lava or empty gap, but cannot jump through solid wall or laser
        if (
          nx >= 0 &&
          nx < size &&
          ny >= 0 &&
          ny < size &&
          !visited.has(key) &&
          !isWall(midX, midY) &&
          !isWall(nx, ny) &&
          !isLava(nx, ny) &&
          !laserBlock
        ) {
          visited.add(key);
          queue.push({
            x: nx,
            y: ny,
            path: [...current.path, { x: nx, y: ny, facing: jd.facing, type: 'JUMP' }]
          });
        }
      }
    }
  }

  return null;
}

export default function RobotRescue({ questId: propQuestId, onGameComplete = null }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const targetQuestId = propQuestId || searchParams.get('questId') || 'quest-gt-1';

  const { completeQuest } = useGame();
  const { playSfx } = useAudio();

  // Sector State
  const [currentSectorIdx, setCurrentSectorIdx] = useState(0);
  const currentSector = SECTORS_DATA[currentSectorIdx];

  // Robot 3D State
  const [robotPos, setRobotPos] = useState({ ...currentSector.startPos });
  const robotPosRef = useRef({ ...currentSector.startPos });
  const [robotFacing, setRobotFacing] = useState(currentSector.startFacing);
  const [isJumping3D, setIsJumping3D] = useState(false);
  const [isSwitchActive, setIsSwitchActive] = useState(false);
  const [isWalking, setIsWalking] = useState(false);
  const [isDying, setIsDying] = useState(false);
  const [laserHitPos, setLaserHitPos] = useState(null);

  // Interval & Timeout Refs
  const walkIntervalRef = useRef(null);
  const deathTimeoutRef = useRef(null);

  // Path History for Undo & Step Count
  const [history, setHistory] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');
  const [statusType, setStatusType] = useState('idle'); // 'idle', 'success', 'error'
  const [showHint, setShowHint] = useState(false);
  const [showSectorSuccess, setShowSectorSuccess] = useState(false);
  const [showGameComplete, setShowGameComplete] = useState(false);

  // Reset to initial sector state
  const resetSector = (sectorIdx = currentSectorIdx) => {
    if (walkIntervalRef.current) {
      clearInterval(walkIntervalRef.current);
      walkIntervalRef.current = null;
    }
    if (deathTimeoutRef.current) {
      clearTimeout(deathTimeoutRef.current);
      deathTimeoutRef.current = null;
    }
    const sec = SECTORS_DATA[sectorIdx];
    robotPosRef.current = { ...sec.startPos };
    setRobotPos({ ...sec.startPos });
    setRobotFacing(sec.startFacing);
    setIsJumping3D(false);
    setIsSwitchActive(false);
    setIsWalking(false);
    setIsDying(false);
    setLaserHitPos(null);
    setHistory([]);
    setStatusMessage(sec.subtitle);
    setStatusType('idle');
    setShowHint(false);
    setShowSectorSuccess(false);
  };

  useEffect(() => {
    resetSector(currentSectorIdx);
    return () => {
      if (walkIntervalRef.current) clearInterval(walkIntervalRef.current);
      if (deathTimeoutRef.current) clearTimeout(deathTimeoutRef.current);
    };
  }, [currentSectorIdx]);

  // Safeguard: Check if robot is trapped in an invalid tile behind lasers
  useEffect(() => {
    if (isDying) return;
    const curRobot = robotPosRef.current || robotPos;
    if (currentSector.switchPos && !isSwitchActive) {
      const pathToSwitch = findShortestPath(curRobot, currentSector.switchPos, currentSector, false);
      if (!pathToSwitch && (curRobot.x !== currentSector.switchPos.x || curRobot.y !== currentSector.switchPos.y)) {
        console.warn('Robot trapped in unreachable position! Auto-resetting to startPos.');
        resetSector(currentSectorIdx);
      }
    }
  }, [currentSectorIdx, isSwitchActive, isDying]);

  // Compute if a cell is an immediate 1-step next tile (for indicator pulse)
  const getImmediateMoveType = (x, y) => {
    if (showSectorSuccess || isDying) return null;
    const curRobot = robotPosRef.current || robotPos;
    const dx = x - curRobot.x;
    const dy = y - curRobot.y;

    const isWall = currentSector.walls.some((w) => w.x === x && w.y === y);
    if (isWall) return null;

    if (currentSector.laserGates && currentSector.laserGates.length > 0 && !isSwitchActive) {
      const isLaser = currentSector.laserGates.some((lg) => lg.x === x && lg.y === y);
      if (isLaser) return null;
    }

    if (Math.abs(dx) + Math.abs(dy) === 1) {
      const isLava = currentSector.lava.some((l) => l.x === x && l.y === y);
      if (isLava) return null;
      return 'WALK';
    }

    if (currentSector.allowJump) {
      const isStraightTwoSteps =
        (Math.abs(dx) === 2 && dy === 0) || (Math.abs(dy) === 2 && dx === 0);

      if (isStraightTwoSteps) {
        const midX = (curRobot.x + x) / 2;
        const midY = (curRobot.y + y) / 2;
        const isWallMid = currentSector.walls.some((w) => w.x === midX && w.y === midY);
        const isLavaDest = currentSector.lava.some((l) => l.x === x && l.y === y);
        if (!isWallMid && !isLavaDest) return 'JUMP';
      }
    }

    return null;
  };

  // -------------------------------------------------------------------------
  // TRIGGER LASER DEATH & RESTART SECTOR
  // -------------------------------------------------------------------------
  const triggerLaserDeath = (laserX, laserY) => {
    if (walkIntervalRef.current) {
      clearInterval(walkIntervalRef.current);
      walkIntervalRef.current = null;
    }
    setIsWalking(false);
    setIsDying(true);
    setLaserHitPos({ x: laserX, y: laserY });

    // Audio & Visual Effects
    playSfx('wrong');
    playLaserZapSfx();

    setStatusMessage('⚡💥 BZZZT! Bot Budi terkena sengatan gerbang laser! Mengulang sektor...');
    setStatusType('error');

    if (deathTimeoutRef.current) clearTimeout(deathTimeoutRef.current);
    deathTimeoutRef.current = setTimeout(() => {
      resetSector(currentSectorIdx);
      setStatusMessage('⚡ Hati-hati! Injak saklar kuning ⏻ terlebih dahulu untuk mematikan laser merah.');
      setStatusType('error');
    }, 1200);
  };

  // Find Path helper: Prioritize safe path, fallback to hazard path so robot moves into laser & dies
  const findPathTo = (destX, destY) => {
    const curRobot = robotPosRef.current || robotPos;

    // 1. Safe direct path avoiding active lasers
    const safePath = findShortestPath(curRobot, { x: destX, y: destY }, currentSector, isSwitchActive, false);
    if (safePath && safePath.length > 0) return safePath;

    // 2. If no safe path exists (e.g. user clicked directly on laser, or target guarded by laser),
    // allow path towards target so robot walks into active laser, dies and restarts!
    const hazardPath = findShortestPath(curRobot, { x: destX, y: destY }, currentSector, isSwitchActive, true);
    if (hazardPath && hazardPath.length > 0) return hazardPath;

    return null;
  };

  // Execute a sequence of steps smoothly
  const executePath = (pathSteps) => {
    if (!pathSteps || pathSteps.length === 0 || isDying) return;

    if (walkIntervalRef.current) {
      clearInterval(walkIntervalRef.current);
      walkIntervalRef.current = null;
    }

    let currPos = { ...(robotPosRef.current || robotPos) };
    let currFacing = robotFacing;
    let currSwitch = isSwitchActive;
    let currHistory = [...history];

    const doOneStep = (step) => {
      currHistory.push({
        pos: { ...currPos },
        facing: currFacing,
        switchActive: currSwitch
      });
      setHistory([...currHistory]);

      currPos = { x: step.x, y: step.y };
      currFacing = step.facing;
      robotPosRef.current = { ...currPos };
      setRobotPos({ ...currPos });
      setRobotFacing(currFacing);

      if (step.type === 'JUMP') {
        setIsJumping3D(true);
        playSfx('pet-unlock');
        setTimeout(() => setIsJumping3D(false), 280);
      } else {
        playSfx('button-click');
      }

      // Check if stepped on switch
      if (
        currentSector.switchPos &&
        step.x === currentSector.switchPos.x &&
        step.y === currentSector.switchPos.y &&
        !currSwitch
      ) {
        currSwitch = true;
        setIsSwitchActive(true);
        playSfx('hint');
        setStatusMessage('🟢 Saklar energi terinjak! Gerbang laser dinonaktifkan.');
        setStatusType('success');
      }

      // Check if stepped on active laser gate!
      const isLaserHit =
        !currSwitch &&
        currentSector.laserGates &&
        currentSector.laserGates.some((lg) => lg.x === step.x && lg.y === step.y);

      if (isLaserHit) {
        triggerLaserDeath(step.x, step.y);
        return true; // Stop execution immediately!
      }

      if (step.x === currentSector.targetPos.x && step.y === currentSector.targetPos.y) {
        playSfx('correct');
        setStatusMessage('🎉 Baterai Kristal 3D berhasil dijangkau!');
        setStatusType('success');
        setTimeout(() => setShowSectorSuccess(true), 350);
        return true;
      } else {
        if (!currSwitch || step.x !== currentSector.switchPos?.x || step.y !== currentSector.switchPos?.y) {
          setStatusMessage(`Bot Budi melangkah ke (${step.x}, ${step.y})`);
          setStatusType('idle');
        }
      }

      return false;
    };

    // 1-step click: execute immediately with zero delay
    if (pathSteps.length === 1) {
      setIsWalking(false);
      doOneStep(pathSteps[0]);
      return;
    }

    // Multi-step movement: do step 0 immediately, then animate remaining steps
    setIsWalking(true);
    setStatusMessage('🚀 Bot Budi sedang melangkah ke tujuan...');
    setStatusType('idle');

    const reachedOnFirst = doOneStep(pathSteps[0]);
    if (reachedOnFirst) {
      setIsWalking(false);
      return;
    }

    let idx = 1;
    walkIntervalRef.current = setInterval(() => {
      if (idx >= pathSteps.length) {
        clearInterval(walkIntervalRef.current);
        walkIntervalRef.current = null;
        setIsWalking(false);
        return;
      }

      const reached = doOneStep(pathSteps[idx]);
      if (reached) {
        clearInterval(walkIntervalRef.current);
        walkIntervalRef.current = null;
        setIsWalking(false);
        return;
      }

      idx++;
    }, 200);
  };

  // -------------------------------------------------------------------------
  // DIRECT TILE CLICK HANDLER (Works from any distance & directly on Target!)
  // -------------------------------------------------------------------------
  const handleTileClick = (targetX, targetY) => {
    if (showSectorSuccess || isDying) return;

    // If an animation is in progress, interrupt it to prioritize the player's new click
    if (walkIntervalRef.current) {
      clearInterval(walkIntervalRef.current);
      walkIntervalRef.current = null;
    }
    setIsWalking(false);

    // Already on this tile
    const curRobot = robotPosRef.current || robotPos;
    console.log(`[RobotRescue] Tile clicked: (${targetX}, ${targetY}), Robot at: (${curRobot.x}, ${curRobot.y})`);
    if (targetX === curRobot.x && targetY === curRobot.y) {
      playSfx('button-hover');
      if (currentSector.switchPos && targetX === currentSector.switchPos.x && targetY === currentSector.switchPos.y) {
        setStatusMessage('🟢 Bot sudah di atas saklar! Gerbang laser nonaktif. Ketuk Baterai 🎯!');
      } else {
        setStatusMessage(`🤖 Bot sudah di posisi (${targetX}, ${targetY})! Ketuk kotak lain untuk melangkah.`);
      }
      setStatusType('idle');
      return;
    }

    // Clicked on wall
    const isWall = currentSector.walls.some((w) => w.x === targetX && w.y === targetY);
    if (isWall) {
      playSfx('wrong');
      setStatusMessage('⚠️ Dinding batu obsidian tebal! Tidak bisa dilewati.');
      setStatusType('error');
      return;
    }

    // Clicked on lava
    const isLava = currentSector.lava.some((l) => l.x === targetX && l.y === targetY);
    if (isLava) {
      playSfx('wrong');
      setStatusMessage('🔥 Jurang lahar panas! Ketuk balok di seberang untuk melompat.');
      setStatusType('error');
      return;
    }

    // Find Path using BFS (safe first, or hazard towards laser/target)
    let path = findPathTo(targetX, targetY);

    if (!path || path.length === 0) {
      // If user clicked on switch but robot was somehow trapped:
      if (currentSector.switchPos && targetX === currentSector.switchPos.x && targetY === currentSector.switchPos.y) {
        console.warn('Auto-recovering trapped robot to startPos');
        robotPosRef.current = { ...currentSector.startPos };
        setRobotPos({ ...currentSector.startPos });
        const retryPath = findShortestPath(currentSector.startPos, currentSector.switchPos, currentSector, false);
        if (retryPath && retryPath.length > 0) {
          executePath(retryPath);
          return;
        }
      }

      playSfx('wrong');
      setStatusMessage('⚠️ Jalur terhalang atau tidak dapat dijangkau!');
      setStatusType('error');
      return;
    }

    executePath(path);
  };



  // -------------------------------------------------------------------------
  // DIRECT D-PAD & KEYBOARD STEPPING
  // -------------------------------------------------------------------------
  const handleStepDirection = (dx, dy, facing) => {
    if (showSectorSuccess || isWalking || isDying) return;
    const curRobot = robotPosRef.current || robotPos;
    const nx = curRobot.x + dx;
    const ny = curRobot.y + dy;
    if (nx < 0 || nx >= currentSector.gridSize || ny < 0 || ny >= currentSector.gridSize) {
      playSfx('wrong');
      setStatusMessage('⚠️ Menabrak batas benteng mekanik!');
      setStatusType('error');
      return;
    }
    handleTileClick(nx, ny);
  };

  // Keyboard controls listener (Arrow Keys & WASD)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (showSectorSuccess || isWalking || isDying) return;
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        e.preventDefault();
        handleStepDirection(0, -1, 'NORTH');
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        e.preventDefault();
        handleStepDirection(0, 1, 'SOUTH');
      } else if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        handleStepDirection(-1, 0, 'WEST');
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        handleStepDirection(1, 0, 'EAST');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showSectorSuccess, isWalking, currentSector, robotPos, isSwitchActive]);

  const handleNextSector = () => {
    if (currentSectorIdx < SECTORS_DATA.length - 1) {
      playSfx('level-up');
      setCurrentSectorIdx((prev) => prev + 1);
    } else {
      handleCompleteMissions();
    }
  };

  const handleCompleteMissions = () => {
    playSfx('quest-complete');
    setShowGameComplete(true);
    completeQuest('quest-gt-1', 160, 45, 50, 'card-volcano', 'outfit-cyber');
  };

  // Render Direct Tactical Grid Cells (100% Reliable Hit-testing, Zero 3D Skew)
  const renderTacticalGrid = () => {
    const size = currentSector.gridSize;
    const cells = [];

    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        const isRobot = robotPos.x === x && robotPos.y === y;
        const isTarget = currentSector.targetPos.x === x && currentSector.targetPos.y === y;
        const isWall = currentSector.walls?.some((w) => w.x === x && w.y === y);
        const isLava = currentSector.lava?.some((l) => l.x === x && l.y === y);
        const isSwitch = currentSector.switchPos && currentSector.switchPos.x === x && currentSector.switchPos.y === y;
        const isLaser = currentSector.laserGates && currentSector.laserGates.some((lg) => lg.x === x && lg.y === y);
        const isLaserActive = isLaser && !isSwitchActive;

        const moveType = getImmediateMoveType(x, y);


        let cellSpecificClass = '';
        if (isWall) cellSpecificClass = styles.tacticalCellWall;
        else if (isLava) cellSpecificClass = styles.tacticalCellLava;
        else if (isLaserActive && isRobot && isDying) cellSpecificClass = styles.tacticalCellLaserZapped;
        else if (isLaserActive) cellSpecificClass = styles.tacticalCellLaser;
        else if (isLaser && isSwitchActive) cellSpecificClass = styles.tacticalCellLaserOff;
        else if (isSwitch && isSwitchActive) cellSpecificClass = styles.tacticalCellSwitchActive;
        else if (isSwitch && !isSwitchActive) cellSpecificClass = styles.tacticalCellSwitch;
        else if (isTarget) cellSpecificClass = styles.tacticalCellTarget;
        else if (moveType === 'WALK') cellSpecificClass = styles.tacticalCellWalkable;

        cells.push(
          <div
            key={`tactical-${x}-${y}`}
            id={`tile-${x}-${y}`}
            className={`${styles.tacticalCell} ${cellSpecificClass}`}
            onClick={() => handleTileClick(x, y)}
            title={
              isRobot
                ? `Bot Budi di (${x}, ${y})`
                : isSwitch
                ? `Saklar Energi (${x}, ${y}) - ${isSwitchActive ? 'Aktif' : 'Nonaktif'}`
                : isLaserActive
                ? `Gerbang Laser Merah (${x}, ${y}) - Aktif!`
                : isTarget
                ? `Baterai Kristal (${x}, ${y})`
                : `Petak (${x}, ${y})`
            }
          >
            {/* 1. Robot Character Sprite */}
            {isRobot && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: `rotate(${FACING_ANGLES[robotFacing] || 0}deg)`,
                  transition: 'transform 0.25s ease',
                  pointerEvents: 'none'
                }}
              >
                <BudiCharacter3D isJumping3D={isJumping3D} isDying={isDying} />
              </div>
            )}

            {/* 2. Switch Element */}
            {isSwitch && !isRobot && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '2px',
                  pointerEvents: 'none'
                }}
              >
                <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>{isSwitchActive ? '🟢' : '🟡'}</span>
                <span
                  style={{
                    fontSize: '0.62rem',
                    fontWeight: 900,
                    color: isSwitchActive ? '#34d399' : '#f59e0b',
                    letterSpacing: '0.5px'
                  }}
                >
                  {isSwitchActive ? 'TERBUKA' : 'SAKLAR'}
                </span>
              </div>
            )}

            {/* 3. Laser Element */}
            {isLaser && !isRobot && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '2px',
                  pointerEvents: 'none'
                }}
              >
                <span style={{ fontSize: '1.3rem', lineHeight: 1 }}>{isLaserActive ? '⚡' : '🛡️'}</span>
                <span
                  style={{
                    fontSize: '0.6rem',
                    fontWeight: 800,
                    color: isLaserActive ? '#ef4444' : '#64748b'
                  }}
                >
                  {isLaserActive ? 'LASER' : 'AMAN'}
                </span>
              </div>
            )}

            {/* 4. Target Element (Battery) */}
            {isTarget && !isRobot && (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '2px',
                  pointerEvents: 'none'
                }}
              >
                <span style={{ fontSize: '1.4rem', lineHeight: 1 }}>🎯</span>
                <span
                  style={{
                    fontSize: '0.62rem',
                    fontWeight: 900,
                    color: '#38bdf8',
                    textShadow: '0 0 8px rgba(56, 189, 248, 0.8)'
                  }}
                >
                  BATERAI
                </span>
              </div>
            )}

            {/* 5. Walkable indicator for adjacent cells (clean glowing indicator, no text/arrows) */}
            {moveType === 'WALK' && !isTarget && !isSwitch && !isRobot && (
              <span className={styles.walkDot} style={{ pointerEvents: 'none' }} />
            )}

            {/* 6. Jump indicator for jumpable cells */}
            {moveType === 'JUMP' && !isTarget && !isSwitch && !isRobot && (
              <span style={{ fontSize: '1.1rem', pointerEvents: 'none' }}>⚡</span>
            )}

            {/* 7. Wall Cell */}
            {isWall && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none' }}>
                <span style={{ fontSize: '1.2rem', opacity: 0.6 }}>🧱</span>
              </div>
            )}

            {/* 8. Lava Cell */}
            {isLava && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', pointerEvents: 'none' }}>
                <span style={{ fontSize: '1.2rem' }}>🔥</span>
              </div>
            )}

            {/* 9. Coordinates watermark for plain empty cells */}
            {!isRobot && !isTarget && !isSwitch && !isLaser && !moveType && !isWall && !isLava && (
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  color: 'rgba(148, 163, 184, 0.25)',
                  pointerEvents: 'none'
                }}
              >
                {x},{y}
              </span>
            )}
          </div>
        );
      }
    }

    return cells;
  };

  return (
    <div className={styles.gameContainer}>
      {/* Top Header Bar */}
      <div className={styles.topControlBar}>
        <div className={styles.sectorBadgeWrap}>
          <span className={styles.sectorBadge}>Sektor {currentSector.sectorNum} / 3</span>
          <h2 className={styles.sectorTitle}>{currentSector.title}</h2>
        </div>

        <div className={styles.topActionBtns}>
          <button
            type="button"
            className={`${styles.iconBtn} ${showHint ? styles.iconBtnActive : ''}`}
            onClick={() => setShowHint((prev) => !prev)}
            title="Petunjuk Algoritma"
          >
            <span>💡</span>
            <span className={styles.iconBtnLabel}>Petunjuk</span>
          </button>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={() => resetSector(currentSectorIdx)}
            disabled={isWalking || isDying}
            title="Mulai Ulang Sektor"
          >
            <span>↺</span>
            <span className={styles.iconBtnLabel}>Ulangi</span>
          </button>
        </div>
      </div>

      {/* Status / Hint Toast */}
      {showHint ? (
        <div className={styles.hintBanner}>
          <span className={styles.hintEmoji}>💡</span>
          <span className={styles.hintText}>{currentSector.hint}</span>
          <button
            type="button"
            className={styles.hintClose}
            onClick={() => setShowHint(false)}
          >
            ✕
          </button>
        </div>
      ) : (
        <div className={`${styles.statusBanner} ${styles['status_' + statusType]}`}>
          <span className={styles.statusIndicator}>
            {statusType === 'success' && '✨'}
            {statusType === 'error' && '⚠️'}
            {statusType === 'idle' && '👆'}
          </span>
          <span className={styles.statusText}>{statusMessage}</span>
        </div>
      )}

      {/* 🌟 DIRECT TACTICAL ARENA (No Blocks, 100% Reliable Board Play) 🌟 */}
      <div className={styles.arenaTacticalWrapper} style={{ position: 'relative' }}>
        {isDying && (
          <div className={styles.deathOverlay}>
            <div className={styles.deathOverlayTitle}>
              <span>⚡</span>
              <span>TERKENA LASER!</span>
              <span>⚡</span>
            </div>
            <span className={styles.deathOverlaySub}>Mengulang dari titik awal...</span>
          </div>
        )}
        <div
          className={styles.tacticalBoard}
          style={{
            gridTemplateColumns: `repeat(${currentSector.gridSize}, 1fr)`,
            gridTemplateRows: `repeat(${currentSector.gridSize}, 1fr)`
          }}
        >
          {renderTacticalGrid()}
        </div>
      </div>

      {/* Bottom Interactive Control Bar with D-Pad & Undo */}
      <div className={styles.bottomInteractiveBar}>
        <div className={styles.stepMeterWrap}>
          <span className={styles.stepMeterLabel}>Langkah:</span>
          <div className={styles.stepMeterPill}>
            <span className={styles.stepCountNow}>{history.length}</span>
            <span className={styles.stepCountMax}>/ {currentSector.maxSteps}</span>
          </div>
        </div>


        <div className={styles.interactiveActionBtns}>
          <button
            type="button"
            className={styles.btnRestartSmall}
            onClick={() => resetSector(currentSectorIdx)}
            disabled={isWalking || isDying}
            title="Mulai Ulang Sektor dari Titik Awal"
          >
            <span>↺</span>
            <span>Ulangi Sektor</span>
          </button>
        </div>
      </div>

      {/* Sector Success Modal */}
      {showSectorSuccess && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalCard}>
            <div className={styles.modalTrophy}>✨</div>
            <span className={styles.modalBadge}>Sektor 3D Berhasil Ditembus!</span>
            <h3 className={styles.modalTitle}>{currentSector.title}</h3>
            <p className={styles.modalText}>
              Baterai Kristal berhasil diselamatkan dengan {history.length} langkah taktis!
            </p>

            <button
              type="button"
              className={styles.btnModalNext}
              onClick={handleNextSector}
            >
              <span>{currentSectorIdx < SECTORS_DATA.length - 1 ? 'Lanjut ke Sektor Berikutnya ➔' : 'Selesaikan Misi Penyelamat 🏆'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Final Game Complete Modal */}
      {showGameComplete && (
        <div className={styles.modalBackdrop}>
          <div className={styles.completeCard}>
            <div className={styles.completeIconGlow}>🤖</div>
            <span className={styles.completeBadge}>Misi Utama Tuntas!</span>
            <h2 className={styles.completeHeading}>Arsitek Algoritma Robot 3D</h2>
            <p className={styles.completeDesc}>
              Hebat! Kamu telah menavigasi benteng mekanik 3D dan menyelamatkan seluruh Baterai Kristal Gunung Teka-Teki!
            </p>

            <div className={styles.rewardGrid}>
              <div className={styles.rewardBox}>
                <span className={styles.rewardNum}>+160</span>
                <span className={styles.rewardLabel}>XP Logika</span>
              </div>
              <div className={styles.rewardBox}>
                <span className={styles.rewardNum}>+45</span>
                <span className={styles.rewardLabel}>Koin Emas</span>
              </div>
              <div className={styles.rewardBox}>
                <span className={styles.rewardNum}>🦿</span>
                <span className={styles.rewardLabel}>Kostum Cyber</span>
              </div>
              <div className={styles.rewardBox}>
                <span className={styles.rewardNum}>🌋</span>
                <span className={styles.rewardLabel}>Kartu Gunung</span>
              </div>
            </div>

            <button
              type="button"
              className={styles.btnCompletePrimary}
              onClick={() => {
                if (onGameComplete) onGameComplete();
                else navigate('/world/gunung-teka-teki');
              }}
            >
              Kembali ke Gunung Teka-Teki
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
