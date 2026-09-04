import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { audioManager } from '../lib/audioManager';
import { ROUTE_BGM_MAP, REGION_BGM_MAP, GAME_BGM_MAP } from '../lib/audioAssets';

const AudioContext = createContext(null);

/**
 * AudioProvider — Wraps the app inside BrowserRouter.
 * Automatically switches BGM based on the current route.
 * Exposes playSfx, playBgm, toggleBgm, toggleSfx, and volume controls.
 */
export function AudioProvider({ children }) {
  const location = useLocation();
  const [audioState, setAudioState] = useState(() => audioManager._getState());
  const prevPathRef = useRef(location.pathname);

  // Subscribe to audioManager state changes
  useEffect(() => {
    return audioManager.subscribe((state) => {
      setAudioState(state);
    });
  }, []);

  // ─── Route-based BGM switching ─────────────────────────────
  useEffect(() => {
    const path = location.pathname;

    // 1. Check exact route match
    const exactBgm = ROUTE_BGM_MAP[path];
    if (exactBgm) {
      audioManager.playBgm(exactBgm);
      prevPathRef.current = path;
      return;
    }

    // 2. Check region routes: /world/:regionId
    const regionMatch = path.match(/^\/world\/([^/]+)$/);
    if (regionMatch) {
      const regionSlug = regionMatch[1];
      const regionBgm = REGION_BGM_MAP[regionSlug];
      if (regionBgm) {
        audioManager.playBgm(regionBgm);
      } else {
        // Fallback to world-map for unknown regions
        audioManager.playBgm('world-map');
      }
      prevPathRef.current = path;
      return;
    }

    // 3. Check game routes: /game/:gameId
    const gameMatch = path.match(/^\/game\/([^/]+)$/);
    if (gameMatch) {
      const gameId = gameMatch[1];
      const gameBgm = GAME_BGM_MAP[gameId];
      if (gameBgm) {
        audioManager.playBgm(gameBgm);
      } else {
        audioManager.playBgm('quest');
      }
      prevPathRef.current = path;
      return;
    }

    // 4. Quest routes: /quest/:questId — use quest music
    const questMatch = path.match(/^\/quest\/([^/]+)/);
    if (questMatch) {
      audioManager.playBgm('quest');
      prevPathRef.current = path;
      return;
    }

    // 5. Discovery routes: /discovery/:id — use quest music
    const discoveryMatch = path.match(/^\/discovery\/([^/]+)/);
    if (discoveryMatch) {
      audioManager.playBgm('quest');
      prevPathRef.current = path;
      return;
    }

    // 6. Auth routes and landing — no BGM change, stop if coming from game
    if (path.startsWith('/auth') || path === '/') {
      // Don't play BGM on auth/landing pages
      audioManager.stopBgm();
      prevPathRef.current = path;
      return;
    }

    // 7. Onboarding — world-map music
    if (path.startsWith('/onboarding')) {
      audioManager.playBgm('world-map');
      prevPathRef.current = path;
      return;
    }

    prevPathRef.current = path;
  }, [location.pathname]);

  // ─── Exposed API ───────────────────────────────────────────
  const playSfx = useCallback((key) => {
    audioManager.playSfx(key);
  }, []);

  const playBgm = useCallback((key) => {
    audioManager.playBgm(key);
  }, []);

  const stopBgm = useCallback(() => {
    audioManager.stopBgm();
  }, []);

  const toggleBgm = useCallback(() => {
    return audioManager.toggleBgm();
  }, []);

  const toggleSfx = useCallback(() => {
    return audioManager.toggleSfx();
  }, []);

  const setBgmVolume = useCallback((vol) => {
    audioManager.setBgmVolume(vol);
  }, []);

  const setSfxVolume = useCallback((vol) => {
    audioManager.setSfxVolume(vol);
  }, []);

  const value = {
    ...audioState,
    playSfx,
    playBgm,
    stopBgm,
    toggleBgm,
    toggleSfx,
    setBgmVolume,
    setSfxVolume,
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
}

/**
 * Hook to access the audio system from any component.
 * Returns a safe fallback if used outside AudioProvider.
 */
export function useAudio() {
  const context = useContext(AudioContext);
  if (!context) {
    // Safe fallback — direct audioManager calls
    return {
      bgmEnabled: audioManager.bgmEnabled,
      sfxEnabled: audioManager.sfxEnabled,
      bgmVolume: audioManager.bgmVolume,
      sfxVolume: audioManager.sfxVolume,
      currentBgmKey: audioManager.currentBgmKey,
      playSfx: (key) => audioManager.playSfx(key),
      playBgm: (key) => audioManager.playBgm(key),
      stopBgm: () => audioManager.stopBgm(),
      toggleBgm: () => audioManager.toggleBgm(),
      toggleSfx: () => audioManager.toggleSfx(),
      setBgmVolume: (v) => audioManager.setBgmVolume(v),
      setSfxVolume: (v) => audioManager.setSfxVolume(v),
    };
  }
  return context;
}
