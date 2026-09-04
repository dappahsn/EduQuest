import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../context/LanguageContext';
import { LoginTravelerIllustration } from '../../components/auth/AuthIllustrations';
import styles from './Auth.module.css';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
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
      await signInWithGoogle();
      navigate(from, { replace: true });
    } catch (err) {
      setErrorMessage(isId ? 'Gagal masuk dengan Google. Silakan coba kembali.' : 'Google sign in failed. Please try again.');
      setLoading(false);
    }
  };

  const handleFacebookSignIn = () => {
    // Facebook OAuth placeholder feedback
    alert(isId ? 'Fitur Facebook Login akan segera hadir!' : 'Facebook Login coming soon!');
  };

  return (
    <div className={styles.authPageWrapper}>
      <div className={styles.authCard}>
        {/* Circular Floating Back Button */}
        <Link to="/" className={styles.circularBackBtn} aria-label="Kembali">
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
            arrow_back
          </span>
        </Link>

        {/* Clean Vector Header Illustration */}
        <div className={styles.illustrationContainer}>
          <LoginTravelerIllustration />
        </div>

        {/* Form Body with Smooth Curved Overlap */}
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

          {/* Social Buttons Row (Google & Facebook) */}
          <div className={styles.socialButtonsRow}>
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              className={styles.socialPillBtn}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>Google</span>
            </button>

            <button
              type="button"
              onClick={handleFacebookSignIn}
              disabled={loading}
              className={styles.socialPillBtn}
            >
              <svg width="18" height="18" viewBox="0 0 24 24">
                <path fill="#1877F2" d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>Facebook</span>
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
    </div>
  );
}
