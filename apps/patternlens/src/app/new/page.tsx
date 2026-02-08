'use client'
import { useState } from 'react'
import Link from 'next/link'

export default function NewObject() {
  const [text, setText] = useState('')
  const [result, setResult] = useState<Record<string, unknown> | null>(null)
  const [loading, setLoading] = useState(false)

  async function analyze() {
    setLoading(true)
    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      })
      const data = await res.json()
      setResult(data)
    } catch (e) {
      setResult({ error: 'Analysis failed', details: String(e) })
    }
    setLoading(false)
  }

  const analysis = result && 'analysis' in result ? result.analysis as Record<string, unknown> : null
  const isCrisis = result && 'crisis' in result

  return (
    <div style={{ minHeight: '100vh', background: '#08080a', color: '#e8e8ec' }}>
      {/* Nav */}
      <nav style={{
        position: 'sticky', top: 0, zIndex: 50,
        background: 'rgba(17,17,19,0.8)', backdropFilter: 'blur(16px)',
        borderBottom: '1px solid #222228', padding: '14px 24px',
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, fontSize: 15, color: '#e8e8ec' }}>
            <span style={{ color: '#21808d', marginRight: 6 }}>&#9673;</span>PatternLens
            <span style={{ fontSize: 10, color: '#55555e', marginLeft: 8, border: '1px solid #222228', borderRadius: 999, padding: '2px 8px' }}>v5.0</span>
          </span>
        </div>
      </nav>

      <main style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px' }}>
        <Link href="/dashboard" style={{
          color: '#888893', fontSize: 13, textDecoration: 'none',
          fontFamily: "'JetBrains Mono', monospace",
          marginBottom: 32, display: 'inline-block',
          transition: 'color 200ms',
        }}>
          &larr; Dashboard
        </Link>

        <h1 style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontWeight: 600, fontSize: 24, marginBottom: 8,
        }}>New Object</h1>
        <p style={{
          fontFamily: "'Outfit', sans-serif",
          color: '#888893', fontSize: 14, marginBottom: 28,
        }}>
          Describe a situation for structural analysis
        </p>

        {/* Textarea */}
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Describe a situation, interaction, or observed pattern..."
          style={{
            width: '100%', minHeight: 240, padding: 20,
            background: '#1a1a1e', border: '1px solid #222228',
            borderRadius: 12, color: '#e8e8ec', fontSize: 14,
            fontFamily: "'Outfit', sans-serif", resize: 'vertical',
            lineHeight: 1.6, outline: 'none', transition: 'border-color 200ms',
          }}
          onFocus={(e) => { e.target.style.borderColor = '#21808d'; }}
          onBlur={(e) => { e.target.style.borderColor = '#222228'; }}
        />

        {/* Counter + Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, marginBottom: 12 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#55555e' }}>
            {text.length} / 5000
          </span>
        </div>

        <button
          onClick={analyze}
          disabled={loading || text.length < 20}
          style={{
            padding: '14px 32px',
            background: loading ? 'rgba(33,128,141,0.5)' : (text.length < 20 ? 'rgba(33,128,141,0.3)' : '#21808d'),
            color: '#fff', border: 'none', borderRadius: 12,
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 600, fontSize: 14,
            cursor: loading ? 'wait' : (text.length < 20 ? 'not-allowed' : 'pointer'),
            opacity: text.length < 20 ? 0.4 : 1,
            transition: 'all 200ms',
            boxShadow: text.length >= 20 && !loading ? '0 4px 24px rgba(33,128,141,0.2)' : 'none',
          }}
        >
          {loading ? 'Analyzing...' : 'Analyze Object'}
        </button>

        {/* CRISIS RESPONSE */}
        {isCrisis && (
          <div style={{
            marginTop: 32, padding: 32,
            background: 'rgba(204,68,68,0.05)',
            border: '2px solid rgba(204,68,68,0.3)',
            borderRadius: 16,
          }}>
            <div style={{ fontSize: 40, textAlign: 'center', marginBottom: 16 }}>&#9888;&#65039;</div>
            <h2 style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 600, fontSize: 18, color: '#cc4444',
              textAlign: 'center', marginBottom: 16,
            }}>
              Content requiring attention detected
            </h2>
            <p style={{ color: '#888893', fontSize: 13, textAlign: 'center', marginBottom: 24, fontFamily: "'Outfit', sans-serif" }}>
              PatternLens is a structural analysis tool. In a crisis, contact professional services.
            </p>
            {result && 'resources' in result && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {(Array.isArray(result.resources) ? result.resources : []).map((r: Record<string, string>, i: number) => (
                  <a key={i} href={`tel:${String(r.phone || '').replace(/\s/g, '')}`} style={{
                    display: 'block', padding: 16,
                    background: 'rgba(204,68,68,0.08)',
                    border: '1px solid rgba(204,68,68,0.2)',
                    borderRadius: 10, textDecoration: 'none',
                    textAlign: 'center',
                  }}>
                    <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 20, fontWeight: 700, color: '#cc4444', marginBottom: 4 }}>
                      {String(r.phone)}
                    </p>
                    <p style={{ fontSize: 12, color: '#888893' }}>{String(r.name)}</p>
                    <p style={{ fontSize: 10, color: '#55555e' }}>{String(r.available)}</p>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ANALYSIS RESULT */}
        {analysis && !isCrisis && (
          <div style={{ marginTop: 32 }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <h2 style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, fontSize: 18 }}>Structural Analysis</h2>
              {result && 'note' in result ? (
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#d4a843', border: '1px solid rgba(212,168,67,0.3)', borderRadius: 999, padding: '2px 10px' }}>mock-fallback</span>
              ) : (
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#21808d', border: '1px solid rgba(33,128,141,0.3)', borderRadius: 999, padding: '2px 10px' }}>claude-sonnet-4</span>
              )}
            </div>

            {/* 4-Phase Protocol — 2x2 grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
              {['context', 'tension', 'meaning', 'function'].map(key => (
                <div key={key} style={{
                  padding: 16,
                  background: '#111113',
                  borderLeft: '2px solid #21808d',
                  borderRadius: '0 10px 10px 0',
                }}>
                  <p style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10, fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    color: '#21808d',
                    marginBottom: 8,
                  }}>{key}</p>
                  <p style={{ fontSize: 13, color: '#e8e8ec', lineHeight: 1.6, fontFamily: "'Outfit', sans-serif" }}>
                    {String((analysis as Record<string, unknown>)[key] || '')}
                  </p>
                </div>
              ))}
            </div>

            {/* Dual Lens */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
              <div style={{ padding: 20, background: '#111113', border: '1px solid #222228', borderRadius: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#21808d', letterSpacing: '0.1em' }}>LENS A</span>
                  <span style={{ fontSize: 11, color: '#55555e' }}>Primary</span>
                </div>
                <p style={{ fontSize: 13, color: '#e8e8ec', lineHeight: 1.6, fontFamily: "'Outfit', sans-serif" }}>
                  {String((analysis as Record<string, unknown>).lensA || '')}
                </p>
              </div>
              <div style={{ padding: 20, background: '#111113', border: '1px solid rgba(212,168,67,0.2)', borderRadius: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#d4a843', letterSpacing: '0.1em' }}>LENS B</span>
                  <span style={{ fontSize: 11, color: '#55555e' }}>Alternative</span>
                </div>
                <p style={{ fontSize: 13, color: '#e8e8ec', lineHeight: 1.6, fontFamily: "'Outfit', sans-serif" }}>
                  {String((analysis as Record<string, unknown>).lensB || '')}
                </p>
              </div>
            </div>

            {/* Archetype Badge */}
            <div style={{
              padding: 24, textAlign: 'center',
              background: 'rgba(33,128,141,0.06)',
              border: '1px solid rgba(33,128,141,0.2)',
              borderRadius: 16, marginBottom: 24,
            }}>
              <p style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontWeight: 700, fontSize: 22, color: '#21808d',
              }}>
                {String((analysis as Record<string, unknown>).archetype || '—')}
              </p>
              <p style={{ fontSize: 12, color: '#888893', marginTop: 4, fontFamily: "'Outfit', sans-serif" }}>
                Dominant pattern alignment
              </p>
              {/* Confidence bar */}
              <div style={{ maxWidth: 200, margin: '16px auto 0' }}>
                <div style={{ height: 6, background: '#1a1a1e', borderRadius: 3, overflow: 'hidden' }}>
                  <div style={{
                    width: `${Math.round(Number((analysis as Record<string, unknown>).confidence || 0) * 100)}%`,
                    height: '100%', background: '#21808d', borderRadius: 3,
                  }} />
                </div>
                <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: '#888893', marginTop: 6 }}>
                  {Math.round(Number((analysis as Record<string, unknown>).confidence || 0) * 100)}% confidence
                </p>
              </div>
            </div>

            {/* Disclaimer bar */}
            <div style={{ borderTop: '1px solid #222228', paddingTop: 16, marginTop: 24 }}>
              <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#55555e', textAlign: 'center' }}>
                Structural analysis proposal. Not advice, diagnosis, or treatment.
              </p>
              {result && 'disclaimer' in result && (
                <p style={{ fontSize: 10, color: '#55555e', textAlign: 'center', marginTop: 4 }}>{String((result as Record<string, unknown>).disclaimer)}</p>
              )}
            </div>
          </div>
        )}

        {/* Raw fallback for unexpected result shapes */}
        {result && !analysis && !isCrisis && !('error' in result) && (
          <div style={{ marginTop: 24, padding: 20, background: '#111113', borderRadius: 12, border: '1px solid #222228' }}>
            <pre style={{ whiteSpace: 'pre-wrap', color: '#888893', fontSize: 12, fontFamily: "'JetBrains Mono', monospace" }}>
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        {result && 'error' in result && !isCrisis && (
          <div style={{ marginTop: 24, padding: 20, background: 'rgba(204,68,68,0.05)', borderRadius: 12, border: '1px solid rgba(204,68,68,0.2)' }}>
            <p style={{ color: '#cc4444', fontSize: 13 }}>{String((result as Record<string, unknown>).error)}</p>
          </div>
        )}
      </main>
    </div>
  )
}
