import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGame } from '../../context/GameContext';
import CharacterAvatar from '../../components/character/CharacterAvatar';
import BottomNavDock from '../../components/navigation/BottomNavDock';
import { CATALOG_ITEMS, COLOR_SWATCHES, HAIR_STYLES } from '../../lib/catalog';

export default function CharacterCustomizer() {
  const navigate = useNavigate();
  const {
    characterConfig,
    updateCharacter,
    coins,
    level,
    showToast,
    unlockedItemIds
  } = useGame();

  const [activeTab, setActiveTab] = useState('accessories'); // accessories | outfits | backpacks | shoes
  const [currentConfig, setCurrentConfig] = useState(characterConfig);
  const [rotationDeg, setRotationDeg] = useState(0);
  const [isPosing, setIsPosing] = useState(false);

  const categories = [
    { id: 'accessories', label: 'Topi & Rambut', icon: 'face_retouching_natural' },
    { id: 'outfits', label: 'Kostum', icon: 'apparel' },
    { id: 'backpacks', label: 'Tas Eksplorasi', icon: 'backpack' },
    { id: 'shoes', label: 'Sepatu', icon: 'roller_skating' }
  ];

  function handleRotate(delta) {
    setRotationDeg((prev) => prev + delta);
  }

  function handlePose() {
    setIsPosing(true);
    showToast('Raka bergaya ceria! ⭐');
    setTimeout(() => setIsPosing(false), 600);
  }

  function handleColorChange(colorId) {
    setCurrentConfig((prev) => ({
      ...prev,
      outfitColor: colorId
    }));
    showToast('Warna pakaian diubah!');
  }

  function handleSelectOption(item) {
    if (item.slot === 'accessories') {
      setCurrentConfig((prev) => ({
        ...prev,
        accessories: prev.accessories === item.id ? 'none' : item.id
      }));
    } else if (item.slot === 'outfit') {
      setCurrentConfig((prev) => ({
        ...prev,
        outfit: prev.outfit === item.id ? 'outfit-scout' : item.id
      }));
    } else if (item.slot === 'backpack') {
      setCurrentConfig((prev) => ({
        ...prev,
        backpack: prev.backpack === item.id ? 'none' : item.id
      }));
    } else if (item.slot === 'shoes') {
      setCurrentConfig((prev) => ({
        ...prev,
        shoes: prev.shoes === item.id ? 'shoes-sneakers' : item.id
      }));
    }
  }

  function handleSave() {
    updateCharacter(currentConfig);
    navigate('/world');
  }

  function handleReset() {
    setCurrentConfig(characterConfig);
    showToast('Kostum dikembalikan seperti semula.');
  }

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--color-surface)',
      paddingTop: '20px',
      paddingBottom: '100px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <main style={{
        maxWidth: '520px',
        width: '100%',
        margin: '0 auto',
        padding: '0 var(--space-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-md)'
      }}>
        {/* Top Utility Sub-Header (Sesuai Stitch) */}
        <section style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: 'var(--space-xs) 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Link
              to="/world"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-surface-container-highest)',
                color: 'var(--color-text-main)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textDecoration: 'none'
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_back</span>
            </Link>
            <div>
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                Kamar Ganti
              </span>
              <h1 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text-main)', margin: 0 }}>
                Kustomisasi Petualang
              </h1>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{
              backgroundColor: 'var(--color-surface-container-high)',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '12px',
              fontWeight: 800
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--color-primary)' }}>diamond</span>
              <span>{coins}</span>
            </div>
            <div style={{
              backgroundColor: 'var(--color-tertiary-container)',
              color: 'var(--color-on-tertiary-container)',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              fontSize: '12px',
              fontWeight: 800
            }}>
              Lv. {level}
            </div>
          </div>
        </section>

        {/* Hero Stage / Character Showcase Area (Sesuai Stitch) */}
        <section style={{
          position: 'relative',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--color-surface-container-low)',
          padding: 'var(--space-md)',
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          {/* Stage Tag */}
          <div style={{
            backgroundColor: 'var(--color-surface-container-highest)',
            padding: '4px 14px',
            borderRadius: 'var(--radius-full)',
            fontSize: '12px',
            fontWeight: 800,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: 'var(--space-xs)'
          }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--color-tertiary)', fontSize: '16px' }}>stars</span>
            <span>Raka si Penjelajah Bintang</span>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: 'var(--color-secondary-container)' }} />
          </div>

          {/* 3D Character Display & Rotation Buttons */}
          <div style={{ position: 'relative', width: '100%', maxWidth: '280px', height: '240px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <button
              onClick={() => handleRotate(-30)}
              style={{
                position: 'absolute',
                left: 0,
                zIndex: 20,
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-surface-container-lowest)',
                border: 'none',
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <span className="material-symbols-outlined">chevron_left</span>
            </button>

            <button
              onClick={() => handleRotate(30)}
              style={{
                position: 'absolute',
                right: 0,
                zIndex: 20,
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-surface-container-lowest)',
                border: 'none',
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
              }}
            >
              <span className="material-symbols-outlined">chevron_right</span>
            </button>

            {/* Character feedback speech bubble on pose */}
            {isPosing && (
              <div
                className="animate-pop-in"
                style={{
                  position: 'absolute',
                  top: '-14px',
                  zIndex: 30,
                  backgroundColor: 'var(--color-surface-container-lowest)',
                  padding: '4px 14px',
                  borderRadius: 'var(--radius-full)',
                  boxShadow: 'var(--shadow-card)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontSize: '12px',
                  fontWeight: 800,
                  color: 'var(--color-primary)',
                  border: '2px solid var(--color-primary-fixed)'
                }}
              >
                <span>Siap bertualang! 😎✨</span>
              </div>
            )}

            {/* Avatar display */}
            <div style={{
              transform: `rotateY(${rotationDeg}deg) ${isPosing ? 'translateY(-14px) scale(1.08)' : 'scale(1)'}`,
              transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}>
              <CharacterAvatar config={currentConfig} size="hero" />
            </div>

            {/* Pose Action Button */}
            <button
              onClick={handlePose}
              style={{
                position: 'absolute',
                bottom: '-8px',
                zIndex: 20,
                backgroundColor: 'var(--color-surface-container-lowest)',
                padding: '4px 14px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                boxShadow: 'var(--shadow-card)',
                fontSize: '12px',
                fontWeight: 800,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <span className="material-symbols-outlined" style={{ color: 'var(--color-secondary)', fontSize: '16px' }}>celebration</span>
              <span>Pose Keren</span>
            </button>
          </div>

          {/* Stats Bar */}
          <div style={{
            width: '100%',
            marginTop: 'var(--space-md)',
            backgroundColor: 'var(--color-surface-container-high)',
            borderRadius: 'var(--radius-md)',
            padding: '8px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--color-secondary)', fontSize: '18px' }}>bolt</span>
              <div>
                <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', display: 'block' }}>Bonus Jelajah</span>
                <span style={{ fontSize: '12px', fontWeight: 800 }}>+15% XP Sains</span>
              </div>
            </div>

            <div style={{ height: '24px', width: '1px', backgroundColor: 'var(--color-outline-subtle)' }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)', fontSize: '18px' }}>speed</span>
              <div>
                <span style={{ fontSize: '10px', color: 'var(--color-text-muted)', display: 'block' }}>Kecepatan</span>
                <span style={{ fontSize: '12px', fontWeight: 800 }}>Jalan Cepat</span>
              </div>
            </div>
          </div>
        </section>

        {/* Category Tabs (Sesuai Stitch) */}
        <section>
          <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
            {categories.map((cat) => {
              const isCurrent = activeTab === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveTab(cat.id)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: 'var(--radius-full)',
                    backgroundColor: isCurrent ? 'var(--color-primary-container)' : 'var(--color-surface-container-high)',
                    color: isCurrent ? 'var(--color-on-primary-container)' : 'var(--color-text-main)',
                    border: 'none',
                    fontWeight: 800,
                    fontSize: '12px',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{cat.icon}</span>
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Color Swatches Bar (Sesuai Stitch) */}
        <section style={{
          backgroundColor: 'var(--color-surface-container-low)',
          padding: '8px 14px',
          borderRadius: 'var(--radius-md)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)', fontSize: '18px' }}>palette</span>
            <span style={{ fontSize: '12px', fontWeight: 800 }}>Warna Kostum</span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {COLOR_SWATCHES.map((swatch) => {
              const isSelected = currentConfig.outfitColor === swatch.id;
              return (
                <button
                  key={swatch.id}
                  onClick={() => handleColorChange(swatch.id)}
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: swatch.hex,
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    transform: isSelected ? 'scale(1.2)' : 'scale(1)',
                    boxShadow: isSelected ? '0 0 6px rgba(0,0,0,0.3)' : 'none'
                  }}
                >
                  {isSelected && (
                    <span className="material-symbols-outlined" style={{ color: swatch.textHex, fontSize: '16px' }}>check</span>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Tactile Items Grid (Sesuai Stitch) */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-sm)' }}>
          {CATALOG_ITEMS.filter((item) => item.category === activeTab).map((item) => {
            const isUnlocked = unlockedItemIds.includes(item.id) || item.defaultUnlocked;
            const isEquipped =
              currentConfig.accessories === item.id ||
              currentConfig.outfit === item.id ||
              currentConfig.backpack === item.id ||
              currentConfig.shoes === item.id;

            return (
              <div
                key={item.id}
                onClick={() => {
                  if (isUnlocked) handleSelectOption(item);
                }}
                style={{
                  backgroundColor: 'var(--color-surface-container-lowest)',
                  borderRadius: 'var(--radius-md)',
                  padding: 'var(--space-sm)',
                  boxShadow: 'var(--shadow-card)',
                  cursor: isUnlocked ? 'pointer' : 'default',
                  opacity: isUnlocked ? 1 : 0.6,
                  position: 'relative',
                  border: isEquipped ? '2px solid var(--color-secondary)' : '2px solid transparent'
                }}
              >
                {isEquipped ? (
                  <div style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    backgroundColor: 'var(--color-secondary)',
                    color: 'var(--color-on-secondary)',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '10px',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px'
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>check</span>
                    <span>Dipakai</span>
                  </div>
                ) : !isUnlocked ? (
                  <div style={{
                    position: 'absolute',
                    top: '6px',
                    right: '6px',
                    backgroundColor: 'var(--color-error-container)',
                    color: 'var(--color-on-error-container)',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '10px',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px'
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>lock</span>
                    <span>Terkunci</span>
                  </div>
                ) : null}

                <div style={{
                  width: '100%',
                  aspectRatio: '1',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: 'var(--color-surface-container-low)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '4px 0',
                  overflow: 'hidden',
                  position: 'relative'
                }}>
                  {item.previewImage ? (
                    <img
                      src={item.previewImage}
                      alt={item.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: 'var(--radius-sm)'
                      }}
                    />
                  ) : (
                    <span className="material-symbols-outlined" style={{ fontSize: '36px', color: 'var(--color-primary)' }}>
                      {item.icon}
                    </span>
                  )}
                </div>

                <div>
                  <h3 style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-text-main)', margin: '2px 0' }}>
                    {item.name}
                  </h3>
                  <span style={{ fontSize: '11px', color: isUnlocked ? 'var(--color-secondary)' : 'var(--color-text-muted)', fontWeight: 700 }}>
                    {item.tierText}
                  </span>
                </div>
              </div>
            );
          })}
        </section>

        {/* Bottom Sticky Action Dock (Sesuai Stitch) */}
        <section style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: 'var(--space-md)' }}>
          <button
            onClick={handleSave}
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-tertiary-container)',
              color: 'var(--color-on-tertiary-container)',
              border: 'none',
              fontWeight: 800,
              fontSize: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              cursor: 'pointer',
              boxShadow: 'var(--shadow-tactile-tertiary)'
            }}
          >
            <span>Simpan & Mulai Petualangan!</span>
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_forward</span>
          </button>

          <button
            onClick={handleReset}
            style={{
              width: '100%',
              padding: '10px',
              borderRadius: 'var(--radius-full)',
              backgroundColor: 'var(--color-surface-container-high)',
              color: 'var(--color-text-muted)',
              border: 'none',
              fontWeight: 800,
              fontSize: '13px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '4px'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>restart_alt</span>
            <span>Reset Kostum Semula</span>
          </button>
        </section>
      </main>

      <BottomNavDock />
    </div>
  );
}
