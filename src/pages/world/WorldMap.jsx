import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import GameHeader from '../../components/navigation/GameHeader';
import BottomNavDock from '../../components/navigation/BottomNavDock';
import CharacterAvatar from '../../components/character/CharacterAvatar';
import { useGame } from '../../context/GameContext';
import { audioManager } from '../../lib/audioManager';
import { QUESTS } from '../../data/seedData';

const REGION_DATA = {
  angka: {
    id: 'lembah-angka',
    title: 'Lembah Angka',
    subtitle: 'Matematika & Geometri Ajaib',
    icon: 'calculate',
    tier: 'Tingkat 1',
    progress: 0,
    locked: false,
    level: 1,
    nextQuest: 'Jembatan Perkalian Kilat',
    xp: '+120 XP',
    color: 'var(--color-primary)'
  },
  sains: {
    id: 'hutan-sains',
    title: 'Hutan Sains',
    subtitle: 'Ekosistem & Flora Misterius',
    icon: 'biotech',
    tier: 'Tingkat 3',
    progress: 0,
    locked: true,
    level: 3,
    nextQuest: 'Misteri Fotosintesis Daun',
    xp: '+120 XP',
    color: 'var(--color-secondary)'
  },
  cerita: {
    id: 'negeri-cerita',
    title: 'Negeri Cerita',
    subtitle: 'Literasi & Dongeng Nusantara',
    icon: 'auto_stories',
    tier: 'Tingkat 6',
    progress: 0,
    locked: true,
    level: 6,
    nextQuest: 'Rantai Kata Pertama',
    xp: '+100 XP',
    color: 'var(--color-tertiary)'
  },
  tekateki: {
    id: 'gunung-teka-teki',
    title: 'Gunung Teka-Teki',
    subtitle: 'Benteng Logika & Roda Gigi',
    icon: 'extension',
    tier: 'Tingkat 14',
    progress: 0,
    locked: true,
    level: 14,
    nextQuest: 'Kode Algoritma Roda Gigi',
    xp: '+180 XP',
    color: 'var(--color-outline)'
  },
  angkasa: {
    id: 'angkasa-pengetahuan',
    title: 'Angkasa Pengetahuan',
    subtitle: 'Sains & Astronomi Kosmik',
    icon: 'rocket_launch',
    tier: 'Tingkat 16',
    progress: 0,
    locked: true,
    level: 16,
    nextQuest: 'Pusat Tata Surya',
    xp: '+200 XP',
    color: 'var(--color-outline)'
  }
};

export default function WorldMap() {
  const navigate = useNavigate();
  const { characterConfig, claimDailyChest, setRewardModal, level, completedQuestIds = [] } = useGame();
  const [selectedRegionKey, setSelectedRegionKey] = useState('angka');

  const currentLevel = level || 1;

  const getRegionProgress = (regionId) => {
    const list = QUESTS.filter((q) => q.regionId === regionId);
    if (!list.length) return 0;
    const done = list.filter((q) => (completedQuestIds || []).includes(q.id)).length;
    return Math.round((done / list.length) * 100);
  };

  const getNextQuestInfo = (regionId) => {
    const list = QUESTS.filter((q) => q.regionId === regionId).sort((a, b) => a.orderIndex - b.orderIndex);
    const next = list.find((q) => !(completedQuestIds || []).includes(q.id));
    if (next) {
      return { title: next.title, xp: `+${next.xpReward} XP`, id: next.id };
    }
    return { title: 'Semua Misi Selesai!', xp: '⭐⭐⭐', id: null };
  };

  const regions = useMemo(() => {
    const isSainsLocked = currentLevel < 3 || !(completedQuestIds || []).includes('angka-01');
    const isCeritaLocked = currentLevel < 6 || !(completedQuestIds || []).includes('sains-01');
    const isTekatekiLocked = currentLevel < 14 || !(completedQuestIds || []).includes('cerita-03');
    const isAngkasaLocked = currentLevel < 16 || !(completedQuestIds || []).includes('tekateki-03');

    return {
      angka: {
        ...REGION_DATA.angka,
        progress: getRegionProgress('lembah-angka'),
        locked: false,
        tier: 'Tingkat 1',
        nextQuest: getNextQuestInfo('lembah-angka').title,
        xp: getNextQuestInfo('lembah-angka').xp
      },
      sains: {
        ...REGION_DATA.sains,
        progress: getRegionProgress('hutan-sains'),
        locked: isSainsLocked,
        tier: 'Tingkat 3',
        nextQuest: getNextQuestInfo('hutan-sains').title,
        xp: getNextQuestInfo('hutan-sains').xp
      },
      cerita: {
        ...REGION_DATA.cerita,
        progress: getRegionProgress('negeri-cerita'),
        locked: isCeritaLocked,
        tier: 'Tingkat 6',
        nextQuest: getNextQuestInfo('negeri-cerita').title,
        xp: getNextQuestInfo('negeri-cerita').xp
      },
      tekateki: {
        ...REGION_DATA.tekateki,
        progress: getRegionProgress('gunung-teka-teki'),
        locked: isTekatekiLocked,
        tier: 'Tingkat 14',
        nextQuest: getNextQuestInfo('gunung-teka-teki').title,
        xp: getNextQuestInfo('gunung-teka-teki').xp
      },
      angkasa: {
        ...REGION_DATA.angkasa,
        progress: getRegionProgress('angkasa-pengetahuan'),
        locked: isAngkasaLocked,
        tier: 'Tingkat 16',
        nextQuest: getNextQuestInfo('angkasa-pengetahuan').title,
        xp: getNextQuestInfo('angkasa-pengetahuan').xp
      }
    };
  }, [currentLevel, completedQuestIds]);

  const selectedRegion = regions[selectedRegionKey] || regions.angka;

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--color-surface)',
      paddingTop: '80px',
      paddingBottom: '100px',
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
        {/* Top Active Island Banner (Sesuai Stitch) */}
        <div style={{
          position: 'relative',
          overflow: 'hidden',
          borderRadius: 'var(--radius-lg)',
          backgroundColor: 'var(--color-surface-container-high)',
          padding: 'var(--space-sm) var(--space-md)',
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-secondary-container)',
              color: 'var(--color-on-secondary-container)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: 'var(--shadow-card)'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>map</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-secondary)', textTransform: 'uppercase' }}>
                Benua EduQuest
              </span>
              <h2 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-text-main)', margin: 0 }}>
                Jalur Petualangan Raka
              </h2>
            </div>
          </div>

          <button
            onClick={() => {
              claimDailyChest();
              setRewardModal({
                title: 'Peti Harian Dibuka!',
                xp: 150,
                coins: 50
              });
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: 'var(--color-tertiary)',
              color: 'var(--color-on-tertiary)',
              padding: '6px 14px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              cursor: 'pointer',
              fontSize: '12px',
              fontWeight: 800,
              boxShadow: 'var(--shadow-tactile-tertiary)'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>card_giftcard</span>
            <span>3/3 Hadiah</span>
          </button>
        </div>

        {/* Winding Trail Map Canvas (Sesuai Stitch) */}
        <div style={{
          position: 'relative',
          width: '100%',
          borderRadius: 'var(--radius-lg)',
          background: 'linear-gradient(180deg, var(--color-surface-container-low) 0%, var(--color-surface-container) 50%, var(--color-surface-container-high) 100%)',
          padding: 'var(--space-sm)',
          boxShadow: '0 12px 28px rgba(18, 26, 52, 0.08)',
          overflow: 'hidden',
          minHeight: '760px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between'
        }}>
          {/* Background Grid Dots Pattern */}
          <div style={{ position: 'absolute', inset: 0, opacity: 0.15, pointerEvents: 'none' }}>
            <svg style={{ width: '100%', height: '100%' }}>
              <defs>
                <pattern id="grid-dots" width="24" height="24" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.5" fill="#006194" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid-dots)" />
            </svg>
          </div>

          {/* Dual Winding SVG Trail */}
          <svg
            style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }}
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 360 760"
          >
            <path
              d="M 180 80 Q 260 140 190 220 T 110 370 T 250 510 T 170 660"
              opacity="0.6"
              stroke="#93ccff"
              strokeDasharray="10 10"
              strokeLinecap="round"
              strokeWidth="8"
            />
            <path
              d="M 180 80 Q 260 140 190 220 T 110 370 T 250 510 T 170 660"
              stroke="#006194"
              strokeDasharray="8 8"
              strokeLinecap="round"
              strokeWidth="3"
            />
          </svg>

          {/* Wilayah 5: Angkasa Pengetahuan */}
          <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: '8px' }}>
            <div
              onClick={() => { setSelectedRegionKey('angkasa'); audioManager.playSfx('button-click'); }}
              style={{
                width: '100%',
                maxWidth: '300px',
                backgroundColor: regions.angkasa.locked ? 'rgba(255, 255, 255, 0.8)' : 'var(--color-surface-container-lowest)',
                backdropFilter: 'blur(8px)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-xs)',
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                opacity: regions.angkasa.locked ? 0.65 : 1,
                cursor: 'pointer',
                border: selectedRegionKey === 'angkasa' ? '2px solid var(--color-primary)' : '2px solid transparent'
              }}
            >
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: regions.angkasa.locked ? 'var(--color-surface-variant)' : 'var(--color-primary-container)',
                color: regions.angkasa.locked ? 'var(--color-outline)' : 'var(--color-on-primary-container)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '26px' }}>rocket_launch</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: regions.angkasa.locked ? 'var(--color-outline)' : 'var(--color-primary)' }}>Wilayah 5</span>
                  <span style={{ fontSize: '10px', fontWeight: 700, backgroundColor: regions.angkasa.locked ? 'var(--color-surface-variant)' : 'var(--color-secondary-container)', color: regions.angkasa.locked ? 'inherit' : 'var(--color-on-secondary-container)', padding: '2px 8px', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                    {regions.angkasa.locked ? (
                      <>
                        <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>lock</span> Lv. 16
                      </>
                    ) : (
                      'Terbuka • Lv. 16'
                    )}
                  </span>
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--color-text-main)', margin: '2px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  Angkasa Pengetahuan
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: 0 }}>Sains & Astronomi Kosmik</p>
              </div>
            </div>
          </div>

          {/* Wilayah 4: Gunung Teka-Teki */}
          <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingLeft: '8px' }}>
            <div
              onClick={() => { setSelectedRegionKey('tekateki'); audioManager.playSfx('button-click'); }}
              style={{
                width: '100%',
                maxWidth: '300px',
                backgroundColor: regions.tekateki.locked ? 'rgba(255, 255, 255, 0.8)' : 'var(--color-surface-container-lowest)',
                backdropFilter: 'blur(8px)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-xs)',
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                opacity: regions.tekateki.locked ? 0.65 : 1,
                cursor: 'pointer',
                border: selectedRegionKey === 'tekateki' ? '2px solid var(--color-primary)' : '2px solid transparent'
              }}
            >
              <div style={{
                width: '52px',
                height: '52px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: regions.tekateki.locked ? 'var(--color-surface-variant)' : 'var(--color-primary-container)',
                color: regions.tekateki.locked ? 'var(--color-outline)' : 'var(--color-on-primary-container)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '26px' }}>extension</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: regions.tekateki.locked ? 'var(--color-outline)' : 'var(--color-primary)' }}>Wilayah 4</span>
                  <span style={{ fontSize: '10px', fontWeight: 700, backgroundColor: regions.tekateki.locked ? 'var(--color-surface-variant)' : 'var(--color-secondary-container)', color: regions.tekateki.locked ? 'inherit' : 'var(--color-on-secondary-container)', padding: '2px 8px', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                    {regions.tekateki.locked ? (
                      <>
                        <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>lock</span> Lv. 14
                      </>
                    ) : (
                      'Terbuka • Lv. 14'
                    )}
                  </span>
                </div>
                <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--color-text-main)', margin: '2px 0 0' }}>
                  Gunung Teka-Teki
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: 0 }}>Benteng Logika & Roda Gigi</p>
              </div>
            </div>
          </div>

          {/* Wilayah 3: Negeri Cerita */}
          <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'flex-end', paddingRight: '8px' }}>
            <div
              onClick={() => { setSelectedRegionKey('cerita'); audioManager.playSfx('button-click'); }}
              style={{
                width: '100%',
                maxWidth: '300px',
                backgroundColor: regions.cerita.locked ? 'rgba(255, 255, 255, 0.85)' : 'var(--color-surface-container-lowest)',
                backdropFilter: 'blur(8px)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-xs)',
                boxShadow: 'var(--shadow-card)',
                cursor: 'pointer',
                opacity: regions.cerita.locked ? 0.7 : 1,
                border: selectedRegionKey === 'cerita' ? '2px solid var(--color-tertiary)' : '2px solid transparent'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: regions.cerita.locked ? 'var(--color-surface-variant)' : 'var(--color-tertiary-fixed)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '26px', color: regions.cerita.locked ? 'var(--color-outline)' : 'var(--color-tertiary)' }}>auto_stories</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: regions.cerita.locked ? 'var(--color-outline)' : 'var(--color-tertiary)' }}>Wilayah 3</span>
                    <span style={{ fontSize: '10px', fontWeight: 800, backgroundColor: regions.cerita.locked ? 'var(--color-surface-variant)' : 'var(--color-tertiary-fixed)', color: regions.cerita.locked ? 'inherit' : 'var(--color-on-tertiary-fixed)', padding: '2px 8px', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                      {regions.cerita.locked ? (
                        <>
                          <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>lock</span> Lv. 6
                        </>
                      ) : (
                        `${regions.cerita.progress}%`
                      )}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--color-text-main)', margin: '2px 0 0' }}>
                    Negeri Cerita
                  </h3>
                  <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--color-surface-variant)', borderRadius: 'var(--radius-full)', overflow: 'hidden', marginTop: '4px' }}>
                    <div style={{ width: `${regions.cerita.progress}%`, height: '100%', backgroundColor: 'var(--color-tertiary)', borderRadius: 'var(--radius-full)' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Wilayah 2: Hutan Sains */}
          <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', paddingLeft: '8px' }}>
            <div
              onClick={() => { setSelectedRegionKey('sains'); audioManager.playSfx('button-click'); }}
              style={{
                width: '100%',
                maxWidth: '300px',
                backgroundColor: regions.sains.locked ? 'rgba(255, 255, 255, 0.85)' : 'var(--color-surface-container-lowest)',
                backdropFilter: 'blur(8px)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-xs)',
                boxShadow: 'var(--shadow-card)',
                cursor: 'pointer',
                opacity: regions.sains.locked ? 0.7 : 1,
                border: selectedRegionKey === 'sains' ? '2px solid var(--color-secondary)' : '2px solid transparent'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: regions.sains.locked ? 'var(--color-surface-variant)' : 'var(--color-secondary-container)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '26px', color: regions.sains.locked ? 'var(--color-outline)' : 'var(--color-secondary)' }}>park</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: regions.sains.locked ? 'var(--color-outline)' : 'var(--color-secondary)' }}>Wilayah 2</span>
                    <span style={{ fontSize: '10px', fontWeight: 800, backgroundColor: regions.sains.locked ? 'var(--color-surface-variant)' : 'var(--color-secondary-container)', color: regions.sains.locked ? 'inherit' : 'var(--color-on-secondary-container)', padding: '2px 8px', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                      {regions.sains.locked ? (
                        <>
                          <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>lock</span> Lv. 3
                        </>
                      ) : (
                        `${regions.sains.progress}%`
                      )}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--color-text-main)', margin: '2px 0 0' }}>
                    Hutan Sains
                  </h3>
                  <div style={{ width: '100%', height: '6px', backgroundColor: 'var(--color-surface-variant)', borderRadius: 'var(--radius-full)', overflow: 'hidden', marginTop: '4px' }}>
                    <div style={{ width: `${regions.sains.progress}%`, height: '100%', backgroundColor: 'var(--color-secondary)', borderRadius: 'var(--radius-full)' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Active Pin & Speech Bubble (Wilayah 1: Lembah Angka) */}
          <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Speech bubble */}
            <div style={{ marginBottom: '8px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                backgroundColor: 'var(--color-surface-container-lowest)',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                boxShadow: 'var(--shadow-card)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '16px', color: 'var(--color-primary)' }}>chat</span>
                <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-text-main)' }}>
                  {regions.angka.progress === 0 
                    ? 'Ayo mulai petualangan di Lembah Angka!' 
                    : regions.angka.progress === 100 
                    ? 'Lembah Angka tuntas! Hebat!' 
                    : 'Ayo selesaikan Lembah Angka!'}
                </span>
              </div>
              <div style={{ width: '10px', height: '10px', backgroundColor: 'var(--color-surface-container-lowest)', transform: 'rotate(45deg)', marginTop: '-5px' }} />
            </div>

            {/* Avatar Pin with Pulsing Flare */}
            <div
              onClick={() => { setSelectedRegionKey('angka'); audioManager.playSfx('button-click'); }}
              style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <div style={{
                position: 'absolute',
                width: '76px',
                height: '76px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary-fixed-dim)',
                opacity: 0.4
              }} />
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: 'var(--color-primary-container)',
                padding: '3px',
                boxShadow: '0 8px 20px rgba(0, 97, 148, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                zIndex: 10
              }}>
                <CharacterAvatar config={characterConfig} size="md" />
              </div>
            </div>

            {/* Lembah Angka Dynamic Card */}
            <div
              onClick={() => { setSelectedRegionKey('angka'); audioManager.playSfx('button-click'); }}
              style={{
                marginTop: '10px',
                width: '100%',
                maxWidth: '320px',
                backgroundColor: 'var(--color-surface-container-lowest)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-sm)',
                boxShadow: 'var(--shadow-card)',
                cursor: 'pointer',
                border: selectedRegionKey === 'angka' ? '2px solid var(--color-primary)' : '2px solid transparent'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--color-primary-fixed)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '32px', color: 'var(--color-primary)' }}>calculate</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                      {regions.angka.progress === 100 ? 'Selesai' : 'Misi Aktif'}
                    </span>
                    <span style={{ fontSize: '10px', fontWeight: 800, backgroundColor: 'var(--color-primary-fixed)', color: 'var(--color-on-primary-fixed)', padding: '2px 8px', borderRadius: 'var(--radius-full)' }}>
                      {regions.angka.progress}%
                    </span>
                  </div>
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: 'var(--color-text-main)', margin: '2px 0 0' }}>
                    Lembah Angka
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: '2px 0' }}>
                    Matematika & Geometri Ajaib
                  </p>
                  <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--color-surface-variant)', borderRadius: 'var(--radius-full)', overflow: 'hidden', marginTop: '4px' }}>
                    <div style={{ width: `${regions.angka.progress}%`, height: '100%', backgroundColor: 'var(--color-primary)', borderRadius: 'var(--radius-full)' }} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Region Detail Bottom Drawer (Sesuai Stitch) */}
        {/* Dynamic Island Detail Bottom Sheet */}
        <div
          key={selectedRegionKey}
          className="animate-pop-in"
          style={{
            backgroundColor: 'var(--color-surface-container-lowest)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--space-md)',
            boxShadow: 'var(--shadow-card)',
            display: 'flex',
            flexDirection: 'column',
            gap: 'var(--space-sm)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '44px',
                height: '44px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--color-primary-container)',
                color: 'var(--color-on-primary-container)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '26px' }}>{selectedRegion.icon}</span>
              </div>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
                  Fokus Saat Ini
                </span>
                <h3 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text-main)', margin: 0 }}>
                  {selectedRegion.title}
                </h3>
              </div>
            </div>
            <span style={{
              backgroundColor: 'var(--color-secondary-container)',
              color: 'var(--color-on-secondary-container)',
              fontSize: '11px',
              fontWeight: 800,
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)'
            }}>
              {selectedRegion.tier}
            </span>
          </div>

          <div style={{
            backgroundColor: 'var(--color-surface-container-low)',
            borderRadius: 'var(--radius-md)',
            padding: 'var(--space-xs) var(--space-sm)',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--color-tertiary)', fontSize: '22px' }}>flag</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', display: 'block' }}>Tantangan Berikutnya:</span>
              <p style={{ fontSize: '13px', fontWeight: 800, color: 'var(--color-text-main)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {selectedRegion.nextQuest}
              </p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2px', color: 'var(--color-primary)', fontWeight: 800, fontSize: '12px' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>diamond</span>
              <span>{selectedRegion.xp}</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--space-xs)', paddingTop: '4px' }}>
            <button
              onClick={() => { navigate('/collection'); audioManager.playSfx('button-click'); }}
              style={{
                padding: '12px',
                backgroundColor: 'var(--color-surface-variant)',
                color: 'var(--color-text-main)',
                fontWeight: 800,
                fontSize: '13px',
                borderRadius: 'var(--radius-full)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>inventory_2</span>
              <span>Peti Hadiah</span>
            </button>

            <Link
              to={`/world/${selectedRegion.id}`}
              style={{
                padding: '12px',
                backgroundColor: selectedRegion.locked ? 'var(--color-outline)' : 'var(--color-primary)',
                color: 'var(--color-on-primary)',
                fontWeight: 800,
                fontSize: '13px',
                borderRadius: 'var(--radius-full)',
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                boxShadow: selectedRegion.locked ? 'none' : 'var(--shadow-tactile-primary)',
                pointerEvents: selectedRegion.locked ? 'none' : 'auto'
              }}
            >
              <span>{selectedRegion.locked ? 'Terkunci' : 'Masuk Wilayah'}</span>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_forward</span>
            </Link>
          </div>
        </div>
      </main>

      <BottomNavDock />
    </div>
  );
}
