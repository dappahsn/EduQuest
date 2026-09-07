import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../context/LanguageContext';
import { SignUpCloudsIllustration, LoginTravelerIllustration } from '../../components/auth/AuthIllustrations';
import DesktopAuthShowcase from '../../components/auth/DesktopAuthShowcase';
import GoogleSignInModal from '../../components/auth/GoogleSignInModal';
import styles from './Auth.module.css';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleModalLoading, setGoogleModalLoading] = useState(false);

  const { user, signUp, signInWithGoogle } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const isId = language === 'id';

  useEffect(() => {
    if (user) {
      navigate('/world', { replace: true });
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (password !== confirmPassword) {
      setErrorMessage(isId ? 'Konfirmasi kata sandi belum sama!' : 'Passwords do not match!');
      return;
    }

    if (password.length < 6) {
      setErrorMessage(isId ? 'Kata sandi minimal 6 karakter!' : 'Password must be at least 6 characters!');
      return;
    }

    setLoading(true);

    try {
      await signUp({ email, password, username });
      navigate('/world');
    } catch (err) {
      const msg = err.message || '';
      if (msg.includes('already registered') || msg.includes('User already registered') || msg.includes('sudah terdaftar')) {
        setErrorMessage(isId ? 'Email ini sudah terdaftar. Silakan masuk menggunakan akunmu!' : 'This email is already registered. Please login!');
      } else if (msg.includes('Password should be at least') || msg.includes('minimal 6')) {
        setErrorMessage(isId ? 'Kata sandi minimal 6 karakter agar akunmu aman!' : 'Password should be at least 6 characters!');
      } else {
        setErrorMessage(isId ? 'Gagal mendaftar. Coba periksa koneksi atau gunakan email lain.' : 'Registration failed. Please check connection or use another email.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignUp = async () => {
    setErrorMessage('');
    setLoading(true);
    try {
      const res = await signInWithGoogle();
      if (res?.requiresModal) {
        setLoading(false);
        setShowGoogleModal(true);
        return;
      }
      navigate('/world', { replace: true });
    } catch (err) {
      const msg = err?.message || '';
      if (msg.includes('404')) {
        setShowGoogleModal(true);
      } else {
        setErrorMessage(
          msg ||
          (isId ? 'Gagal mendaftar dengan Google. Silakan coba lagi.' : 'Google sign up failed. Please try again.')
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
      navigate('/world', { replace: true });
    } catch (err) {
      setErrorMessage(err?.message || (isId ? 'Gagal mendaftar dengan akun Google.' : 'Failed to register with Google.'));
    } finally {
      setGoogleModalLoading(false);
    }
  };

  return (
    <div className={styles.authPageWrapper}>
      <div className={styles.authCard}>
        {/* Floating Circular Back Button */}
        <Link to="/auth/login" className={styles.circularBackBtn} aria-label={isId ? 'Kembali' : 'Back'}>
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
            arrow_back
          </span>
        </Link>

        {/* Desktop Left Showcase Panel (Visible on desktop >= 960px) */}
        <DesktopAuthShowcase
          badge={isId ? '✨ PETUALANGAN EDUKASI' : '✨ EXPLORER PORTAL'}
          title={isId ? 'Mulai Petualangan Belajarmu!' : 'Sign Up to Start Your Journey!'}
          description={
            isId
              ? 'Jelajahi 5 kepulauan ajaib, selesaikan misi harian berhadiah koin emas, dan kustomisasi karakter petualang impianmu di EduQuest!'
              : 'Explore 5 magical islands, complete daily quests for gold coins, and customize your dream explorer character in EduQuest!'
          }
          features={[
            { icon: 'explore', text: isId ? '5 Kepulauan Unik' : '5 Adventure Worlds' },
            { icon: 'badge', text: isId ? 'Karakter & Profil Keren' : 'Unique Characters & Profile' },
            { icon: 'military_tech', text: isId ? 'Koleksi Lencana Emas' : 'Earn Gold Badges' }
          ]}
        />

        {/* Mobile Header Illustration (Visible on mobile < 960px) */}
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
              {isId ? 'Daftar untuk Menjelajah &' : 'Sign Up to Explore and'}
            </h1>
            <h2 className={styles.titleLine2}>
              {isId ? 'Mulai Petualangan' : 'Book Tickets'}
            </h2>
          </div>

          {errorMessage && (
            <div className={styles.errorBanner}>
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            {/* Username / Name Input */}
            <div className={styles.pillInputWrapper}>
              <span className={`material-symbols-outlined ${styles.inputIcon}`}>person</span>
              <input
                type="text"
                required
                className={styles.pillInput}
                placeholder={isId ? 'Masukkan nama panggilan' : 'Enter your name'}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="name"
              />
            </div>

            {/* Email Input */}
            <div className={styles.pillInputWrapper}>
              <span className={`material-symbols-outlined ${styles.inputIcon}`}>mail</span>
              <input
                type="email"
                required
                className={styles.pillInput}
                placeholder={isId ? 'Masukkan email Anda' : 'Enter your mail'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>

            {/* Password Input */}
            <div className={styles.pillInputWrapper}>
              <span className={`material-symbols-outlined ${styles.inputIcon}`}>lock</span>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                className={styles.pillInput}
                placeholder={isId ? 'Masukkan kata sandi' : 'Enter your password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
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

            {/* Confirm Password Input */}
            <div className={styles.pillInputWrapper}>
              <span className={`material-symbols-outlined ${styles.inputIcon}`}>lock</span>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                minLength={6}
                className={styles.pillInput}
                placeholder={isId ? 'Konfirmasi kata sandi' : 'Confirm Password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
              <button
                type="button"
                className={styles.eyeToggleBtn}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label={showConfirmPassword ? 'Sembunyikan konfirmasi sandi' : 'Tampilkan konfirmasi sandi'}
              >
                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                  {showConfirmPassword ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>

            {/* Remember Me Checkbox */}
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
            </div>

            {/* Dark Navy Primary Pill Button */}
            <button type="submit" disabled={loading} className={styles.primaryPillBtn}>
              {loading ? (
                <span>{isId ? 'Mendaftarkan...' : 'Signing Up...'}</span>
              ) : (
                <span>{isId ? 'Daftar Sekarang' : 'Sign Up'}</span>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className={styles.dividerRow}>
            <div className={styles.dividerLine} />
            <span>{isId ? 'Atau daftar dengan' : 'Or login with'}</span>
            <div className={styles.dividerLine} />
          </div>

          {/* Social Buttons Row (Google) */}
          <div className={styles.socialButtonsRow}>
            <button
              type="button"
              onClick={handleGoogleSignUp}
              disabled={loading}
              className={styles.socialPillBtn}
            >
              <svg width="20" height="20" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>{isId ? 'Daftar dengan Google' : 'Sign up with Google'}</span>
            </button>
          </div>

          {/* Footer Switch Account */}
          <p className={styles.footerText}>
            {isId ? 'Sudah memiliki akun? ' : 'Already have an account? '}
            <Link to="/auth/login" className={styles.footerLink}>
              {isId ? 'Masuk' : 'login'}
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

