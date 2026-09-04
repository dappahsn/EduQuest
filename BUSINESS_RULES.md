# BUSINESS_RULES.md — EduQuest Game Progression & Economy Rules

This document serves as the single source of truth for all mathematical formulas, game mechanics, and progression logic in EduQuest.

---

## 1. Experience Points (XP) & Level Progression

Progression in EduQuest is continuous, deterministic, and positive. A child never loses XP.

### 1.1 XP Yield per Activity

| Activity Type | Base XP Awarded | Bonus Conditions |
|---|---|---|
| Mini-Game Correct Answer | +50 XP | First attempt: +10 XP streak bonus |
| Mini-Game Completion (Full) | +120 XP | 100% Accuracy: +30 XP |
| Quest Completion | +150 XP | Unlocks next quest node |
| Daily Quest (Individual) | +100 XP | Completing all 3 unlocks Daily Chest (+250 XP) |
| Pet Feeding (Once Daily/Pet) | +10 XP | Increases Pet Happiness by +15% |
| First Quest of the Day | +50 XP | Daily kickoff bonus |

### 1.2 Level Progression Formula

Levels start at **Level 1** and scale progressively using a quadratic growth curve:

$$\text{XP Required for Level } L = 150 \times (L - 1) + 50 \times (L - 1)^2$$

* **Level 1:** 0 XP
* **Level 2:** 200 XP
* **Level 3:** 500 XP (300 XP delta)
* **Level 4:** 900 XP (400 XP delta)
* **Level 5:** 1,400 XP (500 XP delta)
* **Level 10:** 4,950 XP
* **Level 12:** 7,150 XP (Raka's default level in Stitch prototype)
* **Level 14:** 9,800 XP (Unlocks Gunung Teka-Teki)
* **Level 16:** 12,800 XP (Unlocks Angkasa Pengetahuan)

### 1.3 Level-Up Trigger
When `currentXP >= requiredXPForNextLevel`:
1. Increments `level` by +1.
2. Triggers `LevelUpCelebration` modal.
3. Automatically replenishes player Lives to maximum (3/3).
4. Evaluates item/region unlock thresholds.

---

## 2. Coin Economy & Spending

Coins (Koin Emas) are the soft currency earned purely through educational exploration. Real-money purchases are strictly prohibited.

### 2.1 Coin Inflow (Earning)
* Quest Completion: `+40 Koin`
* Daily Quest Individual: `+30 Koin`
* Daily Chest (All 3 daily quests completed): `+100 Koin`
* Achievement Unlock: `+50 Koin`

### 2.2 Coin Outflow (Wardrobe & Customization)
Items in the character customizer can be purchased with coins once their level requirement is satisfied:
* Common Hats / Accessories: `150 – 300 Koin`
* Rare Explorer Outfits: `400 – 600 Koin`
* Epic Backpacks: `700 – 1,000 Koin`

---

## 3. Daily Streaks (Rentetan Petualangan)

The streak system encourages a daily learning routine without punitive anxiety.

* **Tracking Window:** A calendar day in the user's local timezone (`00:00` to `23:59`).
* **Active Increment:** If the player completes at least 1 quest or mini-game today:
  - If last active day was yesterday: `streak = streak + 1`.
  - If last active day was today: No change (already preserved).
  - If last active day was 2+ days ago: `streak` resets to 1 (with an encouraging "Selamat datang kembali! Mari mulai rentetan baru!" message).

---

## 4. Lives (Nyawa Petualang) & Gentle Feedback

EduQuest never penalizes or shames young learners.

* **Default Capacity:** 3 Hearts (Nyawa).
* **Incorrect Answer Handling:**
  - When an answer is incorrect, the system outputs: `"Hampir! Coba lagi."`
  - A subtle hint is displayed.
  - Lives are **NOT** consumed on first-time mistakes during regular questing.
  - In timed/challenge arcade modes, a mistake consumes 1 Heart.
  - Reaching 0 Hearts never ends the session or blocks the child from learning; instead, Raka offers a friendly practice question or mini puzzle to instantly restore all 3 Hearts.

---

## 5. Quest Progression & Star Ratings

Each quest evaluates the player's performance upon completion:
* **3 Stars (⭐⭐⭐):** Completed with 0 mistakes.
* **2 Stars (⭐⭐):** Completed with 1–2 retries.
* **1 Star (⭐):** Completed with hints utilized.

Any star rating counts as a valid quest completion and unlocks the next node in the region. Children can replay any completed quest at any time to improve their star score and earn practice XP.

---

## 6. Region Gating & Unlock Requirements

| Region Name | Academic Subject | Required Level | Prerequisite Quest |
|---|---|---|---|
| **Lembah Angka** | Matematika & Geometri Ajaib | Level 1 | None (Starting Realm) |
| **Hutan Sains** | Sains, IPAS & Ekosistem Alam | Level 3 | Complete Lembah Angka Quest 1 |
| **Negeri Cerita** | Bahasa Indonesia & Literasi | Level 6 | Complete Hutan Sains Quest 1 |
| **Gunung Teka-Teki** | Logika, Roda Gigi & Komputasi | Level 14 | Complete Negeri Cerita Quest 3 |
| **Angkasa Pengetahuan**| Astronomi & Pengetahuan Umum | Level 16 | Complete Gunung Teka-Teki Quest 3 |
