export const AVAILABLE_CHARACTERS = [
  // 5 Karakter Cowok (Raka)
  {
    id: 'raka_explorer',
    name: 'Raka si Penjelajah',
    title: 'Penjelajah Rimba Klasik',
    shortTitle: 'Rimba',
    gender: 'boy',
    image: '/images/raka-safari.png',
    tagline: 'Pemberani, tangkas, dan selalu memimpin penjelajahan pulau dengan penuh semangat petualangan!',
    themeColor: '#0284c7',
    badge: 'Karakter Utama',
    badgeIcon: 'stars'
  },
  {
    id: 'raka_astronaut',
    name: 'Raka si Penjelajah Bintang',
    title: 'Kosmonot Antariksa Cilik',
    shortTitle: 'Antariksa',
    gender: 'boy',
    image: '/images/raka-astronaut.png',
    tagline: 'Memiliki rasa ingin tahu tanpa batas menjelajahi rahasia galaksi, bintang, dan planet tata surya.',
    themeColor: '#7c3aed',
    badge: 'Ahli Antariksa',
    badgeIcon: 'rocket'
  },
  {
    id: 'raka_detective',
    name: 'Raka si Detektif Logika',
    title: 'Pemecah Misteri & Teka-Teki',
    shortTitle: 'Detektif',
    gender: 'boy',
    image: '/images/raka-detective.png',
    tagline: 'Berbekal kaca pembesar dan logika analitis untuk mengungkap setiap teka-teki rahasia.',
    themeColor: '#d97706',
    badge: 'Master Logika',
    badgeIcon: 'lightbulb'
  },
  {
    id: 'raka_nature',
    name: 'Raka si Sahabat Hutan',
    title: 'Peneliti Sains & Botani',
    shortTitle: 'Sains Hutan',
    gender: 'boy',
    image: '/images/raka-nature.png',
    tagline: 'Penyayang fauna dan flora yang mampu meracik ramuan sains ajaib dari tanaman Hutan Sains.',
    themeColor: '#059669',
    badge: 'Sahabat Alam',
    badgeIcon: 'spa'
  },
  {
    id: 'raka_casual',
    name: 'Raka si Pandu Ceria',
    title: 'Pramuka Muda Serbaguna',
    shortTitle: 'Pandu Ceria',
    gender: 'boy',
    image: '/images/raka-casual.png',
    tagline: 'Penuh canda tawa dan energi positif, selalu siap membantu teman menyelesaikan tantangan harian!',
    themeColor: '#2563eb',
    badge: 'Pandu Ceria',
    badgeIcon: 'sentiment_very_satisfied'
  },

  // 5 Karakter Cewek (Tara)
  {
    id: 'tara_adventurer',
    name: 'Tara si Petualang Cilik',
    title: 'Ahli Pemeta Pulau & Kompas',
    shortTitle: 'Pemeta',
    gender: 'girl',
    image: '/images/tara-avatar.png',
    tagline: 'Cerdas, teliti, dan memiliki insting tajam dalam membaca kompas serta peta misteri kepulauan.',
    themeColor: '#e11d48',
    badge: 'Favorit Petualang',
    badgeIcon: 'favorite'
  },
  {
    id: 'tara_astronaut',
    name: 'Tara si Penjelajah Bintang',
    title: 'Kosmonot Cilik Galaksi',
    shortTitle: 'Antariksa',
    gender: 'girl',
    image: '/images/tara-astronaut.png',
    tagline: 'Pemberani menerobos batas angkasa luar, memetakan rasi bintang dan menyingkap rahasia kosmos.',
    themeColor: '#8b5cf6',
    badge: 'Pionir Kosmik',
    badgeIcon: 'rocket_launch'
  },
  {
    id: 'tara_detective',
    name: 'Tara si Detektif Cilik',
    title: 'Penyelidik Jejak Misteri',
    shortTitle: 'Detektif',
    gender: 'girl',
    image: '/images/tara-detective.png',
    tagline: 'Pemerhati ulung yang mampu menemukan petunjuk tersembunyi berbekal ketajaman deduksi.',
    themeColor: '#b45309',
    badge: 'Detektif Ulung',
    badgeIcon: 'search'
  },
  {
    id: 'tara_nature',
    name: 'Tara si Peneliti Sains',
    title: 'Ahli Botani & Ekosistem Ajaib',
    shortTitle: 'Sains Alam',
    gender: 'girl',
    image: '/images/tara-nature.png',
    tagline: 'Sahabat sejati flora dan fauna hutan yang mahir meneliti keanekaragaman hayati nusantara.',
    themeColor: '#10b981',
    badge: 'Ahli Botani',
    badgeIcon: 'psychology_alt'
  },
  {
    id: 'tara_casual',
    name: 'Tara si Siswi Teladan',
    title: 'Pandu Pintar & Kreatif',
    shortTitle: 'Siswi Teladan',
    gender: 'girl',
    image: '/images/tara-casual.png',
    tagline: 'Selalu bersemangat belajar hal baru, berjiwa kepemimpinan, dan penuh inspirasi untuk sahabatnya!',
    themeColor: '#ec4899',
    badge: 'Bintang Ceria',
    badgeIcon: 'grade'
  }
];

export function getCharacterById(id) {
  return AVAILABLE_CHARACTERS.find((c) => c.id === id) || AVAILABLE_CHARACTERS[0];
}
