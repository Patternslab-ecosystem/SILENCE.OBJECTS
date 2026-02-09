'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface InterpretationPhase {
  title: string
  content: string
}

interface Interpretation {
  id: string
  lens: 'A' | 'B'
  phase_1_context: InterpretationPhase
  phase_2_tension: InterpretationPhase
  phase_3_meaning: InterpretationPhase
  phase_4_function: InterpretationPhase
  confidence_score: number
  risk_level: string
  created_at: string
}

interface ObjectData {
  id: string
  input_text: string
  input_method: string
  selected_lens: string | null
  detected_theme: string | null
  created_at: string
  interpretations?: Interpretation[]
}

export default function ObjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [object, setObject] = useState<ObjectData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [interpreting, setInterpreting] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        // Load object with interpretations via the interpret GET endpoint
        const res = await fetch(`/api/objects/interpret?object_id=${params.id}`)
        if (res.status === 401) { router.push('/login'); return }
        if (!res.ok) { setError('Object not found'); setLoading(false); return }
        const data = await res.json()
        setObject(data)
      } catch {
        setError('Failed to load object')
      }
      setLoading(false)
    }
    if (params.id) load()
  }, [params.id, router])

  const handleInterpret = async () => {
    if (!object || interpreting) return
    setInterpreting(true)
    try {
      const res = await fetch('/api/objects/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ object_id: object.id })
      })
      if (res.ok) {
        // Reload object with new interpretations
        const reloadRes = await fetch(`/api/objects/interpret?object_id=${object.id}`)
        if (reloadRes.ok) {
          const data = await reloadRes.json()
          setObject(data)
        }
      }
    } catch { /* ignore */ }
    setInterpreting(false)
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', color: '#888' }}>
        <div className="spinner" /> Loading...
      </div>
    )
  }

  if (error || !object) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', color: '#888', gap: 16 }}>
        <p>{error || 'Object not found'}</p>
        <Link href="/dashboard" style={{ color: '#21808d', textDecoration: 'none' }}>Back to Dashboard</Link>
      </div>
    )
  }

  const lensA = object.interpretations?.find(i => i.lens === 'A')
  const lensB = object.interpretations?.find(i => i.lens === 'B')
  const hasInterpretations = lensA || lensB
  const status = hasInterpretations ? 'completed' : 'pending'

  const phases = lensA ? [
    { name: 'Kontekst', content: lensA.phase_1_context?.content || '', confidence: lensA.confidence_score },
    { name: 'Napięcie', content: lensA.phase_2_tension?.content || '', confidence: lensA.confidence_score },
    { name: 'Znaczenie', content: lensA.phase_3_meaning?.content || '', confidence: lensA.confidence_score },
    { name: 'Funkcja', content: lensA.phase_4_function?.content || '', confidence: lensA.confidence_score },
  ] : null

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#e8e8e8' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px' }}>
        <Link href="/dashboard" style={{ color: '#888', fontSize: 13, textDecoration: 'none', marginBottom: 24, display: 'inline-block' }}>
          &larr; Dashboard
        </Link>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Obiekt</h1>
            <p style={{ color: '#666', fontSize: 12, fontFamily: 'monospace' }}>
              {object.id.substring(0, 8)}... &middot; {new Date(object.created_at).toLocaleDateString('pl-PL')}
            </p>
          </div>
          <span style={{
            padding: '4px 12px', borderRadius: 4, fontSize: 11, fontWeight: 600, textTransform: 'uppercase',
            background: status === 'completed' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
            color: status === 'completed' ? '#10b981' : '#f59e0b',
            border: `1px solid ${status === 'completed' ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`,
          }}>
            {status === 'completed' ? 'Przeanalizowany' : 'Oczekuje'}
          </span>
        </div>

        {/* Input Text */}
        <div style={{ marginBottom: 32, padding: 20, background: '#111', borderRadius: 8, border: '1px solid #222' }}>
          <p style={{ color: '#21808d', fontSize: 11, textTransform: 'uppercase', fontWeight: 600, marginBottom: 8, letterSpacing: '0.05em' }}>Tekst wejściowy</p>
          <p style={{ color: '#ccc', fontSize: 14, lineHeight: 1.6 }}>{object.input_text}</p>
          <div style={{ display: 'flex', gap: 16, marginTop: 12 }}>
            <span style={{ color: '#555', fontSize: 11 }}>Metoda: {object.input_method === 'voice' ? 'Głos' : 'Tekst'}</span>
            {object.detected_theme && <span style={{ color: '#555', fontSize: 11 }}>Temat: {object.detected_theme}</span>}
          </div>
        </div>

        {/* Interpret Button (if no interpretations yet) */}
        {!hasInterpretations && (
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <button
              onClick={handleInterpret}
              disabled={interpreting}
              style={{
                padding: '14px 32px', background: interpreting ? 'rgba(33,128,141,0.5)' : '#21808d',
                color: '#fff', border: 'none', borderRadius: 12,
                fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, fontSize: 14,
                cursor: interpreting ? 'wait' : 'pointer',
              }}
            >
              {interpreting ? 'Analiza AI...' : 'Uruchom analizę dual-lens'}
            </button>
          </div>
        )}

        {/* 4-Phase Analysis (Lens A) */}
        {phases && (
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#888', marginBottom: 16 }}>Analiza 4-fazowa (Soczewka A)</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {phases.map((phase) => (
                <div key={phase.name} style={{ padding: 16, background: '#111', borderRadius: 8, border: '1px solid #222' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <p style={{ color: '#21808d', fontSize: 11, textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.05em' }}>{phase.name}</p>
                    {phase.confidence != null && (
                      <span style={{ fontSize: 11, fontFamily: 'monospace', color: phase.confidence >= 0.8 ? '#10b981' : phase.confidence >= 0.6 ? '#14b8a6' : '#f59e0b' }}>
                        {Math.round(phase.confidence * 100)}%
                      </span>
                    )}
                  </div>
                  <p style={{ color: '#ccc', fontSize: 13, lineHeight: 1.5 }}>{phase.content || 'Oczekuje na analizę'}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dual Lens */}
        {hasInterpretations && (
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#888', marginBottom: 16 }}>Podwójna soczewka</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {lensA && (
                <div style={{ padding: 16, background: '#111', borderRadius: 8, border: '1px solid rgba(33,128,141,0.3)' }}>
                  <p style={{ color: '#21808d', fontSize: 11, textTransform: 'uppercase', fontWeight: 600, marginBottom: 8, letterSpacing: '0.05em' }}>Soczewka A &mdash; Ochronna</p>
                  <p style={{ color: '#ccc', fontSize: 13, lineHeight: 1.5 }}>
                    {lensA.phase_1_context?.content || ''}
                  </p>
                </div>
              )}
              {lensB && (
                <div style={{ padding: 16, background: '#111', borderRadius: 8, border: '1px solid rgba(212,168,67,0.3)' }}>
                  <p style={{ color: '#d4a843', fontSize: 11, textTransform: 'uppercase', fontWeight: 600, marginBottom: 8, letterSpacing: '0.05em' }}>Soczewka B &mdash; Rozwojowa</p>
                  <p style={{ color: '#ccc', fontSize: 13, lineHeight: 1.5 }}>
                    {lensB.phase_1_context?.content || ''}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Confidence */}
        {hasInterpretations && lensA && (
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#888', marginBottom: 16 }}>Pewność</h2>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ flex: 1, padding: 20, background: '#111', borderRadius: 8, border: '1px solid #222', textAlign: 'center' }}>
                <p style={{ color: '#21808d', fontSize: 11, textTransform: 'uppercase', fontWeight: 600, marginBottom: 8, letterSpacing: '0.05em' }}>Soczewka A</p>
                <p style={{ fontSize: 24, fontWeight: 700, fontFamily: 'monospace', color: lensA.confidence_score >= 0.8 ? '#10b981' : '#14b8a6' }}>
                  {Math.round(lensA.confidence_score * 100)}%
                </p>
              </div>
              {lensB && (
                <div style={{ flex: 1, padding: 20, background: '#111', borderRadius: 8, border: '1px solid #222', textAlign: 'center' }}>
                  <p style={{ color: '#d4a843', fontSize: 11, textTransform: 'uppercase', fontWeight: 600, marginBottom: 8, letterSpacing: '0.05em' }}>Soczewka B</p>
                  <p style={{ fontSize: 24, fontWeight: 700, fontFamily: 'monospace', color: lensB.confidence_score >= 0.8 ? '#10b981' : '#14b8a6' }}>
                    {Math.round(lensB.confidence_score * 100)}%
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Disclaimer */}
        <p style={{ color: '#555', fontSize: 11, textAlign: 'center', marginTop: 32 }}>
          Narzędzie analizy strukturalnej. Nie porada ani diagnoza.
        </p>
      </div>
    </div>
  )
}
