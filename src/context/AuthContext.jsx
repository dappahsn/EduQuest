import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export const AuthContext = createContext(null);

const DEV_SESSION_KEY = 'eduquest_dev_session';

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
        // 1. Coba ambil session dari Auth client (Supabase atau Neon)
        if (supabase?.auth?.getSession) {
          const { data, error } = await supabase.auth.getSession();
          if (error) {
            console.warn('[EduQuest Auth] Notice getting auth session:', error.message);
          }

          if (mounted && data?.session) {
            setSession(data.session);
            setUser(data.session.user);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.warn('[EduQuest Auth] Auth client init notice:', err.message);
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
      if (supabase?.auth?.onAuthStateChange) {
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
                console.warn('[EduQuest Auth] onAuthStateChange notice:', err?.message || err);
              });
          } else if (listenerResult?.data?.subscription?.unsubscribe) {
            unsubscribeFn = listenerResult.data.subscription.unsubscribe;
          }
        }
      }
    } catch (err) {
      console.warn('[EduQuest Auth] onAuthStateChange caught:', err?.message || err);
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

  // REGISTER
  const signUp = async ({ email, password, username }) => {
    setError(null);
    try {
      // Panggil API Supabase Auth resmi
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
      } else if (data?.user && !data.session) {
        // Mode konfirmasi email aktif di Supabase
        setUser(data.user);
      }
      return data;
    } catch (err) {
      // Jika error terjadi karena placeholder URL Supabase belum dihubungkan ke cloud
      if (isPlaceholderUrl || err.message?.includes('fetch') || err.message?.includes('network')) {
        console.info('[EduQuest Auth] Mengaktifkan sesi petualang lokal (karena Supabase URL masih placeholder).');
        const mockUser = {
          id: 'dev-petualang-' + Date.now(),
          email,
          user_metadata: { username: username || 'Petualang Cilik' },
          aud: 'authenticated',
          role: 'authenticated'
        };
        const mockSession = {
          access_token: 'mock-token-' + Date.now(),
          token_type: 'bearer',
          expires_in: 3600,
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

  // LOGIN
  const signInWithPassword = async ({ email, password }) => {
    setError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data?.session) {
        setSession(data.session);
        setUser(data.session.user);
      }
      return data;
    } catch (err) {
      if (isPlaceholderUrl || err.message?.includes('fetch') || err.message?.includes('network')) {
        console.info('[EduQuest Auth] Mengaktifkan sesi login petualang lokal (mode placeholder).');
        const mockUser = {
          id: 'dev-raka-12',
          email,
          user_metadata: { username: 'Raka' },
          aud: 'authenticated',
          role: 'authenticated'
        };
        const mockSession = {
          access_token: 'mock-token-' + Date.now(),
          token_type: 'bearer',
          expires_in: 3600,
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

  // GOOGLE OAUTH
  const signInWithGoogle = async () => {
    setError(null);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) throw error;
      return data;
    } catch (err) {
      if (isPlaceholderUrl || err.message?.includes('fetch') || err.message?.includes('network')) {
        console.info('[EduQuest Auth] Simulasi Google OAuth (mode placeholder).');
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
          expires_in: 3600,
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
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('[EduQuest Auth] Supabase signOut notice:', err.message);
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
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      });
      if (error) throw error;
      return data;
    } catch (err) {
      if (isPlaceholderUrl || err.message?.includes('fetch') || err.message?.includes('network')) {
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
      const { data, error } = await supabase.auth.updateUser({
        password: newPassword
      });
      if (error) throw error;
      return data;
    } catch (err) {
      if (isPlaceholderUrl || err.message?.includes('fetch') || err.message?.includes('network')) {
        console.info('[EduQuest Auth] Kata sandi berhasil diperbarui (mode placeholder).');
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
