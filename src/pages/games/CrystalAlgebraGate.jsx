import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMiniGameEngine } from '../../hooks/useMiniGameEngine';
import { useGame } from '../../context/GameContext';
import { useAudio } from '../../context/AudioContext';
import { getCharacterById } from '../../data/characters';
import styles from './CrystalAlgebraGate.module.css';

const BOSS_ALGEBRA_STAGES = [
  {
    id: 1,
    subPrompt: 'Segel Aljabar Lapisan 1',
    prompt: 'Seimbangkan energi gerbang untuk membuka segel kristal x!',
    equationStr: 'x + 15 = 40',
    leftVariable: 'x',
    leftOp: '+',
    leftConstant: '15',
    rightConstant: '40',
    coreVar: 'x',
    hint: 'Kedua sisi gerbang harus seimbang! Kurangkan 15 dari kedua sisi: x = 40 - 15 = 25.',
    options: [
      { id: 'a', label: 'Kristal Topas', val: 15, color: '#f59e0b', isCorrect: false },
      { id: 'b', label: 'Kristal Zamrud', val: 20, color: '#10b981', isCorrect: false },
      { id: 'c', label: 'Kristal Safir', val: 25, color: '#0ea5e9', isCorrect: true },
      { id: 'd', label: 'Kristal Ruby', val: 35, color: '#f43f5e', isCorrect: false }
    ]
  },
  {
    id: 2,
    subPrompt: 'Segel Aljabar Lapisan 2',
    prompt: 'Tiga kristal y ditambah 4 energi menahan 19 daya. Cari nilai y!',
    equationStr: '3y + 4 = 19',
    leftVariable: '3y',
    leftOp: '+',
    leftConstant: '4',
    rightConstant: '19',
    coreVar: 'y',
    hint: 'Langkah 1: Hilangkan 4 energi (19 - 4 = 15). Langkah 2: Bagi rata untuk 3 kristal (y = 15 ÷ 3 = 5)!',
    options: [
      { id: 'a', label: 'Kristal Ametis', val: 3, color: '#a855f7', isCorrect: false },
      { id: 'b', label: 'Kristal Zamrud', val: 5, color: '#10b981', isCorrect: true },
      { id: 'c', label: 'Kristal Topas', val: 7, color: '#f59e0b', isCorrect: false },
      { id: 'd', label: 'Kristal Safir', val: 8, color: '#0ea5e9', isCorrect: false }
    ]
  },
  {
    id: 3,
    subPrompt: 'Segel Inti Bos Lembah Angka',
    prompt: 'Pecahkan segel inti k untuk membuka pintu gerbang kuno sepenuhnya!',
    equationStr: '2k + 10 = 34',
    leftVariable: '2k',
    leftOp: '+',
    leftConstant: '10',
    rightConstant: '34',
    coreVar: 'k',
    hint: 'Segel Terakhir! Langkah 1: 34 - 10 = 24. Langkah 2: 2k = 24, maka k = 24 ÷ 2 = 12!',
    options: [
      { id: 'a', label: 'Kristal Safir', val: 10, color: '#0ea5e9', isCorrect: false },
      { id: 'b', label: 'Kristal Inti Ametis', val: 12, color: '#a855f7', isCorrect: true },
      { id: 'c', label: 'Kristal Topas', val: 14, color: '#f59e0b', isCorrect: false },
      { id: 'd', label: 'Kristal Ruby', val: 16, color: '#f43f5e', isCorrect: false }
    ]
  }
];

export default function CrystalAlgebraGate({ onGameComplete = null, questId: propQuestId }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const targetQuestId = propQuestId || searchParams.get('questId') || 'quest-la-boss';
  const { completeQuest, characterConfig } = useGame();
  const { playSfx } = useAudio();

  const [wrongAttempts, setWrongAttempts] = useState([]);
  const [isGateUnlocked, setIsGateUnlocked] = useState(false);
  const [showBossVictory, setShowBossVictory] = useState(false);
  const [popupData, setPopupData] = useState(null);

  // Active character
  const activeAvatarId = characterConfig?.avatar || 'raka_explorer';
  const currentCharacter = getCharacterById(activeAvatarId);

  const engine = useMiniGameEngine({
    totalQuestions: BOSS_ALGEBRA_STAGES.length,
    onFinish: ({ finalScore }) => {
      // Trigger gate doors open animation
      setIsGateUnlocked(true);
      if (playSfx) playSfx('achievement');

      // Complete boss quest with big rewards
      completeQuest(targetQuestId, finalScore, 300, 80, 'card-algebra', 'crown-crystal');

      // Show boss victory overlay after door swing
      setTimeout(() => {
        setShowBossVictory(true);
      }, 1200);
    }
  });

  const currentStage = BOSS_ALGEBRA_STAGES[engine.currentQuestionIndex] || BOSS_ALGEBRA_STAGES[0];
  const isLastQuestion = engine.currentQuestionIndex + 1 >= BOSS_ALGEBRA_STAGES.length;

  function handleSelect(opt) {
    // If already answered correctly, lock board
    if (engine.isAnswerCorrect === true || popupData !== null) return;
    // If already tried this wrong option, ignore
    if (wrongAttempts.includes(opt.id)) return;

    if (opt.isCorrect) {
      if (playSfx) playSfx('correct');
      engine.setSelectedAnswer(opt.id);
      engine.submitAnswer(
        true,
        `✨ Kristal ${opt.val} tepat! Aliran energi gerbang seimbang dan segel lapisan ${currentStage.id} pecah bersinar!`
      );
      setPopupData({
        type: 'correct',
        title: isLastQuestion
          ? 'Semua Segel Aljabar Terbuka! 🎉'
          : `Segel Lapisan ${currentStage.id} Terbuka! ✨`,
        message: `Kristal ${opt.label} bernilai ${opt.val} tepat! Persamaan ${currentStage.equationStr.replace(
          currentStage.coreVar,
          opt.val
        )} seimbang sempurna di kedua sisi altar gerbang.`,
        buttonText: isLastQuestion
          ? 'Buka Gerbang Utama & Klaim Hadiah'
          : 'Lanjut ke Segel Berikutnya'
      });
    } else {
      if (playSfx) playSfx('wrong');
      setWrongAttempts((prev) => [...prev, opt.id]);
      setPopupData({
        type: 'wrong',
        title: 'Energi Belum Seimbang! ⚠️',
        message: `Kristal bernilai ${opt.val} belum pas dengan aliran gerbang. ${currentStage.hint}`,
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

  function handleClaimVictory() {
    if (playSfx) playSfx('button-click');
    if (onGameComplete) {
      onGameComplete();
    } else {
      navigate(`/quest/${targetQuestId}/result`);
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.bgAura} />
      <div className={styles.ambientParticles} />

      {/* 1. Sub-Header Info Bar */}
      <header className={styles.subHeaderBar}>
        <div className={styles.bossBadge}>
          <span className={styles.bossTag}>TANTANGAN BOS</span>
          <span className={styles.bossBadgeText}>Lembah Angka</span>
          <span style={{ color: '#64748b' }}>•</span>
          <span className={styles.bossBadgeHighlight}>Gerbang Aljabar Kristal</span>
        </div>

        <div className={styles.scoreBadge}>
          <span className="material-symbols-outlined" style={{ color: '#fbbf24', fontSize: '18px' }}>
            star
          </span>
          <span className={styles.scoreBadgeText}>
            Skor: <span className={styles.scoreValue}>{engine.score}</span>
          </span>
        </div>
      </header>

      {/* 2. Gate Seals Status Track */}
      <section className={styles.sealsContainer}>
        <div className={styles.sealsBar}>
          <div className={styles.sealsTitleGroup}>
            <span className="material-symbols-outlined" style={{ color: '#a855f7', fontSize: '18px' }}>
              lock
            </span>
            <span className={styles.sealsTitle}>Status Segel Gerbang:</span>
          </div>

          <div className={styles.sealsTrack}>
            {BOSS_ALGEBRA_STAGES.map((stg, idx) => {
              const isBroken = idx < engine.currentQuestionIndex || (idx === engine.currentQuestionIndex && engine.isAnswerCorrect);
              const isActive = idx === engine.currentQuestionIndex && !engine.isAnswerCorrect;

              return (
                <div
                  key={stg.id}
                  className={`${styles.sealNode} ${
                    isBroken ? styles.sealNodeBroken : isActive ? styles.sealNodeActive : styles.sealNodeLocked
                  }`}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                    {isBroken ? 'lock_open' : isActive ? 'key' : 'lock'}
                  </span>
                  <span>Segel {stg.id}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Colossal 3D Gate Arena with Levitating Core */}
      <main className={styles.gateArena}>
        <div className={`${styles.archwayFrame} ${isGateUnlocked ? styles.doorsOpen : ''}`}>
          {/* Ancient Pillars on flanks */}
          <div className={styles.leftPillar}>
            <span className={styles.runeSymbol}>✦</span>
            <span className={styles.runeSymbol}>α</span>
            <span className={styles.runeSymbol}>∑</span>
            <span className={styles.runeSymbol}>✦</span>
          </div>
          <div className={styles.rightPillar}>
            <span className={styles.runeSymbol}>✦</span>
            <span className={styles.runeSymbol}>Ω</span>
            <span className={styles.runeSymbol}>∏</span>
            <span className={styles.runeSymbol}>✦</span>
          </div>

          {/* Central Portal with 3D swinging doors */}
          <div className={styles.gateDoorPortal}>
            {/* The gateway rays that erupt upon victory */}
            <div className={styles.gatewayLightBeam} />

            <div className={styles.doorLeft}>
              <div className={styles.doorTexture} />
            </div>
            <div className={styles.doorRight}>
              <div className={styles.doorTexture} />
            </div>

            {/* Floating Variable Crystal Core */}
            <div className={styles.variableCoreCenter}>
              <div className={styles.crystalPrismWrap}>
                <div className={styles.orbitalRingOuter} />
                <div className={styles.orbitalRingInner} />
                <div className={styles.facetedDiamond}>
                  <span className={styles.variableLetter}>{currentStage.coreVar}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4. Ancient Algebraic Balance Altar */}
          <div className={styles.balanceAltar}>
            <p className={styles.altarPromptText}>
              Seimbangkan aliran energi kristal di kedua sisi altar gerbang:
            </p>

            <div className={styles.equationConduit}>
              {/* Left Side Vessel (Variable + Constant) */}
              <div className={`${styles.sideVessel} ${styles.vesselLeft}`}>
                <span className={styles.variablePill}>{currentStage.leftVariable}</span>
                <span className={styles.operatorText}>{currentStage.leftOp}</span>
                <span className={styles.constantText}>{currentStage.leftConstant}</span>
              </div>

              {/* Equal Symbol / Balance Scales */}
              <div className={styles.balanceEqualWrap}>
                <span className={styles.equalSymbol}>=</span>
                <span className={styles.balanceCaption}>Seimbang</span>
              </div>

              {/* Right Side Vessel (Total Constant) */}
              <div className={`${styles.sideVessel} ${styles.vesselRight}`}>
                <span className={styles.constantText}>{currentStage.rightConstant}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* 5. Educational Hint Callout */}
      <section className={styles.hintCallout}>
        <div className={styles.hintInner}>
          <span className="material-symbols-outlined" style={{ color: '#38bdf8', fontSize: '20px' }}>
            lightbulb
          </span>
          <p className={styles.hintText}>
            <span className={styles.hintHighlight}>Petunjuk Aljabar: </span>
            {currentStage.hint}
          </p>
        </div>
      </section>

      {/* 6. Runic Gemstone Options (A, B, C, D) */}
      <section className={styles.optionsSection}>
        <h4 className={styles.optionsTitle}>Pilih Kristal Rune dengan Nilai Tepat untuk {currentStage.coreVar}:</h4>
        <div className={styles.optionsGrid}>
          {currentStage.options.map((opt) => {
            const isSelected = engine.selectedAnswer === opt.id;
            const isWrong = wrongAttempts.includes(opt.id);
            const isCorrect = isSelected && opt.isCorrect;

            let btnClass = styles.runeOptionButton;
            if (isCorrect) btnClass += ` ${styles.runeCorrect}`;
            else if (isWrong) btnClass += ` ${styles.runeWrong}`;

            return (
              <button
                key={opt.id}
                type="button"
                className={btnClass}
                onClick={() => handleSelect(opt)}
                disabled={engine.isAnswerCorrect === true || isWrong}
              >
                <div className={styles.optionGemstone} style={{ backgroundColor: opt.color }}>
                  <span className={styles.optionLetterBadge}>{opt.id.toUpperCase()}</span>
                  <span className={styles.optionValText}>{opt.val}</span>
                </div>

                <div className={styles.optionMeta}>
                  <span className={styles.optionTitle}>{opt.label}</span>
                  <span className={styles.optionValueDisplay}>
                    {currentStage.coreVar} = {opt.val}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 7. Floating Bottom Action Popup (Popup Next) */}
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

      {/* 8. Colossal Boss Victory Modal */}
      {showBossVictory && (
        <div className={styles.victoryModalOverlay}>
          <div className={styles.victoryCard}>
            <div className={styles.victoryRays} />

            <div className={styles.victoryCrownIcon}>
              <span className="material-symbols-outlined" style={{ fontSize: '42px', color: '#fff' }}>
                workspace_premium
              </span>
            </div>

            <h2 className={styles.victoryTitle}>Gerbang Aljabar Berhasil Dibuka!</h2>
            <p className={styles.victoryDesc}>
              Luar biasa, Petualang {currentCharacter?.name || 'Raka'}! Seluruh segel kuno Lembah Angka telah runtuh.
              Jalan rahasia menuju wilayah baru telah terbuka lebar!
            </p>

            <div className={styles.rewardsRow}>
              <div className={styles.rewardBadge}>
                <span style={{ color: '#fbbf24' }}>⚡</span>
                <span>+300 XP Bos</span>
              </div>
              <div className={styles.rewardBadge}>
                <span style={{ color: '#fbbf24' }}>🪙</span>
                <span>+80 Koin Emas</span>
              </div>
              <div className={styles.rewardBadge}>
                <span>👑</span>
                <span>Mahkota Kristal Angka</span>
              </div>
              <div className={styles.rewardBadge}>
                <span>🔮</span>
                <span>Kartu Aljabar Kosmik</span>
              </div>
            </div>

            <button type="button" className={styles.victoryClaimBtn} onClick={handleClaimVictory}>
              <span>Klaim Hadiah & Lanjutkan Petualangan</span>
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
