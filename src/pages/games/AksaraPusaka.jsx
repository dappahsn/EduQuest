import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { useAudio } from '../../context/AudioContext';
import styles from './AksaraPusaka.module.css';

// ---------------------------------------------------------------------------
// 3 BABAK PETUALANGAN AKSARA PUSAKA NUSANTARA
// ---------------------------------------------------------------------------
const AKSARA_ROUNDS = [
  {
    roundNumber: 1,
    artifactType: 'lontar',
    title: 'Misteri Daun Lontar Jawa (Hanacaraka)',
    subtitle: 'Kisah Kesetiaan Dua Ksatria Utusan Ajisaka',
    mediaBadge: '📜 Naskah Daun Lontar • Keraton Kuno',
    speechIntro: '👴 "Ananda pengelana, susunlah 5 aksara agung Hanacaraka pada lembar daun lontar ini!"',
    speechSuccess: '✨ "Luhur sekali! Hana Caraka: Ada dua ksatria utusan setia yang memegang teguh amanah!"',
    hint: 'Urutan baris pertama Hanacaraka adalah: ꦲ (HA) ➔ ꦤ (NA) ➔ ꦕ (CA) ➔ ꦫ (RA) ➔ ꦏ (KA)!',
    meaning: 'Hana Caraka bermakna "Ada utusan setia", mengisahkan Dora dan Sembada yang teguh menjaga pusaka sakti.',
    slots: [
      { id: 'ha', targetChar: 'ꦲ', latin: 'HA', meaning: 'Awal Hidup' },
      { id: 'na', targetChar: 'ꦤ', latin: 'NA', meaning: 'Cahaya Nur' },
      { id: 'ca', targetChar: 'ꦕ', latin: 'CA', meaning: 'Cipta Rasa' },
      { id: 'ra', targetChar: 'ꦫ', latin: 'RA', meaning: 'Jiwa Luhur' },
      { id: 'ka', targetChar: 'ꦏ', latin: 'KA', meaning: 'Karsa Mulia' }
    ],
    blocks: [
      { id: 'b_ca', char: 'ꦕ', latin: 'CA', name: 'Ca' },
      { id: 'b_ha', char: 'ꦲ', latin: 'HA', name: 'Ha' },
      { id: 'b_ka', char: 'ꦏ', latin: 'KA', name: 'Ka' },
      { id: 'b_na', char: 'ꦤ', latin: 'NA', name: 'Na' },
      { id: 'b_ra', char: 'ꦫ', latin: 'RA', name: 'Ra' },
      { id: 'b_da', char: 'ꦢ', latin: 'DA', name: 'Da (Kecohan)' }
    ]
  },
  {
    roundNumber: 2,
    artifactType: 'prasasti',
    title: 'Prasasti Batu Megalitikum (Aksara Sunda)',
    subtitle: 'Ajaran Silih Asah, Silih Asih, Silih Asuh Kerajaan Pajajaran',
    mediaBadge: '🗿 Prasasti Batu Andesit • Pakis Purba',
    speechIntro: '🌿 "Pahatlah aksara Kaganga Sunda kuno untuk menguak segel rahasia kebajikan leluhur!"',
    speechSuccess: '🌟 "Hebat! Segel batu terbuka: KAGANGA memancarkan ajaran saling menyayangi dan mengayomi!"',
    hint: 'Susun aksara Kaganga secara berurutan: ᮊ (KA) ➔ ᮌ (GA) ➔ ᮍ (NGA) ➔ ᮞ (SA) ➔ ᮃ (A)!',
    meaning: 'Aksara Sunda kuno dipahat pada batu prasasti megalitikum seperti Prasasti Kawali dan Batutulis Bogor.',
    slots: [
      { id: 'ka', targetChar: 'ᮊ', latin: 'KA', meaning: 'Kukuh Berdiri' },
      { id: 'ga', targetChar: 'ᮌ', latin: 'GA', meaning: 'Gagah Berani' },
      { id: 'nga', targetChar: 'ᮍ', latin: 'NGA', meaning: 'Ngalap Berkah' },
      { id: 'sa', targetChar: 'ᮞ', latin: 'SA', meaning: 'Silih Asih' },
      { id: 'a', targetChar: 'ᮃ', latin: 'A', meaning: 'Asal Sejati' }
    ],
    blocks: [
      { id: 'b_ga', char: 'ᮌ', latin: 'GA', name: 'Ga' },
      { id: 'b_ka', char: 'ᮊ', latin: 'KA', name: 'Ka' },
      { id: 'b_a', char: 'ᮃ', latin: 'A', name: 'A' },
      { id: 'b_nga', char: 'ᮍ', latin: 'NGA', name: 'Nga' },
      { id: 'b_sa', char: 'ᮞ', latin: 'SA', name: 'Sa' },
      { id: 'b_ja', char: 'ᮏ', latin: 'JA', name: 'Ja (Kecohan)' }
    ]
  },
  {
    roundNumber: 3,
    artifactType: 'pustaka',
    title: 'Segel Agung Pustaka Nusantara (Bhinneka Sastra)',
    subtitle: 'Persatuan Aksara Kepulauan: Jawa, Sunda, Batak, dan Lontara',
    mediaBadge: '👑 Peti Emas Pustaka • Pusaka Bangsa',
    speechIntro: '🏆 "Tahap puncak! Satukan kepingan aksara kepulauan untuk menyusun kata sakti NUSANTARA!"',
    speechSuccess: '🎉 "MAHAKARYA PURBA TERBUKA! Sastra Nusantara bersinar abadi melintasi ribuan zaman!"',
    hint: 'Satukan lima suku kata pusaka: NU (ꦤꦸ) ➔ SAN (ᮞ) ➔ AN (ꦲꦤ꧀) ➔ TA (ᨈ) ➔ RA (ᯒ)!',
    meaning: 'Nusantara bersatu dalam keberagaman aksara tradisional, diikat erat oleh Bhinneka Tunggal Ika.',
    slots: [
      { id: 'nu', targetChar: 'ꦤꦸ', latin: 'NU', meaning: 'Nusa Samudera' },
      { id: 'san', targetChar: 'ᮞ', latin: 'SAN', meaning: 'Santun Budi' },
      { id: 'an', targetChar: 'ꦲꦤ꧀', latin: 'AN', meaning: 'Amanah Luhur' },
      { id: 'ta', targetChar: 'ᨈ', latin: 'TA', meaning: 'Tanah Pusaka' },
      { id: 'ra', targetChar: 'ᯒ', latin: 'RA', meaning: 'Rakyat Bersatu' }
    ],
    blocks: [
      { id: 'b_san', char: 'ᮞ', latin: 'SAN', name: 'Aksara Sunda' },
      { id: 'b_nu', char: 'ꦤꦸ', latin: 'NU', name: 'Aksara Jawa' },
      { id: 'b_ra', char: 'ᯒ', latin: 'RA', name: 'Aksara Batak' },
      { id: 'b_an', char: 'ꦲꦤ꧀', latin: 'AN', name: 'Aksara Bali' },
      { id: 'b_ta', char: 'ᨈ', latin: 'TA', name: 'Aksara Lontara' },
      { id: 'b_ma', char: 'ᯔ', latin: 'MA', name: 'Kecohan' }
    ]
  }
];

export default function AksaraPusaka({ onGameComplete = null, questId: propQuestId }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const targetQuestId = propQuestId || searchParams.get('questId') || 'quest-nc-3';

  const { completeQuest } = useGame();
  const { playSfx } = useAudio();

  // State Management
  const [roundIdx, setRoundIdx] = useState(0);
  const [placedBlocks, setPlacedBlocks] = useState([]);
  const [isRoundSuccess, setIsRoundSuccess] = useState(false);
  const [isAllComplete, setIsAllComplete] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [showHint, setShowHint] = useState(false);

  const activeRound = AKSARA_ROUNDS[roundIdx] || AKSARA_ROUNDS[0];

  // Tap block to place onto altar
  function handleSelectBlock(block) {
    if (placedBlocks.length >= activeRound.slots.length) return;
    if (placedBlocks.some((b) => b.id === block.id)) return;

    playSfx('button-click');
    const nextPlaced = [...placedBlocks, block];
    setPlacedBlocks(nextPlaced);

    // Check if full
    if (nextPlaced.length === activeRound.slots.length) {
      const isCorrect = nextPlaced.every(
        (b, i) => b.latin === activeRound.slots[i].latin || b.char === activeRound.slots[i].targetChar
      );

      if (isCorrect) {
        playSfx('correct');
        setIsRoundSuccess(true);
        if (roundIdx === AKSARA_ROUNDS.length - 1) {
          setIsAllComplete(true);
          setFeedback('🏆 Sempurna! Seluruh segel Aksara Pusaka Nusantara berhasil kamu kuasai!');
        } else {
          setFeedback(activeRound.speechSuccess);
        }
      } else {
        playSfx('wrong');
        setFeedback('Susunan aksara belum tepat. Perhatikan bunyi latin dan petunjuk urutannya!');
      }
    }
  }

  // Remove single placed block
  function handleRemoveBlock(idx) {
    if (isRoundSuccess) return;
    playSfx('button-click');
    setPlacedBlocks(placedBlocks.filter((_, i) => i !== idx));
    setFeedback('');
  }

  // Reset current round
  function handleReset() {
    playSfx('button-click');
    setPlacedBlocks([]);
    setIsRoundSuccess(false);
    setFeedback('');
    setShowHint(false);
  }

  // Transition to next round
  function handleNextRound() {
    playSfx('button-click');
    if (roundIdx < AKSARA_ROUNDS.length - 1) {
      setRoundIdx(roundIdx + 1);
      setPlacedBlocks([]);
      setIsRoundSuccess(false);
      setFeedback('');
      setShowHint(false);
    }
  }

  // Quest Completion
  function handleFinish() {
    playSfx('quest-complete');
    // Rewards for Misi 03: +180 XP, 60 coins, 50 energy, card-aksara
    completeQuest('quest-nc-3', 180, 60, 50, 'card-aksara');
    if (onGameComplete) {
      onGameComplete();
    } else {
      navigate(`/quest/${targetQuestId}/result`);
    }
  }

  // Dynamic speech text
  let speechText = activeRound.speechIntro;
  if (isRoundSuccess) {
    speechText = activeRound.speechSuccess;
  } else if (placedBlocks.length > 0) {
    speechText = `✍️ "${placedBlocks.length} dari ${activeRound.slots.length} aksara terpasang. Lanjutkan pengelana!"`;
  }

  return (
    <div className={styles.container}>
      {/* 1. Header Row */}
      <section className={styles.headerRow}>
        <div className={styles.categoryBadge}>
          <span className={`material-symbols-outlined ${styles.categoryIcon}`}>history_edu</span>
          <span className={styles.categoryTitle}>Negeri Cerita</span>
          <span className={styles.categoryDivider}>•</span>
          <span className={styles.categorySub}>Misi 03 • Babak {roundIdx + 1}/3</span>
        </div>

        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.headerBtn}
            onClick={() => {
              playSfx('hint');
              setShowHint(!showHint);
            }}
            title="Buka petunjuk aksara"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#d97706' }}>
              lightbulb
            </span>
            <span>Petunjuk</span>
          </button>

          <button
            type="button"
            className={styles.headerBtn}
            onClick={handleReset}
            title="Atur ulang penempatan aksara"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
              restart_alt
            </span>
            <span>Ulangi</span>
          </button>
        </div>
      </section>

      {/* 2. Hint Box Accordion */}
      {showHint && (
        <div className={styles.hintBox}>
          <span className={`material-symbols-outlined ${styles.hintIcon}`}>auto_stories</span>
          <div style={{ flex: 1 }}>
            <p className={styles.hintTitle}>Kunci Sastra & Bunyi Aksara:</p>
            <p className={styles.hintText}>{activeRound.hint}</p>
            <p className={styles.hintSubText}>💡 {activeRound.meaning}</p>
          </div>
          <button
            type="button"
            className={styles.hintCloseBtn}
            onClick={() => setShowHint(false)}
            aria-label="Tutup petunjuk"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
          </button>
        </div>
      )}

      {/* 3. Story / Quest Banner */}
      <div className={styles.storyBanner}>
        <div className={styles.bannerIcon}>
          {roundIdx === 0 ? '📜' : roundIdx === 1 ? '🗿' : '👑'}
        </div>
        <div style={{ flex: 1 }}>
          <span className={styles.bannerBadge}>
            Babak {roundIdx + 1} dari 3 • {activeRound.title}
          </span>
          <h2 className={styles.bannerTitle}>{activeRound.subtitle}</h2>
        </div>
        <div className={styles.roundStepPills}>
          {AKSARA_ROUNDS.map((_, i) => (
            <span
              key={i}
              className={`${styles.roundDot} ${
                i === roundIdx
                  ? styles.roundDotActive
                  : i < roundIdx
                  ? styles.roundDotDone
                  : ''
              }`}
            />
          ))}
        </div>
      </div>

      {/* 4. Centerpiece Artifact Stage (Daun Lontar / Prasasti / Peti Emas) */}
      <div
        className={`${styles.artifactStage} ${
          styles[`stage_${activeRound.artifactType}`] || ''
        }`}
      >
        <div className={styles.stageOverlay} />

        <div className={styles.stageTopBar}>
          <div className={styles.stageBadge}>
            <span>{activeRound.mediaBadge}</span>
          </div>
          <div className={styles.stageSpeechBubble}>
            <span>{speechText}</span>
          </div>
        </div>

        {/* Central Ancient Inscription Plate */}
        <div className={styles.inscriptionContainer}>
          <div className={styles.inscriptionPlaque}>
            <div className={styles.plaqueTextureLine} />
            <div className={styles.plaqueHeader}>
              <span className={styles.plaqueLabel}>
                {roundIdx === 0
                  ? 'LEMBARAN RONTAL AJISAKA'
                  : roundIdx === 1
                  ? 'RELIEF BATUTULIS PAJAJARAN'
                  : 'SEGEL EMAS SASTRA NUSANTARA'}
              </span>
            </div>

            {/* Glowing Golden Glyphs Ribbon */}
            <div className={styles.glyphsRibbon}>
              {activeRound.slots.map((slot, idx) => {
                const placed = placedBlocks[idx];
                return (
                  <div
                    key={slot.id}
                    className={`${styles.glyphSlot} ${
                      placed ? styles.glyphSlotFilled : styles.glyphSlotEmpty
                    } ${isRoundSuccess ? styles.glyphSlotVictory : ''}`}
                    onClick={() => placed && handleRemoveBlock(idx)}
                    title={placed ? 'Ketuk untuk melepas aksara' : `Pasangkan ${slot.latin}`}
                  >
                    <div className={styles.glyphSlotHeader}>
                      <span>{slot.latin}</span>
                    </div>

                    <div className={styles.glyphSlotBody}>
                      {placed ? (
                        <div className={styles.placedGlyphWrapper}>
                          <span className={styles.placedAksaraChar}>{placed.char}</span>
                          <span className={styles.placedLatinTag}>{placed.latin}</span>
                          {!isRoundSuccess && <span className={styles.glyphRemoveTag}>✕</span>}
                        </div>
                      ) : (
                        <div className={styles.emptyGhostWrapper}>
                          <span className={styles.ghostGlyphChar}>{slot.targetChar}</span>
                          <span className={styles.ghostMeaning}>{slot.meaning}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 5. Feedback Notice */}
      {feedback && (
        <p
          className={`${styles.feedbackMsg} ${
            isRoundSuccess
              ? `${styles.feedbackSuccess} animate-celebrate-pop`
              : `${styles.feedbackError} animate-shake`
          }`}
        >
          {feedback}
        </p>
      )}

      {/* 6. Word Blocks / Script Tiles Deck */}
      <div className={styles.blocksSection}>
        <div className={styles.blocksHeader}>
          <span>Pilihan Ukiran Aksara Pusaka:</span>
          <span style={{ fontSize: '11px', color: '#64748b' }}>
            Tersusun: {placedBlocks.length}/{activeRound.slots.length}
          </span>
        </div>

        <div className={styles.blocksGrid}>
          {activeRound.blocks.map((block) => {
            const isUsed = placedBlocks.some((b) => b.id === block.id);
            return (
              <button
                key={block.id}
                type="button"
                onClick={() => handleSelectBlock(block)}
                disabled={isUsed || isRoundSuccess}
                className={`${styles.aksaraCardBtn} ${isUsed ? styles.aksaraCardBtnUsed : ''}`}
                title={`Pilih aksara ${block.char} (${block.latin})`}
              >
                <span className={styles.aksaraGlyphLg}>{block.char}</span>
                <span className={styles.aksaraLatinSm}>{block.latin}</span>
                <span className={styles.aksaraNameXs}>{block.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 7. Action Buttons */}
      {isRoundSuccess && !isAllComplete && (
        <button
          type="button"
          onClick={handleNextRound}
          className={`${styles.nextRoundBtn} animate-celebrate-pop`}
        >
          <span>Lanjut ke Babak {roundIdx + 2} dari 3</span>
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
        </button>
      )}

      {isAllComplete && (
        <button
          type="button"
          onClick={handleFinish}
          className={`${styles.finishBtn} animate-celebrate-pop`}
        >
          <span>👑</span>
          <span>Selesaikan Misi 03 Pusaka Aksara (+180 XP)</span>
        </button>
      )}
    </div>
  );
}
