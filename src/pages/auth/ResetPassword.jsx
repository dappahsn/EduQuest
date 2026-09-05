import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useLanguage } from '../../context/LanguageContext';
import { ForgotTravelerIllustration } from '../../components/auth/AuthIllustrations';
import DesktopAuthShowcase from '../../components/auth/DesktopAuthShowcase';
import styles from './Auth.module.css';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const { updatePassword } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();

  const isId = language === 'id';

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
      await updatePassword(password);
      setSuccess(true);
      setTimeout(() => navigate('/world'), 2000);
    } catch (err) {
      setErrorMessage(err.message || (isId ? 'Gagal memperbarui kata sandi. Coba lagi.' : 'Failed to update password.'));
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
          badge={isId ? '🔑 KATA SANDI BARU' : '🔑 NEW PASSWORD'}
          title={isId ? 'Amankan Akun Petualangmu' : 'Secure Your Explorer Account'}
          description={
            isId
              ? 'Buat kata sandi baru yang kuat dan mudah diingat untuk melanjutkan petualangan di 5 kepulauan EduQuest.'
              : 'Create a strong and memorable new password to continue your adventures across EduQuest islands.'
          }
          features={[
            { icon: 'key', text: isId ? 'Enkripsi Kuat' : 'Strong Encryption' },
            { icon: 'check_circle', text: isId ? 'Akses Instan' : 'Instant Activation' },
            { icon: 'sports_esports', text: isId ? 'Siap Bermain Kembali' : 'Ready to Play' }
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
              {isId ? 'Atur Kata Sandi Baru' : 'Set New Password'}
            </h1>
            <h2 className={styles.titleLine2}>
              {isId ? 'Amankan Petualanganmu' : 'Secure Your Journey'}
            </h2>
          </div>

          {success ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '8px' }}>
              <div className={styles.successBox}>
                {isId
                  ? '🎉 Kata sandi berhasil diperbarui! Membuka gerbang dunia petualangan...'
                  : '🎉 Password updated successfully! Redirecting to the world...'}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className={styles.form}>
              {errorMessage && (
                <div className={styles.errorBanner}>
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>error</span>
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* New Password Input */}
              <div className={styles.pillInputWrapper}>
                <span className={`material-symbols-outlined ${styles.inputIcon}`}>lock</span>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  className={styles.pillInput}
                  placeholder={isId ? 'Kata sandi baru (min. 6 karakter)' : 'New password (min. 6 chars)'}
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

              {/* Confirm New Password Input */}
              <div className={styles.pillInputWrapper}>
                <span className={`material-symbols-outlined ${styles.inputIcon}`}>lock</span>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  minLength={6}
                  className={styles.pillInput}
                  placeholder={isId ? 'Ulangi kata sandi baru' : 'Confirm new password'}
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

              {/* Submit Button */}
              <button type="submit" disabled={loading} className={styles.primaryPillBtn}>
                {loading ? (
                  <span>{isId ? 'Menyimpan...' : 'Saving...'}</span>
                ) : (
                  <span>{isId ? 'Simpan Sandi Baru' : 'Save New Password'}</span>
                )}
              </button>

              {/* Footer Back to Login */}
              <p className={styles.footerText}>
                {isId ? 'Batal ubah kata sandi? ' : 'Cancel password change? '}
                <Link to="/auth/login" className={styles.footerLink}>
                  {isId ? 'Kembali ke Masuk' : 'Back to Login'}
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

