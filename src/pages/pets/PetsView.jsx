import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import GameHeader from '../../components/navigation/GameHeader';
import BottomNavDock from '../../components/navigation/BottomNavDock';
import { getAllPets, getPetById } from '../../lib/petsRegistry';

export default function PetsView() {
  const { activePetId, petsState, feedPet, equipPet } = useGame();
  const [isFeeding, setIsFeeding] = useState(false);
  const allPets = getAllPets();

  const currentPetDef = getPetById(activePetId) || allPets[0];
  const currentPetState = petsState[activePetId] || { level: 1, xp: 0, happiness: 80 };

  const xpNeeded = 100 * currentPetState.level;
  const xpPercent = Math.min(100, Math.round(((currentPetState.xp % 100) / 100) * 100));

  const handleFeed = () => {
    feedPet(activePetId);
    setIsFeeding(true);
    setTimeout(() => setIsFeeding(false), 1400);
  };

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--color-surface)',
      paddingTop: '80px',
      paddingBottom: '96px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <GameHeader />

      <main style={{
        maxWidth: '520px',
        width: '100%',
        margin: '0 auto',
        padding: '0 var(--space-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-md)'
      }}>
        {/* Tactile Segmented Switcher (Sesuai Stitch) */}
        <div style={{
          backgroundColor: 'var(--color-surface-container-high)',
          padding: '4px',
          borderRadius: 'var(--radius-full)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: 'var(--shadow-card)'
        }}>
          <button
            style={{
              flex: 1,
              padding: '10px var(--space-sm)',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-on-primary)',
              border: 'none',
              fontWeight: 800,
              fontSize: '13px',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-tactile-primary)'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>pets</span>
            <span>Hewan Sahabat</span>
          </button>

          <Link
            to="/character"
            style={{
              flex: 1,
              padding: '10px var(--space-sm)',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              color: 'var(--color-text-muted)',
              textDecoration: 'none',
              fontWeight: 800,
              fontSize: '13px'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>styler</span>
            <span>Kostum Karakter</span>
          </Link>
        </div>

        {/* Habitat 3D Diorama Showcase Card (Sesuai Stitch) */}
        <div style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--color-surface-container-lowest)',
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Diorama Scene Graphic */}
          <div style={{
            position: 'relative',
            width: '100%',
            height: '220px',
            overflow: 'hidden',
            background: `linear-gradient(180deg, ${currentPetDef.colorScheme.bg} 0%, var(--color-surface-container-high) 100%)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {/* Giant Pet Emoji Centerpiece */}
            <div
              className={isFeeding ? 'animate-celebrate-pop' : 'animate-float'}
              style={{
                fontSize: '84px',
                filter: 'drop-shadow(0 12px 20px rgba(0, 97, 148, 0.25))'
              }}
            >
              {currentPetDef.avatarEmoji}
            </div>

            {/* Feeding Reaction Speech Bubble */}
            {isFeeding && (
              <div
                className="animate-pop-in"
                style={{
                  position: 'absolute',
                  top: '16px',
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(6px)',
                  padding: '6px 16px',
                  borderRadius: 'var(--radius-full)',
                  boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontWeight: 800,
                  fontSize: '13px',
                  color: 'var(--color-primary)',
                  zIndex: 20
                }}
              >
                <span>🫐</span>
                <span>Nyam! Sahabatmu makin riang! (+10 XP) ✨</span>
              </div>
            )}

            {/* Top Origin Badge */}
            <div style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(6px)',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              boxShadow: 'var(--shadow-card)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--color-secondary)', fontSize: '16px' }}>park</span>
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-secondary)' }}>
                {currentPetDef.originQuest}
              </span>
            </div>

            {/* Pet Mood Bubble */}
            <div style={{
              position: 'absolute',
              bottom: '12px',
              right: '12px',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              backdropFilter: 'blur(6px)',
              padding: '4px 12px',
              borderRadius: 'var(--radius-full)',
              boxShadow: 'var(--shadow-card)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--color-ruby)', fontSize: '16px' }}>favorite</span>
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-text-main)' }}>
                Kesenangan {currentPetState.happiness}%
              </span>
            </div>
          </div>

          {/* Pet Info & Meters */}
          <div style={{ padding: 'var(--space-md)', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-text-main)', margin: 0 }}>
                    {currentPetDef.name}
                  </h2>
                  <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)', fontSize: '20px' }}>verified</span>
                </div>
                <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', margin: '2px 0 0' }}>
                  {currentPetDef.specialty}
                </p>
              </div>

              <div style={{
                backgroundColor: 'var(--color-tertiary-container)',
                color: 'var(--color-on-tertiary-container)',
                padding: '4px 12px',
                borderRadius: 'var(--radius-full)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center'
              }}>
                <span style={{ fontSize: '9px', fontWeight: 800, textTransform: 'uppercase' }}>Tingkat</span>
                <span style={{ fontSize: '15px', fontWeight: 900 }}>Lv. {currentPetState.level}</span>
              </div>
            </div>

            {/* XP Growth Bar */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 800 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '14px', color: 'var(--color-primary)' }}>bolt</span>
                  Energi Sahabat
                </span>
                <span style={{ color: 'var(--color-primary)' }}>{currentPetState.xp} / {xpNeeded} XP</span>
              </div>
              <div style={{ width: '100%', height: '10px', backgroundColor: 'var(--color-surface-container-high)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                <div style={{ width: `${xpPercent}%`, height: '100%', backgroundColor: 'var(--color-secondary-container)', borderRadius: 'var(--radius-full)', transition: 'width 0.4s ease' }} />
              </div>
            </div>

            {/* Feed & Adventure Actions */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-xs)', marginTop: '4px' }}>
              <button
                onClick={handleFeed}
                style={{
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-tertiary)',
                  color: 'var(--color-on-tertiary)',
                  border: 'none',
                  fontWeight: 800,
                  fontSize: '13px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: 'var(--shadow-tactile-tertiary)'
                }}
              >
                <span>🫐</span>
                <span>Beri Makan (+10 XP)</span>
              </button>

              <Link
                to="/world"
                style={{
                  padding: '12px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-primary-container)',
                  color: 'var(--color-on-primary-container)',
                  textDecoration: 'none',
                  fontWeight: 800,
                  fontSize: '13px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: 'var(--shadow-tactile-primary)'
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>backpack</span>
                <span>Ajak Petualang</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Pet Roster Carousel / Grid (Sesuai Stitch) */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-xs)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-text-main)', margin: 0 }}>
              Koleksi Sahabat
            </h3>
            <span style={{ fontSize: '11px', fontWeight: 700, backgroundColor: 'var(--color-surface-container-high)', padding: '2px 8px', borderRadius: 'var(--radius-full)', color: 'var(--color-text-muted)' }}>
              3 Diperoleh • 2 Terkunci
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-xs)' }}>
            {allPets.map((pet) => {
              const petState = petsState[pet.id] || { level: 1, unlocked: false };
              const isEquipped = activePetId === pet.id;

              return (
                <div
                  key={pet.id}
                  onClick={() => {
                    if (petState.unlocked) equipPet(pet.id);
                  }}
                  className="interactive-card"
                  style={{
                    backgroundColor: 'var(--color-surface-container-low)',
                    padding: 'var(--space-xs)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    boxShadow: 'var(--shadow-card)',
                    cursor: petState.unlocked ? 'pointer' : 'default',
                    opacity: petState.unlocked ? 1 : 0.6,
                    border: isEquipped ? '2px solid var(--color-primary)' : '2px solid transparent'
                  }}
                >
                  <div style={{
                    width: '100%',
                    height: '84px',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: pet.colorScheme.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '40px',
                    position: 'relative'
                  }}>
                    {pet.avatarEmoji}
                    <span style={{
                      position: 'absolute',
                      top: '4px',
                      right: '4px',
                      backgroundColor: 'rgba(255,255,255,0.9)',
                      padding: '2px 6px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '10px',
                      fontWeight: 800,
                      color: 'var(--color-text-main)'
                    }}>
                      Lv. {petState.level}
                    </span>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-text-main)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {pet.name}
                      </p>
                      <p style={{ fontSize: '10px', color: 'var(--color-text-muted)', margin: 0 }}>
                        {isEquipped ? 'Aktif • Sahabat' : petState.unlocked ? 'Siap Diajak' : 'Terkunci'}
                      </p>
                    </div>
                    {isEquipped ? (
                      <span className="material-symbols-outlined" style={{ color: 'var(--color-secondary)', fontSize: '18px' }}>check_circle</span>
                    ) : !petState.unlocked ? (
                      <span className="material-symbols-outlined" style={{ color: 'var(--color-outline)', fontSize: '16px' }}>lock</span>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </main>

      <BottomNavDock />
    </div>
  );
}
