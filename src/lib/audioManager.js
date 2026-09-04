// EduQuest Centralized Audio Manager
// File-based .wav playback with BGM crossfading, SFX management, and persistence
// Singleton — imported and used via AudioContext provider

import { BGM, SFX } from './audioAssets';

const STORAGE_KEY = 'eduquest_audio_settings';
const CROSSFADE_MS = 500;

function loadSettings() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return {
        bgmEnabled: parsed.bgmEnabled !== false,
        sfxEnabled: parsed.sfxEnabled !== false,
        bgmVolume: typeof parsed.bgmVolume === 'number' ? parsed.bgmVolume : 0.3,
        sfxVolume: typeof parsed.sfxVolume === 'number' ? parsed.sfxVolume : 0.5,
      };
    }
  } catch (e) { /* ignore */ }
  return { bgmEnabled: true, sfxEnabled: true, bgmVolume: 0.3, sfxVolume: 0.5 };
}

function saveSettings(settings) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  } catch (e) { /* ignore */ }
}

class EduQuestAudioManager {
  constructor() {
    const s = loadSettings();
    this.bgmEnabled = s.bgmEnabled;
    this.sfxEnabled = s.sfxEnabled;
    this.bgmVolume = s.bgmVolume;
    this.sfxVolume = s.sfxVolume;

    // Current BGM state
    this.currentBgmKey = null;
    this.currentBgmAudio = null;
    this.fadingOutAudio = null;

    // SFX pool — reuse Audio objects per key to avoid GC churn
    this._sfxPool = {};

    // Subscriber pattern for React state sync
    this._listeners = new Set();

    // Track whether user has interacted (autoplay policy)
    this._unlocked = false;
    this._pendingBgmKey = null;

    if (typeof window !== 'undefined') {
      this._setupAutoplayUnlock();
    }
  }

  // ─── AUTOPLAY UNLOCK ───────────────────────────────────────────
  _setupAutoplayUnlock() {
    const unlock = () => {
      this._unlocked = true;
      // If there's a pending BGM from before interaction, start it now
      if (this._pendingBgmKey && this.bgmEnabled) {
        this._startBgm(this._pendingBgmKey);
        this._pendingBgmKey = null;
      }
      window.removeEventListener('click', unlock);
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('touchstart', unlock);
    };
    window.addEventListener('click', unlock, { once: false, capture: true });
    window.addEventListener('keydown', unlock, { once: false, capture: true });
    window.addEventListener('touchstart', unlock, { once: false, capture: true });
  }

  // ─── SUBSCRIBER PATTERN ────────────────────────────────────────
  subscribe(listener) {
    this._listeners.add(listener);
    listener(this._getState());
    return () => this._listeners.delete(listener);
  }

  _notify() {
    const state = this._getState();
    this._listeners.forEach(fn => {
      try { fn(state); } catch (e) { console.error(e); }
    });
  }

  _getState() {
    return {
      bgmEnabled: this.bgmEnabled,
      sfxEnabled: this.sfxEnabled,
      bgmVolume: this.bgmVolume,
      sfxVolume: this.sfxVolume,
      currentBgmKey: this.currentBgmKey,
    };
  }

  _persist() {
    saveSettings({
      bgmEnabled: this.bgmEnabled,
      sfxEnabled: this.sfxEnabled,
      bgmVolume: this.bgmVolume,
      sfxVolume: this.sfxVolume,
    });
  }

  // ─── BGM CONTROLS ──────────────────────────────────────────────

  /**
   * Play BGM by key. If already playing the same key, does nothing.
   * Crossfades from previous BGM to new one.
   */
  playBgm(key) {
    if (!key || !BGM[key]) return;

    // Same track already playing — no-op
    if (this.currentBgmKey === key && this.currentBgmAudio && !this.currentBgmAudio.paused) {
      return;
    }

    if (!this.bgmEnabled) {
      // Store intent so toggling BGM on will start this track
      this._pendingBgmKey = key;
      this.currentBgmKey = key;
      this._notify();
      return;
    }

    if (!this._unlocked) {
      this._pendingBgmKey = key;
      this.currentBgmKey = key;
      this._notify();
      return;
    }

    this._startBgm(key);
  }

  _startBgm(key) {
    const src = BGM[key];
    if (!src) return;

    // Crossfade out old BGM
    if (this.currentBgmAudio && !this.currentBgmAudio.paused) {
      this._fadeOut(this.currentBgmAudio);
    }

    // Create new audio element
    const audio = new Audio(src);
    audio.loop = true;
    audio.volume = 0; // Start silent for fade-in
    audio.preload = 'auto';

    this.currentBgmAudio = audio;
    this.currentBgmKey = key;

    const playPromise = audio.play();
    if (playPromise && playPromise.catch) {
      playPromise.catch(() => {
        // Autoplay blocked — queue it for unlock
        this._pendingBgmKey = key;
      });
    }

    // Fade in
    this._fadeIn(audio, this.bgmVolume);
    this._notify();
  }

  _fadeIn(audio, targetVolume, duration = CROSSFADE_MS) {
    if (!audio) return;
    const steps = 20;
    const stepTime = duration / steps;
    const volumeStep = targetVolume / steps;
    let currentStep = 0;

    const interval = setInterval(() => {
      currentStep++;
      const vol = Math.min(volumeStep * currentStep, targetVolume);
      try { audio.volume = vol; } catch (e) { /* element removed */ }
      if (currentStep >= steps) {
        clearInterval(interval);
      }
    }, stepTime);
  }

  _fadeOut(audio, duration = CROSSFADE_MS) {
    if (!audio) return;
    const startVolume = audio.volume;
    const steps = 20;
    const stepTime = duration / steps;
    const volumeStep = startVolume / steps;
    let currentStep = 0;

    this.fadingOutAudio = audio;

    const interval = setInterval(() => {
      currentStep++;
      const vol = Math.max(startVolume - volumeStep * currentStep, 0);
      try { audio.volume = vol; } catch (e) { /* element removed */ }
      if (currentStep >= steps) {
        clearInterval(interval);
        try {
          audio.pause();
          audio.currentTime = 0;
        } catch (e) { /* ignore */ }
        if (this.fadingOutAudio === audio) {
          this.fadingOutAudio = null;
        }
      }
    }, stepTime);
  }

  stopBgm() {
    if (this.currentBgmAudio) {
      this._fadeOut(this.currentBgmAudio);
      this.currentBgmAudio = null;
    }
    this.currentBgmKey = null;
    this._pendingBgmKey = null;
    this._notify();
  }

  pauseBgm() {
    if (this.currentBgmAudio && !this.currentBgmAudio.paused) {
      this.currentBgmAudio.pause();
    }
  }

  resumeBgm() {
    if (this.bgmEnabled && this.currentBgmAudio && this.currentBgmAudio.paused) {
      const p = this.currentBgmAudio.play();
      if (p && p.catch) p.catch(() => {});
    }
  }

  // ─── SFX CONTROLS ──────────────────────────────────────────────

  /**
   * Play a one-shot SFX by key. Non-blocking, overlapping is fine.
   */
  playSfx(key) {
    if (!this.sfxEnabled || !this._unlocked) return;
    const src = SFX[key];
    if (!src) return;

    // Create a fresh Audio per play so overlapping SFX works
    try {
      const audio = new Audio(src);
      audio.volume = this.sfxVolume;
      const p = audio.play();
      if (p && p.catch) p.catch(() => {});
      // Cleanup after playback
      audio.addEventListener('ended', () => {
        audio.src = '';
      }, { once: true });
    } catch (e) { /* ignore */ }
  }

  // ─── TOGGLE / VOLUME ──────────────────────────────────────────

  toggleBgm() {
    this.bgmEnabled = !this.bgmEnabled;
    this._persist();

    if (this.bgmEnabled) {
      // Resume or start pending
      if (this._pendingBgmKey) {
        this._startBgm(this._pendingBgmKey);
        this._pendingBgmKey = null;
      } else if (this.currentBgmKey) {
        this._startBgm(this.currentBgmKey);
      }
    } else {
      if (this.currentBgmAudio && !this.currentBgmAudio.paused) {
        this._fadeOut(this.currentBgmAudio);
        this.currentBgmAudio = null;
      }
    }

    this._notify();
    return this.bgmEnabled;
  }

  toggleSfx() {
    this.sfxEnabled = !this.sfxEnabled;
    this._persist();
    this._notify();
    return this.sfxEnabled;
  }

  setBgmVolume(vol) {
    this.bgmVolume = Math.max(0, Math.min(1, vol));
    if (this.currentBgmAudio) {
      try { this.currentBgmAudio.volume = this.bgmVolume; } catch (e) { /* ignore */ }
    }
    this._persist();
    this._notify();
  }

  setSfxVolume(vol) {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
    this._persist();
    this._notify();
  }

  // ─── CONVENIENCE GETTERS ──────────────────────────────────────
  getIsPlaying() {
    return this.bgmEnabled && this.currentBgmAudio && !this.currentBgmAudio.paused;
  }

  getIsBgmEnabled() {
    return this.bgmEnabled;
  }

  getIsSfxEnabled() {
    return this.sfxEnabled;
  }
}

// Singleton export
export const audioManager = new EduQuestAudioManager();
