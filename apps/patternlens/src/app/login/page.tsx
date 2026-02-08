// ============================================
// src/app/login/page.tsx
// PatternLens v4.0 - Login Page
// ============================================

'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

export default function LoginPage() {
  const router = useRouter();
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [message, setMessage] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Błąd logowania');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` }
      });
      if (error) throw error;
      setMessage('Sprawdź email, aby potwierdzić konto');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Błąd rejestracji');
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset`
      });
      if (error) throw error;
      setMessage('Sprawdź email, aby zresetować hasło');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Błąd');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google') => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    });
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="logo">
            <span className="logo-icon">🔍</span>
            <h1 className="gradient-text">PatternLens</h1>
          </div>
          <p className="text-secondary">Strukturalna analiza wzorców</p>
        </div>

        <div className="login-card glass-card">
          <div className="tabs">
            <button 
              className={`tab-btn ${mode === 'login' ? 'active' : ''}`}
              onClick={() => { setMode('login'); setError(null); setMessage(null); }}
            >
              Logowanie
            </button>
            <button 
              className={`tab-btn ${mode === 'register' ? 'active' : ''}`}
              onClick={() => { setMode('register'); setError(null); setMessage(null); }}
            >
              Rejestracja
            </button>
          </div>

          {error && <div className="alert alert-error">❌ {error}</div>}
          {message && <div className="alert alert-success">✅ {message}</div>}

          {mode === 'login' && (
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label className="label">Email</label>
                <input
                  type="email"
                  className="input"
                  placeholder="twoj@email.pl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="label">Hasło</label>
                <input
                  type="password"
                  className="input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
                {loading ? <span className="spinner" /> : 'Zaloguj się'}
              </button>
              <button type="button" className="btn btn-ghost btn-full mt-md" onClick={() => setMode('forgot')}>
                Zapomniałem hasła
              </button>
            </form>
          )}

          {mode === 'register' && (
            <form onSubmit={handleRegister}>
              <div className="form-group">
                <label className="label">Email</label>
                <input
                  type="email"
                  className="input"
                  placeholder="twoj@email.pl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label className="label">Hasło</label>
                <input
                  type="password"
                  className="input"
                  placeholder="Min. 8 znaków"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={8}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
                {loading ? <span className="spinner" /> : 'Utwórz konto'}
              </button>
            </form>
          )}

          {mode === 'forgot' && (
            <form onSubmit={handleForgot}>
              <p className="text-secondary mb-lg">Podaj email, a wyślemy link do resetowania hasła.</p>
              <div className="form-group">
                <label className="label">Email</label>
                <input
                  type="email"
                  className="input"
                  placeholder="twoj@email.pl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
                {loading ? <span className="spinner" /> : 'Wyślij link'}
              </button>
              <button type="button" className="btn btn-ghost btn-full mt-md" onClick={() => setMode('login')}>
                ← Powrót do logowania
              </button>
            </form>
          )}

          {mode !== 'forgot' && (
            <>
              <div className="divider"><span>lub</span></div>
              <button className="btn btn-secondary btn-full" onClick={() => handleOAuth('google')}>
                🔵 Kontynuuj z Google
              </button>
            </>
          )}
        </div>

        <p className="footer-text text-tertiary">⚠️ Narzędzie analizy strukturalnej, nie terapia.</p>
        <p className="footer-text text-tertiary" style={{ marginTop: '8px', fontSize: '12px' }}>
          <a href="/terms" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'underline' }}>Regulamin</a>
          {' · '}
          <a href="/privacy" style={{ color: 'var(--color-text-tertiary)', textDecoration: 'underline' }}>Polityka prywatności</a>
        </p>
      </div>

      <style jsx>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: var(--space-lg);
        }
        .login-container { width: 100%; max-width: 420px; }
        .login-header { text-align: center; margin-bottom: var(--space-2xl); }
        .logo {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: var(--space-md);
          margin-bottom: var(--space-md);
        }
        .logo-icon { font-size: 40px; }
        .logo h1 { font-size: var(--font-size-3xl); margin: 0; }
        .login-card { padding: var(--space-2xl); }
        .form-group { margin-bottom: var(--space-lg); }
        .alert {
          padding: var(--space-md);
          border-radius: var(--radius-md);
          margin-bottom: var(--space-lg);
        }
        .alert-error {
          background: rgba(239, 68, 68, 0.1);
          border: 1px solid rgba(239, 68, 68, 0.3);
          color: var(--danger);
        }
        .alert-success {
          background: rgba(16, 185, 129, 0.1);
          border: 1px solid rgba(16, 185, 129, 0.3);
          color: var(--success);
        }
        .divider {
          display: flex;
          align-items: center;
          margin: var(--space-xl) 0;
        }
        .divider::before, .divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--color-border);
        }
        .divider span {
          padding: 0 var(--space-md);
          color: var(--color-text-tertiary);
          font-size: var(--font-size-sm);
        }
        .footer-text {
          text-align: center;
          margin-top: var(--space-xl);
          font-size: var(--font-size-sm);
        }
      `}</style>
    </div>
  );
}
