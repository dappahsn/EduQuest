import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        backgroundColor: 'var(--color-canvas)',
        gap: 'var(--space-md)'
      }}>
        <div
          className="animate-spin"
          style={{
            width: '56px',
            height: '56px',
            borderRadius: 'var(--radius-full)',
            border: '5px solid var(--color-surface-dim)',
            borderTopColor: 'var(--color-primary)'
          }}
        />
        <p style={{
          fontSize: '16px',
          fontWeight: 700,
          color: 'var(--color-primary-deep)'
        }}>
          Menyiapkan petualangan...
        </p>
      </div>
    );
  }

  // Pengguna belum login dialihkan ke halaman login
  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return children;
}
