import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import styles from './Auth.module.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    setLoading(true);

    try {
      await resetPassword(email);
      setSubmitted(true);
    } catch (err) {
      setErrorMessage('Gagal mengirim tautan pemulihan. Pastikan email terdaftar.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <Link to="/auth/login" className={styles.topBackBtn} aria-label="Kembali ke Masuk">
        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
        <span>Masuk</span>
      </Link>

      <div className={styles.authCard}>
        <div className={styles.header}>
          <div className={styles.emblemBadge}>
            <span className="material-symbols-outlined" style={{ fontSize: '30px', color: 'var(--color-gold)' }}>
              lock_reset
            </span>
          </div>
          <h1 className={styles.title}>Lupa Kata Sandi?</h1>
          <p className={styles.subtitle}>Masukkan email terdaftar untuk menerima tautan pemulihan sandi</p>
        </div>

        {submitted ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div className={styles.successBox}>
              ✨ Tautan pemulihan kata sandi telah dikirim ke email orang tuamu! Silakan periksa kotak masuk email.
            </div>
            <Link to="/auth/login" className={styles.submitBtn}>
              Kembali ke Halaman Masuk
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className={styles.form}>
            {errorMessage && (
              <div className={styles.errorBanner}>
                <span className="material-symbols-outlined">info</span>
                <span>{errorMessage}</span>
              </div>
            )}

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

            <button type="submit" disabled={loading} className={styles.submitBtn}>
              <span className="material-symbols-outlined">send</span>
              <span>{loading ? 'Mengirim...' : 'Kirim Tautan Pemulihan'}</span>
            </button>

            <p className={styles.footerText}>
              Ingat kata sandi?{' '}
              <Link to="/auth/login" className={styles.link}>
                Masuk di sini
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
