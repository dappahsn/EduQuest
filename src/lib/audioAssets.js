// EduQuest Audio Assets Registry
// Maps logical audio keys to their .wav file imports
// All files are .wav format — DO NOT convert or rename extensions.

// ─── BACKGROUND MUSIC ────────────────────────────────────────────
import worldMapMusic from '../assets/audio/music/world-map.wav';

import numberValleyMusic from '../assets/audio/music/region/number-valley.wav';
import scienceForestMusic from '../assets/audio/music/region/science-forest.wav';
import storyLandMusic from '../assets/audio/music/region/story-land.wav';
import puzzleMountainMusic from '../assets/audio/music/region/puzzle-mountain.wav';
import knowledgeSpaceMusic from '../assets/audio/music/region/knowledge-space.wav';

import questMusic from '../assets/audio/music/gameplay/quest.wav';
import numberCatcherMusic from '../assets/audio/music/gameplay/number-catcher.wav';
import scienceExperimentMusic from '../assets/audio/music/gameplay/science-experiment.wav';
import puzzleChallengeMusic from '../assets/audio/music/gameplay/puzzle-challenge.wav';
import storyModeMusic from '../assets/audio/music/gameplay/story-mode.wav';

// ─── SOUND EFFECTS ───────────────────────────────────────────────
import buttonClickSfx from '../assets/audio/sfx/button-click.wav';
import buttonHoverSfx from '../assets/audio/sfx/button-hover.wav';
import coinSfx from '../assets/audio/sfx/coin.wav';
import correctSfx from '../assets/audio/sfx/correct.wav';
import wrongSfx from '../assets/audio/sfx/wrong.wav';
import hintSfx from '../assets/audio/sfx/hint.wav';
import itemUnlockSfx from '../assets/audio/sfx/item-unlock.wav';
import levelUpSfx from '../assets/audio/sfx/level-up.wav';
import menuOpenSfx from '../assets/audio/sfx/menu-open.wav';
import petUnlockSfx from '../assets/audio/sfx/pet-unlock.wav';
import questCompleteSfx from '../assets/audio/sfx/quest-complete.wav';
import regionUnlockSfx from '../assets/audio/sfx/region-unlock.wav';
import xpGainSfx from '../assets/audio/sfx/xp-gain.wav';
import achievementSfx from '../assets/audio/sfx/achievement.wav';

// ─── EXPORT MAPS ─────────────────────────────────────────────────

export const BGM = {
  // World Map
  'world-map': worldMapMusic,

  // Regions
  'number-valley': numberValleyMusic,
  'science-forest': scienceForestMusic,
  'story-land': storyLandMusic,
  'puzzle-mountain': puzzleMountainMusic,
  'knowledge-space': knowledgeSpaceMusic,

  // Gameplay
  'quest': questMusic,
  'number-catcher': numberCatcherMusic,
  'science-experiment': scienceExperimentMusic,
  'puzzle-challenge': puzzleChallengeMusic,
  'story-mode': storyModeMusic,
};

export const SFX = {
  'button-click': buttonClickSfx,
  'button-hover': buttonHoverSfx,
  'coin': coinSfx,
  'correct': correctSfx,
  'wrong': wrongSfx,
  'hint': hintSfx,
  'item-unlock': itemUnlockSfx,
  'level-up': levelUpSfx,
  'menu-open': menuOpenSfx,
  'pet-unlock': petUnlockSfx,
  'quest-complete': questCompleteSfx,
  'region-unlock': regionUnlockSfx,
  'xp-gain': xpGainSfx,
  'achievement': achievementSfx,
};

// Route → BGM key mapping for automatic route-based BGM switching
export const ROUTE_BGM_MAP = {
  '/world': 'world-map',
  '/daily-quests': 'world-map',
  '/pets': 'world-map',
  '/achievements': 'world-map',
  '/character': 'world-map',
  '/profile': 'world-map',
  '/settings': 'world-map',
};

// Region slug → BGM key mapping
export const REGION_BGM_MAP = {
  'number-valley': 'number-valley',
  'lembah-angka': 'number-valley',
  'science-forest': 'science-forest',
  'hutan-sains': 'science-forest',
  'story-land': 'story-land',
  'negeri-cerita': 'story-land',
  'puzzle-mountain': 'puzzle-mountain',
  'gunung-teka-teki': 'puzzle-mountain',
  'knowledge-space': 'knowledge-space',
  'ruang-pengetahuan': 'knowledge-space',
};

// Game ID → BGM key mapping
export const GAME_BGM_MAP = {
  'mini-nc': 'number-catcher',
  'number-catcher': 'number-catcher',
  'mini-pl': 'science-experiment',
  'pizza-lab': 'science-experiment',
  'mini-mt': 'puzzle-challenge',
  'magic-triangle': 'puzzle-challenge',
  'mini-ag': 'puzzle-challenge',
  'algebra-gate': 'puzzle-challenge',
  'mini-ss': 'puzzle-challenge',
  'solar-system': 'puzzle-challenge',
  'mini-gl': 'science-experiment',
  'gravity-lab': 'science-experiment',
  'mini-rr': 'puzzle-challenge',
  'robot-rescue': 'puzzle-challenge',
  'mini-sb': 'story-mode',
  'story-builder': 'story-mode',
};
