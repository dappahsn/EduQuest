import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMiniGameEngine } from '../../hooks/useMiniGameEngine';
import { useGame } from '../../context/GameContext';

const PLANETS = [
  { id: 'mercury', name: 'Merkurius', emoji: '🌑', order: 1, desc: 'Terdekat dengan Matahari' },
  { id: 'venus', name: 'Venus', emoji: '🟡', order: 2, desc: 'Planet terpanas bersinar terang' },
  { id: 'earth', name: 'Bumi', emoji: '🌍', order: 3, desc: 'Planet rumah kehidupan kita' },
  { id: 'mars', name: 'Mars', emoji: '🔴', order: 4, desc: 'Planet merah berdebu besi' }
];

export default function SolarSystemBuilder({ onGameComplete = null }) {
  const navigate = useNavigate();
  const { completeQuest } = useGame();
  const [placedPlanets, setPlacedPlanets] = useState([]);
  const [availablePlanets, setAvailablePlanets] = useState([
    { id: 'earth', name: 'Bumi', emoji: '🌍', order: 3 },
    { id: 'mercury', name: 'Merkurius', emoji: '🌑', order: 1 },
    { id: 'mars', name: 'Mars', emoji: '🔴', order: 4 },
    { id: 'venus', name: 'Venus', emoji: '🟡', order: 2 }
  ]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [showHint, setShowHint] = useState(false);

  function handlePlace(planet) {
    if (placedPlanets.length >= 4) return;
    const nextOrder = placedPlanets.length + 1;
    if (planet.order === nextOrder) {
      const nextPlaced = [...placedPlanets, planet];
      setPlacedPlanets(nextPlaced);
      setAvailablePlanets(availablePlanets.filter((p) => p.id !== planet.id));
      setFeedback(`✨ Hebat! ${planet.name} berada di orbit ke-${nextOrder}!`);

      if (nextPlaced.length === 4) {
        setIsCompleted(true);
        setFeedback('🚀 Sempurna! Tata Surya bagian dalam berhasil disusun!');
      }
    } else {
      setFeedback(`Kurang tepat. Orbit ke-${nextOrder} bukan untuk ${planet.name}. Ayo ingat urutan dari Matahari!`);
    }
  }

  function handleReset() {
    setPlacedPlanets([]);
    setAvailablePlanets([
      { id: 'earth', name: 'Bumi', emoji: '🌍', order: 3 },
      { id: 'mercury', name: 'Merkurius', emoji: '🌑', order: 1 },
      { id: 'mars', name: 'Mars', emoji: '🔴', order: 4 },
      { id: 'venus', name: 'Venus', emoji: '🟡', order: 2 }
    ]);
    setIsCompleted(false);
    setFeedback('');
    setShowHint(false);
  }

  function handleFinish() {
    completeQuest('quest-ap-1', 150, 160, 45, 'card-sun');
    if (onGameComplete) {
      onGameComplete();
    } else {
      navigate('/quest/quest-ap-1/result');
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 'var(--space-sm)' }}>
      {/* Header info */}
      <section style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: 'var(--color-surface-container-high)',
          padding: '4px 12px',
          borderRadius: 'var(--radius-full)'
        }}>
          <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)', fontSize: '18px' }}>rocket_launch</span>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-main)' }}>Angkasa Pengetahuan</span>
          <span style={{ color: 'var(--color-text-muted)' }}>•</span>
          <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-primary)' }}>Misi Orbit</span>
        </div>

        <div style={{ display: 'flex', gap: '6px' }}>
          <button
            onClick={() => setShowHint(!showHint)}
            style={{
              backgroundColor: 'var(--color-surface-container-high)',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              padding: '4px 12px',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: 'var(--color-tertiary-container)'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>lightbulb</span>
            <span>Petunjuk</span>
          </button>

          <button
            onClick={handleReset}
            style={{
              backgroundColor: 'var(--color-surface-container-high)',
              border: 'none',
              borderRadius: 'var(--radius-full)',
              padding: '4px 12px',
              fontSize: '12px',
              fontWeight: 800,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>restart_alt</span>
            <span>Ulangi</span>
          </button>
        </div>
      </section>

      {/* Hint Accordion */}
      {showHint && (
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
            <p style={{ fontSize: '13px', fontWeight: 800, margin: '0 0 2px' }}>Jembatan Keledai Urutan Planet:</p>
            <p style={{ fontSize: '12px', margin: 0, lineHeight: 1.4 }}>
              Ingat singkatan: <strong>Me-Ve-Bu-Ma</strong>! Urutannya: Merkurius (1), Venus (2), Bumi (3), Mars (4).
            </p>
          </div>
          <button
            onClick={() => setShowHint(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-on-primary-fixed)' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
          </button>
        </div>
      )}

      {/* Task Banner */}
      <div style={{
        backgroundColor: 'var(--color-surface-container-lowest)',
        padding: 'var(--space-sm)',
        borderRadius: 'var(--radius-md)',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        alignItems: 'center',
        gap: 'var(--space-sm)'
      }}>
        <div style={{ fontSize: '32px' }}>☀️</div>
        <div>
          <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
            Misi Antariksa
          </span>
          <h2 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-text-main)', margin: 0 }}>
            Susun 4 Planet Pertama dari Matahari!
          </h2>
        </div>
      </div>

      {/* Cosmic Orbit Stage */}
      <div style={{
        backgroundColor: '#121a34',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-md)',
        minHeight: '280px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: 'inset 0 0 40px rgba(0,0,0,0.6)'
      }}>
        {/* Stars particles */}
        <div style={{ position: 'absolute', inset: 0, opacity: 0.3, pointerEvents: 'none' }}>
          <span style={{ position: 'absolute', top: '20px', left: '30px', color: '#fff' }}>✨</span>
          <span style={{ position: 'absolute', top: '80px', right: '40px', color: '#fff' }}>✦</span>
          <span style={{ position: 'absolute', bottom: '40px', left: '70px', color: '#fff' }}>★</span>
        </div>

        {/* Orbit track display */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', width: '100%', justifyContent: 'space-around', zIndex: 10 }}>
          {/* Sun */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: '#ffb690', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '26px', boxShadow: '0 0 20px #c05400' }}>
              ☀️
            </div>
            <span style={{ color: '#ffb690', fontSize: '10px', fontWeight: 800 }}>Matahari</span>
          </div>

          {/* 4 Orbits */}
          {[1, 2, 3, 4].map((slotNum) => {
            const planet = placedPlanets[slotNum - 1];
            return (
              <div key={slotNum} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  border: planet ? '2px solid #6cf8bb' : '2px dashed #93ccff',
                  backgroundColor: planet ? 'rgba(0, 108, 73, 0.4)' : 'rgba(255, 255, 255, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '22px',
                  boxShadow: planet ? '0 0 12px #6cf8bb' : 'none'
                }}>
                  {planet ? planet.emoji : slotNum}
                </div>
                <span style={{ color: '#fff', fontSize: '10px', fontWeight: 700 }}>
                  {planet ? planet.name : `Orbit ${slotNum}`}
                </span>
              </div>
            );
          })}
        </div>

        {feedback && (
          <div
            className={feedback.includes('Bukan') || feedback.includes('belum') ? 'animate-shake' : 'animate-celebrate-pop'}
            style={{
              position: 'absolute',
              bottom: '12px',
              zIndex: 15,
              backgroundColor: isCompleted ? 'var(--color-secondary)' : 'rgba(255, 255, 255, 0.95)',
              color: isCompleted ? '#fff' : 'var(--color-text-main)',
              padding: '4px 14px',
              borderRadius: 'var(--radius-full)',
              fontSize: '12px',
              fontWeight: 800,
              boxShadow: 'var(--shadow-card)'
            }}
          >
            {feedback}
          </div>
        )}
      </div>

      {/* Available Planet Choice Chips */}
      {!isCompleted && (
        <div>
          <span style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-text-muted)', display: 'block', marginBottom: '8px' }}>
            Pilih planet berikutnya:
          </span>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-sm)' }}>
            {availablePlanets.map((planet) => (
              <button
                key={planet.id}
                onClick={() => handlePlace(planet)}
                style={{
                  backgroundColor: 'var(--color-surface-container-lowest)',
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  border: '2px solid var(--color-outline-subtle)',
                  boxShadow: 'var(--shadow-card)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  fontWeight: 800,
                  fontSize: '14px',
                  color: 'var(--color-text-main)'
                }}
              >
                <span style={{ fontSize: '24px' }}>{planet.emoji}</span>
                <span>{planet.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Action button */}
      {isCompleted && (
        <button
          onClick={handleFinish}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: 'var(--color-secondary)',
            color: 'var(--color-on-secondary)',
            borderRadius: 'var(--radius-full)',
            fontWeight: 800,
            fontSize: '15px',
            border: 'none',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: 'var(--shadow-tactile-secondary)'
          }}
        >
          <span>Misi Orbit Selesai! Buka Hadiah 🏆</span>
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_forward</span>
        </button>
      )}
    </div>
  );
}
