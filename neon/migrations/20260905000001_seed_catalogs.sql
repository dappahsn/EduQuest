-- ==============================================================================
-- EDUQUEST SEED CATALOG MIGRATION FOR NEON POSTGRES
-- Educational Content Pre-seeding
-- ==============================================================================

-- 1. SEED REGIONS
INSERT INTO public.regions (id, name, subject, description, required_level, order_index, is_active, illustration_url)
VALUES
  ('lembah-angka', 'Lembah Angka', 'Matematika', 'Jelajahi jembatan perkalian, teka-teki pecahan, dan geometri ajaib.', 1, 1, true, 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80'),
  ('hutan-sains', 'Hutan Sains', 'Sains', 'Temukan misteri fotosintesis, rantai makanan, dan keanekaragaman hayati.', 3, 2, true, 'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=600&q=80'),
  ('negeri-cerita', 'Negeri Cerita', 'Bahasa', 'Rangkai kalimat indah, temukan dongeng nusantara, dan perkaya kosakata.', 6, 3, true, 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&w=600&q=80'),
  ('gunung-teka-teki', 'Gunung Teka-Teki', 'Logika', 'Benteng pemikiran komputasional, roda gigi logika, dan algoritma cerdas.', 14, 4, true, 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=600&q=80'),
  ('angkasa-pengetahuan', 'Angkasa Pengetahuan', 'Umum', 'Terbang menuju bintang, jelajahi tata surya, dan sains kosmik tanpa batas.', 16, 5, true, 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=600&q=80')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  subject = EXCLUDED.subject,
  description = EXCLUDED.description,
  required_level = EXCLUDED.required_level,
  order_index = EXCLUDED.order_index;

-- 2. SEED GAMES
INSERT INTO public.games (id, title, subject, difficulty, instructions, max_score)
VALUES
  ('number-catcher', 'Penangkap Angka', 'Matematika', 1, 'Bantu Raka melompati batu apung dengan memilih hasil operasi hitung yang tepat!', 100),
  ('pizza-lab', 'Laboratorium Pecahan', 'Matematika', 2, 'Bagi pizza menjadi potongan sama besar dan pilih bagian yang sesuai dengan target pecahan!', 100),
  ('solar-system', 'Penyusun Tata Surya', 'Sains', 2, 'Susun planet-planet ke dalam orbit yang benar berdasarkan jaraknya dari Matahari!', 100),
  ('robot-rescue', 'Penyelamat Robot', 'Logika', 3, 'Rangkai kartu perintah arah (ATAS, KANAN, BAWAH, KIRI) untuk memandu robot melintasi labirin!', 100),
  ('story-builder', 'Penyusun Cerita', 'Bahasa', 1, 'Susun kepingan kata menjadi kalimat bahasa Indonesia yang padu dan bermakna!', 100)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  subject = EXCLUDED.subject,
  instructions = EXCLUDED.instructions;

-- 3. SEED QUESTS
INSERT INTO public.quests (id, region_id, title, story_intro, discovery_id, game_id, xp_reward, coins_reward, order_index)
VALUES
  ('lembah-angka-01', 'lembah-angka', 'Jembatan Perkalian Kilat', 'Sungai Kristal meluap! Raka harus menginjak batu apung dengan angka yang tepat untuk menyeberang.', 'discovery-perkalian', 'number-catcher', 120, 40, 1),
  ('lembah-angka-02', 'lembah-angka', 'Teka-Teki Kue Pecahan', 'Koki Desa membutuhkan bantuan untuk membagi kue pesta secara adil kepada warga.', 'discovery-pecahan', 'pizza-lab', 150, 50, 2),
  ('hutan-sains-01', 'hutan-sains', 'Jejak Fotosintesis Rahasia', 'Pohon purba di tengah hutan membutuhkan tiga elemen penting untuk menghasilkan buah energi.', 'discovery-fotosintesis', 'number-catcher', 140, 45, 1),
  ('negeri-cerita-01', 'negeri-cerita', 'Kisah Burung Cendrawasih', 'Naskah kuno kerajaan tercerai-berai oleh angin topan. Bantu satukan kalimatnya kembali.', 'discovery-sintaksis', 'story-builder', 130, 40, 1),
  ('gunung-teka-teki-01', 'gunung-teka-teki', 'Misi Penyelamat Rover Cilik', 'Rover penjelajah terjebak di ceruk bebatuan. Program jalurnya menuju stasiun pengisian daya.', 'discovery-algoritma', 'robot-rescue', 200, 60, 1),
  ('angkasa-pengetahuan-01', 'angkasa-pengetahuan', 'Harmoni Orbit Tata Surya', 'Gravitasi kosmik terganggu! Susun kembali planet-planet pada orbit asalnya.', 'discovery-tata-surya', 'solar-system', 250, 80, 1)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  story_intro = EXCLUDED.story_intro,
  xp_reward = EXCLUDED.xp_reward,
  coins_reward = EXCLUDED.coins_reward;

-- 4. SEED ACHIEVEMENTS
INSERT INTO public.achievements (id, title, description, category, icon, xp_reward)
VALUES
  ('master-perkalian-kilat', 'Master Perkalian Kilat', 'Selesaikan 5 tantangan perkalian tanpa melakukan kesalahan.', 'angka', 'military_tech', 100),
  ('petualangan-perdana', 'Petualangan Perdana', 'Selesaikan quest pertamamu di dunia EduQuest.', 'eksplorasi', 'explore', 50),
  ('pakar-sains-cilik', 'Pakar Sains Cilik', 'Ungkap 3 penemuan konsep ilmiah di Hutan Sains.', 'sains', 'science', 80),
  ('ninja-angka-cepat', 'Ninja Angka Cepat', 'Jawab tantangan matematika dalam waktu kurang dari 10 detik.', 'angka', 'bolt', 75),
  ('sahabat-bintang', 'Sahabat Bintang', 'Pelihara hewan sahabatmu hingga mencapai tingkat kebahagiaan 100%.', 'spesial', 'stars', 90),
  ('penutur-kisah-handal', 'Penutur Kisah Handal', 'Susun 5 kalimat cerita tanpa petunjuk tambahan.', 'kata', 'auto_stories', 80)
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  description = EXCLUDED.description,
  icon = EXCLUDED.icon;

-- 5. SEED ITEMS (WARDROBE)
INSERT INTO public.items (id, name, category, rarity, icon_url, unlock_level, cost_coins)
VALUES
  ('topi-safari-klasik', 'Topi Safari Klasik', 'hat', 'common', 'explore', 1, 0),
  ('helm-astronot-cilik', 'Helm Astronot Cilik', 'hat', 'epic', 'rocket', 14, 500),
  ('baret-detektif-cilik', 'Baret Detektif Cilik', 'hat', 'rare', 'psychology', 6, 250),
  ('kostum-penjelajah-biru', 'Kostum Penjelajah Biru', 'outfit', 'common', 'checkroom', 1, 0),
  ('jubah-penyihir-sains', 'Jubah Penyihir Sains', 'outfit', 'epic', 'magic_button', 10, 600),
  ('tas-petualang-kulit', 'Tas Petualang Kulit', 'backpack', 'common', 'backpack', 1, 0),
  ('tas-jetpack-mini', 'Tas Jetpack Mini', 'backpack', 'legendary', 'flight', 16, 1000)
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  category = EXCLUDED.category,
  rarity = EXCLUDED.rarity,
  unlock_level = EXCLUDED.unlock_level,
  cost_coins = EXCLUDED.cost_coins;

-- 6. SEED PETS
INSERT INTO public.pets (id, name, species, description, unlock_level, habitat_image, avatar_image)
VALUES
  ('lumi-fox', 'Lumi si Rubah Pintar', 'Rubah Mistik', 'Sahabat setia dari Lembah Angka yang gemar membantumu memecahkan teka-teki.', 1, 'https://images.unsplash.com/photo-1516934024742-b461fba47600?auto=format&fit=crop&w=600&q=80', 'pets'),
  ('bubu-panda', 'Bubu si Panda Ceria', 'Panda Hutan', 'Panda ramah pencinta bambu yang selalu memberi semangat di Hutan Sains.', 3, 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef6?auto=format&fit=crop&w=600&q=80', 'cruelty_free'),
  ('koko-dino', 'Koko si Bayi Dino', 'Dinosaurus', 'Bayi dinosaurus kecil yang gemar menjelajahi batuan purba di Negeri Cerita.', 6, 'https://images.unsplash.com/photo-1570481662006-a3a1374699e8?auto=format&fit=crop&w=600&q=80', 'egg'),
  ('draco-dragon', 'Draco si Naga Biru', 'Naga Langit', 'Naga kecil penjaga kubah langit di Angkasa Pengetahuan.', 16, 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=600&q=80', 'auto_awesome')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name,
  species = EXCLUDED.species,
  description = EXCLUDED.description,
  unlock_level = EXCLUDED.unlock_level;

-- 7. SEED KNOWLEDGE CARDS
INSERT INTO public.knowledge_cards (id, title, category, facts, rarity, illustration_url)
VALUES
  ('card-bumi', 'Planet Bumi', 'Kosmik', ARRAY['Bumi adalah planet ketiga dari Matahari.', '71% permukaan Bumi tertutup air.', 'Memiliki satu satelit alami yaitu Bulan.'], 'common', 'public'),
  ('card-fotosintesis', 'Proses Fotosintesis', 'Sains', ARRAY['Tumbuhan membuat makanan dengan bantuan sinar matahari.', 'Menyerap karbon dioksida dan menghasilkan oksigen bersih.', 'Zat hijau daun disebut klorofil.'], 'rare', 'eco'),
  ('card-perkalian', 'Rahasia Perkalian', 'Matematika', ARRAY['Perkalian adalah penjumlahan berulang dari angka yang sama.', 'Contoh: 7 × 8 sama artinya dengan menjumlahkan angka 7 sebanyak 8 kali.', '7 × 8 menghasilkan 56.'], 'common', 'calculate')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  category = EXCLUDED.category,
  facts = EXCLUDED.facts;

-- 8. SEED DAILY QUESTS
INSERT INTO public.daily_quests (id, title, target_count, xp_reward, coins_reward, icon)
VALUES
  ('daily-math-01', 'Selesaikan 3 Tantangan Angka', 3, 100, 30, 'calculate'),
  ('daily-science-01', 'Jelajahi 1 Konsep Sains Baru', 1, 150, 40, 'science'),
  ('daily-pet-01', 'Beri Makan Hewan Sahabatmu', 1, 50, 20, 'pets')
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  target_count = EXCLUDED.target_count,
  xp_reward = EXCLUDED.xp_reward,
  coins_reward = EXCLUDED.coins_reward;
