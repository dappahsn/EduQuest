import React, { useState } from 'react';
import styles from './GoogleSignInModal.module.css';

export default function GoogleSignInModal({ isOpen, onClose, onConfirm, loading = false, isId = true }) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleEmailChange = (e) => {
    const val = e.target.value;
    setEmail(val);
    if (!username && val.includes('@')) {
      const suggested = val.split('@')[0].replace(/[._-]/g, ' ');
      const capitalized = suggested.charAt(0).toUpperCase() + suggested.slice(1);
      setUsername(capitalized);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes('@')) {
      setError(isId ? 'Mohon masukkan alamat email yang valid.' : 'Please enter a valid email address.');
      return;
    }

    const cleanName = username.trim() || cleanEmail.split('@')[0];
    onConfirm({ email: cleanEmail, username: cleanName });
  };

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Tutup">
          <span className="material-symbols-outlined">close</span>
        </button>

        {/* Google Header Icon */}
        <div className={styles.googleIconBadge}>
          <svg width="28" height="28" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
          </svg>
        </div>

        <h3 className={styles.modalTitle}>
          {isId ? 'Masuk dengan Akun Google' : 'Sign in with Google Account'}
        </h3>
        <p className={styles.modalSubtitle}>
          {isId
            ? 'Masukkan akun Google (Gmail) Anda untuk masuk ke petualangan EduQuest:'
            : 'Enter your Google (Gmail) account to enter EduQuest adventure:'}
        </p>

        {error && (
          <div className={styles.errorAlert}>
            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>error</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>
              {isId ? 'Alamat Email Google / Gmail' : 'Google Email Address'}
            </label>
            <div className={styles.inputWrapper}>
              <span className="material-symbols-outlined" style={{ color: '#64748b', fontSize: '20px' }}>mail</span>
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="nama.anda@gmail.com"
                required
                autoFocus
                className={styles.textInput}
              />
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.inputLabel}>
              {isId ? 'Nama Tampilan Petualang' : 'Explorer Display Name'}
            </label>
            <div className={styles.inputWrapper}>
              <span className="material-symbols-outlined" style={{ color: '#64748b', fontSize: '20px' }}>badge</span>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder={isId ? 'Contoh: Daffa' : 'Example: Alex'}
                className={styles.textInput}
              />
            </div>
          </div>

          <div className={styles.buttonRow}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelBtn}
              disabled={loading}
            >
              {isId ? 'Batal' : 'Cancel'}
            </button>
            <button
              type="submit"
              className={styles.submitBtn}
              disabled={loading || !email.trim()}
            >
              {loading ? (isId ? 'Memproses...' : 'Processing...') : (isId ? 'Lanjutkan Masuk' : 'Continue Sign In')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
