import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../context/LanguageContext';
import { ForgotTravelerIllustration } from '../../components/auth/AuthIllustrations';
import DesktopAuthShowcase from '../../components/auth/DesktopAuthShowcase';
import styles from './Auth.module.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { resetPassword } = useAuth();
  const { language } = useLanguage();

  const isId = language === 'id';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      await resetPassword(email);
      setSubmitted(true);
    } catch (err) {
      setErrorMessage(
        isId
          ? 'Gagal mengirim tautan pemulihan. Pastikan email terdaftar.'
          : 'Failed to send recovery link. Please verify your email.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPageWrapper}>
      <div className={styles.authCard}>
        {/* Circular Floating Back Button */}
        <Link to="/auth/login" className={styles.circularBackBtn} aria-label={isId ? 'Kembali' : 'Back'}>
          <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>
            arrow_back
          </span>
        </Link>

        {/* Desktop Left Showcase Panel (Visible on desktop >= 960px) */}
        <DesktopAuthShowcase
          badge={isId ? '🛡️ PEMULIHAN AKSES' : '🛡️ ACCOUNT RECOVERY'}
          title={isId ? 'Akses Akunmu Selalu Terlindungi' : 'Your Account is Always Protected'}
          description={
            isId
              ? 'Jangan cemas petualang, kami siap membantu memulihkan akses ke seluruh pencapaian, koin emas, dan hewan sahabatmu!'
              : 'Don’t worry explorer, we will help restore access to all your badges, gold coins, and companion pets!'
          }
          features={[
            { icon: 'mark_email_read', text: isId ? 'Kirim Tautan Verifikasi' : 'Instant Email Link' },
            { icon: 'lock_reset', text: isId ? 'Sandi Baru Mudah' : 'Easy Password Reset' },
            { icon: 'verified_user', text: isId ? 'Proteksi Data Privasi' : 'Privacy Protection' }
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
              {isId ? 'Lupa Kata Sandi? Reset' : 'Forgot Password? Reset'}
            </h1>
            <h2 className={styles.titleLine2}>
              {isId ? 'Akses Akunmu di Sini' : 'Your Access Here'}
            </h2>
          </div>

          {submitted ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
              <div className={styles.successBox}>
                {isId
                  ? '✨ Tautan pemulihan kata sandi telah dikirim ke email terdaftar! Silakan periksa kotak masuk atau spam.'
                  : '✨ A password reset link has been sent to your email! Please check your inbox or spam.'}
              </div>
              <Link to="/auth/login" className={styles.primaryPillBtn} style={{ textDecoration: 'none' }}>
                <span>{isId ? 'Kembali ke Masuk' : 'Back to Login'}</span>
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              {errorMessage && (
                <div className={styles.errorBanner}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>error</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Email Input */}
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

              {/* Submit Button */}
              <button type="submit" disabled={loading} className={styles.primaryPillBtn}>
                {loading ? (
                  <span>{isId ? 'Mengirim...' : 'Submitting...'}</span>
                ) : (
                  <span>{isId ? 'Kirim Tautan' : 'Submit'}</span>
                )}
              </button>

              {/* Footer Back to Login */}
              <p className={styles.footerText}>
                {isId ? 'Ingat kata sandi? ' : 'Remember your password? '}
                <Link to="/auth/login" className={styles.footerLink}>
                  {isId ? 'Masuk' : 'Login'}
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

