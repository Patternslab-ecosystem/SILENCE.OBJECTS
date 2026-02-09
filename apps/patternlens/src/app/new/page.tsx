'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useObjects, useInterpret } from '@/hooks/useApi'
import { VoiceDump } from '@/components/VoiceDump'

export default function NewObject() {
  const router = useRouter()
  const [text, setText] = useState('')
  const [mode, setMode] = useState<'text' | 'voice'>('text')
  const [crisisLock, setCrisisLock] = useState(false)
  const [crisisResources, setCrisisResources] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  const { createObject, loading: creating } = useObjects()
  const { interpret, interpreting, result } = useInterpret()

  const isProcessing = creating || interpreting
  const minChars = 50

  async function handleSubmit() {
    if (isProcessing || crisisLock || text.length < minChars) return
    setError(null)

    // Step 1: Create object in Supabase
    const createResult = await createObject(text)

    if (createResult.crisis) {
      setCrisisLock(true)
      setCrisisResources(createResult.resources || [])
      return
    }

    if (createResult.error) {
      setError(createResult.error)
      return
    }

    if (!createResult.success || !createResult.object_id) {
      setError('Failed to create object')
      return
    }

    // Step 2: Run dual-lens AI interpretation
    const interpretResult = await interpret(createResult.object_id)

    if (interpretResult?.crisis) {
      setCrisisLock(true)
      setCrisisResources(interpretResult.resources || [])
      return
    }

    // Step 3: Redirect to object detail
    router.push(`/objects/${createResult.object_id}`)
  }

  const handleVoiceTranscript = (transcript: string) => {
    setText(prev => prev ? prev + ' ' + transcript : transcript)
    setMode('text')
  }

  const lensA = result?.lensA
  const lensB = result?.lensB
  const hasResult = lensA || lensB

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
            <span style={{ fontSize: 10, color: '#55555e', marginLeft: 8, border: '1px solid #222228', borderRadius: 999, padding: '2px 8px' }}>v5.2</span>
          </span>
        </div>
      </nav>

      <main style={{ maxWidth: 800, margin: '0 auto', padding: '40px 20px' }}>
        <Link href="/dashboard" style={{
          color: '#888893', fontSize: 13, textDecoration: 'none',
          fontFamily: "'JetBrains Mono', monospace",
          marginBottom: 32, display: 'inline-block',
        }}>
          &larr; Dashboard
        </Link>

        <h1 style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, fontSize: 24, marginBottom: 8 }}>
          Nowy Obiekt
        </h1>
        <p style={{ fontFamily: "'Outfit', sans-serif", color: '#888893', fontSize: 14, marginBottom: 28 }}>
          Opisz sytuację do analizy strukturalnej
        </p>

        {/* Mode Toggle */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <button
            onClick={() => setMode('text')}
            style={{
              padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
              background: mode === 'text' ? '#21808d' : '#1a1a1e',
              color: mode === 'text' ? '#fff' : '#888893',
            }}
          >
            Tekst
          </button>
          <button
            onClick={() => setMode('voice')}
            style={{
              padding: '8px 16px', borderRadius: 8, border: 'none', cursor: 'pointer',
              fontFamily: "'JetBrains Mono', monospace", fontSize: 13,
              background: mode === 'voice' ? '#21808d' : '#1a1a1e',
              color: mode === 'voice' ? '#fff' : '#888893',
            }}
          >
            Głos
          </button>
        </div>

        {/* Voice Mode */}
        {mode === 'voice' && (
          <div style={{ padding: '32px 0', textAlign: 'center' }}>
            <VoiceDump
              onTranscript={handleVoiceTranscript}
              disabled={crisisLock || isProcessing}
              maxDuration={120}
            />
            {text && (
              <div style={{ marginTop: 16, padding: 16, background: '#1a1a1e', borderRadius: 12, border: '1px solid #222228', textAlign: 'left' }}>
                <p style={{ fontSize: 11, color: '#55555e', fontFamily: "'JetBrains Mono', monospace", marginBottom: 4 }}>Transkrypcja:</p>
                <p style={{ fontSize: 14, color: '#e8e8ec', fontFamily: "'Outfit', sans-serif", lineHeight: 1.6 }}>{text}</p>
              </div>
            )}
          </div>
        )}

        {/* Text Mode */}
        {mode === 'text' && (
          <>
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              disabled={crisisLock || isProcessing}
              placeholder="Opisz sytuację, interakcję lub zaobserwowany wzorzec..."
              style={{
                width: '100%', minHeight: 240, padding: 20,
                background: '#1a1a1e', border: '1px solid #222228',
                borderRadius: 12, color: '#e8e8ec', fontSize: 14,
                fontFamily: "'Outfit', sans-serif", resize: 'vertical',
                lineHeight: 1.6, outline: 'none',
                opacity: crisisLock ? 0.4 : 1,
              }}
              onFocus={(e) => { e.target.style.borderColor = '#21808d'; }}
              onBlur={(e) => { e.target.style.borderColor = '#222228'; }}
            />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, marginBottom: 12 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: text.length < minChars ? '#d4a843' : '#3d9970' }}>
                {text.length} / 5000 {text.length < minChars && `(min. ${minChars})`}
              </span>
            </div>
          </>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={isProcessing || crisisLock || text.length < minChars}
          style={{
            padding: '14px 32px', width: '100%',
            background: isProcessing ? 'rgba(33,128,141,0.5)' : (text.length < minChars ? 'rgba(33,128,141,0.3)' : '#21808d'),
            color: '#fff', border: 'none', borderRadius: 12,
            fontFamily: "'JetBrains Mono', monospace",
            fontWeight: 600, fontSize: 14,
            cursor: isProcessing ? 'wait' : (text.length < minChars ? 'not-allowed' : 'pointer'),
            opacity: text.length < minChars ? 0.4 : 1,
          }}
        >
          {creating ? 'Zapisuję obiekt...' : interpreting ? 'Analiza AI (dual-lens)...' : 'Analizuj Obiekt'}
        </button>

        {/* Error */}
        {error && (
          <div style={{ marginTop: 16, padding: 16, background: 'rgba(204,68,68,0.05)', borderRadius: 12, border: '1px solid rgba(204,68,68,0.2)' }}>
            <p style={{ color: '#cc4444', fontSize: 13 }}>{error}</p>
          </div>
        )}

        {/* Crisis Response */}
        {crisisLock && crisisResources.length > 0 && (
          <div style={{
            marginTop: 32, padding: 32,
            background: 'rgba(204,68,68,0.05)',
            border: '2px solid rgba(204,68,68,0.3)',
            borderRadius: 16,
          }}>
            <h2 style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontWeight: 600, fontSize: 18, color: '#cc4444',
              textAlign: 'center', marginBottom: 16,
            }}>
              Wykryto treść wymagającą uwagi
            </h2>
            <p style={{ color: '#888893', fontSize: 13, textAlign: 'center', marginBottom: 24 }}>
              PatternLens to narzędzie analizy strukturalnej. W sytuacji kryzysowej skontaktuj się z profesjonalną pomocą.
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {crisisResources.map((r: any, i: number) => (
                <a key={i} href={`tel:${String(r.phone || '').replace(/\s/g, '')}`} style={{
                  display: 'block', padding: 16,
                  background: 'rgba(204,68,68,0.08)',
                  border: '1px solid rgba(204,68,68,0.2)',
                  borderRadius: 10, textDecoration: 'none', textAlign: 'center',
                }}>
                  <p style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 20, fontWeight: 700, color: '#cc4444', marginBottom: 4 }}>
                    {String(r.phone)}
                  </p>
                  <p style={{ fontSize: 12, color: '#888893' }}>{String(r.name)}</p>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Dual-Lens Results (shown before redirect) */}
        {hasResult && !crisisLock && (
          <div style={{ marginTop: 32 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              <h2 style={{ fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, fontSize: 18 }}>Analiza strukturalna</h2>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#21808d', border: '1px solid rgba(33,128,141,0.3)', borderRadius: 999, padding: '2px 10px' }}>dual-lens</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
              {lensA && (
                <div style={{ padding: 20, background: '#111113', border: '1px solid rgba(33,128,141,0.3)', borderRadius: 12 }}>
                  <div style={{ marginBottom: 12 }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#21808d', letterSpacing: '0.1em' }}>SOCZEWKA A</span>
                    <span style={{ fontSize: 11, color: '#55555e', marginLeft: 8 }}>Ochronna</span>
                  </div>
                  {['phase_1_context', 'phase_2_tension', 'phase_3_meaning', 'phase_4_function'].map(key => {
                    const phase = (lensA as any)[key];
                    return phase?.content ? (
                      <div key={key} style={{ marginBottom: 8, padding: 8, background: 'rgba(0,0,0,0.2)', borderRadius: 6 }}>
                        <p style={{ fontSize: 10, color: '#21808d', textTransform: 'uppercase', marginBottom: 4 }}>{phase.title}</p>
                        <p style={{ fontSize: 13, color: '#e8e8ec', lineHeight: 1.5 }}>{phase.content}</p>
                      </div>
                    ) : null;
                  })}
                </div>
              )}

              {lensB && (
                <div style={{ padding: 20, background: '#111113', border: '1px solid rgba(212,168,67,0.3)', borderRadius: 12 }}>
                  <div style={{ marginBottom: 12 }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: '#d4a843', letterSpacing: '0.1em' }}>SOCZEWKA B</span>
                    <span style={{ fontSize: 11, color: '#55555e', marginLeft: 8 }}>Rozwojowa</span>
                  </div>
                  {['phase_1_context', 'phase_2_tension', 'phase_3_meaning', 'phase_4_function'].map(key => {
                    const phase = (lensB as any)[key];
                    return phase?.content ? (
                      <div key={key} style={{ marginBottom: 8, padding: 8, background: 'rgba(0,0,0,0.2)', borderRadius: 6 }}>
                        <p style={{ fontSize: 10, color: '#d4a843', textTransform: 'uppercase', marginBottom: 4 }}>{phase.title}</p>
                        <p style={{ fontSize: 13, color: '#e8e8ec', lineHeight: 1.5 }}>{phase.content}</p>
                      </div>
                    ) : null;
                  })}
                </div>
              )}
            </div>

            <p style={{ fontSize: 10, color: '#55555e', textAlign: 'center' }}>
              Propozycja analizy strukturalnej. Nie porada, nie diagnoza.
            </p>
          </div>
        )}
      </main>
    </div>
  )
}
