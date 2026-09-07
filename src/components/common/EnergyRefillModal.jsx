import React, { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { useAudio } from '../../context/AudioContext';
import styles from './EnergyRefillModal.module.css';

export default function EnergyRefillModal() {
  const {
    energy = 3,
    maxEnergy = 5,
    coins = 0,
    isEnergyModalOpen,
    closeEnergyModal,
    refillEnergy,
    refillFullEnergy,
    exchangeCoinsForEnergy,
    showToast
  } = useGame();

  const { playSfx } = useAudio();

  // Navigation mode: 'options' | 'ad' | 'payment'
  const [mode, setMode] = useState('options');

  // Ad simulation states
  const [adCountdown, setAdCountdown] = useState(5);
  const [isAdFinished, setIsAdFinished] = useState(false);

  // Payment simulation states
  const [paymentMethod, setPaymentMethod] = useState('qris');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);

  // Reset internal states on open/close
  useEffect(() => {
    if (isEnergyModalOpen) {
      setMode('options');
      setAdCountdown(5);
      setIsAdFinished(false);
      setIsProcessingPayment(false);
      setIsPaymentSuccess(false);
    }
  }, [isEnergyModalOpen]);

  // Ad countdown timer effect
  useEffect(() => {
    let timer;
    if (mode === 'ad' && adCountdown > 0) {
      timer = setInterval(() => {
        setAdCountdown((prev) => {
          if (prev <= 1) {
            setIsAdFinished(true);
            if (playSfx) playSfx('achievement');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [mode, adCountdown, playSfx]);

  if (!isEnergyModalOpen) return null;

  const isFullEnergy = energy >= maxEnergy;

  // Handle Ad Start
  function handleStartAd() {
    if (isFullEnergy) {
      showToast('Energimu sudah penuh! (5/5 ❤️)');
      return;
    }
    if (playSfx) playSfx('button-click');
    setAdCountdown(5);
    setIsAdFinished(false);
    setMode('ad');
  }

  // Handle Claim Ad Reward
  function handleClaimAdReward() {
    refillEnergy(1);
    setMode('options');
  }

  // Handle Coin Exchange
  function handleExchangeCoins() {
    if (isFullEnergy) {
      showToast('Energimu sudah penuh! (5/5 ❤️)');
      return;
    }
    if (coins < 50) {
      showToast('Kristal/Koin belum cukup (minimal 50 koin)!');
      return;
    }
    exchangeCoinsForEnergy(50, 2);
  }

  // Handle Open Payment View
  function handleOpenPayment() {
    if (isFullEnergy) {
      showToast('Energimu sudah penuh! (5/5 ❤️)');
      return;
    }
    if (playSfx) playSfx('button-click');
    setIsProcessingPayment(false);
    setIsPaymentSuccess(false);
    setMode('payment');
  }

  // Handle Simulate Confirm Payment
  function handleConfirmPayment() {
    if (playSfx) playSfx('button-click');
    setIsProcessingPayment(true);

    setTimeout(() => {
      setIsProcessingPayment(false);
      setIsPaymentSuccess(true);
      refillFullEnergy();
    }, 1200);
  }

  return (
    <div className={styles.modalOverlay} onClick={closeEnergyModal}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className={styles.modalHeader}>
          <div className={styles.titleGroup}>
            <span className={`material-symbols-outlined ${styles.headerHeart}`}>
              favorite
            </span>
            <h3 className={styles.modalTitle}>
              {mode === 'ad'
                ? 'Sponsor Edukasi'
                : mode === 'payment'
                ? 'Pembayaran Nyawa Penuh'
                : 'Isi Ulang Energi Petualang'}
            </h3>
          </div>
          <button
            type="button"
            onClick={closeEnergyModal}
            className={styles.closeBtn}
            title="Tutup"
          >
            <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>close</span>
          </button>
        </div>

        {/* Modal Body: OPTIONS VIEW */}
        {mode === 'options' && (
          <div className={styles.modalBody}>
            {/* Heart Vitals Visualizer */}
            <div className={styles.energyStatusBox}>
              <div className={styles.heartsTrack}>
                {[1, 2, 3, 4, 5].map((slot) => {
                  const isFilled = slot <= energy;
                  return (
                    <div
                      key={slot}
                      className={`${styles.heartSlot} ${isFilled ? styles.heartFilled : styles.heartEmpty}`}
                    >
                      <span className="material-symbols-outlined">
                        {isFilled ? 'favorite' : 'favorite_border'}
                      </span>
                    </div>
                  );
                })}
              </div>
              <div>
                <h4 className={styles.energyStatusText}>
                  {energy} dari {maxEnergy} Nyawa Tersedia
                </h4>
                <p className={styles.energySubText}>
                  {isFullEnergy
                    ? 'Energi petualangmu terisi penuh! Siap menjelajahi kepulauan.'
                    : 'Energi digunakan untuk menjelajahi kepulauan dan menjawab tantangan.'}
                </p>
              </div>
            </div>

            {/* 3 Refill Methods Stack */}
            <div className={styles.optionsList}>
              {/* Option 1: Watch Ad */}
              <div className={styles.optionCard}>
                <div className={styles.optionLeft}>
                  <div
                    className={styles.optionIconCircle}
                    style={{ backgroundColor: '#e0f2fe', color: '#0284c7' }}
                  >
                    <span className="material-symbols-outlined">smart_display</span>
                  </div>
                  <div className={styles.optionDetails}>
                    <span
                      className={styles.optionBadge}
                      style={{ backgroundColor: '#e0f2fe', color: '#0369a1' }}
                    >
                      Gratis • 5 Detik
                    </span>
                    <h5 className={styles.optionTitle}>Tonton Iklan Edukasi</h5>
                    <p className={styles.optionDesc}>
                      Dukung EduQuest dengan menonton video sponsor edukatif untuk +1 Nyawa.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleStartAd}
                  disabled={isFullEnergy}
                  className={`${styles.actionBtn} ${styles.adBtn} ${isFullEnergy ? styles.disabledBtn : ''}`}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                    play_arrow
                  </span>
                  <span>{isFullEnergy ? 'Penuh' : '+1 ❤️ Gratis'}</span>
                </button>
              </div>

              {/* Option 2: Exchange Coins */}
              <div className={styles.optionCard}>
                <div className={styles.optionLeft}>
                  <div
                    className={styles.optionIconCircle}
                    style={{ backgroundColor: '#fef3c7', color: '#d97706' }}
                  >
                    <span className="material-symbols-outlined">diamond</span>
                  </div>
                  <div className={styles.optionDetails}>
                    <span
                      className={styles.optionBadge}
                      style={{ backgroundColor: '#fef3c7', color: '#b45309' }}
                    >
                      Hemat • Saldo {coins} 💎
                    </span>
                    <h5 className={styles.optionTitle}>Tukar Kristal Ajaib</h5>
                    <p className={styles.optionDesc}>
                      Gunakan 50 kristal/koin dari misi harian untuk memulihkan +2 Nyawa.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleExchangeCoins}
                  disabled={isFullEnergy || coins < 50}
                  className={`${styles.actionBtn} ${styles.coinBtn} ${
                    isFullEnergy || coins < 50 ? styles.disabledBtn : ''
                  }`}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                    currency_exchange
                  </span>
                  <span>{isFullEnergy ? 'Penuh' : '50 💎 (+2 ❤️)'}</span>
                </button>
              </div>

              {/* Option 3: Direct Payment (5/5 Full Energy) */}
              <div className={`${styles.optionCard} ${styles.optionCardFeatured}`}>
                <div className={styles.optionLeft}>
                  <div
                    className={styles.optionIconCircle}
                    style={{ backgroundColor: '#fee2e2', color: '#ef4444' }}
                  >
                    <span className="material-symbols-outlined">bolt</span>
                  </div>
                  <div className={styles.optionDetails}>
                    <span
                      className={styles.optionBadge}
                      style={{ backgroundColor: '#fee2e2', color: '#b91c1c' }}
                    >
                      Paling Populer • Rp 5.000
                    </span>
                    <h5 className={styles.optionTitle}>Paket Pulih Penuh (5/5 ❤️)</h5>
                    <p className={styles.optionDesc}>
                      Isi penuh seluruh 5 nyawa petualang sekaligus untuk belajar tanpa henti.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleOpenPayment}
                  disabled={isFullEnergy}
                  className={`${styles.actionBtn} ${styles.payBtn} ${isFullEnergy ? styles.disabledBtn : ''}`}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>
                    shopping_bag
                  </span>
                  <span>{isFullEnergy ? 'Penuh' : 'Beli Rp 5.000'}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal Body: REWARDED AD VIEW */}
        {mode === 'ad' && (
          <div className={styles.modalBody}>
            <div className={styles.adPlayerCard}>
              <div className={styles.adTopRow}>
                <span className={styles.sponsorTag}>
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>verified</span>
                  <span>EduQuest Partner</span>
                </span>
                <span className={styles.timerPill}>
                  {adCountdown > 0 ? `⏱️ ${adCountdown} detik` : '✅ Selesai'}
                </span>
              </div>

              {/* Ad Visual Mockup */}
              <div className={styles.adScreenGraphic}>
                <div className={styles.adIllustration}>🤖</div>
                <h4 className={styles.adMainTitle}>
                  RoboScience Cilik Nusantara
                </h4>
                <p className={styles.adMainDesc}>
                  Belajar eksperimen sains, logika matematika, dan eksplorasi galaksi bersama kit robotik anak Indonesia!
                </p>
              </div>

              {/* Progress Bar */}
              <div className={styles.adProgressBarTrack}>
                <div
                  className={styles.adProgressBarFill}
                  style={{ width: `${((5 - adCountdown) / 5) * 100}%` }}
                />
              </div>

              {/* Action */}
              {isAdFinished ? (
                <button
                  type="button"
                  onClick={handleClaimAdReward}
                  className={styles.claimAdBtn}
                >
                  <span className="material-symbols-outlined">celebration</span>
                  <span>Klaim Hadiah (+1 ❤️ Energi)</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setMode('options')}
                  className={styles.backBtn}
                  style={{ color: '#94a3b8' }}
                >
                  Batal Nonton (Hadiah Hangus)
                </button>
              )}
            </div>
          </div>
        )}

        {/* Modal Body: PAYMENT CHECKOUT VIEW */}
        {mode === 'payment' && (
          <div className={styles.modalBody}>
            {!isPaymentSuccess ? (
              <div className={styles.paymentCard}>
                {/* Summary */}
                <div className={styles.paymentSummaryBox}>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 800, color: '#0284c7', textTransform: 'uppercase' }}>
                      Item Pembelian
                    </span>
                    <h4 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: '2px 0 0' }}>
                      Paket Energi Penuh (5/5 ❤️)
                    </h4>
                  </div>
                  <span style={{ fontSize: '18px', fontWeight: 900, color: '#ef4444' }}>
                    Rp 5.000
                  </span>
                </div>

                {/* Method selector */}
                <div className={styles.methodSelector}>
                  <label style={{ fontSize: '12px', fontWeight: 800, color: '#475569' }}>
                    Pilih Metode Pembayaran:
                  </label>

                  <div
                    onClick={() => setPaymentMethod('qris')}
                    className={`${styles.methodOption} ${paymentMethod === 'qris' ? styles.methodOptionActive : ''}`}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="material-symbols-outlined" style={{ color: '#0284c7' }}>qr_code_scanner</span>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                        QRIS (BCA, Mandiri, GoPay, OVO, ShopeePay)
                      </span>
                    </div>
                    {paymentMethod === 'qris' && (
                      <span className="material-symbols-outlined" style={{ color: '#0284c7', fontSize: '18px' }}>
                        check_circle
                      </span>
                    )}
                  </div>

                  <div
                    onClick={() => setPaymentMethod('ewallet')}
                    className={`${styles.methodOption} ${paymentMethod === 'ewallet' ? styles.methodOptionActive : ''}`}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="material-symbols-outlined" style={{ color: '#10b981' }}>account_balance_wallet</span>
                      <span style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                        E-Wallet Instan (GoPay / DANA)
                      </span>
                    </div>
                    {paymentMethod === 'ewallet' && (
                      <span className="material-symbols-outlined" style={{ color: '#0284c7', fontSize: '18px' }}>
                        check_circle
                      </span>
                    )}
                  </div>
                </div>

                {/* QRIS Simulated Card */}
                {paymentMethod === 'qris' && (
                  <div className={styles.qrisBox}>
                    <div className={styles.qrPlaceholder}>
                      <span className="material-symbols-outlined" style={{ fontSize: '72px' }}>
                        qr_code_2
                      </span>
                    </div>
                    <span style={{ fontSize: '11.5px', color: '#64748b', fontWeight: 700 }}>
                      Pindai QRIS di atas dengan aplikasi pembayaran Anda
                    </span>
                  </div>
                )}

                {/* Confirm Button */}
                <button
                  type="button"
                  onClick={handleConfirmPayment}
                  disabled={isProcessingPayment}
                  className={styles.confirmPayBtn}
                >
                  {isProcessingPayment ? (
                    <span>Memproses Pembayaran... ⏳</span>
                  ) : (
                    <>
                      <span className="material-symbols-outlined">lock</span>
                      <span>Konfirmasi Bayar Rp 5.000</span>
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setMode('options')}
                  className={styles.backBtn}
                >
                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>arrow_back</span>
                  <span>Kembali ke Pilihan Lain</span>
                </button>
              </div>
            ) : (
              /* Payment Success Screen */
              <div style={{ textAlign: 'center', padding: '24px 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  backgroundColor: '#dcfce7',
                  color: '#16a34a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '36px',
                  boxShadow: '0 8px 20px rgba(22, 163, 74, 0.25)'
                }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '36px' }}>check</span>
                </div>
                <div>
                  <h4 style={{ fontSize: '18px', fontWeight: 900, color: '#0f172a', margin: 0 }}>
                    Pembayaran Berhasil! 🎉
                  </h4>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: '6px 0 0', lineHeight: 1.45 }}>
                    Energi petualangmu kini telah terisi penuh <strong>(5/5 ❤️)</strong>. Selamat melanjutkan petualangan di EduQuest!
                  </p>
                </div>
                <button
                  type="button"
                  onClick={closeEnergyModal}
                  className={styles.confirmPayBtn}
                  style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}
                >
                  <span>Lanjutkan Petualangan 🚀</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
