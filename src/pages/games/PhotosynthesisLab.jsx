import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { useAudio } from '../../context/AudioContext';
import { getCharacterById } from '../../data/characters';
import styles from './PhotosynthesisLab.module.css';

// ---------------------------------------------------------------------------
// Game Content & Scientific Data
// ---------------------------------------------------------------------------

// Stage 1: The 6 natural elements to choose from (3 reactants needed)
const STAGE_1_ELEMENTS = [
  {
    id: 'sunlight',
    name: 'Cahaya Matahari',
    sub: 'Energi Foton',
    emoji: '☀️',
    isCorrect: true,
    desc: 'Diserap klorofil sebagai sumber tenaga utama memasak!'
  },
  {
    id: 'rock',
    name: 'Batu Kerikil',
    sub: 'Mineral Padat',
    emoji: '🪨',
    isCorrect: false,
    desc: 'Batu kerikil padat tidak dapat diserap daun untuk fotosintesis!'
  },
  {
    id: 'water',
    name: 'Air Bersih',
    sub: 'H₂O Tanah',
    emoji: '💧',
    isCorrect: true,
    desc: 'Diserap akar dari tanah lalu dialirkan naik ke daun!'
  },
  {
    id: 'smoke',
    name: 'Asap Polusi',
    sub: 'Polutan Beracun',
    emoji: '🏭',
    isCorrect: false,
    desc: 'Asap polusi berbahaya justru menyumbat pori-pori daun!'
  },
  {
    id: 'co2',
    name: 'Karbon Dioksida',
    sub: 'Gas CO₂ Udara',
    emoji: '💨',
    isCorrect: true,
    desc: 'Gas dari udara yang dihirup masuk melalui stomata daun!'
  },
  {
    id: 'ice',
    name: 'Kristal Es Beku',
    sub: 'Suhu Beku Ekstrem',
    emoji: '❄️',
    isCorrect: false,
    desc: 'Suhu beku menghentikan aktivitas enzim fotosintesis!'
  }
];

// Stage 2: Leaf Anatomy & Machinery
const STAGE_2_QUIZ = [
  {
    id: 'q1',
    category: 'Organel Hijau',
    targetOrganelle: 'klorofil',
    prompt: 'Zat hijau apakah di dalam kloroplas yang menangkap sinar matahari seperti panel surya?',
    hint: 'Zat ini memberi warna hijau alami pada daun dan bernama Klorofil!',
    options: [
      { id: 'a', label: '🌿 Klorofil (Zat Hijau Daun)', isCorrect: true, explanation: 'Tepat sekali! Klorofil menyerap spektrum cahaya matahari untuk energi fotosintesis.' },
      { id: 'b', label: '🍯 Nektar Bunga Manis', isCorrect: false, explanation: 'Nektar adalah cairan manis pemikat serangga penyerbuk, bukan penyerap cahaya.' },
      { id: 'c', label: '🪵 Kulit Kayu Tebal', isCorrect: false, explanation: 'Kulit kayu berfungsi melindungi batang dari luar.' },
      { id: 'd', label: '🌸 Mahkota Bunga', isCorrect: false, explanation: 'Mahkota bunga adalah perhiasan bunga penarik kumbang.' }
    ]
  },
  {
    id: 'q2',
    category: 'Mulut Daun',
    targetOrganelle: 'stomata',
    prompt: 'Melalui pintu pori-pori manakah gas Karbon Dioksida (CO₂) masuk ke dalam daun?',
    hint: 'Pori mikroskopis di bawah permukaan daun ini disebut Stomata (mulut daun)!',
    options: [
      { id: 'a', label: '🌰 Cangkang Biji Buah', isCorrect: false, explanation: 'Biji adalah alat perkembangbiakan tumbuhan.' },
      { id: 'b', label: '👄 Stomata (Mulut Daun)', isCorrect: true, explanation: 'Hebat! Stomata adalah pori-pori daun yang membuka dan menutup untuk pertukaran gas CO₂ dan O₂.' },
      { id: 'c', label: '🪱 Lubang Cacing Tanah', isCorrect: false, explanation: 'Cacing tanah hidup di tanah gembur, bukan di permukaan daun.' },
      { id: 'd', label: '🍁 Duri Perlindungan', isCorrect: false, explanation: 'Duri berfungsi melindungi tumbuhan dari pemangsa herbivora.' }
    ]
  },
  {
    id: 'q3',
    category: 'Jalur Transportasi',
    targetOrganelle: 'xilem',
    prompt: 'Melalui pembuluh apakah air (H₂O) dari akar tanah dialirkan naik menuju daun?',
    hint: 'Pembuluh kayu pengangkut air dari akar ke daun disebut Xilem!',
    options: [
      { id: 'a', label: '🌊 Pembuluh Xilem (Kayu)', isCorrect: true, explanation: 'Tepat sekali! Xilem bekerja bagai pipa kapiler menyedot air dari akar sampai ke ujung daun.' },
      { id: 'b', label: '🎈 Balon Udara', isCorrect: false, explanation: 'Tumbuhan tidak menggunakan balon untuk mengalirkan air.' },
      { id: 'c', label: '🍃 Serbuk Sari Bunga', isCorrect: false, explanation: 'Serbuk sari adalah sel kelamin jantan tumbuhan.' },
      { id: 'd', label: '⚡ Kawat Tembaga Listrik', isCorrect: false, explanation: 'Tumbuhan menggunakan pembuluh biologis alami xilem dan floem.' }
    ]
  }
];

// Stage 3: The 4 products to harvest into two baskets
const STAGE_3_ITEMS = [
  {
    id: 'prod-1',
    name: 'Glukosa Manis',
    formula: 'C₆H₁₂O₆',
    emoji: '🍯',
    target: 'energy',
    desc: 'Cadangan makanan pohon untuk tumbuh besar'
  },
  {
    id: 'prod-2',
    name: 'Oksigen Bersih',
    formula: 'O₂',
    emoji: '🌬️',
    target: 'air',
    desc: 'Udara segar yang dilepaskan untuk pernapasan bumi'
  },
  {
    id: 'prod-3',
    name: 'Gula Pati Alami',
    formula: 'Karbohidrat Nabati',
    emoji: '🍯',
    target: 'energy',
    desc: 'Bahan pembentuk buah manis dan batang pohon'
  },
  {
    id: 'prod-4',
    name: 'Gelembung O₂ Murni',
    formula: 'Gas Oksigen Segar',
    emoji: '🌬️',
    target: 'air',
    desc: 'Menyegarkan udara kanopi Hutan Sains'
  }
];

export default function PhotosynthesisLab({ onGameComplete = null, questId: propQuestId }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const targetQuestId = propQuestId || searchParams.get('questId') || 'quest-hs-1';
  const { completeQuest, characterConfig } = useGame();
  const { playSfx } = useAudio();

  // Active Character
  const activeAvatarId = characterConfig?.avatar || 'raka_explorer';
  const currentCharacter = getCharacterById(activeAvatarId);

  // Game Progress State
  const [activeStage, setActiveStage] = useState(1); // 1, 2, or 3
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [showHint, setShowHint] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'correct'|'wrong', text: '' }

  // Stage 1 State: Reactants collected
  const [collectedReactants, setCollectedReactants] = useState([]); // ['sunlight', 'water', 'co2']
  const [wrongElementId, setWrongElementId] = useState(null);

  // Stage 2 State: Quiz questions
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedQuizOption, setSelectedQuizOption] = useState(null);
  const [wrongQuizOptions, setWrongQuizOptions] = useState([]);

  // Stage 3 State: Harvest sorting
  const [harvestQueueIndex, setHarvestQueueIndex] = useState(0);
  const [energyStoredCount, setEnergyStoredCount] = useState(0);
  const [airReleasedCount, setAirReleasedCount] = useState(0);

  // Victory Overlay
  const [showVictory, setShowVictory] = useState(false);

  // Sound triggering helper
  function triggerSound(type) {
    if (playSfx) playSfx(type);
  }

  // -------------------------------------------------------------------------
  // Handlers for Stage 1: Collecting Reactants
  // -------------------------------------------------------------------------
  function handleSelectElement(elem) {
    if (collectedReactants.includes(elem.id)) return;

    if (elem.isCorrect) {
      triggerSound('correct');
      const updated = [...collectedReactants, elem.id];
      setCollectedReactants(updated);
      setScore((s) => s + 100);
      setFeedback({
        type: 'correct',
        text: `✨ Berhasil! ${elem.name} masuk ke sel daun. ${elem.desc}`
      });

      if (updated.length === 3) {
        triggerSound('achievement');
        setTimeout(() => {
          setFeedback({
            type: 'correct',
            text: '🎉 Luar biasa! Tiga bahan alami fotosintesis lengkap: Cahaya, Air, dan CO₂ siap diolah!'
          });
          setTimeout(() => {
            setActiveStage(2);
            setFeedback(null);
            setShowHint(false);
          }, 1800);
        }, 800);
      } else {
        // Clear feedback after 1.5s so the player can click the next element
        setTimeout(() => setFeedback(null), 1500);
      }
    } else {
      triggerSound('wrong');
      setLives((l) => Math.max(1, l - 1));
      setWrongElementId(elem.id);
      setFeedback({
        type: 'wrong',
        text: `⚠️ Bukan bahan fotosintesis! ${elem.desc}`
      });
      setTimeout(() => {
        setWrongElementId(null);
        setFeedback(null);
      }, 1500);
    }
  }

  // -------------------------------------------------------------------------
  // Handlers for Stage 2: Leaf Machinery Quiz
  // -------------------------------------------------------------------------
  const currentQuiz = STAGE_2_QUIZ[quizIndex];

  function handleSelectQuizOption(opt) {
    if (selectedQuizOption || wrongQuizOptions.includes(opt.id)) return;

    if (opt.isCorrect) {
      triggerSound('correct');
      setSelectedQuizOption(opt.id);
      setScore((s) => s + 120);
      setFeedback({
        type: 'correct',
        text: opt.explanation
      });

      setTimeout(() => {
        if (quizIndex + 1 < STAGE_2_QUIZ.length) {
          setQuizIndex((idx) => idx + 1);
          setSelectedQuizOption(null);
          setWrongQuizOptions([]);
          setFeedback(null);
        } else {
          // Stage 2 Completed
          triggerSound('achievement');
          setFeedback({
            type: 'correct',
            text: '🌿 Sempurna! Kamu telah menguasai peran Klorofil, Stomata, dan Xilem!'
          });
          setTimeout(() => {
            setActiveStage(3);
            setFeedback(null);
            setShowHint(false);
          }, 1600);
        }
      }, 1500);
    } else {
      triggerSound('wrong');
      setLives((l) => Math.max(1, l - 1));
      setWrongQuizOptions((prev) => [...prev, opt.id]);
      setFeedback({
        type: 'wrong',
        text: `⚠️ Belum tepat: ${opt.explanation}`
      });
    }
  }

  // -------------------------------------------------------------------------
  // Handlers for Stage 3: Harvest Sorting
  // -------------------------------------------------------------------------
  const currentHarvestItem = STAGE_3_ITEMS[harvestQueueIndex];

  function handleDispatchHarvest(target) {
    if (!currentHarvestItem) return;

    if (currentHarvestItem.target === target) {
      triggerSound('correct');
      setScore((s) => s + 100);

      if (target === 'energy') {
        setEnergyStoredCount((c) => c + 1);
      } else {
        setAirReleasedCount((c) => c + 1);
      }

      setFeedback({
        type: 'correct',
        text: `✨ Berhasil! ${currentHarvestItem.name} disalurkan ke wadah yang tepat.`
      });

      const nextIdx = harvestQueueIndex + 1;
      if (nextIdx < STAGE_3_ITEMS.length) {
        setHarvestQueueIndex(nextIdx);
      } else {
        // All finished!
        triggerSound('quest-complete');
        const finalTotalScore = score + 200;
        setScore(finalTotalScore);

        // Complete Quest in Context
        completeQuest(targetQuestId, finalTotalScore, 140, 45, 'card-photosynthesis');

        setTimeout(() => {
          setShowVictory(true);
        }, 1200);
      }
    } else {
      triggerSound('wrong');
      setLives((l) => Math.max(1, l - 1));
      setFeedback({
        type: 'wrong',
        text: target === 'energy'
          ? `⚠️ Oksigen tidak disimpan di pohon, melainkan dilepas ke atmosfer udara bersih!`
          : `⚠️ Glukosa adalah makanan pohon, simpanlah di Lumbung Energi Tumbuhan!`
      });
    }
  }

  function handleFinishGame() {
    triggerSound('button-click');
    if (onGameComplete) {
      onGameComplete();
    } else {
      navigate(`/quest/${targetQuestId}/result`);
    }
  }

  function handleReset() {
    triggerSound('button-click');
    setActiveStage(1);
    setScore(0);
    setLives(3);
    setShowHint(false);
    setFeedback(null);
    setCollectedReactants([]);
    setWrongElementId(null);
    setQuizIndex(0);
    setSelectedQuizOption(null);
    setWrongQuizOptions([]);
    setHarvestQueueIndex(0);
    setEnergyStoredCount(0);
    setAirReleasedCount(0);
    setShowVictory(false);
  }

  return (
    <div className={styles.container}>
      <div className={styles.bgAura} />

      {/* 1. Header Information Bar */}
      <header className={styles.headerBar}>
        <div className={styles.missionBadge}>
          <span className={styles.missionTag}>HUTAN SAINS</span>
          <span className={styles.missionTitle}>Misi 01: Misteri Fotosintesis Daun</span>
        </div>

        <div className={styles.statsGroup}>
          <div className={styles.livesContainer} title="Nyawa Eksplorasi">
            {[1, 2, 3].map((num) => (
              <span
                key={num}
                className={`material-symbols-outlined ${styles.heartIcon} ${
                  num <= lives ? styles.heartActive : styles.heartLost
                }`}
              >
                favorite
              </span>
            ))}
          </div>

          <div className={styles.scoreBadge}>
            <span>⭐</span>
            <span>{score}</span>
          </div>

          <button
            type="button"
            className={styles.toolButton}
            onClick={() => setShowHint(!showHint)}
            title="Bantuan Petunjuk"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>lightbulb</span>
            <span>Petunjuk</span>
          </button>

          <button
            type="button"
            className={styles.toolButton}
            onClick={handleReset}
            title="Ulangi Permainan"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>restart_alt</span>
            <span>Ulang</span>
          </button>
        </div>
      </header>

      {/* 2. Educational Hint Banner */}
      {showHint && (
        <div className={styles.hintBanner}>
          <span className="material-symbols-outlined" style={{ color: '#2563eb', fontSize: '22px' }}>
            psychology_alt
          </span>
          <div>
            <h4 className={styles.hintTitle}>Rahasia Dapur Daun:</h4>
            <p className={styles.hintDesc}>
              {activeStage === 1 && (
                <>
                  Fotosintesis butuh 3 reaktan alami: <strong>☀️ Cahaya Matahari</strong> + <strong>💧 Air Tanah (H₂O)</strong> + <strong>💨 Karbon Dioksida (CO₂)</strong> dari udara!
                </>
              )}
              {activeStage === 2 && (
                <>
                  {currentQuiz?.hint}
                </>
              )}
              {activeStage === 3 && (
                <>
                  Hasil fotosintesis adalah <strong>🍯 Glukosa (Energi Makanan)</strong> untuk pohon dan <strong>🌬️ Oksigen (O₂)</strong> untuk udara pernapasan kita!
                </>
              )}
            </p>
          </div>
        </div>
      )}

      {/* 3. Stages Progress Stepper */}
      <nav className={styles.stepperTrack}>
        <div className={`${styles.stepNode} ${activeStage === 1 ? styles.stepNodeActive : activeStage > 1 ? styles.stepNodeCompleted : ''}`}>
          <div className={styles.stepCircle}>{activeStage > 1 ? '✓' : '1'}</div>
          <span>Kumpulkan 3 Bahan</span>
        </div>
        <div className={`${styles.stepDivider} ${activeStage > 1 ? styles.stepDividerDone : ''}`} />
        <div className={`${styles.stepNode} ${activeStage === 2 ? styles.stepNodeActive : activeStage > 2 ? styles.stepNodeCompleted : ''}`}>
          <div className={styles.stepCircle}>{activeStage > 2 ? '✓' : '2'}</div>
          <span>Dapur Klorofil</span>
        </div>
        <div className={`${styles.stepDivider} ${activeStage > 2 ? styles.stepDividerDone : ''}`} />
        <div className={`${styles.stepNode} ${activeStage === 3 ? styles.stepNodeActive : ''}`}>
          <div className={styles.stepCircle}>3</div>
          <span>Panen Hasil</span>
        </div>
      </nav>

      {/* 4. Interactive Growing Tree Diorama Canvas */}
      <section className={styles.stageCanvas}>
        <div className={styles.sunbeams} />

        {/* Ambient floating chlorophyll photons */}
        <div className={styles.ambientFlora}>
          <div className={styles.floatingParticle} style={{ left: '15%', width: '8px', height: '8px', background: '#34d399' }} />
          <div className={styles.floatingParticle} style={{ left: '75%', width: '6px', height: '6px', background: '#fef08a', animationDelay: '2s' }} />
          <div className={styles.floatingParticle} style={{ left: '45%', width: '10px', height: '10px', background: '#67e8f9', animationDelay: '4s' }} />
        </div>

        {/* Ground / Soil Base */}
        <div className={styles.soilLayer} />

        {/* ====== Growing Tree SVG ====== */}
        {(() => {
          // Tree growth level: 0=seed, 1=sprout, 2=medium, 3=full tree
          const growthLevel = activeStage > 1 ? 3 : collectedReactants.length;
          const growthLabel = ['🌱 Bibit di Tanah', '🌿 Kecambah Mungil', '🌳 Pohon Muda', '🌳 Pohon Purba Raksasa'][growthLevel];

          return (
            <div
              className={`${styles.treeContainer} ${styles[`treeGrowth${growthLevel}`]}`}
              key={`tree-${growthLevel}`}
            >
              <svg viewBox="0 0 400 400" className={styles.treeSvg}>
                <defs>
                  {/* Grass gradient */}
                  <linearGradient id="grassGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#15803d" />
                  </linearGradient>
                  {/* Trunk bark gradient */}
                  <linearGradient id="barkGrad" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#5c3310" />
                    <stop offset="40%" stopColor="#78350f" />
                    <stop offset="70%" stopColor="#92400e" />
                    <stop offset="100%" stopColor="#6b3a10" />
                  </linearGradient>
                </defs>

                {/* === Grass Ground === */}
                <ellipse cx="200" cy="378" rx="180" ry="18" fill="#15803d" opacity="0.5" />
                {[130, 150, 168, 185, 200, 215, 232, 248, 265].map((x, i) => (
                  <path key={`grass-${i}`} d={`M ${x},380 Q ${x - 3},${365 - (i % 3) * 4} ${x + 2},380`}
                    fill="none" stroke={i % 2 === 0 ? '#4ade80' : '#22c55e'} strokeWidth="2" />
                ))}

                {/* === STAGE 0: Seed in Soil === */}
                {growthLevel >= 0 && (
                  <g className={styles.treeSeedGroup}>
                    <ellipse cx="200" cy="372" rx="50" ry="10" fill="#5b3a1a" opacity="0.6" />
                    <ellipse
                      cx="200" cy="362" rx={growthLevel === 0 ? 16 : 8} ry={growthLevel === 0 ? 12 : 6}
                      fill="#78350f" stroke="#5c3310" strokeWidth="2"
                      className={growthLevel === 0 ? styles.seedPulse : ''}
                    />
                    {growthLevel === 0 && (
                      <>
                        <path d="M 200,355 Q 202,348 198,342" fill="none" stroke="#a3e635" strokeWidth="2" strokeLinecap="round" />
                        <ellipse cx="196" cy="340" rx="4" ry="3" fill="#86efac" transform="rotate(-20 196 340)" />
                      </>
                    )}
                  </g>
                )}

                {/* === STAGE 1: Sprout / Kecambah === */}
                {growthLevel >= 1 && (
                  <g className={styles.sproutGrowAnim}>
                    {/* Stem */}
                    <path d="M 200,365 Q 198,340 200,310" fill="none" stroke="#15803d" strokeWidth="5" strokeLinecap="round" />
                    {/* Baby leaves with veins */}
                    <ellipse cx="182" cy="310" rx="20" ry="10" fill="#4ade80" stroke="#22c55e" strokeWidth="1.5"
                      transform="rotate(-35 182 310)" />
                    <path d="M 182,310 Q 172,306 167,302" fill="none" stroke="#86efac" strokeWidth="1" />
                    <ellipse cx="218" cy="310" rx="20" ry="10" fill="#4ade80" stroke="#22c55e" strokeWidth="1.5"
                      transform="rotate(35 218 310)" />
                    <path d="M 218,310 Q 228,306 233,302" fill="none" stroke="#86efac" strokeWidth="1" />
                    {/* Tiny top bud */}
                    <ellipse cx="200" cy="300" rx="6" ry="8" fill="#86efac" stroke="#22c55e" strokeWidth="1" />
                    {/* Roots */}
                    <path d="M 200,365 Q 188,378 175,385" fill="none" stroke="#78350f" strokeWidth="2.5" opacity="0.7" strokeLinecap="round" />
                    <path d="M 200,365 Q 212,378 225,385" fill="none" stroke="#78350f" strokeWidth="2.5" opacity="0.7" strokeLinecap="round" />
                  </g>
                )}

                {/* === STAGE 2: Medium Tree / Pohon Muda === */}
                {growthLevel >= 2 && (
                  <g className={styles.medTreeGrowAnim}>
                    {/* Organic trunk */}
                    <path d="M 188,370 Q 185,320 187,260 Q 190,240 195,230 L 205,230 Q 210,240 213,260 Q 215,320 212,370 Z"
                      fill="url(#barkGrad)" />
                    {/* Bark texture lines */}
                    <path d="M 195,370 Q 194,340 196,300" fill="none" stroke="#5c3310" strokeWidth="1.5" opacity="0.5" />
                    <path d="M 203,370 Q 205,335 204,290" fill="none" stroke="#5c3310" strokeWidth="1" opacity="0.4" />
                    {/* Left branch */}
                    <path d="M 195,260 Q 160,240 120,220" fill="none" stroke="#78350f" strokeWidth="8" strokeLinecap="round" />
                    <path d="M 145,235 Q 125,225 110,230" fill="none" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
                    {/* Right branch */}
                    <path d="M 205,260 Q 240,240 280,220" fill="none" stroke="#78350f" strokeWidth="8" strokeLinecap="round" />
                    <path d="M 255,235 Q 275,225 290,230" fill="none" stroke="#78350f" strokeWidth="4" strokeLinecap="round" />
                    {/* Left canopy */}
                    <circle cx="100" cy="210" r="35" fill="#16a34a" />
                    <circle cx="120" cy="195" r="30" fill="#22c55e" />
                    <circle cx="80" cy="225" r="28" fill="#15803d" />
                    <circle cx="135" cy="215" r="22" fill="#4ade80" opacity="0.8" />
                    {/* Right canopy */}
                    <circle cx="300" cy="210" r="35" fill="#16a34a" />
                    <circle cx="280" cy="195" r="30" fill="#22c55e" />
                    <circle cx="320" cy="225" r="28" fill="#15803d" />
                    <circle cx="265" cy="215" r="22" fill="#4ade80" opacity="0.8" />
                    {/* Top crown */}
                    <circle cx="200" cy="220" r="32" fill="#22c55e" />
                    <circle cx="200" cy="200" r="26" fill="#4ade80" opacity="0.7" />
                    {/* Visible roots */}
                    <path d="M 188,370 Q 155,385 120,390" fill="none" stroke="#78350f" strokeWidth="5" strokeLinecap="round" />
                    <path d="M 212,370 Q 245,385 280,390" fill="none" stroke="#78350f" strokeWidth="5" strokeLinecap="round" />
                    <path d="M 200,372 Q 200,388 200,395" fill="none" stroke="#78350f" strokeWidth="3" strokeLinecap="round" />
                  </g>
                )}

                {/* === STAGE 3: Full Giant Tree === */}
                {growthLevel >= 3 && (
                  <g className={styles.fullTreeGrowAnim}>
                    {/* Massive organic trunk */}
                    <path d="M 180,375 Q 175,310 178,200 Q 182,170 190,150 L 210,150 Q 218,170 222,200 Q 225,310 220,375 Z"
                      fill="url(#barkGrad)" />
                    {/* Bark detail */}
                    <path d="M 192,370 Q 190,300 193,200" fill="none" stroke="#5c3310" strokeWidth="2" opacity="0.4" />
                    <path d="M 206,370 Q 208,310 205,210" fill="none" stroke="#5c3310" strokeWidth="1.5" opacity="0.35" />
                    <path d="M 199,370 Q 200,320 200,240" fill="none" stroke="#4a2c0a" strokeWidth="1" opacity="0.3" />
                    {/* === Major Branches === */}
                    <path d="M 190,190 Q 140,160 70,130" fill="none" stroke="#713f12" strokeWidth="10" strokeLinecap="round" />
                    <path d="M 210,190 Q 260,160 330,130" fill="none" stroke="#713f12" strokeWidth="10" strokeLinecap="round" />
                    <path d="M 200,170 Q 200,120 200,80" fill="none" stroke="#713f12" strokeWidth="9" strokeLinecap="round" />
                    {/* Sub branches */}
                    <path d="M 130,160 Q 100,145 80,155" fill="none" stroke="#713f12" strokeWidth="5" strokeLinecap="round" />
                    <path d="M 270,160 Q 300,145 320,155" fill="none" stroke="#713f12" strokeWidth="5" strokeLinecap="round" />
                    <path d="M 200,120 Q 170,100 150,95" fill="none" stroke="#713f12" strokeWidth="4" strokeLinecap="round" />
                    <path d="M 200,120 Q 230,100 250,95" fill="none" stroke="#713f12" strokeWidth="4" strokeLinecap="round" />
                    <path d="M 95,145 Q 75,130 55,140" fill="none" stroke="#713f12" strokeWidth="3" strokeLinecap="round" />
                    <path d="M 305,145 Q 325,130 345,140" fill="none" stroke="#713f12" strokeWidth="3" strokeLinecap="round" />

                    {/* === Mega Canopy Crown === */}
                    {/* Back layer (darker) */}
                    <circle cx="200" cy="70" r="55" fill="#15803d" />
                    <circle cx="130" cy="100" r="45" fill="#166534" />
                    <circle cx="270" cy="100" r="45" fill="#166534" />
                    <circle cx="60" cy="130" r="40" fill="#14532d" />
                    <circle cx="340" cy="130" r="40" fill="#14532d" />
                    {/* Middle layer */}
                    <circle cx="200" cy="60" r="50" fill="#16a34a" />
                    <circle cx="140" cy="85" r="40" fill="#22c55e" />
                    <circle cx="260" cy="85" r="40" fill="#22c55e" />
                    <circle cx="80" cy="120" r="38" fill="#16a34a" />
                    <circle cx="320" cy="120" r="38" fill="#16a34a" />
                    {/* Front layer (lighter) */}
                    <circle cx="200" cy="50" r="40" fill="#4ade80" opacity="0.75" />
                    <circle cx="150" cy="70" r="32" fill="#86efac" opacity="0.5" />
                    <circle cx="250" cy="70" r="32" fill="#86efac" opacity="0.5" />
                    <circle cx="105" cy="105" r="28" fill="#4ade80" opacity="0.6" />
                    <circle cx="295" cy="105" r="28" fill="#4ade80" opacity="0.6" />
                    {/* Highlight top */}
                    <circle cx="200" cy="35" r="28" fill="#bbf7d0" opacity="0.4" />
                    <circle cx="175" cy="45" r="18" fill="#dcfce7" opacity="0.3" />

                    {/* === Flowers with petals 🌸 === */}
                    {/* Flower 1: Pink */}
                    {[0, 72, 144, 216, 288].map((angle, i) => (
                      <ellipse key={`f1-${i}`} cx={115 + Math.cos(angle * Math.PI / 180) * 8}
                        cy={65 + Math.sin(angle * Math.PI / 180) * 8}
                        rx="5" ry="3" fill="#f9a8d4"
                        transform={`rotate(${angle} ${115 + Math.cos(angle * Math.PI / 180) * 8} ${65 + Math.sin(angle * Math.PI / 180) * 8})`} />
                    ))}
                    <circle cx="115" cy="65" r="4" fill="#fbbf24" />

                    {/* Flower 2: Purple */}
                    {[0, 72, 144, 216, 288].map((angle, i) => (
                      <ellipse key={`f2-${i}`} cx={280 + Math.cos(angle * Math.PI / 180) * 7}
                        cy={78 + Math.sin(angle * Math.PI / 180) * 7}
                        rx="4.5" ry="2.5" fill="#c4b5fd"
                        transform={`rotate(${angle} ${280 + Math.cos(angle * Math.PI / 180) * 7} ${78 + Math.sin(angle * Math.PI / 180) * 7})`} />
                    ))}
                    <circle cx="280" cy="78" r="3.5" fill="#fbbf24" />

                    {/* Flower 3: Orange */}
                    {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                      <ellipse key={`f3-${i}`} cx={70 + Math.cos(angle * Math.PI / 180) * 6}
                        cy={120 + Math.sin(angle * Math.PI / 180) * 6}
                        rx="4" ry="2" fill="#fdba74"
                        transform={`rotate(${angle} ${70 + Math.cos(angle * Math.PI / 180) * 6} ${120 + Math.sin(angle * Math.PI / 180) * 6})`} />
                    ))}
                    <circle cx="70" cy="120" r="3" fill="#fbbf24" />

                    {/* Flower 4: White */}
                    {[0, 72, 144, 216, 288].map((angle, i) => (
                      <ellipse key={`f4-${i}`} cx={200 + Math.cos(angle * Math.PI / 180) * 6}
                        cy={35 + Math.sin(angle * Math.PI / 180) * 6}
                        rx="4" ry="2.5" fill="#fff"
                        transform={`rotate(${angle} ${200 + Math.cos(angle * Math.PI / 180) * 6} ${35 + Math.sin(angle * Math.PI / 180) * 6})`} />
                    ))}
                    <circle cx="200" cy="35" r="3" fill="#fbbf24" />

                    {/* === Fruits 🍎🍊🍋 === */}
                    {/* Apple - red */}
                    <circle cx="90" cy="140" r="10" fill="#ef4444" stroke="#dc2626" strokeWidth="1.5" />
                    <path d="M 90,130 Q 92,124 96,122" fill="none" stroke="#15803d" strokeWidth="2" strokeLinecap="round" />
                    <ellipse cx="92" cy="121" rx="3" ry="2" fill="#22c55e" transform="rotate(30 92 121)" />
                    {/* Orange */}
                    <circle cx="310" cy="140" r="10" fill="#f97316" stroke="#ea580c" strokeWidth="1.5" />
                    <path d="M 310,130 Q 308,124 304,122" fill="none" stroke="#15803d" strokeWidth="2" strokeLinecap="round" />
                    <ellipse cx="303" cy="121" rx="3" ry="2" fill="#22c55e" transform="rotate(-30 303 121)" />
                    {/* Lemon - yellow top */}
                    <ellipse cx="195" cy="28" rx="8" ry="10" fill="#facc15" stroke="#eab308" strokeWidth="1.5" />
                    <path d="M 195,18 Q 197,12 200,10" fill="none" stroke="#15803d" strokeWidth="2" strokeLinecap="round" />
                    <ellipse cx="201" cy="10" rx="3" ry="2" fill="#22c55e" transform="rotate(20 201 10)" />
                    {/* Mango - left */}
                    <ellipse cx="55" cy="135" rx="9" ry="7" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1.5" transform="rotate(-10 55 135)" />

                    {/* === Glowing Chloroplast Dots === */}
                    {[
                      [160, 60], [240, 60], [200, 45], [120, 90], [280, 90],
                      [90, 115], [310, 115], [175, 80], [225, 80]
                    ].map(([cx, cy], i) => (
                      <circle key={`chloro-${i}`} cx={cx} cy={cy} r={3 + (i % 2)} fill="#fef08a" opacity={0.7 + (i % 3) * 0.1} />
                    ))}

                    {/* === Strong Roots === */}
                    <path d="M 180,375 Q 135,390 90,398" fill="none" stroke="#78350f" strokeWidth="7" strokeLinecap="round" />
                    <path d="M 220,375 Q 265,390 310,398" fill="none" stroke="#78350f" strokeWidth="7" strokeLinecap="round" />
                    <path d="M 200,377 Q 200,392 200,400" fill="none" stroke="#78350f" strokeWidth="5" strokeLinecap="round" />
                    <path d="M 185,377 Q 160,388 140,398" fill="none" stroke="#6b3a10" strokeWidth="4" strokeLinecap="round" />
                    <path d="M 215,377 Q 240,388 260,398" fill="none" stroke="#6b3a10" strokeWidth="4" strokeLinecap="round" />

                    {/* === Small mushrooms at base === */}
                    <ellipse cx="130" cy="385" rx="6" ry="3" fill="#fda4af" />
                    <rect x="129" y="385" width="3" height="6" rx="1" fill="#e5e7eb" />
                    <ellipse cx="270" cy="388" rx="5" ry="2.5" fill="#fdba74" />
                    <rect x="269" y="388" width="3" height="5" rx="1" fill="#e5e7eb" />

                    {/* === O₂ Bubbles === */}
                    <circle cx="45" cy="100" r="7" fill="none" stroke="#67e8f9" strokeWidth="1.5" opacity="0.8" className={styles.oxygenBubble} />
                    <circle cx="355" cy="100" r="6" fill="none" stroke="#67e8f9" strokeWidth="1.5" opacity="0.7" className={styles.oxygenBubble} style={{ animationDelay: '1s' }} />
                    <circle cx="200" cy="15" r="5" fill="none" stroke="#67e8f9" strokeWidth="1.5" opacity="0.6" className={styles.oxygenBubble} style={{ animationDelay: '2s' }} />
                    <circle cx="130" cy="50" r="4" fill="none" stroke="#a5f3fc" strokeWidth="1" opacity="0.5" className={styles.oxygenBubble} style={{ animationDelay: '0.5s' }} />
                    <circle cx="270" cy="50" r="4" fill="none" stroke="#a5f3fc" strokeWidth="1" opacity="0.5" className={styles.oxygenBubble} style={{ animationDelay: '1.5s' }} />

                    {/* === Butterfly === */}
                    <g transform="translate(50, 80)" className={styles.oxygenBubble} style={{ animationDelay: '0.8s' }}>
                      <ellipse cx="0" cy="0" rx="6" ry="4" fill="#c084fc" opacity="0.8" transform="rotate(-30)" />
                      <ellipse cx="0" cy="0" rx="6" ry="4" fill="#e879f9" opacity="0.8" transform="rotate(30)" />
                      <rect x="-0.5" y="-3" width="1" height="6" rx="0.5" fill="#1e1b4b" />
                    </g>
                  </g>
                )}
              </svg>

              {/* Growth Stage Label */}
              <div className={styles.treeGrowthLabel}>
                <span>{growthLabel}</span>
              </div>

              {/* Organelle Callouts for Stage 2 */}
              {activeStage === 2 && (
                <>
                  {currentQuiz?.targetOrganelle === 'klorofil' && (
                    <div className={`${styles.organelleMarker} ${styles.klorofilMarker}`}>
                      <span>🌿</span>
                      <span>Klorofil (Penyerap Cahaya)</span>
                    </div>
                  )}
                  {currentQuiz?.targetOrganelle === 'stomata' && (
                    <div className={`${styles.organelleMarker} ${styles.stomataMarker}`}>
                      <span>👄</span>
                      <span>Stomata (Mulut Daun CO₂)</span>
                    </div>
                  )}
                  {currentQuiz?.targetOrganelle === 'xilem' && (
                    <div className={`${styles.organelleMarker} ${styles.xilemMarker}`}>
                      <span>💧</span>
                      <span>Pembuluh Xilem (Pipa Air)</span>
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })()}

        {/* Stage 1: Reactant Slots below tree */}
        {activeStage === 1 && (
          <div className={styles.reactantsRow}>
            {/* Slot 1: Sunlight */}
            <div className={`${styles.reactantSlot} ${collectedReactants.includes('sunlight') ? styles.reactantSlotFilled : ''}`}>
              <div className={styles.reactantIconBox}>
                {collectedReactants.includes('sunlight') ? '☀️' : '⚪'}
              </div>
              <span className={styles.reactantLabel}>Cahaya Surya</span>
              <span className={styles.reactantFormula}>Energi Foton</span>
            </div>

            {/* Slot 2: Water */}
            <div className={`${styles.reactantSlot} ${collectedReactants.includes('water') ? styles.reactantSlotFilled : ''}`}>
              <div className={styles.reactantIconBox}>
                {collectedReactants.includes('water') ? '💧' : '⚪'}
              </div>
              <span className={styles.reactantLabel}>Air Tanah</span>
              <span className={styles.reactantFormula}>H₂O</span>
            </div>

            {/* Slot 3: Carbon Dioxide */}
            <div className={`${styles.reactantSlot} ${collectedReactants.includes('co2') ? styles.reactantSlotFilled : ''}`}>
              <div className={styles.reactantIconBox}>
                {collectedReactants.includes('co2') ? '💨' : '⚪'}
              </div>
              <span className={styles.reactantLabel}>Karbon Dioksida</span>
              <span className={styles.reactantFormula}>CO₂</span>
            </div>
          </div>
        )}

        {/* Stage 3: Harvest Counter Banner inside canvas */}
        {activeStage === 3 && (
          <div style={{ display: 'flex', gap: '16px', zIndex: 5, color: '#ecfdf5', fontSize: '12px', fontWeight: 800 }}>
            <span>🍯 Glukosa Tersimpan: {energyStoredCount}</span>
            <span>•</span>
            <span>🌬️ Oksigen Terlepas: {airReleasedCount}</span>
          </div>
        )}
      </section>

      {/* 5. Feedback Toast Banner */}
      {feedback && (
        <div
          className={`${styles.feedbackToast} ${
            feedback.type === 'correct' ? styles.feedbackCorrect : styles.feedbackWrong
          }`}
        >
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
            {feedback.type === 'correct' ? 'check_circle' : 'warning'}
          </span>
          <span>{feedback.text}</span>
        </div>
      )}

      {/* 6. Interactive Challenge Area per Stage */}

      {/* STAGE 1: Gathering 3 Reactants */}
      {activeStage === 1 && (
        <main className={styles.challengeCard}>
          <div className={styles.challengeHeader}>
            <div className={styles.promptIcon}>🌿</div>
            <div className={styles.promptTextGroup}>
              <span className={styles.promptCategory}>Tantangan 1 / 3: Bahan Masuk</span>
              <h3 className={styles.promptTitle}>
                Pilih 3 bahan alami yang dibutuhkan daun untuk memasak fotosintesis:
              </h3>
            </div>
          </div>

          <div className={styles.elementsGrid}>
            {STAGE_1_ELEMENTS.map((elem) => {
              const isCollected = collectedReactants.includes(elem.id);
              const isWrong = wrongElementId === elem.id;

              return (
                <button
                  key={elem.id}
                  type="button"
                  onClick={() => handleSelectElement(elem)}
                  disabled={isCollected}
                  className={`${styles.elementBtn} ${
                    isCollected ? styles.elementBtnCollected : ''
                  } ${isWrong ? styles.elementBtnWrong : ''}`}
                >
                  <span className={styles.elementEmoji}>{elem.emoji}</span>
                  <div className={styles.elementTextGroup}>
                    <span className={styles.elementName}>{elem.name}</span>
                    <span className={styles.elementSub}>{isCollected ? '✓ Terserap' : elem.sub}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </main>
      )}

      {/* STAGE 2: Leaf Machinery Quiz */}
      {activeStage === 2 && currentQuiz && (
        <main className={styles.challengeCard}>
          <div className={styles.challengeHeader}>
            <div className={styles.promptIcon}>🔬</div>
            <div className={styles.promptTextGroup}>
              <span className={styles.promptCategory}>
                Tantangan 2 / 3: Dapur Daun • Pertanyaan {quizIndex + 1} dari {STAGE_2_QUIZ.length}
              </span>
              <h3 className={styles.promptTitle}>{currentQuiz.prompt}</h3>
            </div>
          </div>

          <div className={styles.quizOptionsStack}>
            {currentQuiz.options.map((opt) => {
              const isSelected = selectedQuizOption === opt.id;
              const isWrong = wrongQuizOptions.includes(opt.id);

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectQuizOption(opt)}
                  disabled={selectedQuizOption !== null || isWrong}
                  className={`${styles.quizOptionBtn} ${
                    isSelected ? styles.quizOptionBtnCorrect : ''
                  } ${isWrong ? styles.quizOptionBtnWrong : ''}`}
                >
                  <span className={styles.quizBadge}>{opt.id.toUpperCase()}</span>
                  <span className={styles.quizText}>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </main>
      )}

      {/* STAGE 3: Harvest Sorting */}
      {activeStage === 3 && (
        <main className={styles.challengeCard}>
          <div className={styles.challengeHeader}>
            <div className={styles.promptIcon}>🍯</div>
            <div className={styles.promptTextGroup}>
              <span className={styles.promptCategory}>Tantangan 3 / 3: Panen Energi & Udara</span>
              <h3 className={styles.promptTitle}>
                Salurkan produk hasil fotosintesis ke tempat yang tepat!
              </h3>
            </div>
          </div>

          {currentHarvestItem ? (
            <div className={styles.harvestQueue}>
              <div className={styles.harvestItemCard}>
                <div className={styles.harvestItemLeft}>
                  <span style={{ fontSize: '32px' }}>{currentHarvestItem.emoji}</span>
                  <div>
                    <h4 style={{ margin: '0 0 2px', fontSize: '15px', fontWeight: 800, color: '#064e3b' }}>
                      {currentHarvestItem.name} ({currentHarvestItem.formula})
                    </h4>
                    <span style={{ fontSize: '11.5px', color: '#4b5563' }}>
                      {currentHarvestItem.desc}
                    </span>
                  </div>
                </div>

                <div className={styles.harvestActions}>
                  <button
                    type="button"
                    className={`${styles.dispatchBtn} ${styles.dispatchGlucoseBtn}`}
                    onClick={() => handleDispatchHarvest('energy')}
                  >
                    <span>Simpan ke Lumbung</span>
                    <span>🍯</span>
                  </button>
                  <button
                    type="button"
                    className={`${styles.dispatchBtn} ${styles.dispatchOxygenBtn}`}
                    onClick={() => handleDispatchHarvest('air')}
                  >
                    <span>Lepas ke Udara</span>
                    <span>🌬️</span>
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '12px', color: '#047857', fontWeight: 800 }}>
              🎉 Seluruh hasil fotosintesis telah berhasil dipanen!
            </div>
          )}

          {/* 2 Target Bins */}
          <div className={styles.harvestBinsRow}>
            <div className={`${styles.harvestBin} ${currentHarvestItem?.target === 'energy' ? styles.harvestBinActive : ''}`}>
              <div className={styles.binIconWrap}>🍯</div>
              <span className={styles.binTitle}>Lumbung Energi Tumbuhan</span>
              <span className={styles.binCounter}>{energyStoredCount} Glukosa Tersimpan</span>
            </div>

            <div className={`${styles.harvestBin} ${currentHarvestItem?.target === 'air' ? styles.harvestBinActive : ''}`}>
              <div className={styles.binIconWrap}>🌬️</div>
              <span className={styles.binTitle}>Atmosfer Udara Bersih</span>
              <span className={styles.binCounter}>{airReleasedCount} Oksigen Terlepas</span>
            </div>
          </div>
        </main>
      )}

      {/* 7. Grand Victory Modal */}
      {showVictory && (
        <div className={styles.victoryOverlay}>
          <div className={styles.victoryCard}>
            <div className={styles.victoryBadgeGlow}>🌿</div>

            <h2 className={styles.victoryTitle}>Misteri Fotosintesis Terpecahkan!</h2>

            <p className={styles.victorySummary}>
              Hebat sekali, Penjelajah {currentCharacter?.name || 'Raka'}! Pohon Purba Hutan Sains kini kembali bugar dan berbuah lebat karena kamu berhasil menyatukan formula fotosintesis.
            </p>

            {/* Formula Summary Box */}
            <div className={styles.formulaBox}>
              <span className={styles.formulaTitle}>Rumus Kimia Fotosintesis Alami</span>
              <span className={styles.formulaMath}>
                6CO₂ (Karbon Dioksida) + 6H₂O (Air) + ☀️ Cahaya ➔ C₆H₁₂O₆ (Glukosa) + 6O₂ (Oksigen)
              </span>
            </div>

            {/* Rewards Won */}
            <div className={styles.rewardsRow}>
              <div className={styles.rewardPill}>
                <span>⚡</span>
                <span>+140 XP Sains</span>
              </div>
              <div className={styles.rewardPill}>
                <span>🪙</span>
                <span>+45 Koin</span>
              </div>
              <div className={styles.rewardPill}>
                <span>🎴</span>
                <span>Kartu Dapur Daun</span>
              </div>
              <div className={styles.rewardPill}>
                <span>🏅</span>
                <span>Ahli Botani Rimba</span>
              </div>
            </div>

            <button
              type="button"
              className={styles.victoryFinishBtn}
              onClick={handleFinishGame}
            >
              <span>Klaim Hadiah & Buka Penemuan 🏆</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
