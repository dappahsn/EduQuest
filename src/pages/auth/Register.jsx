import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import styles from './Auth.module.css';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { user, signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/world', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      await signUp({ email, password, username });
      navigate('/world');
    } catch (err) {
      const msg = err.message || '';
      if (msg.includes('already registered') || msg.includes('User already registered')) {
        setErrorMessage('Email ini sudah terdaftar. Silakan masuk menggunakan akunmu!');
      } else if (msg.includes('Password should be at least')) {
        setErrorMessage('Kata sandi minimal 6 karakter agar akun petualangmu aman!');
      } else {
        setErrorMessage('Gagal mendaftar. Coba periksa koneksi atau gunakan email lain.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setErrorMessage('');
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate('/world', { replace: true });
    } catch (err) {
      setErrorMessage('Gagal mendaftar dengan Google. Coba lagi.');
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <Link to="/" className={styles.topBackBtn} aria-label="Kembali ke Beranda">
        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
        <span>Beranda</span>
      </Link>

      <div className={styles.authCard}>
        {/* Mascot Banner */}
        <div className={styles.mascotBanner}>
          <div className={styles.mascotAvatar}>
            <span className="material-symbols-outlined" style={{ fontSize: '26px', color: 'var(--color-secondary)' }}>
              celebration
            </span>
            <span className={styles.mascotBadge} style={{ backgroundColor: 'var(--color-primary)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>star</span>
            </span>
          </div>
          <div className={styles.mascotText}>
            <span className={styles.mascotName}>Raka Pemandu</span>
            <p className={styles.mascotSpeech}>
              “Selamat datang calon petualang hebat! Mari buat profil petualanganmu!”
            </p>
          </div>
        </div>

        <div className={styles.header}>
          <div className={styles.emblemBadge}>
            <span className="material-symbols-outlined" style={{ fontSize: '30px', color: 'var(--color-secondary)' }}>
              badge
            </span>
          </div>
          <h1 className={styles.title}>Daftar Akun Baru</h1>
          <p className={styles.subtitle}>Mulai perjalanan seru belajarmu di 5 Kepulauan EduQuest</p>
        </div>

        {errorMessage && (
          <div className={`${styles.errorBanner} animate-shake`}>
            <span className="material-symbols-outlined">info</span>
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label}>Nama Panggilan Petualang</label>
            <input
              type="text"
              required
              className={styles.input}
              placeholder="Contoh: Raka"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="nickname"
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Email Petualang / Orang Tua</label>
            <input
              type="email"
              required
              className={styles.input}
              placeholder="nama@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label}>Kata Sandi (Minimal 6 karakter)</label>
            <input
              type="password"
              required
              minLength={6}
              className={styles.input}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <button type="submit" disabled={loading} className={styles.submitBtn}>
            <span className="material-symbols-outlined">rocket_launch</span>
            <span>{loading ? 'Menyiapkan Petualangan...' : 'Mulai Petualangan 🚀'}</span>
          </button>
        </form>

        <div className={styles.divider}>ATAU</div>

        <button type="button" onClick={handleGoogleSignUp} disabled={loading} className={styles.googleBtn}>
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>Daftar dengan Google</span>
        </button>

        <p className={styles.footerText}>
          Sudah punya akun?{' '}
          <Link to="/auth/login" className={styles.link}>
            Masuk sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}
