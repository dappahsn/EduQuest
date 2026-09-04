-- ==============================================================================
-- EDUQUEST SECURITY HARDENING & INTEGRITY MIGRATION
-- File: 20260904000002_security_hardening.sql
-- Objectives:
-- 1. Eliminate Direct XP, Coin & Level Manipulation on Profiles
-- 2. Restrict Direct Client Insertion on Items, Pets & Quest Progress
-- 3. Atomic Server-Side Stored Procedures (SECURITY DEFINER)
-- 4. User Data Isolation Enforcement (auth.uid() = user_id)
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. PREVENT DIRECT CLIENT ECONOMY TAMPERING ON PROFILES
-- ------------------------------------------------------------------------------

-- Fungsi trigger untuk mendeteksi apakah update dilakukan oleh client 'authenticated'
-- secara langsung terhadap kolom ekonomi (xp, coins, level, lives, streak)
CREATE OR REPLACE FUNCTION public.check_profile_economy_tampering()
RETURNS TRIGGER AS $$
BEGIN
    -- Jika dieksekusi oleh context authenticated client (bukan security definer internal atau service_role)
    IF (auth.role() = 'authenticated') AND (current_setting('eduquest.internal_op', true) IS NULL OR current_setting('eduquest.internal_op', true) != 'true') THEN
        -- Larang perubahan langsung pada xp, coins, level, lives, streak
        IF (NEW.xp IS DISTINCT FROM OLD.xp) OR
           (NEW.coins IS DISTINCT FROM OLD.coins) OR
           (NEW.level IS DISTINCT FROM OLD.level) OR
           (NEW.lives IS DISTINCT FROM OLD.lives) OR
           (NEW.streak IS DISTINCT FROM OLD.streak) THEN
            RAISE EXCEPTION 'Manipulasi langsung terhadap XP, koin, level, atau nyawa dilarang. Gunakan RPC resmi game.';
        END IF;
    END IF;

    NEW.updated_at := timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_protect_profile_economy ON public.profiles;
CREATE TRIGGER trg_protect_profile_economy
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.check_profile_economy_tampering();

-- ------------------------------------------------------------------------------
-- 2. TIGHTEN RLS POLICIES FOR USER OWNED ASSETS (ITEMS, PETS, QUESTS)
-- ------------------------------------------------------------------------------

-- Cabut policy broad "FOR ALL" yang memungkinkan client melakukan INSERT item/pet sembarang
DROP POLICY IF EXISTS "Users can manage own items" ON public.user_items;
DROP POLICY IF EXISTS "Users can manage own pets" ON public.user_pets;
DROP POLICY IF EXISTS "Users can insert own quest progress" ON public.quest_progress;
DROP POLICY IF EXISTS "Users can update own quest progress" ON public.quest_progress;

-- A. USER ITEMS: Hanya boleh SELECT miliknya, dan UPDATE is_equipped miliknya
CREATE POLICY "Users can update own item equip status"
    ON public.user_items FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- B. USER PETS: Hanya boleh SELECT miliknya, dan UPDATE status aktif/kebahagiaan
CREATE POLICY "Users can update own pet status"
    ON public.user_pets FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- C. QUEST PROGRESS: Client hanya diizinkan SELECT, modifikasi melalui RPC aman
-- (Policy "Users can view own quest progress" tetap aktif)

-- ------------------------------------------------------------------------------
-- 3. SECURE RPC: COMPLETE QUEST (ATOMIC & VALIDATED)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.complete_quest_secure(
    p_quest_id TEXT,
    p_score INTEGER,
    p_stars INTEGER,
    p_dropped_card_id TEXT DEFAULT NULL
)
RETURNS JSONB AS $$
DECLARE
    v_user_id UUID;
    v_quest RECORD;
    v_profile RECORD;
    v_region RECORD;
    v_is_first_time BOOLEAN;
    v_awarded_xp INTEGER;
    v_awarded_coins INTEGER;
    v_new_xp INTEGER;
    v_new_coins INTEGER;
    v_new_level INTEGER;
    v_level_up BOOLEAN := false;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Akses ditolak: pengguna belum diautentikasi.';
    END IF;

    -- Validasi skor & bintang
    IF p_score < 0 OR p_score > 100 THEN
        RAISE EXCEPTION 'Skor tidak valid: harus antara 0 dan 100.';
    END IF;

    IF p_stars < 1 OR p_stars > 3 THEN
        RAISE EXCEPTION 'Jumlah bintang tidak valid: harus antara 1 dan 3.';
    END IF;

    -- Ambil data quest resmi dari katalog
    SELECT * INTO v_quest FROM public.quests WHERE id = p_quest_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Misi tidak ditemukan dalam katalog resmi: %', p_quest_id;
    END IF;

    -- Ambil data profil pemain saat ini
    SELECT * INTO v_profile FROM public.profiles WHERE id = v_user_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Profil pengguna tidak ditemukan: %', v_user_id;
    END IF;

    -- Validasi level wilayah (mencegah pemain mengakses region terkunci)
    SELECT * INTO v_region FROM public.regions WHERE id = v_quest.region_id;
    IF FOUND AND v_profile.level < v_region.required_level THEN
        RAISE EXCEPTION 'Wilayah ini terkunci! Membutuhkan Level %, level Anda saat ini %', v_region.required_level, v_profile.level;
    END IF;

    -- Periksa apakah quest pertama kali atau replay
    SELECT NOT EXISTS (
        SELECT 1 FROM public.quest_progress 
        WHERE user_id = v_user_id AND quest_id = p_quest_id AND status = 'completed'
    ) INTO v_is_first_time;

    IF v_is_first_time THEN
        v_awarded_xp := v_quest.xp_reward;
        v_awarded_coins := v_quest.coins_reward;
    ELSE
        -- Hadiah latihan (anti-farming eksploitasi)
        v_awarded_xp := 20;
        v_awarded_coins := 5;
    END IF;

    v_new_xp := v_profile.xp + v_awarded_xp;
    v_new_coins := v_profile.coins + v_awarded_coins;

    -- Hitung formula level kuadratis: L(xp)
    -- xp threshold: L=1: 0, L=2: 200, L=3: 500, L=4: 900, L=5: 1400, dst.
    -- xp(L) = 150 * (L - 1) + 50 * (L - 1)^2
    v_new_level := v_profile.level;
    WHILE v_new_xp >= (150 * (v_new_level) + 50 * (v_new_level * v_new_level)) LOOP
        v_new_level := v_new_level + 1;
    END LOOP;

    IF v_new_level > v_profile.level THEN
        v_level_up := true;
    END IF;

    -- Set session variable untuk mengizinkan update oleh security definer
    PERFORM set_config('eduquest.internal_op', 'true', true);

    -- 1. Perbarui profil pemain
    UPDATE public.profiles
    SET 
        xp = v_new_xp,
        coins = v_new_coins,
        level = v_new_level,
        lives = CASE WHEN v_level_up THEN 3 ELSE lives END,
        updated_at = timezone('utc'::text, now())
    WHERE id = v_user_id;

    -- 2. Rekam progres quest
    INSERT INTO public.quest_progress (user_id, quest_id, status, score, stars, completed_at)
    VALUES (v_user_id, p_quest_id, 'completed', p_score, p_stars, timezone('utc'::text, now()))
    ON CONFLICT (user_id, quest_id) DO UPDATE
    SET 
        score = GREATEST(public.quest_progress.score, EXCLUDED.score),
        stars = GREATEST(public.quest_progress.stars, EXCLUDED.stars),
        completed_at = EXCLUDED.completed_at;

    -- 3. Jika ada kartu pengetahuan yang dihadiahkan
    IF p_dropped_card_id IS NOT NULL THEN
        INSERT INTO public.user_knowledge_cards (user_id, card_id, acquired_at)
        VALUES (v_user_id, p_dropped_card_id, timezone('utc'::text, now()))
        ON CONFLICT DO NOTHING;
    END IF;

    -- Reset session variable
    PERFORM set_config('eduquest.internal_op', 'false', true);

    RETURN jsonb_build_object(
        'success', true,
        'quest_id', p_quest_id,
        'is_first_time', v_is_first_time,
        'awarded_xp', v_awarded_xp,
        'awarded_coins', v_awarded_coins,
        'new_xp', v_new_xp,
        'new_coins', v_new_coins,
        'new_level', v_new_level,
        'level_up', v_level_up
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ------------------------------------------------------------------------------
-- 4. SECURE RPC: UNLOCK ITEM (PURCHASE WITH COIN & LEVEL CHECK)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.unlock_item_secure(
    p_item_id TEXT
)
RETURNS JSONB AS $$
DECLARE
    v_user_id UUID;
    v_item RECORD;
    v_profile RECORD;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Akses ditolak: pengguna belum diautentikasi.';
    END IF;

    -- Ambil item
    SELECT * INTO v_item FROM public.items WHERE id = p_item_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Item tidak ditemukan: %', p_item_id;
    END IF;

    -- Periksa apakah sudah dimiliki
    IF EXISTS (SELECT 1 FROM public.user_items WHERE user_id = v_user_id AND item_id = p_item_id) THEN
        RETURN jsonb_build_object('success', true, 'message', 'Item sudah dimiliki');
    END IF;

    -- Ambil profil
    SELECT * INTO v_profile FROM public.profiles WHERE id = v_user_id;

    -- Validasi level
    IF v_profile.level < v_item.unlock_level THEN
        RAISE EXCEPTION 'Level tidak mencukupi! Diperlukan Level %, level Anda %', v_item.unlock_level, v_profile.level;
    END IF;

    -- Validasi koin
    IF v_profile.coins < v_item.cost_coins THEN
        RAISE EXCEPTION 'Koin tidak mencukupi! Harga: % koin, saldo Anda: % koin', v_item.cost_coins, v_profile.coins;
    END IF;

    -- Operasi atomik
    PERFORM set_config('eduquest.internal_op', 'true', true);

    UPDATE public.profiles
    SET coins = coins - v_item.cost_coins
    WHERE id = v_user_id;

    INSERT INTO public.user_items (user_id, item_id, is_equipped)
    VALUES (v_user_id, p_item_id, false);

    PERFORM set_config('eduquest.internal_op', 'false', true);

    RETURN jsonb_build_object(
        'success', true,
        'item_id', p_item_id,
        'coins_spent', v_item.cost_coins,
        'remaining_coins', v_profile.coins - v_item.cost_coins
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ------------------------------------------------------------------------------
-- 5. SECURE RPC: UNLOCK PET (WITH LEVEL CHECK)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.unlock_pet_secure(
    p_pet_id TEXT
)
RETURNS JSONB AS $$
DECLARE
    v_user_id UUID;
    v_pet RECORD;
    v_profile RECORD;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Akses ditolak: pengguna belum diautentikasi.';
    END IF;

    SELECT * INTO v_pet FROM public.pets WHERE id = p_pet_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Pet tidak ditemukan: %', p_pet_id;
    END IF;

    IF EXISTS (SELECT 1 FROM public.user_pets WHERE user_id = v_user_id AND pet_id = p_pet_id) THEN
        RETURN jsonb_build_object('success', true, 'message', 'Hewan sahabat sudah dimiliki');
    END IF;

    SELECT * INTO v_profile FROM public.profiles WHERE id = v_user_id;

    IF v_profile.level < v_pet.unlock_level THEN
        RAISE EXCEPTION 'Level tidak mencukupi! Diperlukan Level %', v_pet.unlock_level;
    END IF;

    PERFORM set_config('eduquest.internal_op', 'true', true);

    INSERT INTO public.user_pets (user_id, pet_id, is_active)
    VALUES (v_user_id, p_pet_id, false);

    PERFORM set_config('eduquest.internal_op', 'false', true);

    RETURN jsonb_build_object(
        'success', true,
        'pet_id', p_pet_id
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ------------------------------------------------------------------------------
-- 6. SECURE RPC: CLAIM ACHIEVEMENT (IDEMPOTENT)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.claim_achievement_secure(
    p_achievement_id TEXT
)
RETURNS JSONB AS $$
DECLARE
    v_user_id UUID;
    v_ach RECORD;
    v_profile RECORD;
BEGIN
    v_user_id := auth.uid();
    IF v_user_id IS NULL THEN
        RAISE EXCEPTION 'Akses ditolak: pengguna belum diautentikasi.';
    END IF;

    -- Periksa apakah achievement valid
    SELECT * INTO v_ach FROM public.achievements WHERE id = p_achievement_id;
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Lencana prestasi tidak valid: %', p_achievement_id;
    END IF;

    -- Cek klaim ganda
    IF EXISTS (SELECT 1 FROM public.user_achievements WHERE user_id = v_user_id AND achievement_id = p_achievement_id) THEN
        RETURN jsonb_build_object('success', false, 'message', 'Lencana sudah pernah diklaim sebelumnya');
    END IF;

    PERFORM set_config('eduquest.internal_op', 'true', true);

    -- Tambah lencana
    INSERT INTO public.user_achievements (user_id, achievement_id, unlocked_at)
    VALUES (v_user_id, p_achievement_id, timezone('utc'::text, now()));

    -- Tambah XP
    UPDATE public.profiles
    SET xp = xp + v_ach.xp_reward
    WHERE id = v_user_id;

    PERFORM set_config('eduquest.internal_op', 'false', true);

    RETURN jsonb_build_object(
        'success', true,
        'achievement_id', p_achievement_id,
        'xp_reward', v_ach.xp_reward
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
