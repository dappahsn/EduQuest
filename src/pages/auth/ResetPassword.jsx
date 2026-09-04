import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import styles from './Auth.module.css';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [success, setSuccess] = useState(false);
  const { updatePassword } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    if (password !== confirmPassword) {
      setErrorMessage('Konfirmasi kata sandi belum sama!');
      return;
    }

    setLoading(true);

    try {
      await updatePassword(password);
      setSuccess(true);
      setTimeout(() => navigate('/world'), 2000);
    } catch (err) {
      setErrorMessage(err.message || 'Gagal memperbarui kata sandi. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard}>
        <div className={styles.header}>
          <div className={styles.emblemBadge}>
            <span className="material-symbols-outlined" style={{ fontSize: '30px', color: 'var(--color-primary)' }}>
              key
            </span>
          </div>
          <h1 className={styles.title}>Atur Sandi Baru</h1>
          <p className={styles.subtitle}>Masukkan kata sandi baru yang mudah diingat</p>
        </div>

        {success ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
            <div className={styles.successBox}>
              🎉 Kata sandi berhasil diperbarui! Sedang membuka gerbang dunia petualangan...
            </div>
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
              <label className={styles.label}>Kata Sandi Baru (Minimal 6 karakter)</label>
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

            <div className={styles.inputGroup}>
              <label className={styles.label}>Ulangi Kata Sandi Baru</label>
              <input
                type="password"
                required
                minLength={6}
                className={styles.input}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
              />
            </div>

            <button type="submit" disabled={loading} className={styles.submitBtn}>
              <span className="material-symbols-outlined">check_circle</span>
              <span>{loading ? 'Menyimpan...' : 'Simpan Sandi Baru'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
