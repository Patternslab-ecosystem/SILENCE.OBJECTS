// ============================================
// src/app/login/page.tsx
// PatternLens v5.0 - SILENCE DARK Login
// ============================================

'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';

export default function LoginPage() {
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  // Redirect to dashboard if already logged in
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) router.push('/dashboard');
    });
  }, [supabase, router]);

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
      if (error) {
        if (error.message.includes('Email not confirmed')) {
          setError('Email nie został potwierdzony. Sprawdź skrzynkę (w tym spam) lub poczekaj kilka minut.');
        } else if (error.message.includes('Invalid login credentials')) {
          setError('Nieprawidłowy email lub hasło.');
        } else {
          throw error;
        }
        return;
      }
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          data: { locale: 'pl' },
        }
      });
      if (error) {
        if (error.message.includes('already registered') || error.message.includes('already been registered')) {
          setError('Ten email jest już zarejestrowany. Zaloguj się.');
        } else {
          throw error;
        }
        return;
      }
      // If autoconfirm is ON → session exists immediately → go to dashboard
      if (data.session) {
        router.push('/dashboard');
        return;
      }
      // If email confirm is ON → show message
      setMessage('Sprawdź email — wysłaliśmy link aktywacyjny. Sprawdź też folder spam.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Registration failed');
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
      setMessage('Check your email for a reset link');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error');
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
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 24,
      background: '#08080a',
    }}>
      <div style={{ width: '100%', maxWidth: 400 }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <p style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 600,
            fontSize: 22,
            color: '#e8e8ec',
            letterSpacing: '-0.02em',
          }}>
            <span style={{ color: '#21808d', marginRight: 8 }}>&#9673;</span>
            PatternLens
          </p>
          <p style={{
            fontFamily: "'Outfit', system-ui, sans-serif",
            fontWeight: 300,
            fontSize: 14,
            color: '#888893',
            marginTop: 8,
          }}>
            Structural Pattern Analysis
          </p>
          <p style={{
            fontFamily: "'Outfit', system-ui, sans-serif",
            fontWeight: 300,
            fontSize: 13,
            color: '#888893',
            marginTop: 6,
            maxWidth: 300,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}>
            Analyze behavioral patterns as structural systems · Free core analysis
          </p>
        </div>

        {/* Card */}
        <div style={{
          background: '#111113',
          border: '1px solid #222228',
          borderRadius: 16,
          padding: 32,
          boxShadow: '0 0 80px rgba(33,128,141,0.08)',
        }}>
          {/* Tabs */}
          {mode !== 'forgot' && (
            <div style={{
              display: 'flex',
              gap: 0,
              marginBottom: 28,
              borderBottom: '1px solid #222228',
            }}>
              <button
                onClick={() => { setMode('login'); setError(null); setMessage(null); }}
                style={{
                  flex: 1,
                  padding: '10px 0',
                  background: 'none',
                  border: 'none',
                  borderBottom: mode === 'login' ? '2px solid #21808d' : '2px solid transparent',
                  color: mode === 'login' ? '#e8e8ec' : '#55555e',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 200ms',
                }}
              >
                Logowanie
              </button>
              <button
                onClick={() => { setMode('register'); setError(null); setMessage(null); }}
                style={{
                  flex: 1,
                  padding: '10px 0',
                  background: 'none',
                  border: 'none',
                  borderBottom: mode === 'register' ? '2px solid #21808d' : '2px solid transparent',
                  color: mode === 'register' ? '#e8e8ec' : '#55555e',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 13,
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 200ms',
                }}
              >
                Rejestracja
              </button>
            </div>
          )}

          {/* Error / Message */}
          {error && (
            <div style={{
              padding: '10px 14px',
              borderRadius: 8,
              marginBottom: 20,
              background: 'rgba(204,68,68,0.1)',
              border: '1px solid rgba(204,68,68,0.25)',
              color: '#cc4444',
              fontSize: 13,
              fontFamily: "'Outfit', sans-serif",
            }}>
              {error}
            </div>
          )}
          {message && (
            <div style={{
              padding: '10px 14px',
              borderRadius: 8,
              marginBottom: 20,
              background: 'rgba(61,153,112,0.1)',
              border: '1px solid rgba(61,153,112,0.25)',
              color: '#3d9970',
              fontSize: 13,
              fontFamily: "'Outfit', sans-serif",
            }}>
              {message}
            </div>
          )}

          {/* Login Form */}
          {mode === 'login' && (
            <form onSubmit={handleLogin}>
              <div style={{ marginBottom: 18 }}>
                <label style={{
                  display: 'block',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  fontWeight: 500,
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.08em',
                  color: '#888893',
                  marginBottom: 6,
                }}>
                  Email
                </label>
                <input
                  type="email"
                  placeholder="twoj@email.pl"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    background: '#1a1a1e',
                    border: '1px solid #222228',
                    borderRadius: 10,
                    color: '#e8e8ec',
                    fontSize: 14,
                    fontFamily: "'Outfit', sans-serif",
                    outline: 'none',
                    transition: 'border-color 200ms',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#21808d'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#222228'; }}
                />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{
                  display: 'block',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  fontWeight: 500,
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.08em',
                  color: '#888893',
                  marginBottom: 6,
                }}>
                  Password
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    background: '#1a1a1e',
                    border: '1px solid #222228',
                    borderRadius: 10,
                    color: '#e8e8ec',
                    fontSize: 14,
                    fontFamily: "'Outfit', sans-serif",
                    outline: 'none',
                    transition: 'border-color 200ms',
                  }}
                  onFocus={(e) => { e.target.style.borderColor = '#21808d'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#222228'; }}
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%',
                  padding: '13px 0',
                  background: loading ? 'rgba(33,128,141,0.5)' : '#21808d',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 10,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontWeight: 600,
                  fontSize: 14,
                  cursor: loading ? 'wait' : 'pointer',
                  transition: 'all 200ms',
                }}
              >
                {loading ? 'Logging in...' : 'Log in'}
              </button>
              <button
                type="button"
                onClick={() => setMode('forgot')}
                style={{
                  width: '100%',
                  padding: '10px 0',
                  marginTop: 8,
                  background: 'none',
                  border: 'none',
                  color: '#55555e',
                  fontSize: 13,
                  fontFamily: "'Outfit', sans-serif",
                  cursor: 'pointer',
                }}
              >
                Forgot password?
              </button>
            </form>
          )}

          {/* Register Form */}
          {mode === 'register' && (
            <form onSubmit={handleRegister}>
              <div style={{ marginBottom: 18 }}>
                <label style={{
                  display: 'block',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  fontWeight: 500,
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.08em',
                  color: '#888893',
                  marginBottom: 6,
                }}>Email</label>
                <input
                  type="email" placeholder="twoj@email.pl" value={email}
                  onChange={(e) => setEmail(e.target.value)} required
                  style={{ width: '100%', padding: '12px 14px', background: '#1a1a1e', border: '1px solid #222228', borderRadius: 10, color: '#e8e8ec', fontSize: 14, fontFamily: "'Outfit', sans-serif", outline: 'none', transition: 'border-color 200ms' }}
                  onFocus={(e) => { e.target.style.borderColor = '#21808d'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#222228'; }}
                />
              </div>
              <div style={{ marginBottom: 24 }}>
                <label style={{
                  display: 'block',
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  fontWeight: 500,
                  textTransform: 'uppercase' as const,
                  letterSpacing: '0.08em',
                  color: '#888893',
                  marginBottom: 6,
                }}>Password</label>
                <input
                  type="password" placeholder="Min. 8 characters" value={password}
                  onChange={(e) => setPassword(e.target.value)} minLength={8} required
                  style={{ width: '100%', padding: '12px 14px', background: '#1a1a1e', border: '1px solid #222228', borderRadius: 10, color: '#e8e8ec', fontSize: 14, fontFamily: "'Outfit', sans-serif", outline: 'none', transition: 'border-color 200ms' }}
                  onFocus={(e) => { e.target.style.borderColor = '#21808d'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#222228'; }}
                />
              </div>
              <button type="submit" disabled={loading}
                style={{ width: '100%', padding: '13px 0', background: loading ? 'rgba(33,128,141,0.5)' : '#21808d', color: '#fff', border: 'none', borderRadius: 10, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, fontSize: 14, cursor: loading ? 'wait' : 'pointer', transition: 'all 200ms' }}
              >
                {loading ? 'Creating...' : 'Create account'}
              </button>
            </form>
          )}

          {/* Forgot Form */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgot}>
              <p style={{ color: '#888893', fontSize: 13, marginBottom: 20, fontFamily: "'Outfit', sans-serif" }}>
                Enter your email and we will send a reset link.
              </p>
              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 500, textTransform: 'uppercase' as const, letterSpacing: '0.08em', color: '#888893', marginBottom: 6 }}>Email</label>
                <input type="email" placeholder="twoj@email.pl" value={email}
                  onChange={(e) => setEmail(e.target.value)} required
                  style={{ width: '100%', padding: '12px 14px', background: '#1a1a1e', border: '1px solid #222228', borderRadius: 10, color: '#e8e8ec', fontSize: 14, fontFamily: "'Outfit', sans-serif", outline: 'none' }}
                  onFocus={(e) => { e.target.style.borderColor = '#21808d'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#222228'; }}
                />
              </div>
              <button type="submit" disabled={loading}
                style={{ width: '100%', padding: '13px 0', background: '#21808d', color: '#fff', border: 'none', borderRadius: 10, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, fontSize: 14, cursor: loading ? 'wait' : 'pointer' }}
              >
                {loading ? 'Sending...' : 'Send reset link'}
              </button>
              <button type="button" onClick={() => setMode('login')}
                style={{ width: '100%', padding: '10px 0', marginTop: 8, background: 'none', border: 'none', color: '#55555e', fontSize: 13, cursor: 'pointer' }}
              >
                Back to login
              </button>
            </form>
          )}

          {/* OAuth divider */}
          {mode !== 'forgot' && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', margin: '24px 0', gap: 12 }}>
                <div style={{ flex: 1, height: 1, background: '#222228' }} />
                <span style={{ color: '#55555e', fontSize: 12, fontFamily: "'Outfit', sans-serif" }}>or</span>
                <div style={{ flex: 1, height: 1, background: '#222228' }} />
              </div>
              <button
                onClick={() => handleOAuth('google')}
                style={{
                  width: '100%',
                  padding: '12px 0',
                  background: 'transparent',
                  border: '1px solid #222228',
                  borderRadius: 10,
                  color: '#888893',
                  fontSize: 13,
                  fontFamily: "'Outfit', sans-serif",
                  cursor: 'pointer',
                  transition: 'border-color 200ms',
                }}
                onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.borderColor = '#333340'; }}
                onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.borderColor = '#222228'; }}
              >
                Continue with Google
              </button>
            </>
          )}
        </div>

        {/* Features box */}
        <div style={{ marginTop: 16, padding: 12, background: '#1a1a1e', borderRadius: 8, border: '1px solid #222228' }}>
          <p style={{ fontSize: 11, color: '#888893', fontFamily: "'JetBrains Mono', monospace", textAlign: 'center' }}>
            Unlimited local objects · Core pattern detection · 12 archetypes
          </p>
          <p style={{ fontSize: 10, color: '#55555e', fontFamily: "'JetBrains Mono', monospace", textAlign: 'center', marginTop: 4 }}>
            PRO: Cloud sync + advanced analysis + predictions &rarr; 29 PLN/mo
          </p>
        </div>

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: 28 }}>
          <p style={{ color: '#55555e', fontSize: 11, fontFamily: "'JetBrains Mono', monospace", marginBottom: 8 }}>
            Structural analysis tool. Not advice or diagnosis.
          </p>
          <p style={{ fontSize: 12, color: '#55555e' }}>
            <a href="/terms" style={{ color: '#4a8fe2', textDecoration: 'none' }}>Terms</a>
            {' · '}
            <a href="/privacy" style={{ color: '#4a8fe2', textDecoration: 'none' }}>Privacy</a>
          </p>
          <p style={{ color: '#333340', fontSize: 10, fontFamily: "'JetBrains Mono', monospace", marginTop: 12 }}>
            v5.1 · SILENCE.OBJECTS Framework
          </p>
        </div>

        {/* Ecosystem links */}
        <div style={{ marginTop: 16, display: 'flex', gap: 16, justifyContent: 'center' }}>
          <a href="https://patternslab.app" style={{ fontSize: 10, color: '#55555e', fontFamily: "'JetBrains Mono', monospace", textDecoration: 'none' }}>
            Dashboard
          </a>
          <a href="https://patternslab.app/investor/dashboard" style={{ fontSize: 10, color: '#55555e', fontFamily: "'JetBrains Mono', monospace", textDecoration: 'none' }}>
            Investors
          </a>
          <a href="https://github.com/Patternslab-ecosystem/SILENCE.OBJECTS" style={{ fontSize: 10, color: '#55555e', fontFamily: "'JetBrains Mono', monospace", textDecoration: 'none' }}>
            GitHub
          </a>
        </div>
      </div>
    </div>
  );
}
