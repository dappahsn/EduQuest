# COMPONENTS.md — EduQuest Reusable Component Library

This document specifies the core reusable UI and game components for EduQuest. All components follow the tactile skeuomorphic + playful minimalism aesthetic identified from Google Stitch.

---

## 1. Common UI Components

### 1.1 `TactileButton`
A chunky, 3D extruded arcade-style pressable button with solid bottom shadow rim, glossy reflection, and haptic translation on click.

* **File:** `src/components/common/TactileButton.jsx`
* **Props:**
  * `variant`: `'primary'` (Tangerine `#F97316`), `'secondary'` (Sky Blue `#0284C7`), `'success'` (Forest Emerald `#10B981`), `'neutral'` (Cream/White `#FFFFFF`), `'ghost'` (Transparent)
  * `size`: `'sm'` (36px), `'md'` (48px), `'lg'` (56px)
  * `icon`: Optional Material Symbols icon name or emoji string
  * `disabled`: Boolean
  * `onClick`: Function callback
  * `fullWidth`: Boolean
  * `children`: Button label text
* **Styling Features:**
  * Inner gloss reflection: `inset 0 1px 0 rgba(255, 255, 255, 0.35)`
  * Solid bottom extrusion: `box-shadow: 0 4px 0 [darker-rim-color]`
  * Active state: `transform: translateY(3px); box-shadow: 0 1px 0 ...`

### 1.2 `OptionCard`
Interactive multiple-choice option card used in mini-games and quiz challenges.

* **File:** `src/components/common/OptionCard.jsx`
* **Props:**
  * `label`: Option letter/identifier (e.g., `"Pilihan A"`)
  * `value`: Main displayed value or answer snippet
  * `selected`: Boolean
  * `status`: `'idle'` | `'correct'` | `'wrong'` | `'disabled'`
  * `onClick`: Function callback
* **States & Visuals:**
  * *Idle:* White/Cream background with subtle slate border and recessed circular stat coin slot.
  * *Correct:* Saturated Forest Emerald container with star badge ("Benar!") and celebratory micro-bounce.
  * *Wrong:* Warm soft rose container with friendly nudge and "Hampir!" feedback.

### 1.3 `PillProgressBar`
A capsule-shaped experience/progress indicator track with fluid gradient fill and glass reflection.

* **File:** `src/components/common/PillProgressBar.jsx`
* **Props:**
  * `current`: Current value (e.g. 150)
  * `max`: Maximum capacity value (e.g. 200)
  * `variant`: `'primary'` (Sky Blue), `'secondary'` (Emerald Mint), `'gold'` (Sun Yellow)
  * `size`: `'sm'` (8px), `'md'` (14px), `'lg'` (20px)
  * `showLabel`: Boolean (Displays "150 / 200 XP")

### 1.4 `ModalDialog`
Storybook modal overlay with frosted ambient backdrop, rounded-3xl geometry, and dismiss button.

* **File:** `src/components/common/ModalDialog.jsx`
* **Props:**
  * `isOpen`: Boolean
  * `onClose`: Function callback
  * `title`: Modal title string
  * `icon`: Optional header icon
  * `children`: Modal body content

### 1.5 `MascotSpeechBubble`
A playful speech bubble featuring Raka the explorer mascot peeking and delivering encouraging Indonesian guidance.

* **File:** `src/components/common/MascotSpeechBubble.jsx`
* **Props:**
  * `mascot`: Avatar image URL or mascot ID (defaults to Raka)
  * `tag`: Small role pill (e.g., `"Pemandu"`, `"Sahabat"`)
  * `message`: Child-friendly guidance text
  * `actionButton`: Optional inline button

### 1.6 `AudioTogglePill`
Floating pill that controls background adventure music and sound effects.

* **File:** `src/components/common/AudioTogglePill.jsx`
* **Behavior:**
  * Toggles audio state between `Musik ON` (volume_up icon) and `Musik OFF` (volume_off icon).
  * Automatically plays or pauses ambient background soundtrack.

---

## 2. Navigation Components

### 2.1 `GameHeader` (Floating Player HUD)
Fixed top header hovering over the viewport, displaying the player's live adventure status.

* **File:** `src/components/navigation/GameHeader.jsx`
* **Sub-elements:**
  * **Brand Emblem:** Small EduQuest emblem icon.
  * **Player Capsule:** Clickable avatar linking to `/profile` or `/character`, displaying level badge (`Lv. 12`), username (`Raka`), and mini XP bar (`2,450 XP`).
  * **Vitals Capsule Group:**
    - Lives Pill: Ruby heart icon + current lives counter (`3`).
    - Streak Pill: Tangerine flame icon + current streak counter (`7`).
    - Coins Pill: Blue gem or gold coin icon + balance counter (`840`).

### 2.2 `BottomNavDock`
Sticky bottom navigation dock optimized for mobile thumb accessibility and desktop footer anchoring.

* **File:** `src/components/navigation/BottomNavDock.jsx`
* **Navigation Targets:**
  * `Dunia` (`/world`) — World Map
  * `Misi` (`/daily-quests`) — Active Quests
  * `Koleksi` (`/collection`) — Items & Inventory
  * `Prestasi` (`/achievements`) — Badges Hall
  * `Karakter` (`/character`) — Dressing Room & Pets
* **Active State:** Raised pill with vibrant cyan background and white icon/label.

---

## 3. World & Quest Components

### 3.1 `WorldMapCanvas`
Interactive world map rendering the 5 thematic educational regions connected via an animated SVG dashed path.

* **File:** `src/components/world/WorldMapCanvas.jsx`
* **Features:**
  * Background fantasy landscape illustration.
  * Dynamic SVG path generator linking region coordinates.
  * Supports interactive region selection, zoom, and panning.

### 3.2 `RegionNode`
Visual landmark card on the world map representing an educational region.

* **File:** `src/components/world/RegionNode.jsx`
* **Props:**
  * `region`: Region data object (id, title, subject, requiredLevel, progressPercent, isLocked, illustrationUrl)
  * `onSelect`: Callback when clicked
* **Visual States:**
  * *Active/Unlocked:* Vibrant illustrated thumbnail, progress indicator bar, and "Masuk Wilayah" CTA.
  * *Locked:* Translucent frosted card with padlock badge and unlock level indicator (e.g., `Lock Lv. 14`).

### 3.3 `QuestCard`
Action card inside a region detailing a specific adventure activity.

* **File:** `src/components/quest/QuestCard.jsx`
* **Props:**
  * `quest`: Quest data (id, title, storySnippet, xpReward, coinsReward, completed, starRating)
  * `onStart`: Callback to initiate quest

---

## 4. Character & Pet Components

### 4.1 `CharacterStage`
Interactive 3D dressing room pedestal where the explorer avatar is previewed and customized.

* **File:** `src/components/character/CharacterStage.jsx`
* **Props:**
  * `equipped`: Object of equipped equipment IDs `{ hat, outfit, backpack, shoes }`
  * `onRotate`: Callbacks to spin character 90 degrees left/right
  * `onPose`: Callback to trigger celebratory jump animation

### 4.2 `PetDiorama`
Enchanting diorama showcase displaying the player's active companion pet in its native habitat.

* **File:** `src/components/pets/PetDiorama.jsx`
* **Props:**
  * `pet`: Pet data (id, name, species, level, happiness, habitatUrl, illustrationUrl)
  * `onFeed`: Callback to feed pet (+10 XP and happiness boost)
  * `onEquip`: Callback to set as active quest companion

---

## 5. Rewards & Gamification Components

### 5.1 `RewardChestModal`
Celebratory full-screen modal displayed upon quest or daily challenge completion.

* **File:** `src/components/rewards/RewardChestModal.jsx`
* **Features:**
  * Animated golden chest opening sequence.
  * Unlocked loot items carousel (Coins, XP, Badges, Gear).
  * Big tactile CTA: `"Buka Hadiah & Simpan 🎁"` and `"Kembali ke Peta Dunia 🌎"`.

### 5.2 `LevelUpCelebration`
Instant congratulatory overlay triggered when the player's accumulated XP crosses a level threshold.

* **File:** `src/components/rewards/LevelUpCelebration.jsx`
* **Features:**
  * Golden burst animation and banner (`"NAIK LEVEL!"`).
  * Displays previous level transitioning to new level (e.g., `Lv. 12 -> Lv. 13`).
  * Unlocks notification for newly available regions or wardrobe items.

### 5.3 `XpToast`
Micro-animation toast notification that floats up whenever XP is earned (`"✨ Hebat! +50 XP"`).

* **File:** `src/components/rewards/XpToast.jsx`
