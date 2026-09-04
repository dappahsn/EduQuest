import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import CharacterAvatar from '../../components/character/CharacterAvatar';
import { COLOR_SWATCHES, HAIR_STYLES } from '../../lib/catalog';

export default function OnboardingCharacter() {
  const navigate = useNavigate();
  const { updateCharacter, showToast } = useGame();

  const [name, setName] = useState('Raka');
  const [selectedHairstyle, setSelectedHairstyle] = useState('short');
  const [selectedColor, setSelectedColor] = useState('sky');
  const [selectedPet, setSelectedPet] = useState('cat');

  function handleFinish() {
    updateCharacter({
      playerName: name,
      hairstyle: selectedHairstyle,
      outfitColor: selectedColor,
      hasCustomized: true
    });
    showToast(`Selamat datang, ${name}! Petualangan dimulai! 🚀`);
    navigate('/onboarding/intro');
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--color-surface)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 'var(--space-md)'
    }}>
      <div style={{
        maxWidth: '440px',
        width: '100%',
        backgroundColor: 'var(--color-surface-bright)',
        borderRadius: 'var(--radius-lg)',
        padding: 'var(--space-lg) var(--space-md)',
        boxShadow: 'var(--shadow-card)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        gap: 'var(--space-sm)',
        border: '2px solid var(--color-primary-fixed)'
      }}>
        <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
          Langkah 1 dari 2 • Karakter Awal
        </span>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-text-main)', margin: 0 }}>
          Siapakah Nama Petualangmu?
        </h1>

        {/* Live Preview Avatar */}
        <div style={{ margin: 'var(--space-xs) 0' }}>
          <CharacterAvatar
            config={{
              hairstyle: selectedHairstyle,
              outfitColor: selectedColor,
              accessories: 'hat-safari'
            }}
            size="xl"
            animate={true}
          />
        </div>

        {/* Name input */}
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Tulis namamu..."
          style={{
            width: '100%',
            maxWidth: '280px',
            padding: '10px 16px',
            borderRadius: 'var(--radius-full)',
            border: '2px solid var(--color-outline-subtle)',
            fontSize: '16px',
            fontWeight: 800,
            textAlign: 'center',
            color: 'var(--color-text-main)',
            backgroundColor: 'var(--color-surface-container-low)'
          }}
        />

        {/* Hairstyle selector */}
        <div style={{ width: '100%', marginTop: '6px' }}>
          <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-text-muted)', display: 'block', marginBottom: '6px' }}>
            Pilih Model Rambut:
          </span>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
            {HAIR_STYLES.map((hs) => (
              <button
                key={hs.id}
                onClick={() => setSelectedHairstyle(hs.id)}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  backgroundColor: selectedHairstyle === hs.id ? 'var(--color-primary)' : 'var(--color-surface-container-high)',
                  color: selectedHairstyle === hs.id ? '#fff' : 'var(--color-text-main)',
                  fontWeight: 800,
                  fontSize: '11px',
                  cursor: 'pointer'
                }}
              >
                {hs.name}
              </button>
            ))}
          </div>
        </div>

        {/* Color swatch */}
        <div style={{ width: '100%', marginTop: '6px' }}>
          <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-text-muted)', display: 'block', marginBottom: '6px' }}>
            Pilih Warna Pakaian:
          </span>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px' }}>
            {COLOR_SWATCHES.map((swatch) => (
              <button
                key={swatch.id}
                onClick={() => setSelectedColor(swatch.id)}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: swatch.hex,
                  border: 'none',
                  cursor: 'pointer',
                  transform: selectedColor === swatch.id ? 'scale(1.2)' : 'scale(1)',
                  boxShadow: selectedColor === swatch.id ? '0 0 6px rgba(0,0,0,0.3)' : 'none'
                }}
              />
            ))}
          </div>
        </div>

        {/* Companion Picker */}
        <div style={{ width: '100%', marginTop: '6px' }}>
          <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-text-muted)', display: 'block', marginBottom: '6px' }}>
            Pilih Sahabat Pertamamu:
          </span>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            <button
              onClick={() => setSelectedPet('cat')}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-md)',
                border: selectedPet === 'cat' ? '2px solid var(--color-primary)' : '2px solid transparent',
                backgroundColor: 'var(--color-surface-container-low)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 800,
                fontSize: '12px'
              }}
            >
              <span>🐱</span>
              <span>Milo si Kucing</span>
            </button>
            <button
              onClick={() => setSelectedPet('fox')}
              style={{
                padding: '6px 14px',
                borderRadius: 'var(--radius-md)',
                border: selectedPet === 'fox' ? '2px solid var(--color-primary)' : '2px solid transparent',
                backgroundColor: 'var(--color-surface-container-low)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontWeight: 800,
                fontSize: '12px'
              }}
            >
              <span>🦊</span>
              <span>Lumi si Rubah</span>
            </button>
          </div>
        </div>

        {/* Next Button */}
        <button
          onClick={handleFinish}
          style={{
            width: '100%',
            marginTop: 'var(--space-md)',
            padding: '14px',
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-on-primary)',
            borderRadius: 'var(--radius-full)',
            fontWeight: 800,
            fontSize: '15px',
            border: 'none',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-tactile-primary)'
          }}
        >
          Lanjut ke Pengenalan Dunia 🗺️
        </button>
      </div>
    </div>
  );
}
