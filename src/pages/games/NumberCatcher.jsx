import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMiniGameEngine } from '../../hooks/useMiniGameEngine';
import { useGame } from '../../context/GameContext';
import { useAudio } from '../../context/AudioContext';
import { getCharacterById } from '../../data/characters';
import RiverStoneOption from './RiverStoneOption';
import styles from './NumberCatcher.module.css';

const QUESTIONS = [
  {
    id: 1,
    prompt: 'Bantu petualang menyeberangi jembatan batu!',
    subPrompt: 'Tantangan Batu Apung 01',
    mathFormula: '7 × 8 = ?',
    hint: 'Ingat bahwa 7 × 8 sama dengan (7 × 7) + 7. Jika 7 × 7 = 49, maka 49 + 7 = 56!',
    options: [
      { id: 'a', label: 'Batu A', val: 42, isCorrect: false },
      { id: 'b', label: 'Batu B', val: 48, isCorrect: false },
      { id: 'c', label: 'Batu C', val: 56, isCorrect: true },
      { id: 'd', label: 'Batu D', val: 64, isCorrect: false }
    ]
  },
  {
    id: 2,
    prompt: 'Lompati pusaran arus sungai yang deras!',
    subPrompt: 'Tantangan Batu Apung 02',
    mathFormula: '6 × 9 = ?',
    hint: 'Trik perkalian 9: kurangi angka pengali dengan 1 untuk puluhan (6 - 1 = 5), lalu cari angka satuan yang jika dijumlahkan bernilai 9 (5 + 4 = 9) => 54!',
    options: [
      { id: 'a', label: 'Batu A', val: 54, isCorrect: true },
      { id: 'b', label: 'Batu B', val: 56, isCorrect: false },
      { id: 'c', label: 'Batu C', val: 63, isCorrect: false },
      { id: 'd', label: 'Batu D', val: 45, isCorrect: false }
    ]
  },
  {
    id: 3,
    prompt: 'Capai pulau seberang dan buka peti hadiah!',
    subPrompt: 'Tantangan Batu Apung 03',
    mathFormula: '8 × 8 = ?',
    hint: '8 dikalikan 8 adalah bilangan kuadrat sempurna: 64!',
    options: [
      { id: 'a', label: 'Batu A', val: 62, isCorrect: false },
      { id: 'b', label: 'Batu B', val: 64, isCorrect: true },
      { id: 'c', label: 'Batu C', val: 72, isCorrect: false },
      { id: 'd', label: 'Batu D', val: 58, isCorrect: false }
    ]
  }
];

export default function NumberCatcher({ onGameComplete = null, questId: propQuestId }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const targetQuestId = propQuestId || searchParams.get('questId') || 'quest-la-1';
  const { completeQuest, characterConfig } = useGame();
  const { playSfx } = useAudio();

  // Active explorer character
  const activeAvatarId = characterConfig?.avatar || 'raka_explorer';
  const currentCharacter = getCharacterById(activeAvatarId);

  // Jump animation state: 'idle' | 'leaping' | 'wobbling'
  const [jumpState, setJumpState] = useState('idle');
  // Wrong attempts tracking on the current question
  const [wrongAttempts, setWrongAttempts] = useState([]);
  const [customFeedback, setCustomFeedback] = useState(null);

  const engine = useMiniGameEngine({
    totalQuestions: QUESTIONS.length,
    onFinish: ({ finalScore }) => {
      completeQuest(targetQuestId, finalScore, 150, 40, 'card-earth', 'hat-detective');
      if (onGameComplete) {
        onGameComplete();
      } else {
        navigate(`/quest/${targetQuestId}/result`);
      }
    }
  });

  const currentQ = QUESTIONS[engine.currentQuestionIndex] || QUESTIONS[0];

  function handleSelect(opt) {
    // If already answered correctly, lock board
    if (engine.isAnswerCorrect === true) return;
    // If already tried this wrong option, ignore
    if (wrongAttempts.includes(opt.id)) return;

    if (opt.isCorrect) {
      setJumpState('leaping');
      engine.setSelectedAnswer(opt.id);
      engine.submitAnswer(true, '✨ Lompatan Sempurna! +50 XP');
      setCustomFeedback({ isCorrect: true, message: '✨ Lompatan Sempurna! +50 XP' });
      setTimeout(() => setJumpState('idle'), 800);
    } else {
      setJumpState('wobbling');
      setWrongAttempts((prev) => [...prev, opt.id]);
      setCustomFeedback({
        isCorrect: false,
        message: 'Hampir tepat! Batu bergoyang, coba batu lainnya 🪨'
      });
      if (playSfx) playSfx('wrong');
      setTimeout(() => setJumpState('idle'), 700);
    }
  }

  function handleNextStep() {
    setJumpState('idle');
    setWrongAttempts([]);
    setCustomFeedback(null);
    engine.nextQuestion();
  }

  return (
    <div className={styles.container}>
      {/* 1. Header Info Bar */}
      <section className={styles.infoBar}>
        <div className={styles.realmChip}>
          <span className="material-symbols-outlined" style={{ color: '#0284c7', fontSize: '18px' }}>
            explore
          </span>
          <span style={{ fontSize: '12.5px', fontWeight: 700, color: '#334155' }}>
            Lembah Angka
          </span>
          <span style={{ color: '#94a3b8' }}>•</span>
          <span style={{ fontSize: '12.5px', fontWeight: 800, color: '#0284c7' }}>
            Misi 01 (Jembatan Perkalian Kilat)
          </span>
        </div>

        <div className={`${styles.streakChip} ${engine.streak > 0 ? styles.streakChipActive : ''}`}>
          <span className="material-symbols-outlined" style={{ color: '#ea580c', fontSize: '18px' }}>
            local_fire_department
          </span>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#334155' }}>
            Rentetan: <strong style={{ color: '#ea580c', fontWeight: 900 }}>{engine.streak}x</strong>
          </span>
        </div>
      </section>

      {/* 2. Challenge Formula Banner */}
      <div className={styles.challengeBanner}>
        <div className={styles.bannerLeft}>
          <div className={styles.bannerIconWrap}>
            <span className="material-symbols-outlined">terrain</span>
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

      {/* 3. Interactive River Stage Arena */}
      <div className={styles.riverStageCard}>
        {/* Animated River Waves Background */}
        <div className={styles.waterWavesContainer}>
          <div className={styles.waterWaveLayer1} />
          <div className={styles.waterWaveLayer2} />
          <div className={styles.riverFoamOverlay} />
          <span className={styles.lotus1}>🪷</span>
          <span className={styles.lotus2}>🌿</span>
          <span className={styles.lotus3}>🐟</span>
          <span className={styles.lotus4}>🌊</span>
        </div>

        {/* Stage Top HUD (Character Badge & Live Feedback) */}
        <div className={styles.stageTopHud}>
          <div className={styles.explorerBadge}>
            <div
              className={styles.explorerAvatarCircle}
              style={{ borderColor: currentCharacter.themeColor }}
            >
              <img
                src={currentCharacter.image}
                alt={currentCharacter.name}
                className={styles.explorerAvatarImg}
              />
            </div>
            <span className={styles.explorerNameText}>
              {currentCharacter.name}
            </span>
          </div>

          {(customFeedback || engine.feedbackMessage) && (
            <div
              className={`${styles.feedbackBadge} ${
                (customFeedback ? customFeedback.isCorrect : engine.isAnswerCorrect)
                  ? styles.feedbackCorrect
                  : styles.feedbackWrong
              }`}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                {(customFeedback ? customFeedback.isCorrect : engine.isAnswerCorrect)
                  ? 'verified'
                  : 'warning'}
              </span>
              <span>{customFeedback ? customFeedback.message : engine.feedbackMessage}</span>
            </div>
          )}
        </div>

        {/* 4. Realistic River Stepping Stones Bridge Trail */}
        <div className={styles.bridgeGorgeContainer}>
          {/* Bridge Suspension Ropes running across */}
          <div className={styles.bridgeRopeTop} />
          <div className={styles.bridgeRopeBottom} />

          <div className={styles.steppingStonesVisualizer}>
            {/* Starting Bank */}
            <div className={styles.bridgeBankStart}>
              <div className={styles.bridgeBankIcon}>
                <span>🏕️</span>
              </div>
              <span className={styles.bankLabel}>Tepi Mulai</span>
            </div>

            {/* Stepping Stones 1, 2, 3 with connecting bridge walkway planks */}
            {[1, 2, 3].map((step) => {
              const isPassed = step < engine.questionNumber;
              const isCurrent = step === engine.questionNumber;
              return (
                <React.Fragment key={step}>
                  {/* Connecting wooden planks */}
                  <div className={styles.bridgeWoodPlankPath}>
                    <div className={styles.woodPlank} />
                    <div className={styles.woodPlank} />
                  </div>

                  <div className={styles.bridgePillarStep}>
                    {/* Character standing on the current stone */}
                    {isCurrent && (
                      <div className={`${styles.heroJumperWrap} ${
                        jumpState === 'leaping' ? styles.heroLeaping : jumpState === 'wobbling' ? styles.heroWobbling : ''
                      }`}>
                        <div
                          className={styles.heroJumperAvatar}
                          style={{ borderColor: currentCharacter.themeColor }}
                        >
                          <img
                            src={currentCharacter.image}
                            alt={currentCharacter.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          />
                        </div>
                        <div className={styles.heroWaterShadow} />
                      </div>
                    )}

                    {/* 3D Realistic Stone Node */}
                    <div className={`${styles.bridgeStoneNode} ${
                      isPassed ? styles.bridgeStonePassed : isCurrent ? styles.bridgeStoneCurrent : ''
                    }`}>
                      {isPassed ? (
                        <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>check</span>
                      ) : (
                        <span>{step}</span>
                      )}
                      <span className={styles.miniStoneMoss}>🌿</span>
                    </div>
                    <span className={styles.stoneStepLabel}>
                      Batu {step}
                    </span>
                  </div>
                </React.Fragment>
              );
            })}

            {/* Connecting wooden planks to goal island */}
            <div className={styles.bridgeWoodPlankPath}>
              <div className={styles.woodPlank} />
              <div className={styles.woodPlank} />
            </div>

            {/* Destination Goal Island */}
            <div className={styles.bridgeBankGoal}>
              <div className={styles.bridgeBankGoalIcon}>
                <span>🏆</span>
              </div>
              <span className={styles.bankLabel}>Pulau Emas</span>
            </div>
          </div>
        </div>

        {/* River Crossing Instruction Banner */}
        <div className={styles.crossingInstruction}>
          <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#38bdf8' }}>
            water
          </span>
          <span>Pilih batu apung sungai dengan jawaban yang tepat untuk melompat:</span>
        </div>

        {/* 5. 4 Interactive 3D Natural River Stepping Stones */}
        <div className={styles.optionsGrid}>
          {currentQ.options.map((opt, optIndex) => {
            const isCorrectChoice = engine.selectedAnswer === opt.id && opt.isCorrect;
            const isWrongChoice = wrongAttempts.includes(opt.id);
            const isDisabled = engine.isAnswerCorrect === true || isWrongChoice;

            return (
              <RiverStoneOption
                key={opt.id}
                index={optIndex}
                label={opt.label}
                value={opt.val}
                isCorrect={isCorrectChoice}
                isWrong={isWrongChoice}
                disabled={isDisabled}
                onClick={() => {
                  if (playSfx) playSfx('button-hover');
                  handleSelect(opt);
                }}
              />
            );
          })}
        </div>

        {/* Bottom Progress Bar Pill */}
        <div className={styles.bottomProgressPill}>
          <div className={styles.bottomProgressLeft}>
            <span className="material-symbols-outlined" style={{ color: '#0284c7', fontSize: '20px' }}>
              hiking
            </span>
            <span>Lompatan ke-{engine.questionNumber} dari 3 Tantangan</span>
          </div>
          <div className={styles.bottomDotsGroup}>
            {[1, 2, 3].map((num) => (
              <div
                key={num}
                className={`${styles.bottomDot} ${
                  num <= engine.questionNumber ? styles.bottomDotActive : styles.bottomDotPending
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* 6. Utility Footer: Hint & Restart */}
      <section className={styles.actionFooter}>
        <button
          type="button"
          onClick={() => {
            if (playSfx) playSfx('button-click');
            engine.setShowHint(!engine.showHint);
          }}
          className={styles.utilityBtn}
        >
          <span className="material-symbols-outlined" style={{ color: '#f59e0b' }}>lightbulb</span>
          <span>{engine.showHint ? 'Tutup Petunjuk' : 'Petunjuk Berhitung'}</span>
        </button>

        <button
          type="button"
          onClick={() => {
            if (playSfx) playSfx('button-click');
            setJumpState('idle');
            setWrongAttempts([]);
            setCustomFeedback(null);
            engine.resetGame();
          }}
          className={styles.utilityBtn}
        >
          <span className="material-symbols-outlined" style={{ color: '#0284c7' }}>refresh</span>
          <span>Mulai Ulang Soal</span>
        </button>
      </section>

      {/* Hint Accordion */}
      {engine.showHint && (
        <div className={styles.hintCard}>
          <span className="material-symbols-outlined" style={{ color: '#0284c7', fontSize: '24px' }}>
            psychology_alt
          </span>
          <div style={{ flex: 1 }}>
            <h5 style={{ fontSize: '13.5px', fontWeight: 800, color: '#0369a1', margin: '0 0 4px 0' }}>
              Trik Cepat Perkalian:
            </h5>
            <p style={{ fontSize: '12.5px', color: '#334155', margin: 0, lineHeight: 1.45 }}>
              {currentQ.hint}
            </p>
          </div>
          <button
            type="button"
            onClick={() => engine.setShowHint(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
          </button>
        </div>
      )}

      {/* Next Step / Complete Mission Action Button - ONLY rendered when answer is CORRECT */}
      {engine.isAnswerCorrect === true && (
        <button
          type="button"
          onClick={handleNextStep}
          className={styles.nextQuestionBtn}
        >
          <span>
            {engine.questionNumber >= engine.totalQuestions
              ? '🎉 Selesaikan Misi & Buka Peti Harta Karun!'
              : 'Lompat ke Batu Berikutnya ➔'}
          </span>
          <span className="material-symbols-outlined">arrow_forward</span>
        </button>
      )}
    </div>
  );
}
