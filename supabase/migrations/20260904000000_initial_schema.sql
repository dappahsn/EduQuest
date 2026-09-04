-- ==============================================================================
-- EDUQUEST DATABASE FOUNDATION MIGRATION
-- Single Source of Truth: DATABASE.md
-- Target: Supabase PostgreSQL
-- ==============================================================================

-- Aktifkan ekstensi pgcrypto untuk gen_random_uuid() jika belum aktif
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 1. PROFILES (Terhubung 1:1 dengan Supabase auth.users)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    username TEXT NOT NULL,
    avatar_id TEXT DEFAULT 'raka_classic',
    level INTEGER NOT NULL DEFAULT 1 CHECK (level >= 1),
    xp INTEGER NOT NULL DEFAULT 0 CHECK (xp >= 0),
    coins INTEGER NOT NULL DEFAULT 100 CHECK (coins >= 0),
    lives INTEGER NOT NULL DEFAULT 3 CHECK (lives >= 0 AND lives <= 5),
    streak INTEGER NOT NULL DEFAULT 1 CHECK (streak >= 0),
    last_active_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 2. REGIONS (5 Wilayah Edukasi Peta Dunia)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.regions (
    id TEXT PRIMARY KEY, -- 'lembah-angka', 'hutan-sains', 'negeri-cerita', 'gunung-teka-teki', 'angkasa-pengetahuan'
    name TEXT NOT NULL,
    subject TEXT NOT NULL CHECK (subject IN ('Matematika', 'Sains', 'Bahasa', 'Logika', 'Umum')),
    description TEXT NOT NULL,
    required_level INTEGER NOT NULL DEFAULT 1 CHECK (required_level >= 1),
    order_index INTEGER NOT NULL CHECK (order_index >= 1),
    is_active BOOLEAN NOT NULL DEFAULT true,
    illustration_url TEXT,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 3. GAMES (Katalog Mini-Game Interaktif)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.games (
    id TEXT PRIMARY KEY, -- 'number-catcher', 'pizza-lab', 'solar-system', 'robot-rescue', 'story-builder'
    title TEXT NOT NULL,
    subject TEXT NOT NULL,
    difficulty INTEGER NOT NULL DEFAULT 1 CHECK (difficulty BETWEEN 1 AND 5),
    instructions TEXT NOT NULL,
    max_score INTEGER NOT NULL DEFAULT 100,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 4. QUESTS (Misi Petualangan di Setiap Wilayah)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.quests (
    id TEXT PRIMARY KEY, -- e.g. 'lembah-angka-01'
    region_id TEXT NOT NULL REFERENCES public.regions(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    story_intro TEXT NOT NULL,
    discovery_id TEXT,
    game_id TEXT NOT NULL REFERENCES public.games(id) ON DELETE RESTRICT,
    xp_reward INTEGER NOT NULL DEFAULT 120 CHECK (xp_reward >= 0),
    coins_reward INTEGER NOT NULL DEFAULT 40 CHECK (coins_reward >= 0),
    order_index INTEGER NOT NULL CHECK (order_index >= 1),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 5. QUEST_PROGRESS (Histori Progres Misi Pemain)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.quest_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    quest_id TEXT NOT NULL REFERENCES public.quests(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('started', 'completed')),
    score INTEGER NOT NULL DEFAULT 0 CHECK (score >= 0),
    stars INTEGER NOT NULL DEFAULT 3 CHECK (stars BETWEEN 1 AND 3),
    completed_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, quest_id)
);

-- ==============================================================================
-- 6. GAME_PROGRESS (Catatan Skor Tertinggi Mini-Game)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.game_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    game_id TEXT NOT NULL REFERENCES public.games(id) ON DELETE CASCADE,
    best_score INTEGER NOT NULL DEFAULT 0 CHECK (best_score >= 0),
    times_played INTEGER NOT NULL DEFAULT 1 CHECK (times_played >= 1),
    last_played_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, game_id)
);

-- ==============================================================================
-- 7. ACHIEVEMENTS (Katalog Lencana Prestasi)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.achievements (
    id TEXT PRIMARY KEY, -- e.g. 'master-perkalian-kilat'
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('angka', 'sains', 'kata', 'eksplorasi', 'spesial')),
    icon TEXT NOT NULL,
    xp_reward INTEGER NOT NULL DEFAULT 50 CHECK (xp_reward >= 0),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 8. USER_ACHIEVEMENTS (Lencana yang Dimiliki Pemain)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.user_achievements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    achievement_id TEXT NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, achievement_id)
);

-- ==============================================================================
-- 9. ITEMS (Katalog Busana & Aksesoris Karakter)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.items (
    id TEXT PRIMARY KEY, -- e.g. 'topi-safari-klasik'
    name TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('hat', 'outfit', 'backpack', 'shoes', 'accessory')),
    rarity TEXT NOT NULL DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'epic', 'legendary')),
    icon_url TEXT NOT NULL,
    unlock_level INTEGER DEFAULT 1 CHECK (unlock_level >= 1),
    cost_coins INTEGER DEFAULT 0 CHECK (cost_coins >= 0),
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 10. USER_ITEMS (Inventaris Pakaian yang Dimiliki Pemain)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.user_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    item_id TEXT NOT NULL REFERENCES public.items(id) ON DELETE CASCADE,
    is_equipped BOOLEAN NOT NULL DEFAULT false,
    acquired_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, item_id)
);

-- ==============================================================================
-- 11. PETS (Katalog Spesies Hewan Sahabat)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.pets (
    id TEXT PRIMARY KEY, -- e.g. 'lumi-fox', 'bubu-panda'
    name TEXT NOT NULL,
    species TEXT NOT NULL,
    description TEXT NOT NULL,
    unlock_level INTEGER NOT NULL DEFAULT 1 CHECK (unlock_level >= 1),
    habitat_image TEXT NOT NULL,
    avatar_image TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 12. USER_PETS (Hewan Sahabat yang Dipelihara Pemain)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.user_pets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    pet_id TEXT NOT NULL REFERENCES public.pets(id) ON DELETE CASCADE,
    level INTEGER NOT NULL DEFAULT 1 CHECK (level >= 1),
    xp INTEGER NOT NULL DEFAULT 0 CHECK (xp >= 0),
    happiness INTEGER NOT NULL DEFAULT 100 CHECK (happiness BETWEEN 0 AND 100),
    is_active BOOLEAN NOT NULL DEFAULT false,
    acquired_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, pet_id)
);

-- ==============================================================================
-- 13. KNOWLEDGE_CARDS (Kartu Fakta Pengetahuan Koleksi)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.knowledge_cards (
    id TEXT PRIMARY KEY, -- e.g. 'card-bumi', 'card-tata-surya'
    title TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN ('Matematika', 'Sains', 'Bahasa', 'Alam', 'Kosmik')),
    facts TEXT[] NOT NULL,
    rarity TEXT NOT NULL DEFAULT 'common' CHECK (rarity IN ('common', 'rare', 'legendary')),
    illustration_url TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 14. USER_KNOWLEDGE_CARDS (Kartu yang Dikoleksi Pemain)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.user_knowledge_cards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    card_id TEXT NOT NULL REFERENCES public.knowledge_cards(id) ON DELETE CASCADE,
    unlocked_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    UNIQUE(user_id, card_id)
);

-- ==============================================================================
-- 15. DAILY_QUESTS (Katalog Misi Harian Edukasi)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.daily_quests (
    id TEXT PRIMARY KEY, -- e.g. 'daily-math-01'
    title TEXT NOT NULL,
    target_count INTEGER NOT NULL DEFAULT 1 CHECK (target_count >= 1),
    xp_reward INTEGER NOT NULL DEFAULT 100 CHECK (xp_reward >= 0),
    coins_reward INTEGER NOT NULL DEFAULT 30 CHECK (coins_reward >= 0),
    icon TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ==============================================================================
-- 16. DAILY_QUEST_PROGRESS (Progres Harian Pemain)
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.daily_quest_progress (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    daily_quest_id TEXT NOT NULL REFERENCES public.daily_quests(id) ON DELETE CASCADE,
    current_count INTEGER NOT NULL DEFAULT 0 CHECK (current_count >= 0),
    is_completed BOOLEAN NOT NULL DEFAULT false,
    date DATE NOT NULL DEFAULT CURRENT_DATE,
    UNIQUE(user_id, daily_quest_id, date)
);

-- ==============================================================================
-- INDEXES FOR HIGH-PERFORMANCE QUERYING
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_xp ON public.profiles(xp DESC);
CREATE INDEX IF NOT EXISTS idx_quests_region ON public.quests(region_id, order_index);
CREATE INDEX IF NOT EXISTS idx_quest_progress_user ON public.quest_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_game_progress_user ON public.game_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON public.user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_items_user ON public.user_items(user_id);
CREATE INDEX IF NOT EXISTS idx_user_pets_user ON public.user_pets(user_id);
CREATE INDEX IF NOT EXISTS idx_user_cards_user ON public.user_knowledge_cards(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_quest_progress_user_date ON public.daily_quest_progress(user_id, date);

-- ==============================================================================
-- ROW-LEVEL SECURITY (RLS) ENABLEMENT ON ALL 16 TABLES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.regions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quest_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.game_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_pets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.knowledge_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_knowledge_cards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_quests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_quest_progress ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- RLS POLICIES: PUBLIC CATALOGS (Read-Only to Authenticated / Anons)
-- ==============================================================================
CREATE POLICY "Public catalogs viewable: regions" ON public.regions FOR SELECT USING (true);
CREATE POLICY "Public catalogs viewable: games" ON public.games FOR SELECT USING (true);
CREATE POLICY "Public catalogs viewable: quests" ON public.quests FOR SELECT USING (true);
CREATE POLICY "Public catalogs viewable: achievements" ON public.achievements FOR SELECT USING (true);
CREATE POLICY "Public catalogs viewable: items" ON public.items FOR SELECT USING (true);
CREATE POLICY "Public catalogs viewable: pets" ON public.pets FOR SELECT USING (true);
CREATE POLICY "Public catalogs viewable: knowledge_cards" ON public.knowledge_cards FOR SELECT USING (true);
CREATE POLICY "Public catalogs viewable: daily_quests" ON public.daily_quests FOR SELECT USING (true);

-- ==============================================================================
-- RLS POLICIES: USER OWNED DATA (Strict Isolation by auth.uid())
-- ==============================================================================

-- 1. Profiles
CREATE POLICY "Users can view own profile" 
    ON public.profiles FOR SELECT 
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" 
    ON public.profiles FOR INSERT 
    WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
    ON public.profiles FOR UPDATE 
    USING (auth.uid() = id);

-- 2. Quest Progress
CREATE POLICY "Users can view own quest progress" 
    ON public.quest_progress FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quest progress" 
    ON public.quest_progress FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own quest progress" 
    ON public.quest_progress FOR UPDATE 
    USING (auth.uid() = user_id);

-- 3. Game Progress
CREATE POLICY "Users can view own game progress" 
    ON public.game_progress FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own game progress" 
    ON public.game_progress FOR ALL 
    USING (auth.uid() = user_id);

-- 4. User Achievements
CREATE POLICY "Users can view own achievements" 
    ON public.user_achievements FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can unlock own achievements" 
    ON public.user_achievements FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- 5. User Items
CREATE POLICY "Users can view own items" 
    ON public.user_items FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own items" 
    ON public.user_items FOR ALL 
    USING (auth.uid() = user_id);

-- 6. User Pets
CREATE POLICY "Users can view own pets" 
    ON public.user_pets FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own pets" 
    ON public.user_pets FOR ALL 
    USING (auth.uid() = user_id);

-- 7. User Knowledge Cards
CREATE POLICY "Users can view own knowledge cards" 
    ON public.user_knowledge_cards FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can collect own knowledge cards" 
    ON public.user_knowledge_cards FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- 8. Daily Quest Progress
CREATE POLICY "Users can view own daily quest progress" 
    ON public.daily_quest_progress FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own daily quest progress" 
    ON public.daily_quest_progress FOR ALL 
    USING (auth.uid() = user_id);

-- ==============================================================================
-- AUTOMATIC PROFILE CREATION TRIGGER (auth.users -> public.profiles)
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, username, avatar_id, level, xp, coins, lives, streak)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'username', 'Petualang Cilik'),
    'raka_classic',
    1,
    0,
    100,
    3,
    1
  );

  -- Berikan busana awal dan hewan sahabat perdana secara otomatis
  INSERT INTO public.user_items (user_id, item_id, is_equipped)
  VALUES 
    (new.id, 'topi-safari-klasik', true),
    (new.id, 'kostum-penjelajah-biru', true)
  ON CONFLICT DO NOTHING;

  INSERT INTO public.user_pets (user_id, pet_id, is_active)
  VALUES (new.id, 'lumi-fox', true)
  ON CONFLICT DO NOTHING;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Pasang trigger setelah insert pada auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
