// src/data/seedData.js - Master Seed Dataset for EduQuest MVP
// Bahasa Indonesia • 100% Relational Integrity

export const REGIONS = [
  {
    id: 'lembah-angka',
    name: 'Lembah Angka',
    subject: 'Matematika',
    description: 'Jelajahi jembatan perkalian, teka-teki pecahan, dan geometri ajaib.',
    requiredLevel: 1,
    orderIndex: 1,
    isActive: true,
    icon: 'calculate',
    illustrationUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80',
    colorTheme: 'blue'
  },
  {
    id: 'hutan-sains',
    name: 'Hutan Sains',
    subject: 'Sains',
    description: 'Temukan misteri fotosintesis, rantai makanan, dan keanekaragaman hayati.',
    requiredLevel: 3,
    orderIndex: 2,
    isActive: true,
    icon: 'forest',
    illustrationUrl: 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80',
    colorTheme: 'emerald'
  },
  {
    id: 'negeri-cerita',
    name: 'Negeri Cerita',
    subject: 'Bahasa',
    description: 'Rangkai kalimat indah, temukan dongeng nusantara, dan perkaya kosakata.',
    requiredLevel: 6,
    orderIndex: 3,
    isActive: true,
    icon: 'auto_stories',
    illustrationUrl: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&w=600&q=80',
    colorTheme: 'amber'
  },
  {
    id: 'gunung-teka-teki',
    name: 'Gunung Teka-Teki',
    subject: 'Logika',
    description: 'Benteng pemikiran komputasional, roda gigi logika, dan algoritma cerdas.',
    requiredLevel: 14,
    orderIndex: 4,
    isActive: true,
    icon: 'extension',
    illustrationUrl: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80',
    colorTheme: 'purple'
  },
  {
    id: 'angkasa-pengetahuan',
    name: 'Angkasa Pengetahuan',
    subject: 'Umum',
    description: 'Terbang menuju bintang, jelajahi tata surya, dan sains kosmik tanpa batas.',
    requiredLevel: 16,
    orderIndex: 5,
    isActive: true,
    icon: 'rocket_launch',
    illustrationUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
    colorTheme: 'indigo'
  }
];

export const GAMES = [
  {
    id: 'number-catcher',
    title: 'Penangkap Angka',
    subject: 'Matematika',
    difficulty: 1,
    instructions: 'Bantu Raka melompati batu apung dengan memilih hasil operasi hitung yang tepat!',
    maxScore: 100
  },
  {
    id: 'pizza-lab',
    title: 'Laboratorium Pecahan',
    subject: 'Matematika',
    difficulty: 2,
    instructions: 'Bagi pizza menjadi potongan sama besar dan pilih bagian yang sesuai dengan target pecahan!',
    maxScore: 100
  },
  {
    id: 'solar-system',
    title: 'Penyusun Tata Surya',
    subject: 'Sains',
    difficulty: 2,
    instructions: 'Susun planet-planet ke dalam orbit yang benar berdasarkan jaraknya dari Matahari!',
    maxScore: 100
  },
  {
    id: 'robot-rescue',
    title: 'Penyelamat Robot',
    subject: 'Logika',
    difficulty: 3,
    instructions: 'Rangkai kartu perintah arah (ATAS, KANAN, BAWAH, KIRI) untuk memandu robot melintasi labirin!',
    maxScore: 100
  },
  {
    id: 'story-builder',
    title: 'Penyusun Cerita',
    subject: 'Bahasa',
    difficulty: 1,
    instructions: 'Susun kepingan kata menjadi kalimat bahasa Indonesia yang padu dan bermakna!',
    maxScore: 100
  },
  {
    id: 'butterfly-metamorphosis',
    title: 'Metamorfosis Kupu-Kupu',
    subject: 'Sains',
    difficulty: 2,
    instructions: 'Urutkan tahapan metamorfosis, beri makan ulat, dan bentangkan sayap kupu-kupu indah!',
    maxScore: 100
  }
];

export const DISCOVERIES = [
  {
    id: 'discovery-perkalian',
    title: 'Rahasia Perkalian Cepat',
    concept: 'Perkalian adalah penjumlahan berulang dari bilangan yang sama.',
    funFact: '7 × 8 sama dengan (7 × 7) + 7 = 49 + 7 = 56!',
    cardUnlockId: 'card-fractions'
  },
  {
    id: 'discovery-pecahan',
    title: 'Keajaiban Potongan Pecahan',
    concept: 'Pecahan menunjukkan bagian dari sebuah kesatuan yang utuh.',
    funFact: 'Jika satu pizza dipotong 4 bagian dan kamu memakan 3 potong, kamu memakan 3/4 bagian!',
    cardUnlockId: 'card-fractions'
  },
  {
    id: 'discovery-geometri',
    title: 'Bentuk Bangun Datar',
    concept: 'Segitiga memiliki 3 sisi dan jumlah sudutnya selalu 180 derajat.',
    funFact: 'Piramida Mesir kuno dibangun menggunakan prinsip dasar geometri segitiga kokoh!',
    cardUnlockId: 'card-earth'
  },
  {
    id: 'discovery-fotosintesis',
    title: 'Dapur Daun Fotosintesis',
    concept: 'Tumbuhan memasak makanannya menggunakan cahaya matahari, air, dan karbon dioksida.',
    funFact: 'Hasil sampingan dari proses fotosintesis adalah oksigen segar yang kita hirup setiap detik!',
    cardUnlockId: 'card-photosynthesis'
  },
  {
    id: 'discovery-rantai-makanan',
    title: 'Rantai Kehidupan Rimba',
    concept: 'Energi berpindah dari produsen rumput ke herbivora, lalu ke karnivora pemangsa.',
    funFact: 'Cacing tanah dan jamur adalah pengurai hebat yang menyuburkan kembali tanah hutan!',
    cardUnlockId: 'card-rainforest'
  },
  {
    id: 'discovery-hutan-hujan',
    title: 'Paru-Paru Tropis Dunia',
    concept: 'Hutan hujan tropis memiliki kanopi daun lebat yang menjadi rumah jutaan satwa.',
    funFact: 'Indonesia memiliki hutan hujan tropis terluas ke-3 di seluruh dunia!',
    cardUnlockId: 'card-rainforest'
  },
  {
    id: 'discovery-sintaksis',
    title: 'Susunan Kalimat Bahasa',
    concept: 'Kalimat yang baik minimal memiliki Subjek (pelaku) dan Predikat (tindakan).',
    funFact: 'Bahasa Indonesia dituturkan oleh lebih dari 300 juta orang di seluruh dunia!',
    cardUnlockId: 'card-sastra'
  },
  {
    id: 'discovery-dongeng',
    title: 'Kisah Dongeng Nusantara',
    concept: 'Cerita rakyat mengandung nilai kejujuran, keberanian, dan tolong-menolong.',
    funFact: 'Kisah Timun Mas mengajarkan kita untuk selalu cerdik dan gigih saat menghadapi rintangan!',
    cardUnlockId: 'card-archipelago'
  },
  {
    id: 'discovery-pantun',
    title: 'Keindahan Bait & Rima Pantun',
    concept: 'Pantun menyampaikan nasihat budi pekerti melalui keselarasan sampiran, isi, dan rima a-b-a-b.',
    funFact: 'Pantun adalah warisan sastra asli kepulauan Nusantara yang resmi diakui dunia oleh UNESCO!',
    cardUnlockId: 'card-pantun'
  },
  {
    id: 'discovery-algoritma',
    title: 'Langkah Berpikir Komputasional',
    concept: 'Algoritma adalah deretan instruksi logis bertahap untuk menyelesaikan suatu masalah.',
    funFact: 'Resep membuat kue cokelat sebenarnya adalah bentuk sederhana dari sebuah algoritma!',
    cardUnlockId: 'card-volcano'
  },
  {
    id: 'discovery-roda-gigi',
    title: 'Mekanik Roda Gigi Cerdas',
    concept: 'Dua roda gigi yang bertaut akan berputar ke arah yang saling berlawanan.',
    funFact: 'Jam mekanik jarum tertua di dunia menggunakan lebih dari 100 roda gigi kecil yang berdetak!',
    cardUnlockId: 'card-volcano'
  },
  {
    id: 'discovery-logika',
    title: 'Gerbang Logika Benar & Salah',
    concept: 'Keputusan logika membantu komputer memilih jalan terbaik sesuai kondisi.',
    funFact: 'Komputer canggih menjalankan triliunan keputusan logika dalam waktu hanya satu detik!',
    cardUnlockId: 'card-volcano'
  },
  {
    id: 'discovery-tata-surya',
    title: 'Pusat Tata Surya',
    concept: 'Matahari adalah bintang induk yang dikelilingi oleh 8 planet karena tarikan gravitasi.',
    funFact: 'Planet Merkurius mengitari Matahari hanya dalam 88 hari Bumi!',
    cardUnlockId: 'card-sun'
  },
  {
    id: 'discovery-gravitasi',
    title: 'Daya Tarik Gravitasi',
    concept: 'Semua benda yang memiliki massa saling tarik-menarik satu sama lain di alam semesta.',
    funFact: 'Di Bulan, gaya gravitasi hanya 1/6 Bumi sehingga kamu bisa melompat 6 kali lebih tinggi!',
    cardUnlockId: 'card-gravity'
  },
  {
    id: 'discovery-bumi',
    title: 'Oasis Biru Alam Semesta',
    concept: 'Bumi memiliki atmosfer pelindung dan suhu yang sempurna untuk air dalam bentuk cair.',
    funFact: 'Planet Bumi adalah satu-satunya planet yang tidak dinamai dari dewa Romawi atau Yunani!',
    cardUnlockId: 'card-earth'
  },
  {
    id: 'discovery-metamorfosis',
    title: 'Metamorfosis Sempurna Kupu-Kupu',
    concept: 'Transformasi fisik lengkap dari telur, larva ulat pemakan daun, kepompong pupa istirahat, hingga imago dewasa bersayap elok.',
    funFact: 'Kupu-kupu mengecap nektar manis menggunakan kakinya dan sangat berjasa membantu penyerbukan bunga!',
    cardUnlockId: 'card-butterfly'
  }
];

export const QUESTS = [
  // Lembah Angka (3 Quests)
  {
    id: 'angka-01',
    regionId: 'lembah-angka',
    title: 'Jembatan Perkalian Kilat',
    storyIntro: 'Sungai Kristal meluap! Bantu Raka menginjak batu apung dengan hasil perkalian yang tepat.',
    discoveryId: 'discovery-perkalian',
    gameId: 'number-catcher',
    xpReward: 120,
    coinsReward: 40,
    orderIndex: 1
  },
  {
    id: 'angka-02',
    regionId: 'lembah-angka',
    title: 'Laboratorium Kue Pecahan',
    storyIntro: 'Koki Desa membutuhkan bantuan untuk membagi kue pesta secara adil dengan pecahan yang tepat.',
    discoveryId: 'discovery-pecahan',
    gameId: 'pizza-lab',
    xpReward: 150,
    coinsReward: 50,
    orderIndex: 2
  },
  {
    id: 'angka-03',
    regionId: 'lembah-angka',
    title: 'Benteng Geometri Kristal',
    storyIntro: 'Pintu gerbang istana angka terkunci dengan pola segitiga ajaib. Pecahkan kodenya!',
    discoveryId: 'discovery-geometri',
    gameId: 'number-catcher',
    xpReward: 180,
    coinsReward: 60,
    orderIndex: 3
  },

  // Hutan Sains (3 Quests)
  {
    id: 'sains-01',
    regionId: 'hutan-sains',
    title: 'Misteri Fotosintesis Daun',
    storyIntro: 'Pohon Purba Hutan kehilangan klorofilnya. Satukan tiga elemen penting agar berbuah kembali.',
    discoveryId: 'discovery-fotosintesis',
    gameId: 'photosynthesis-lab',
    xpReward: 140,
    coinsReward: 45,
    orderIndex: 1
  },
  {
    id: 'sains-02',
    regionId: 'hutan-sains',
    title: 'Metamorfosis Kupu-Kupu',
    storyIntro: 'Ungkap keajaiban transformasi ulat daun menjadi kepompong hingga kupu-kupu bersayap elok pemikat flora rimba!',
    discoveryId: 'discovery-metamorfosis',
    gameId: 'butterfly-metamorphosis',
    xpReward: 140,
    coinsReward: 45,
    orderIndex: 2
  },
  {
    id: 'sains-03',
    regionId: 'hutan-sains',
    title: 'Penjelajah Flora Langka',
    storyIntro: 'Dokumentasikan tanaman karnivora kantong semar dan bunga raksasa Padma Rafflesia di jantung rimba nusantara.',
    discoveryId: 'discovery-hutan-hujan',
    gameId: 'rare-flora-explorer',
    xpReward: 160,
    coinsReward: 45,
    orderIndex: 3
  },

  // Negeri Cerita (3 Quests)
  {
    id: 'cerita-01',
    regionId: 'negeri-cerita',
    title: 'Naskah Kuno Cendrawasih',
    storyIntro: 'Naskah kuno kerajaan tercerai-berai oleh angin kencang. Satukan kalimatnya kembali dengan padu.',
    discoveryId: 'discovery-sintaksis',
    gameId: 'story-builder',
    xpReward: 130,
    coinsReward: 40,
    orderIndex: 1
  },
  {
    id: 'cerita-02',
    regionId: 'negeri-cerita',
    title: 'Dongeng Timun Mas',
    storyIntro: 'Susun kembali kisah keberanian Timun Mas saat menyeberangi rintangan hutan ajaib.',
    discoveryId: 'discovery-dongeng',
    gameId: 'story-builder',
    xpReward: 160,
    coinsReward: 50,
    orderIndex: 2
  },
  {
    id: 'cerita-03',
    regionId: 'negeri-cerita',
    title: 'Jejak Aksara Nusantara',
    storyIntro: 'Temukan prasasti aksara tua di perpustakaan kerajaan dan pecahkan maknanya!',
    discoveryId: 'discovery-aksara',
    gameId: 'story-builder',
    xpReward: 200,
    coinsReward: 70,
    orderIndex: 3
  },

  // Gunung Teka-Teki (3 Quests)
  {
    id: 'teka-teki-01',
    regionId: 'gunung-teka-teki',
    title: 'Penyelamat Rover Cilik',
    storyIntro: 'Rover penjelajah terjebak di celah tebing. Program jalurnya menuju stasiun pengisian daya.',
    discoveryId: 'discovery-algoritma',
    gameId: 'robot-rescue',
    xpReward: 200,
    coinsReward: 60,
    orderIndex: 1
  },
  {
    id: 'teka-teki-02',
    regionId: 'gunung-teka-teki',
    title: 'Roda Gigi Labirin Kuno',
    storyIntro: 'Pintu bendungan air macet! Susun roda gigi penghubung agar kincir air kembali berputar.',
    discoveryId: 'discovery-roda-gigi',
    gameId: 'robot-rescue',
    xpReward: 220,
    coinsReward: 70,
    orderIndex: 2
  },
  {
    id: 'teka-teki-03',
    regionId: 'gunung-teka-teki',
    title: 'Kode Sandi Gunung Kristal',
    storyIntro: 'Kunci pintu brankas logika membutuhkan rangkaian gerbang keputusan yang tepat.',
    discoveryId: 'discovery-logika',
    gameId: 'robot-rescue',
    xpReward: 250,
    coinsReward: 80,
    orderIndex: 3
  },

  // Angkasa Pengetahuan (3 Quests)
  {
    id: 'angkasa-01',
    regionId: 'angkasa-pengetahuan',
    title: 'Harmoni Orbit Tata Surya',
    storyIntro: 'Gravitasi kosmik terganggu! Susun kembali planet-planet pada jarak orbit yang tepat.',
    discoveryId: 'discovery-tata-surya',
    gameId: 'solar-system',
    xpReward: 250,
    coinsReward: 80,
    orderIndex: 1
  },
  {
    id: 'angkasa-02',
    regionId: 'angkasa-pengetahuan',
    title: 'Rahasia Gravitasi Kosmik',
    storyIntro: 'Bantu wahana satelit meluncur ke lintasan orbit tanpa kehabisan daya dorong.',
    discoveryId: 'discovery-gravitasi',
    gameId: 'solar-system',
    xpReward: 280,
    coinsReward: 90,
    orderIndex: 2
  },
  {
    id: 'angkasa-03',
    regionId: 'angkasa-pengetahuan',
    title: 'Menjelajah Planet Biru Bumi',
    storyIntro: 'Amati keindahan dan keunikan atmosfer planet Bumi dari stasiun luar angkasa.',
    discoveryId: 'discovery-bumi',
    gameId: 'solar-system',
    xpReward: 320,
    coinsReward: 100,
    orderIndex: 3
  }
];

export const ACHIEVEMENTS = [
  {
    id: 'first-quest',
    title: 'Petualangan Perdana',
    description: 'Selesaikan quest pertamamu di dunia EduQuest.',
    category: 'eksplorasi',
    tier: 'Emas',
    icon: 'explore',
    xpReward: 50,
    coinsReward: 20,
    titleReward: 'Penjelajah Muda',
    targetCount: 1
  },
  {
    id: 'number-ninja',
    title: 'Ninja Angka Cepat',
    description: 'Selesaikan 10 tantangan matematika di Lembah Angka.',
    category: 'angka',
    tier: 'Emas',
    icon: 'bolt',
    xpReward: 100,
    coinsReward: 30,
    titleReward: 'Master Hitung',
    targetCount: 10
  },
  {
    id: 'little-scientist',
    title: 'Pakar Sains Cilik',
    description: 'Ungkap 3 penemuan konsep ilmiah di Hutan Sains.',
    category: 'sains',
    tier: 'Perak',
    icon: 'science',
    xpReward: 80,
    coinsReward: 30,
    titleReward: 'Peneliti Alam',
    targetCount: 3
  },
  {
    id: 'story-explorer',
    title: 'Penutur Kisah Handal',
    description: 'Susun 5 kalimat cerita tanpa kesalahan di Negeri Cerita.',
    category: 'kata',
    tier: 'Perunggu',
    icon: 'auto_stories',
    xpReward: 80,
    coinsReward: 30,
    titleReward: 'Penjelajah Kata',
    targetCount: 5
  },
  {
    id: 'puzzle-master',
    title: 'Master Teka-Teki',
    description: 'Pecahkan 5 teka-teki logika roda gigi di Gunung Teka-Teki.',
    category: 'angka',
    tier: 'Emas',
    icon: 'extension',
    xpReward: 100,
    coinsReward: 40,
    titleReward: 'Pakar Algoritma',
    targetCount: 5
  },
  {
    id: '7-day-streak',
    title: 'Penjaga Api Abadi',
    description: 'Pertahankan rentetan belajar harian selama 7 hari berturut-turut.',
    category: 'spesial',
    tier: 'Emas',
    icon: 'local_fire_department',
    xpReward: 150,
    coinsReward: 50,
    titleReward: 'Petualang Gigih',
    targetCount: 7
  },
  {
    id: 'super-learner',
    title: 'Bintang Pelajar Hebat',
    description: 'Capai Level 10 atau tuntaskan 15 tantangan edukasi di EduQuest.',
    category: 'spesial',
    tier: 'Emas',
    icon: 'workspace_premium',
    xpReward: 200,
    coinsReward: 100,
    titleReward: 'Legenda EduQuest',
    targetCount: 15
  }
];

export const PETS = [
  {
    id: 'milo-cat',
    name: 'Milo si Kucing Penemu',
    species: 'Kucing Jenius',
    description: 'Kucing cerdik dari Lembah Angka yang gemar menghitung dan memandu arah.',
    unlockLevel: 1,
    specialty: 'Logika & Hitung Cepat',
    perk: '+10% Kecepatan Kuis',
    habitatImage: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80',
    avatarIcon: 'pets',
    colorTheme: 'amber'
  },
  {
    id: 'lumi-fox',
    name: 'Lumi si Rubah Pintar',
    species: 'Rubah Mistik',
    description: 'Sahabat setia dari Hutan Sains dengan bulu keemasan yang menerangi malam.',
    unlockLevel: 3,
    specialty: 'Sains & Eksplorasi Alam',
    perk: '+15% XP Sains',
    habitatImage: 'https://images.unsplash.com/photo-1516934024742-b461fba47600?auto=format&fit=crop&w=600&q=80',
    avatarIcon: 'cruelty_free',
    colorTheme: 'emerald'
  },
  {
    id: 'bubu-panda',
    name: 'Bubu si Panda Ceria',
    species: 'Panda Hutan',
    description: 'Panda ramah pencinta bambu yang selalu memberi ketenangan dan semangat.',
    unlockLevel: 5,
    specialty: 'Fokus & Konsentrasi',
    perk: '+1 Cadangan Nyawa',
    habitatImage: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef6?auto=format&fit=crop&w=600&q=80',
    avatarIcon: 'favorite',
    colorTheme: 'emerald'
  },
  {
    id: 'koko-dino',
    name: 'Koko si Bayi Dino',
    species: 'Dinosaurus Cilik',
    description: 'Bayi dino pemberani dari Negeri Cerita yang gemar menjelajahi bebatuan purba.',
    unlockLevel: 8,
    specialty: 'Sejarah & Literasi',
    perk: '+10% Koin Quest',
    habitatImage: 'https://images.unsplash.com/photo-1570481662006-a3a1374699e8?auto=format&fit=crop&w=600&q=80',
    avatarIcon: 'egg',
    colorTheme: 'blue'
  },
  {
    id: 'draco-dragon',
    name: 'Draco si Naga Biru',
    species: 'Naga Langit',
    description: 'Naga kecil penjaga kubah bintang di Angkasa Pengetahuan.',
    unlockLevel: 16,
    specialty: 'Astronomi Kosmik',
    perk: '+20% Semua XP',
    habitatImage: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80',
    avatarIcon: 'auto_awesome',
    colorTheme: 'indigo'
  }
];

export const ITEMS = [
  // Hats / Accessories (4 items)
  {
    id: 'topi-safari-klasik',
    name: 'Topi Safari Klasik',
    category: 'hat',
    rarity: 'common',
    iconUrl: 'explore',
    unlockLevel: 1,
    costCoins: 0,
    description: 'Topi penjelajah pemula pelindung dari terik matahari.'
  },
  {
    id: 'helm-astronot-cilik',
    name: 'Helm Astronot Cilik',
    category: 'hat',
    rarity: 'epic',
    iconUrl: 'rocket_launch',
    unlockLevel: 14,
    costCoins: 500,
    description: 'Helm kaca pelindung dengan komunikasi radio kosmik.'
  },
  {
    id: 'baret-detektif-cilik',
    name: 'Baret Detektif Cilik',
    category: 'hat',
    rarity: 'rare',
    iconUrl: 'psychology',
    unlockLevel: 6,
    costCoins: 250,
    description: 'Topi wol modis penambah ketajaman berpikir dan menganalisis.'
  },
  {
    id: 'mahkota-daun-sains',
    name: 'Mahkota Daun Sains',
    category: 'hat',
    rarity: 'rare',
    iconUrl: 'spa',
    unlockLevel: 3,
    costCoins: 200,
    description: 'Mahkota indah terbuat dari daun tanaman hutan mistik.'
  },

  // Outfits (3 items)
  {
    id: 'kostum-penjelajah-biru',
    name: 'Kostum Penjelajah Biru',
    category: 'outfit',
    rarity: 'common',
    iconUrl: 'checkroom',
    unlockLevel: 1,
    costCoins: 0,
    description: 'Pakaian petualang serbaguna berbahan lentur dan nyaman.'
  },
  {
    id: 'jubah-penyihir-sains',
    name: 'Jubah Penyihir Sains',
    category: 'outfit',
    rarity: 'epic',
    iconUrl: 'magic_button',
    unlockLevel: 10,
    costCoins: 600,
    description: 'Jubah laboratorium bercahaya dengan saku ramuan edukasi.'
  },
  {
    id: 'baju-kosmik-bintang',
    name: 'Baju Kosmik Bintang',
    category: 'outfit',
    rarity: 'legendary',
    iconUrl: 'styler',
    unlockLevel: 16,
    costCoins: 850,
    description: 'Setelan astronot berbalut serat starlight berkilau.'
  },

  // Backpacks (3 items)
  {
    id: 'tas-petualang-kulit',
    name: 'Tas Petualang Kulit',
    category: 'backpack',
    rarity: 'common',
    iconUrl: 'backpack',
    unlockLevel: 1,
    costCoins: 0,
    description: 'Tas ransel kokoh untuk membawa bekal buku catatan.'
  },
  {
    id: 'tas-penjelajah-bintang',
    name: 'Tas Penjelajah Bintang',
    category: 'backpack',
    rarity: 'rare',
    iconUrl: 'card_giftcard',
    unlockLevel: 5,
    costCoins: 350,
    description: 'Tas bermagnet starlight dengan slot penyimpanan ekstra +5 slot.'
  },
  {
    id: 'tas-jetpack-mini',
    name: 'Tas Jetpack Mini',
    category: 'backpack',
    rarity: 'legendary',
    iconUrl: 'flight',
    unlockLevel: 16,
    costCoins: 1000,
    description: 'Tas jetpack berpendorong uap untuk melayang di atas rintangan.'
  },

  // Shoes (2 items)
  {
    id: 'sepatu-jelajah-cokelat',
    name: 'Sepatu Jelajah Cokelat',
    category: 'shoes',
    rarity: 'common',
    iconUrl: 'roller_skating',
    unlockLevel: 1,
    costCoins: 0,
    description: 'Sepatu bot anti-slip untuk mendaki bebatuan licin.'
  },
  {
    id: 'sepatu-bot-antariksa',
    name: 'Sepatu Bot Antariksa',
    category: 'shoes',
    rarity: 'epic',
    iconUrl: 'speed',
    unlockLevel: 12,
    costCoins: 450,
    description: 'Sepatu gravitasi ringan penambah kecepatan langkah di medan berat.'
  }
];

export const KNOWLEDGE_CARDS = [
  {
    id: 'card-earth',
    title: 'Planet Bumi',
    category: 'Kosmik',
    rarity: 'common',
    illustrationUrl: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?auto=format&fit=crop&w=600&q=80',
    facts: [
      'Bumi adalah rumah kita dan satu-satunya planet yang diketahui memiliki kehidupan.',
      'Lebih dari 70% permukaan Bumi tertutup oleh air samudra biru yang luas.',
      'Bumi membutuhkan waktu 365 hari (1 tahun) untuk sekali mengitari Matahari.'
    ]
  },
  {
    id: 'card-sun',
    title: 'Matahari Sang Bintang',
    category: 'Kosmik',
    rarity: 'rare',
    illustrationUrl: 'https://images.unsplash.com/photo-1538370965046-79c0d6907d47?auto=format&fit=crop&w=600&q=80',
    facts: [
      'Matahari sebenarnya adalah sebuah bintang raksasa di pusat Tata Surya kita.',
      'Cahaya Matahari membutuhkan waktu sekitar 8 menit untuk sampai ke permukaan Bumi.',
      'Matahari memberi energi panas yang sangat penting bagi tumbuhan untuk membuat makanan.'
    ]
  },
  {
    id: 'card-moon',
    title: 'Bulan Sahabat Malam',
    category: 'Kosmik',
    rarity: 'common',
    illustrationUrl: 'https://images.unsplash.com/photo-1532693322450-2cb5c511067d?auto=format&fit=crop&w=600&q=80',
    facts: [
      'Bulan adalah satelit alami Bumi yang setia menemani langit malam kita.',
      'Bulan tidak memancarkan cahaya sendiri; ia memantulkan cahaya dari sinar Matahari.',
      'Gaya gravitasi Bulan membantu menggerakkan pasang surut air laut di samudra Bumi.'
    ]
  },
  {
    id: 'card-volcano',
    title: 'Gunung Berapi Misterius',
    category: 'Alam',
    rarity: 'rare',
    illustrationUrl: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80',
    facts: [
      'Gunung berapi adalah jendela ke dalam perut Bumi tempat magma cair keluar.',
      'Ketika magma mencapai permukaan tanah, ia berubah sebutan menjadi lava pijar.',
      'Abu letusan gunung berapi membuat tanah di sekitarnya menjadi sangat subur untuk bertani!'
    ]
  },
  {
    id: 'card-blue-whale',
    title: 'Paus Biru Raksasa Samudra',
    category: 'Sains',
    rarity: 'legendary',
    illustrationUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=600&q=80',
    facts: [
      'Paus biru adalah hewan terbesar yang pernah hidup di Bumi, lebih besar dari dinosaurus!',
      'Berat lidah seekor paus biru saja bisa sama dengan berat satu ekor gajah dewasa.',
      'Meskipun hidup di laut dalam, paus biru bernapas menggunakan paru-paru seperti manusia.'
    ]
  },
  {
    id: 'card-rainforest',
    title: 'Hutan Hujan Tropis',
    category: 'Alam',
    rarity: 'common',
    illustrationUrl: 'https://images.unsplash.com/photo-1511497584788-87676104235f?auto=format&fit=crop&w=600&q=80',
    facts: [
      'Hutan hujan tropis dijuluki sebagai paru-paru dunia karena menghasilkan limpahan oksigen.',
      'Indonesia memiliki kawasan hutan hujan tropis terluas ketiga di seluruh dunia.',
      'Hutan ini menjadi tempat tinggal bagi jutaan jenis burung, harimau, dan tanaman langka.'
    ]
  },
  {
    id: 'card-photosynthesis',
    title: 'Misteri Fotosintesis',
    category: 'Sains',
    rarity: 'rare',
    illustrationUrl: 'https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=600&q=80',
    facts: [
      'Zat hijau pada daun tumbuhan dinamakan klorofil yang bertugas menangkap sinar matahari.',
      'Tumbuhan menyerap gas karbon dioksida dan melepaskan oksigen bersih untuk kita bernapas.',
      'Tanpa proses fotosintesis tumbuhan, makhluk hidup di Bumi tidak akan memiliki udara segar.'
    ]
  },
  {
    id: 'card-gravity',
    title: 'Daya Tarik Gravitasi',
    category: 'Sains',
    rarity: 'rare',
    illustrationUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80',
    facts: [
      'Gravitasi adalah gaya tak terlihat yang menarik semua benda menuju pusat Bumi.',
      'Gaya inilah yang membuat kita tetap menapak di tanah dan tidak melayang ke udara.',
      'Sir Isaac Newton pertama kali menyadari adanya gravitasi saat melihat buah apel jatuh dari pohon.'
    ]
  },
  {
    id: 'card-fractions',
    title: 'Keajaiban Pecahan',
    category: 'Matematika',
    rarity: 'common',
    illustrationUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80',
    facts: [
      'Pecahan membantu kita membagi makanan atau benda secara adil dengan teman.',
      'Angka bagian atas disebut pembilang, sedangkan angka bagian bawah disebut penyebut.',
      'Dua per empat (2/4) bernilai persis sama dengan satu per dua (1/2).'
    ]
  },
  {
    id: 'card-archipelago',
    title: 'Kekayaan Nusantara',
    category: 'Bahasa',
    rarity: 'common',
    illustrationUrl: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&w=600&q=80',
    facts: [
      'Indonesia adalah negara kepulauan terbesar di dunia dengan lebih dari 17.000 pulau.',
      'Memiliki lebih dari 700 bahasa daerah yang diikat oleh satu bahasa persatuan: Bahasa Indonesia.',
      'Semboyan Bhinneka Tunggal Ika bermakna berbeda-beda tetapi tetap satu jua.'
    ]
  },
  {
    id: 'card-sastra',
    title: 'Mahakarya Sastra & SPOK Nusantara',
    category: 'Bahasa',
    rarity: 'legendary',
    illustrationUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&w=600&q=80',
    facts: [
      'Struktur kalimat dasar bahasa Indonesia terdiri dari Subjek, Predikat, Objek, dan Keterangan.',
      'Cerita rakyat nusantara mengajarkan kecerdikan akal budi dan kebaikan moral melintasi generasi.',
      'Susunan kalimat yang runtut memancarkan kejelasan pesan dan keindahan rasa dalam bertutur kata.'
    ]
  },
  {
    id: 'card-pantun',
    title: 'Bait Pantun & Puisi Rakyat Nusantara',
    category: 'Bahasa',
    rarity: 'legendary',
    illustrationUrl: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=600&q=80',
    facts: [
      'Pantun merupakan karya sastra lisan Nusantara yang diakui UNESCO sebagai Warisan Budaya Takbenda Dunia.',
      'Satu bait pantun terdiri dari 4 baris: baris 1-2 adalah sampiran dan baris 3-4 adalah isi yang bermakna nasihat.',
      'Pola sajak pantun memiliki rima bersilang a-b-a-b yang indah didengar saat dibacakan berbalas.'
    ]
  }
];

export const DAILY_QUESTS = [
  {
    id: 'daily-math-01',
    title: 'Selesaikan 5 Tantangan Matematika',
    targetCount: 5,
    xpReward: 100,
    coinsReward: 30,
    icon: 'calculate',
    type: 'math'
  },
  {
    id: 'daily-science-01',
    title: 'Temukan 1 Konsep Sains Baru',
    targetCount: 1,
    xpReward: 150,
    coinsReward: 40,
    icon: 'science',
    type: 'science'
  },
  {
    id: 'daily-story-01',
    title: 'Selesaikan 1 Petualangan Kisah',
    targetCount: 1,
    xpReward: 100,
    coinsReward: 30,
    icon: 'auto_stories',
    type: 'story'
  }
];
