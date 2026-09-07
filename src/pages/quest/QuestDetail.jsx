import React from 'react';
import { useParams, Link } from 'react-router-dom';
import GameHeader from '../../components/navigation/GameHeader';
import BottomNavDock from '../../components/navigation/BottomNavDock';

const QUESTS_DETAIL = {
  'quest-la-1': {
    id: 'quest-la-1',
    title: 'Jembatan Perkalian Kilat',
    regionId: 'lembah-angka',
    regionName: 'Lembah Angka',
    difficulty: 'Mudah',
    discoveryId: 'disc-la-1',
    gameId: 'mini-nc',
    description: 'Bantu Raka menyeberangi sungai batu apung yang berputar deras dengan memecahkan perkalian cepat 7 x 8 = 56!',
    objectives: [
      'Pahami pola perkalian 7 dan 8',
      'Pilih batu lompatan angka yang tepat',
      'Kumpulkan 3 bintang kemenangan'
    ],
    rewards: {
      xp: 120,
      coins: 40,
      item: 'Baret Detektif Cilik',
      card: 'Bumi Kita'
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
      xp: 140,
      coins: 45,
      item: 'Celemek Koki Cilik',
      card: 'Bulan Purnama'
    }
  },
  'quest-la-3': {
    id: 'quest-la-3',
    title: 'Penjumlahan Segitiga Ajaib',
    regionId: 'lembah-angka',
    regionName: 'Lembah Angka',
    difficulty: 'Tantangan',
    discoveryId: 'disc-la-3',
    gameId: 'mini-mt',
    description: 'Hitung sudut dan sisi segitiga jembatan kristal untuk membuka jalan menuju lembah rahasia.',
    objectives: [
      'Pahami sifat-sifat dasar segitiga',
      'Hitung panjang sisi dan sudut yang hilang',
      'Kumpulkan 3 bintang kemenangan'
    ],
    rewards: {
      xp: 160,
      coins: 50,
      item: 'Topi Petualang Klasik',
      card: 'Segitiga Ajaib'
    }
  },
  'quest-la-geom': {
    id: 'quest-la-geom',
    title: 'Penjumlahan Segitiga Ajaib',
    regionId: 'lembah-angka',
    regionName: 'Lembah Angka',
    difficulty: 'Tantangan',
    discoveryId: 'disc-la-3',
    gameId: 'mini-mt',
    description: 'Hitung sudut dan sisi segitiga jembatan kristal untuk membuka jalan menuju lembah rahasia.',
    objectives: [
      'Pahami sifat-sifat dasar segitiga',
      'Hitung panjang sisi dan sudut yang hilang',
      'Kumpulkan 3 bintang kemenangan'
    ],
    rewards: {
      xp: 160,
      coins: 50,
      item: 'Topi Petualang Klasik',
      card: 'Segitiga Ajaib'
    }
  },
  'quest-la-boss': {
    id: 'quest-la-boss',
    title: 'Gerbang Aljabar Kristal',
    regionId: 'lembah-angka',
    regionName: 'Lembah Angka',
    difficulty: 'Tantangan Bos',
    discoveryId: 'disc-la-boss',
    gameId: 'mini-ag',
    description: 'Pecahkan teka-teki misteri penguasa Lembah Angka untuk membuka kristal pengetahuan abadi.',
    objectives: [
      'Pecahkan teka-teki hitung variabel misterius',
      'Aktifkan pilar kristal aljabar',
      'Raih kemenangan agung Lembah Angka'
    ],
    rewards: {
      xp: 300,
      coins: 80,
      item: 'Mahkota Kristal Angka',
      card: 'Aljabar Kosmik'
    }
  },
  'quest-hs-1': {
    id: 'quest-hs-1',
    title: 'Misteri Fotosintesis Daun',
    regionId: 'hutan-sains',
    regionName: 'Hutan Sains',
    difficulty: 'Normal',
    discoveryId: 'disc-hs-1',
    gameId: 'mini-ps',
    description: 'Kumpulkan reaktan alami, bongkar dapur klorofil daun, dan panen glukosa serta oksigen segar!',
    objectives: [
      'Pilih 3 bahan fotosintesis (Cahaya, Air, CO₂)',
      'Bongkar peran Klorofil, Stomata, dan Xilem',
      'Panen glukosa makanan & lepaskan oksigen segar'
    ],
    rewards: {
      xp: 140,
      coins: 45,
      item: 'Jas Laboratorium Hijau',
      card: 'Dapur Daun Fotosintesis'
    }
  },
  'quest-hs-2': {
    id: 'quest-hs-2',
    title: 'Metamorfosis Kupu-Kupu',
    regionId: 'hutan-sains',
    regionName: 'Hutan Sains',
    difficulty: 'Normal',
    discoveryId: 'disc-hs-2',
    gameId: 'mini-bm',
    description: 'Ungkap keajaiban transformasi ulat menjadi kepompong hingga kupu-kupu bersayap elok pemikat bunga rimba!',
    objectives: [
      'Urutkan 4 tahapan metamorfosis sempurna (Telur, Larva, Pupa, Imago)',
      'Beri makan ulat daun hijau berembun & bantu mekarkan sayap sutra',
      'Kuasai kuis sains ekosistem dan polinasi bunga'
    ],
    rewards: {
      xp: 140,
      coins: 45,
      item: 'Sayap Sutra Zamrud',
      card: 'Kupu-Kupu Rimba Zamrud'
    }
  },
  'quest-hs-3': {
    id: 'quest-hs-3',
    title: 'Penjelajah Flora Langka',
    regionId: 'hutan-sains',
    regionName: 'Hutan Sains',
    difficulty: 'Normal',
    discoveryId: 'disc-hs-3',
    gameId: 'mini-rf',
    description: 'Jelajahi kanopi hutan tropis dan dokumentasikan rahasia tanaman pemangsa kantong semar serta bunga raksasa Padma Rafflesia!',
    objectives: [
      'Pelajari adaptasi perangkap kantong semar dan penyerapan nitrogen serangga',
      'Mekarkan bunga raksasa Padma Rafflesia dan amati aroma pemikat lalat penyerbuk',
      'Selesaikan kuis observasi botani flora endemik nusantara'
    ],
    rewards: {
      xp: 160,
      coins: 45,
      item: 'Lensa Botani Rimba',
      card: 'Padma Raksasa & Kantong Semar Rimba'
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
  'quest-nc-2': {
    id: 'quest-nc-2',
    title: 'Susunan Kalimat Bahasa',
    regionId: 'negeri-cerita',
    regionName: 'Negeri Cerita',
    difficulty: 'Normal',
    discoveryId: 'disc-nc-2',
    gameId: 'mini-sb',
    description: 'Kuasai formula rahasia tata bahasa Nusantara: Subjek (S), Predikat (P), Objek (O), dan Keterangan (K) melalui petualangan menyusun kisah legendaris!',
    objectives: [
      'Pahami peran Subjek (Tokoh) dan Predikat (Aksi)',
      'Pasangkan Objek (Sasaran) dan Keterangan (Tempat/Waktu)',
      'Tuntaskan 3 babak susunan kalimat SPOK Nusantara'
    ],
    rewards: {
      xp: 160,
      coins: 50,
      item: 'Pena Bulu Emas Pujangga',
      card: 'Kitab Sastra Nusantara'
    }
  },
  'quest-nc-3': {
    id: 'quest-nc-3',
    title: 'Pujangga Pantun Nusantara',
    regionId: 'negeri-cerita',
    regionName: 'Negeri Cerita',
    difficulty: 'Tantangan',
    discoveryId: 'disc-nc-3',
    gameId: 'mini-pp',
    description: 'Masuki Balairung Sastra Melayu dan Nusantara! Pelajari keselarasan bait, bedakan sampiran dan isi, serta susun rima sajak a-b-a-b penuh nasihat luhur.',
    objectives: [
      'Lengkapi bait Pantun Nasihat & Belajar berima serasi',
      'Pecahkan teka-teki pantun jenaka flora & fauna Nusantara',
      'Rangkai 4 larik utuh Pantun Budi Pekerti leluhur'
    ],
    rewards: {
      xp: 180,
      coins: 60,
      item: 'Pena Bulu Kencana Pujangga',
      card: 'Bait Pantun & Puisi Rakyat Nusantara'
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
  'quest-gt-2': {
    id: 'quest-gt-2',
    title: 'Kode Algoritma Roda Gigi',
    regionId: 'gunung-teka-teki',
    regionName: 'Gunung Teka-Teki',
    difficulty: 'Menengah',
    discoveryId: 'disc-gt-2',
    gameId: 'mini-gp',
    description: 'Pecahkan arah rotasi dan rasio putaran roda gigi mekanik kuno untuk membuka pintu reaktor lava benteng.',
    objectives: [
      'Pahami prinsip arah putar roda gigi bertaut (berlawanan)',
      'Hitung paritas sambungan rantai transmisi',
      'Pecahkan rasio gigi dan frekuensi putaran mesin'
    ],
    rewards: {
      xp: 180,
      coins: 50,
      item: 'Perlengkapan Teknisi Mekanik Kuno',
      card: 'Roda Gigi Mekanik Benteng Siber'
    }
  },
  'quest-gt-3': {
    id: 'quest-gt-3',
    title: 'Gerbang Logika Benar-Salah',
    regionId: 'gunung-teka-teki',
    regionName: 'Gunung Teka-Teki',
    difficulty: 'Tantangan',
    discoveryId: 'disc-gt-3',
    gameId: 'mini-lg',
    description: 'Bantu Raka membuka 3 pintu benteng kuno dengan menghubungkan saklar dan gerbang logika (AND, OR, NOT) agar arus daya mengalir ke kristal energi!',
    objectives: [
      'Pahami prinsip gerbang AND: semua saklar harus ON',
      'Kendalikan pembalik sinyal NOT dan gerbang OR',
      'Selesaikan rangkaian gerbang logika di 3 sektor benteng'
    ],
    rewards: {
      xp: 200,
      coins: 55,
      item: 'Kunci Kristal Benteng',
      card: 'Gerbang Logika Benar-Salah'
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
    description: 'Bantu tim penjelajah kosmik menyusun orbit planet-planet tata surya mengelilingi Matahari: dari 4 planet batuan dalam, raksasa gas luar, hingga rekonsiliasi 8 planet lengkap!',
    objectives: [
      'Susun 4 planet batuan dalam (Merkurius, Venus, Bumi, Mars)',
      'Tempatkan 4 planet raksasa di luar Sabuk Asteroid',
      'Pecahkan anomali orbit dan selaraskan 8 planet tata surya'
    ],
    rewards: {
      xp: 160,
      coins: 45,
      item: 'Helm Astronot Perak',
      card: 'Matahari Bersinar'
    }
  },
  'quest-ap-2': {
    id: 'quest-ap-2',
    title: 'Daya Tarik Gravitasi',
    regionId: 'angkasa-pengetahuan',
    regionName: 'Angkasa Pengetahuan',
    difficulty: 'Normal',
    discoveryId: 'disc-ap-2',
    gameId: 'gravity-lab',
    description: 'Jelajahi perbedaan berat benda di Bumi dan Bulan menggunakan pegas 3D interaktif dan perlengkapan astronot!',
    objectives: [
      'Uji perbandingan gravitasi Bumi (9.8 m/s²) dan Bulan (1.6 m/s²)',
      'Timbang Rover Penjelajah, Meteorit Logam, dan Tabung Oksigen',
      'Pahami hubungan antara massa benda konstan dan gaya berat'
    ],
    rewards: {
      xp: 180,
      coins: 45,
      item: 'Sepatu Gravitasi Kosmik',
      card: 'Bulan Purnama'
    }
  },
  'quest-ap-3': {
    id: 'quest-ap-3',
    title: 'Peluncuran Stasiun Antariksa',
    regionId: 'angkasa-pengetahuan',
    regionName: 'Angkasa Pengetahuan',
    difficulty: 'Tantangan',
    discoveryId: 'disc-ap-3',
    gameId: 'space-station-launch',
    description: 'Rancang penerbangan modul laboratorium antariksa, kendalikan peluncuran roket bertingkat 3D, dan lakukan manuver docking presisi di orbit stasiun antariksa!',
    objectives: [
      'Kendalikan throttle roket melewati Max-Q atmosfer bumi',
      'Lakukan pemisahan booster tahap 1 dan pelepasan pelindung fairing modul',
      'Maneuver sistem pendorong RCS modul hingga terkunci aman di docking port ISS'
    ],
    rewards: {
      xp: 220,
      coins: 55,
      item: 'Lencana Komandan Antariksa',
      card: 'Stasiun Antariksa Orbital'
    }
  }
};

export default function QuestDetail() {
  const { questId } = useParams();
  const quest = QUESTS_DETAIL[questId] || QUESTS_DETAIL['quest-la-3'];
  const isForest = quest.regionId === 'hutan-sains';

  return (
    <div style={{
      minHeight: '100vh',
      background: isForest
        ? 'radial-gradient(ellipse at 50% 10%, #d1fae5 0%, #ecfdf5 45%, #f0fdf4 100%)'
        : 'var(--color-surface)',
      paddingTop: '80px',
      paddingBottom: '96px',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative'
    }}>
      {isForest && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '340px',
            background: 'radial-gradient(circle at 50% 0%, rgba(16, 185, 129, 0.2) 0%, transparent 75%)',
            pointerEvents: 'none',
            zIndex: 0
          }}
        />
      )}

      <GameHeader />

      <main style={{
        maxWidth: '520px',
        width: '100%',
        margin: '0 auto',
        padding: '0 var(--space-md)',
        display: 'flex',
        flexDirection: 'column',
        gap: 'var(--space-md)',
        position: 'relative',
        zIndex: 1
      }}>
        {/* Breadcrumb back */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Link
            to={`/world/${quest.regionId}`}
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '50%',
              backgroundColor: isForest ? '#ffffff' : 'var(--color-surface-container-high)',
              border: isForest ? '1.5px solid #a7f3d0' : 'none',
              boxShadow: isForest ? '0 2px 8px rgba(16, 185, 129, 0.15)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isForest ? '#047857' : 'var(--color-text-main)',
              textDecoration: 'none'
            }}
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>arrow_back</span>
          </Link>
          <div>
            <span style={{
              fontSize: '11px',
              fontWeight: 800,
              color: isForest ? '#059669' : 'var(--color-primary)',
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              {isForest ? '🌿 HUTAN SAINS' : quest.regionName}
            </span>
            <h1 style={{
              fontSize: '18px',
              fontWeight: 900,
              color: isForest ? '#064e3b' : 'var(--color-text-main)',
              margin: 0
            }}>
              {quest.title}
            </h1>
          </div>
        </div>

        {/* Quest Overview Card */}
        <div style={{
          backgroundColor: isForest ? '#ffffff' : 'var(--color-surface-container-lowest)',
          border: isForest ? '1.5px solid #a7f3d0' : 'none',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--space-md)',
          boxShadow: isForest ? '0 10px 28px rgba(16, 185, 129, 0.14)' : 'var(--shadow-card)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--space-sm)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{
              backgroundColor: isForest ? '#d1fae5' : 'var(--color-primary-fixed)',
              color: isForest ? '#065f46' : 'var(--color-on-primary-fixed)',
              border: isForest ? '1px solid #a7f3d0' : 'none',
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              fontSize: '11px',
              fontWeight: 800
            }}>
              Tingkat: {quest.difficulty}
            </span>
            <span style={{
              backgroundColor: isForest ? '#10b981' : 'var(--color-secondary-container)',
              color: '#ffffff',
              fontSize: '11px',
              fontWeight: 900,
              padding: '4px 10px',
              borderRadius: 'var(--radius-full)',
              boxShadow: isForest ? '0 2px 8px rgba(16, 185, 129, 0.4)' : 'none'
            }}>
              +{quest.rewards.xp} XP
            </span>
          </div>

          <p style={{
            fontSize: '14px',
            lineHeight: 1.5,
            color: isForest ? '#064e3b' : 'var(--color-text-main)',
            margin: 0,
            fontWeight: 500
          }}>
            {quest.description}
          </p>

          <div style={{
            backgroundColor: isForest ? '#ecfdf5' : 'var(--color-surface-container-low)',
            border: isForest ? '1px solid #d1fae5' : 'none',
            padding: 'var(--space-sm)',
            borderRadius: 'var(--radius-md)'
          }}>
            <span style={{
              fontSize: '12px',
              fontWeight: 800,
              color: isForest ? '#047857' : 'var(--color-text-muted)',
              display: 'block',
              marginBottom: '6px'
            }}>
              Target Misi:
            </span>
            <ul style={{
              margin: 0,
              paddingLeft: '18px',
              fontSize: '13px',
              color: isForest ? '#064e3b' : 'var(--color-text-main)',
              lineHeight: 1.6
            }}>
              {quest.objectives.map((obj, i) => (
                <li key={i}>{obj}</li>
              ))}
            </ul>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '4px' }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: isForest ? '#059669' : 'var(--color-text-muted)' }}>
              Hadiah Spesial:
            </span>
            <div style={{ display: 'flex', gap: '6px' }}>
              <span style={{
                backgroundColor: isForest ? '#d1fae5' : 'var(--color-tertiary-fixed)',
                color: isForest ? '#065f46' : 'var(--color-on-tertiary-fixed)',
                border: isForest ? '1px solid #a7f3d0' : 'none',
                padding: '2px 8px',
                borderRadius: 'var(--radius-full)',
                fontSize: '11px',
                fontWeight: 800
              }}>
                💎 +{quest.rewards.coins} Koin
              </span>
              <span style={{
                backgroundColor: isForest ? '#ffffff' : 'var(--color-surface-container-high)',
                border: isForest ? '1px solid #a7f3d0' : 'none',
                color: isForest ? '#064e3b' : 'var(--color-text-main)',
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
            backgroundColor: '#ffffff',
            border: isForest ? '2px solid #10b981' : '2px solid var(--color-primary-fixed)',
            padding: 'var(--space-sm)',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            textDecoration: 'none',
            color: 'var(--color-text-main)',
            boxShadow: isForest ? '0 4px 14px rgba(16, 185, 129, 0.12)' : 'var(--shadow-card)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: isForest ? '#d1fae5' : 'var(--color-primary-fixed)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: isForest ? '#047857' : 'var(--color-primary)'
            }}>
              <span className="material-symbols-outlined" style={{ fontSize: '22px' }}>lightbulb</span>
            </div>
            <div>
              <span style={{ fontSize: '14px', fontWeight: 800, color: isForest ? '#064e3b' : 'inherit', display: 'block' }}>
                Baca Penemuan Konsep
              </span>
              <span style={{ fontSize: '12px', color: isForest ? '#059669' : 'var(--color-text-muted)' }}>
                Pelajari trik cepat sebelum bermain
              </span>
            </div>
          </div>
          <span className="material-symbols-outlined" style={{ color: isForest ? '#059669' : 'var(--color-primary)' }}>
            chevron_right
          </span>
        </Link>

        {/* Direct Play Button */}
        <Link
          to={`/game/${quest.gameId}?questId=${quest.id}`}
          style={{
            width: '100%',
            padding: '14px',
            background: isForest
              ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
              : 'var(--color-primary)',
            color: '#ffffff',
            borderRadius: 'var(--radius-full)',
            fontWeight: 800,
            fontSize: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            textDecoration: 'none',
            boxShadow: isForest
              ? '0 6px 20px rgba(16, 185, 129, 0.45)'
              : 'var(--shadow-tactile-primary)'
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
