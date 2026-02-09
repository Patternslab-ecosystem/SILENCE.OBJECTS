// ============================================
// src/components/AnalysisInput.tsx
// PatternLens v5.2 - Text + Voice Input
// ============================================

'use client';

import { useState } from 'react';
import { useObjects, useInterpret } from '@/hooks/useApi';
import { CrisisModal } from '@/components/safety/CrisisModal';
import { VoiceDump } from '@/components/VoiceDump';

interface AnalysisInputProps {
  onSuccess?: (objectId: string) => void;
  canCreate?: boolean;
  remaining?: number | null;
}

export function AnalysisInput({ onSuccess, canCreate = true, remaining }: AnalysisInputProps) {
  const [text, setText] = useState('');
  const [mode, setMode] = useState<'text' | 'voice'>('text');
  const [showCrisis, setShowCrisis] = useState(false);
  const [crisisResources, setCrisisResources] = useState<any[]>([]);

  const { createObject, loading: creating } = useObjects();
  const { interpret, interpreting } = useInterpret();

  const charCount = text.length;
  const minChars = 50;
  const maxChars = 5000;
  const isValid = charCount >= minChars && charCount <= maxChars;
  const isProcessing = creating || interpreting;

  const handleSubmit = async () => {
    if (!isValid || !canCreate || isProcessing) return;

    const result = await createObject(text);

    if (result.crisis) {
      setCrisisResources(result.resources || []);
      setShowCrisis(true);
      return;
    }

    if (result.success && result.object_id) {
      const interpretResult = await interpret(result.object_id);

      if (interpretResult?.crisis) {
        setCrisisResources(interpretResult.resources || []);
        setShowCrisis(true);
        return;
      }

      setText('');
      onSuccess?.(result.object_id);
    }
  };

  const handleVoiceTranscript = (transcript: string) => {
    setText(prev => prev ? prev + ' ' + transcript : transcript);
    setMode('text'); // Switch back to text to review + submit
  };

  return (
    <div className="glass-card" style={{ padding: 'var(--space-xl)' }}>
      {/* Mode Toggle */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <button
          onClick={() => setMode('text')}
          className={mode === 'text' ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
        >
          Tekst
        </button>
        <button
          onClick={() => setMode('voice')}
          className={mode === 'voice' ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
        >
          G\u0142os
        </button>
      </div>

      {/* Voice Mode */}
      {mode === 'voice' && (
        <div style={{ padding: '24px 0', textAlign: 'center' }}>
          <VoiceDump
            onTranscript={handleVoiceTranscript}
            disabled={!canCreate || isProcessing}
            maxDuration={120}
          />
          {text && (
            <div style={{ marginTop: 16, padding: 12, background: 'rgba(0,0,0,0.2)', borderRadius: 8, textAlign: 'left' }}>
              <p style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', marginBottom: 4 }}>Transkrypcja:</p>
              <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{text}</p>
            </div>
          )}
        </div>
      )}

      {/* Text Mode */}
      {mode === 'text' && (
        <div>
          <textarea
            className="input textarea"
            placeholder="Opisz sytuacj\u0119, kt\u00f3ra Ci\u0119 niepokoi lub wzorzec, kt\u00f3ry chcesz zrozumie\u0107... (min. 50 znak\u00f3w)"
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={maxChars}
            disabled={!canCreate || isProcessing}
            style={{ minHeight: 180 }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, fontSize: '0.875rem' }}>
            <div>
              <span style={{ color: charCount < minChars ? 'var(--warning)' : 'var(--success)' }}>
                {charCount}
              </span>
              <span style={{ color: 'var(--color-text-tertiary)' }}> / {minChars} min</span>
            </div>
            <div>
              {charCount < minChars ? (
                <span style={{ color: 'var(--warning)' }}>Jeszcze {minChars - charCount} znak\u00f3w</span>
              ) : (
                <span style={{ color: 'var(--success)' }}>Gotowe do analizy</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        className="btn btn-primary btn-lg"
        style={{ width: '100%', marginTop: 16 }}
        onClick={handleSubmit}
        disabled={!isValid || !canCreate || isProcessing}
      >
        {isProcessing ? (
          <>
            <span className="spinner" />
            Analizuj\u0119...
          </>
        ) : (
          'Analizuj struktur\u0119'
        )}
      </button>

      {/* Limit Warning */}
      {!canCreate && (
        <div style={{
          marginTop: 16, padding: 16,
          background: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: 8, textAlign: 'center',
        }}>
          <p style={{ color: 'var(--warning)', marginBottom: 8 }}>Osi\u0105gni\u0119to tygodniowy limit ({remaining === 0 ? '0/7' : '7/7'} obiekt\u00f3w)</p>
          <a href="/upgrade" className="btn btn-secondary btn-sm">Ulepsz do PRO</a>
        </div>
      )}

      <CrisisModal
        isOpen={showCrisis}
        onClose={() => setShowCrisis(false)}
        resources={crisisResources}
        level="medium"
      />
    </div>
  );
}

export default AnalysisInput;
