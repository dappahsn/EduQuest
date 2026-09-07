// World Map and Planets progression definitions
export const REGION_QUESTS = {
  'lembah-angka': [
    {
      id: 'quest-la-1',
      number: '01',
      title: 'Jembatan Perkalian Kilat',
      desc: 'Lompati batu sungai dengan jawaban perkalian 7 x 8 = 56!',
      gameId: 'mini-nc',
      stars: 3,
      xp: 120,
      altIds: ['quest-la-3', 'angka-01']
    },
    {
      id: 'quest-la-2',
      number: '02',
      title: 'Dunia Pecahan Pizza Lab',
      desc: 'Potong dan sajikan pecahan 3/4 untuk tim penjelajah.',
      gameId: 'mini-pl',
      stars: 3,
      xp: 140,
      altIds: ['angka-02']
    },
    {
      id: 'quest-la-geom',
      number: '03',
      title: 'Penjumlahan Segitiga Ajaib',
      desc: 'Hitung sudut dan panjang segitiga jembatan kristal.',
      gameId: 'mini-mt',
      stars: 3,
      xp: 160,
      altIds: ['angka-03', 'quest-la-3']
    },
    {
      id: 'quest-la-boss',
      number: '04',
      isBoss: true,
      title: 'Gerbang Aljabar Kristal',
      desc: 'Pecahkan teka-teki misteri penguasa Lembah Angka.',
      gameId: 'mini-ag',
      stars: 3,
      xp: 300,
      altIds: ['angka-boss', 'angka-04']
    }
  ],
  'hutan-sains': [
    {
      id: 'quest-hs-1',
      number: '01',
      title: 'Misteri Fotosintesis Daun',
      desc: 'Kumpulkan reaktan alami dan bongkar dapur klorofil daun.',
      gameId: 'mini-ps',
      stars: 3,
      xp: 140,
      altIds: ['sains-01']
    },
    {
      id: 'quest-hs-2',
      number: '02',
      title: 'Metamorfosis Kupu-Kupu',
      desc: 'Urutkan tahapan telur, ulat, kepompong, hingga kupu-kupu.',
      gameId: 'mini-bm',
      stars: 3,
      xp: 140,
      altIds: ['sains-02']
    },
    {
      id: 'quest-hs-3',
      number: '03',
      title: 'Penjelajah Flora Langka',
      desc: 'Dokumentasikan tanaman kantong semar dan bunga raksasa.',
      gameId: 'mini-rf',
      stars: 3,
      xp: 160,
      altIds: ['sains-03']
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
      xp: 150,
      altIds: ['cerita-01']
    },
    {
      id: 'quest-nc-2',
      number: '02',
      title: 'Susunan Kalimat Bahasa',
      desc: 'Pelajari peran Subjek, Predikat, Objek, dan Keterangan.',
      gameId: 'mini-sb',
      stars: 3,
      xp: 160,
      altIds: ['cerita-02']
    },
    {
      id: 'quest-nc-3',
      number: '03',
      title: 'Pujangga Pantun Nusantara',
      desc: 'Lengkapi sampiran, isi, dan rima bait pantun penuh nasihat leluhur.',
      gameId: 'mini-pp',
      stars: 3,
      xp: 180,
      altIds: ['cerita-03']
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
      xp: 160,
      altIds: ['teka-teki-01', 'tekateki-01']
    },
    {
      id: 'quest-gt-2',
      number: '02',
      title: 'Kode Algoritma Roda Gigi',
      desc: 'Pecahkan arah putaran roda gigi mekanik benteng.',
      gameId: 'mini-gp',
      stars: 3,
      xp: 180,
      altIds: ['teka-teki-02', 'tekateki-02']
    },
    {
      id: 'quest-gt-3',
      number: '03',
      title: 'Gerbang Logika Benar-Salah',
      desc: 'Ambil keputusan logis untuk membuka pintu ruang harta.',
      gameId: 'mini-lg',
      stars: 3,
      xp: 200,
      altIds: ['teka-teki-03', 'tekateki-03']
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
      xp: 160,
      altIds: ['angkasa-01', 'angkasa-pengetahuan-01']
    },
    {
      id: 'quest-ap-2',
      number: '02',
      title: 'Daya Tarik Gravitasi',
      desc: 'Jelajahi perbedaan berat benda di Bulan dan Bumi.',
      gameId: 'gravity-lab',
      stars: 3,
      xp: 180,
      altIds: ['angkasa-02', 'angkasa-pengetahuan-02']
    },
    {
      id: 'quest-ap-3',
      number: '03',
      title: 'Peluncuran Stasiun Antariksa',
      desc: 'Rancang penerbangan modul laboratorium antariksa.',
      gameId: 'space-station-launch',
      stars: 3,
      xp: 220,
      altIds: ['angkasa-03', 'angkasa-pengetahuan-03']
    }
  ]
};

// Aliases mapping across old and new quest identifiers
export const QUEST_ALIASES = {
  // Lembah Angka
  'quest-la-1': ['quest-la-1', 'quest-la-3', 'angka-01'],
  'angka-01': ['quest-la-1', 'quest-la-3', 'angka-01'],
  'quest-la-2': ['quest-la-2', 'angka-02'],
  'angka-02': ['quest-la-2', 'angka-02'],
  'quest-la-geom': ['quest-la-geom', 'quest-la-3', 'angka-03'],
  'quest-la-3': ['quest-la-geom', 'quest-la-3', 'angka-03', 'quest-la-1', 'angka-01'],
  'angka-03': ['quest-la-geom', 'quest-la-3', 'angka-03'],
  'quest-la-boss': ['quest-la-boss', 'angka-boss', 'angka-04'],
  'angka-boss': ['quest-la-boss', 'angka-boss', 'angka-04'],

  // Hutan Sains
  'quest-hs-1': ['quest-hs-1', 'sains-01'],
  'sains-01': ['quest-hs-1', 'sains-01'],
  'quest-hs-2': ['quest-hs-2', 'sains-02'],
  'sains-02': ['quest-hs-2', 'sains-02'],
  'quest-hs-3': ['quest-hs-3', 'sains-03'],
  'sains-03': ['quest-hs-3', 'sains-03'],

  // Negeri Cerita
  'quest-nc-1': ['quest-nc-1', 'cerita-01'],
  'cerita-01': ['quest-nc-1', 'cerita-01'],
  'quest-nc-2': ['quest-nc-2', 'cerita-02'],
  'cerita-02': ['quest-nc-2', 'cerita-02'],
  'quest-nc-3': ['quest-nc-3', 'cerita-03'],
  'cerita-03': ['quest-nc-3', 'cerita-03'],

  // Gunung Teka-Teki
  'quest-gt-1': ['quest-gt-1', 'teka-teki-01', 'tekateki-01'],
  'teka-teki-01': ['quest-gt-1', 'teka-teki-01', 'tekateki-01'],
  'tekateki-01': ['quest-gt-1', 'teka-teki-01', 'tekateki-01'],
  'quest-gt-2': ['quest-gt-2', 'teka-teki-02', 'tekateki-02'],
  'teka-teki-02': ['quest-gt-2', 'teka-teki-02', 'tekateki-02'],
  'tekateki-02': ['quest-gt-2', 'teka-teki-02', 'tekateki-02'],
  'quest-gt-3': ['quest-gt-3', 'teka-teki-03', 'tekateki-03'],
  'teka-teki-03': ['quest-gt-3', 'teka-teki-03', 'tekateki-03'],
  'tekateki-03': ['quest-gt-3', 'teka-teki-03', 'tekateki-03'],

  // Angkasa Pengetahuan
  'quest-ap-1': ['quest-ap-1', 'angkasa-01', 'angkasa-pengetahuan-01'],
  'angkasa-01': ['quest-ap-1', 'angkasa-01', 'angkasa-pengetahuan-01'],
  'quest-ap-2': ['quest-ap-2', 'angkasa-02', 'angkasa-pengetahuan-02'],
  'angkasa-02': ['quest-ap-2', 'angkasa-02', 'angkasa-pengetahuan-02'],
  'quest-ap-3': ['quest-ap-3', 'angkasa-03', 'angkasa-pengetahuan-03'],
  'angkasa-03': ['quest-ap-3', 'angkasa-03', 'angkasa-pengetahuan-03']
};

export function isQuestDone(qId, completedQuestIds = []) {
  if (!qId) return false;
  const aliases = QUEST_ALIASES[qId] || [qId];
  return (completedQuestIds || []).some((id) => aliases.includes(id));
}

export function getRegionProgress(regionId, completedQuestIds = []) {
  const quests = REGION_QUESTS[regionId] || [];
  if (!quests.length) return 0;
  const done = quests.filter((q) => isQuestDone(q.id, completedQuestIds)).length;
  return Math.round((done / quests.length) * 100);
}

export function isPlanetCompleted(regionKeyOrId, completedQuestIds = []) {
  const regionMap = {
    angka: 'lembah-angka',
    'lembah-angka': 'lembah-angka',
    sains: 'hutan-sains',
    'hutan-sains': 'hutan-sains',
    cerita: 'negeri-cerita',
    'negeri-cerita': 'negeri-cerita',
    tekateki: 'gunung-teka-teki',
    'gunung-teka-teki': 'gunung-teka-teki',
    angkasa: 'angkasa-pengetahuan',
    'angkasa-pengetahuan': 'angkasa-pengetahuan'
  };

  const regId = regionMap[regionKeyOrId] || regionKeyOrId;
  const quests = REGION_QUESTS[regId] || [];
  if (!quests.length) return false;

  // A planet is completed ONLY when ALL of its quests are completed (100% progress)!
  return quests.every((q) => isQuestDone(q.id, completedQuestIds));
}
