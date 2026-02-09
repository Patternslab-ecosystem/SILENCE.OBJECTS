'use client';

import { useState } from 'react';
import { useObjects, useInterpret } from '@/hooks/useApi';
import { CrisisModal } from '@/components/safety/CrisisModal';
import { VoiceDump } from '@/components/VoiceDump';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface AnalysisInputProps {
  onSuccess?: (objectId: string) => void;
  canCreate?: boolean;
  remaining?: number | null;
}

export function AnalysisInput({ onSuccess, canCreate = true, remaining }: AnalysisInputProps) {
  const { t } = useLanguage();
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
    setMode('text');
  };

  return (
    <div style={{
      background: 'var(--bg-surface)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      padding: 24,
    }}>
      {/* Mode Toggle — pill style */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 20, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--border)', width: 'fit-content' }}>
        <button
          onClick={() => setMode('text')}
          style={{
            padding: '8px 20px',
            fontSize: 13,
            fontWeight: 600,
            fontFamily: 'var(--font-mono)',
            background: mode === 'text' ? 'var(--accent-cyan)' : 'transparent',
            color: mode === 'text' ? '#fff' : 'var(--text-muted)',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 150ms',
          }}
        >
          {t.analysis.text}
        </button>
        <button
          onClick={() => setMode('voice')}
          style={{
            padding: '8px 20px',
            fontSize: 13,
            fontWeight: 600,
            fontFamily: 'var(--font-mono)',
            background: mode === 'voice' ? 'var(--accent-cyan)' : 'transparent',
            color: mode === 'voice' ? '#fff' : 'var(--text-muted)',
            border: 'none',
            borderLeft: '1px solid var(--border)',
            cursor: 'pointer',
            transition: 'all 150ms',
          }}
        >
          {t.analysis.voice}
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
            <div style={{
              marginTop: 16, padding: 14,
              background: 'var(--bg-tertiary)',
              border: '1px solid var(--border)',
              borderRadius: 8, textAlign: 'left',
            }}>
              <p style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginBottom: 4 }}>
                {t.analysis.transcription}
              </p>
              <p style={{ fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.6 }}>{text}</p>
            </div>
          )}
        </div>
      )}

      {/* Text Mode */}
      {mode === 'text' && (
        <div>
          <textarea
            className="input textarea"
            placeholder={t.analysis.placeholder}
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={maxChars}
            disabled={!canCreate || isProcessing}
            style={{ minHeight: 180 }}
          />

          <div style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            marginTop: 8, fontSize: 13, fontFamily: 'var(--font-mono)',
          }}>
            <div>
              <span style={{ color: charCount < minChars ? 'var(--warning)' : 'var(--success)' }}>
                {charCount}
              </span>
              <span style={{ color: 'var(--text-muted)' }}> / {maxChars}</span>
            </div>
            <div>
              {charCount < minChars ? (
                <span style={{ color: 'var(--warning)' }}>
                  {minChars - charCount} {t.analysis.charsRemaining}
                </span>
              ) : (
                <span style={{ color: 'var(--success)' }}>{t.analysis.readyToAnalyze}</span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Submit Button */}
      <button
        className="btn btn-primary"
        style={{ width: '100%', marginTop: 16, padding: '14px 0' }}
        onClick={handleSubmit}
        disabled={!isValid || !canCreate || isProcessing}
      >
        {isProcessing ? (
          <>
            <span className="spinner" />
            {t.analysis.analyzing}
          </>
        ) : (
          t.analysis.analyze
        )}
      </button>

      {/* Limit Warning */}
      {!canCreate && (
        <div style={{
          marginTop: 16, padding: 16,
          background: 'var(--warning-muted)',
          border: '1px solid rgba(245, 158, 11, 0.3)',
          borderRadius: 8, textAlign: 'center',
        }}>
          <p style={{ color: 'var(--warning)', marginBottom: 8, fontSize: 14 }}>
            {t.analysis.weeklyLimit} (0/7)
          </p>
          <a href="/upgrade" className="btn btn-sm btn-secondary">
            {t.analysis.upgradeToPro}
          </a>
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
