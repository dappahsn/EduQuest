# DESIGN.md — EduQuest Visual Design System

## 1. Brand Identity & Design Philosophy

**EduQuest** is an enchanting, tactile, and rewarding digital adventure playground designed for children aged 7–12.
* **Motto:** *"Belajar. Bermain. Menjadi Hebat."*
* **Core Philosophy:** EduQuest is an adventure game, not a dry Learning Management System (LMS). There are no corporate spreadsheets, no sterile white tables, and no clinical dashboards. The world itself is the user interface.
* **Aesthetic Blend:** **Tactile 3D Skeuomorphic** (chunky extruded pressable buttons, soft coin bevels, pill containers) meets **Modern Playful Minimalism** (generous whitespace, organic rounded silhouettes, vibrant gem-like tones, and crisp typography).

---

## 2. Color Palette & Design Tokens

EduQuest uses an ivory/cream base canvas paired with saturated adventure pigments inspired by fantasy maps and console games.

### 2.1 Color Tokens

| Token Name | Hex Code | Purpose / Semantic Role |
|---|---|---|
| `--color-canvas` | `#FDFBF7` | Warm Ivory page canvas (avoids glare of harsh `#FFFFFF`) |
| `--color-surface` | `#FAF8FF` | Soft tinted card and modal surface base |
| `--color-surface-cream` | `#F7F3EB` | Inset play areas, diorama backgrounds, recessed containers |
| `--color-surface-card` | `#FFFFFF` | Primary card background, active choice tiles |
| `--color-surface-dim` | `#D1D9FB` | Disabled states, recessed slot backings |
| `--color-surface-high` | `#E3E7FF` | Highlighted pill badges, active tab tracks |
| `--color-primary` | `#0284C7` | **Sky Portal Blue**: Primary exploration, navigation, active nodes |
| `--color-primary-container` | `#007BB9` | Active navigation pill, primary progress fills |
| `--color-primary-highlight` | `#38BDF8` | Energetic blue highlight, focused outlines |
| `--color-secondary` | `#10B981` | **Forest Emerald**: Correct answers, XP gain, health recovery |
| `--color-secondary-container` | `#6CF8BB` | Success banners, level-up card accents |
| `--color-secondary-dark` | `#047857` | 3D extruded shadow rim for green buttons |
| `--color-tertiary` | `#F97316` | **Adventure Coral / Tangerine**: Main CTA ("Mulai Petualangan") |
| `--color-tertiary-container` | `#C05400` | Urgency badges, streak flame backing |
| `--color-tertiary-dark` | `#783200` | 3D extruded shadow rim for tangerine buttons |
| `--color-gold` | `#F59E0B` | **Sun Gold**: Coins, streak medals, star ratings, prestige badges |
| `--color-gold-highlight` | `#FBBF24` | Shimmer effect, coin edges, floating XP icons |
| `--color-purple` | `#8B5CF6` | **Mythic Violet**: Rare collectibles, mystery chests, cosmic quests |
| `--color-ruby` | `#EF4444` | **Heart Ruby**: Player lives, heart counters |
| `--color-text-main` | `#1E2640` | Deep Navy text (pure `#000000` is strictly forbidden) |
| `--color-text-muted` | `#4B5563` | Subtitle text, secondary labels, level requirements |
| `--color-outline` | `#707881` | Inactive borders, locked icon fills |
| `--color-outline-subtle` | `#E2D9CC` | Warm card outlines, parchment dividers |

---

## 3. Typography

The entire application uses **Plus Jakarta Sans** for its friendly geometric bowls, open counters, and high legibility for young readers.

### 3.1 Type Scale & Roles

| Token | Size / Line-Height | Weight | Letter Spacing | Usage |
|---|---|---|---|---|
| `font-display-hero` | 48px / 56px | 800 (ExtraBold) | -0.02em | Welcome screen hero title (desktop) |
| `font-display-hero-mob` | 34px / 42px | 800 (ExtraBold) | -0.02em | Welcome screen hero title (mobile) |
| `font-headline-lg` | 32px / 40px | 800 (ExtraBold) | -0.015em | Quest victory banners ("MISI SELESAI!") |
| `font-headline-md` | 24px / 32px | 700 (Bold) | -0.01em | Region names, modal titles, pet names |
| `font-headline-sm` | 20px / 28px | 700 (Bold) | 0 | Sub-headers, challenge questions, quest titles |
| `font-body-lg` | 18px / 28px | 500 (Medium) | 0 | Story introductions, discovery facts |
| `font-body-md` | 16px / 24px | 500 (Medium) | 0 | Standard explanations, dialog bubbles |
| `font-body-sm` | 14px / 20px | 500 (Medium) | 0 | Item descriptions, badge hints, metadata |
| `font-label-lg` | 16px / 20px | 800 (ExtraBold) | +0.01em | Primary button labels ("Mulai Petualangan") |
| `font-label-md` | 14px / 18px | 700 (Bold) | +0.02em | Secondary buttons, tab switcher labels |
| `font-label-sm` | 12px / 16px | 700 (Bold) | +0.04em | Pill badges, navigation labels, level tags |
| `font-stat-num` | 20px / 24px | 800 (ExtraBold) | 0 | Coin counters, XP values, math numbers |

### 3.2 Child Readability & Localization Rules
* No wall of text: Paragraphs are limited to 2–3 sentences max.
* Indonesian Compound Words: Indonesian words (e.g., *Menjelajahi*, *Koleksimu*, *Petualangan*) can be lengthy; all containers must allow flex wrapping without text clipping.
* Font smoothing: `-webkit-font-smoothing: antialiased` across all text elements.

---

## 4. Spacing & Grid System

EduQuest utilizes an **8px base grid** (with a `4px` micro-unit for badge internals).

### 4.1 Spacing Scale

* `--space-xxs`: `0.25rem` (4px) — micro-spacing inside badge pills
* `--space-xs`: `0.5rem` (8px) — spacing between icons and text
* `--space-sm`: `0.75rem` (12px) — internal padding for chips and compact cards
* `--space-md`: `1.0rem` (16px) — standard gutter and card content padding
* `--space-lg`: `1.5rem` (24px) — section gaps, large button horizontal padding
* `--space-xl`: `2.0rem` (32px) — major screen section margins
* `--space-2xl`: `3.0rem` (48px) — hero top spacing, diorama clearances
* `--space-3xl`: `4.0rem` (64px) — desktop page margins

### 4.2 Touch Targets
Children develop motor skills at different rates. Interactive touch targets are strictly enforced:
* Minimum button height: `48px` on desktop, `56px` on mobile/tablet.
* Option cards in mini-games: Minimum `80px × 80px`.
* Quick action pills in HUD: Minimum `36px` height with generous padding.

---

## 5. Border Radius & Shapes

Sharp 90-degree corners are avoided entirely. All silhouettes are soft, welcoming, and toy-like.
* `--radius-sm`: `0.5rem` (8px) — inner image tags, mini badges
* `--radius-md`: `1.0rem` (16px) — compact dialogs, input fields
* `--radius-lg`: `1.5rem` (24px) — standard quest cards, inventory tiles
* `--radius-xl`: `2.0rem` (32px) — modal dialogs, diorama showcases, hero canvas
* `--radius-full`: `9999px` — buttons, pills, HUD containers, avatar frames

---

## 6. Depth, Shadows & Tactile 3D Mechanics

EduQuest emphasizes physical, pressable realism instead of flat digital planes.

### 6.1 Tactile 3D Extrusion (Bottom Offset)
Buttons and choice cards feature an extruded 3D bottom border or solid offset shadow:
* **Tangerine Primary:**
  `box-shadow: 0 4px 0 #783200, 0 10px 20px -2px rgba(153, 65, 0, 0.4);`
* **Sky Secondary:**
  `box-shadow: 0 4px 0 #004B73, 0 8px 16px -2px rgba(2, 132, 199, 0.35);`
* **Emerald Affirmative:**
  `box-shadow: 0 4px 0 #047857, 0 8px 16px -2px rgba(16, 185, 129, 0.35);`
* **Card Extrusion:**
  `border: 2px solid #E2D9CC; border-bottom: 5px solid #CBD5E1;`

### 6.2 Press Interaction State
When tapped/clicked:
* `transform: translateY(3px);`
* `box-shadow` depth reduces to `0 1px 0 ...`
* Gives the distinct satisfaction of pressing an arcade console button.

### 6.3 Ambient Play Shadows
Floating dialogs, HUD pills, and chests float over the world map with soft, tinted shadows:
* `box-shadow: 0 12px 28px -4px rgba(18, 26, 52, 0.12), 0 6px 12px -2px rgba(18, 26, 52, 0.08);`
* Never pure carbon black; shadows always incorporate a subtle navy tint (`rgba(18, 26, 52, ...)`).

---

## 7. Component Style Specifications

### 7.1 Floating Player HUD (`GameHeader`)
* Fixed top layer (`z-index: 50`) with safe-area padding.
* Frosted glass background: `background: rgba(250, 248, 255, 0.92); backdrop-filter: blur(16px);`
* Components:
  - Left: Logo + Player Avatar with Level Badge pill + Username ("Raka") + XP Progress bar.
  - Right: Lives pill (`favorite` red heart), Streak pill (`local_fire_department` flame), Coins pill (`diamond` golden gem).

### 7.2 Bottom Dock Navigation (`BottomNavDock`)
* Fixed bottom layer (`z-index: 50`) with bottom safe-area padding.
* Frosted glass capsule: `background: rgba(250, 248, 255, 0.95); backdrop-filter: blur(20px);`
* 5 Navigation tabs:
  1. `Dunia` (Icon: `public`) -> World Map
  2. `Misi` (Icon: `track_changes`) -> Quests & Daily Adventures
  3. `Koleksi` (Icon: `backpack`) -> Inventory & Equipment
  4. `Prestasi` (Icon: `emoji_events`) -> Badges & Achievements
  5. `Karakter` (Icon: `face`) -> Character Customizer & Pets
* Active state: High-contrast pill container (`bg-primary-container text-white`) with gentle lift.

### 7.3 World Map Canvas
* Full bleed canvas with scenic fantasy terrain background.
* Curved SVG paths connecting regions with dashed animated stroke (`stroke-dasharray="8 8"`).
* Interactive Region nodes:
  - Unlocked: Floating card with subject art, progress percentage, and glowing forward pulse.
  - Locked: Muted frosted glass card with padlock icon and Level requirement badge.

### 7.4 Mini-Game Option Cards
* Two-column grid layout for intuitive thumb reach.
* High-contrast stat numbers inside a rounded recessed coin slot.
* Interactive feedback:
  - Correct: Instant transition to emerald green (`#10B981`) + star icon badge ("Benar!") + bouncing confetti XP toast.
  - Incorrect: Soft encouraging rose feedback with a quick friendly shake animation and "Hampir! Coba lagi." (No harsh red X or failure sounds).

---

## 8. Responsive Design Strategy

* **Mobile (< 768px):** Primary focus layout. Single column adventure flow, sticky top HUD, sticky bottom navigation dock.
* **Tablet (768px – 1023px):** Expanded 8-column canvas. Central world map expands with wide scenic vistas; HUD expands to display daily quest shortcuts directly.
* **Desktop (1024px – 1440px+):** 12-column layout bound to a `1200px` max focal canvas.
  - Left Column: Pinned exploration sidebar and quick navigation.
  - Central Viewport: Dynamic interactive world map canvas and mini-game battle arena.
  - Right Column: Live companion pet diorama, active daily quest checklist, and live leaderboard status.
