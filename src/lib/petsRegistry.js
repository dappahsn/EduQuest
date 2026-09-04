/**
 * Extensible Pet Companion System
 * Allows registration and extension of companions with attributes, levels, happiness, and bonuses.
 */

export const PET_REGISTRY = {
  cat: {
    id: 'cat',
    name: 'Milo si Penemu',
    species: 'Kucing',
    title: 'Kucing Penemu Cilik',
    description: 'Sangat menyukai perkalian, roda gigi, dan menyusun teka-teki logika!',
    specialty: 'Spesialis Logika & Matematika',
    originQuest: 'Kota Angka • 5 Misi',
    baseBonus: '+10% XP Matematika',
    avatarEmoji: '🐱',
    colorScheme: {
      bg: '#ffdbca',
      accent: '#994100'
    },
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCemK-bdyYImYJYBCS5ZNIzIVmWAXBdXAJ_rjIthWfO15sxhLxq_9y7xvDR5MXhA8Os0ELs8jKb6a97yqxXvMx7sUJUrOA-yzbvJ758YkC_lRRc-wZ2X8-9dkpzhOgdzJ3FfY62EIYP7wUXk2dwqct5n2a3PcrF3h7IhhQZzxI56JyLy-0Z_u85Heco50VcfPoZ-U_FWyB3_SslSfijQxB3hSQrbUUVc_5N1yYw3NeGUfBE8vHlhKgh5g'
  },
  fox: {
    id: 'fox',
    name: 'Lumi si Rubah Pintar',
    species: 'Rubah',
    title: 'Rubah Cendekia',
    description: 'Cepat tanggap dan gemar mengamati tumbuhan serta ekosistem di Hutan Sains.',
    specialty: 'Spesialis Penjelajah Logika & Sains',
    originQuest: 'Hutan Sains • 10 Misi',
    baseBonus: '+15% XP Sains',
    avatarEmoji: '🦊',
    colorScheme: {
      bg: '#cce5ff',
      accent: '#006194'
    },
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCdBn49uJCYXtdlZeKPVF5kYcqv-02gnuSfEivf7FZYpexmpvsb1y2mpi7lTiFmaIk84WjMztRDcOU77GQVaE3vhYREDTbhWUaU3u5KcU_kQ78ZI3buSqbogNtF6AUOSEUK9Va3ECGqJcKBc1HQWcrqOVKGXyiuQM62dRflgZWpXQuW4iQ_N4x-vaG5FFltNlTgKVrxmQnHSQyNPuzW3ssr2iyJvzMvQwJnw7a1JBmwD6gAVTRAZEozDw'
  },
  panda: {
    id: 'panda',
    name: 'Bao si Panda Bijak',
    species: 'Panda',
    title: 'Panda Penjaga Dongeng',
    description: 'Tenang, suka membaca kisah Nusantara, dan pandai merangkai kosakata indah.',
    specialty: 'Spesialis Literasi & Bahasa',
    originQuest: 'Negeri Cerita • 15 Misi',
    baseBonus: '+10% Koin Dongeng',
    avatarEmoji: '🐼',
    colorScheme: {
      bg: '#6cf8bb',
      accent: '#006c49'
    },
    imageUrl: 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef6?w=400&auto=format&fit=crop&q=80'
  },
  dino: {
    id: 'dino',
    name: 'Tomi si Dino Perkasa',
    species: 'Dinosaurus',
    title: 'Penjelajah Fosil',
    description: 'Memiliki rasa ingin tahu membara tentang gunung berapi dan misteri purba.',
    specialty: 'Spesialis Eksplorasi Geologi',
    originQuest: 'Gunung Teka-Teki • 20 Misi',
    baseBonus: '+20% Ketahanan Energi',
    avatarEmoji: '🦖',
    colorScheme: {
      bg: '#ffb690',
      accent: '#c05400'
    },
    imageUrl: 'https://images.unsplash.com/photo-1525877442103-5dd52293652c?w=400&auto=format&fit=crop&q=80'
  },
  dragon: {
    id: 'dragon',
    name: 'Ignis si Naga Bintang',
    species: 'Naga Kosmik',
    title: 'Pengelana Antariksa',
    description: 'Naga mistis bersayap bintang yang melintasi galaksi dan orbit tata surya.',
    specialty: 'Spesialis Astronomi & Fisika',
    originQuest: 'Angkasa Pengetahuan • 25 Misi',
    baseBonus: '+25% Skor Kosmik',
    avatarEmoji: '🐉',
    colorScheme: {
      bg: '#dbe1ff',
      accent: '#007bb9'
    },
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=400&auto=format&fit=crop&q=80'
  }
};

export function registerNewPet(petDef) {
  if (!petDef || !petDef.id) throw new Error('Pet definition must have an id');
  PET_REGISTRY[petDef.id] = petDef;
}

export function getAllPets() {
  return Object.values(PET_REGISTRY);
}

export function getPetById(id) {
  return PET_REGISTRY[id] || null;
}

export function calculatePetLevel(xp) {
  // 100 XP per pet level
  const level = Math.floor((xp || 0) / 100) + 1;
  const currentXp = (xp || 0) % 100;
  return {
    level,
    currentXp,
    neededXp: 100,
    percentage: Math.min(100, Math.round((currentXp / 100) * 100))
  };
}
