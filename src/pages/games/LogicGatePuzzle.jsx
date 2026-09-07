import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { useAudio } from '../../context/AudioContext';
import styles from './LogicGatePuzzle.module.css';

// ---------------------------------------------------------------------------
// LOGIC GATE EVALUATORS
// ---------------------------------------------------------------------------
const GATE_FN = {
  AND: (a, b) => Boolean(a && b),
  OR:  (a, b) => Boolean(a || b),
  NOT: (a) => Boolean(!a),
  XOR: (a, b) => Boolean(Boolean(a) !== Boolean(b)),
};

// ---------------------------------------------------------------------------
// KID-FRIENDLY GATE INFO
// ---------------------------------------------------------------------------
const GATE_INFO = {
  AND: { icon: '🔒', name: 'Pintu Ganda', rule: 'Semua input harus ✅ Benar' },
  OR:  { icon: '🚪', name: 'Pintu Pilihan', rule: 'Salah satu input ✅ Benar sudah cukup' },
  NOT: { icon: '🔄', name: 'Pembalik', rule: 'Membalik: ✅ jadi ❌, ❌ jadi ✅' },
  XOR: { icon: '⚡', name: 'Pintu Beda', rule: 'Hanya aktif jika input BERBEDA (satu ✅, satu ❌)' },
};

// ---------------------------------------------------------------------------
// SECTOR/PUZZLE DEFINITIONS
// ---------------------------------------------------------------------------
const SECTORS = [
  {
    id: 'sector-1',
    sectorNum: 1,
    title: 'Sektor 1: Pintu Ganda',
    subtitle: 'Atur saklar agar kedua input menyala ✅ supaya pintu terbuka!',
    hint: '💡 Pintu Ganda (🔒 AND) butuh SEMUA saklar menyala hijau ✅ untuk terbuka.',
    eduTitle: '🧠 Apa itu Pintu Ganda (AND)?',
    eduText: 'Di dunia komputer, "Pintu Ganda" disebut gerbang AND. Pintu ini hanya terbuka kalau SEMUA syarat terpenuhi — mirip pintu brankas yang butuh 2 kunci sekaligus!',
    // Circuit layout
    inputs: [
      { id: 'A', label: 'Saklar A', x: 80, y: 100, defaultValue: false },
      { id: 'B', label: 'Saklar B', x: 80, y: 220, defaultValue: false },
    ],
    gates: [
      { id: 'G1', type: 'AND', x: 300, y: 160, inputs: ['A', 'B'] },
    ],
    outputGateId: 'G1',
    outputPos: { x: 500, y: 160 },
  },
  {
    id: 'sector-2',
    sectorNum: 2,
    title: 'Sektor 2: Percabangan Sinyal & Jebakan Pembalik',
    subtitle: 'Awas jebakan! Saklar A terhubung ke 2 gerbang berbeda. Cari kombinasi 3 saklar yang tepat!',
    hint: '💡 Perhatikan Saklar A! Jika Saklar A dinyalakan, Pembalik (G1) akan MATI sehingga G3 padam. Namun G2 butuh input Benar. Bagaimana cara menyalakan G2 tanpa Saklar A?',
    eduTitle: '🧠 Percabangan Sinyal & Ketergantungan Logika',
    eduText: 'Dalam chip komputer, satu kabel saklar sering bercabang ke beberapa gerbang logika. Mengubah satu saklar bisa mengaktifkan satu jalur tapi mematikan jalur lain! Hanya ada 1 kombinasi dari 8 kemungkinan yang bisa menembus sektor ini: Saklar A MATI (❌), Saklar B HIDUP (✅), Saklar C HIDUP (✅)!',
    inputs: [
      { id: 'A', label: 'Saklar A', x: 60, y: 70, defaultValue: true },
      { id: 'B', label: 'Saklar B', x: 60, y: 190, defaultValue: false },
      { id: 'C', label: 'Saklar C', x: 60, y: 310, defaultValue: false },
    ],
    gates: [
      { id: 'G1', type: 'NOT', x: 230, y: 70, inputs: ['A'] },
      { id: 'G2', type: 'OR', x: 230, y: 310, inputs: ['A', 'C'] },
      { id: 'G3', type: 'AND', x: 420, y: 130, inputs: ['G1', 'B'] },
      { id: 'G4', type: 'AND', x: 600, y: 220, inputs: ['G3', 'G2'] },
    ],
    outputGateId: 'G4',
    outputPos: { x: 750, y: 220 },
  },
  {
    id: 'sector-3',
    sectorNum: 3,
    title: 'Sektor 3: Benteng Kripto Logika (Bos Akhir)',
    subtitle: 'Sistem pertahanan 4 saklar & gerbang XOR! Menyalakan saklar yang salah justru mengunci pintu.',
    hint: '💡 Gerbang XOR (⚡ Pintu Beda) hanya aktif jika kedua sinyalnya BERBEDA (satu ON, satu OFF)! Jika kedua inputnya sama-sama ON, Pintu Beda justru padam. Pikirkan saklar mana yang justru harus kamu MATIKAN!',
    eduTitle: '🧠 Gerbang XOR & Kriptografi Komputer',
    eduText: 'Luar biasa jenius! Gerbang XOR (Exclusive OR) adalah fondasi enkripsi rahasia dan matematika prosesor komputer modern. Kamu berhasil menyadari bahwa menyalakan saklar yang salah justru memadamkan gerbang XOR! Kunci sejatinya: Hanya Saklar B yang HIDUP (✅), sedangkan Saklar A, C, dan D harus MATI (❌)!',
    inputs: [
      { id: 'A', label: 'Saklar A', x: 60, y: 65, defaultValue: true },
      { id: 'B', label: 'Saklar B', x: 60, y: 165, defaultValue: false },
      { id: 'C', label: 'Saklar C', x: 60, y: 265, defaultValue: true },
      { id: 'D', label: 'Saklar D', x: 60, y: 365, defaultValue: true },
    ],
    gates: [
      { id: 'G1', type: 'NOT', x: 230, y: 265, inputs: ['C'] },
      { id: 'G2', type: 'OR', x: 230, y: 85, inputs: ['A', 'D'] },
      { id: 'G3', type: 'AND', x: 420, y: 215, inputs: ['B', 'G1'] },
      { id: 'G4', type: 'XOR', x: 420, y: 85, inputs: ['G2', 'B'] },
      { id: 'G5', type: 'AND', x: 610, y: 150, inputs: ['G4', 'G3'] },
    ],
    outputGateId: 'G5',
    outputPos: { x: 780, y: 150 },
  },
];

// ---------------------------------------------------------------------------
// SVG GATE SHAPES
// ---------------------------------------------------------------------------
function GateShape({ type, x, y, outputValue }) {
  const w = 100;
  const h = 60;
  const info = GATE_INFO[type];
  const fillColor = outputValue ? '#064e3b' : '#450a0a';
  const strokeColor = outputValue ? '#10b981' : '#ef4444';

  return (
    <g className={`${styles.gateBlock} ${outputValue ? styles.gateBlockTrue : styles.gateBlockFalse}`}>
      {/* Gate body */}
      <rect
        x={x - w / 2}
        y={y - h / 2}
        width={w}
        height={h}
        rx={12}
        fill={fillColor}
        stroke={strokeColor}
        strokeWidth={2.5}
      />
      {/* Inner glow border */}
      <rect
        x={x - w / 2 + 3}
        y={y - h / 2 + 3}
        width={w - 6}
        height={h - 6}
        rx={9}
        fill="none"
        stroke={outputValue ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.15)'}
        strokeWidth={1}
      />
      {/* Icon */}
      <text x={x} y={y - 6} textAnchor="middle" fontSize="18" dominantBaseline="central" style={{ pointerEvents: 'none' }}>
        {info.icon}
      </text>
      {/* Label */}
      <text className={styles.gateLabel} x={x} y={y + 18} dominantBaseline="central">
        {info.name}
      </text>
      {/* Output indicator dot */}
      <circle
        cx={x + w / 2 + 8}
        cy={y}
        r={5}
        fill={outputValue ? '#10b981' : '#ef4444'}
        stroke={outputValue ? '#34d399' : '#f87171'}
        strokeWidth={1.5}
      />
    </g>
  );
}

// ---------------------------------------------------------------------------
// SVG INPUT TOGGLE BUTTON
// ---------------------------------------------------------------------------
function InputToggle({ id, label, x, y, value, onClick }) {
  const r = 28;
  const fillColor = value ? '#064e3b' : '#450a0a';
  const strokeColor = value ? '#10b981' : '#ef4444';
  const glowColor = value ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.2)';

  return (
    <g className={styles.inputToggle} onClick={() => onClick(id)} role="button" tabIndex={0} aria-label={`${label}: ${value ? 'Benar' : 'Salah'}`}>
      {/* Outer glow */}
      <circle cx={x} cy={y} r={r + 6} fill={glowColor} className={styles.toggleGlow} />
      {/* Main circle */}
      <circle cx={x} cy={y} r={r} fill={fillColor} stroke={strokeColor} strokeWidth={2.5} />
      {/* Inner ring */}
      <circle cx={x} cy={y} r={r - 5} fill="none" stroke={value ? 'rgba(16, 185, 129, 0.25)' : 'rgba(239, 68, 68, 0.2)'} strokeWidth={1} />
      {/* Status icon */}
      <text x={x} y={y - 2} textAnchor="middle" fontSize="18" dominantBaseline="central" style={{ pointerEvents: 'none' }}>
        {value ? '✅' : '❌'}
      </text>
      {/* Label below */}
      <text className={styles.inputLabel} x={x} y={y + r + 16} dominantBaseline="central">
        {label}
      </text>
      {/* Tap hint */}
      <text x={x} y={y + r + 30} textAnchor="middle" fontSize="8" fontWeight="700" fill="#64748b" dominantBaseline="central" style={{ pointerEvents: 'none' }}>
        ketuk untuk ubah
      </text>
    </g>
  );
}

// ---------------------------------------------------------------------------
// SVG OUTPUT INDICATOR
// ---------------------------------------------------------------------------
function OutputBadge({ x, y, isOpen }) {
  const r = 32;

  return (
    <g className={`${styles.outputBadge} ${isOpen ? styles.outputOpen : styles.outputLocked}`}>
      {/* Glow ring */}
      {isOpen && (
        <circle cx={x} cy={y} r={r + 12} fill="none" stroke="rgba(16, 185, 129, 0.2)" strokeWidth={2} />
      )}
      {/* Outer ring */}
      <circle
        cx={x}
        cy={y}
        r={r}
        fill={isOpen ? '#064e3b' : '#1c1917'}
        stroke={isOpen ? '#10b981' : '#78716c'}
        strokeWidth={3}
      />
      {/* Inner */}
      <circle
        cx={x}
        cy={y}
        r={r - 6}
        fill={isOpen ? '#065f46' : '#292524'}
        stroke={isOpen ? '#34d399' : '#57534e'}
        strokeWidth={1.5}
      />
      {/* Icon */}
      <text x={x} y={y - 4} textAnchor="middle" fontSize="22" dominantBaseline="central" style={{ pointerEvents: 'none' }}>
        {isOpen ? '🔓' : '🔒'}
      </text>
      {/* Label */}
      <text
        className={styles.outputLabel}
        x={x}
        y={y + 22}
        fill={isOpen ? '#34d399' : '#a8a29e'}
        dominantBaseline="central"
      >
        {isOpen ? 'TERBUKA!' : 'TERKUNCI'}
      </text>
    </g>
  );
}

// ---------------------------------------------------------------------------
// WIRE CONNECTOR
// ---------------------------------------------------------------------------
function Wire({ x1, y1, x2, y2, active }) {
  // Curved wire with control points
  const midX = (x1 + x2) / 2;
  const d = `M ${x1} ${y1} C ${midX} ${y1}, ${midX} ${y2}, ${x2} ${y2}`;

  return (
    <path
      d={d}
      fill="none"
      stroke={active ? '#10b981' : '#ef4444'}
      strokeWidth={active ? 3 : 2}
      className={active ? styles.wireActive : styles.wireInactive}
      strokeLinecap="round"
    />
  );
}

// ---------------------------------------------------------------------------
// CIRCUIT EVALUATOR: Evaluate all gates from inputs
// ---------------------------------------------------------------------------
function evaluateCircuit(sector, inputValues) {
  const nodeValues = {};

  // Set input values
  sector.inputs.forEach((inp) => {
    nodeValues[inp.id] = inputValues[inp.id] ?? inp.defaultValue;
  });

  // Evaluate gates in order (topological — they are already in dependency order)
  sector.gates.forEach((gate) => {
    const gateInputVals = gate.inputs.map((inpId) => nodeValues[inpId]);
    if (gate.type === 'NOT') {
      nodeValues[gate.id] = GATE_FN.NOT(gateInputVals[0]);
    } else {
      nodeValues[gate.id] = GATE_FN[gate.type](gateInputVals[0], gateInputVals[1]);
    }
  });

  return nodeValues;
}

// ---------------------------------------------------------------------------
// MAIN COMPONENT
// ---------------------------------------------------------------------------
export default function LogicGatePuzzle({ questId: propQuestId, onGameComplete = null }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const targetQuestId = propQuestId || searchParams.get('questId') || 'quest-gt-3';

  const { completeQuest } = useGame();
  const { playSfx } = useAudio();

  // Sector state
  const [currentSectorIdx, setCurrentSectorIdx] = useState(0);
  const currentSector = SECTORS[currentSectorIdx];

  // Input values: { A: bool, B: bool, ... }
  const [inputValues, setInputValues] = useState(() => {
    const init = {};
    currentSector.inputs.forEach((inp) => { init[inp.id] = inp.defaultValue; });
    return init;
  });

  // UI states
  const [showHint, setShowHint] = useState(false);
  const [showSectorSuccess, setShowSectorSuccess] = useState(false);
  const [showGameComplete, setShowGameComplete] = useState(false);
  const [statusMessage, setStatusMessage] = useState(currentSector.subtitle);
  const [statusType, setStatusType] = useState('idle');
  const [arenaAnim, setArenaAnim] = useState('');
  const [attempts, setAttempts] = useState(0);

  // Evaluate circuit reactively
  const nodeValues = useMemo(() => evaluateCircuit(currentSector, inputValues), [currentSector, inputValues]);
  const outputValue = nodeValues[currentSector.outputGateId];

  // Reset when sector changes
  useEffect(() => {
    const sec = SECTORS[currentSectorIdx];
    const init = {};
    sec.inputs.forEach((inp) => { init[inp.id] = inp.defaultValue; });
    setInputValues(init);
    setShowSectorSuccess(false);
    setStatusMessage(sec.subtitle);
    setStatusType('idle');
    setShowHint(false);
    setArenaAnim('');
    setAttempts(0);
  }, [currentSectorIdx]);

  // Toggle input
  const handleToggleInput = useCallback((inputId) => {
    if (showSectorSuccess) return;
    playSfx('button-click');
    setInputValues((prev) => ({ ...prev, [inputId]: !prev[inputId] }));
  }, [showSectorSuccess, playSfx]);

  // Check answer
  const handleCheckAnswer = useCallback(() => {
    if (showSectorSuccess) return;

    if (outputValue) {
      // Correct!
      playSfx('correct');
      setStatusMessage('🎉 Pintu terbuka! Rangkaian logika berhasil dipecahkan!');
      setStatusType('success');
      setArenaAnim('success');
      setTimeout(() => setShowSectorSuccess(true), 600);
    } else {
      // Wrong
      playSfx('wrong');
      setAttempts((prev) => prev + 1);

      // Give contextual hints
      const wrongGates = currentSector.gates.filter((g) => !nodeValues[g.id]);
      if (wrongGates.length > 0) {
        const gate = wrongGates[0];
        const info = GATE_INFO[gate.type];
        setStatusMessage(`❌ ${info.icon} ${info.name} masih merah! ${info.rule}.`);
      } else {
        setStatusMessage('❌ Hampir! Periksa ulang sakelar-sakelarnya.');
      }
      setStatusType('error');
      setArenaAnim('error');
      setTimeout(() => setArenaAnim(''), 500);
    }
  }, [showSectorSuccess, outputValue, currentSector, nodeValues, playSfx]);

  // Next sector
  const handleNextSector = () => {
    if (currentSectorIdx < SECTORS.length - 1) {
      playSfx('level-up');
      setCurrentSectorIdx((prev) => prev + 1);
    } else {
      handleCompleteMission();
    }
  };

  // Complete mission
  const handleCompleteMission = () => {
    playSfx('quest-complete');
    setShowGameComplete(true);
    completeQuest('quest-gt-3', 100, 200, 55, 'card-volcano');
  };

  // Reset sector
  const handleResetSector = () => {
    const sec = SECTORS[currentSectorIdx];
    const init = {};
    sec.inputs.forEach((inp) => { init[inp.id] = inp.defaultValue; });
    setInputValues(init);
    setStatusMessage(sec.subtitle);
    setStatusType('idle');
    setArenaAnim('');
    playSfx('button-click');
  };

  // Get node position (inputs or gate outputs)
  const getNodePos = (nodeId) => {
    const inp = currentSector.inputs.find((i) => i.id === nodeId);
    if (inp) return { x: inp.x, y: inp.y };
    const gate = currentSector.gates.find((g) => g.id === nodeId);
    if (gate) return { x: gate.x + 58, y: gate.y }; // Right side of gate box + dot
    return { x: 0, y: 0 };
  };

  // Get gate input position (left side of gate)
  const getGateInputPos = (gate, inputIndex) => {
    const h = 60;
    if (gate.type === 'NOT') {
      return { x: gate.x - 50, y: gate.y };
    }
    const spacing = h / 3;
    return { x: gate.x - 50, y: gate.y - h / 2 + spacing * (inputIndex + 1) };
  };

  // Render wires
  const renderWires = () => {
    const wires = [];

    currentSector.gates.forEach((gate) => {
      gate.inputs.forEach((inpId, idx) => {
        const fromPos = getNodePos(inpId);
        const toPos = getGateInputPos(gate, idx);
        const nodeVal = nodeValues[inpId] ?? false;
        wires.push(
          <Wire
            key={`wire-${inpId}-${gate.id}`}
            x1={fromPos.x + (currentSector.inputs.find((i) => i.id === inpId) ? 28 : 0)}
            y1={fromPos.y}
            x2={toPos.x}
            y2={toPos.y}
            active={nodeVal}
          />
        );
      });
    });

    // Wire from last gate to output
    const lastGate = currentSector.gates.find((g) => g.id === currentSector.outputGateId);
    if (lastGate) {
      wires.push(
        <Wire
          key="wire-output"
          x1={lastGate.x + 58}
          y1={lastGate.y}
          x2={currentSector.outputPos.x - 32}
          y2={currentSector.outputPos.y}
          active={outputValue}
        />
      );
    }

    return wires;
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
            title="Petunjuk"
          >
            <span>💡</span>
            <span className={styles.iconBtnLabel}>Petunjuk</span>
          </button>
          <button
            type="button"
            className={styles.iconBtn}
            onClick={handleResetSector}
            title="Mulai Ulang Sektor"
          >
            <span>↺</span>
            <span className={styles.iconBtnLabel}>Ulangi</span>
          </button>
        </div>
      </div>

      {/* Status / Hint Banner */}
      {showHint ? (
        <div className={styles.hintBanner}>
          <span className={styles.hintEmoji}>💡</span>
          <span className={styles.hintText}>{currentSector.hint}</span>
          <button type="button" className={styles.hintClose} onClick={() => setShowHint(false)}>✕</button>
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

      {/* Gate Quick Legend Bar */}
      <div className={styles.gateLegendBar}>
        <span className={styles.legendTitle}>Kamus:</span>
        <span className={styles.legendChip}>🔒 AND: Semua ✅</span>
        <span className={styles.legendChip}>🚪 OR: Salah Satu ✅</span>
        <span className={styles.legendChip}>🔄 NOT: Pembalik (✅⇄❌)</span>
        {currentSector.gates.some((g) => g.type === 'XOR') && (
          <span className={styles.legendChip} style={{ borderColor: 'rgba(56, 189, 248, 0.4)', color: '#38bdf8' }}>
            ⚡ XOR: Harus Beda (1 ✅ & 1 ❌)
          </span>
        )}
      </div>

      {/* Circuit Board Arena */}
      <div
        className={`${styles.circuitArena} ${arenaAnim === 'success' ? styles.successFlash : ''} ${arenaAnim === 'error' ? styles.errorShake : ''}`}
      >
        <svg
          className={styles.circuitSvg}
          viewBox={`0 0 ${currentSector.outputPos.x + 60} ${Math.max(...currentSector.inputs.map((i) => i.y), ...currentSector.gates.map((g) => g.y)) + 80}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Wires */}
          {renderWires()}

          {/* Gates */}
          {currentSector.gates.map((gate) => (
            <GateShape
              key={gate.id}
              type={gate.type}
              x={gate.x}
              y={gate.y}
              outputValue={nodeValues[gate.id] ?? false}
            />
          ))}

          {/* Inputs */}
          {currentSector.inputs.map((inp) => (
            <InputToggle
              key={inp.id}
              id={inp.id}
              label={inp.label}
              x={inp.x}
              y={inp.y}
              value={inputValues[inp.id] ?? false}
              onClick={handleToggleInput}
            />
          ))}

          {/* Output */}
          <OutputBadge
            x={currentSector.outputPos.x}
            y={currentSector.outputPos.y}
            isOpen={outputValue}
          />
        </svg>
      </div>

      {/* Educational Card (shown after wrong attempts) */}
      {attempts >= 2 && !showSectorSuccess && (
        <div className={styles.eduCard}>
          <div className={styles.eduCardTitle}>
            <span>{currentSector.eduTitle}</span>
          </div>
          <div className={styles.eduCardText}>{currentSector.eduText}</div>
        </div>
      )}

      {/* Bottom Bar */}
      <div className={styles.bottomBar}>
        <div className={styles.sectorProgress}>
          {SECTORS.map((sec, idx) => (
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
          className={styles.btnCheck}
          onClick={handleCheckAnswer}
          disabled={showSectorSuccess}
        >
          <span>🔍</span>
          <span>Cek Jawaban</span>
        </button>
      </div>

      {/* Sector Success Modal */}
      {showSectorSuccess && (
        <div className={styles.modalBackdrop}>
          <div className={styles.modalCard}>
            <div className={styles.modalTrophy}>✨</div>
            <span className={styles.modalBadge}>Sektor Berhasil Ditembus!</span>
            <h3 className={styles.modalTitle}>{currentSector.title}</h3>
            <p className={styles.modalText}>
              {currentSector.eduText}
            </p>
            <button
              type="button"
              className={styles.btnModalNext}
              onClick={handleNextSector}
            >
              {currentSectorIdx < SECTORS.length - 1
                ? 'Lanjut ke Sektor Berikutnya ➔'
                : 'Selesaikan Misi Logika 🏆'}
            </button>
          </div>
        </div>
      )}

      {/* Final Game Complete Modal */}
      {showGameComplete && (
        <div className={styles.modalBackdrop}>
          <div className={styles.completeCard}>
            <div className={styles.completeIconGlow}>🧠</div>
            <span className={styles.completeBadge}>Misi Logika Tuntas!</span>
            <h2 className={styles.completeHeading}>Master Gerbang Logika</h2>
            <p className={styles.completeDesc}>
              Luar biasa! Kamu berhasil memecahkan semua rangkaian gerbang logika dan membuka pintu ruang harta Gunung Teka-Teki!
            </p>

            <div className={styles.rewardGrid}>
              <div className={styles.rewardBox}>
                <span className={styles.rewardNum}>+200</span>
                <span className={styles.rewardLabel}>XP Logika</span>
              </div>
              <div className={styles.rewardBox}>
                <span className={styles.rewardNum}>+55</span>
                <span className={styles.rewardLabel}>Koin Emas</span>
              </div>
              <div className={styles.rewardBox}>
                <span className={styles.rewardNum}>🌋</span>
                <span className={styles.rewardLabel}>Kartu Gunung</span>
              </div>
              <div className={styles.rewardBox}>
                <span className={styles.rewardNum}>⭐</span>
                <span className={styles.rewardLabel}>3 Bintang</span>
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
