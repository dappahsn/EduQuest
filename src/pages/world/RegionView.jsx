import React from 'react';
import { useParams, Link } from 'react-router-dom';
import GameHeader from '../../components/navigation/GameHeader';
import BottomNavDock from '../../components/navigation/BottomNavDock';
import CharacterAvatar from '../../components/character/CharacterAvatar';
import { useGame } from '../../context/GameContext';

const REGION_QUESTS = {
  'lembah-angka': [
    {
      id: 'quest-la-1',
      number: '01',
      title: 'Penjumlahan Segitiga Ajaib',
      desc: 'Hitung sudut dan panjang segitiga jembatan.',
      gameId: 'mini-nc',
      stars: 3,
      xp: 100
    },
    {
      id: 'quest-la-2',
      number: '02',
      title: 'Dunia Pecahan Pizza Lab',
      desc: 'Potong dan sajikan pecahan 3/4 untuk tim penjelajah.',
      gameId: 'mini-pl',
      stars: 3,
      xp: 120
    },
    {
      id: 'quest-la-3',
      number: '03',
      title: 'Jembatan Perkalian Kilat',
      desc: 'Lompati batu sungai dengan jawaban perkalian 7 x 8 = 56!',
      gameId: 'mini-nc',
      stars: 3,
      xp: 150
    },
    {
      id: 'quest-la-boss',
      number: 'BOS',
      title: 'Gerbang Aljabar Kristal',
      desc: 'Pecahkan teka-teki misteri penguasa Lembah Angka.',
      gameId: 'mini-nc',
      stars: 3,
      xp: 300
    }
  ],
  'hutan-sains': [
    {
      id: 'quest-hs-1',
      number: '01',
      title: 'Misteri Fotosintesis Daun',
      desc: 'Kumpulkan klorofil dan tetesan embun pagi.',
      gameId: 'mini-nc',
      stars: 3,
      xp: 120
    },
    {
      id: 'quest-hs-2',
      number: '02',
      title: 'Metamorfosis Kupu-Kupu',
      desc: 'Urutkan tahapan telur, ulat, kepompong, hingga kupu-kupu.',
      gameId: 'mini-pl',
      stars: 3,
      xp: 140
    },
    {
      id: 'quest-hs-3',
      number: '03',
      title: 'Penjelajah Flora Langka',
      desc: 'Dokumentasikan tanaman kantong semar dan bunga raksasa.',
      gameId: 'mini-nc',
      stars: 3,
      xp: 160
    }
  ],
  'negeri-cerita': [
    {
      id: 'quest-nc-1',
      number: '01',
      title: 'Dongeng Nusantara: Timun Mas',
      desc: 'Rangkai kalimat kisah Timun Mas yang bijak dan berani.',
      gameId: 'mini-sb',
      stars: 3,
      xp: 150
    },
    {
      id: 'quest-nc-2',
      number: '02',
      title: 'Susunan Kalimat Bahasa',
      desc: 'Pelajari peran Subjek, Predikat, Objek, dan Keterangan.',
      gameId: 'mini-sb',
      stars: 3,
      xp: 160
    },
    {
      id: 'quest-nc-3',
      number: '03',
      title: 'Aksara Pusaka Nusantara',
      desc: 'Temukan jejak tulisan kuno dan kekayaan sastra daerah.',
      gameId: 'mini-sb',
      stars: 3,
      xp: 180
    }
  ],
  'gunung-teka-teki': [
    {
      id: 'quest-gt-1',
      number: '01',
      title: 'Misi Robot Penyelamat',
      desc: 'Rancang algoritma langkah untuk Bot Budi meraih Baterai Kristal.',
      gameId: 'mini-rr',
      stars: 3,
      xp: 160
    },
    {
      id: 'quest-gt-2',
      number: '02',
      title: 'Kode Algoritma Roda Gigi',
      desc: 'Pecahkan arah putaran roda gigi mekanik benteng.',
      gameId: 'mini-rr',
      stars: 3,
      xp: 180
    },
    {
      id: 'quest-gt-3',
      number: '03',
      title: 'Gerbang Logika Benar-Salah',
      desc: 'Ambil keputusan logis untuk membuka pintu ruang harta.',
      gameId: 'mini-rr',
      stars: 3,
      xp: 200
    }
  ],
  'angkasa-pengetahuan': [
    {
      id: 'quest-ap-1',
      number: '01',
      title: 'Penyusun Tata Surya Kosmik',
      desc: 'Susun orbit planet-planet berdasarkan jaraknya dari Matahari.',
      gameId: 'mini-ss',
      stars: 3,
      xp: 160
    },
    {
      id: 'quest-ap-2',
      number: '02',
      title: 'Daya Tarik Gravitasi',
      desc: 'Jelajahi perbedaan berat benda di Bulan dan Bumi.',
      gameId: 'mini-ss',
      stars: 3,
      xp: 180
    },
    {
      id: 'quest-ap-3',
      number: '03',
      title: 'Peluncuran Stasiun Antariksa',
      desc: 'Rancang penerbangan modul laboratorium antariksa.',
      gameId: 'mini-ss',
      stars: 3,
      xp: 220
    }
  ]
};

export default function RegionView() {
  const { regionId } = useParams();
  const { characterConfig, completedQuestIds = [] } = useGame();

  const rawQuests = REGION_QUESTS[regionId] || REGION_QUESTS['lembah-angka'];
  const quests = rawQuests.map((q, idx) => {
    const isCompleted = completedQuestIds.includes(q.id);
    const prevQuest = idx > 0 ? rawQuests[idx - 1] : null;
    const isPrevCompleted = prevQuest ? completedQuestIds.includes(prevQuest.id) : true;
    const isActive = !isCompleted && isPrevCompleted;
    const isLocked = !isCompleted && !isPrevCompleted;
    return {
      ...q,
      completed: isCompleted,
      active: isActive,
      locked: isLocked
    };
  });

  const regionTitle = regionId ? regionId.replace('-', ' ').toUpperCase() : 'LEMBAH ANGKA';

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
        {/* Breadcrumb back */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link
            to="/world"
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-surface-container-high)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-text-main)',
              textDecoration: 'none'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_back</span>
          </Link>
          <div>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
              Peta Pulau
            </span>
            <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-text-main)', margin: 0 }}>
              {regionTitle}
            </h1>
          </div>
        </div>

        {/* Stepping-Stone Trail List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
          {quests.map((q) => (
            <div
              key={q.id}
              className={q.locked ? '' : 'interactive-card'}
              style={{
                backgroundColor: q.locked ? 'var(--color-surface-container-high)' : 'var(--color-surface-container-lowest)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--space-sm)',
                boxShadow: q.active ? '0 8px 24px rgba(0, 97, 148, 0.2)' : 'var(--shadow-card)',
                border: q.active ? '2px solid var(--color-primary)' : '2px solid var(--color-outline-subtle)',
                opacity: q.locked ? 0.6 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: 'var(--space-sm)',
                position: 'relative'
              }}
            >
              {/* Stepping stone icon / pin */}
              <div style={{
                width: '54px',
                height: '54px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: q.completed ? 'var(--color-secondary-container)' : q.active ? 'var(--color-primary-container)' : 'var(--color-surface-variant)',
                color: q.completed ? 'var(--color-on-secondary-container)' : q.active ? 'var(--color-on-primary-container)' : 'var(--color-outline)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 900,
                fontSize: '14px',
                flexShrink: 0
              }}>
                {q.completed ? (
                  <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>check_circle</span>
                ) : q.locked ? (
                  <span className="material-symbols-outlined" style={{ fontSize: '24px' }}>lock</span>
                ) : (
                  <>
                    <span>Misi</span>
                    <span>{q.number}</span>
                  </>
                )}
              </div>

              {/* Quest Details */}
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', fontWeight: 800, color: q.active ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
                    {q.completed ? 'Selesai' : q.active ? 'Misi Aktif' : 'Terkunci'}
                  </span>
                  {q.completed && (
                    <span style={{ fontSize: '12px', color: '#ffb690' }}>
                      {'⭐'.repeat(q.stars)}
                    </span>
                  )}
                  {q.active && (
                    <span style={{
                      fontSize: '11px',
                      fontWeight: 800,
                      backgroundColor: 'var(--color-secondary-container)',
                      color: 'var(--color-on-secondary-container)',
                      padding: '2px 8px',
                      borderRadius: 'var(--radius-full)'
                    }}>
                      +{q.xp} XP
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: '15px', fontWeight: 800, color: 'var(--color-text-main)', margin: '2px 0' }}>
                  {q.title}
                </h3>
                <p style={{ fontSize: '12px', color: 'var(--color-text-muted)', margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {q.desc}
                </p>

                {q.active && (
                  <div style={{ marginTop: '8px' }}>
                    <Link
                      to={`/quest/${q.id}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        backgroundColor: 'var(--color-primary)',
                        color: 'var(--color-on-primary)',
                        padding: '6px 14px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '12px',
                        fontWeight: 800,
                        textDecoration: 'none',
                        boxShadow: 'var(--shadow-tactile-primary)'
                      }}
                    >
                      <span>Masuk Misi</span>
                      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_forward</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      <BottomNavDock />
    </div>
  );
}
