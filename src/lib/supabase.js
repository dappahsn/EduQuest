import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { createClient as createNeonClient } from '@neondatabase/neon-js';

const neonUrl = 
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_NEON_DATABASE_URL) || 
  (typeof process !== 'undefined' && process.env?.VITE_NEON_DATABASE_URL) || 
  '';

const supabaseUrl = 
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_URL) || 
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL) || 
  'https://placeholder.supabase.co';

const supabaseAnonKey = 
  (typeof import.meta !== 'undefined' && import.meta.env?.VITE_SUPABASE_PUBLISHABLE_KEY) || 
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_PUBLISHABLE_KEY) || 
  'placeholder-anon-key';

export function normalizeNeonUrl(url) {
  if (!url) return '';
  return url.trim().replace('.apirest.', '.').replace(/\/rest\/v1\/?$/, '');
}

export const isNeonActive = Boolean(neonUrl && !neonUrl.includes('placeholder'));
export const isSupabaseActive = Boolean(supabaseUrl && !supabaseUrl.includes('placeholder'));
export const isDatabaseActive = isNeonActive || isSupabaseActive;

let dbClient;

if (isNeonActive) {
  const cleanUrl = normalizeNeonUrl(neonUrl);
  console.info('[EduQuest DB] Menggunakan Neon Postgres Client (Data API & Neon Auth):', cleanUrl);
  dbClient = createNeonClient(cleanUrl);
} else {
  if (!isSupabaseActive) {
    console.info('[EduQuest DB] Menggunakan offline/local fallback mode (kredensial cloud belum diisi).');
  }
  dbClient = createSupabaseClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: typeof window !== 'undefined' ? window.localStorage : undefined
      }
    }
  );
}

// Ekspor client utama (kompatibel dengan query .from(), .auth, dan .rpc())
export const supabase = dbClient;
export const db = dbClient;

