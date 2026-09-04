# GAME_SYSTEM.md — EduQuest Game Engine & Mechanics Architecture

This document details the game system design, quest flow, discovery pedagogy, and the extensible mini-game architecture for EduQuest.

---

## 1. The Core Quest Loop

EduQuest replaces boring worksheets with an episodic adventure flow:

```text
[World Map]
    │  Selects an active region (e.g. Lembah Angka)
    ▼
[Region Quest Trail]
    │  Taps next quest landmark (e.g. "Jembatan Perkalian")
    ▼
[Story Briefing]
    │  Raka encounters a problem in the world
    ▼
[Discovery Phase]
    │  Interactive visual explanation of the educational concept
    ▼
[Mini-Game Challenge]
    │  Interactive gameplay resolving the challenge
    ▼
[Victory & Rewards]
    │  Stars, +XP, +Coins, unlocked items & level-up celebration
    ▼
[Return to World Map]
       Updated progress bar & next quest trail unlocked!
```

---

## 2. Discovery Layer (Educational Explanation)

EduQuest does **NOT** present long instructional text. Instead, concepts are explored through interactive, visual discovery widgets:

* **Interactive Elements:** Children tap, drag, or reveal parts of a diagram to understand the underlying logic.
* **Bite-Sized Facts:** Maximum 1–2 friendly sentences per discovery step.
* **Examples:**
  - *Matematika (Multiplication):* An interactive grid where tapping arrays of 7 dots 8 times groups them into a total of 56.
  - *Sains (Water Cycle):* Clickable animated clouds demonstrating Evaporasi -> Kondensasi -> Presipitasi.
  - *Bahasa (Sentence Syntax):* Color-coded draggable word tiles (Subjek = Biru, Predikat = Hijau, Objek = Oranye).

---

## 3. Mini-Game Architecture & Abstraction

To ensure modularity and ease of adding new educational subjects, mini-games are completely decoupled from UI layout and reward persistence.

### 3.1 Mini-Game Contract Interface

Every mini-game implements the following contract:

```javascript
/**
 * @typedef {Object} GameInterface
 * @property {string} gameId - Unique identifier (e.g. 'number-catcher')
 * @property {string} title - Display title (e.g. 'Penangkap Angka')
 * @property {string} subject - Subject domain ('Matematika', 'Sains', etc.)
 * @property {number} difficulty - 1 to 5
 * @property {Array} tasks - Dataset of challenge questions/rounds
 * @property {function} onScore - Callback when points are scored
 * @property {function} onComplete - Callback when game is completed with results
 */
```

### 3.2 GameHost Controller
`GameHost.jsx` serves as the runtime environment for mini-games:
1. Receives the `gameId` from the route (`/game/:gameId`).
2. Loads configuration and task pool from `src/data/games.js`.
3. Renders the universal HUD (Timer, Streak counter, Lives indicator, Pause button).
4. Dynamically mounts the appropriate game engine component.
5. Captures game results, calculates rewards, and transitions to `/quest/:questId/result`.

---

## 4. Playable Mini-Games Specification

### 4.1 Game 1: Number Catcher (Penangkap Angka)
* **Subject:** Matematika (Arithmetic & Multiplication)
* **Visual Theme:** A whimsical crystal river with mossy stepping stones and floating star gems.
* **Challenge:** Raka must cross the river by stepping on the stone with the correct answer.
* **Example Task:**
  - Question: `7 × 8 = ?`
  - Options: `42`, `48`, `56`, `64`
  - Correct Answer: `56`
* **Mechanics:**
  - Tapping stone `56` triggers an emerald star burst, celebratory sound, and Raka leaping forward.
  - Tapping an incorrect stone triggers a gentle wobble, friendly guidance ("Hampir! Coba lagi"), and hints.

### 4.2 Game 2: Pizza Lab (Laboratorium Pecahan)
* **Subject:** Matematika (Fractions)
* **Visual Theme:** A cozy woodland kitchen bakery.
* **Challenge:** The child visually cuts and selects slices of a freshly baked pizza to match a target fraction.
* **Example Task:**
  - Target: `3/4`
  - Interaction: Child uses a rotary cutter slider to divide the pizza into 4 slices, then taps 3 slices to serve them.
  - Visual Feedback: Selected slices glow golden, displaying the fraction label dynamically.

### 4.3 Game 3: Solar System Builder (Penyusun Tata Surya)
* **Subject:** Sains (Astronomy)
* **Visual Theme:** Deep cosmic space with twinkling nebulae.
* **Challenge:** Drag and drop orbiting planets into their correct astronomical order from the Sun.
* **Example Task:**
  - Items: Merkurius, Venus, Bumi, Mars, Yupiter, Saturnus, Uranus, Neptunus.
  - Completion: Once placed correctly, planetary orbits spin with vibrant particle trails and planetary facts unlock in the player's Knowledge Cards.

### 4.4 Game 4: Robot Rescue (Penyelamat Robot)
* **Subject:** Logika & Computational Thinking
* **Visual Theme:** A futuristic neon grid with obstacles and energy crystals.
* **Challenge:** Program a sequence of directional movement cards (`ATAS`, `KANAN`, `BAWAH`, `KIRI`) to guide a mini-robot to safety.
* **Interaction:** Child arranges sequence chips in a timeline dock and presses `"Jalankan Robot"`. The robot executes the moves step-by-step.

### 4.5 Game 5: Story Builder (Penyusun Cerita)
* **Subject:** Bahasa Indonesia & Literacy
* **Visual Theme:** An interactive fantasy parchment scroll.
* **Challenge:** Arrange scrambled words into grammatically coherent Indonesian sentences.
* **Example Task:**
  - Scrambled words: `[pergi] [Budi] [sekolah] [ke]`
  - Correct Arrangement: `"Budi pergi ke sekolah."`
  - Visual Feedback: Words lock together like jigsaw pieces with an audio read-aloud pronunciation.

---

## 5. Adaptive Difficulty

Each mini-game dynamically adapts to the player:
* **Confidence Streak:** Answering 3 consecutive questions on the first attempt without hints raises question complexity slightly.
* **Assistance Protocol:** If a child makes 2 consecutive unsuccessful attempts, the system automatically provides a visual hint (e.g. highlight or elimination of one wrong answer) without penalizing their score.
