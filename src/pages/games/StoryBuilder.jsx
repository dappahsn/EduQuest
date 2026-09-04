import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';

const STORY_PUZZLE = {
  title: 'Legenda Timun Mas & Raksasa',
  targetSentence: 'Timun Mas menebarkan biji mentimun di tengah hutan.',
  blocks: [
    { id: 'subjek', text: 'Timun Mas', type: 'Subjek', role: 'Tokoh Utama' },
    { id: 'predikat', text: 'menebarkan', type: 'Predikat', role: 'Kata Kerja' },
    { id: 'objek', text: 'biji mentimun', type: 'Objek', role: 'Benda' },
    { id: 'keterangan', text: 'di tengah hutan', type: 'Keterangan', role: 'Tempat' }
  ],
  hint: 'Urutan kalimat bahasa Indonesia yang baik adalah: Subjek (Siapa) -> Predikat (Melakukan apa) -> Objek (Benda apa) -> Keterangan (Di mana)!'
};

export default function StoryBuilder({ onGameComplete = null }) {
  const navigate = useNavigate();
  const { completeQuest } = useGame();
  const [selectedOrder, setSelectedOrder] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [showHint, setShowHint] = useState(false);

  function addBlock(block) {
    if (selectedOrder.some((b) => b.id === block.id)) return;
    const nextOrder = [...selectedOrder, block];
    setSelectedOrder(nextOrder);

    if (nextOrder.length === 4) {
      const correct = nextOrder[0].id === 'subjek' &&
                      nextOrder[1].id === 'predikat' &&
                      nextOrder[2].id === 'objek' &&
                      nextOrder[3].id === 'keterangan';
      if (correct) {
        setIsSuccess(true);
        setFeedback('✨ Hebat! Kisah tersusun indah dengan tata bahasa yang benar!');
      } else {
        setFeedback('Urutan kalimat belum tepat. Coba perhatikan urutan: Tokoh -> Aksi -> Benda -> Tempat!');
      }
    }
  }

  function handleReset() {
    setSelectedOrder([]);
    setIsSuccess(false);
    setFeedback('');
    setShowHint(false);
  }

  function handleFinish() {
    completeQuest('quest-nc-1', 150, 150, 40, 'card-rainforest');
    if (onGameComplete) {
      onGameComplete();
    } else {
      navigate('/quest/quest-nc-1/result');
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 'var(--space-sm)' }}>
      {/* Header Info */}
      <section style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: 'var(--color-surface-container-high)',
          padding: '4px 12px',
          borderRadius: 'var(--radius-full)'
        }}>
          <span className="material-symbols-outlined" style={{ color: 'var(--color-tertiary)', fontSize: '18px' }}>auto_stories</span>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-main)' }}>Negeri Cerita</span>
          <span style={{ color: 'var(--color-text-muted)' }}>•</span>
          <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-tertiary)' }}>Misi Literasi</span>
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
            <p style={{ fontSize: '13px', fontWeight: 800, margin: '0 0 2px' }}>Tips Menyusun Kalimat:</p>
            <p style={{ fontSize: '12px', margin: 0, lineHeight: 1.4 }}>{STORY_PUZZLE.hint}</p>
          </div>
          <button
            onClick={() => setShowHint(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-on-primary-fixed)' }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
          </button>
        </div>
      )}

      {/* Story Prompt */}
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
        <div style={{ fontSize: '30px' }}>📜</div>
        <div>
          <span style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--color-on-tertiary-fixed-variant)' }}>
            Menyusun Kisah Nusantara
          </span>
          <h2 style={{ fontSize: '16px', fontWeight: 800, margin: '2px 0 0', color: 'var(--color-on-tertiary-fixed)' }}>
            {STORY_PUZZLE.title}
          </h2>
        </div>
      </div>

      {/* Story Sentence Canvas */}
      <div style={{
        backgroundColor: 'var(--color-surface-container-lowest)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-md)',
        boxShadow: 'var(--shadow-card)',
        minHeight: '140px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        border: '2px dashed var(--color-outline-subtle)'
      }}>
        {selectedOrder.length === 0 ? (
          <span style={{ fontSize: '13px', color: 'var(--color-text-muted)' }}>
            Ketuk potongan kata di bawah untuk menyusun kalimat cerita!
          </span>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
            {selectedOrder.map((b) => (
              <span
                key={b.id}
                style={{
                  backgroundColor: 'var(--color-primary-fixed)',
                  color: 'var(--color-on-primary-fixed)',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  fontSize: '14px',
                  fontWeight: 800,
                  boxShadow: 'var(--shadow-card)'
                }}
              >
                {b.text}
              </span>
            ))}
          </div>
        )}

        {feedback && (
          <p
            className={isSuccess ? 'animate-celebrate-pop' : 'animate-shake'}
            style={{
              fontSize: '13px',
              fontWeight: 800,
              color: isSuccess ? 'var(--color-secondary)' : 'var(--color-error)',
              marginTop: '12px',
              marginBottom: 0
            }}
          >
            {feedback}
          </p>
        )}
      </div>

      {/* Available Word Blocks */}
      <div>
        <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-text-muted)', display: 'block', marginBottom: '8px' }}>
          Pilihan Balok Kata:
        </span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-sm)' }}>
          {STORY_PUZZLE.blocks.map((block) => {
            const isUsed = selectedOrder.some((b) => b.id === block.id);
            return (
              <button
                key={block.id}
                onClick={() => addBlock(block)}
                disabled={isUsed || isSuccess}
                style={{
                  backgroundColor: isUsed ? 'var(--color-surface-container)' : 'var(--color-surface-container-lowest)',
                  opacity: isUsed ? 0.45 : 1,
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  border: '2px solid var(--color-outline-subtle)',
                  boxShadow: isUsed ? 'none' : 'var(--shadow-card)',
                  cursor: isUsed || isSuccess ? 'default' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'transform 0.15s, opacity 0.2s'
                }}
              >
                <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--color-text-main)' }}>
                  {block.text}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Action */}
      {isSuccess && (
        <button
          onClick={handleFinish}
          className="animate-celebrate-pop"
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
            boxShadow: 'var(--shadow-tactile-tertiary)'
          }}
        >
          Kisah Berhasil Disusun! Selesaikan Misi 🏆
        </button>
      )}
    </div>
  );
}
