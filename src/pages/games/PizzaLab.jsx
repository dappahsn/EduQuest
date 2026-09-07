import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useMiniGameEngine } from '../../hooks/useMiniGameEngine';
import { useGame } from '../../context/GameContext';
import { useAudio } from '../../context/AudioContext';
import PizzaSlice3D from './PizzaSlice3D';
import styles from './PizzaLab.module.css';

const FRACTION_TASKS = [
  {
    id: 1,
    targetFractionText: '3/4 (Tiga Perempat)',
    targetNumerator: 3,
    totalSlices: 4,
    story: 'Koki Milo butuh 3/4 loyang pizza untuk dibagikan ke tim penjelajah!',
    hint: 'Pilihlah 3 potong pizza dari total 4 potongan yang tersedia di atas loyang panggang.'
  },
  {
    id: 2,
    targetFractionText: '1/2 (Setengah)',
    targetNumerator: 2,
    totalSlices: 4,
    story: 'Bagi pizza sama rata menjadi 1/2 loyang (2 dari 4 potong)!',
    hint: 'Setengah dari 4 potong pizza adalah 2 potong pizza lezat.'
  },
  {
    id: 3,
    targetFractionText: '2/4 (Dua Perempat)',
    targetNumerator: 2,
    totalSlices: 4,
    story: 'Ambil 2 potong pizza keju dari 4 potong yang ada di loyang!',
    hint: '2 dari 4 potong bernilai senilai dengan 1/2 loyang pizza.'
  }
];

export default function PizzaLab({ onGameComplete = null, questId: propQuestId }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const targetQuestId = propQuestId || searchParams.get('questId') || 'quest-la-2';
  const { completeQuest, characterConfig } = useGame();
  const { playSfx } = useAudio();
  const [selectedSlices, setSelectedSlices] = useState([]);

  const engine = useMiniGameEngine({
    totalQuestions: FRACTION_TASKS.length,
    onFinish: ({ finalScore }) => {
      completeQuest(targetQuestId, finalScore, 140, 35, 'card-moon');
      if (onGameComplete) {
        onGameComplete();
      } else {
        navigate(`/quest/${targetQuestId}/result`);
      }
    }
  });

  const currentTask = FRACTION_TASKS[engine.currentQuestionIndex] || FRACTION_TASKS[0];

  function toggleSlice(sliceIndex) {
    if (engine.selectedAnswer !== null) return;
    if (playSfx) playSfx('button-click');
    if (selectedSlices.includes(sliceIndex)) {
      setSelectedSlices(selectedSlices.filter((i) => i !== sliceIndex));
    } else {
      setSelectedSlices([...selectedSlices, sliceIndex]);
    }
  }

  function handleReset() {
    if (playSfx) playSfx('button-hover');
    setSelectedSlices([]);
    engine.resetGame();
  }

  function handleCheck() {
    const isCorrect = selectedSlices.length === currentTask.targetNumerator;
    if (isCorrect) {
      if (playSfx) playSfx('correct');
      engine.setSelectedAnswer(selectedSlices.length);
      engine.submitAnswer(true, '✨ Luar biasa! Potongan 3D pizza fraksimu tepat sekali!');
    } else {
      if (playSfx) playSfx('wrong');
      engine.submitAnswer(false, 'Hitungan potongmu belum cocok, ayo sesuaikan potongan pizza!');
    }
  }

  function handleNext() {
    if (playSfx) playSfx('button-click');
    setSelectedSlices([]);
    engine.nextQuestion();
  }

  return (
    <div className={styles.pizzaLabContainer}>
      {/* 1. Sub-header info bar */}
      <section className={styles.subHeaderBar}>
        <div className={styles.missionBadge}>
          <span className="material-symbols-outlined" style={{ color: '#ea580c', fontSize: '18px' }}>
            local_pizza
          </span>
          <span className={styles.missionBadgeText}>Laboratorium Pizza Pecahan</span>
          <span style={{ color: '#cbd5e1' }}>•</span>
          <span className={styles.missionBadgeHighlight}>Misi 02</span>
        </div>

        <div className={styles.scoreBadge}>
          <span className="material-symbols-outlined" style={{ color: '#ea580c', fontSize: '18px' }}>
            local_fire_department
          </span>
          <span className={styles.scoreBadgeText}>
            Skor: <span className={styles.scoreValue}>{engine.score}</span>
          </span>
        </div>
      </section>

      {/* 2. Chef Milo's Order Ticket */}
      <div className={styles.chefOrderCard}>
        <div className={styles.chefAvatarCircle}>
          <span>👨‍🍳</span>
          <span className={styles.chefToqueBadge}>✨</span>
        </div>
        <div className={styles.orderContent}>
          <p className={styles.orderTag}>Pesanan Dapur Pecahan</p>
          <h2 className={styles.orderTitle}>{currentTask.story}</h2>
        </div>
        <div className={styles.fractionTargetPlate}>
          <span className={styles.fractionTargetPlateLabel}>Target Porsi</span>
          <span className={styles.fractionTargetPlateValue}>
            {currentTask.targetFractionText}
          </span>
        </div>
      </div>

      {/* 3. Authentic 3D Kitchen Table Arena */}
      <div className={styles.kitchenArena}>
        {/* Decorative Kitchen Ingredients */}
        <span className={styles.kitchenDeco1}>🍅</span>
        <span className={styles.kitchenDeco2}>🌿</span>
        <span className={styles.kitchenDeco3}>🧀</span>
        <span className={styles.kitchenDeco4}>🫒</span>

        {/* Rising Hot Oven Steam */}
        <div className={styles.steamContainer}>
          <span className={styles.steamParticle1}>♨️</span>
          <span className={styles.steamParticle2}>♨️</span>
          <span className={styles.steamParticle3}>♨️</span>
        </div>

        {/* The 3D Wooden Pizza Peel & Baking Pan Stage */}
        <div className={styles.pizzaStage3DWrap}>
          {/* Round Wooden Cutting Board (Peel) with 3D Depth */}
          <div className={styles.woodenPeelBoard}>
            {/* Wooden Handle Extending Downward */}
            <div className={styles.peelHandle}>
              <div className={styles.peelHole} />
            </div>

            {/* Dark Metal Baking Pan */}
            <div className={styles.metalBakingPan}>
              {/* 4 Interactive 3D Pizza Slices */}
              <div className={styles.pizzaSlicesGrid}>
                {[0, 1, 2, 3].map((idx) => {
                  const isSelected = selectedSlices.includes(idx);
                  return (
                    <PizzaSlice3D
                      key={idx}
                      index={idx}
                      isSelected={isSelected}
                      onClick={() => toggleSlice(idx)}
                      disabled={engine.selectedAnswer !== null}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 4. Serving Platter & Live Fraction Status Bar */}
        <div className={styles.servingPlatterBar}>
          <div className={styles.servingPlatterLeft}>
            <span className={styles.servingPlatterIcon}>🍽️</span>
            <div>
              <p className={styles.servingPlatterTitle}>Piring Saji Penjelajah</p>
              <p className={styles.servingPlatterSub}>
                {selectedSlices.length === currentTask.targetNumerator
                  ? `✨ Pas! Fraksi ${currentTask.targetFractionText} siap disajikan!`
                  : selectedSlices.length < currentTask.targetNumerator
                  ? `Pilih ${currentTask.targetNumerator - selectedSlices.length} potong lagi agar pas!`
                  : `Kelebihan potong, kurangi potongan pizza!`}
              </p>
            </div>
          </div>

          {/* Visual Mini Slice Slots on Platter */}
          <div className={styles.miniSlicesSlots}>
            {[0, 1, 2, 3].map((slotIdx) => {
              const isFilled = slotIdx < selectedSlices.length;
              return (
                <div
                  key={slotIdx}
                  className={`${styles.miniSliceSlot} ${isFilled ? styles.miniSliceFilled : styles.miniSliceEmpty}`}
                  title={`Potongan ${slotIdx + 1}`}
                >
                  {isFilled ? '🍕' : slotIdx + 1}
                </div>
              );
            })}
          </div>
        </div>

        {/* Feedback banner if checked */}
        {engine.feedbackMessage && (
          <div
            className={`${styles.feedbackMessageBanner} ${
              engine.isAnswerCorrect ? styles.feedbackCorrect : styles.feedbackWrong
            }`}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
              {engine.isAnswerCorrect ? 'task_alt' : 'error'}
            </span>
            <span>{engine.feedbackMessage}</span>
          </div>
        )}
      </div>

      {/* 5. Utility Action Buttons (Hint, Reset) */}
      <section className={styles.utilityButtonsRow}>
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
          <span>Petunjuk</span>
        </button>

        <button
          type="button"
          onClick={handleReset}
          className={styles.utilityBtn}
        >
          <span className="material-symbols-outlined" style={{ color: '#ea580c', fontSize: '18px' }}>
            refresh
          </span>
          <span>Ulangi Loyang</span>
        </button>
      </section>

      {/* Hint Accordion */}
      {engine.showHint && (
        <div className={styles.hintCard}>
          <span className="material-symbols-outlined" style={{ color: '#ea580c', fontSize: '22px' }}>
            psychology_alt
          </span>
          <div style={{ flex: 1 }}>
            <p className={styles.hintCardTitle}>Tips Koki Milo:</p>
            <p className={styles.hintCardText}>{currentTask.hint}</p>
          </div>
          <button
            type="button"
            onClick={() => engine.setShowHint(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#7c2d12' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
          </button>
        </div>
      )}

      {/* 6. Serve / Next Action Buttons */}
      {engine.selectedAnswer === null ? (
        <button
          type="button"
          onClick={handleCheck}
          disabled={selectedSlices.length === 0}
          className={`${styles.servePizzaBtn} ${selectedSlices.length === 0 ? styles.servePizzaBtnDisabled : ''}`}
        >
          <span>
            {selectedSlices.length === 0
              ? 'Pilih Potongan Pizza Terlebih Dahulu 🍕'
              : `Sajikan ${selectedSlices.length}/${currentTask.totalSlices} Loyang Pizza! 🍕`}
          </span>
        </button>
      ) : (
        <button
          type="button"
          onClick={handleNext}
          className={styles.nextQuestBtn}
        >
          <span>
            {engine.questionNumber >= engine.totalQuestions
              ? 'Selesaikan Misi & Ambil Hadiah'
              : 'Tantangan Berikutnya'}
          </span>
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
            arrow_forward
          </span>
        </button>
      )}
    </div>
  );
}
