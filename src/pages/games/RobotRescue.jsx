import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';

export default function RobotRescue({ onGameComplete = null }) {
  const navigate = useNavigate();
  const { completeQuest } = useGame();
  const [commands, setCommands] = useState([]);
  const [roverPos, setRoverPos] = useState({ x: 0, y: 0 }); // 3x3 grid: target at (2, 2)
  const [isRunning, setIsRunning] = useState(false);
  const [statusText, setStatusText] = useState('Susun perintah untuk membawa Bot Budi ke Baterai Kristal (2, 2)!');
  const [isSuccess, setIsSuccess] = useState(false);
  const [showHint, setShowHint] = useState(false);

  function addCommand(cmd) {
    if (commands.length >= 6 || isRunning || isSuccess) return;
    setCommands([...commands, cmd]);
  }

  function removeLastCommand() {
    if (isRunning || isSuccess) return;
    setCommands(commands.slice(0, -1));
  }

  function clearCommands() {
    if (isRunning) return;
    setCommands([]);
    setRoverPos({ x: 0, y: 0 });
    setIsSuccess(false);
    setStatusText('Susun perintah algoritma untuk Bot Budi!');
    setShowHint(false);
  }

  function runProgram() {
    if (commands.length === 0 || isRunning) return;
    setIsRunning(true);
    setStatusText('🤖 Bot Budi sedang mengeksekusi perintah...');

    let currentX = 0;
    let currentY = 0;

    commands.forEach((cmd, idx) => {
      setTimeout(() => {
        if (cmd === 'RIGHT') currentX = Math.min(2, currentX + 1);
        if (cmd === 'DOWN') currentY = Math.min(2, currentY + 1);
        if (cmd === 'JUMP') {
          currentX = Math.min(2, currentX + 1);
          currentY = Math.min(2, currentY + 1);
        }
        setRoverPos({ x: currentX, y: currentY });

        if (idx === commands.length - 1) {
          setIsRunning(false);
          if (currentX === 2 && currentY === 2) {
            setIsSuccess(true);
            setStatusText('🎉 Berhasil! Baterai Kristal berhasil diselamatkan!');
          } else {
            setStatusText(`Algoritma belum tepat. Bot Budi berhenti di (${currentX}, ${currentY}), belum sampai ke Baterai (2, 2). Coba ulangi dan susun langkah baru!`);
          }
        }
      }, (idx + 1) * 600);
    });
  }

  function handleFinish() {
    completeQuest('quest-gt-1', 150, 160, 45, 'card-volcano', 'outfit-cyber');
    if (onGameComplete) {
      onGameComplete();
    } else {
      navigate('/quest/quest-gt-1/result');
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', width: '100%', gap: 'var(--space-sm)' }}>
      {/* Header Bar */}
      <section style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          backgroundColor: 'var(--color-surface-container-high)',
          padding: '4px 12px',
          borderRadius: 'var(--radius-full)'
        }}>
          <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)', fontSize: '18px' }}>smart_toy</span>
          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-main)' }}>Gunung Teka-Teki</span>
          <span style={{ color: 'var(--color-text-muted)' }}>•</span>
          <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-primary)' }}>Misi Robot</span>
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
            onClick={clearCommands}
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
            <p style={{ fontSize: '13px', fontWeight: 800, margin: '0 0 2px' }}>Tips Algoritma Robot:</p>
            <p style={{ fontSize: '12px', margin: 0, lineHeight: 1.4 }}>
              Bot Budi mulai di (0, 0) dan target berada di (2, 2). Kamu butuh 2 langkah ke Kanan dan 2 langkah ke Bawah, atau gunakan Lompat Diagonal!
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

      {/* Grid Canvas (3x3 Matrix) */}
      <div style={{
        backgroundColor: 'var(--color-surface-container-lowest)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-md)',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--space-sm)'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 72px)',
          gridTemplateRows: 'repeat(3, 72px)',
          gap: '6px',
          backgroundColor: 'var(--color-surface-container-high)',
          padding: '8px',
          borderRadius: 'var(--radius-md)'
        }}>
          {[0, 1, 2].map((y) =>
            [0, 1, 2].map((x) => {
              const isRover = roverPos.x === x && roverPos.y === y;
              const isTarget = x === 2 && y === 2;
              return (
                <div
                  key={`${x}-${y}`}
                  style={{
                    backgroundColor: isRover ? 'var(--color-primary-fixed)' : isTarget ? 'var(--color-secondary-container)' : 'var(--color-surface-container-lowest)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '28px',
                    boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.08)',
                    transition: 'background-color 0.3s'
                  }}
                >
                  {isRover ? '🤖' : isTarget ? '🔋' : null}
                </div>
              );
            })
          )}
        </div>

        <p
          className={isSuccess ? 'animate-celebrate-pop' : statusText.includes('Belum') || statusText.includes('Menabrak') || statusText.includes('Gagal') ? 'animate-shake' : ''}
          style={{ fontSize: '13px', fontWeight: 700, color: isSuccess ? 'var(--color-secondary)' : 'var(--color-text-main)', textAlign: 'center', margin: 0 }}
        >
          {statusText}
        </p>
      </div>

      {/* Program Instruction Strip */}
      <div style={{
        backgroundColor: 'var(--color-surface-container-high)',
        padding: 'var(--space-sm)',
        borderRadius: 'var(--radius-md)',
        minHeight: '52px',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        overflowX: 'auto'
      }}>
        <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-text-muted)', textTransform: 'uppercase', marginRight: '4px' }}>
          Algoritma:
        </span>
        {commands.length === 0 ? (
          <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Belum ada blok instruksi dipilih</span>
        ) : (
          commands.map((cmd, i) => (
            <div
              key={i}
              style={{
                backgroundColor: 'var(--color-primary)',
                color: '#fff',
                padding: '4px 10px',
                borderRadius: 'var(--radius-full)',
                fontSize: '11px',
                fontWeight: 800,
                display: 'flex',
                alignItems: 'center',
                gap: '2px',
                whiteSpace: 'nowrap'
              }}
            >
              {cmd === 'RIGHT' && 'Kanan ➡️'}
              {cmd === 'DOWN' && 'Bawah ⬇️'}
              {cmd === 'JUMP' && 'Lompat ⚡'}
            </div>
          ))
        )}
      </div>

      {/* Available Instruction Buttons */}
      {!isSuccess && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-xs)' }}>
          <button
            onClick={() => addCommand('RIGHT')}
            disabled={isRunning}
            style={{
              padding: '10px',
              backgroundColor: 'var(--color-surface-container-lowest)',
              border: '2px solid var(--color-primary)',
              borderRadius: 'var(--radius-md)',
              fontWeight: 800,
              fontSize: '13px',
              color: 'var(--color-primary)',
              cursor: 'pointer'
            }}
          >
            Maju Kanan ➡️
          </button>
          <button
            onClick={() => addCommand('DOWN')}
            disabled={isRunning}
            style={{
              padding: '10px',
              backgroundColor: 'var(--color-surface-container-lowest)',
              border: '2px solid var(--color-primary)',
              borderRadius: 'var(--radius-md)',
              fontWeight: 800,
              fontSize: '13px',
              color: 'var(--color-primary)',
              cursor: 'pointer'
            }}
          >
            Maju Bawah ⬇️
          </button>
          <button
            onClick={() => addCommand('JUMP')}
            disabled={isRunning}
            style={{
              padding: '10px',
              backgroundColor: 'var(--color-surface-container-lowest)',
              border: '2px solid var(--color-tertiary)',
              borderRadius: 'var(--radius-md)',
              fontWeight: 800,
              fontSize: '13px',
              color: 'var(--color-tertiary)',
              cursor: 'pointer'
            }}
          >
            Lompat Diagonal ⚡
          </button>
        </div>
      )}

      {/* Run or Finish Button */}
      {!isSuccess ? (
        <button
          onClick={runProgram}
          disabled={commands.length === 0 || isRunning}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: commands.length > 0 && !isRunning ? 'var(--color-primary)' : 'var(--color-surface-container-high)',
            color: commands.length > 0 && !isRunning ? 'var(--color-on-primary)' : 'var(--color-text-muted)',
            borderRadius: 'var(--radius-full)',
            fontWeight: 800,
            fontSize: '15px',
            border: 'none',
            cursor: commands.length > 0 && !isRunning ? 'pointer' : 'not-allowed',
            boxShadow: commands.length > 0 && !isRunning ? 'var(--shadow-tactile-primary)' : 'none'
          }}
        >
          {isRunning ? 'Menjalankan Algoritma...' : 'Jalankan Program Robot! ▶️'}
        </button>
      ) : (
        <button
          onClick={handleFinish}
          className="animate-celebrate-pop"
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
            boxShadow: 'var(--shadow-tactile-secondary)'
          }}
        >
          Misi Selesai! Ambil Hadiah 🏆
        </button>
      )}
    </div>
  );
}
