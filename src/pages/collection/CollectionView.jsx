import React, { useState } from 'react';
import { useGame } from '../../context/GameContext';
import GameHeader from '../../components/navigation/GameHeader';
import BottomNavDock from '../../components/navigation/BottomNavDock';
import { CATALOG_ITEMS } from '../../lib/catalog';
import { INITIAL_KNOWLEDGE_CARDS } from '../../lib/knowledgeCards';
import { INITIAL_ACHIEVEMENTS } from '../../lib/achievements';
import { getAllPets } from '../../lib/petsRegistry';

export default function CollectionView() {
  const {
    unlockedItemIds,
    equippedItems,
    unlockedCardIds,
    claimedAchievements,
    activePetId,
    equipItem,
    unequipItem,
    equipPet
  } = useGame();

  const [activeCategory, setActiveCategory] = useState('accessories');
  const [selectedItemDetail, setSelectedItemDetail] = useState(null);

  const categories = [
    { id: 'accessories', label: 'Topi & Aksesori', icon: 'face_retouching_natural' },
    { id: 'outfits', label: 'Kostum', icon: 'apparel' },
    { id: 'backpacks', label: 'Tas Eksplorasi', icon: 'backpack' },
    { id: 'pets', label: 'Hewan Sahabat', icon: 'pets' },
    { id: 'cards', label: 'Kartu Pengetahuan', icon: 'style' },
    { id: 'badges', label: 'Lencana Prestasi', icon: 'military_tech' }
  ];

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
        {/* Title */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
              Ransel Petualang
            </span>
            <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--color-text-main)', margin: 0 }}>
              Koleksi & Perlengkapan
            </h1>
          </div>
        </div>

        {/* Horizontal Category Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          overflowX: 'auto',
          paddingBottom: '4px'
        }}>
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: 'var(--radius-full)',
                  backgroundColor: isActive ? 'var(--color-primary)' : 'var(--color-surface-container-high)',
                  color: isActive ? 'var(--color-on-primary)' : 'var(--color-text-main)',
                  border: 'none',
                  fontSize: '13px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  boxShadow: isActive ? 'var(--shadow-tactile-primary)' : 'none'
                }}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Content Area Based on Active Category */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 'var(--space-sm)' }}>
          {/* Items (Accessories, Outfits, Backpacks) */}
          {['accessories', 'outfits', 'backpacks'].includes(activeCategory) &&
            CATALOG_ITEMS.filter((item) => item.category === activeCategory).map((item) => {
              const isUnlocked = unlockedItemIds.includes(item.id) || item.defaultUnlocked;
              const isEquipped = Object.values(equippedItems).includes(item.id);

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedItemDetail({ ...item, isUnlocked })}
                  className="interactive-card"
                  style={{
                    backgroundColor: 'var(--color-surface-container-lowest)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--space-sm)',
                    boxShadow: 'var(--shadow-card)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    opacity: isUnlocked ? 1 : 0.65,
                    position: 'relative',
                    border: isEquipped ? '2px solid var(--color-secondary)' : '2px solid transparent'
                  }}
                >
                  {isEquipped ? (
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
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
                      top: '8px',
                      right: '8px',
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
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-surface-container-low)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '6px 0',
                    overflow: 'hidden'
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '40px', color: 'var(--color-primary)' }}>
                      {item.icon}
                    </span>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-text-main)', margin: '2px 0' }}>
                      {item.name}
                    </h3>
                    <span style={{ fontSize: '11px', color: isUnlocked ? 'var(--color-secondary)' : 'var(--color-text-muted)', fontWeight: 700 }}>
                      {isUnlocked ? item.bonus : `Buka di Lv. ${item.unlockLevel}`}
                    </span>
                  </div>
                </div>
              );
            })}

          {/* Pets Category */}
          {activeCategory === 'pets' &&
            getAllPets().map((pet) => {
              const isActive = activePetId === pet.id;
              return (
                <div
                  key={pet.id}
                  onClick={() => equipPet(pet.id)}
                  className="interactive-card"
                  style={{
                    backgroundColor: 'var(--color-surface-container-lowest)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--space-sm)',
                    boxShadow: 'var(--shadow-card)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    position: 'relative',
                    border: isActive ? '2px solid var(--color-primary)' : '2px solid transparent'
                  }}
                >
                  {isActive && (
                    <div style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--color-on-primary)',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)',
                      fontSize: '10px',
                      fontWeight: 800
                    }}>
                      Aktif
                    </div>
                  )}

                  <div style={{
                    width: '100%',
                    aspectRatio: '1',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: pet.colorScheme.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '44px',
                    margin: '6px 0'
                  }}>
                    {pet.avatarEmoji}
                  </div>

                  <div>
                    <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-text-main)', margin: '2px 0' }}>
                      {pet.name}
                    </h3>
                    <span style={{ fontSize: '11px', color: 'var(--color-secondary)', fontWeight: 700 }}>
                      {pet.baseBonus}
                    </span>
                  </div>
                </div>
              );
            })}

          {/* Knowledge Cards Category */}
          {activeCategory === 'cards' &&
            INITIAL_KNOWLEDGE_CARDS.map((card) => {
              const isUnlocked = unlockedCardIds.includes(card.id);
              return (
                <div
                  key={card.id}
                  onClick={() => setSelectedItemDetail({ ...card, isUnlocked })}
                  className="interactive-card"
                  style={{
                    backgroundColor: 'var(--color-surface-container-lowest)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--space-sm)',
                    boxShadow: 'var(--shadow-card)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    opacity: isUnlocked ? 1 : 0.65,
                    position: 'relative'
                  }}
                >
                  <div style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    backgroundColor: isUnlocked ? 'var(--color-tertiary-fixed)' : 'var(--color-surface-container-high)',
                    color: isUnlocked ? 'var(--color-on-tertiary-fixed)' : 'var(--color-text-muted)',
                    padding: '2px 8px',
                    borderRadius: 'var(--radius-full)',
                    fontSize: '10px',
                    fontWeight: 800
                  }}>
                    {isUnlocked ? card.rarity : 'Terkunci'}
                  </div>

                  <div style={{
                    width: '100%',
                    aspectRatio: '1',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-surface-container-low)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '48px',
                    margin: '6px 0',
                    filter: isUnlocked ? 'none' : 'grayscale(1) opacity(0.5)'
                  }}>
                    {card.illustration}
                  </div>

                  <div>
                    <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-text-main)', margin: '2px 0' }}>
                      {isUnlocked ? card.title : '???'}
                    </h3>
                    <span style={{ fontSize: '11px', color: 'var(--color-primary)', fontWeight: 700 }}>
                      {card.category}
                    </span>
                  </div>
                </div>
              );
            })}

          {/* Badges Category */}
          {activeCategory === 'badges' &&
            INITIAL_ACHIEVEMENTS.map((badge) => {
              const isClaimed = claimedAchievements.includes(badge.id);
              return (
                <div
                  key={badge.id}
                  className="interactive-card"
                  style={{
                    backgroundColor: 'var(--color-surface-container-lowest)',
                    borderRadius: 'var(--radius-lg)',
                    padding: 'var(--space-sm)',
                    boxShadow: 'var(--shadow-card)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    opacity: isClaimed ? 1 : 0.6
                  }}
                >
                  <div style={{
                    width: '100%',
                    aspectRatio: '1',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: 'var(--color-surface-container-high)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '6px 0'
                  }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '40px', color: isClaimed ? 'var(--color-tertiary)' : 'var(--color-outline)' }}>
                      {badge.icon}
                    </span>
                  </div>
                  <div>
                    <h3 style={{ fontSize: '14px', fontWeight: 800, color: 'var(--color-text-main)', margin: '2px 0' }}>
                      {badge.title}
                    </h3>
                    <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', fontWeight: 700 }}>
                      Tingkat {badge.tier}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Item Detail Modal */}
        {selectedItemDetail && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100,
              backgroundColor: 'rgba(18, 26, 52, 0.7)',
              backdropFilter: 'blur(6px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 'var(--space-md)'
            }}
          >
            <div
              className="animate-pop-in"
              style={{
                width: '100%',
                maxWidth: '380px',
                backgroundColor: 'var(--color-surface-bright)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-lg) var(--space-md)',
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                flexDirection: 'column',
                gap: 'var(--space-sm)'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text-main)', margin: 0 }}>
                  {selectedItemDetail.isUnlocked === false
                    ? (selectedItemDetail.rarity ? 'Kartu Misterius' : selectedItemDetail.name)
                    : (selectedItemDetail.name || selectedItemDetail.title)}
                </h2>
                <button
                  onClick={() => setSelectedItemDetail(null)}
                  style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)' }}
                >
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>

              {selectedItemDetail.isUnlocked === false ? (
                <div style={{
                  padding: '12px',
                  backgroundColor: 'var(--color-surface-container-high)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '13px',
                  color: 'var(--color-text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  lineHeight: 1.4
                }}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)', fontSize: '22px' }}>lock</span>
                  <span>
                    {selectedItemDetail.unlockLevel
                      ? `Perlengkapan ini terkunci. Capai Level ${selectedItemDetail.unlockLevel} untuk membukanya! 🗝️`
                      : 'Kartu ini belum ditemukan! Jelajahi Region dan selesaikan Discovery untuk membukanya! 🗺️'}
                  </span>
                </div>
              ) : (
                <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', margin: 0, lineHeight: 1.5 }}>
                  {selectedItemDetail.description || selectedItemDetail.facts?.[0]}
                </p>
              )}

              {/* Equip / Unequip Buttons if item */}
              {selectedItemDetail.slot && selectedItemDetail.isUnlocked !== false && (
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  {equippedItems[selectedItemDetail.slot] === selectedItemDetail.id ? (
                    <button
                      onClick={() => {
                        unequipItem(selectedItemDetail.slot);
                        setSelectedItemDetail(null);
                      }}
                      style={{
                        flex: 1,
                        padding: '12px',
                        backgroundColor: 'var(--color-surface-container-high)',
                        color: 'var(--color-text-main)',
                        border: 'none',
                        borderRadius: 'var(--radius-full)',
                        fontWeight: 800,
                        fontSize: '13px',
                        cursor: 'pointer'
                      }}
                    >
                      Lepas Perlengkapan
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        equipItem(selectedItemDetail.slot, selectedItemDetail.id);
                        setSelectedItemDetail(null);
                      }}
                      style={{
                        flex: 1,
                        padding: '12px',
                        backgroundColor: 'var(--color-primary)',
                        color: 'var(--color-on-primary)',
                        border: 'none',
                        borderRadius: 'var(--radius-full)',
                        fontWeight: 800,
                        fontSize: '13px',
                        cursor: 'pointer',
                        boxShadow: 'var(--shadow-tactile-primary)'
                      }}
                    >
                      Pakai Perlengkapan ✨
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      <BottomNavDock />
    </div>
  );
}
