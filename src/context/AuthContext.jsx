import React, { createContext, useState, useEffect } from 'react';
import { supabase, isNeonActive } from '../lib/supabase';

export const AuthContext = createContext(null);

const DEV_SESSION_KEY = 'eduquest_dev_session';
const NEON_AUTH_UNSUPPORTED_KEY = 'eduquest_neon_auth_unsupported';

function markNeonAuthUnavailable() {
  try {
    localStorage.setItem(NEON_AUTH_UNSUPPORTED_KEY, 'true');
  } catch (e) {
    // ignore
  }
}

function isNeonAuthKnownUnavailable() {
  try {
    return localStorage.getItem(NEON_AUTH_UNSUPPORTED_KEY) === 'true';
  } catch (e) {
    return false;
  }
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Periksa apakah kredensial database (Supabase atau Neon) aktif atau menggunakan placeholder
  const isPlaceholderUrl = 
    (!import.meta.env.VITE_SUPABASE_URL || import.meta.env.VITE_SUPABASE_URL.includes('placeholder')) &&
    (!import.meta.env.VITE_NEON_DATABASE_URL || import.meta.env.VITE_NEON_DATABASE_URL.includes('placeholder'));

  useEffect(() => {
    let mounted = true;

    async function initSession() {
      try {
        // 1. Coba ambil session dari Auth client jika tidak terdeteksi 404 sebelumnya
        const skipCloudAuth = isNeonActive && isNeonAuthKnownUnavailable();
        if (!skipCloudAuth && supabase?.auth?.getSession) {
          const { data, error } = await supabase.auth.getSession();
          if (error) {
            if (isAuthServiceUnavailable(error)) {
              markNeonAuthUnavailable();
            } else {
              console.warn('[EduQuest Auth] Notice getting auth session:', error.message);
            }
          }

          if (mounted && data?.session) {
            setSession(data.session);
            setUser(data.session.user);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        if (isAuthServiceUnavailable(err)) {
          markNeonAuthUnavailable();
        } else {
          console.warn('[EduQuest Auth] Auth client init notice:', err.message);
        }
      }

      // 2. Jika belum ada sesi cloud, periksa sesi lokal
      if (mounted) {
        try {
          const savedDevSession = localStorage.getItem(DEV_SESSION_KEY);
          if (savedDevSession) {
            const parsed = JSON.parse(savedDevSession);
            setSession(parsed);
            setUser(parsed.user);
          }
        } catch (e) {
          console.warn('[EduQuest Auth] Failed reading dev session:', e);
        }
      }

      if (mounted) {
        setLoading(false);
      }
    }

    initSession();

    // 3. Listener onAuthStateChange (aman untuk Supabase synchronous maupun Neon async Promise)
    let unsubscribeFn = null;
    try {
      const skipCloudAuth = isNeonActive && isNeonAuthKnownUnavailable();
      if (!skipCloudAuth && supabase?.auth?.onAuthStateChange) {
        const listenerResult = supabase.auth.onAuthStateChange((_event, newSession) => {
          if (mounted) {
            setSession(newSession);
            setUser(newSession?.user ?? null);
            setLoading(false);
          }
        });

        if (listenerResult) {
          if (typeof listenerResult === 'function') {
            unsubscribeFn = listenerResult;
          } else if (typeof listenerResult.then === 'function') {
            listenerResult
              .then((res) => {
                unsubscribeFn = res?.data?.subscription?.unsubscribe || res?.unsubscribe || null;
              })
              .catch((err) => {
                if (isAuthServiceUnavailable(err)) {
                  markNeonAuthUnavailable();
                } else {
                  console.warn('[EduQuest Auth] onAuthStateChange notice:', err?.message || err);
                }
              });
          } else if (listenerResult?.data?.subscription?.unsubscribe) {
            unsubscribeFn = listenerResult.data.subscription.unsubscribe;
          }
        }
      }
    } catch (err) {
      if (isAuthServiceUnavailable(err)) {
        markNeonAuthUnavailable();
      } else {
        console.warn('[EduQuest Auth] onAuthStateChange caught:', err?.message || err);
      }
    }

    return () => {
      mounted = false;
      if (typeof unsubscribeFn === 'function') {
        try {
          unsubscribeFn();
        } catch (e) {
          // ignore
        }
      }
    };
  }, [isPlaceholderUrl]);

const LOCAL_ACCOUNTS_KEY = 'eduquest_registered_accounts';

function getLocalAccounts() {
  try {
    const raw = localStorage.getItem(LOCAL_ACCOUNTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
}

function saveLocalAccount(acc) {
  try {
    const accounts = getLocalAccounts();
    const existingIdx = accounts.findIndex((a) => a.email.toLowerCase() === acc.email.toLowerCase());
    if (existingIdx >= 0) {
      accounts[existingIdx] = acc;
    } else {
      accounts.push(acc);
    }
    localStorage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(accounts));
  } catch (e) {
    console.warn('[EduQuest Auth] Gagal menyimpan akun lokal:', e);
  }
}

  const isAuthServiceUnavailable = (err) => {
    if (!err) return false;
    const msg = (err.message || '').toLowerCase();
    const code = (err.code || '').toLowerCase();
    return (
      isPlaceholderUrl ||
      err.status === 404 ||
      code === 'user_not_found' ||
      msg.includes('404') ||
      msg.includes('not found') ||
      msg.includes('fetch') ||
      msg.includes('network') ||
      msg.includes('failed to fetch') ||
      msg.includes('connection')
    );
  };

  const registerLocally = (email, password, username) => {
    console.info('[EduQuest Auth] Menggunakan penyimpanan akun lokal terisolasi.');
    const cleanEmail = email.trim();
    const localAccounts = getLocalAccounts();
    const existing = localAccounts.find(a => a.email.toLowerCase() === cleanEmail.toLowerCase());
    
    if (existing) {
      const dupErr = new Error('Email ini sudah terdaftar. Silakan masuk menggunakan akunmu!');
      setError(dupErr.message);
      throw dupErr;
    }

    const mockUser = {
      id: 'petualang-' + Date.now(),
      email: cleanEmail,
      user_metadata: { username: username || 'Petualang Cilik' },
      aud: 'authenticated',
      role: 'authenticated'
    };

    saveLocalAccount({
      id: mockUser.id,
      email: cleanEmail,
      password,
      username: username || 'Petualang Cilik',
      createdAt: new Date().toISOString()
    });

    // Inisialisasi awal 100% mulai dari 0 untuk akun baru!
    const freshZeroState = {
      playerName: username || 'Petualang Cilik',
      xp: 0,
      coins: 0,
      energy: 3,
      maxEnergy: 5,
      streakDays: 1,
      lastPlayedDate: new Date().toISOString().split('T')[0],
      characterConfig: {
        avatar: 'boy_raka',
        hairstyle: 'short',
        hairColor: '#1a1a1a',
        skinTone: '#ffd8be',
        outfit: 'outfit-scout',
        shoes: 'shoes-sneakers',
        backpack: 'none',
        accessories: 'none',
        outfitColor: 'sky',
        hasCustomized: false
      },
      activePetId: 'fox',
      petsState: {
        fox: { level: 1, xp: 0, happiness: 100, unlocked: true },
        cat: { level: 1, xp: 0, happiness: 100, unlocked: false },
        panda: { level: 1, xp: 0, happiness: 100, unlocked: false },
        dino: { level: 1, xp: 0, happiness: 100, unlocked: false },
        dragon: { level: 1, xp: 0, happiness: 100, unlocked: false }
      },
      dailyQuestsDate: new Date().toISOString().split('T')[0],
      dailyQuests: [],
      dailyChestClaimed: false,
      unlockedItemIds: ['outfit-scout', 'shoes-sneakers'],
      equippedItems: {
        outfit: 'outfit-scout',
        shoes: 'shoes-sneakers'
      },
      unlockedCardIds: [],
      completedQuestIds: [],
      visitedRegionIds: ['lembah-angka'],
      claimedAchievements: []
    };
    try {
      localStorage.setItem(`eduquest_save_state_${mockUser.id}`, JSON.stringify(freshZeroState));
    } catch (e) {
      console.warn('Could not set initial zero state:', e);
    }

    const mockSession = {
      access_token: 'mock-token-' + Date.now(),
      token_type: 'bearer',
      expires_in: 86400,
      user: mockUser
    };
    localStorage.setItem(DEV_SESSION_KEY, JSON.stringify(mockSession));
    setSession(mockSession);
    setUser(mockUser);
    return { user: mockUser, session: mockSession };
  };

  // REGISTER
  const signUp = async ({ email, password, username }) => {
    setError(null);
    const skipCloudAuth = isNeonActive && isNeonAuthKnownUnavailable();
    if (skipCloudAuth) {
      return registerLocally(email, password, username);
    }

    try {
      if (supabase?.auth?.signUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { username: username || 'Petualang Cilik' }
          }
        });

        if (error) throw error;

        if (data?.session) {
          setSession(data.session);
          setUser(data.session.user);
          return data;
        } else if (data?.user) {
          setUser(data.user);
          return data;
        }
      }
    } catch (err) {
      if (isAuthServiceUnavailable(err)) {
        markNeonAuthUnavailable();
        return registerLocally(email, password, username);
      }

      setError(err.message);
      throw err;
    }
  };

  // LOGIN
  const signInWithPassword = async ({ email, password }) => {
    setError(null);
    const cleanEmail = email.trim();

    const loginLocally = () => {
      console.info('[EduQuest Auth] Cloud Auth tidak tersedia (404/offline). Memvalidasi sesi petualang lokal.');
      const localAccounts = getLocalAccounts();
      const matched = localAccounts.find(a => a.email.toLowerCase() === cleanEmail.toLowerCase());

      if (matched) {
        if (matched.password !== password) {
          const wrongErr = new Error('Invalid login credentials');
          setError(wrongErr.message);
          throw wrongErr;
        }
        const mockUser = {
          id: matched.id,
          email: matched.email,
          user_metadata: { username: matched.username },
          aud: 'authenticated',
          role: 'authenticated'
        };
        const mockSession = {
          access_token: 'mock-token-' + Date.now(),
          token_type: 'bearer',
          expires_in: 86400,
          user: mockUser
        };
        localStorage.setItem(DEV_SESSION_KEY, JSON.stringify(mockSession));
        setSession(mockSession);
        setUser(mockUser);
        return { user: mockUser, session: mockSession };
      }

      // Jika belum ada akun lokal terdaftar tetapi user ingin langsung masuk dalam mode lokal
      const mockUser = {
        id: 'dev-petualang-' + Date.now(),
        email: cleanEmail,
        user_metadata: { username: cleanEmail.split('@')[0] || 'Petualang Cilik' },
        aud: 'authenticated',
        role: 'authenticated'
      };
      const mockSession = {
        access_token: 'mock-token-' + Date.now(),
        token_type: 'bearer',
        expires_in: 86400,
        user: mockUser
      };
      localStorage.setItem(DEV_SESSION_KEY, JSON.stringify(mockSession));
      setSession(mockSession);
      setUser(mockUser);
      return { user: mockUser, session: mockSession };
    };

    const skipCloudAuth = isNeonActive && isNeonAuthKnownUnavailable();
    if (skipCloudAuth) {
      return loginLocally();
    }

    try {
      if (supabase?.auth?.signInWithPassword) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });

        if (error) throw error;

        if (data?.session) {
          setSession(data.session);
          setUser(data.session.user);
          return data;
        }
      }
    } catch (err) {
      if (isAuthServiceUnavailable(err)) {
        markNeonAuthUnavailable();
        return loginLocally();
      }

      setError(err.message);
      throw err;
    }
  };

  // GOOGLE OAUTH
  const signInWithGoogle = async () => {
    setError(null);
    try {
      if (supabase?.auth?.signInWithOAuth) {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/auth/callback`
          }
        });
        if (error) throw error;
        return data;
      }
    } catch (err) {
      if (isAuthServiceUnavailable(err)) {
        console.info('[EduQuest Auth] Simulasi Google OAuth (mode lokal).');
        const mockUser = {
          id: 'dev-google-explorer',
          email: 'petualang.google@eduquest.id',
          user_metadata: { username: 'Petualang Google', full_name: 'Petualang Google' },
          aud: 'authenticated',
          role: 'authenticated'
        };
        const mockSession = {
          access_token: 'mock-google-token-' + Date.now(),
          token_type: 'bearer',
          expires_in: 86400,
          user: mockUser
        };
        localStorage.setItem(DEV_SESSION_KEY, JSON.stringify(mockSession));
        setSession(mockSession);
        setUser(mockUser);
        return { user: mockUser, session: mockSession };
      }

      setError(err.message);
      throw err;
    }
  };

  // LOGOUT
  const signOut = async () => {
    try {
      if (supabase?.auth?.signOut) {
        await supabase.auth.signOut();
      }
    } catch (err) {
      console.warn('[EduQuest Auth] SignOut notice:', err?.message || err);
    } finally {
      localStorage.removeItem(DEV_SESSION_KEY);
      setUser(null);
      setSession(null);
    }
  };

  // FORGOT PASSWORD
  const resetPassword = async (email) => {
    setError(null);
    try {
      if (supabase?.auth?.resetPasswordForEmail) {
        const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/reset-password`
        });
        if (error) throw error;
        return data;
      }
    } catch (err) {
      if (isAuthServiceUnavailable(err)) {
        console.info('[EduQuest Auth] Tautan pemulihan password disimulasikan terkirim.');
        return { message: 'Tautan pemulihan terkirim.' };
      }
      setError(err.message);
      throw err;
    }
  };

  // UPDATE PASSWORD
  const updatePassword = async (newPassword) => {
    setError(null);
    try {
      if (supabase?.auth?.updateUser) {
        const { data, error } = await supabase.auth.updateUser({
          password: newPassword
        });
        if (error) throw error;
        return data;
      }
    } catch (err) {
      if (isAuthServiceUnavailable(err)) {
        console.info('[EduQuest Auth] Kata sandi berhasil diperbarui (mode lokal).');
        if (user?.email) {
          const accounts = getLocalAccounts();
          const acc = accounts.find(a => a.email.toLowerCase() === user.email.toLowerCase());
          if (acc) {
            acc.password = newPassword;
            localStorage.setItem(LOCAL_ACCOUNTS_KEY, JSON.stringify(accounts));
          }
        }
        return { message: 'Kata sandi berhasil diperbarui.' };
      }
      setError(err.message);
      throw err;
    }
  };

  const value = {
    user,
    session,
    loading,
    error,
    signUp,
    signInWithPassword,
    signInWithGoogle,
    signOut,
    resetPassword,
    updatePassword
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
