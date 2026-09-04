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
  }
];

export function getCardById(cardId) {
  return INITIAL_KNOWLEDGE_CARDS.find((c) => c.id === cardId) || null;
}
