'use client'
import { useState } from 'react'

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

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: 40 }}>
      <h1 style={{ fontSize: 24, marginBottom: 16, color: '#e8e8e8' }}>New Object</h1>
      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Describe a situation, interaction, or pattern you've observed..."
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
      {result && (
        <div style={{ marginTop: 24, padding: 20, background: '#111', borderRadius: 8, border: '1px solid #333' }}>
          <pre style={{ whiteSpace: 'pre-wrap', color: '#ccc', fontSize: 13 }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  )
}
