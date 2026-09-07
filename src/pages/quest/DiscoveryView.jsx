import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import GameHeader from '../../components/navigation/GameHeader';
import BottomNavDock from '../../components/navigation/BottomNavDock';

const DISCOVERY_DATA = {
  'disc-la-1': {
    id: 'disc-la-1',
    title: 'Jembatan Lompatan Perkalian',
    regionName: 'Lembah Angka',
    category: 'Perkalian Cepat',
    gameId: 'mini-nc',
    conceptEmoji: '🔢',
    factTitle: 'Pola Rahasia Perkalian',
    factContent: 'Perkalian 7 x 8 = 56. Kamu bisa mengingatnya dengan urutan angka: 5, 6, 7, 8! (56 = 7 x 8). Menarik sekali, kan?',
    funChallenge: 'Lompati batu sungai dengan jawaban perkalian yang tepat!',
    rewardPreview: '+120 XP • Kartu Bumi'
  },
  'disc-la-2': {
    id: 'disc-la-2',
    title: 'Dunia Pecahan & Potongan Pizza',
    regionName: 'Lembah Angka',
    category: 'Pecahan',
    gameId: 'mini-pl',
    conceptEmoji: '🍕',
    factTitle: 'Konsep Pecahan',
    factContent: 'Pecahan adalah bagian dari satu kesatuan utuh. Jika sebuah pizza dipotong menjadi 4 bagian sama besar, maka 1 potong bernilai 1/4 (satu perempat)!',
    funChallenge: 'Berapa potong yang kamu perlukan untuk membuat setengah pizza?',
    rewardPreview: '+140 XP • Koki Cilik'
  },
  'disc-la-3': {
    id: 'disc-la-3',
    title: 'Keajaiban Penjumlahan Segitiga',
    regionName: 'Lembah Angka',
    category: 'Matematika & Geometri',
    gameId: 'mini-mt',
    conceptEmoji: '📐',
    factTitle: 'Tahukah Kamu?',
    factContent: 'Bentuk segitiga adalah salah satu bentuk terkuat di alam semesta. Jembatan rel kereta dan atap rumah selalu memakai struktur segitiga agar kokoh!',
    funChallenge: 'Coba bayangkan 3 sisi segitiga saling menopang satu sama lain.',
    rewardPreview: '+160 XP • 1 Kartu Pengetahuan'
  },
  'disc-la-boss': {
    id: 'disc-la-boss',
    title: 'Misteri Variabel & Gerbang Aljabar',
    regionName: 'Lembah Angka',
    category: 'Aljabar & Logika Persamaan',
    gameId: 'mini-ag',
    conceptEmoji: '🔮',
    factTitle: 'Seni Timbangan Aljabar',
    factContent: 'Aljabar itu seperti timbangan ajaib kuno. Apapun yang kamu kurangkan atau tambahkan di sisi kiri gerbang, harus dilakukan sama persis di sisi kanan agar gerbang tetap seimbang!',
    funChallenge: 'Jika [Kotak Rahasia x + 15 energi] seimbang dengan 40 energi, berapa energi di dalam Kotak Rahasia x?',
    rewardPreview: '+300 XP • Mahkota Kristal Angka'
  },
  'disc-hs-1': {
    id: 'disc-hs-1',
    title: 'Misteri Fotosintesis & Klorofil',
    regionName: 'Hutan Sains',
    category: 'Biologi Tumbuhan',
    gameId: 'mini-ps',
    conceptEmoji: '🌿',
    factTitle: 'Dapur Alami Daun',
    factContent: 'Tumbuhan memasak makanannya sendiri menggunakan bantuan cahaya Matahari, air, dan zat hijau daun yang disebut klorofil!',
    funChallenge: 'Bayangkan daun sebagai panel surya kecil ciptaan alam.',
    rewardPreview: '+140 XP • Kartu Fotosintesis'
  },
  'disc-hs-2': {
    id: 'disc-hs-2',
    title: 'Metamorfosis Sempurna Kupu-Kupu',
    regionName: 'Hutan Sains',
    category: 'Siklus Hidup Serangga',
    gameId: 'mini-bm',
    conceptEmoji: '🦋',
    factTitle: 'Transformasi Luar Biasa',
    factContent: 'Kupu-kupu mengalami metamorfosis sempurna 4 tahap: Telur (Ovum), Ulat (Larva), Kepompong (Pupa), hingga Kupu-kupu dewasa (Imago) yang terbang membantu penyerbukan bunga!',
    funChallenge: 'Urutkan tahapan metamorfosis dan rawat ulat hingga sayapnya mekar sempurna!',
    rewardPreview: '+140 XP • Kartu Kupu-Kupu Rimba'
  },
  'disc-hs-3': {
    id: 'disc-hs-3',
    title: 'Keajaiban Flora Langka Nusantara',
    regionName: 'Hutan Sains',
    category: 'Adaptasi Tumbuhan Langka',
    gameId: 'mini-rf',
    conceptEmoji: '🌺',
    factTitle: 'Karnivora & Holoparasit Terbesar',
    factContent: 'Kantong Semar menjebak serangga di kolam enzim asam untuk memperoleh Nitrogen di tanah miskin hara. Sedangkan Padma Raksasa (Rafflesia arnoldii) tidak memiliki daun, batang, atau akar, dan memikat lalat penyerbuk menggunakan aroma khas bangkai!',
    funChallenge: 'Pancing serangga ke kantong semar dan mekarkan bunga raksasa Rafflesia!',
    rewardPreview: '+160 XP • Kartu Padma & Kantong Semar'
  },
  'disc-nc-1': {
    id: 'disc-nc-1',
    title: 'Kisah Dongeng Timun Mas',
    regionName: 'Negeri Cerita',
    category: 'Literasi & Struktur Cerita',
    gameId: 'mini-sb',
    conceptEmoji: '📜',
    factTitle: 'Kearifan Lokal Nusantara',
    factContent: 'Dongeng Timun Mas mengajarkan bahwa keberanian, kebaikan budi, dan akal cerdik akan selalu mengalahkan kekuatan kasar!',
    funChallenge: 'Susun kata menjadi kalimat yang mengisahkan keberanian Timun Mas.',
    rewardPreview: '+150 XP • Kartu Kepulauan'
  },
  'disc-nc-2': {
    id: 'disc-nc-2',
    title: 'Formula Rahasia SPOK Bahasa',
    regionName: 'Negeri Cerita',
    category: 'Tata Bahasa & Sintaksis',
    gameId: 'mini-sb',
    conceptEmoji: '✍️',
    factTitle: 'Pilar Kalimat Bahasa Indonesia',
    factContent: 'Kalimat yang baik tersusun dari Subjek (S - Siapa), Predikat (P - Melakukan apa), Objek (O - Sasaran tindakan), dan Keterangan (K - Di mana atau kapan). Dengan formula ini, ceritamu menjadi jelas dan memikat pembaca!',
    funChallenge: 'Identifikasi peran kata dan susun 3 kisah Nusantara yang hebat!',
    rewardPreview: '+160 XP • Kitab Sastra & Pena Emas'
  },
  'disc-nc-3': {
    id: 'disc-nc-3',
    title: 'Rahasia Bait & Rima Pantun Nusantara',
    regionName: 'Negeri Cerita',
    category: 'Sastra & Bahasa Indonesia',
    gameId: 'mini-pp',
    conceptEmoji: '🪶',
    factTitle: 'Seni Pantun Warisan Budaya Dunia',
    factContent: 'Pantun adalah karya sastra asli kepulauan Nusantara yang diakui UNESCO sebagai Warisan Budaya Takbenda Dunia! Pantun terdiri dari 4 baris: baris 1 dan 2 adalah "Sampiran" (pembuka berima), sedangkan baris 3 dan 4 adalah "Isi" (pesan moral/nasihat). Pola rima akhirnya selalu bersajak silang a-b-a-b.',
    funChallenge: 'Lengkapi sampiran dan isi pantun berima serasi, pecahkan teka-teki jenaka, dan jadilah Pujangga Agung!',
    rewardPreview: '+180 XP • Pena Kencana & Kartu Pantun'
  },
  'disc-gt-1': {
    id: 'disc-gt-1',
    title: 'Algoritma & Pemrograman Robot',
    regionName: 'Gunung Teka-Teki',
    category: 'Pemikiran Komputasional',
    gameId: 'mini-rr',
    conceptEmoji: '🤖',
    factTitle: 'Bahasa Komputer',
    factContent: 'Robot tidak bisa menebak pikiran manusia. Robot hanya bisa menjalankan instruksi langkah-demi-langkah yang runut dan jelas!',
    funChallenge: 'Rancang deretan instruksi terbaik untuk memandu Bot Budi ke baterai kristal.',
    rewardPreview: '+160 XP • Kartu Gunung Berapi'
  },
  'disc-gt-2': {
    id: 'disc-gt-2',
    title: 'Mekanika Roda Gigi Benteng',
    regionName: 'Gunung Teka-Teki',
    category: 'Pemikiran Komputasional & Fisika',
    gameId: 'mini-gp',
    conceptEmoji: '⚙️',
    factTitle: 'Arah Rotasi Roda Gigi',
    factContent: 'Ketika dua roda gigi bertaut dan bersentuhan, arah putarannya SELALU berlawanan! Jika roda pertama berputar searah jarum jam (kanan), roda kedua pasti berputar berlawanan jarum jam (kiri).',
    funChallenge: 'Analisis arah putaran dari roda penggerak hingga roda sasaran benteng lava!',
    rewardPreview: '+180 XP • Kunci Pas Mekanik'
  },
  'disc-gt-3': {
    id: 'disc-gt-3',
    title: 'Misteri Gerbang Logika Digital',
    regionName: 'Gunung Teka-Teki',
    category: 'Pemikiran Komputasional',
    gameId: 'mini-lg',
    conceptEmoji: '⚡',
    factTitle: 'Otak di Balik Robot & Komputer',
    factContent: 'Semua komputer dan robot di dunia bekerja menggunakan gerbang logika dasar: AND (semua harus Benar), OR (salah satu Benar sudah cukup), dan NOT (membalik Benar jadi Salah, Salah jadi Benar)!',
    funChallenge: 'Aktifkan kombinasi saklar yang tepat agar arus listrik mengalir membuka pintu ruang harta!',
    rewardPreview: '+200 XP • Kunci Kristal & Kartu Logika'
  },
  'disc-ap-1': {
    id: 'disc-ap-1',
    title: 'Pusat Tata Surya & Gravitasi Orbit',
    regionName: 'Angkasa Pengetahuan',
    category: 'Astronomi Kosmik',
    gameId: 'mini-ss',
    conceptEmoji: '🪐',
    factTitle: 'Keluarga Matahari',
    factContent: 'Matahari memiliki gaya gravitasi raksasa yang menahan 8 planet tetap berputar teratur di lintasan orbitnya masing-masing!',
    funChallenge: 'Susun urutan 4 planet terdekat dari Matahari: Merkurius, Venus, Bumi, dan Mars.',
    rewardPreview: '+160 XP • Kartu Matahari'
  }
};

export default function DiscoveryView() {
  const { discoveryId } = useParams();
  const disc = DISCOVERY_DATA[discoveryId] || DISCOVERY_DATA['disc-la-3'];
  const [isRevealed, setIsRevealed] = useState(false);

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
        {/* Top Breadcrumb */}
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
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: 'var(--color-primary)', textTransform: 'uppercase' }}>
              Penemuan Konsep • {disc.regionName}
            </span>
            <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-muted)' }}>
              {disc.category}
            </span>
          </div>
        </div>

        {/* Big Illustrated Discovery Card */}
        <div style={{
          backgroundColor: 'var(--color-surface-bright)',
          borderRadius: 'var(--radius-lg)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-card)',
          border: '2px solid var(--color-outline-subtle)',
          display: 'flex',
          flexDirection: 'column'
        }}>
          {/* Card Hero Header */}
          <div style={{
            backgroundColor: 'var(--color-primary-fixed)',
            padding: 'var(--space-lg) var(--space-md)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
            position: 'relative'
          }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              backgroundColor: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '36px',
              boxShadow: '0 8px 16px rgba(0, 97, 148, 0.2)',
              marginBottom: 'var(--space-xs)'
            }}>
              {disc.conceptEmoji}
            </div>
            <h1 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--color-on-primary-fixed)', margin: 0 }}>
              {disc.title}
            </h1>
          </div>

          {/* Card Body & Interactive Reveal */}
          <div style={{ padding: 'var(--space-md)', display: 'flex', flexDirection: 'column', gap: 'var(--space-sm)' }}>
            <div style={{
              backgroundColor: 'var(--color-surface-container-low)',
              padding: 'var(--space-sm)',
              borderRadius: 'var(--radius-md)',
              borderLeft: '4px solid var(--color-secondary)'
            }}>
              <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>lightbulb</span>
                {disc.factTitle}
              </span>
              <p style={{ fontSize: '14px', lineHeight: 1.5, color: 'var(--color-text-main)', margin: '6px 0 0' }}>
                {disc.factContent}
              </p>
            </div>

            {/* Secret tip toggle */}
            <button
              onClick={() => setIsRevealed(!isRevealed)}
              style={{
                backgroundColor: 'var(--color-surface-container-high)',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                padding: '10px 14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                fontWeight: 800,
                fontSize: '13px',
                color: 'var(--color-text-main)'
              }}
            >
              <span>{isRevealed ? 'Sembunyikan Rahasia' : '✨ Buka Petunjuk Rahasia'}</span>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                {isRevealed ? 'expand_less' : 'expand_more'}
              </span>
            </button>

            {isRevealed && (
              <div
                className="animate-pop-in"
                style={{
                  backgroundColor: 'var(--color-tertiary-fixed)',
                  color: 'var(--color-on-tertiary-fixed)',
                  padding: 'var(--space-sm)',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '13px',
                  lineHeight: 1.4
                }}
              >
                <strong>Misi Petualang: </strong>
                {disc.funChallenge}
              </div>
            )}
          </div>

          {/* Reward badge */}
          <div style={{
            backgroundColor: 'var(--color-surface-container-high)',
            padding: '10px var(--space-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--color-text-muted)' }}>
              Hadiah Misi:
            </span>
            <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--color-primary)' }}>
              {disc.rewardPreview}
            </span>
          </div>
        </div>

        {/* Action Button: Play Mini Game */}
        <Link
          to={`/game/${disc.gameId}`}
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
          <span>Mulai Tantangan Mini Game!</span>
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>sports_esports</span>
        </Link>
      </main>

      <BottomNavDock />
    </div>
  );
}
