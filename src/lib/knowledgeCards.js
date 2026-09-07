/**
 * Knowledge Card System
 * 6 initial cards with child-friendly facts (ages 7-12)
 * Obtained through Discovery and Quest completion.
 */

export const INITIAL_KNOWLEDGE_CARDS = [
  {
    id: 'card-earth',
    title: 'Bumi Kita',
    category: 'Astronomi',
    rarity: 'Langka', // Biasa | Langka | Epik | Legendaris
    illustration: '🌍',
    imageUrl: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?w=400&auto=format&fit=crop&q=80',
    facts: [
      'Bumi adalah satu-satunya planet yang diketahui memiliki air cair dan kehidupan.',
      'Bumi membutuhkan 365 hari untuk mengitari Matahari satu putaran penuh.',
      'Lebih dari 70% permukaan Bumi diselimuti oleh samudera biru yang luas!'
    ],
    discoveryOrigin: 'Tata Surya & Orbit Planet'
  },
  {
    id: 'card-sun',
    title: 'Matahari Bersinar',
    category: 'Astronomi',
    rarity: 'Epik',
    illustration: '☀️',
    imageUrl: 'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?w=400&auto=format&fit=crop&q=80',
    facts: [
      'Matahari adalah bintang raksasa di pusat tata surya kita.',
      'Cahaya dari Matahari hanya butuh sekitar 8 menit untuk sampai ke Bumi!',
      'Matahari begitu besar sehingga 1,3 juta Bumi bisa muat di dalamnya.'
    ],
    discoveryOrigin: 'Pusat Tata Surya'
  },
  {
    id: 'card-moon',
    title: 'Bulan Purnama',
    category: 'Astronomi',
    rarity: 'Biasa',
    illustration: '🌕',
    imageUrl: 'https://images.unsplash.com/photo-1522030299830-16b8d3d049fe?w=400&auto=format&fit=crop&q=80',
    facts: [
      'Bulan adalah satelit alami Bumi yang setia menemani di malam hari.',
      'Gravitasi Bulan menyebabkan terjadinya pasang surut air laut di pantai.',
      'Bulan tidak memancarkan cahaya sendiri, melainkan memantulkan sinar Matahari.'
    ],
    discoveryOrigin: 'Fase Bulan Malam Hari'
  },
  {
    id: 'card-volcano',
    title: 'Gunung Berapi',
    category: 'Geologi',
    rarity: 'Langka',
    illustration: '🌋',
    imageUrl: 'https://images.unsplash.com/photo-1541845157-a6d2d100c931?w=400&auto=format&fit=crop&q=80',
    facts: [
      'Gunung berapi adalah celah di kerak bumi tempat magma panas keluar ke permukaan.',
      'Lahar dingin yang membeku selama ribuan tahun membuat tanah pertanian sangat subur.',
      'Indonesia berada di Cincin Api Pasifik dan memiliki banyak gunung berapi megah!'
    ],
    discoveryOrigin: 'Magma & Struktur Bumi'
  },
  {
    id: 'card-blue-whale',
    title: 'Paus Biru Raksasa',
    category: 'Biologi Laut',
    rarity: 'Legendaris',
    illustration: '🐋',
    imageUrl: 'https://images.unsplash.com/photo-1568430462989-44163eb1752f?w=400&auto=format&fit=crop&q=80',
    facts: [
      'Paus biru adalah hewan terbesar yang pernah hidup di Bumi, lebih besar dari dinosaurus!',
      'Jantung paus biru besarnya bisa seukuran mobil kecil.',
      'Meski bertubuh raksasa, makanan utama mereka adalah krill kecil seperti udang mini.'
    ],
    discoveryOrigin: 'Kehidupan Samudera Dalam'
  },
  {
    id: 'card-rainforest',
    title: 'Hutan Hujan Tropis',
    category: 'Ekologi',
    rarity: 'Langka',
    illustration: '🌴',
    imageUrl: 'https://images.unsplash.com/photo-1511497584788-87676104235f?w=400&auto=format&fit=crop&q=80',
    facts: [
      'Hutan hujan sering disebut paru-paru dunia karena menghasilkan banyak oksigen segar.',
      'Hutan hujan Nusantara menjadi rumah bagi orangutan, harimau, dan bunga Rafflesia raksasa.',
      'Kanopi pepohonan yang lebat membuat dasar hutan teduh dan lembap.'
    ],
    discoveryOrigin: 'Ekosistem Hutan Sains'
  },
  {
    id: 'card-algebra',
    title: 'Aljabar Kosmik',
    category: 'Matematika & Logika',
    rarity: 'Legendaris',
    illustration: '🔮',
    imageUrl: 'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=400&auto=format&fit=crop&q=80',
    facts: [
      'Aljabar ditemukan oleh ilmuwan besar Al-Khawarizmi sebagai seni menyeimbangkan timbangan angka.',
      'Huruf dalam aljabar seperti x dan y disebut variabel, yaitu kotak misterius penyimpan angka rahasia.',
      'Dengan aljabar, kita bisa memecahkan rumus bintang, gravitasi roket, hingga kode game favoritmu!'
    ],
    discoveryOrigin: 'Gerbang Aljabar Kristal'
  },
  {
    id: 'card-triangle',
    title: 'Segitiga Ajaib',
    category: 'Geometri',
    rarity: 'Langka',
    illustration: '📐',
    imageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=400&auto=format&fit=crop&q=80',
    facts: [
      'Jumlah ketiga sudut dalam segitiga jenis apa pun di bidang datar selalu tepat 180 derajat.',
      'Segitiga adalah bangun datar paling kaku dan kuat, sehingga selalu dipakai untuk rangka jembatan dan atap.',
      'Segitiga siku-siku memiliki rumus Pythagoras yang terkenal menghubungkan ketiga sisinya.'
    ],
    discoveryOrigin: 'Penjumlahan Segitiga Ajaib'
  },
  {
    id: 'card-butterfly',
    title: 'Kupu-Kupu Rimba Zamrud',
    category: 'Biologi Serangga',
    rarity: 'Langka',
    illustration: '🦋',
    imageUrl: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62?w=400&auto=format&fit=crop&q=80',
    facts: [
      'Kupu-kupu mengalami metamorfosis sempurna 4 tahap: Telur, Larva (Ulat), Pupa (Kepompong), dan Imago (Dewasa).',
      'Sayap kupu-kupu tersusun dari ribuan sisik mikroskopis tipis yang membiaskan cahaya menghasilkan warna-warni memukau!',
      'Kupu-kupu mengecap rasa nektar manis menggunakan sensor perasa halus yang terletak di ujung kakinya.'
    ],
    discoveryOrigin: 'Metamorfosis Kupu-Kupu'
  },
  {
    id: 'card-rare-flora',
    title: 'Padma Raksasa & Kantong Semar Rimba',
    category: 'Flora Langka Endemik',
    rarity: 'Legendaris',
    illustration: '🌺',
    imageUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?w=400&auto=format&fit=crop&q=80',
    facts: [
      'Kantong Semar (Nepenthes) adalah tumbuhan karnivora yang menjebak serangga di kolam enzim asam untuk mendapatkan zat Nitrogen di tanah miskin hara.',
      'Tutup kantong semar (operculum) berfungsi seperti payung alami untuk mencegah air hujan mengencerkan enzim pencernanya.',
      'Padma Raksasa (Rafflesia arnoldii) adalah bunga tunggal terbesar di dunia dan holoparasit tanpa daun, batang, atau akar sejati yang memikat lalat penyerbuk dengan aroma khas bangkai!'
    ],
    discoveryOrigin: 'Penjelajah Flora Langka'
  },
  {
    id: 'card-sastra',
    title: 'Mahakarya Sastra & SPOK Nusantara',
    category: 'Tata Bahasa & Sastra',
    rarity: 'Legendaris',
    illustration: '📜',
    imageUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=400&auto=format&fit=crop&q=80',
    facts: [
      'Struktur kalimat dasar bahasa Indonesia terdiri dari Subjek (pelaku), Predikat (tindakan), Objek (sasaran), dan Keterangan (tempat/waktu/cara).',
      'Cerita rakyat nusantara seperti Kisah Si Kancil mengajarkan kecerdikan akal budi dan kebaikan moral melintasi generasi.',
      'Susunan kalimat yang runtut memancarkan kejelasan pesan dan keindahan rasa dalam bertutur kata.'
    ],
    discoveryOrigin: 'Susunan Kalimat Bahasa (Misi 02)'
  },
  {
    id: 'card-pantun',
    title: 'Bait Pantun & Puisi Rakyat Nusantara',
    category: 'Sastra & Bahasa Indonesia',
    rarity: 'Mitos',
    illustration: '🪶',
    imageUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&auto=format&fit=crop&q=80',
    facts: [
      'Pantun merupakan karya sastra puisi lama kepulauan Nusantara yang resmi diakui UNESCO sebagai Warisan Budaya Takbenda Dunia.',
      'Satu bait pantun terdiri dari 4 baris: baris 1-2 adalah sampiran (pengantar rima) dan baris 3-4 adalah isi (pesan/nasihat).',
      'Pola sajak pantun adalah rima bersilang a-b-a-b dengan 8 hingga 12 suku kata di setiap barisnya.'
    ],
    discoveryOrigin: 'Pujangga Pantun Nusantara (Misi 03)'
  },
  {
    id: 'card-space-station',
    title: 'Stasiun Antariksa Orbital',
    category: 'Astronomi & Antariksa',
    rarity: 'Legendaris',
    illustration: '🛰️',
    imageUrl: '/images/items/space_station_3d.jpg',
    facts: [
      'Stasiun Antariksa mengorbit Bumi dengan kecepatan luar biasa 27.600 km/jam, mengitari Bumi setiap 90 menit!',
      'Para astronot di stasiun antariksa mengalami 16 kali matahari terbit dan 16 kali matahari terbenam setiap hari.',
      'Modul laboratorium antariksa memungkinkan ilmuwan meneliti mikrogravitasi, pertumbuhan tanaman kosmik, dan biologi antariksa.'
    ],
    discoveryOrigin: 'Peluncuran Stasiun Antariksa (Misi 03)'
  }
];

export function getCardById(cardId) {
  return INITIAL_KNOWLEDGE_CARDS.find((c) => c.id === cardId) || null;
}
