import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    // Tangkap kode auth / session hash dari URL
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        navigate('/world', { replace: true });
      } else {
        navigate('/auth/login', { replace: true });
      }
    }).catch(() => {
      navigate('/auth/login', { replace: true });
    });
  }, [navigate]);

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
          width: '48px',
          height: '48px',
          borderRadius: 'var(--radius-full)',
          border: '4px solid var(--color-surface-high)',
          borderTopColor: 'var(--color-primary)'
        }}
      />
      <p style={{ fontWeight: 700, color: 'var(--color-primary-deep)' }}>
        Menghubungkan akun petualangmu...
      </p>
    </div>
  );
}
