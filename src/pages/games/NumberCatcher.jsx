import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMiniGameEngine } from '../../hooks/useMiniGameEngine';
import { useGame } from '../../context/GameContext';
import CharacterAvatar from '../../components/character/CharacterAvatar';

const QUESTIONS = [
  {
    id: 1,
    prompt: 'Bantu Raka menyeberangi jembatan batu!',
    subPrompt: 'Tantangan Batu Apung',
    mathFormula: '7 × 8 = ?',
    hint: 'Ingat bahwa 7 × 8 sama dengan (7 × 7) + 7. Jika 7 × 7 = 49, maka 49 + 7 = 56!',
    options: [
      { id: 'a', label: 'Pilihan A', val: 42, isCorrect: false },
      { id: 'b', label: 'Pilihan B', val: 48, isCorrect: false },
      { id: 'c', label: 'Pilihan C', val: 56, isCorrect: true },
      { id: 'd', label: 'Pilihan D', val: 64, isCorrect: false }
    ]
  },
  {
    id: 2,
    prompt: 'Lompati pusaran arus sungai!',
    subPrompt: 'Tantangan Batu Apung',
    mathFormula: '6 × 9 = ?',
    hint: 'Trik perkalian 9: kurangi angka pengali dengan 1 untuk puluhan (6 - 1 = 5), lalu cari angka satuan yang jika dijumlahkan bernilai 9 (5 + 4 = 9) => 54!',
    options: [
      { id: 'a', label: 'Pilihan A', val: 54, isCorrect: true },
      { id: 'b', label: 'Pilihan B', val: 56, isCorrect: false },
      { id: 'c', label: 'Pilihan C', val: 63, isCorrect: false },
      { id: 'd', label: 'Pilihan D', val: 45, isCorrect: false }
    ]
  },
  {
    id: 3,
    prompt: 'Capai pulau tepian seberang!',
    subPrompt: 'Tantangan Batu Apung',
    mathFormula: '8 × 8 = ?',
    hint: '8 dikalikan 8 adalah bilangan kuadrat sempurna: 64!',
    options: [
      { id: 'a', label: 'Pilihan A', val: 62, isCorrect: false },
      { id: 'b', label: 'Pilihan B', val: 64, isCorrect: true },
      { id: 'c', label: 'Pilihan C', val: 72, isCorrect: false },
      { id: 'd', label: 'Pilihan D', val: 58, isCorrect: false }
    ]
  }
];

export default function NumberCatcher({ onGameComplete = null }) {
  const navigate = useNavigate();
  const { completeQuest, characterConfig } = useGame();

  const engine = useMiniGameEngine({
    totalQuestions: QUESTIONS.length,
    onFinish: ({ finalScore }) => {
      completeQuest('quest-la-3', finalScore, 150, 40, 'card-earth', 'hat-detective');
      if (onGameComplete) {
        onGameComplete();
      } else {
        navigate('/quest/quest-la-3/result');
      }
    }
  });

  const currentQ = QUESTIONS[engine.currentQuestionIndex] || QUESTIONS[0];

  function handleSelect(opt) {
    if (engine.selectedAnswer !== null) return;
    engine.setSelectedAnswer(opt.id);
    engine.submitAnswer(opt.isCorrect, opt.isCorrect ? '✨ Hebat! +50 XP' : 'Kurang tepat!');
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
          <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)', fontSize: '18px' }}>explore</span>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-main)' }}>Lembah Angka</span>
          <span style={{ color: 'var(--color-text-muted)' }}>•</span>
          <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-primary)' }}>Misi 03</span>
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
            Streak: <span style={{ color: 'var(--color-tertiary-container)', fontWeight: 800 }}>{engine.streak}</span>
          </span>
        </div>
      </section>

      {/* Question progress card */}
      <div style={{
        backgroundColor: 'var(--color-surface-container-lowest)',
        padding: 'var(--space-sm)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '14px', fontWeight: 700, color: 'var(--color-text-main)', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--color-secondary)', fontSize: '20px' }}>psychology</span>
            Jembatan Perkalian
          </span>
          <span style={{
            fontSize: '12px',
            fontWeight: 800,
            color: 'var(--color-primary)',
            backgroundColor: 'var(--color-primary-fixed)',
            padding: '2px 8px',
            borderRadius: 'var(--radius-full)'
          }}>
            {engine.questionNumber} dari {engine.totalQuestions} Soal
          </span>
        </div>

        <div style={{
          width: '100%',
          height: '10px',
          backgroundColor: 'var(--color-surface-container)',
          borderRadius: 'var(--radius-full)',
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            backgroundColor: 'var(--color-secondary-fixed-dim)',
            width: `${(engine.questionNumber / engine.totalQuestions) * 100}%`,
            transition: 'width 0.4s ease'
          }} />
        </div>
      </div>

      {/* Target Formula Banner (Sesuai Stitch) */}
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
          flexShrink: 0
        }}>
          <span className="material-symbols-outlined" style={{ color: 'var(--color-tertiary-container)', fontSize: '24px' }}>waving_hand</span>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-on-tertiary-fixed-variant)', margin: 0 }}>
            {currentQ.subPrompt}
          </p>
          <h2 style={{ fontSize: '16px', fontWeight: 800, margin: '2px 0 0', color: 'var(--color-on-tertiary-fixed)' }}>
            {currentQ.prompt}
          </h2>
        </div>
        <div style={{
          backgroundColor: 'rgba(255, 255, 255, 0.85)',
          padding: '6px 14px',
          borderRadius: 'var(--radius-full)',
          fontWeight: 800,
          fontSize: '18px',
          color: 'var(--color-tertiary)'
        }}>
          {currentQ.mathFormula}
        </div>
      </div>

      {/* 2.5D River Canvas & Stepping Stones */}
      <div style={{
        position: 'relative',
        width: '100%',
        minHeight: '340px',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        backgroundColor: 'var(--color-surface-container-high)',
        boxShadow: '0 8px 24px rgba(0, 97, 148, 0.15)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 'var(--space-sm)'
      }}>
        {/* Scenic Background */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(180deg, #93ccff 0%, #006c49 100%)',
          opacity: 0.85
        }} />

        {/* Mascot badge & XP toast */}
        <div style={{ position: 'relative', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.92)',
            backdropFilter: 'blur(6px)',
            padding: '4px 12px',
            borderRadius: 'var(--radius-full)',
            boxShadow: 'var(--shadow-card)'
          }}>
            <CharacterAvatar config={characterConfig} size="xs" />
            <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-text-main)' }}>Raka Si Petualang</span>
          </div>

          {engine.isAnswerCorrect && (
            <div style={{
              backgroundColor: 'var(--color-secondary-fixed)',
              color: 'var(--color-on-secondary-fixed)',
              padding: '6px 12px',
              borderRadius: 'var(--radius-full)',
              fontSize: '12px',
              fontWeight: 800,
              boxShadow: 'var(--shadow-card)',
              animation: 'bounce 0.8s infinite'
            }}>
              {engine.feedbackMessage}
            </div>
          )}
        </div>

        {/* 4 Interactive Option Stepping Stones */}
        <div style={{
          position: 'relative',
          zIndex: 10,
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 'var(--space-sm)',
          margin: 'auto 0'
        }}>
          {currentQ.options.map((opt) => {
            const isChosen = engine.selectedAnswer === opt.id;
            let bgColor = 'var(--color-surface-container-lowest)';
            let textColor = 'var(--color-text-main)';
            let circleBg = 'var(--color-surface-container)';

            if (isChosen) {
              if (opt.isCorrect) {
                bgColor = 'var(--color-secondary-container)';
                textColor = 'var(--color-on-secondary-container)';
                circleBg = 'var(--color-secondary-fixed-dim)';
              } else {
                bgColor = 'var(--color-error-container)';
                textColor = 'var(--color-on-error-container)';
              }
            }

            const animationClass = isChosen
              ? (opt.isCorrect ? 'animate-celebrate-pop' : 'animate-shake')
              : '';

            return (
              <button
                key={opt.id}
                onClick={() => handleSelect(opt)}
                className={animationClass}
                style={{
                  backgroundColor: bgColor,
                  color: textColor,
                  padding: 'var(--space-sm)',
                  borderRadius: 'var(--radius-md)',
                  boxShadow: isChosen && opt.isCorrect ? '0 8px 20px rgba(0, 108, 73, 0.3)' : 'var(--shadow-card)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: engine.selectedAnswer ? 'default' : 'pointer',
                  border: 'none',
                  transition: 'transform 0.15s, background-color 0.2s',
                  position: 'relative'
                }}
              >
                {isChosen && opt.isCorrect && (
                  <div style={{
                    position: 'absolute',
                    top: '-10px',
                    backgroundColor: 'var(--color-secondary)',
                    color: 'var(--color-on-secondary)',
                    padding: '2px 10px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '11px',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>star</span>
                    <span>Benar!</span>
                  </div>
                )}

                <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)', marginBottom: '4px' }}>
                  {opt.label}
                </span>
                <div style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  backgroundColor: circleBg,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)'
                }}>
                  <span style={{ fontSize: '22px', fontWeight: 900, color: opt.isCorrect && isChosen ? 'var(--color-on-secondary-fixed)' : 'var(--color-primary)' }}>
                    {opt.val}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Stepping Stones Bottom Tracker */}
        <div style={{
          position: 'relative',
          zIndex: 10,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          backdropFilter: 'blur(6px)',
          borderRadius: 'var(--radius-md)',
          padding: '6px 12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--color-secondary)', fontSize: '20px' }}>pets</span>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-main)' }}>
              Raka melompat ke batu ke-{engine.questionNumber}!
            </span>
          </div>
          <div style={{ display: 'flex', gap: '4px' }}>
            {QUESTIONS.map((_, i) => (
              <span
                key={i}
                style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  backgroundColor: i < engine.questionNumber ? 'var(--color-secondary)' : 'var(--color-surface-dim)'
                }}
              />
            ))}
          </div>
        </div>
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
          onClick={engine.resetGame}
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
            <p style={{ fontSize: '13px', fontWeight: 800, margin: '0 0 2px' }}>Tips Berhitung Cepat:</p>
            <p style={{ fontSize: '12px', margin: 0, lineHeight: 1.4 }}>{currentQ.hint}</p>
          </div>
          <button
            onClick={() => engine.setShowHint(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-on-primary-fixed)' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
          </button>
        </div>
      )}

      {/* Next Question / Finish Action */}
      {engine.selectedAnswer !== null && (
        <button
          onClick={engine.nextQuestion}
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
          <span>{engine.questionNumber >= engine.totalQuestions ? 'Selesaikan Misi & Buka Peti!' : 'Lanjut ke Soal Berikutnya'}</span>
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_forward</span>
        </button>
      )}
    </div>
  );
}
