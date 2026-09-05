/**
 * Item Catalog & Customization System
 * 6 Categories: Outfits, Accessories, Backpacks, Pets, Knowledge Cards, Badges
 * Includes 8-point customization mapping:
 * avatar, hairstyle, hair color, skin tone, outfit, shoes, backpack, accessories
 */

export const CATALOG_ITEMS = [
  // Accessories / Topi & Rambut
  {
    id: 'hat-safari',
    name: 'Topi Safari Klasik',
    category: 'accessories',
    slot: 'accessories',
    tierText: 'Tingkat Penjelajah Pemula',
    description: 'Topi anyaman kokoh pelindung sinar mentari saat bertualang.',
    icon: 'military_tech',
    previewImage: '/images/raka-safari.png',
    imageUrl: 'https://lh3.googleusercontent.com/aida/AEtjO1UJjtnp9undyvN5nf79dY4Pbpj2kUwBjGuPXleQ1sciFG3r0E16kz37drh9I6Vokoy0byTOZae6Zqzn0D77arJ-G2zeEIevBe0NjUXBm4HE_Lr0FgPljeJBxq00eR7z8b8upLtWEOb-SghPTrxDREzTt5MGBxpaLykxjfvosiOfcGNbxlmSCyLEt5v1hG6YXz8OFiRP3mXYw2eLTI4zHhl470Me9jou214-d6jINdq3q2_KorbTPWK5Km0',
    unlockLevel: 1,
    defaultUnlocked: true,
    bonus: '+5% XP Eksplorasi'
  },
  {
    id: 'hat-astronaut',
    name: 'Helm Astronot Cilik',
    category: 'accessories',
    slot: 'accessories',
    tierText: 'Tingkat 10 Antariksa',
    description: 'Kaca helm berkilau anti-gravitasi untuk menjelajahi bintang.',
    icon: 'rocket_launch',
    previewImage: '/images/raka-astronaut.png',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=200&auto=format&fit=crop&q=80',
    unlockLevel: 10,
    defaultUnlocked: true,
    bonus: '+10% XP Astronomi'
  },
  {
    id: 'hat-detective',
    name: 'Baret Detektif Cilik',
    category: 'accessories',
    slot: 'accessories',
    tierText: 'Tingkat 5 Logika',
    description: 'Baret wol cokelat elegan bagi pemecah teka-teki misteri.',
    icon: 'psychology',
    previewImage: '/images/raka-detective.png',
    imageUrl: 'https://images.unsplash.com/photo-1575424909138-46b05e5919ec?w=200&auto=format&fit=crop&q=80',
    unlockLevel: 5,
    defaultUnlocked: true,
    bonus: '+10% Koin Bonus'
  },
  {
    id: 'hat-forest-crown',
    name: 'Mahkota Daun Sains',
    category: 'accessories',
    slot: 'accessories',
    tierText: 'Hadiah Wilayah 2',
    description: 'Mahkota anyaman daun bercahaya magis dari Hutan Sains.',
    icon: 'spa',
    previewImage: '/images/raka-nature.png',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=200&auto=format&fit=crop&q=80',
    unlockLevel: 8,
    defaultUnlocked: false,
    bonus: '+15% XP Sains'
  },

  // Outfits / Kostum
  {
    id: 'outfit-scout',
    name: 'Seragam Pramuka Penjelajah',
    category: 'outfits',
    slot: 'outfit',
    tierText: 'Kostum Awal',
    description: 'Kemeja cokelat petualang lengkap dengan syal dan saku kompas.',
    icon: 'apparel',
    previewImage: '/images/raka-casual.png',
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=200&auto=format&fit=crop&q=80',
    unlockLevel: 1,
    defaultUnlocked: true,
    bonus: 'Kecepatan Jalan Cepat'
  },
  {
    id: 'outfit-scientist',
    name: 'Jas Laboratorium Cilik',
    category: 'outfits',
    slot: 'outfit',
    tierText: 'Tingkat 3 Hutan Sains',
    description: 'Jas putih berkilau anti-tumpahan cairan ramuan sains.',
    icon: 'science',
    previewImage: '/images/raka-nature.png',
    imageUrl: 'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=200&auto=format&fit=crop&q=80',
    unlockLevel: 3,
    defaultUnlocked: true,
    bonus: '+15% XP Sains'
  },
  {
    id: 'outfit-cyber',
    name: 'Baju Zirah Robotik',
    category: 'outfits',
    slot: 'outfit',
    tierText: 'Tingkat 12 Teknologi',
    description: 'Baju futuristik bertenaga energi surya dengan lampu LED neon.',
    icon: 'smart_toy',
    previewImage: '/images/raka-astronaut.png',
    imageUrl: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=200&auto=format&fit=crop&q=80',
    unlockLevel: 12,
    defaultUnlocked: false,
    bonus: '+20% Perlindungan Energi'
  },

  // Backpacks / Tas
  {
    id: 'bag-canvas',
    name: 'Ransel Kanvas Biru Raka',
    category: 'backpacks',
    slot: 'backpack',
    tierText: 'Perlengkapan Standar',
    description: 'Ransel serbaguna tempat menyimpan buku catatan dan krayon.',
    icon: 'backpack',
    imageUrl: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&auto=format&fit=crop&q=80',
    unlockLevel: 1,
    defaultUnlocked: true,
    bonus: '+5 Kapasitas Barang'
  },
  {
    id: 'bag-solar',
    name: 'Ransel Jetpack Bintang',
    category: 'backpacks',
    slot: 'backpack',
    tierText: 'Tingkat 15 Antariksa',
    description: 'Ransel berpendorong roket mini untuk melompat lebih tinggi!',
    icon: 'rocket',
    imageUrl: 'https://images.unsplash.com/photo-1577733966973-d680bffd2e80?w=200&auto=format&fit=crop&q=80',
    unlockLevel: 15,
    defaultUnlocked: false,
    bonus: '+10% XP Semua Bidang'
  },

  // Shoes / Sepatu
  {
    id: 'shoes-sneakers',
    name: 'Sepatu Kets Ringan',
    category: 'outfits',
    slot: 'shoes',
    tierText: 'Sepatu Petualang',
    description: 'Sol karet empuk untuk berlari melintasi jembatan sungai.',
    icon: 'roller_skating',
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&auto=format&fit=crop&q=80',
    unlockLevel: 1,
    defaultUnlocked: true,
    bonus: 'Lompatan Gesit'
  },
  {
    id: 'shoes-boots',
    name: 'Sepatu Bot Penjelajah',
    category: 'outfits',
    slot: 'shoes',
    tierText: 'Tingkat 6 Rimba',
    description: 'Tahan air dan lumpur saat menyusuri Hutan Sains.',
    icon: 'hiking',
    imageUrl: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=200&auto=format&fit=crop&q=80',
    unlockLevel: 6,
    defaultUnlocked: false,
    bonus: 'Anti Selip Lumpur'
  }
];

export const COLOR_SWATCHES = [
  { id: 'sky', name: 'Biru Langit', hex: '#006194', textHex: '#ffffff' },
  { id: 'yellow', name: 'Kuning Mentari', hex: '#ffb690', textHex: '#341100' },
  { id: 'green', name: 'Hijau Hutan', hex: '#006c49', textHex: '#ffffff' },
  { id: 'coral', name: 'Merah Karang', hex: '#c05400', textHex: '#ffffff' },
  { id: 'purple', name: 'Ungu Kerajaan', hex: '#272f4a', textHex: '#eff0ff' }
];

export const HAIR_STYLES = [
  { id: 'short', name: 'Pendek Rapi', icon: 'face' },
  { id: 'curly', name: 'Ikal Mengembang', icon: 'face_3' },
  { id: 'ponytail', name: 'Kuncir Kuda', icon: 'face_4' },
  { id: 'spiky', name: 'Keren Berdiri', icon: 'face_5' }
];

export const SKIN_TONES = [
  { id: 'fair', name: 'Cerah', hex: '#ffd8be' },
  { id: 'natural', name: 'Langsat', hex: '#f0be92' },
  { id: 'warm', name: 'Sawo Matang', hex: '#c88c5a' },
  { id: 'deep', name: 'Eksotis', hex: '#7a4f2b' }
];

export const HAIR_COLORS = [
  { id: 'black', name: 'Hitam Alami', hex: '#1a1a1a' },
  { id: 'dark-brown', name: 'Cokelat Gelap', hex: '#4a2c11' },
  { id: 'chestnut', name: 'Cokelat Terang', hex: '#8c481f' },
  { id: 'golden', name: 'Pirang Emas', hex: '#cca43b' }
];
