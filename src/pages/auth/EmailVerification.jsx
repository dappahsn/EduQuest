import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Auth.module.css';

export default function EmailVerification() {
  return (
    <div className={styles.authContainer}>
      <div className={styles.authCard} style={{ textAlign: 'center' }}>
        <span className="material-symbols-outlined" style={{ fontSize: '48px', color: 'var(--color-primary)' }}>
          mark_email_read
        </span>
        <h1 className={styles.title}>Cek Email Kamu</h1>
        <p className={styles.subtitle}>
          Kami telah mengirimkan tautan konfirmasi ke email yang kamu daftarkan.
          Klik tautan tersebut untuk mengaktifkan akun petualanganmu!
        </p>

        <div style={{ marginTop: 'var(--space-md)' }}>
          <Link to="/auth/login" className={styles.submitBtn}>
            Kembali ke Halaman Masuk
          </Link>
        </div>
      </div>
    </div>
  );
}
