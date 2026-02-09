'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useObjects, useInterpret } from '@/hooks/useApi';
import { VoiceDump } from '@/components/VoiceDump';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export default function NewObject() {
  const router = useRouter();
  const { t } = useLanguage();
  const [text, setText] = useState('');
  const [crisisLock, setCrisisLock] = useState(false);
  const [crisisResources, setCrisisResources] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { createObject, loading: creating } = useObjects();
  const { interpret, interpreting, result } = useInterpret();

  const isProcessing = creating || interpreting;
  const minChars = 50;

  async function handleSubmit() {
    if (isProcessing || crisisLock || text.length < minChars) return;
    setError(null);

    const createResult = await createObject(text);

    if (createResult.crisis) {
      setCrisisLock(true);
      setCrisisResources(createResult.resources || []);
      return;
    }

    if (createResult.error) {
      setError(createResult.error);
      return;
    }

    if (!createResult.success || !createResult.object_id) {
      setError('Failed to create object');
      return;
    }

    const interpretResult = await interpret(createResult.object_id);

    if (interpretResult?.crisis) {
      setCrisisLock(true);
      setCrisisResources(interpretResult.resources || []);
      return;
    }

    router.push(`/objects/${createResult.object_id}`);
  }

  const handleVoiceTranscript = (transcript: string) => {
    setText(prev => prev ? prev + ' ' + transcript : transcript);
  };

  const lensA = result?.lensA;
  const lensB = result?.lensB;
  const hasResult = lensA || lensB;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
      {/* Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(18, 18, 26, 0.9)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)', padding: '14px 24px',
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 15, color: 'var(--text-primary)' }}>
            <span style={{ color: 'var(--accent-cyan)', marginRight: 6 }}>&#9673;</span>PatternLens
            <span style={{ fontSize: 10, color: 'var(--text-muted)', marginLeft: 8, border: '1px solid var(--border)', borderRadius: 999, padding: '2px 8px' }}>v5.2</span>
          </span>
        </div>
      </nav>

      <main style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px' }}>
        <Link href="/dashboard" style={{
          color: 'var(--text-muted)', fontSize: 13, textDecoration: 'none',
          fontFamily: 'var(--font-mono)',
          marginBottom: 32, display: 'inline-block',
        }}>
          &larr; {t.common.backToDashboard}
        </Link>

        <h1 style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 24, marginBottom: 8 }}>
          {t.dashboard.newAnalysis}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 28 }}>
          {t.analysis.placeholder.split('...')[0]}...
        </p>

        {/* Golden Ratio Grid: Voice 61.8% | Text 38.2% */}
        <div style={{ display: 'grid', gap: 24, gridTemplateColumns: '1fr' }} className="new-golden-grid">
          {/* VOICE PANEL */}
          <div style={{
            background: 'linear-gradient(135deg, var(--bg-surface), var(--bg-elevated))',
            border: '1px solid rgba(6,182,212,0.15)',
            borderRadius: 16, padding: 32,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            minHeight: 280, position: 'relative', overflow: 'hidden',
          }}>
            <div style={{
              position: 'absolute', inset: 0, borderRadius: 16,
              background: 'radial-gradient(circle at 50% 50%, rgba(6,182,212,0.05), transparent 70%)',
              pointerEvents: 'none',
            }} />
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'var(--accent-cyan)',
              marginBottom: 24, position: 'relative', zIndex: 1,
            }}>
              {t.voice.title}
            </p>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <VoiceDump
                onTranscript={handleVoiceTranscript}
                disabled={crisisLock || isProcessing}
                maxDuration={120}
              />
            </div>
            {text && (
              <div style={{
                marginTop: 24, width: '100%', padding: 14,
                background: 'rgba(0,0,0,0.3)', border: '1px solid var(--border)',
                borderRadius: 10, position: 'relative', zIndex: 1,
              }}>
                <p style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>{t.analysis.transcription}</p>
                <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.6 }}>
                  {text.length > 200 ? text.substring(0, 200) + '...' : text}
                </p>
              </div>
            )}
          </div>

          {/* TEXT PANEL */}
          <div style={{
            background: 'var(--bg-surface)', border: '1px solid var(--border)',
            borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column',
          }}>
            <p style={{
              fontFamily: 'var(--font-mono)', fontSize: 11, letterSpacing: '0.1em',
              textTransform: 'uppercase', color: 'var(--text-muted)', marginBottom: 12,
            }}>
              {t.analysis.text}
            </p>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              disabled={crisisLock || isProcessing}
              placeholder={t.analysis.placeholder}
              className="input textarea"
              style={{ minHeight: 180, flex: 1 }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, fontSize: 12, fontFamily: 'var(--font-mono)' }}>
              <span style={{ color: text.length < minChars ? 'var(--warning)' : 'var(--success)' }}>
                {text.length} / 5000
              </span>
              {text.length < minChars && (
                <span style={{ color: 'var(--warning)' }}>{minChars - text.length} {t.analysis.charsRemaining}</span>
              )}
            </div>
          </div>
        </div>

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={isProcessing || crisisLock || text.length < minChars}
          className="btn btn-primary"
          style={{ width: '100%', marginTop: 26, padding: '16px 0', fontSize: 14, fontWeight: 700, letterSpacing: '0.05em' }}
        >
          {creating ? t.analysis.saving : interpreting ? t.analysis.aiAnalysis : t.analysis.analyzeObject}
        </button>

        {/* Responsive golden grid */}
        <style>{`
          @media (min-width: 768px) {
            .new-golden-grid {
              grid-template-columns: 0.618fr 0.382fr !important;
            }
          }
        `}</style>

        {/* Error */}
        {error && (
          <div style={{ marginTop: 16, padding: 16, background: 'var(--danger-muted)', borderRadius: 12, border: '1px solid rgba(239,68,68,0.2)' }}>
            <p style={{ color: 'var(--danger)', fontSize: 13 }}>{error}</p>
          </div>
        )}

        {/* Crisis Response */}
        {crisisLock && crisisResources.length > 0 && (
          <div style={{
            marginTop: 32, padding: 32,
            background: 'var(--danger-muted)',
            border: '2px solid rgba(239,68,68,0.3)',
            borderRadius: 16,
          }}>
            <h2 style={{
              fontFamily: 'var(--font-mono)',
              fontWeight: 600, fontSize: 18, color: 'var(--danger)',
              textAlign: 'center', marginBottom: 16,
            }}>
              {t.crisis.detected}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: 13, textAlign: 'center', marginBottom: 24 }}>
              {t.crisis.disclaimer}
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {crisisResources.map((r: any, i: number) => (
                <a key={i} href={`tel:${String(r.phone || '').replace(/\s/g, '')}`} style={{
                  display: 'block', padding: 16,
                  background: 'rgba(239,68,68,0.08)',
                  border: '1px solid rgba(239,68,68,0.2)',
                  borderRadius: 10, textDecoration: 'none', textAlign: 'center',
                }}>
                  <p style={{ fontFamily: 'var(--font-mono)', fontSize: 20, fontWeight: 700, color: 'var(--danger)', marginBottom: 4 }}>
                    {String(r.phone)}
                  </p>
                  <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{String(r.name)}</p>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Dual-Lens Results */}
        {hasResult && !crisisLock && (
          <div style={{ marginTop: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <h2 style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: 18 }}>
                {t.results.structuralAnalysis}
              </h2>
              <span style={{
                fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent-cyan)',
                border: '1px solid var(--lens-a-border)', borderRadius: 999, padding: '2px 10px',
              }}>
                {t.results.dualLens}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
              {lensA && (
                <div style={{ padding: 20, background: 'var(--bg-surface)', border: '1px solid var(--lens-a-border)', borderRadius: 12 }}>
                  <div style={{ marginBottom: 12 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent-cyan)', letterSpacing: '0.1em' }}>{t.results.lensA}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 8 }}>{t.results.lensAName}</span>
                  </div>
                  {[
                    { key: 'context_phase', label: t.results.context, color: 'var(--accent-cyan)' },
                    { key: 'tension_phase', label: t.results.tension, color: 'var(--accent-cyan)' },
                    { key: 'meaning_phase', label: t.results.meaning, color: 'var(--accent-cyan)' },
                    { key: 'function_phase', label: t.results.function, color: 'var(--accent-cyan)' },
                  ].map(({ key, label, color }) => {
                    const text = (lensA as any)[key];
                    return text ? (
                      <div key={key} style={{ marginBottom: 8, padding: 8, background: 'rgba(0,0,0,0.2)', borderRadius: 6 }}>
                        <p style={{ fontSize: 10, color, textTransform: 'uppercase', marginBottom: 4 }}>{label}</p>
                        <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.5 }}>{text}</p>
                      </div>
                    ) : null;
                  })}
                </div>
              )}

              {lensB && (
                <div style={{ padding: 20, background: 'var(--bg-surface)', border: '1px solid var(--lens-b-border)', borderRadius: 12 }}>
                  <div style={{ marginBottom: 12 }}>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: 10, color: 'var(--accent-purple)', letterSpacing: '0.1em' }}>{t.results.lensB}</span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 8 }}>{t.results.lensBName}</span>
                  </div>
                  {[
                    { key: 'context_phase', label: t.results.context, color: 'var(--accent-purple)' },
                    { key: 'tension_phase', label: t.results.tension, color: 'var(--accent-purple)' },
                    { key: 'meaning_phase', label: t.results.meaning, color: 'var(--accent-purple)' },
                    { key: 'function_phase', label: t.results.function, color: 'var(--accent-purple)' },
                  ].map(({ key, label, color }) => {
                    const text = (lensB as any)[key];
                    return text ? (
                      <div key={key} style={{ marginBottom: 8, padding: 8, background: 'rgba(0,0,0,0.2)', borderRadius: 6 }}>
                        <p style={{ fontSize: 10, color, textTransform: 'uppercase', marginBottom: 4 }}>{label}</p>
                        <p style={{ fontSize: 13, color: 'var(--text-primary)', lineHeight: 1.5 }}>{text}</p>
                      </div>
                    ) : null;
                  })}
                </div>
              )}
            </div>

            <p style={{ fontSize: 11, color: 'var(--text-muted)', textAlign: 'center' }}>
              {t.results.proposalDisclaimer}
            </p>
          </div>
        )}
      </main>
    </div>
  );
}
