import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMiniGameEngine } from '../../hooks/useMiniGameEngine';
import { useGame } from '../../context/GameContext';
import CharacterAvatar from '../../components/character/CharacterAvatar';

const FRACTION_TASKS = [
  {
    id: 1,
    targetFractionText: '3/4 (Tiga Perempat)',
    targetNumerator: 3,
    totalSlices: 4,
    story: 'Koki Milo butuh 3/4 loyang pizza untuk dibagikan ke tim penjelajah!',
    hint: 'Pilihlah 3 potong pizza dari total 4 potongan yang tersedia di atas loyang.'
  },
  {
    id: 2,
    targetFractionText: '1/2 (Setengah)',
    targetNumerator: 2,
    totalSlices: 4,
    story: 'Bagi pizza sama rata menjadi 1/2 loyang (2 dari 4 potong)!',
    hint: 'Setengah dari 4 potong pizza adalah 2 potong!'
  },
  {
    id: 3,
    targetFractionText: '2/4 (Dua Perempat)',
    targetNumerator: 2,
    totalSlices: 4,
    story: 'Ambil 2 potong pizza keju dari 4 potong yang ada!',
    hint: '2 dari 4 potong bernilai sama dengan 1/2 loyang pizza lezat.'
  }
];

export default function PizzaLab({ onGameComplete = null }) {
  const navigate = useNavigate();
  const { completeQuest, characterConfig } = useGame();
  const [selectedSlices, setSelectedSlices] = useState([]);

  const engine = useMiniGameEngine({
    totalQuestions: FRACTION_TASKS.length,
    onFinish: ({ finalScore }) => {
      completeQuest('quest-la-2', finalScore, 140, 35, 'card-moon');
      if (onGameComplete) {
        onGameComplete();
      } else {
        navigate('/quest/quest-la-2/result');
      }
    }
  });

  const currentTask = FRACTION_TASKS[engine.currentQuestionIndex] || FRACTION_TASKS[0];

  function toggleSlice(sliceIndex) {
    if (engine.selectedAnswer !== null) return;
    if (selectedSlices.includes(sliceIndex)) {
      setSelectedSlices(selectedSlices.filter((i) => i !== sliceIndex));
    } else {
      setSelectedSlices([...selectedSlices, sliceIndex]);
    }
  }

  function handleReset() {
    setSelectedSlices([]);
    engine.resetGame();
  }

  function handleCheck() {
    const isCorrect = selectedSlices.length === currentTask.targetNumerator;
    engine.setSelectedAnswer(selectedSlices.length);
    engine.submitAnswer(isCorrect, isCorrect ? '✨ Benar! Potongan fraksimu tepat!' : 'Hitungan potongmu belum cocok, ayo perbaiki!');
  }

  function handleNext() {
    setSelectedSlices([]);
    engine.nextQuestion();
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 'var(--space-sm)' }}>
      {/* Sub-header info bar */}
      <section style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: 'var(--color-surface-container-high)',
          padding: '4px 12px',
          borderRadius: 'var(--radius-full)'
        }}>
          <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)', fontSize: '18px' }}>local_pizza</span>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-main)' }}>Laboratorium Pizza Pecahan</span>
          <span style={{ color: 'var(--color-text-muted)' }}>•</span>
          <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-primary)' }}>Misi 02</span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: 'var(--color-surface-container-high)',
          padding: '4px 12px',
          borderRadius: 'var(--radius-full)'
        }}>
          <span className="material-symbols-outlined" style={{ color: 'var(--color-tertiary-container)', fontSize: '18px' }}>local_fire_department</span>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-main)' }}>
            Skor: <span style={{ color: 'var(--color-tertiary-container)', fontWeight: 800 }}>{engine.score}</span>
          </span>
        </div>
      </section>

      {/* Target prompt */}
      <div style={{
        backgroundColor: 'var(--color-tertiary-fixed)',
        color: 'var(--color-on-tertiary-fixed)',
        padding: 'var(--space-sm)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-sm)'
      }}>
        <div style={{
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          backgroundColor: 'var(--color-surface-container-lowest)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '24px'
        }}>
          🍕
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-on-tertiary-fixed-variant)', margin: 0 }}>
            Tantangan Pecahan
          </p>
          <h2 style={{ fontSize: '15px', fontWeight: 800, margin: '2px 0 0', color: 'var(--color-on-tertiary-fixed)' }}>
            {currentTask.story}
          </h2>
        </div>
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          padding: '6px 14px',
          borderRadius: 'var(--radius-full)',
          fontWeight: 900,
          fontSize: '18px',
          color: 'var(--color-tertiary)'
        }}>
          {currentTask.targetFractionText}
        </div>
      </div>

      {/* Interactive Pizza Board */}
      <div style={{
        backgroundColor: 'var(--color-surface-container-lowest)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-md)',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--space-md)'
      }}>
        {/* Visual Pizza Slices */}
        <div style={{
          width: '240px',
          height: '240px',
          borderRadius: '50%',
          backgroundColor: '#ffdbca',
          border: '10px solid #c05400',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 8px 24px rgba(192, 84, 0, 0.25)',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gridTemplateRows: '1fr 1fr',
          gap: '4px',
          padding: '4px'
        }}>
          {[0, 1, 2, 3].map((idx) => {
            const isSelected = selectedSlices.includes(idx);
            return (
              <button
                key={idx}
                onClick={() => toggleSlice(idx)}
                style={{
                  backgroundColor: isSelected ? '#ffb690' : '#ffd8be',
                  border: isSelected ? '4px solid #006c49' : '2px dashed #c05400',
                  borderRadius: idx === 0 ? '100% 0 0 0' : idx === 1 ? '0 100% 0 0' : idx === 2 ? '0 0 0 100%' : '0 0 100% 0',
                  cursor: engine.selectedAnswer !== null ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.15s, background-color 0.2s',
                  transform: isSelected ? 'scale(0.96)' : 'scale(1)',
                  position: 'relative'
                }}
              >
                <span style={{ fontSize: '24px' }}>{isSelected ? '🧀' : '🍅'}</span>
                {isSelected && (
                  <span
                    className="material-symbols-outlined"
                    style={{
                      position: 'absolute',
                      color: '#006c49',
                      fontSize: '24px',
                      fontWeight: 800
                    }}
                  >
                    check
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Live fraction counter */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backgroundColor: 'var(--color-surface-container-high)',
          padding: '6px 16px',
          borderRadius: 'var(--radius-full)'
        }}>
          <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-muted)' }}>
            Potongan Dipilih:
          </span>
          <span style={{ fontSize: '16px', fontWeight: 900, color: 'var(--color-primary)' }}>
            {selectedSlices.length} / {currentTask.totalSlices} ({selectedSlices.length}/{currentTask.totalSlices})
          </span>
        </div>

        {/* Feedback banner if checked */}
        {engine.feedbackMessage && (
          <div
            className={engine.isAnswerCorrect ? 'animate-celebrate-pop' : 'animate-shake'}
            style={{
              backgroundColor: engine.isAnswerCorrect ? 'var(--color-secondary-container)' : 'var(--color-error-container)',
              color: engine.isAnswerCorrect ? 'var(--color-on-secondary-container)' : 'var(--color-on-error-container)',
              padding: '8px 16px',
              borderRadius: 'var(--radius-md)',
              fontWeight: 800,
              fontSize: '13px',
              textAlign: 'center',
              width: '100%'
            }}
          >
            {engine.feedbackMessage}
          </div>
        )}
      </div>

      {/* Hint & Reset Action Buttons */}
      <section style={{ display: 'flex', gap: 'var(--space-sm)' }}>
        <button
          onClick={() => engine.setShowHint(!engine.showHint)}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            backgroundColor: 'var(--color-surface-container-high)',
            color: 'var(--color-text-main)',
            padding: '10px',
            borderRadius: 'var(--radius-full)',
            border: 'none',
            fontWeight: 800,
            fontSize: '13px',
            cursor: 'pointer'
          }}
        >
          <span className="material-symbols-outlined" style={{ color: 'var(--color-tertiary-container)', fontSize: '18px' }}>lightbulb</span>
          <span>Petunjuk</span>
        </button>

        <button
          onClick={handleReset}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            backgroundColor: 'var(--color-surface-container-high)',
            color: 'var(--color-text-main)',
            padding: '10px',
            borderRadius: 'var(--radius-full)',
            border: 'none',
            fontWeight: 800,
            fontSize: '13px',
            cursor: 'pointer'
          }}
        >
          <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)', fontSize: '18px' }}>refresh</span>
          <span>Ulangi</span>
        </button>
      </section>

      {/* Hint Accordion */}
      {engine.showHint && (
        <div style={{
          backgroundColor: 'var(--color-primary-fixed)',
          color: 'var(--color-on-primary-fixed)',
          padding: 'var(--space-sm)',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          gap: '8px',
          alignItems: 'flex-start'
        }}>
          <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)', fontSize: '22px' }}>psychology_alt</span>
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: '13px', fontWeight: 800, margin: '0 0 2px' }}>Tips Memotong Pecahan:</p>
            <p style={{ fontSize: '12px', margin: 0, lineHeight: 1.4 }}>{currentTask.hint}</p>
          </div>
          <button
            onClick={() => engine.setShowHint(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-on-primary-fixed)' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
          </button>
        </div>
      )}

      {/* Buttons */}
      {engine.selectedAnswer === null ? (
        <button
          onClick={handleCheck}
          disabled={selectedSlices.length === 0}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: selectedSlices.length > 0 ? 'var(--color-primary)' : 'var(--color-surface-container-high)',
            color: selectedSlices.length > 0 ? 'var(--color-on-primary)' : 'var(--color-text-muted)',
            borderRadius: 'var(--radius-full)',
            fontWeight: 800,
            fontSize: '15px',
            border: 'none',
            cursor: selectedSlices.length > 0 ? 'pointer' : 'not-allowed',
            boxShadow: selectedSlices.length > 0 ? 'var(--shadow-tactile-primary)' : 'none'
          }}
        >
          Sajikan Pizza ({selectedSlices.length}/{currentTask.totalSlices}) 🍕
        </button>
      ) : (
        <button
          onClick={handleNext}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: 'var(--color-tertiary-container)',
            color: 'var(--color-on-tertiary-container)',
            borderRadius: 'var(--radius-full)',
            fontWeight: 800,
            fontSize: '15px',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: 'var(--shadow-tactile-tertiary)'
          }}
        >
          <span>{engine.questionNumber >= engine.totalQuestions ? 'Selesaikan Misi & Ambil Hadiah' : 'Tantangan Berikutnya'}</span>
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_forward</span>
        </button>
      )}
    </div>
  );
}
