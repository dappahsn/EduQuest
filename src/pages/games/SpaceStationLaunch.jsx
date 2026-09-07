import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { useGame } from '../../context/GameContext';
import styles from './SpaceStationLaunch.module.css';

/**
 * ============================================================================
 * 3D ASTRO-FLIGHT ARCADE & ASTEROID DODGE GAME (Misi 03: Angkasa Pengetahuan)
 * Fixed & Polished Edition:
 * - Elevated 3rd-person chase camera (looking down & over the shuttle at 22° angle)
 *   so the tail fin NEVER blocks the forward flight view.
 * - Exact NASA Space Shuttle Orbiter (Space Rocket 9 Shuttle style):
 *   Sleek white cargo fuselage, jet-black thermal heat shield belly & nose cap,
 *   curved dark cockpit visor, thin swept vertical tail fin, and 3 main SSME engines.
 * - Delta-time based spawner inside gameLoop (100% immune to React timer cancels):
 *   Guarantees continuous asteroid swarms, crystals, and boost gates from start to finish!
 * - Pre-seeded initial wave of asteroids so the space field is never empty.
 * - 3D Rock Debris Shatter Explosion System & Camera Rumble on impact.
 * ============================================================================
 */

// ─── 1. PROCEDURAL TEXTURE GENERATORS ────────────────────────────────────────

function createNebulaTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  const bgGrad = ctx.createRadialGradient(512, 512, 60, 512, 512, 720);
  bgGrad.addColorStop(0, '#0c0f2b');
  bgGrad.addColorStop(0.4, '#060817');
  bgGrad.addColorStop(1, '#020308');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1024, 1024);

  const clouds = [
    { x: 320, y: 360, r: 390, c1: 'rgba(147, 51, 234, 0.35)', c2: 'rgba(79, 70, 229, 0.0)' },
    { x: 740, y: 390, r: 420, c1: 'rgba(236, 72, 153, 0.28)', c2: 'rgba(219, 39, 119, 0.0)' },
    { x: 512, y: 720, r: 460, c1: 'rgba(6, 182, 212, 0.30)', c2: 'rgba(14, 165, 233, 0.0)' },
    { x: 180, y: 820, r: 320, c1: 'rgba(59, 130, 246, 0.25)', c2: 'rgba(37, 99, 235, 0.0)' },
    { x: 820, y: 780, r: 360, c1: 'rgba(168, 85, 247, 0.28)', c2: 'rgba(139, 92, 246, 0.0)' }
  ];

  clouds.forEach(({ x, y, r, c1, c2 }) => {
    const g = ctx.createRadialGradient(x, y, 10, x, y, r);
    g.addColorStop(0, c1);
    g.addColorStop(1, c2);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 1024, 1024);
  });

  for (let i = 0; i < 450; i++) {
    const sx = Math.random() * 1024;
    const sy = Math.random() * 1024;
    const sr = Math.random() * 1.8 + 0.4;
    const alpha = Math.random() * 0.85 + 0.15;
    ctx.fillStyle = Math.random() > 0.25 ? `rgba(255, 255, 255, ${alpha})` : `rgba(186, 230, 253, ${alpha})`;
    ctx.beginPath();
    ctx.arc(sx, sy, sr, 0, Math.PI * 2);
    ctx.fill();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

function createEarthTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  const oceanGrad = ctx.createLinearGradient(0, 0, 0, 512);
  oceanGrad.addColorStop(0, '#0a2342');
  oceanGrad.addColorStop(0.5, '#023e8a');
  oceanGrad.addColorStop(1, '#001220');
  ctx.fillStyle = oceanGrad;
  ctx.fillRect(0, 0, 1024, 512);

  ctx.fillStyle = '#1b4332';
  const continents = [
    { x: 240, y: 170, w: 220, h: 140 },
    { x: 320, y: 310, w: 150, h: 160 },
    { x: 570, y: 160, w: 250, h: 160 },
    { x: 530, y: 270, w: 190, h: 180 },
    { x: 820, y: 330, w: 130, h: 100 }
  ];
  continents.forEach(({ x, y, w, h }) => {
    ctx.beginPath();
    ctx.ellipse(x, y, w / 2, h / 2, Math.PI / 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#2d6a4f';
    ctx.beginPath();
    ctx.ellipse(x + 15, y - 10, w / 3, h / 3, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#d97706';
    ctx.beginPath();
    ctx.ellipse(x - 20, y + 15, w / 5, h / 4, 0, 0, Math.PI * 2);
    ctx.fill();
  });

  ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
  for (let i = 0; i < 40; i++) {
    const cx = Math.random() * 1024;
    const cy = Math.random() * 460 + 25;
    const cw = Math.random() * 130 + 50;
    const ch = Math.random() * 26 + 8;
    ctx.beginPath();
    ctx.ellipse(cx, cy, cw, ch, Math.random() * 0.4 - 0.2, 0, Math.PI * 2);
    ctx.fill();
  }

  return new THREE.CanvasTexture(canvas);
}

function createAsteroidTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#262930';
  ctx.fillRect(0, 0, 512, 512);

  for (let i = 0; i < 3500; i++) {
    const x = Math.random() * 512;
    const y = Math.random() * 512;
    const shade = Math.floor(Math.random() * 60 + 25);
    ctx.fillStyle = `rgb(${shade}, ${shade + 2}, ${shade + 4})`;
    ctx.fillRect(x, y, Math.random() * 4 + 1, Math.random() * 4 + 1);
  }

  for (let i = 0; i < 24; i++) {
    const cx = Math.random() * 512;
    const cy = Math.random() * 512;
    const cr = Math.random() * 32 + 10;

    const rimGrad = ctx.createRadialGradient(cx - cr * 0.3, cy - cr * 0.3, cr * 0.4, cx, cy, cr);
    rimGrad.addColorStop(0, '#15171a');
    rimGrad.addColorStop(0.7, '#3f444e');
    rimGrad.addColorStop(1, '#64748b');
    ctx.fillStyle = rimGrad;
    ctx.beginPath();
    ctx.arc(cx, cy, cr, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#0f1114';
    ctx.beginPath();
    ctx.arc(cx, cy, cr * 0.65, 0, Math.PI * 2);
    ctx.fill();
  }

  // Glowing molten amber fissures
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 3.5;
  ctx.shadowColor = '#fbbf24';
  ctx.shadowBlur = 10;
  for (let v = 0; v < 6; v++) {
    ctx.beginPath();
    let vx = Math.random() * 512;
    let vy = Math.random() * 512;
    ctx.moveTo(vx, vy);
    for (let s = 0; s < 5; s++) {
      vx += (Math.random() - 0.5) * 80;
      vy += (Math.random() - 0.5) * 80;
      ctx.lineTo(vx, vy);
    }
    ctx.stroke();
  }
  ctx.shadowBlur = 0;

  return new THREE.CanvasTexture(canvas);
}

function createSolarGridTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#020617';
  ctx.fillRect(0, 0, 256, 256);

  const cellSize = 32;
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const cellGrad = ctx.createLinearGradient(c * cellSize, r * cellSize, (c + 1) * cellSize, (r + 1) * cellSize);
      cellGrad.addColorStop(0, '#1e3a8a');
      cellGrad.addColorStop(0.5, '#0284c7');
      cellGrad.addColorStop(1, '#0c4a6e');
      ctx.fillStyle = cellGrad;
      ctx.fillRect(c * cellSize + 2, r * cellSize + 2, cellSize - 4, cellSize - 4);

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1;
      ctx.strokeRect(c * cellSize + 4, r * cellSize + 4, cellSize - 8, cellSize - 8);
    }
  }

  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(128, 0);
  ctx.lineTo(128, 256);
  ctx.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 2);
  return texture;
}

function createGlowSpriteTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  const grad = ctx.createRadialGradient(32, 32, 2, 32, 32, 30);
  grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
  grad.addColorStop(0.2, 'rgba(56, 189, 248, 0.95)');
  grad.addColorStop(0.55, 'rgba(147, 51, 234, 0.45)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 64, 64);

  return new THREE.CanvasTexture(canvas);
}

// ─── 2. PROCEDURAL 3D GEOMETRIES ─────────────────────────────────────────────

function createCraggyAsteroidGeometry(radius) {
  const geo = new THREE.IcosahedronGeometry(radius, 2);
  const pos = geo.attributes.position;
  const v = new THREE.Vector3();

  for (let i = 0; i < pos.count; i++) {
    v.set(pos.getX(i), pos.getY(i), pos.getZ(i));
    const n = Math.sin(v.x * 2.8 + v.y * 1.6) * 0.22
            + Math.cos(v.y * 3.4 + v.z * 2.2) * 0.16
            + Math.sin(v.z * 4.2 + v.x * 3.1) * 0.12;
    v.multiplyScalar(1 + n);
    pos.setXYZ(i, v.x, v.y, v.z);
  }

  geo.computeVertexNormals();
  return geo;
}

// ─── 3. BUILD REFINED SPACE SHUTTLE ORBITER (Space Rocket 9 Shuttle) ─────────
function buildRefinedSpaceShuttle() {
  const shuttle = new THREE.Group();

  // Materials based directly on the Sketchfab Space Rocket 9 Shuttle reference
  const whiteHullMat = new THREE.MeshStandardMaterial({
    color: 0xf8fafc,
    roughness: 0.3,
    metalness: 0.12
  });

  const blackThermalMat = new THREE.MeshStandardMaterial({
    color: 0x111827,
    roughness: 0.42,
    metalness: 0.25
  });

  const cockpitGlassMat = new THREE.MeshStandardMaterial({
    color: 0x0a0f1d,
    roughness: 0.08,
    metalness: 0.95
  });

  const engineMetalMat = new THREE.MeshStandardMaterial({
    color: 0x334155,
    roughness: 0.35,
    metalness: 0.85
  });

  // A. Upper Fuselage Body (Cargo bay cylinder)
  const upperBodyGeo = new THREE.CylinderGeometry(0.68, 0.78, 3.2, 28, 1, false, 0, Math.PI);
  const upperBody = new THREE.Mesh(upperBodyGeo, whiteHullMat);
  upperBody.rotation.x = Math.PI / 2;
  upperBody.rotation.y = Math.PI;
  upperBody.position.set(0, 0.08, -0.2);
  shuttle.add(upperBody);

  // Flat deck floor
  const floorGeo = new THREE.BoxGeometry(1.56, 0.08, 3.2);
  const floor = new THREE.Mesh(floorGeo, whiteHullMat);
  floor.position.set(0, 0.08, -0.2);
  shuttle.add(floor);

  // B. Jet-Black Thermal Belly (Curved bottom heat shield)
  const lowerBellyGeo = new THREE.CylinderGeometry(0.68, 0.78, 3.2, 28, 1, false, 0, Math.PI);
  const lowerBelly = new THREE.Mesh(lowerBellyGeo, blackThermalMat);
  lowerBelly.rotation.x = Math.PI / 2;
  lowerBelly.scale.set(1.0, 0.6, 1.0);
  lowerBelly.position.set(0, 0.04, -0.2);
  shuttle.add(lowerBelly);

  // C. Aerodynamic Forward Cabin & Nose
  const noseUpperGeo = new THREE.ConeGeometry(0.68, 1.7, 28, 1, false, 0, Math.PI);
  const noseUpper = new THREE.Mesh(noseUpperGeo, whiteHullMat);
  noseUpper.rotation.x = -Math.PI / 2;
  noseUpper.rotation.y = Math.PI;
  noseUpper.position.set(0, 0.08, -2.45);
  shuttle.add(noseUpper);

  const noseBellyGeo = new THREE.ConeGeometry(0.68, 1.7, 28, 1, false, 0, Math.PI);
  const noseBelly = new THREE.Mesh(noseBellyGeo, blackThermalMat);
  noseBelly.rotation.x = -Math.PI / 2;
  noseBelly.scale.set(1.0, 0.6, 1.0);
  noseBelly.position.set(0, 0.04, -2.45);
  shuttle.add(noseBelly);

  // Rounded Black Nose Apex Cap
  const noseCapGeo = new THREE.SphereGeometry(0.32, 20, 20);
  const noseCap = new THREE.Mesh(noseCapGeo, blackThermalMat);
  noseCap.scale.set(0.95, 0.7, 1.3);
  noseCap.position.set(0, 0.05, -3.3);
  shuttle.add(noseCap);

  // D. Wraparound Visor Cockpit Window Strip
  const windowGeo = new THREE.CylinderGeometry(0.62, 0.68, 0.48, 20, 1, false, -Math.PI * 0.42, Math.PI * 0.84);
  const windowMesh = new THREE.Mesh(windowGeo, cockpitGlassMat);
  windowMesh.rotation.x = Math.PI / 2.3;
  windowMesh.rotation.y = Math.PI;
  windowMesh.position.set(0, 0.42, -2.0);
  shuttle.add(windowMesh);

  // E. Double-Delta Wings (White Surface + Black Leading Edges)
  const wingShape = new THREE.Shape();
  wingShape.moveTo(0, -1.6);
  wingShape.lineTo(0.7, -0.9);
  wingShape.lineTo(2.35, 1.2);
  wingShape.lineTo(2.25, 1.45);
  wingShape.lineTo(0, 1.45);
  wingShape.closePath();

  const wingExtrude = { depth: 0.1, bevelEnabled: true, bevelThickness: 0.03, bevelSize: 0.03, bevelSegments: 2 };
  const wingGeo = new THREE.ExtrudeGeometry(wingShape, wingExtrude);

  const rightWing = new THREE.Mesh(wingGeo, whiteHullMat);
  rightWing.position.set(0.72, 0.04, 0.15);
  rightWing.rotation.x = -Math.PI / 2;
  shuttle.add(rightWing);

  const leftWing = new THREE.Mesh(wingGeo, whiteHullMat);
  leftWing.position.set(-0.72, 0.04, 0.15);
  leftWing.rotation.x = -Math.PI / 2;
  leftWing.rotation.y = Math.PI;
  shuttle.add(leftWing);

  // Black Thermal Wing Leading Edges
  const rightLeadEdgeGeo = new THREE.BoxGeometry(0.08, 0.14, 3.4);
  const rightLeadEdge = new THREE.Mesh(rightLeadEdgeGeo, blackThermalMat);
  rightLeadEdge.position.set(1.58, 0.04, 0.05);
  rightLeadEdge.rotation.y = -0.52;
  shuttle.add(rightLeadEdge);

  const leftLeadEdge = new THREE.Mesh(rightLeadEdgeGeo, blackThermalMat);
  leftLeadEdge.position.set(-1.58, 0.04, 0.05);
  leftLeadEdge.rotation.y = 0.52;
  shuttle.add(leftLeadEdge);

  // Wingtip navigation strobes
  const portStrobe = new THREE.PointLight(0xef4444, 2.0, 4.0);
  portStrobe.position.set(-2.45, 0.08, 1.35);
  shuttle.add(portStrobe);

  const starStrobe = new THREE.PointLight(0x22c55e, 2.0, 4.0);
  starStrobe.position.set(2.45, 0.08, 1.35);
  shuttle.add(starStrobe);

  // F. Twin OMS Shoulder Pods (Bulbous rear shoulders)
  const omsGeo = new THREE.CylinderGeometry(0.32, 0.38, 1.4, 20);
  const leftOms = new THREE.Mesh(omsGeo, whiteHullMat);
  leftOms.rotation.x = Math.PI / 2;
  leftOms.position.set(-0.52, 0.44, 0.9);
  shuttle.add(leftOms);

  const rightOms = new THREE.Mesh(omsGeo, whiteHullMat);
  rightOms.rotation.x = Math.PI / 2;
  rightOms.position.set(0.52, 0.44, 0.9);
  shuttle.add(rightOms);

  const omsCapGeo = new THREE.SphereGeometry(0.32, 16, 16);
  const leftOmsCap = new THREE.Mesh(omsCapGeo, whiteHullMat);
  leftOmsCap.position.set(-0.52, 0.44, 0.2);
  shuttle.add(leftOmsCap);

  const rightOmsCap = new THREE.Mesh(omsCapGeo, whiteHullMat);
  rightOmsCap.position.set(0.52, 0.44, 0.2);
  shuttle.add(rightOmsCap);

  // G. Thin, Sleek Vertical Tail Fin (Does NOT block forward camera view)
  const finShape = new THREE.Shape();
  finShape.moveTo(0, 0);
  finShape.lineTo(0.24, 1.3);
  finShape.lineTo(0.72, 1.3);
  finShape.lineTo(1.15, 0);
  finShape.closePath();

  const finExtrude = { depth: 0.05, bevelEnabled: true, bevelThickness: 0.015, bevelSize: 0.015 };
  const finGeo = new THREE.ExtrudeGeometry(finShape, finExtrude);
  const finMesh = new THREE.Mesh(finGeo, whiteHullMat);
  finMesh.rotation.y = -Math.PI / 2;
  finMesh.position.set(0.025, 0.62, 0.35);
  shuttle.add(finMesh);

  // Black leading edge strip on tail fin
  const finLeadGeo = new THREE.BoxGeometry(0.05, 1.4, 0.08);
  const finLead = new THREE.Mesh(finLeadGeo, blackThermalMat);
  finLead.position.set(0, 1.25, 0.65);
  finLead.rotation.x = 0.28;
  shuttle.add(finLead);

  // H. Trio of Main SSME Rocket Engines (Triangular cluster at rear)
  const nozzleGeo = new THREE.CylinderGeometry(0.2, 0.28, 0.65, 18);
  const engineConfigs = [
    { x: 0, y: 0.48, z: 1.65 },
    { x: -0.34, y: -0.04, z: 1.65 },
    { x: 0.34, y: -0.04, z: 1.65 }
  ];

  const flameCores = [];
  const flameOuters = [];

  engineConfigs.forEach(({ x, y, z }) => {
    const nozzle = new THREE.Mesh(nozzleGeo, engineMetalMat);
    nozzle.position.set(x, y, z);
    nozzle.rotation.x = Math.PI / 2;
    shuttle.add(nozzle);

    const fCoreGeo = new THREE.ConeGeometry(0.14, 1.6, 16);
    const fCoreMat = new THREE.MeshBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.95 });
    const fCore = new THREE.Mesh(fCoreGeo, fCoreMat);
    fCore.position.set(x, y, z + 0.9);
    fCore.rotation.x = Math.PI / 2;
    shuttle.add(fCore);
    flameCores.push(fCore);

    const fOuterGeo = new THREE.ConeGeometry(0.26, 2.3, 16);
    const fOuterMat = new THREE.MeshBasicMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });
    const fOuter = new THREE.Mesh(fOuterGeo, fOuterMat);
    fOuter.position.set(x, y, z + 1.2);
    fOuter.rotation.x = Math.PI / 2;
    shuttle.add(fOuter);
    flameOuters.push(fOuter);
  });

  const flameLight = new THREE.PointLight(0x0284c7, 3.5, 16);
  flameLight.position.set(0, 0.2, 2.2);
  shuttle.add(flameLight);

  return {
    shuttleGroup: shuttle,
    flameCores,
    flameOuters,
    flameLight,
    portStrobe,
    starStrobe,
    engineConfigs
  };
}

// ─── COMPONENT IMPLEMENTATION ───────────────────────────────────────────────

export default function SpaceStationLaunch({ questId = 'quest-ap-3' }) {
  const navigate = useNavigate();
  const { completeQuest } = useGame();

  // ─── Game State ─────────────────────────────────────────────────────────
  const [gameState, setGameState] = useState('briefing');
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [crystalsCount, setCrystalsCount] = useState(0);
  const [distanceRemaining, setDistanceRemaining] = useState(1000);
  const [isHyperBoost, setIsHyperBoost] = useState(false);
  const [screenDamage, setScreenDamage] = useState(false);
  const [centerToast, setCenterToast] = useState('Hindari meteorit dan kumpulkan kristal!');

  // Mutable refs for high-performance physics & loop sync
  const gameStateRef = useRef('briefing');
  const distanceRemainingRef = useRef(1000);
  const isHyperBoostRef = useRef(false);
  const spawnTimerRef = useRef(0);
  const scoreRef = useRef(0);

  // Keep refs in sync with state
  useEffect(() => { gameStateRef.current = gameState; }, [gameState]);
  useEffect(() => { distanceRemainingRef.current = distanceRemaining; }, [distanceRemaining]);
  useEffect(() => { isHyperBoostRef.current = isHyperBoost; }, [isHyperBoost]);
  useEffect(() => { scoreRef.current = score; }, [score]);

  // Three.js Core Refs
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const cameraRef = useRef(null);
  const animFrameIdRef = useRef(null);

  // 3D Shuttle References
  const rocketRef = useRef(null);
  const flameCoresRef = useRef([]);
  const flameOutersRef = useRef([]);
  const portStrobeRef = useRef(null);
  const starboardStrobeRef = useRef(null);
  const engineConfigsRef = useRef([]);

  const starFieldRef = useRef(null);
  const spaceStationRef = useRef(null);
  const earthMeshRef = useRef(null);
  const dockingRingTunnelRef = useRef(null);

  // Camera Shake & Target Coordinates
  const cameraShakeRef = useRef({ intensity: 0, decay: 0.88 });
  const targetPosRef = useRef({ x: 0, y: 0 });
  const isPointerDownRef = useRef(false);

  // Active in-game objects lists
  const asteroidsRef = useRef([]);
  const crystalsRef = useRef([]);
  const ringsRef = useRef([]);
  const engineParticlesRef = useRef([]);
  const debrisFragmentsRef = useRef([]);

  // Shared Procedural Textures
  const texturesRef = useRef({});

  // Audio Context synthesizer
  const audioCtxRef = useRef(null);

  const initAudio = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  }, []);

  const playSfx = useCallback((type) => {
    try {
      initAudio();
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      const now = ctx.currentTime;

      if (type === 'crystal') {
        const freqs = [659.25, 880, 1046.5, 1318.5];
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.04);
          gain.gain.setValueAtTime(0.2, now + idx * 0.04);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.04 + 0.28);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.04);
          osc.stop(now + idx * 0.04 + 0.3);
        });
      } else if (type === 'boost') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(980, now + 0.45);
        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.5);
      } else if (type === 'hit') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.35);
        gain.gain.setValueAtTime(0.6, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
      } else if (type === 'docked') {
        const freqs = [523.25, 659.25, 783.99, 1046.5, 1318.5, 1567.98];
        freqs.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + idx * 0.09);
          gain.gain.setValueAtTime(0.28, now + idx * 0.09);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.09 + 0.65);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.09);
          osc.stop(now + idx * 0.09 + 0.7);
        });
      } else if (type === 'click') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.08);
      }
    } catch {}
  }, [initAudio]);

  // ─── 4. SPAWN PROCEDURAL OBSTACLES (Called from gameLoop) ───────────────────
  const spawnObstacleOrCollectible = useCallback((customZ = -85) => {
    const scene = sceneRef.current;
    if (!scene) return;

    const container = mountRef.current;
    const isPortrait = container ? (container.clientWidth < container.clientHeight) : false;
    const xSpread = isPortrait ? 5.2 : 9.5;

    const roll = Math.random();

    if (roll < 0.58) {
      // 1. Asteroid (Craggy Meteorite)
      const size = 0.9 + Math.random() * 1.1;
      const astGeo = createCraggyAsteroidGeometry(size);
      const astMat = new THREE.MeshStandardMaterial({
        map: texturesRef.current.asteroid,
        roughness: 0.82,
        metalness: 0.35,
        emissive: 0x78350f,
        emissiveIntensity: 0.35
      });
      const asteroid = new THREE.Mesh(astGeo, astMat);
      asteroid.position.set(
        (Math.random() - 0.5) * xSpread,
        (Math.random() - 0.5) * 3.8 + 0.2,
        customZ
      );
      asteroid.rotationSpeed = {
        x: (Math.random() - 0.5) * 2.2,
        y: (Math.random() - 0.5) * 2.5,
        z: (Math.random() - 0.5) * 1.8
      };
      scene.add(asteroid);
      asteroidsRef.current.push(asteroid);
    } else if (roll < 0.84) {
      // 2. Glowing Plasma Energy Crystal
      const crystalGroup = new THREE.Group();
      crystalGroup.position.set(
        (Math.random() - 0.5) * xSpread,
        (Math.random() - 0.5) * 3.5 + 0.2,
        customZ
      );

      const outerGeo = new THREE.OctahedronGeometry(0.75, 0);
      const outerMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        emissive: 0x0284c7,
        emissiveIntensity: 0.85,
        metalness: 0.9,
        roughness: 0.1,
        transparent: true,
        opacity: 0.88
      });
      const outerMesh = new THREE.Mesh(outerGeo, outerMat);
      crystalGroup.add(outerMesh);

      const innerGeo = new THREE.OctahedronGeometry(0.38, 0);
      const innerMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
      const innerMesh = new THREE.Mesh(innerGeo, innerMat);
      crystalGroup.add(innerMesh);

      const ringGeo = new THREE.TorusGeometry(1.0, 0.04, 12, 24);
      const ringMat = new THREE.MeshBasicMaterial({ color: 0x38bdf8 });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 3;
      crystalGroup.add(ringMesh);

      const cryLight = new THREE.PointLight(0x38bdf8, 2.2, 9);
      crystalGroup.add(cryLight);

      scene.add(crystalGroup);
      crystalsRef.current.push(crystalGroup);
    } else {
      // 3. Hyper-Boost Warp Ring Gate
      const boostGateGroup = new THREE.Group();
      boostGateGroup.position.set(
        (Math.random() - 0.5) * (xSpread * 0.8),
        (Math.random() - 0.5) * 2.8 + 0.2,
        customZ
      );

      const outerRingGeo = new THREE.TorusGeometry(2.4, 0.22, 16, 32);
      const ringMat = new THREE.MeshStandardMaterial({
        color: 0x22c55e,
        emissive: 0x16a34a,
        emissiveIntensity: 1.0,
        metalness: 0.85
      });
      const outerRing = new THREE.Mesh(outerRingGeo, ringMat);
      boostGateGroup.add(outerRing);

      const innerRingGeo = new THREE.TorusGeometry(1.9, 0.12, 16, 32);
      const innerRing = new THREE.Mesh(innerRingGeo, ringMat);
      boostGateGroup.add(innerRing);

      const chevGeo = new THREE.ConeGeometry(0.28, 0.55, 3);
      const chevMat = new THREE.MeshBasicMaterial({ color: 0x4ade80 });
      [0, Math.PI / 2, Math.PI, (Math.PI * 3) / 2].forEach((ang) => {
        const chev = new THREE.Mesh(chevGeo, chevMat);
        chev.position.set(Math.cos(ang) * 2.15, Math.sin(ang) * 2.15, 0);
        chev.rotation.z = ang - Math.PI / 2;
        boostGateGroup.add(chev);
      });

      const gateLight = new THREE.PointLight(0x22c55e, 3, 14);
      boostGateGroup.add(gateLight);

      scene.add(boostGateGroup);
      ringsRef.current.push(boostGateGroup);
    }
  }, []);

  // ─── 5. SPAWN 3D ROCK DEBRIS SHATTER EXPLOSION ─────────────────────────────
  const triggerDebrisExplosion = (pos) => {
    const scene = sceneRef.current;
    if (!scene) return;

    cameraShakeRef.current.intensity = 0.55;

    const astTex = texturesRef.current.asteroid;
    const debrisMat = new THREE.MeshStandardMaterial({
      map: astTex,
      roughness: 0.85,
      metalness: 0.3
    });

    for (let i = 0; i < 18; i++) {
      const fragGeo = createCraggyAsteroidGeometry(0.2 + Math.random() * 0.18);
      const fragment = new THREE.Mesh(fragGeo, debrisMat);
      fragment.position.set(pos.x, pos.y, pos.z);

      fragment.velocity = {
        x: (Math.random() - 0.5) * 14,
        y: (Math.random() - 0.5) * 14,
        z: (Math.random() - 0.5) * 14
      };

      fragment.rotSpeed = {
        x: (Math.random() - 0.5) * 8,
        y: (Math.random() - 0.5) * 8,
        z: (Math.random() - 0.5) * 8
      };

      fragment.life = 1.0;
      fragment.decay = 0.03 + Math.random() * 0.02;

      scene.add(fragment);
      debrisFragmentsRef.current.push(fragment);
    }
  };

  // ─── 6. INITIALIZE THREE.JS 3D SCENE ───────────────────────────────────────
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 700;
    const height = container.clientHeight || 500;
    const isPortrait = width < height;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020308);
    scene.fog = new THREE.FogExp2(0x030514, 0.005);
    sceneRef.current = scene;

    // 2. Camera: Elevated Third-Person Chase (Looking down & over the shuttle)
    // This elevated angle guarantees the tail fin never blocks oncoming obstacles!
    const camera = new THREE.PerspectiveCamera(isPortrait ? 60 : 50, width / height, 0.1, 2000);
    camera.position.set(0, isPortrait ? 5.2 : 4.2, isPortrait ? 10.2 : 8.8);
    camera.lookAt(0, -0.2, -20);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.35;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0x475569, 1.8);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xffffff, 3.4);
    sunLight.position.set(30, 45, 25);
    scene.add(sunLight);

    const earthBlueGlow = new THREE.DirectionalLight(0x0284c7, 1.8);
    earthBlueGlow.position.set(-25, -40, -15);
    scene.add(earthBlueGlow);

    // 5. Generate Textures
    const nebulaTexture = createNebulaTexture();
    const earthTexture = createEarthTexture();
    const asteroidTexture = createAsteroidTexture();
    const solarTexture = createSolarGridTexture();
    const glowSprite = createGlowSpriteTexture();

    texturesRef.current = {
      nebula: nebulaTexture,
      earth: earthTexture,
      asteroid: asteroidTexture,
      solar: solarTexture,
      glow: glowSprite
    };

    // 6. Deep Space Nebula Sky Dome
    const domeGeo = new THREE.SphereGeometry(650, 32, 32);
    const domeMat = new THREE.MeshBasicMaterial({ map: nebulaTexture, side: THREE.BackSide });
    const skyDome = new THREE.Mesh(domeGeo, domeMat);
    scene.add(skyDome);

    // 7. Streaming Starfield
    const starCount = 2200;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount * 3; i += 3) {
      starPos[i] = (Math.random() - 0.5) * 110;
      starPos[i + 1] = (Math.random() - 0.5) * 80;
      starPos[i + 2] = -Math.random() * 250;
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1.8,
      map: glowSprite,
      transparent: true,
      opacity: 0.95,
      blending: THREE.AdditiveBlending
    });
    const starField = new THREE.Points(starGeo, starMat);
    scene.add(starField);
    starFieldRef.current = starField;

    // 8. Curved Atmospheric Earth Horizon Below
    const earthGeo = new THREE.SphereGeometry(160, 48, 48);
    const earthMat = new THREE.MeshStandardMaterial({
      map: earthTexture,
      roughness: 0.5,
      metalness: 0.15
    });
    const earthMesh = new THREE.Mesh(earthGeo, earthMat);
    earthMesh.position.set(0, -175, -50);
    earthMesh.rotation.x = 0.2;
    scene.add(earthMesh);
    earthMeshRef.current = earthMesh;

    // 9. BUILD REFINED SPACE SHUTTLE ORBITER (Space Rocket 9 Shuttle)
    const shuttleData = buildRefinedSpaceShuttle();
    // Position shuttle slightly lower on screen and scale comfortably
    shuttleData.shuttleGroup.position.set(0, -0.7, 0.4);
    shuttleData.shuttleGroup.scale.set(0.64, 0.64, 0.64);

    rocketRef.current = shuttleData.shuttleGroup;
    flameCoresRef.current = shuttleData.flameCores;
    flameOutersRef.current = shuttleData.flameOuters;
    portStrobeRef.current = shuttleData.portStrobe;
    starboardStrobeRef.current = shuttleData.starStrobe;
    engineConfigsRef.current = shuttleData.engineConfigs;

    scene.add(shuttleData.shuttleGroup);

    // 10. BUILD MAJESTIC 3D SPACE STATION (ISS FINALE)
    const stationGroup = new THREE.Group();
    stationGroup.position.set(0, 0, -240);
    stationGroup.visible = false;
    spaceStationRef.current = stationGroup;

    const titaniumDarkMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.45, metalness: 0.85 });
    const whiteHullMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.32, metalness: 0.15 });

    const trussGeo = new THREE.BoxGeometry(0.9, 0.9, 32);
    const truss = new THREE.Mesh(trussGeo, titaniumDarkMat);
    truss.rotation.y = Math.PI / 2;
    stationGroup.add(truss);

    const habGeo = new THREE.CylinderGeometry(2.2, 2.2, 14, 32);
    const hab = new THREE.Mesh(habGeo, whiteHullMat);
    stationGroup.add(hab);

    const crossHabGeo = new THREE.CylinderGeometry(1.8, 1.8, 10, 24);
    const crossHab = new THREE.Mesh(crossHabGeo, whiteHullMat);
    crossHab.rotation.x = Math.PI / 2;
    crossHab.position.z = 1.2;
    stationGroup.add(crossHab);

    const cupolaGeo = new THREE.SphereGeometry(1.1, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
    const cupolaMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 0.6,
      metalness: 0.8
    });
    const cupola = new THREE.Mesh(cupolaGeo, cupolaMat);
    cupola.position.set(0, 2.2, 0);
    stationGroup.add(cupola);

    const solarWingGeo = new THREE.BoxGeometry(10, 0.12, 5.5);
    const solarMat = new THREE.MeshStandardMaterial({ map: solarTexture, roughness: 0.2, metalness: 0.85 });
    [[-11, 0, 0], [11, 0, 0], [-11, 0, -4], [11, 0, -4]].forEach((pos) => {
      const sWing = new THREE.Mesh(solarWingGeo, solarMat);
      sWing.position.set(pos[0], pos[1], pos[2]);
      stationGroup.add(sWing);
    });

    const dockRingGeo = new THREE.TorusGeometry(3.0, 0.4, 20, 36);
    const dockRingMat = new THREE.MeshStandardMaterial({
      color: 0x22c55e,
      emissive: 0x16a34a,
      emissiveIntensity: 0.95,
      metalness: 0.8
    });
    const dockRing = new THREE.Mesh(dockRingGeo, dockRingMat);
    dockRing.position.set(0, 0, 7.5);
    stationGroup.add(dockRing);
    dockingRingTunnelRef.current = dockRing;

    const dockLight = new THREE.PointLight(0x22c55e, 4.0, 40);
    dockLight.position.set(0, 0, 9.0);
    stationGroup.add(dockLight);

    scene.add(stationGroup);

    // Pre-seed an initial wave of asteroids ahead so the space corridor is never empty!
    [-25, -45, -65, -85].forEach((zPos) => {
      spawnObstacleOrCollectible(zPos);
    });

    // 11. Resize Listener
    const handleResize = () => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      const portrait = w < h;
      cameraRef.current.aspect = w / h;
      cameraRef.current.fov = portrait ? 60 : 50;
      cameraRef.current.position.set(0, portrait ? 5.2 : 4.2, portrait ? 10.2 : 8.8);
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // 12. MAIN ANIMATION & RENDERING LOOP (Frame-Rate Independent)
    let clock = new THREE.Clock();

    const gameLoop = () => {
      animFrameIdRef.current = requestAnimationFrame(gameLoop);
      const delta = Math.min(clock.getDelta(), 0.1);
      const elapsedTime = clock.getElapsedTime();

      const isBoost = isHyperBoostRef.current;
      const isPlaying = gameStateRef.current === 'playing';
      const currentFlightSpeed = isBoost ? 36 : 18;

      // ── A. CONTINUOUS DELTA-TIME OBSTACLE SPAWNER (Immune to React re-renders) ──
      if (isPlaying) {
        spawnTimerRef.current += delta;
        const currentDist = distanceRemainingRef.current;

        if (currentDist > 140) {
          const spawnInterval = isBoost ? 0.28 : 0.52;
          if (spawnTimerRef.current >= spawnInterval) {
            spawnTimerRef.current = 0;
            spawnObstacleOrCollectible(-85);
          }
        } else {
          // Approach Space Station finale
          if (spaceStationRef.current) {
            spaceStationRef.current.visible = true;
            spaceStationRef.current.position.z = -currentDist * 0.6 - 8;
          }
        }
      }

      // ── B. RESPONSIVE SHUTTLE STEERING & BANKING ──
      if (rocketRef.current) {
        const target = targetPosRef.current;
        const current = rocketRef.current.position;

        current.x += (target.x - current.x) * 0.18;
        current.y += ((-0.7 + target.y) - current.y) * 0.18;

        const targetRoll = -(target.x - current.x) * 0.35;
        const targetPitch = -(target.y - current.y) * 0.25;
        rocketRef.current.rotation.z += (targetRoll - rocketRef.current.rotation.z) * 0.18;
        rocketRef.current.rotation.x += (targetPitch - rocketRef.current.rotation.x) * 0.18;

        const idleBob = Math.sin(elapsedTime * 3.6) * 0.04;
        rocketRef.current.position.y += idleBob * 0.15;

        // Roaring Throttle Flames
        const fScale = (isBoost ? 1.45 : 1.0) + Math.sin(elapsedTime * 32) * 0.15;
        flameCoresRef.current.forEach((core) => {
          if (core) core.scale.set(fScale, fScale * 1.3, fScale);
        });
        flameOutersRef.current.forEach((outer) => {
          if (outer) outer.scale.set(fScale * 1.1, fScale * 1.4, fScale * 1.1);
        });

        // Navigation Strobes
        const strobeState = Math.sin(elapsedTime * 10) > 0;
        if (portStrobeRef.current) portStrobeRef.current.intensity = strobeState ? 3.0 : 0.2;
        if (starboardStrobeRef.current) starboardStrobeRef.current.intensity = !strobeState ? 3.0 : 0.2;

        // Supersonic Engine Particle Exhaust
        if (isPlaying && Math.random() < 0.85) {
          engineConfigsRef.current.forEach(({ x, y }) => {
            const pGeo = new THREE.SphereGeometry(0.14, 6, 6);
            const pMat = new THREE.MeshBasicMaterial({
              color: isBoost ? 0x22c55e : (Math.random() > 0.35 ? 0x38bdf8 : 0xf59e0b),
              transparent: true,
              opacity: 0.9,
              blending: THREE.AdditiveBlending
            });
            const particle = new THREE.Mesh(pGeo, pMat);
            particle.position.set(
              current.x + (x * 0.64) + (Math.random() - 0.5) * 0.08,
              current.y + (y * 0.64) + (Math.random() - 0.5) * 0.08,
              current.z + 1.8
            );
            particle.velocity = {
              x: (Math.random() - 0.5) * 0.35,
              y: (Math.random() - 0.5) * 0.35,
              z: 2.2 + Math.random() * 1.5
            };
            particle.scale.set(1, 1, 1);
            particle.life = 1.0;
            scene.add(particle);
            engineParticlesRef.current.push(particle);
          });
        }
      }

      // ── C. UPDATE ENGINE PARTICLES ──
      engineParticlesRef.current = engineParticlesRef.current.filter((p) => {
        p.position.z += p.velocity.z;
        p.position.x += p.velocity.x;
        p.position.y += p.velocity.y;
        p.scale.multiplyScalar(1.08);
        p.life -= 0.06;
        p.material.opacity = Math.max(0, p.life * 0.9);

        if (p.life <= 0 || p.position.z > 14) {
          scene.remove(p);
          return false;
        }
        return true;
      });

      // ── D. UPDATE 3D ROCK DEBRIS ──
      debrisFragmentsRef.current = debrisFragmentsRef.current.filter((frag) => {
        frag.position.x += frag.velocity.x * delta;
        frag.position.y += frag.velocity.y * delta;
        frag.position.z += frag.velocity.z * delta;

        frag.rotation.x += frag.rotSpeed.x * delta;
        frag.rotation.y += frag.rotSpeed.y * delta;
        frag.rotation.z += frag.rotSpeed.z * delta;

        frag.life -= frag.decay;
        frag.scale.multiplyScalar(0.97);

        if (frag.life <= 0) {
          scene.remove(frag);
          return false;
        }
        return true;
      });

      // ── E. DYNAMIC CAMERA: ELEVATED VIEW & FOV WARP ──
      if (cameraRef.current) {
        const baseFov = isPortrait ? 60 : 50;
        const targetFov = isBoost ? baseFov + 14 : baseFov;
        cameraRef.current.fov += (targetFov - cameraRef.current.fov) * 0.08;
        cameraRef.current.updateProjectionMatrix();

        if (rocketRef.current) {
          cameraRef.current.position.x += (rocketRef.current.position.x * 0.35 - cameraRef.current.position.x) * 0.1;
        }

        if (cameraShakeRef.current.intensity > 0.005) {
          const s = cameraShakeRef.current.intensity;
          cameraRef.current.position.x += (Math.random() - 0.5) * s;
          cameraRef.current.position.y += (Math.random() - 0.5) * s;
          cameraShakeRef.current.intensity *= cameraShakeRef.current.decay;
        }
      }

      // ── F. STREAM STARFIELD ──
      if (starFieldRef.current) {
        const posArr = starFieldRef.current.geometry.attributes.position.array;
        const starSpeed = (currentFlightSpeed * 3.8) * delta;
        for (let i = 2; i < posArr.length; i += 3) {
          posArr[i] += starSpeed;
          if (posArr[i] > 14) {
            posArr[i] = -250;
          }
        }
        starFieldRef.current.geometry.attributes.position.needsUpdate = true;
      }

      // ── G. ROTATE EARTH & DOCKING TUNNEL ──
      if (earthMeshRef.current) {
        earthMeshRef.current.rotation.y += delta * 0.025;
      }
      if (skyDome) {
        skyDome.rotation.y += delta * 0.003;
      }
      if (dockingRingTunnelRef.current) {
        dockingRingTunnelRef.current.rotation.z += delta * 0.8;
      }

      renderer.render(scene, camera);
    };

    gameLoop();

    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
      window.removeEventListener('resize', handleResize);
      if (renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [spawnObstacleOrCollectible]);

  // ─── 7. FLIGHT PHYSICS & COLLISION DETECTION TICK (50ms) ──────────────────
  useEffect(() => {
    if (gameState !== 'playing') return;

    const tickInterval = setInterval(() => {
      const isBoost = isHyperBoostRef.current;
      const speedMultiplier = isBoost ? 2.2 : 1.0;
      const stepDistance = Math.round(5 * speedMultiplier);

      // Decrement Flight Distance
      setDistanceRemaining((prev) => {
        const next = Math.max(0, prev - stepDistance);
        if (next <= 0) {
          clearInterval(tickInterval);
          handleVictory();
          return 0;
        }
        return next;
      });

      // Increment Score
      setScore((s) => s + (isBoost ? 4 : 2));

      const scene = sceneRef.current;
      const rocket = rocketRef.current;
      if (!scene || !rocket) return;

      const rPos = rocket.position;
      const forwardVelocity = 3.8 * speedMultiplier;

      // 1. Update Asteroids
      asteroidsRef.current = asteroidsRef.current.filter((ast) => {
        ast.position.z += forwardVelocity;
        ast.rotation.x += ast.rotationSpeed.x * 0.03;
        ast.rotation.y += ast.rotationSpeed.y * 0.03;
        ast.rotation.z += ast.rotationSpeed.z * 0.03;

        // Collision Check (Radius ~2.0)
        const dist = Math.hypot(ast.position.x - rPos.x, ast.position.y - rPos.y, ast.position.z - rPos.z);
        if (dist < 2.0) {
          playSfx('hit');
          setScreenDamage(true);
          setTimeout(() => setScreenDamage(false), 380);

          triggerDebrisExplosion(ast.position);

          setLives((l) => {
            const nextL = l - 1;
            if (nextL <= 0) {
              handleGameOver();
            } else {
              setCenterToast('⚠️ PERISAI TERKENA TABRAKAN! Sisa: ' + nextL + ' Hati');
            }
            return Math.max(0, nextL);
          });

          scene.remove(ast);
          return false;
        }

        if (ast.position.z > 14) {
          scene.remove(ast);
          return false;
        }
        return true;
      });

      // 2. Update Crystals
      crystalsRef.current = crystalsRef.current.filter((cry) => {
        cry.position.z += forwardVelocity;
        cry.rotation.y += 0.07;
        cry.rotation.z += 0.04;

        const dist = Math.hypot(cry.position.x - rPos.x, cry.position.y - rPos.y, cry.position.z - rPos.z);
        if (dist < 2.2) {
          playSfx('crystal');
          setCrystalsCount((c) => c + 1);
          setScore((s) => s + 25);
          setCenterToast('✨ +25 KRISTAL ENERGI PLASMA!');

          scene.remove(cry);
          return false;
        }

        if (cry.position.z > 14) {
          scene.remove(cry);
          return false;
        }
        return true;
      });

      // 3. Update Boost Rings
      ringsRef.current = ringsRef.current.filter((rng) => {
        rng.position.z += forwardVelocity;
        rng.rotation.z += 0.03;

        const dist = Math.hypot(rng.position.x - rPos.x, rng.position.y - rPos.y, rng.position.z - rPos.z);
        if (dist < 2.5) {
          playSfx('boost');
          setIsHyperBoost(true);
          cameraShakeRef.current.intensity = 0.35;
          setScore((s) => s + 60);
          setCenterToast('⚡ HYPER-BOOST! KECEPATAN WARP GANDA!');
          setTimeout(() => setIsHyperBoost(false), 3800);

          scene.remove(rng);
          return false;
        }

        if (rng.position.z > 14) {
          scene.remove(rng);
          return false;
        }
        return true;
      });
    }, 50);

    return () => clearInterval(tickInterval);
  }, [gameState, playSfx]);

  // ─── 8. GAME OVER & VICTORY HANDLERS ───────────────────────────────────────
  const handleGameOver = () => {
    setGameState('gameover');
    playSfx('hit');
  };

  const handleVictory = () => {
    setGameState('victory');
    playSfx('docked');

    if (rocketRef.current && spaceStationRef.current) {
      rocketRef.current.position.set(0, -0.2, -2);
      spaceStationRef.current.position.set(0, 0, -8);
    }

    if (completeQuest) {
      completeQuest(questId, 100, 220, 55, 'card-space-station');
    }
  };

  const restartGame = () => {
    initAudio();
    playSfx('click');

    const scene = sceneRef.current;
    if (scene) {
      asteroidsRef.current.forEach((a) => scene.remove(a));
      crystalsRef.current.forEach((c) => scene.remove(c));
      ringsRef.current.forEach((r) => scene.remove(r));
      debrisFragmentsRef.current.forEach((d) => scene.remove(d));
      engineParticlesRef.current.forEach((p) => scene.remove(p));
    }
    asteroidsRef.current = [];
    crystalsRef.current = [];
    ringsRef.current = [];
    debrisFragmentsRef.current = [];
    engineParticlesRef.current = [];

    if (spaceStationRef.current) {
      spaceStationRef.current.position.set(0, 0, -240);
      spaceStationRef.current.visible = false;
    }
    if (rocketRef.current) {
      rocketRef.current.position.set(0, -0.7, 0.4);
    }
    targetPosRef.current = { x: 0, y: 0 };
    spawnTimerRef.current = 0;

    // Re-seed initial asteroids ahead
    [-25, -45, -65, -85].forEach((zPos) => {
      spawnObstacleOrCollectible(zPos);
    });

    setLives(3);
    setScore(0);
    setCrystalsCount(0);
    setDistanceRemaining(1000);
    setIsHyperBoost(false);
    setCenterToast('Hindari meteorit dan kumpulkan kristal!');
    setGameState('playing');
  };

  // ─── 9. RESPONSIVE FLIGHT CONTROLS ─────────────────────────────────────────
  const handlePointerMove = (e) => {
    if (gameState !== 'playing') return;
    const container = mountRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const normX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const normY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);

    targetPosRef.current = {
      x: Math.max(-5.5, Math.min(5.5, normX * 6.5)),
      y: Math.max(-2.5, Math.min(3.5, normY * 3.5))
    };
  };

  const nudgeShip = (dx, dy) => {
    if (gameState !== 'playing') return;
    targetPosRef.current = {
      x: Math.max(-5.5, Math.min(5.5, targetPosRef.current.x + dx * 1.8)),
      y: Math.max(-2.5, Math.min(3.5, targetPosRef.current.y + dy * 1.4))
    };
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState !== 'playing') return;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') nudgeShip(-1, 0);
      else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') nudgeShip(1, 0);
      else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') nudgeShip(0, 1);
      else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') nudgeShip(0, -1);
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState]);

  return (
    <div
      className={styles.gameContainer}
      onPointerMove={handlePointerMove}
      onPointerDown={() => (isPointerDownRef.current = true)}
      onPointerUp={() => (isPointerDownRef.current = false)}
    >
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className={styles.canvasWrapper} />

      {/* Screen Damage Flash & Hyper Boost Warp FX */}
      {screenDamage && <div className={styles.screenDamageFlash} />}
      {isHyperBoost && <div className={styles.hyperBoostWarp} />}

      {/* Top Arcade HUD: Shield Hearts, Crystals, Score */}
      <header className={styles.topHud}>
        <div className={styles.hudGroupLeft}>
          <div className={styles.hudBadge}>
            <div className={styles.heartsRow}>
              {[1, 2, 3].map((heartIndex) => (
                <span
                  key={heartIndex}
                  className={`${styles.heartIcon} ${heartIndex > lives ? styles.heartLost : ''}`}
                >
                  ❤️
                </span>
              ))}
            </div>
            <div className={styles.badgeTextCol}>
              <span className={styles.badgeLabel}>Perisai</span>
              <span className={styles.badgeValue}>{lives}/3</span>
            </div>
          </div>

          <div className={styles.hudBadge}>
            <span className={styles.badgeIcon}>💎</span>
            <div className={styles.badgeTextCol}>
              <span className={styles.badgeLabel}>Kristal</span>
              <span className={styles.badgeValue}>{crystalsCount}</span>
            </div>
          </div>
        </div>

        <div className={styles.hudGroupRight}>
          <div className={styles.hudBadge}>
            <span className={styles.badgeIcon}>⭐</span>
            <div className={styles.badgeTextCol}>
              <span className={styles.badgeLabel}>Skor</span>
              <span className={styles.badgeValue}>{score}</span>
            </div>
          </div>
        </div>
      </header>

      {/* Distance Flight Progress Bar */}
      {gameState === 'playing' && (
        <div className={styles.progressBarContainer}>
          <div className={styles.progressLabelRow}>
            <span>🚀 Wahana Ulang-Alik Menuju ISS</span>
            <span>{distanceRemaining} METER</span>
          </div>
          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{ width: `${Math.round(((1000 - distanceRemaining) / 1000) * 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Center Toast Alert Feedback */}
      {gameState === 'playing' && (
        <div className={styles.centerAlertToast}>
          <span>{centerToast}</span>
        </div>
      )}

      {/* Desktop / Touch Steering Guide */}
      {gameState === 'playing' && (
        <div className={styles.steeringGuideOverlay}>
          <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#38bdf8' }}>
            touch_app
          </span>
          <span>Arahkan kursor atau usap layar untuk mengemudikan wahana</span>
        </div>
      )}

      {/* Mobile On-Screen D-Pad */}
      {gameState === 'playing' && (
        <div className={styles.touchControlOverlay}>
          <div className={styles.touchDpad}>
            <div />
            <button type="button" className={styles.touchBtn} onClick={() => nudgeShip(0, 1)}>▲</button>
            <div />
            <button type="button" className={styles.touchBtn} onClick={() => nudgeShip(-1, 0)}>◀</button>
            <div />
            <button type="button" className={styles.touchBtn} onClick={() => nudgeShip(1, 0)}>▶</button>
            <div />
            <button type="button" className={styles.touchBtn} onClick={() => nudgeShip(0, -1)}>▼</button>
            <div />
          </div>
        </div>
      )}

      {/* ─── MODAL 1: START / BRIEFING MODAL ─── */}
      {gameState === 'briefing' && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <div className={styles.modalIcon}>🚀✨</div>
            <h2 className={styles.modalTitle}>Peluncuran Wahana Ulang-Alik Orbital</h2>
            <p className={styles.modalDesc}>
              Kemudikan wahana Space Shuttle melintasi badai meteorit di orbit Bumi menuju Stasiun Antariksa Internasional (ISS)!
            </p>

            <div className={styles.instructionBox}>
              <div className={styles.instItem}>
                <span className={styles.instItemIcon}>🎮</span>
                <span><b>Kemudikan Shuttle:</b> Geser mouse, usap layar, atau gunakan tombol panah (W/A/S/D).</span>
              </div>
              <div className={styles.instItem}>
                <span className={styles.instItemIcon}>🪨</span>
                <span><b>Hindari Meteorit:</b> Jaga perisai wahana dari benturan batuan angkasa luar!</span>
              </div>
              <div className={styles.instItem}>
                <span className={styles.instItemIcon}>💎</span>
                <span><b>Kristal & Gerbang Warp:</b> Ambil kristal plasma dan masuki cincin hijau untuk melesat cepat!</span>
              </div>
              <div className={styles.instItem}>
                <span className={styles.instItemIcon}>🛰️</span>
                <span><b>Docking ISS:</b> Capai jarak 0 meter dan masuk ke gerbang palka Stasiun Antariksa untuk menang!</span>
              </div>
            </div>

            <button
              type="button"
              className={styles.primaryActionBtn}
              onClick={() => {
                initAudio();
                playSfx('click');
                setGameState('playing');
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>flight_takeoff</span>
              Mulai Terbang Sekarang!
            </button>
          </div>
        </div>
      )}

      {/* ─── MODAL 2: GAME OVER MODAL ─── */}
      {gameState === 'gameover' && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <div className={styles.modalIcon}>💥</div>
            <h2 className={styles.modalTitle} style={{ color: '#ef4444' }}>Perisai Habis!</h2>
            <p className={styles.modalDesc}>
              Wahana antariksa tertabrak serpihan meteorit orbital. Tapi jangan menyerah, astronot tangguh selalu siap mencoba lagi!
            </p>

            <div style={{ fontSize: '14px', fontWeight: 800, color: '#f8fafc', margin: '4px 0' }}>
              Skor Terkumpul: <span style={{ color: '#38bdf8' }}>{score}</span> • Kristal: <span style={{ color: '#22c55e' }}>{crystalsCount}</span>
            </div>

            <button
              type="button"
              className={styles.primaryActionBtn}
              onClick={restartGame}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>replay</span>
              Coba Terbang Lagi!
            </button>
          </div>
        </div>
      )}

      {/* ─── MODAL 3: VICTORY MODAL ─── */}
      {gameState === 'victory' && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <div className={styles.modalIcon}>🛰️🎉</div>
            <h2 className={styles.modalTitle}>Docking Berhasil Sempurna!</h2>
            <p className={styles.modalDesc}>
              Luar biasa! Kamu berhasil mengemudikan wahana Space Shuttle menembus badai asteroid dan mengunci modul tepat di Stasiun Antariksa ISS!
            </p>

            <div className={styles.rewardBadgesRow}>
              <div className={styles.rewardBadge}>
                <span className={styles.rewardBadgeIcon}>⚡</span>
                <span className={styles.rewardBadgeValue}>+220 XP</span>
                <span className={styles.rewardBadgeTitle}>Hadiah Misi</span>
              </div>
              <div className={styles.rewardBadge}>
                <span className={styles.rewardBadgeIcon}>🪙</span>
                <span className={styles.rewardBadgeValue}>+55</span>
                <span className={styles.rewardBadgeTitle}>Koin Emas</span>
              </div>
              <div className={styles.rewardBadge}>
                <span className={styles.rewardBadgeIcon}>⭐</span>
                <span className={styles.rewardBadgeValue}>3 Bintang</span>
                <span className={styles.rewardBadgeTitle}>Peringkat</span>
              </div>
            </div>

            <div className={styles.cardPreviewBox}>
              <img
                src="/images/items/space_station_3d.jpg"
                alt="Stasiun Antariksa"
                className={styles.cardThumbnail}
              />
              <div>
                <div style={{ fontSize: '10px', fontWeight: 900, color: '#38bdf8', textTransform: 'uppercase' }}>
                  Kartu Baru Dibuka!
                </div>
                <div style={{ fontSize: '13px', fontWeight: 900, color: '#ffffff' }}>
                  Stasiun Antariksa Orbital
                </div>
                <div style={{ fontSize: '11px', color: '#94a3b8' }}>
                  Mengorbit Bumi setiap 90 menit pada kecepatan 27.600 km/jam!
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
              <button
                type="button"
                className={styles.primaryActionBtn}
                onClick={() => navigate('/world/angkasa-pengetahuan')}
              >
                Kembali ke Peta Dunia
              </button>
              <button
                type="button"
                className={styles.secondaryActionBtn}
                onClick={() => navigate('/cards')}
              >
                Koleksi Kartu
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
