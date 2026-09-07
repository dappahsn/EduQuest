import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { useAudio } from '../../context/AudioContext';
import styles from './StoryBuilder.module.css';

// ---------------------------------------------------------------------------
// PUZZLE DEFINITIONS
// ---------------------------------------------------------------------------

// MISI 01: Timun Mas & Buto Ijo
const MISSION_1_PUZZLE = {
  title: 'Legenda Timun Mas & Raksasa',
  targetSentence: 'Timun Mas menebarkan biji mentimun di tengah hutan.',
  blocks: [
    { id: 'subjek', text: 'Timun Mas', type: 'Subjek', role: 'Tokoh Utama' },
    { id: 'predikat', text: 'menebarkan', type: 'Predikat', role: 'Kata Kerja' },
    { id: 'objek', text: 'biji mentimun', type: 'Objek', role: 'Benda' },
    { id: 'keterangan', text: 'di tengah hutan', type: 'Keterangan', role: 'Tempat' }
  ],
  hint: 'Urutan kalimat bahasa Indonesia yang baik adalah: Subjek (Siapa) ➔ Predikat (Melakukan apa) ➔ Objek (Benda apa) ➔ Keterangan (Di mana)!'
};

// MISI 02: Susunan Kalimat Bahasa (Detektif SPOK 3 Babak)
const MISSION_2_ROUNDS = [
  {
    roundNumber: 1,
    title: 'Kisah Si Kancil & Buaya Sungai',
    targetSentence: 'Kancil melompati buaya berderet di sungai deras.',
    blocks: [
      { id: 'subjek', text: 'Kancil', type: 'Subjek', role: 'Tokoh Utama', guide: 'Siapa Pelakunya?' },
      { id: 'predikat', text: 'melompati', type: 'Predikat', role: 'Kata Kerja', guide: 'Apa Tindakannya?' },
      { id: 'objek', text: 'buaya berderet', type: 'Objek', role: 'Sasaran', guide: 'Apa Sasarannya?' },
      { id: 'keterangan', text: 'di sungai deras', type: 'Keterangan', role: 'Tempat', guide: 'Di Mana Tempatnya?' }
    ],
    hint: 'Subjek adalah Si Kancil yang cerdik. Predikat adalah aksinya melompati, Objek adalah buaya berderet, dan Keterangan tempat adalah di sungai deras!'
  },
  {
    roundNumber: 2,
    title: 'Legenda Burung Cendrawasih Emas',
    targetSentence: 'Cendrawasih mengepakkan sayap emas di pucuk beringin.',
    blocks: [
      { id: 'subjek', text: 'Cendrawasih', type: 'Subjek', role: 'Tokoh Utama', guide: 'Siapa Pelakunya?' },
      { id: 'predikat', text: 'mengepakkan', type: 'Predikat', role: 'Kata Kerja', guide: 'Apa Tindakannya?' },
      { id: 'objek', text: 'sayap emas', type: 'Objek', role: 'Sasaran', guide: 'Apa Sasarannya?' },
      { id: 'keterangan', text: 'di pucuk beringin', type: 'Keterangan', role: 'Tempat', guide: 'Di Mana Tempatnya?' }
    ],
    hint: 'Burung surga Cendrawasih (Subjek) sedang mengepakkan (Predikat) sayapnya yang berkilau (Objek) di atas dahan pohon beringin (Keterangan)!'
  },
  {
    roundNumber: 3,
    title: 'Kisah Pemuda Danau Sakti',
    targetSentence: 'Pemuda sakti merawat ikan mas ajaib di telaga bening.',
    blocks: [
      { id: 'subjek', text: 'Pemuda sakti', type: 'Subjek', role: 'Tokoh Utama', guide: 'Siapa Pelakunya?' },
      { id: 'predikat', text: 'merawat', type: 'Predikat', role: 'Kata Kerja', guide: 'Apa Tindakannya?' },
      { id: 'objek', text: 'ikan mas ajaib', type: 'Objek', role: 'Sasaran', guide: 'Apa Sasarannya?' },
      { id: 'keterangan', text: 'di telaga bening', type: 'Keterangan', role: 'Tempat', guide: 'Di Mana Tempatnya?' }
    ],
    hint: 'Tokoh utama adalah Pemuda sakti (Subjek). Tindakannya adalah merawat (Predikat) ikan mas ajaib (Objek) di telaga bening (Keterangan)!'
  }
];

// ---------------------------------------------------------------------------
// MISI 01 SCENE: AUTHENTIC TIMUN MAS & BUTO IJO
// ---------------------------------------------------------------------------
function TimunMasStoryScene({
  hasTimunMas,
  hasMenebarkan,
  hasBiji,
  hasHutan,
  isSuccess
}) {
  let speechText = '🏃 "Lari, Timun Mas! Raksasa mengejar!"';
  if (isSuccess) {
    speechText = '✨ "Hore! Raksasa terbelit timun, Timun Mas selamat!"';
  } else if (hasBiji) {
    speechText = '🥒 "Biji mentimun tumbuh jadi belukar duri lebat!"';
  } else if (hasMenebarkan) {
    speechText = '🌟 "Timun Mas menebarkan bekal biji sakti!"';
  } else if (hasTimunMas) {
    speechText = '🌸 "Timun Mas bersiap menghadapi raksasa!"';
  }

  return (
    <div className={styles.sceneCard}>
      <img
        src="/images/story-timun-mas-bg.jpg"
        alt="Hutan Belantara Nusantara"
        className={styles.sceneBgImg}
      />
      <div className={styles.mistOverlay} />

      <div className={styles.sceneTopBar}>
        <div className={styles.sceneStatusBadge}>
          <span>🌲</span>
          <span>Hutan Nusantara</span>
        </div>

        <div className={styles.sceneSpeechBubble}>
          <span>{speechText}</span>
        </div>
      </div>

      <div className={`${styles.characterSlot} ${styles.butoSlot}`}>
        <div
          className={`${styles.characterWrapper} ${
            hasBiji || isSuccess ? styles.butoTrappedAnim : styles.butoStompAnim
          }`}
        >
          <img
            src="/images/buto-ijo-giant.png?v=2"
            alt="Raksasa Buto Ijo"
            className={styles.butoImg}
          />
          {(hasBiji || isSuccess) && (
            <div className={styles.dizzyStars}>
              <span>💫</span>
              <span>😵</span>
              <span>💦</span>
            </div>
          )}
        </div>
        <div className={styles.namePill}>
          <span>Buto Ijo</span>
        </div>
      </div>

      <div className={`${styles.characterSlot} ${styles.timunSlot}`}>
        <div
          className={`${styles.characterWrapper} ${
            isSuccess ? styles.timunVictoryAnim : styles.timunRunAnim
          }`}
        >
          {hasTimunMas && <div className={styles.heroAura} />}
          <img
            src="/images/timun-mas-character.png"
            alt="Tokoh Utama Timun Mas"
            className={styles.timunImg}
          />
          {isSuccess && (
            <div className={styles.victorySparkles}>
              <span>✨</span>
              <span>🌟</span>
              <span>🎉</span>
            </div>
          )}
        </div>
        <div className={styles.namePill}>
          <span>Timun Mas</span>
        </div>
      </div>

      {hasMenebarkan && !hasBiji && !isSuccess && (
        <div className={styles.seedsStreamContainer}>
          <img
            src="/images/golden-seeds-stream.png?v=3"
            alt="Pancaran Biji Mentimun Ajaib"
            className={styles.seedsStreamImg}
          />
        </div>
      )}

      {(hasBiji || isSuccess) && (
        <div className={styles.vinesObstacleContainer}>
          <img
            src="/images/cucumber-vines-obstacle.png?v=3"
            alt="Belukar Mentimun Emas Berduri Raksasa"
            className={styles.vinesObstacleImg}
          />
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// MISI 02 SCENE 1: KANCIL & BUAYA SUNGAI (BABAK 1)
// ---------------------------------------------------------------------------
function KancilRiverScene({
  placedCount,
  isSuccess,
  speechText
}) {
  return (
    <div className={styles.sceneCard}>
      <img
        src="/images/story-kancil-buaya-bg.jpg"
        alt="Sungai Hutan Tropis Nusantara"
        className={styles.sceneBgImg}
      />
      <div className={styles.mistOverlay} />

      <div className={styles.sceneTopBar}>
        <div className={styles.sceneStatusBadge}>
          <span>🌊</span>
          <span>Sungai Rimba Nusantara</span>
        </div>

        <div className={styles.sceneSpeechBubble}>
          <span>{speechText}</span>
        </div>
      </div>

      {/* Floating River Crocodile */}
      <div className={styles.buayaSlot}>
        <div className={styles.buayaWrapper}>
          <img
            src="/images/buaya-character.png"
            alt="Buaya Sungai Ramah"
            className={styles.buayaImg}
          />
        </div>
        <div className={styles.namePill}>
          <span>Buaya Sungai</span>
        </div>
      </div>

      {/* Leaping Si Kancil with dynamic jump positions across stones */}
      <div
        className={`${styles.kancilSlot} ${
          styles[`kancilStep${placedCount}`] || styles.kancilStep0
        } ${isSuccess ? styles.kancilVictoryAnim : ''}`}
      >
        <div className={styles.characterWrapper}>
          <img
            src="/images/kancil-character.png"
            alt="Si Kancil Cerdik"
            className={styles.kancilImg}
          />
          {isSuccess && (
            <div className={styles.victorySparkles}>
              <span>✨</span>
              <span>🌟</span>
              <span>🎉</span>
            </div>
          )}
        </div>
        <div className={styles.namePill}>
          <span>Si Kancil</span>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MISI 02 SCENE 2: BURUNG CENDRAWASIH EMAS (BABAK 2)
// ---------------------------------------------------------------------------
function CendrawasihTreeScene({
  placedOrder,
  isSuccess,
  speechText
}) {
  const hasSubjek = placedOrder.some((b) => b.id === 'subjek');
  const hasPredikat = placedOrder.some((b) => b.id === 'predikat');
  const hasObjek = placedOrder.some((b) => b.id === 'objek');

  return (
    <div className={styles.sceneCard}>
      <img
        src="/images/story-cendrawasih-bg.jpg"
        alt="Pucuk Beringin Rimba Papua"
        className={styles.sceneBgImg}
      />
      <div className={styles.mistOverlay} />

      <div className={styles.sceneTopBar}>
        <div className={styles.sceneStatusBadge}>
          <span>🦜</span>
          <span>Pucuk Beringin Papua</span>
        </div>

        <div className={styles.sceneSpeechBubble}>
          <span>{speechText}</span>
        </div>
      </div>

      {/* Majestic Cendrawasih on the beringin branch */}
      <div className={styles.cendrawasihSlot}>
        <div
          className={`${styles.characterWrapper} ${
            isSuccess
              ? styles.cendrawasihVictoryDance
              : hasPredikat
              ? styles.cendrawasihFlapAnim
              : styles.cendrawasihGentleAnim
          }`}
        >
          {(hasObjek || isSuccess) && <div className={styles.goldenWingAura} />}
          {hasSubjek && <div className={styles.heroAura} />}
          <img
            src="/images/cendrawasih-character.png?v=5"
            alt="Burung Cendrawasih Emas"
            className={styles.cendrawasihImg}
          />
          {isSuccess && (
            <div className={styles.victorySparkles}>
              <span>✨</span>
              <span>🌟</span>
              <span>🪶</span>
            </div>
          )}
        </div>
        <div className={styles.namePill}>
          <span>Cendrawasih Emas</span>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MISI 02 SCENE 3: PEMUDA DANAU SAKTI & IKAN MAS (BABAK 3)
// ---------------------------------------------------------------------------
function DanauSaktiScene({
  placedOrder,
  isSuccess,
  speechText
}) {
  const hasSubjek = placedOrder.some((b) => b.id === 'subjek');
  const hasPredikat = placedOrder.some((b) => b.id === 'predikat');
  const hasObjek = placedOrder.some((b) => b.id === 'objek');

  return (
    <div className={styles.sceneCard}>
      <img
        src="/images/story-danau-sakti-bg.jpg"
        alt="Telaga Bening Sakti Nusantara"
        className={styles.sceneBgImg}
      />
      <div className={styles.mistOverlay} />

      <div className={styles.sceneTopBar}>
        <div className={styles.sceneStatusBadge}>
          <span>🏞️</span>
          <span>Telaga Bening Sakti</span>
        </div>

        <div className={styles.sceneSpeechBubble}>
          <span>{speechText}</span>
        </div>
      </div>

      {/* Pemuda Sakti on Grassy Bank */}
      <div className={styles.pemudaSlot}>
        <div
          className={`${styles.characterWrapper} ${
            hasPredikat || isSuccess ? styles.pemudaCareAnim : styles.pemudaGentleAnim
          }`}
        >
          {hasSubjek && <div className={styles.heroAura} />}
          <img
            src="/images/pemuda-character.png?v=5"
            alt="Pemuda Sakti Nusantara"
            className={styles.pemudaImg}
          />
          {isSuccess && (
            <div className={styles.victorySparkles}>
              <span>✨</span>
              <span>🌟</span>
              <span>🌸</span>
            </div>
          )}
        </div>
        <div className={styles.namePill}>
          <span>Pemuda Sakti</span>
        </div>
      </div>

      {/* Ikan Mas Ajaib in Clear Lake Water */}
      <div className={styles.ikanMasSlot}>
        <div
          className={`${styles.characterWrapper} ${
            isSuccess
              ? styles.ikanMasLeapAnim
              : hasObjek
              ? styles.ikanMasSwimAnim
              : styles.ikanMasSubmergedAnim
          }`}
        >
          {(hasObjek || isSuccess) && <div className={styles.goldenFishGlow} />}
          <div className={styles.waterRipple} />
          <img
            src="/images/ikan-mas-character.png?v=5"
            alt="Ikan Mas Ajaib Bersisik Emas"
            className={styles.ikanMasImg}
          />
          {(hasObjek || isSuccess) && (
            <div className={styles.waterSplashes}>
              <span>💧</span>
              <span>✨</span>
            </div>
          )}
        </div>
        <div className={styles.namePill}>
          <span>Ikan Mas Ajaib</span>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MAIN STORYBUILDER COMPONENT (SUPPORTS MISI 01 & MISI 02)
// ---------------------------------------------------------------------------
export default function StoryBuilder({ onGameComplete = null, questId: propQuestId }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const targetQuestId = propQuestId || searchParams.get('questId') || 'quest-nc-1';
  const { completeQuest } = useGame();
  const { playSfx } = useAudio();

  // Detect Mission Type
  const isMission2 = targetQuestId === 'quest-nc-2' || targetQuestId === 'cerita-02';

  // Mission 2 State
  const [roundIdx, setRoundIdx] = useState(0);
  const [isRoundSuccess, setIsRoundSuccess] = useState(false);
  const [isAllComplete, setIsAllComplete] = useState(false);

  // Common State
  const [selectedOrder, setSelectedOrder] = useState([]);
  const [isSuccess, setIsSuccess] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [showHint, setShowHint] = useState(false);

  // Current Puzzle Data
  const currentMission2Round = MISSION_2_ROUNDS[roundIdx] || MISSION_2_ROUNDS[0];
  const activePuzzle = isMission2 ? currentMission2Round : MISSION_1_PUZZLE;

  // Scene animation tracking (Misi 1)
  const hasTimunMas = selectedOrder.some((b) => b.id === 'subjek');
  const hasMenebarkan = selectedOrder.some((b) => b.id === 'predikat');
  const hasBiji = selectedOrder.some((b) => b.id === 'objek');
  const hasHutan = selectedOrder.some((b) => b.id === 'keterangan');

  // Dynamic speech text for Misi 2 (customized per round)
  let mission2SpeechText = '';
  if (roundIdx === 0) {
    if (isRoundSuccess) {
      mission2SpeechText = '🎉 "Hore! Kancil berhasil melompati buaya dan menyeberang!"';
    } else if (selectedOrder.length === 3) {
      mission2SpeechText = '✨ "Kancil hampir sampai di seberang, tinggal sebut tempatnya!"';
    } else if (selectedOrder.length === 2) {
      mission2SpeechText = '🐊 "Kancil melompat tepat di atas punggung buaya!"';
    } else if (selectedOrder.length === 1) {
      mission2SpeechText = '🌿 "Kancil bersiap di tepi sungai mengambil ancang-ancang!"';
    } else {
      mission2SpeechText = '🦌 "Kancil ingin menyeberang! Susun kalimat SPOK untuk melompat!"';
    }
  } else if (roundIdx === 1) {
    if (isRoundSuccess) {
      mission2SpeechText = '👑 "Indah sekali! Cendrawasih menari megah di pucuk beringin!"';
    } else if (selectedOrder.length === 3) {
      mission2SpeechText = '🌟 "Kilauan sayap emas tampak memukau di atas dahan beringin!"';
    } else if (selectedOrder.length === 2) {
      mission2SpeechText = '🦅 "Aksi mengepakkan sayap mulai berkibar megah!"';
    } else if (selectedOrder.length === 1) {
      mission2SpeechText = '✨ "Tokoh Cendrawasih telah siap di pucuk beringin!"';
    } else {
      mission2SpeechText = '🪶 "Cendrawasih bersiap di pucuk beringin! Susun kalimat SPOK!"';
    }
  } else {
    if (isRoundSuccess) {
      mission2SpeechText = '🏆 "Luar biasa! Kisah telaga bening tersusun dengan sempurna!"';
    } else if (selectedOrder.length === 3) {
      mission2SpeechText = '✨ "Ikan mas ajaib bersisik emas menyembul ke permukaan air!"';
    } else if (selectedOrder.length === 2) {
      mission2SpeechText = '🤲 "Tindakan merawat penuh kasih mulai dilakukan di telaga!"';
    } else if (selectedOrder.length === 1) {
      mission2SpeechText = '👤 "Tokoh Pemuda sakti tiba di tepian telaga bening!"';
    } else {
      mission2SpeechText = '🐟 "Pemuda sakti bersiap merawat ikan mas ajaib di telaga bening!"';
    }
  }

  function addBlock(block) {
    if (selectedOrder.some((b) => b.id === block.id)) return;
    playSfx('button-click');

    const nextOrder = [...selectedOrder, block];
    setSelectedOrder(nextOrder);

    if (nextOrder.length === 4) {
      const correct =
        nextOrder[0].id === 'subjek' &&
        nextOrder[1].id === 'predikat' &&
        nextOrder[2].id === 'objek' &&
        nextOrder[3].id === 'keterangan';

      if (correct) {
        playSfx('correct');
        if (isMission2) {
          setIsRoundSuccess(true);
          if (roundIdx === MISSION_2_ROUNDS.length - 1) {
            setIsAllComplete(true);
            setFeedback('🏆 Luar biasa! Seluruh formula SPOK Nusantara berhasil kamu kuasai!');
          } else {
            setFeedback('✨ Hebat! Kalimat tersusun sempurna: Subjek (Tokoh) ➔ Predikat (Aksi) ➔ Objek (Sasaran) ➔ Keterangan (Tempat)!');
          }
        } else {
          setIsSuccess(true);
          setFeedback('✨ Hebat! Kisah tersusun indah: Tokoh (Subjek) ➔ Tindakan (Predikat) ➔ Benda (Objek) ➔ Tempat (Keterangan)!');
        }
      } else {
        playSfx('wrong');
        setFeedback('Urutan kalimat belum tepat. Ingat kaidah SPOK: Tokoh (S) ➔ Aksi (P) ➔ Sasaran (O) ➔ Keterangan (K)!');
      }
    }
  }

  function removeBlock(block) {
    if (isSuccess || isRoundSuccess) return;
    playSfx('button-click');
    setSelectedOrder(selectedOrder.filter((b) => b.id !== block.id));
    setFeedback('');
  }

  function handleNextRound() {
    playSfx('button-click');
    if (roundIdx < MISSION_2_ROUNDS.length - 1) {
      setRoundIdx(roundIdx + 1);
      setSelectedOrder([]);
      setIsRoundSuccess(false);
      setFeedback('');
      setShowHint(false);
    }
  }

  function handleReset() {
    playSfx('button-click');
    setSelectedOrder([]);
    setIsSuccess(false);
    setIsRoundSuccess(false);
    setFeedback('');
    setShowHint(false);
  }

  function handleFinish() {
    playSfx('quest-complete');
    if (isMission2) {
      completeQuest('quest-nc-2', 160, 50, 40, 'card-sastra');
    } else {
      completeQuest('quest-nc-1', 150, 40, 40, 'card-rainforest');
    }
    if (onGameComplete) {
      onGameComplete();
    } else {
      navigate(`/quest/${targetQuestId}/result`);
    }
  }

  return (
    <div className={styles.container}>
      {/* Header Bar */}
      <section className={styles.headerRow}>
        <div className={styles.categoryBadge}>
          <span className={`material-symbols-outlined ${styles.categoryIcon}`}>auto_stories</span>
          <span className={styles.categoryTitle}>Negeri Cerita</span>
          <span className={styles.categoryDivider}>•</span>
          <span className={styles.categorySub}>
            {isMission2 ? `Misi 02 • Babak ${roundIdx + 1}/3` : 'Misi Literasi 01'}
          </span>
        </div>

        <div className={styles.headerActions}>
          <button
            type="button"
            className={styles.headerBtn}
            onClick={() => {
              playSfx('hint');
              setShowHint(!showHint);
            }}
            title="Buka petunjuk susunan kalimat"
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
            title="Atur ulang kata"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
              restart_alt
            </span>
            <span>Ulangi</span>
          </button>
        </div>
      </section>

      {/* Hint Accordion */}
      {showHint && (
        <div className={styles.hintBox}>
          <span className={`material-symbols-outlined ${styles.hintIcon}`}>psychology_alt</span>
          <div style={{ flex: 1 }}>
            <p className={styles.hintTitle}>Tips Menyusun Kalimat Nusantara:</p>
            <p className={styles.hintText}>{activePuzzle.hint}</p>
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

      {/* Story Banner */}
      <div className={styles.storyBanner}>
        <div className={styles.bannerIcon}>
          {isMission2 ? '✍️' : '📜'}
        </div>
        <div style={{ flex: 1 }}>
          <span className={styles.bannerBadge}>
            {isMission2 ? `Menyusun Kalimat SPOK • Babak ${roundIdx + 1} dari 3` : 'Menyusun Kisah Nusantara'}
          </span>
          <h2 className={styles.bannerTitle}>{activePuzzle.title}</h2>
        </div>
        {isMission2 && (
          <div className={styles.roundStepPills}>
            {MISSION_2_ROUNDS.map((_, i) => (
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
        )}
      </div>

      {/* 🌟 STORY SCENE 🌟 */}
      {isMission2 ? (
        roundIdx === 0 ? (
          <KancilRiverScene
            placedCount={selectedOrder.length}
            isSuccess={isRoundSuccess}
            speechText={mission2SpeechText}
          />
        ) : roundIdx === 1 ? (
          <CendrawasihTreeScene
            placedOrder={selectedOrder}
            isSuccess={isRoundSuccess}
            speechText={mission2SpeechText}
          />
        ) : (
          <DanauSaktiScene
            placedOrder={selectedOrder}
            isSuccess={isRoundSuccess}
            speechText={mission2SpeechText}
          />
        )
      ) : (
        <TimunMasStoryScene
          hasTimunMas={hasTimunMas}
          hasMenebarkan={hasMenebarkan}
          hasBiji={hasBiji}
          hasHutan={hasHutan}
          isSuccess={isSuccess}
        />
      )}

      {/* SPOK ALTAIR SLOTS (MISI 02) OR SENTENCE TRAY (MISI 01) */}
      {isMission2 ? (
        <div className={styles.spokAltar}>
          {[
            { id: 'subjek', label: 'S • SUBJEK', guide: 'Siapa Pelakunya?', color: styles.slotS },
            { id: 'predikat', label: 'P • PREDIKAT', guide: 'Apa Aksinya?', color: styles.slotP },
            { id: 'objek', label: 'O • OBJEK', guide: 'Apa Sasarannya?', color: styles.slotO },
            { id: 'keterangan', label: 'K • KETERANGAN', guide: 'Di Mana / Kapan?', color: styles.slotK }
          ].map((slot, idx) => {
            const placed = selectedOrder[idx];
            return (
              <div
                key={slot.id}
                className={`${styles.spokSlot} ${slot.color} ${placed ? styles.spokSlotFilled : ''}`}
                onClick={() => placed && removeBlock(placed)}
                title={placed ? 'Ketuk untuk mengembalikan kata' : slot.guide}
              >
                <div className={styles.spokSlotHeader}>
                  <span>{slot.label}</span>
                </div>
                {placed ? (
                  <div className={styles.spokPlacedContent}>
                    <span className={styles.spokPlacedText}>{placed.text}</span>
                    {!isRoundSuccess && <span className={styles.spokRemoveTag}>✕</span>}
                  </div>
                ) : (
                  <span className={styles.spokSlotGuide}>{slot.guide}</span>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div
          className={`${styles.sentenceCanvas} ${
            isSuccess
              ? styles.sentenceCanvasSuccess
              : selectedOrder.length > 0
              ? styles.sentenceCanvasActive
              : ''
          }`}
        >
          {selectedOrder.length === 0 ? (
            <span className={styles.emptyPlaceholder}>
              Ketuk potongan kata di bawah untuk menyusun kalimat cerita!
            </span>
          ) : (
            <div className={styles.wordsTray}>
              {selectedOrder.map((b) => (
                <div
                  key={b.id}
                  className={styles.placedWordPill}
                  onClick={() => removeBlock(b)}
                  title="Ketuk untuk mengembalikan kata"
                  style={{ cursor: isSuccess ? 'default' : 'pointer' }}
                >
                  <span className={styles.roleTag}>{b.type} ({b.role})</span>
                  <span className={styles.placedWordText}>{b.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Feedback Message */}
      {feedback && (
        <p
          className={`${styles.feedbackMsg} ${
            isSuccess || isRoundSuccess
              ? `${styles.feedbackSuccess} animate-celebrate-pop`
              : `${styles.feedbackError} animate-shake`
          }`}
        >
          {feedback}
        </p>
      )}

      {/* Available Word Blocks */}
      <div className={styles.blocksSection}>
        <div className={styles.blocksHeader}>
          <span>Pilihan Balok Kata ({isMission2 ? `Babak ${roundIdx + 1}` : 'Nusantara'}):</span>
          {selectedOrder.length > 0 && (
            <span style={{ fontSize: '11px', color: '#64748b' }}>
              Tersusun: {selectedOrder.length}/4
            </span>
          )}
        </div>

        <div className={styles.blocksGrid}>
          {activePuzzle.blocks.map((block) => {
            const isUsed = selectedOrder.some((b) => b.id === block.id);
            return (
              <button
                key={block.id}
                type="button"
                onClick={() => addBlock(block)}
                disabled={isUsed || isSuccess || isRoundSuccess}
                className={`${styles.wordBlockBtn} ${styles[`block_${block.id}`] || ''} ${
                  isUsed ? styles.wordBlockBtnUsed : ''
                }`}
                title={`Pilih kata: ${block.text} (${block.role})`}
              >
                <span className={styles.blockTypeTag}>{block.type} • {block.role}</span>
                <span className={styles.blockLabel}>{block.text}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Completion / Next Round Buttons */}
      {isMission2 && isRoundSuccess && !isAllComplete && (
        <button
          type="button"
          onClick={handleNextRound}
          className={`${styles.nextRoundBtn} animate-celebrate-pop`}
        >
          <span>Lanjut ke Babak {roundIdx + 2} dari 3</span>
          <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
        </button>
      )}

      {((!isMission2 && isSuccess) || (isMission2 && isAllComplete)) && (
        <button
          type="button"
          onClick={handleFinish}
          className={`${styles.finishBtn} animate-celebrate-pop`}
        >
          <span>🏆</span>
          <span>
            {isMission2 ? 'Selesaikan Misi 02 (+160 XP)' : 'Kisah Berhasil Disusun! Selesaikan Misi (+150 XP)'}
          </span>
        </button>
      )}
    </div>
  );
}

