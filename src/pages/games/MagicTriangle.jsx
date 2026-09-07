import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMiniGameEngine } from '../../hooks/useMiniGameEngine';
import { useGame } from '../../context/GameContext';
import { useAudio } from '../../context/AudioContext';
import { getCharacterById } from '../../data/characters';
import styles from './MagicTriangle.module.css';

const TRIANGLE_QUESTIONS = [
  {
    id: 1,
    subPrompt: 'Tantangan Segitiga Ajaib 01',
    prompt: 'Lengkapi kristal puncak agar jumlah sisi segitiga sama dengan 9!',
    mathFormula: '2 + 4 + ? = 9',
    hint: 'Sisi kiri: 2 + 4 = 6. Agar berjumlah 9, kamu butuh: 9 - 6 = 3!',
    targetSum: '9',
    nodeTop: '?',
    nodeLeft: '2',
    nodeRight: '1',
    nodeBottomLeft: '4',
    nodeBottomRight: '5',
    nodeBottomCenter: '3',
    options: [
      { id: 'a', label: 'Kristal Ruby', val: 2, color: '#f43f5e', isCorrect: false },
      { id: 'b', label: 'Kristal Ametis', val: 3, color: '#a855f7', isCorrect: true },
      { id: 'c', label: 'Kristal Safir', val: 5, color: '#0ea5e9', isCorrect: false },
      { id: 'd', label: 'Kristal Zamrud', val: 7, color: '#10b981', isCorrect: false }
    ]
  },
  {
    id: 2,
    subPrompt: 'Tantangan Segitiga Ajaib 02',
    prompt: 'Cari sudut kristal ketiga agar total sudut segitiga berjumlah 180°!',
    mathFormula: '60° + 70° + ? = 180°',
    hint: 'Jumlah seluruh sudut segitiga selalu 180°. Jumlahkan 60° + 70° = 130°, lalu cari selisihnya: 180° - 130° = 50°!',
    targetSum: '180°',
    nodeTop: '60°',
    nodeLeft: '70°',
    nodeRight: '?',
    nodeBottomLeft: 'α',
    nodeBottomRight: 'β',
    nodeBottomCenter: 'γ',
    options: [
      { id: 'a', label: 'Kristal Safir', val: '40°', color: '#0ea5e9', isCorrect: false },
      { id: 'b', label: 'Kristal Zamrud', val: '50°', color: '#10b981', isCorrect: true },
      { id: 'c', label: 'Kristal Topas', val: '60°', color: '#f59e0b', isCorrect: false },
      { id: 'd', label: 'Kristal Ametis', val: '80°', color: '#a855f7', isCorrect: false }
    ]
  },
  {
    id: 3,
    subPrompt: 'Tantangan Segitiga Ajaib 03',
    prompt: 'Hitung keliling jembatan kristal segitiga (Sisi A=15, B=20, C=25)!',
    mathFormula: '15 + 20 + 25 = ?',
    hint: 'Keliling segitiga adalah penjumlahan dari ketiga sisinya: 15 + 20 = 35, lalu 35 + 25 = 60!',
    targetSum: 'Keliling',
    nodeTop: '15 m',
    nodeLeft: '20 m',
    nodeRight: '25 m',
    nodeBottomLeft: 'A',
    nodeBottomRight: 'B',
    nodeBottomCenter: 'C',
    options: [
      { id: 'a', label: 'Kristal Topas', val: '55 m', color: '#f59e0b', isCorrect: false },
      { id: 'b', label: 'Kristal Safir', val: '60 m', color: '#0ea5e9', isCorrect: true },
      { id: 'c', label: 'Kristal Ametis', val: '65 m', color: '#a855f7', isCorrect: false },
      { id: 'd', label: 'Kristal Ruby', val: '70 m', color: '#f43f5e', isCorrect: false }
    ]
  }
];

export default function MagicTriangle({ onGameComplete = null, questId: propQuestId }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const targetQuestId = propQuestId || searchParams.get('questId') || 'quest-la-geom';
  const { completeQuest, characterConfig } = useGame();
  const { playSfx } = useAudio();

  const [wrongAttempts, setWrongAttempts] = useState([]);
  const [popupData, setPopupData] = useState(null);

  // Active explorer character
  const activeAvatarId = characterConfig?.avatar || 'raka_explorer';
  const currentCharacter = getCharacterById(activeAvatarId);

  const engine = useMiniGameEngine({
    totalQuestions: TRIANGLE_QUESTIONS.length,
    onFinish: ({ finalScore }) => {
      completeQuest(targetQuestId, finalScore, 160, 50, 'card-triangle', 'hat-classic');
      if (onGameComplete) {
        onGameComplete();
      } else {
        navigate(`/quest/${targetQuestId}/result`);
      }
    }
  });

  const currentQ = TRIANGLE_QUESTIONS[engine.currentQuestionIndex] || TRIANGLE_QUESTIONS[0];
  const isLastQuestion = engine.currentQuestionIndex + 1 >= TRIANGLE_QUESTIONS.length;

  function handleSelect(opt) {
    if (engine.isAnswerCorrect === true || popupData !== null) return;
    if (wrongAttempts.includes(opt.id)) return;

    if (opt.isCorrect) {
      if (playSfx) playSfx('correct');
      engine.setSelectedAnswer(opt.id);
      engine.submitAnswer(true, `✨ Kristal ${opt.val} tepat! Jembatan kristal segitiga bersinar sempurna!`);
      setPopupData({
        type: 'correct',
        title: isLastQuestion
          ? 'Misi Segitiga Selesai! 🎉'
          : 'Kristal Segitiga Tepat! ✨',
        message: `Pilihan ${opt.label} bernilai ${opt.val} tepat! Sisi jembatan kristal segitiga bersinar sempurna.`,
        buttonText: isLastQuestion
          ? 'Selesaikan Misi & Ambil Hadiah'
          : 'Lanjut ke Tantangan Berikutnya'
      });
    } else {
      if (playSfx) playSfx('wrong');
      setWrongAttempts((prev) => [...prev, opt.id]);
      setPopupData({
        type: 'wrong',
        title: 'Belum Pas! ⚠️',
        message: `Kristal bernilai ${opt.val} belum pas dengan getaran segitiga. ${currentQ.hint}`,
        buttonText: 'Coba Pilih Kristal Lain'
      });
    }
  }

  function handleNext() {
    if (playSfx) playSfx('button-click');
    setPopupData(null);
    setWrongAttempts([]);
    engine.nextQuestion();
  }

  function handleRetry() {
    if (playSfx) playSfx('button-click');
    setPopupData(null);
  }

  function handleReset() {
    if (playSfx) playSfx('button-hover');
    setPopupData(null);
    setWrongAttempts([]);
    engine.resetGame();
  }

  return (
    <div className={styles.container}>
      {/* 1. Sub-header info bar */}
      <section className={styles.subHeaderBar}>
        <div className={styles.missionBadge}>
          <span className="material-symbols-outlined" style={{ color: '#7c3aed', fontSize: '18px' }}>
            change_history
          </span>
          <span className={styles.missionBadgeText}>Lembah Angka</span>
          <span style={{ color: '#cbd5e1' }}>•</span>
          <span className={styles.missionBadgeHighlight}>Misi 03 (Penjumlahan Segitiga Ajaib)</span>
        </div>

        <div className={styles.scoreBadge}>
          <span className="material-symbols-outlined" style={{ color: '#7c3aed', fontSize: '18px' }}>
            local_fire_department
          </span>
          <span className={styles.scoreBadgeText}>
            Skor: <span className={styles.scoreValue}>{engine.score}</span>
          </span>
        </div>
      </section>

      {/* 2. Challenge Formula Banner */}
      <div className={styles.challengeBanner}>
        <div className={styles.bannerLeft}>
          <div className={styles.bannerIconWrap}>
            <span className="material-symbols-outlined" style={{ fontSize: '26px' }}>
              diamond
            </span>
          </div>
          <div>
            <p className={styles.bannerPretitle}>{currentQ.subPrompt}</p>
            <h3 className={styles.bannerTitle}>{currentQ.prompt}</h3>
          </div>
        </div>
        <div className={styles.mathFormulaBadge}>
          {currentQ.mathFormula}
        </div>
      </div>

      {/* 3. The 3D Mystic Crystal Cavern Arena */}
      <div className={styles.cavernArena}>
        <div className={styles.cavernStars} />

        {/* Top HUD */}
        <div className={styles.arenaTopHud}>
          <div className={styles.explorerBadge}>
            <div className={styles.explorerAvatar}>
              <img src={currentCharacter.image} alt={currentCharacter.name} />
            </div>
            <span className={styles.explorerName}>{currentCharacter.name}</span>
          </div>

          <div className={styles.stepIndicatorBadge}>
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
              auto_awesome
            </span>
            <span>Segitiga {engine.questionNumber} dari 3</span>
          </div>
        </div>

        {/* 4. The 3D Glowing Magic Triangle Altar */}
        <div className={styles.altarStage3D}>
          <svg viewBox="0 0 320 260" className={styles.triangleSvgGraphic}>
            <defs>
              {/* Magic Beam Gradients */}
              <linearGradient id="magicBeamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="50%" stopColor="#a855f7" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>

              {/* Crystal Glow Filter */}
              <filter id="crystalGlow" x="-30%" y="-30%" width="160%" height="160%">
                <feGaussianBlur stdDeviation="4" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Base Pedestal Platform with 3D Depth */}
            <polygon
              points="160,240 40,240 280,240"
              fill="#0f172a"
              opacity="0.6"
            />

            {/* Glowing Energy Beams connecting triangle vertices */}
            <polygon
              points="160,35 45,215 275,215"
              fill="rgba(129, 140, 248, 0.08)"
              stroke="url(#magicBeamGrad)"
              strokeWidth="4.5"
              strokeLinejoin="round"
              filter="url(#crystalGlow)"
            />

            {/* Inner dashed rune lines */}
            <polygon
              points="160,55 65,200 255,200"
              fill="none"
              stroke="rgba(255, 255, 255, 0.35)"
              strokeWidth="1.5"
              strokeDasharray="6 4"
            />

            {/* 3 Corner Crystal Nodes */}
            {/* Top Node */}
            <g transform="translate(160, 35)">
              <circle r="22" fill="#312e81" stroke="#818cf8" strokeWidth="2.5" />
              <polygon points="0,-14 10,0 0,14 -10,0" fill="#a855f7" filter="url(#crystalGlow)" />
              <text y="5" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="900">
                {engine.isAnswerCorrect ? (currentQ.id === 1 ? '3' : currentQ.nodeTop) : currentQ.nodeTop}
              </text>
            </g>

            {/* Bottom-Left Node */}
            <g transform="translate(45, 215)">
              <circle r="22" fill="#312e81" stroke="#818cf8" strokeWidth="2.5" />
              <polygon points="0,-14 10,0 0,14 -10,0" fill="#38bdf8" filter="url(#crystalGlow)" />
              <text y="5" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="900">
                {currentQ.nodeBottomLeft}
              </text>
            </g>

            {/* Bottom-Right Node */}
            <g transform="translate(275, 215)">
              <circle r="22" fill="#312e81" stroke="#818cf8" strokeWidth="2.5" />
              <polygon points="0,-14 10,0 0,14 -10,0" fill="#ec4899" filter="url(#crystalGlow)" />
              <text y="5" textAnchor="middle" fill="#ffffff" fontSize="13" fontWeight="900">
                {engine.isAnswerCorrect && currentQ.id === 2 ? '50°' : currentQ.nodeRight}
              </text>
            </g>

            {/* 3 Mid-Edge Crystal Nodes */}
            {/* Left Mid Node */}
            <g transform="translate(102, 125)">
              <circle r="16" fill="#1e1b4b" stroke="#6366f1" strokeWidth="2" />
              <text y="4" textAnchor="middle" fill="#c4b5fd" fontSize="11" fontWeight="800">
                {currentQ.nodeLeft}
              </text>
            </g>

            {/* Right Mid Node */}
            <g transform="translate(218, 125)">
              <circle r="16" fill="#1e1b4b" stroke="#6366f1" strokeWidth="2" />
              <text y="4" textAnchor="middle" fill="#c4b5fd" fontSize="11" fontWeight="800">
                {currentQ.nodeRight}
              </text>
            </g>

            {/* Bottom Mid Node */}
            <g transform="translate(160, 215)">
              <circle r="16" fill="#1e1b4b" stroke="#6366f1" strokeWidth="2" />
              <text y="4" textAnchor="middle" fill="#c4b5fd" fontSize="11" fontWeight="800">
                {currentQ.nodeBottomCenter}
              </text>
            </g>
          </svg>

          {/* Center Altar Rune Sphere */}
          <div className={styles.altarCenterRune}>
            <span className={styles.runeSumLabel}>Target Segitiga</span>
            <span className={styles.runeSumValue}>{currentQ.targetSum}</span>
          </div>
        </div>

        {/* Instruction line */}
        <div className={styles.instructionBar}>
          <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#a855f7' }}>
            diamond
          </span>
          <span>Pilih kristal ajaib di bawah ini untuk diletakkan ke slot segitiga:</span>
        </div>

        {/* 5. 4 Interactive 3D Gemstone Crystal Buttons */}
        <div className={styles.crystalGrid}>
          {currentQ.options.map((opt, optIndex) => {
            const isCorrectChoice = engine.selectedAnswer === opt.id && opt.isCorrect;
            const isWrongChoice = wrongAttempts.includes(opt.id);

            let statusClass = '';
            if (isCorrectChoice) statusClass = styles.crystalBtnCorrect;
            if (isWrongChoice) statusClass = styles.crystalBtnWrong;

            const isDisabled = engine.isAnswerCorrect === true || isWrongChoice;

            return (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleSelect(opt)}
                disabled={isDisabled}
                className={`${styles.crystalBtn} ${statusClass} ${styles[`crystalFloat${optIndex % 4}`]}`}
              >
                {/* 3D Gemstone Vector Crystal SVG */}
                <svg viewBox="0 0 280 140" className={styles.crystalSvg} preserveAspectRatio="xMidYMid meet">
                  <defs>
                    <radialGradient id={`gemGrad-${optIndex}`} cx="40%" cy="30%" r="65%">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
                      <stop offset="35%" stopColor={opt.color} />
                      <stop offset="75%" stopColor="#1e1b4b" />
                      <stop offset="100%" stopColor="#020617" />
                    </radialGradient>
                  </defs>

                  {/* Water/Altar Ground Glow */}
                  <ellipse cx="140" cy="115" rx="110" ry="20" fill="rgba(129, 140, 248, 0.15)" />

                  {/* 3D Gemstone Base Facets */}
                  <polygon points="40,70 140,125 240,70 140,20" fill={`url(#gemGrad-${optIndex})`} stroke={opt.color} strokeWidth="2.5" />
                  {/* Facet reflection lines */}
                  <polygon points="140,20 85,55 140,75 195,55" fill="rgba(255,255,255,0.3)" />
                  <polygon points="85,55 40,70 140,125 140,75" fill="rgba(0,0,0,0.35)" />
                  <polygon points="195,55 240,70 140,125 140,75" fill="rgba(0,0,0,0.5)" />
                  <line x1="140" y1="20" x2="140" y2="125" stroke="rgba(255,255,255,0.5)" strokeWidth="1.5" />
                </svg>

                {/* Plaque Label */}
                <div className={styles.crystalPlaque}>
                  <span>💎 {opt.label}</span>
                </div>

                {/* Chiseled Number inside Crystal */}
                <div className={styles.crystalNumberWrap}>
                  <span className={styles.crystalNumber}>{opt.val}</span>
                </div>

                {/* Badges on selection */}
                {isCorrectChoice && (
                  <div className={styles.correctBadge}>
                    <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>stars</span>
                    <span>Kristal Cocok!</span>
                  </div>
                )}

                {isWrongChoice && (
                  <div className={styles.wrongBadge}>
                    <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>warning</span>
                    <span>Getaran Salah!</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Bottom Progress Pill */}
        <div className={styles.bottomProgressPill}>
          <div className={styles.progressText}>
            <span className="material-symbols-outlined" style={{ color: '#818cf8', fontSize: '18px' }}>
              auto_awesome
            </span>
            <span>Jembatan Segitiga ke-{engine.questionNumber} dari 3 Tantangan</span>
          </div>
          <div className={styles.dotsRow}>
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                className={`${styles.dot} ${num <= engine.questionNumber ? styles.dotActive : styles.dotPending}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 6. Utility Row & Feedback / Next Buttons */}
      <section className={styles.utilityRow}>
        <button
          type="button"
          onClick={() => {
            if (playSfx) playSfx('hint');
            engine.setShowHint(!engine.showHint);
          }}
          className={styles.utilityBtn}
        >
          <span className="material-symbols-outlined" style={{ color: '#f59e0b', fontSize: '18px' }}>
            lightbulb
          </span>
          <span>Petunjuk Segitiga</span>
        </button>

        <button
          type="button"
          onClick={handleReset}
          className={styles.utilityBtn}
        >
          <span className="material-symbols-outlined" style={{ color: '#7c3aed', fontSize: '18px' }}>
            refresh
          </span>
          <span>Mulai Ulang</span>
        </button>
      </section>

      {/* Hint Accordion */}
      {engine.showHint && (
        <div className={styles.hintCard}>
          <span className="material-symbols-outlined" style={{ color: '#7c3aed', fontSize: '22px' }}>
            psychology_alt
          </span>
          <div style={{ flex: 1 }}>
            <p className={styles.hintTitle}>Rahasia Segitiga Ajaib:</p>
            <p className={styles.hintText}>{currentQ.hint}</p>
          </div>
          <button
            type="button"
            onClick={() => engine.setShowHint(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#4c1d95' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
          </button>
        </div>
      )}

      {/* Floating Bottom Action Popup (Popup Next) */}
      {popupData && (
        <div className={styles.nextPopupOverlay}>
          <div
            className={`${styles.nextPopupCard} ${
              popupData.type === 'correct' ? styles.popupCorrect : styles.popupWrong
            }`}
          >
            <div className={styles.popupHeaderRow}>
              <div
                className={
                  popupData.type === 'correct'
                    ? styles.popupIconWrapCorrect
                    : styles.popupIconWrapWrong
                }
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    color: popupData.type === 'correct' ? '#34d399' : '#f87171',
                    fontSize: '28px'
                  }}
                >
                  {popupData.type === 'correct' ? 'check_circle' : 'cancel'}
                </span>
              </div>
              <div>
                <h3
                  className={`${styles.popupTitle} ${
                    popupData.type === 'correct'
                      ? styles.popupTitleCorrect
                      : styles.popupTitleWrong
                  }`}
                >
                  {popupData.title}
                </h3>
              </div>
            </div>

            <p className={styles.popupMessage}>{popupData.message}</p>

            <div className={styles.popupActionRow}>
              {popupData.type === 'correct' ? (
                <button
                  type="button"
                  className={styles.popupNextBtn}
                  onClick={handleNext}
                  autoFocus
                >
                  <span>{popupData.buttonText}</span>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              ) : (
                <button
                  type="button"
                  className={styles.popupRetryBtn}
                  onClick={handleRetry}
                  autoFocus
                >
                  <span className="material-symbols-outlined">refresh</span>
                  <span>{popupData.buttonText}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
