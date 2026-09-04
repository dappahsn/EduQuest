import { createClient } from '@neondatabase/neon-js';

const neonUrl = 
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_NEON_DATABASE_URL) || 
  (typeof process !== 'undefined' && process.env?.VITE_NEON_DATABASE_URL) || 
  'https://placeholder-eduquest.us-east-1.aws.neon.tech/neondb';

export const isNeonConfigured = Boolean(neonUrl && !neonUrl.includes('placeholder'));

if (!isNeonConfigured) {
  console.info(
    '[EduQuest] Neon database URL is placeholder. Running in safe local offline fallback mode.'
  );
}

// Inisialisasi Neon Client (Data API + Managed Better Auth)
export const neon = createClient(neonUrl);
