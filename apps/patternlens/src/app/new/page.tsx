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

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 40 }}>
      <Link
        href="/dashboard"
        style={{ color: '#888', fontSize: 13, textDecoration: 'none', marginBottom: 24, display: 'inline-block' }}
      >
        &larr; Dashboard
      </Link>

      <h1 style={{ fontSize: 24, marginBottom: 16, color: '#e8e8e8' }}>New Object</h1>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Opisz sytuację, interakcję lub zaobserwowany wzorzec..."
        style={{
          width: '100%', minHeight: 200, padding: 16,
          background: '#111', border: '1px solid #333',
          borderRadius: 8, color: '#e8e8e8', fontSize: 15,
          fontFamily: 'inherit', resize: 'vertical'
        }}
      />
      <button
        onClick={analyze}
        disabled={loading || text.length < 20}
        style={{
          marginTop: 16, padding: '12px 32px',
          background: loading ? '#333' : '#21808d',
          color: '#fff', border: 'none', borderRadius: 8,
          fontSize: 15, fontWeight: 600, cursor: loading ? 'wait' : 'pointer'
        }}
      >
        {loading ? 'Analyzing...' : 'Analyze Object'}
      </button>

      {result && 'crisis' in result && (
        <div style={{ marginTop: 24, padding: 20, background: 'rgba(239,68,68,0.1)', borderRadius: 8, border: '1px solid rgba(239,68,68,0.3)' }}>
          <p style={{ color: '#ef4444', fontWeight: 600, marginBottom: 8 }}>{String((result as Record<string, unknown>).message)}</p>
          <pre style={{ whiteSpace: 'pre-wrap', color: '#ccc', fontSize: 13 }}>
            {JSON.stringify((result as Record<string, unknown>).resources, null, 2)}
          </pre>
        </div>
      )}

      {analysis && (
        <div style={{ marginTop: 24 }}>
          {['context', 'tension', 'meaning', 'function'].map(key => (
            <div key={key} style={{ marginBottom: 12, padding: 16, background: '#111', borderRadius: 8, border: '1px solid #333' }}>
              <p style={{ color: '#21808d', fontSize: 11, textTransform: 'uppercase', marginBottom: 4, fontWeight: 600 }}>{key}</p>
              <p style={{ color: '#ccc', fontSize: 14, lineHeight: 1.5 }}>{String((analysis as Record<string, unknown>)[key] || '')}</p>
            </div>
          ))}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
            <div style={{ padding: 16, background: '#111', borderRadius: 8, border: '1px solid #333' }}>
              <p style={{ color: '#21808d', fontSize: 11, textTransform: 'uppercase', marginBottom: 4, fontWeight: 600 }}>Lens A</p>
              <p style={{ color: '#ccc', fontSize: 13, lineHeight: 1.5 }}>{String((analysis as Record<string, unknown>).lensA || '')}</p>
            </div>
            <div style={{ padding: 16, background: '#111', borderRadius: 8, border: '1px solid #333' }}>
              <p style={{ color: '#21808d', fontSize: 11, textTransform: 'uppercase', marginBottom: 4, fontWeight: 600 }}>Lens B</p>
              <p style={{ color: '#ccc', fontSize: 13, lineHeight: 1.5 }}>{String((analysis as Record<string, unknown>).lensB || '')}</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
            <div style={{ flex: 1, padding: 16, background: '#111', borderRadius: 8, border: '1px solid #333', textAlign: 'center' }}>
              <p style={{ color: '#21808d', fontSize: 11, textTransform: 'uppercase', marginBottom: 4, fontWeight: 600 }}>Archetype</p>
              <p style={{ color: '#e8e8e8', fontSize: 18, fontWeight: 700 }}>{String((analysis as Record<string, unknown>).archetype || '—')}</p>
            </div>
            <div style={{ flex: 1, padding: 16, background: '#111', borderRadius: 8, border: '1px solid #333', textAlign: 'center' }}>
              <p style={{ color: '#21808d', fontSize: 11, textTransform: 'uppercase', marginBottom: 4, fontWeight: 600 }}>Confidence</p>
              <p style={{ color: '#e8e8e8', fontSize: 18, fontWeight: 700 }}>{String(Math.round(Number((analysis as Record<string, unknown>).confidence || 0) * 100))}%</p>
            </div>
          </div>

          {result && 'disclaimer' in result && (
            <p style={{ color: '#666', fontSize: 11, textAlign: 'center', marginTop: 16 }}>{String((result as Record<string, unknown>).disclaimer)}</p>
          )}
          {result && 'note' in result && (
            <p style={{ color: '#f59e0b', fontSize: 11, textAlign: 'center', marginTop: 4 }}>{String((result as Record<string, unknown>).note)}</p>
          )}
        </div>
      )}

      {result && !analysis && !('crisis' in result) && (
        <div style={{ marginTop: 24, padding: 20, background: '#111', borderRadius: 8, border: '1px solid #333' }}>
          <pre style={{ whiteSpace: 'pre-wrap', color: '#ccc', fontSize: 13 }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
