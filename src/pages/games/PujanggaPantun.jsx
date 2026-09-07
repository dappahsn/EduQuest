import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import { useAudio } from '../../context/AudioContext';
import styles from './PujanggaPantun.module.css';

// 3 Babak Pantun Tradisional Nusantara
const ROUNDS_DATA = [
  {
    id: 'round-1',
    roundNum: 1,
    title: 'Pantun Nasihat Menuntut Ilmu',
    instruction: 'Lengkapi 2 baris Isi agar bersajak silang a-b-a-b (-man & -ri)!',
    theme: 'nasihat',
    badge: 'Nasihat Bijak',
    fixedLines: [
      { num: 1, type: 'sampiran', text: 'Bunga melati mekar di taman,', rhyme: '-man', rhymeGroup: 'A' },
      { num: 2, type: 'sampiran', text: 'Harum semerbak di pagi hari.', rhyme: '-ri', rhymeGroup: 'B' }
    ],
    targetSlots: [
      {
        slotIndex: 0,
        lineNum: 3,
        type: 'isi',
        label: 'Pilih larik berima -man...',
        expectedRhyme: 'A',
        expectedId: 'opt-1-correct'
      },
      {
        slotIndex: 1,
        lineNum: 4,
        type: 'isi',
        label: 'Pilih larik berima -ri...',
        expectedRhyme: 'B',
        expectedId: 'opt-2-correct'
      }
    ],
    options: [
      {
        id: 'opt-1-correct',
        text: 'Tuntutlah ilmu wahai kawan,',
        rhyme: '-man',
        rhymeGroup: 'A'
      },
      {
        id: 'opt-2-correct',
        text: 'Bekal hidup di kemudian hari.',
        rhyme: '-ri',
        rhymeGroup: 'B'
      },
      {
        id: 'opt-distract-1',
        text: 'Mari bermain layang-layang,',
        rhyme: '-ang',
        rhymeGroup: 'C'
      },
      {
        id: 'opt-distract-2',
        text: 'Sungai mengalir sangat jernih,',
        rhyme: '-nih',
        rhymeGroup: 'D'
      }
    ],
    explanation: 'Hebat! Rima silang a-b-a-b terangkai indah: taman (-man), hari (-ri), kawan (-man), dan hari (-ri).',
    moralMeaning: 'Menuntut ilmu sejak dini adalah bekal paling utama untuk menyongsong masa depan cerah.'
  },
  {
    id: 'round-2',
    roundNum: 2,
    title: 'Pantun Teka-Teki Satwa Rimba',
    instruction: 'Lengkapi isi teka-teki bersajak silang (-bat & -kan)!',
    theme: 'tekateki',
    badge: 'Teka-Teki Jenaka',
    fixedLines: [
      { num: 1, type: 'sampiran', text: 'Pohon jati daunnya lebat,', rhyme: '-bat', rhymeGroup: 'A' },
      { num: 2, type: 'sampiran', text: 'Kancil melompat mencari makan.', rhyme: '-kan', rhymeGroup: 'B' }
    ],
    targetSlots: [
      {
        slotIndex: 0,
        lineNum: 3,
        type: 'isi',
        label: 'Pilih larik berima -bat...',
        expectedRhyme: 'A',
        expectedId: 'opt-r2-1'
      },
      {
        slotIndex: 1,
        lineNum: 4,
        type: 'isi',
        label: 'Pilih larik berima -kan...',
        expectedRhyme: 'B',
        expectedId: 'opt-r2-2'
      }
    ],
    options: [
      {
        id: 'opt-r2-1',
        text: 'Punya belalai badannya hebat,',
        rhyme: '-bat',
        rhymeGroup: 'A'
      },
      {
        id: 'opt-r2-2',
        text: 'Hewan apakah yang disebutkan?',
        rhyme: '-kan',
        rhymeGroup: 'B'
      },
      {
        id: 'opt-r2-distract-1',
        text: 'Burung elang terbang melayang,',
        rhyme: '-ang',
        rhymeGroup: 'C'
      },
      {
        id: 'opt-r2-distract-2',
        text: 'Ikan berenang di telaga biru,',
        rhyme: '-ru',
        rhymeGroup: 'E'
      }
    ],
    riddleAnswer: '🐘 Jawabannya adalah Gajah Sumatera yang gagah!',
    explanation: 'Tepat sekali! Rima lebat (-bat) berpasangan dengan hebat (-bat), serta makan (-kan) dengan disebutkan (-kan).',
    moralMeaning: 'Pantun teka-teki melatih ketajaman berpikir dan memperkaya imajinasi dengan gembira.'
  },
  {
    id: 'round-3',
    roundNum: 3,
    title: 'Pantun Budi Pekerti Leluhur',
    instruction: 'Susun ke-4 baris pantun secara utuh (Sampiran 1 & 2, lalu Isi 1 & 2)!',
    theme: 'budipekerti',
    badge: 'Pujangga Agung',
    fixedLines: [],
    targetSlots: [
      { slotIndex: 0, lineNum: 1, type: 'sampiran', label: '1. Sampiran Rima -ti...', expectedId: 'opt-r3-1' },
      { slotIndex: 1, lineNum: 2, type: 'sampiran', label: '2. Sampiran Rima -ka...', expectedId: 'opt-r3-2' },
      { slotIndex: 2, lineNum: 3, type: 'isi', label: '3. Isi Rima -ti...', expectedId: 'opt-r3-3' },
      { slotIndex: 3, lineNum: 4, type: 'isi', label: '4. Isi Rima -ka...', expectedId: 'opt-r3-4' }
    ],
    options: [
      {
        id: 'opt-r3-1',
        text: 'Kayu cendana dibuat peti,',
        rhyme: '-ti',
        rhymeGroup: 'A'
      },
      {
        id: 'opt-r3-2',
        text: 'Layar terkembang menuju Malaka.',
        rhyme: '-ka',
        rhymeGroup: 'B'
      },
      {
        id: 'opt-r3-3',
        text: 'Jika selalu rendah hati,',
        rhyme: '-ti',
        rhymeGroup: 'A'
      },
      {
        id: 'opt-r3-4',
        text: 'Pasti selamat dijauhkan petaka.',
        rhyme: '-ka',
        rhymeGroup: 'B'
      }
    ],
    explanation: 'Sempurna! Kamu telah merangkai bait Pantun Kencana utuh dengan keselarasan rima -ti dan -ka.',
    moralMeaning: 'Sikap rendah hati dan santun membawa keselamatan dan kedamaian hidup di mana pun berada.'
  }
];

export default function PujanggaPantun({ questId: propQuestId }) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { completeQuest } = useGame();
  const { playSfx } = useAudio();

  const targetQuestId = propQuestId || searchParams.get('questId') || 'quest-nc-3';

  // Game States
  const [currentRoundIdx, setCurrentRoundIdx] = useState(0);
  const currentRound = ROUNDS_DATA[currentRoundIdx];

  // Placed options in slots: array of option objects or null
  const [placedSlots, setPlacedSlots] = useState([]);
  // Available options in pool (shuffled)
  const [availableOptions, setAvailableOptions] = useState([]);
  
  const [isVerifying, setIsVerifying] = useState(false);
  const [isWrongShake, setIsWrongShake] = useState(false);
  const [showRoundSuccess, setShowRoundSuccess] = useState(false);
  const [showGameComplete, setShowGameComplete] = useState(false);
  const [hintMessage, setHintMessage] = useState('');
  const [showHint, setShowHint] = useState(false);

  // Initialize or reset round
  const initRound = useCallback((roundIdx) => {
    const round = ROUNDS_DATA[roundIdx];
    const initialSlots = new Array(round.targetSlots.length).fill(null);
    setPlacedSlots(initialSlots);

    // Shuffle options
    const shuffled = [...round.options].sort(() => Math.random() - 0.5);
    setAvailableOptions(shuffled);
    setShowRoundSuccess(false);
    setIsWrongShake(false);
    setShowHint(false);
    setHintMessage('');
  }, []);

  useEffect(() => {
    initRound(currentRoundIdx);
  }, [currentRoundIdx, initRound]);

  // Handle placing an option into the first available slot
  const handleSelectOption = (option) => {
    playSfx('button-click');
    const firstEmptyIndex = placedSlots.findIndex((slot) => slot === null);
    if (firstEmptyIndex === -1) {
      return;
    }

    const nextSlots = [...placedSlots];
    nextSlots[firstEmptyIndex] = option;
    setPlacedSlots(nextSlots);

    // Remove from available options
    setAvailableOptions((prev) => prev.filter((item) => item.id !== option.id));
  };

  // Handle removing an option from a slot back to pool
  const handleRemoveFromSlot = (slotIdx) => {
    const itemToRemove = placedSlots[slotIdx];
    if (!itemToRemove) return;

    playSfx('button-hover');
    const nextSlots = [...placedSlots];
    nextSlots[slotIdx] = null;
    setPlacedSlots(nextSlots);

    setAvailableOptions((prev) => [...prev, itemToRemove]);
  };

  // Reset all current round slots
  const handleResetSlots = () => {
    playSfx('button-hover');
    initRound(currentRoundIdx);
  };

  // Provide hint
  const handleShowHint = () => {
    playSfx('hint');
    if (currentRoundIdx === 0) {
      setHintMessage('💡 Pasangkan rima: taman (-man) dengan kawan (-man), dan hari (-ri) dengan kemudian hari (-ri)!');
    } else if (currentRoundIdx === 1) {
      setHintMessage('💡 Pasangkan rima: lebat (-bat) dengan hebat (-bat), dan makan (-kan) dengan disebutkan (-kan)!');
    } else {
      setHintMessage('💡 Baris 1 & 2 adalah sampiran (cendana & Malaka). Baris 3 & 4 adalah pesan nasihat (rendah hati & petaka)!');
    }
    setShowHint((prev) => !prev);
  };

  // Check arrangement
  const handleCheckAnswer = () => {
    const hasEmptySlot = placedSlots.some((slot) => slot === null);
    if (hasEmptySlot) {
      playSfx('wrong');
      setIsWrongShake(true);
      setTimeout(() => setIsWrongShake(false), 500);
      setHintMessage('⚠️ Lengkapi semua baris pantun yang kosong terlebih dahulu!');
      setShowHint(true);
      return;
    }

    setIsVerifying(true);

    const isAllCorrect = currentRound.targetSlots.every(
      (slotConfig, idx) => placedSlots[idx]?.id === slotConfig.expectedId
    );

    if (isAllCorrect) {
      playSfx('correct');
      setShowRoundSuccess(true);
    } else {
      playSfx('wrong');
      setIsWrongShake(true);
      setTimeout(() => setIsWrongShake(false), 500);
      setHintMessage('❌ Rima atau urutannya belum pas. Coba cermati bunyi suku kata terakhirnya!');
      setShowHint(true);
    }

    setIsVerifying(false);
  };

  // Next round or complete
  const handleNextRound = () => {
    if (currentRoundIdx < ROUNDS_DATA.length - 1) {
      playSfx('level-up');
      setCurrentRoundIdx((prev) => prev + 1);
    } else {
      handleFinishGame();
    }
  };

  const handleFinishGame = () => {
    playSfx('quest-complete');
    setShowGameComplete(true);
    completeQuest('quest-nc-3', 180, 60, 50, 'card-pantun');
  };

  return (
    <div className={styles.gameWrapper}>
      {/* Top Controls Bar (Compact) */}
      <div className={styles.topBar}>
        <div className={styles.roundInfoWrap}>
          <span className={styles.roundBadge}>Babak {currentRound.roundNum} / 3</span>
          <h2 className={styles.roundTitle}>{currentRound.title}</h2>
        </div>

        <div className={styles.topActions}>
          <button
            type="button"
            className={`${styles.topBtn} ${showHint ? styles.topBtnActive : ''}`}
            onClick={handleShowHint}
            title="Lihat Petunjuk Rima"
          >
            <span className={styles.btnIconEmoji}>💡</span>
            <span className={styles.btnLabel}>Petunjuk</span>
          </button>
          <button
            type="button"
            className={styles.topBtn}
            onClick={handleResetSlots}
            title="Atur Ulang Pilihan"
          >
            <span className={styles.btnIconEmoji}>↺</span>
            <span className={styles.btnLabel}>Ulangi</span>
          </button>
        </div>
      </div>

      {/* Instruction & Hint Toast */}
      {showHint ? (
        <div className={styles.hintBox}>
          <span className={styles.hintEmoji}>💡</span>
          <span className={styles.hintText}>{hintMessage}</span>
          <button
            type="button"
            className={styles.hintCloseBtn}
            onClick={() => setShowHint(false)}
          >
            ✕
          </button>
        </div>
      ) : (
        <div className={styles.instructionBanner}>
          <span className={styles.instructionIcon}>🪶</span>
          <span className={styles.instructionText}>{currentRound.instruction}</span>
        </div>
      )}

      {/* Pantun Parchment Board (4 Verse Lines) */}
      <div className={`${styles.parchmentBoard} ${isWrongShake ? styles.shakeAnim : ''}`}>
        <div className={styles.parchmentHeader}>
          <span className={styles.parchmentDeco}>✦</span>
          <span className={styles.parchmentTitle}>Bait Pantun Empat Seuntai</span>
          <span className={styles.parchmentDeco}>✦</span>
        </div>

        <div className={styles.verseRowsContainer}>
          {/* Fixed Lines (for Round 1 & 2) */}
          {currentRound.fixedLines.map((fl) => (
            <div key={fl.num} className={styles.verseLineFixed}>
              <div className={styles.lineLeftPill}>
                <span className={styles.lineIndexNumber}>{fl.num}</span>
                <span className={styles.lineRoleText}>
                  {fl.type === 'sampiran' ? 'Sampiran' : 'Isi'}
                </span>
              </div>
              <div className={styles.lineVerseText}>{fl.text}</div>
              <div className={`${styles.rhymePill} ${styles['rhyme_' + fl.rhymeGroup]}`}>
                {fl.rhyme}
              </div>
            </div>
          ))}

          {/* Interactive Target Slots */}
          {currentRound.targetSlots.map((slotConf, idx) => {
            const placedItem = placedSlots[idx];
            return (
              <div
                key={slotConf.slotIndex}
                className={`${styles.verseLineSlot} ${placedItem ? styles.slotOccupied : styles.slotVacant}`}
                onClick={() => placedItem && handleRemoveFromSlot(idx)}
                title={placedItem ? 'Ketuk untuk melepas baris ini' : 'Slot kosong'}
              >
                <div className={styles.lineLeftPill}>
                  <span className={styles.lineIndexNumber}>{slotConf.lineNum}</span>
                  <span className={styles.lineRoleText}>
                    {slotConf.type === 'sampiran' ? 'Sampiran' : 'Isi'}
                  </span>
                </div>

                {placedItem ? (
                  <>
                    <div className={styles.lineVerseTextOccupied}>{placedItem.text}</div>
                    <div className={styles.occupiedRightWrap}>
                      <span className={`${styles.rhymePill} ${styles['rhyme_' + placedItem.rhymeGroup]}`}>
                        {placedItem.rhyme}
                      </span>
                      <span className={styles.removePill} title="Hapus">✕</span>
                    </div>
                  </>
                ) : (
                  <div className={styles.slotVacantPrompt}>
                    <span className={styles.promptDashed}>{slotConf.label}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Options Pool */}
      <div className={styles.optionsSection}>
        <div className={styles.optionsSectionHeader}>
          <span className={styles.sectionHeaderTitle}>
            Pilihan Larik Bait (Ketuk untuk mengisi slot):
          </span>
        </div>

        <div className={styles.optionsGrid}>
          {availableOptions.length > 0 ? (
            availableOptions.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className={styles.optionCardBtn}
                onClick={() => handleSelectOption(opt)}
              >
                <span className={styles.optionVerseText}>{opt.text}</span>
                <span className={`${styles.rhymePillSm} ${styles['rhyme_' + opt.rhymeGroup]}`}>
                  {opt.rhyme}
                </span>
              </button>
            ))
          ) : (
            <div className={styles.allPlacedMsg}>
              <span>✨ Semua baris telah terisi! Tekan "Cek Keselarasan" di bawah.</span>
            </div>
          )}
        </div>
      </div>

      {/* Verify Button (Always Visible at Bottom) */}
      <div className={styles.bottomBar}>
        <button
          type="button"
          className={styles.btnCheckAnswer}
          onClick={handleCheckAnswer}
          disabled={isVerifying || placedSlots.every((s) => s === null)}
        >
          <span>Cek Keselarasan Pantun</span>
          <span className={styles.btnCheckIcon}>✓</span>
        </button>
      </div>

      {/* Round Success Modal */}
      {showRoundSuccess && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard}>
            <div className={styles.modalHeaderIcon}>✨</div>
            <span className={styles.modalBadge}>Bait Selaras & Sempurna!</span>
            <h3 className={styles.modalTitle}>{currentRound.title}</h3>

            <div className={styles.modalPoemBox}>
              {currentRound.fixedLines.map((fl) => (
                <p key={fl.num} className={styles.modalPoemLine}>
                  {fl.text}
                </p>
              ))}
              {placedSlots.map((ps, idx) => (
                <p key={idx} className={styles.modalPoemLineHighlight}>
                  {ps?.text}
                </p>
              ))}
            </div>

            {currentRound.riddleAnswer && (
              <div className={styles.modalRiddleBox}>
                <span>{currentRound.riddleAnswer}</span>
              </div>
            )}

            <div className={styles.modalMoralBox}>
              <strong>Makna Nasihat:</strong> {currentRound.moralMeaning}
            </div>

            <button
              type="button"
              className={styles.btnModalContinue}
              onClick={handleNextRound}
            >
              <span>{currentRoundIdx < ROUNDS_DATA.length - 1 ? 'Lanjut ke Babak Berikutnya ➔' : 'Selesaikan Misi Pujangga 🏆'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Final Quest Complete Modal */}
      {showGameComplete && (
        <div className={styles.modalOverlay}>
          <div className={styles.completeModalCard}>
            <div className={styles.completeTrophy}>👑</div>
            <span className={styles.completeSubtitle}>Misi Sastra Terselesaikan!</span>
            <h2 className={styles.completeHeading}>Pujangga Agung Nusantara</h2>
            <p className={styles.completeDesc}>
              Hebat sekali! Kamu telah menuntaskan seluruh tantangan pantun, menguasai sampiran & isi, serta rima bersilang warisan budaya leluhur.
            </p>

            <div className={styles.completeRewardGrid}>
              <div className={styles.completeRewardItem}>
                <span className={styles.rewardNum}>+180</span>
                <span className={styles.rewardText}>XP Sastra</span>
              </div>
              <div className={styles.completeRewardItem}>
                <span className={styles.rewardNum}>+60</span>
                <span className={styles.rewardText}>Koin Emas</span>
              </div>
              <div className={styles.completeRewardItem}>
                <span className={styles.rewardNum}>🪶</span>
                <span className={styles.rewardText}>Pena Emas</span>
              </div>
              <div className={styles.completeRewardItem}>
                <span className={styles.rewardNum}>📜</span>
                <span className={styles.rewardText}>Kartu Pantun</span>
              </div>
            </div>

            <div className={styles.completeActions}>
              <button
                type="button"
                className={styles.btnCompletePrimary}
                onClick={() => navigate('/world/negeri-cerita')}
              >
                Kembali ke Peta Negeri Cerita
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
