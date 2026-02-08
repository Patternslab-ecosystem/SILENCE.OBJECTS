'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

interface ObjectData {
  id: string
  input_text: string
  input_method: string
  processing_status: string
  crisis_level: string
  created_at: string
}

interface Interpretation {
  lens_a: { summary: string; phases: { phase: number; name: string; content: string; confidence: number }[] }
  lens_b: { summary: string; phases: { phase: number; name: string; content: string; confidence: number }[] }
  dominant_archetype: string
  archetype_scores: { archetype: string; score: number }[]
  confidence: number
  processing_time_ms: number
  model: string
  created_at: string
}

export default function ObjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [object, setObject] = useState<ObjectData | null>(null)
  const [interpretation, setInterpretation] = useState<Interpretation | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/objects/${params.id}`)
        if (res.status === 401) { router.push('/login'); return }
        if (!res.ok) { setError('Object not found'); setLoading(false); return }
        const data = await res.json()
        setObject(data.object)

        // Try to load interpretation
        const intRes = await fetch(`/api/objects/interpret?object_id=${params.id}`)
        if (intRes.ok) {
          const intData = await intRes.json()
          if (intData.interpretation) setInterpretation(intData.interpretation)
        }
      } catch {
        setError('Failed to load object')
      }
      setLoading(false)
    }
    if (params.id) load()
  }, [params.id, router])

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', color: '#888' }}>
        Loading...
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

  const phases = interpretation
    ? [
        { name: 'Context', content: interpretation.lens_a?.phases?.[0]?.content || interpretation.lens_a?.summary || '', confidence: interpretation.lens_a?.phases?.[0]?.confidence },
        { name: 'Tension', content: interpretation.lens_a?.phases?.[1]?.content || '', confidence: interpretation.lens_a?.phases?.[1]?.confidence },
        { name: 'Meaning', content: interpretation.lens_a?.phases?.[2]?.content || '', confidence: interpretation.lens_a?.phases?.[2]?.confidence },
        { name: 'Function', content: interpretation.lens_a?.phases?.[3]?.content || '', confidence: interpretation.lens_a?.phases?.[3]?.confidence },
      ]
    : null

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#e8e8e8' }}>
      <div style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px' }}>
        <Link href="/dashboard" style={{ color: '#888', fontSize: 13, textDecoration: 'none', marginBottom: 24, display: 'inline-block' }}>
          &larr; Dashboard
        </Link>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Object Detail</h1>
            <p style={{ color: '#666', fontSize: 12, fontFamily: 'monospace' }}>
              {object.id} &middot; {new Date(object.created_at).toLocaleDateString()}
            </p>
          </div>
          <span style={{
            padding: '4px 12px',
            borderRadius: 4,
            fontSize: 11,
            fontWeight: 600,
            textTransform: 'uppercase',
            background: object.processing_status === 'completed' ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.15)',
            color: object.processing_status === 'completed' ? '#10b981' : '#f59e0b',
            border: `1px solid ${object.processing_status === 'completed' ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)'}`,
          }}>
            {object.processing_status}
          </span>
        </div>

        {/* Input Text */}
        <div style={{ marginBottom: 32, padding: 20, background: '#111', borderRadius: 8, border: '1px solid #222' }}>
          <p style={{ color: '#21808d', fontSize: 11, textTransform: 'uppercase', fontWeight: 600, marginBottom: 8, letterSpacing: '0.05em' }}>Input Text</p>
          <p style={{ color: '#ccc', fontSize: 14, lineHeight: 1.6 }}>{object.input_text}</p>
          <p style={{ color: '#555', fontSize: 11, marginTop: 12 }}>Method: {object.input_method}</p>
        </div>

        {/* 4-Phase Analysis */}
        {phases && (
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#888', marginBottom: 16 }}>4-Phase Analysis</h2>
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
                  <p style={{ color: '#ccc', fontSize: 13, lineHeight: 1.5 }}>{phase.content || 'Pending analysis'}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Dual Lens */}
        {interpretation && (
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#888', marginBottom: 16 }}>Dual Lens</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div style={{ padding: 16, background: '#111', borderRadius: 8, border: '1px solid #222' }}>
                <p style={{ color: '#21808d', fontSize: 11, textTransform: 'uppercase', fontWeight: 600, marginBottom: 8, letterSpacing: '0.05em' }}>Lens A</p>
                <p style={{ color: '#ccc', fontSize: 13, lineHeight: 1.5 }}>{interpretation.lens_a?.summary || JSON.stringify(interpretation.lens_a)}</p>
              </div>
              <div style={{ padding: 16, background: '#111', borderRadius: 8, border: '1px solid #222' }}>
                <p style={{ color: '#21808d', fontSize: 11, textTransform: 'uppercase', fontWeight: 600, marginBottom: 8, letterSpacing: '0.05em' }}>Lens B</p>
                <p style={{ color: '#ccc', fontSize: 13, lineHeight: 1.5 }}>{interpretation.lens_b?.summary || JSON.stringify(interpretation.lens_b)}</p>
              </div>
            </div>
          </div>
        )}

        {/* Archetype + Confidence */}
        {interpretation && (
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#888', marginBottom: 16 }}>Archetype</h2>
            <div style={{ display: 'flex', gap: 12 }}>
              <div style={{ flex: 1, padding: 20, background: '#111', borderRadius: 8, border: '1px solid #222', textAlign: 'center' }}>
                <p style={{ color: '#21808d', fontSize: 11, textTransform: 'uppercase', fontWeight: 600, marginBottom: 8, letterSpacing: '0.05em' }}>Dominant</p>
                <p style={{ color: '#e8e8e8', fontSize: 24, fontWeight: 700 }}>{interpretation.dominant_archetype}</p>
                <p style={{ color: '#666', fontSize: 11, marginTop: 4 }}>Patterns align with this archetype</p>
              </div>
              <div style={{ flex: 1, padding: 20, background: '#111', borderRadius: 8, border: '1px solid #222', textAlign: 'center' }}>
                <p style={{ color: '#21808d', fontSize: 11, textTransform: 'uppercase', fontWeight: 600, marginBottom: 8, letterSpacing: '0.05em' }}>Confidence</p>
                <p style={{
                  fontSize: 24, fontWeight: 700, fontFamily: 'monospace',
                  color: interpretation.confidence >= 0.8 ? '#10b981' : interpretation.confidence >= 0.6 ? '#14b8a6' : '#f59e0b'
                }}>
                  {Math.round(interpretation.confidence * 100)}%
                </p>
                <p style={{ color: '#666', fontSize: 11, marginTop: 4 }}>{interpretation.model} &middot; {interpretation.processing_time_ms}ms</p>
              </div>
            </div>
          </div>
        )}

        {/* Top Archetype Scores */}
        {interpretation?.archetype_scores && interpretation.archetype_scores.length > 0 && (
          <div style={{ marginBottom: 32 }}>
            <h2 style={{ fontSize: 14, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#888', marginBottom: 16 }}>Score Distribution</h2>
            <div style={{ padding: 16, background: '#111', borderRadius: 8, border: '1px solid #222' }}>
              {interpretation.archetype_scores.slice(0, 5).map((s) => (
                <div key={s.archetype} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <span style={{ width: 80, fontSize: 12, color: '#ccc' }}>{s.archetype}</span>
                  <div style={{ flex: 1, height: 6, background: '#222', borderRadius: 3, overflow: 'hidden' }}>
                    <div style={{ width: `${Math.round(s.score * 100)}%`, height: '100%', background: '#21808d', borderRadius: 3 }} />
                  </div>
                  <span style={{ width: 40, textAlign: 'right', fontSize: 11, fontFamily: 'monospace', color: '#888' }}>{Math.round(s.score * 100)}%</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No interpretation yet */}
        {!interpretation && object.processing_status !== 'completed' && (
          <div style={{ padding: 32, background: '#111', borderRadius: 8, border: '1px solid #222', textAlign: 'center' }}>
            <p style={{ color: '#888', fontSize: 14 }}>Analysis not yet available for this object.</p>
            <p style={{ color: '#555', fontSize: 12, marginTop: 8 }}>Status: {object.processing_status}</p>
          </div>
        )}

        {/* Disclaimer */}
        <p style={{ color: '#555', fontSize: 11, textAlign: 'center', marginTop: 32 }}>
          Structural analysis tool. Not advice or diagnosis.
        </p>
      </div>
    </div>
  )
}
