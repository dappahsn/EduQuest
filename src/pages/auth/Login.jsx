import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import styles from './Auth.module.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { user, signInWithPassword, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/world';

  // Jika sudah login, langsung arahkan ke dunia
  useEffect(() => {
    if (user) {
      navigate(from, { replace: true });
    }
  }, [user, navigate, from]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      await signInWithPassword({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err.message || '';
      if (msg.includes('Invalid login credentials') || msg.includes('invalid_grant')) {
        setErrorMessage('Email atau kata sandi belum sesuai. Coba periksa lagi ya!');
      } else if (msg.includes('Email not confirmed')) {
        setErrorMessage('Email belum dikonfirmasi. Periksa kotak masuk emailmu!');
      } else {
        setErrorMessage('Oops! Ada sedikit kendala koneksi. Coba lagi ya!');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    setLoading(true);
    try {
      await signInWithGoogle();
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMessage('Gagal masuk dengan Google. Silakan coba kembali.');
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
        {/* Mascot Banner (Sesuai Karakter Stitch Raka) */}
        <div className={styles.mascotBanner}>
          <div className={styles.mascotAvatar}>
            <span className="material-symbols-outlined" style={{ fontSize: '26px', color: 'var(--color-primary)' }}>
              face
            </span>
            <span className={styles.mascotBadge}>
              <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>waving_hand</span>
            </span>
          </div>
          <div className={styles.mascotText}>
            <span className={styles.mascotName}>Raka Pemandu</span>
            <p className={styles.mascotSpeech}>
              “Senang bertemu lagi! Masuk untuk melanjutkan petualanganmu!”
            </p>
          </div>
        </div>

        <div className={styles.header}>
          <div className={styles.emblemBadge}>
            <span className="material-symbols-outlined" style={{ fontSize: '30px', color: 'var(--color-primary)' }}>
              account_circle
            </span>
          </div>
          <h1 className={styles.title}>Masuk Petualang</h1>
          <p className={styles.subtitle}>Masukkan akun petualangmu untuk membuka dunia game</p>
        </div>

        {errorMessage && (
          <div className={`${styles.errorBanner} animate-shake`}>
            <span className="material-symbols-outlined">info</span>
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label className={styles.label}>Kata Sandi</label>
              <Link to="/auth/forgot-password" className={styles.link} style={{ fontSize: '12px' }}>
                Lupa sandi?
              </Link>
            </div>
            <input
              type="password"
              required
              className={styles.input}
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
            />
          </div>

          <button type="submit" disabled={loading} className={styles.submitBtn}>
            <span className="material-symbols-outlined">login</span>
            <span>{loading ? 'Menghubungkan...' : 'Masuk Petualangan'}</span>
          </button>
        </form>

        <div className={styles.divider}>ATAU</div>

        <button type="button" onClick={handleGoogleSignIn} disabled={loading} className={styles.googleBtn}>
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
          <span>Masuk dengan Google</span>
        </button>

        <p className={styles.footerText}>
          Belum punya akun?{' '}
          <Link to="/auth/register" className={styles.link}>
            Daftar petualang baru
          </Link>
        </p>
      </div>
    </div>
  );
}
