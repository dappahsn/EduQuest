import React from 'react';
import { useParams, Link } from 'react-router-dom';
import GameHeader from '../../components/navigation/GameHeader';
import BottomNavDock from '../../components/navigation/BottomNavDock';

const QUESTS_DETAIL = {
  'quest-la-1': {
    id: 'quest-la-1',
    title: 'Penjumlahan Segitiga Ajaib',
    regionId: 'lembah-angka',
    regionName: 'Lembah Angka',
    difficulty: 'Mudah',
    discoveryId: 'disc-la-1',
    gameId: 'mini-nc',
    description: 'Hitung sudut dan sisi segitiga jembatan batu untuk membuka jalan menuju lembah rahasia.',
    objectives: [
      'Pahami sifat-sifat dasar segitiga',
      'Hitung panjang sisi yang hilang',
      'Kumpulkan 3 bintang kemenangan'
    ],
    rewards: {
      xp: 100,
      coins: 30,
      item: 'Topi Petualang Klasik',
      card: 'Segitiga Ajaib'
    }
  },
  'quest-la-2': {
    id: 'quest-la-2',
    title: 'Dunia Pecahan Pizza Lab',
    regionId: 'lembah-angka',
    regionName: 'Lembah Angka',
    difficulty: 'Normal',
    discoveryId: 'disc-la-2',
    gameId: 'mini-pl',
    description: 'Potong dan sajikan pecahan 3/4 untuk tim penjelajah di laboratorium koki Milo.',
    objectives: [
      'Pahami konsep pembilang dan penyebut',
      'Pilih potongan pizza yang sesuai pesanan',
      'Sajikan semua pesanan tanpa salah'
    ],
    rewards: {
      xp: 120,
      coins: 35,
      item: 'Celemek Koki Cilik',
      card: 'Bulan Purnama'
    }
  },
  'quest-la-3': {
    id: 'quest-la-3',
    title: 'Jembatan Perkalian Misterius',
    regionId: 'lembah-angka',
    regionName: 'Lembah Angka',
    difficulty: 'Tantangan',
    discoveryId: 'disc-la-3',
    gameId: 'mini-nc',
    description: 'Bantu Raka menyeberangi sungai batu apung yang berputar deras dengan memecahkan perkalian cepat 7 x 8 = 56!',
    objectives: [
      'Pahami pola perkalian 7 dan 8',
      'Pilih batu lompatan angka yang tepat',
      'Kumpulkan 3 bintang tanpa kehilangan energi'
    ],
    rewards: {
      xp: 150,
      coins: 40,
      item: 'Baret Detektif Cilik',
      card: 'Bumi Kita'
    }
  },
  'quest-hs-1': {
    id: 'quest-hs-1',
    title: 'Misteri Fotosintesis Daun',
    regionId: 'hutan-sains',
    regionName: 'Hutan Sains',
    difficulty: 'Normal',
    discoveryId: 'disc-hs-1',
    gameId: 'mini-nc',
    description: 'Kumpulkan energi surya dan tetesan embun untuk membantu daun melakukan fotosintesis.',
    objectives: [
      'Pahami peran klorofil dan sinar matahari',
      'Hitung partikel oksigen yang dihasilkan',
      'Buka rahasia hutan hijau'
    ],
    rewards: {
      xp: 120,
      coins: 35,
      item: 'Jas Laboratorium Hijau',
      card: 'Hutan Hujan Tropis'
    }
  },
  'quest-nc-1': {
    id: 'quest-nc-1',
    title: 'Dongeng Nusantara: Timun Mas',
    regionId: 'negeri-cerita',
    regionName: 'Negeri Cerita',
    difficulty: 'Normal',
    discoveryId: 'disc-nc-1',
    gameId: 'mini-sb',
    description: 'Susun kembali kalimat kisah Timun Mas yang bijak menghadapi raksasa.',
    objectives: [
      'Kenali unsur Subjek, Predikat, dan Objek',
      'Rangkai urutan kalimat cerita rakyat',
      'Selesaikan dongeng legenda nusantara'
    ],
    rewards: {
      xp: 150,
      coins: 40,
      item: 'Selendang Sutra Emas',
      card: 'Kepulauan Nusantara'
    }
  },
  'quest-gt-1': {
    id: 'quest-gt-1',
    title: 'Misi Robot Penyelamat',
    regionId: 'gunung-teka-teki',
    regionName: 'Gunung Teka-Teki',
    difficulty: 'Tantangan',
    discoveryId: 'disc-gt-1',
    gameId: 'mini-rr',
    description: 'Rancang instruksi algoritma langkah per langkah agar Bot Budi mengambil baterai kristal.',
    objectives: [
      'Susun blok arah komputasional',
      'Hindari dinding jebakan benteng',
      'Capai koordinat baterai kristal (2, 2)'
    ],
    rewards: {
      xp: 160,
      coins: 45,
      item: 'Kostum Cyber Petualang',
      card: 'Gunung Berapi Misterius'
    }
  },
  'quest-ap-1': {
    id: 'quest-ap-1',
    title: 'Penyusun Tata Surya Kosmik',
    regionId: 'angkasa-pengetahuan',
    regionName: 'Angkasa Pengetahuan',
    difficulty: 'Tantangan',
    discoveryId: 'disc-ap-1',
    gameId: 'mini-ss',
    description: 'Tempatkan planet Merkurius, Venus, Bumi, dan Mars pada orbit yang tepat dari Matahari.',
    objectives: [
      'Pahami jarak orbit planet ke Matahari',
      'Gunakan hafalan Me-Ve-Bu-Ma',
      'Rampungkan susunan 4 planet dalam'
    ],
    rewards: {
      xp: 160,
      coins: 45,
      item: 'Helm Astronot Perak',
      card: 'Matahari Bersinar'
    }
  }
};

export default function QuestDetail() {
  const { questId } = useParams();
  const quest = QUESTS_DETAIL[questId] || QUESTS_DETAIL['quest-la-3'];

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
            to={`/world/${quest.regionId}`}
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
              {quest.regionName}
            </span>
            <h1 style={{ fontSize: '18px', fontWeight: 800, color: 'var(--color-text-main)', margin: 0 }}>
              {quest.title}
            </h1>
          </div>
        </div>

        {/* Quest Overview Card */}
        <div style={{
          backgroundColor: 'var(--color-surface-container-lowest)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-md)',
          boxShadow: 'var(--shadow-card)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-sm)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{
              backgroundColor: 'var(--color-primary-fixed)',
              color: 'var(--color-on-primary-fixed)',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              fontSize: '11px',
              fontWeight: 800
            }}>
              Tingkat: {quest.difficulty}
            </span>
            <span style={{
              backgroundColor: 'var(--color-secondary-container)',
              color: 'var(--color-on-secondary-container)',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              fontSize: '11px',
              fontWeight: 800
            }}>
              +{quest.rewards.xp} XP
            </span>
          </div>

          <p style={{ fontSize: '14px', lineHeight: 1.5, color: 'var(--color-text-main)', margin: 0 }}>
            {quest.description}
          </p>

          <div style={{
            backgroundColor: 'var(--color-surface-container-low)',
            padding: 'var(--space-sm)',
            borderRadius: 'var(--radius-md)'
          }}>
            <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-text-muted)', display: 'block', marginBottom: '6px' }}>
              Target Misi:
            </span>
            <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '13px', color: 'var(--color-text-main)', lineHeight: 1.6 }}>
              {quest.objectives.map((obj, i) => (
                <li key={i}>{obj}</li>
              ))}
            </ul>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '4px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)' }}>
              Hadiah Spesial:
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <span style={{
                backgroundColor: 'var(--color-tertiary-fixed)',
                color: 'var(--color-on-tertiary-fixed)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                fontSize: '11px',
                fontWeight: 800
              }}>
                💎 +{quest.rewards.coins} Koin
              </span>
              <span style={{
                backgroundColor: 'var(--color-surface-container-high)',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                fontSize: '11px',
                fontWeight: 800
              }}>
                📦 {quest.rewards.item}
              </span>
            </div>
          </div>
        </div>

        {/* Discovery Step Button */}
        <Link
          to={`/discovery/${quest.discoveryId}`}
          style={{
            backgroundColor: 'var(--color-surface-container-lowest)',
            border: '2px solid var(--color-primary-fixed)',
            padding: 'var(--space-sm)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            textDecoration: 'none',
            color: 'var(--color-text-main)',
            boxShadow: 'var(--shadow-card)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: 'var(--color-primary-fixed)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--color-primary)'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>lightbulb</span>
            </div>
            <div>
              <span style={{ fontSize: '14px', fontWeight: 800, display: 'block' }}>Baca Penemuan Konsep</span>
              <span style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>Pelajari trik cepat sebelum bermain</span>
            </div>
          </div>
          <span className="material-symbols-outlined" style={{ color: 'var(--color-primary)' }}>chevron_right</span>
        </Link>

        {/* Direct Play Button */}
        <Link
          to={`/game/${quest.gameId}`}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: 'var(--color-primary)',
            color: 'var(--color-on-primary)',
            borderRadius: 'var(--radius-full)',
            fontWeight: 800,
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            textDecoration: 'none',
            boxShadow: 'var(--shadow-tactile-primary)'
          }}
        >
          <span>Mulai Misi Sekarang!</span>
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>play_arrow</span>
        </Link>
      </main>

      <BottomNavDock />
    </div>
  );
}
