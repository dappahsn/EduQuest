import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../context/LanguageContext';
import { LoginTravelerIllustration } from '../../components/auth/AuthIllustrations';
import DesktopAuthShowcase from '../../components/auth/DesktopAuthShowcase';
import GoogleSignInModal from '../../components/auth/GoogleSignInModal';
import styles from './Auth.module.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleModalLoading, setGoogleModalLoading] = useState(false);
  const { user, signInWithPassword, signInWithGoogle } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/world';

  const isId = language === 'id';

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
        setErrorMessage(isId ? 'Email atau kata sandi belum sesuai. Coba periksa lagi ya!' : 'Invalid email or password. Please check again.');
      } else if (msg.includes('Email not confirmed')) {
        setErrorMessage(isId ? 'Email belum dikonfirmasi. Periksa kotak masuk emailmu!' : 'Email not confirmed yet. Check your inbox.');
      } else {
        setErrorMessage(isId ? 'Ada sedikit kendala koneksi. Silakan coba lagi.' : 'Connection error. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    setLoading(true);
    try {
      const res = await signInWithGoogle();
      if (res?.requiresModal) {
        setLoading(false);
        setShowGoogleModal(true);
        return;
      }
      navigate(from, { replace: true });
    } catch (err) {
      const msg = err?.message || '';
      if (msg.includes('404')) {
        setShowGoogleModal(true);
      } else {
        setErrorMessage(
          msg ||
          (isId ? 'Gagal masuk dengan Google. Silakan coba kembali.' : 'Google sign in failed. Please try again.')
        );
      }
      setLoading(false);
    }
  };

  const handleGoogleModalConfirm = async ({ email: googleEmail, username: googleUsername }) => {
    setGoogleModalLoading(true);
    try {
      await signInWithGoogle({ email: googleEmail, username: googleUsername });
      setShowGoogleModal(false);
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMessage(err?.message || (isId ? 'Gagal masuk dengan akun Google.' : 'Failed to sign in with Google.'));
    } finally {
      setGoogleModalLoading(false);
    }
  };

  return (
    <div className={styles.authPageWrapper}>
      <div className={styles.authCard}>
        {/* Circular Floating Back Button */}
        <Link to="/" className={styles.circularBackBtn} aria-label={isId ? 'Kembali' : 'Back'}>
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
            arrow_back
          </span>
        </Link>

        {/* Desktop Left Showcase Panel (Visible on desktop >= 960px) */}
        <DesktopAuthShowcase
          badge={isId ? '🎒 SELAMAT DATANG KEMBALI' : '🎒 WELCOME BACK'}
          title={isId ? 'Lanjutkan Perjalanan Petualanganmu!' : 'Continue Your Great Journey!'}
          description={
            isId
              ? 'Masuk untuk membuka tiket perjalanan, memeriksa kemajuan quest harian, dan raih prestasi petualangan barumu.'
              : 'Sign in to access your travel tickets, check daily quest progress, and unlock new adventure achievements.'
          }
          features={[
            { icon: 'rocket_launch', text: isId ? 'Akses Cepat Dunia' : 'Fast World Access' },
            { icon: 'stars', text: isId ? 'Poin & Hadiah Harian' : 'Daily Rewards & XP' },
            { icon: 'shield', text: isId ? 'Akun Aman & Terlindungi' : 'Safe & Secure Profile' }
          ]}
        />

        {/* Mobile Vector Header Illustration (Visible on mobile < 960px) */}
        <div className={styles.illustrationContainer}>
          <img
            src="/images/auth-traveler.jpg"
            alt="Petualangan EduQuest"
            className={styles.mobileHeaderArtwork}
          />
        </div>

        {/* Form Body */}
        <div className={styles.formBody}>
          <div className={styles.titleBlock}>
            <h1 className={styles.titleLine1}>
              {isId ? 'Masuk untuk Mengakses' : 'Login to Access Your'}
            </h1>
            <h2 className={styles.titleLine2}>
              {isId ? 'Tiket Petualangan' : 'Travel Tickets'}
            </h2>
          </div>

          {errorMessage && (
            <div className={styles.errorBanner}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Email Pill Input */}
            <div className={styles.pillInputWrapper}>
              <span className={`material-symbols-outlined ${styles.inputIcon}`}>mail</span>
              <input
                type="email"
                required
                className={styles.pillInput}
                placeholder={isId ? 'Masukkan email Anda' : 'Enter your email'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            {/* Password Pill Input */}
            <div className={styles.pillInputWrapper}>
              <span className={`material-symbols-outlined ${styles.inputIcon}`}>lock</span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                className={styles.pillInput}
                placeholder={isId ? 'Masukkan kata sandi' : 'Enter your password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className={styles.eyeToggleBtn}
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Sembunyikan sandi' : 'Tampilkan sandi'}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  {showPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>

            {/* Remember Me & Forgot Password Row */}
            <div className={styles.optionsRow}>
              <label className={styles.rememberLabel}>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className={styles.rememberCheckbox}
                />
                <span>{isId ? 'Ingat saya' : 'Remember me'}</span>
              </label>

              <Link to="/auth/forgot-password" className={styles.forgotLink}>
                {isId ? 'Lupa sandi?' : 'Forgot password?'}
              </Link>
            </div>

            {/* Primary Dark Navy Submit Button */}
            <button type="submit" disabled={loading} className={styles.primaryPillBtn}>
              {loading ? (
                <span>{isId ? 'Memproses...' : 'Logging in...'}</span>
              ) : (
                <span>{isId ? 'Masuk' : 'Login'}</span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className={styles.dividerRow}>
            <div className={styles.dividerLine} />
            <span>{isId ? 'Atau masuk dengan' : 'Or login with'}</span>
            <div className={styles.dividerLine} />
          </div>

          {/* Social Buttons Row (Google) */}
          <div className={styles.socialButtonsRow}>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className={styles.socialPillBtn}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>{isId ? 'Masuk dengan Google' : 'Sign in with Google'}</span>
            </button>
          </div>

          {/* Footer Switch Account Link */}
          <p className={styles.footerText}>
            {isId ? 'Belum punya akun? ' : "Don't have an account? "}
            <Link to="/auth/register" className={styles.footerLink}>
              {isId ? 'Daftar sekarang' : 'Create an account'}
            </Link>
          </p>
        </div>
      </div>

      {/* Interactive Google Sign-In Dialog */}
      <GoogleSignInModal
        isOpen={showGoogleModal}
        onClose={() => setShowGoogleModal(false)}
        onConfirm={handleGoogleModalConfirm}
        loading={googleModalLoading}
        isId={isId}
      />
    </div>
  );
}
