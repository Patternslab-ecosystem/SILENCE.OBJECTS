// ============================================
// src/components/AnalysisInput.tsx
// PatternLens v4.0 - Text Input Component (simplified)
// ============================================

'use client';

import { useState } from 'react';
import { useObjects, useInterpret } from '@/hooks/useApi';
import { CrisisModal } from '@/components/safety/CrisisModal';

interface AnalysisInputProps {
  onSuccess?: (objectId: string) => void;
  canCreate?: boolean;
  remaining?: number | null;
}

export function AnalysisInput({ onSuccess, canCreate = true, remaining }: AnalysisInputProps) {
  const [text, setText] = useState('');
  const [showCrisis, setShowCrisis] = useState(false);
  const [crisisResources, setCrisisResources] = useState<any[]>([]);

  const { createObject, loading: creating } = useObjects();
  const { interpret, interpreting } = useInterpret();

  const charCount = text.length;
  const minChars = 50;
  const maxChars = 5000;
  const isValid = charCount >= minChars && charCount <= maxChars;

  const handleSubmit = async () => {
    if (!isValid || !canCreate) return;

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

  return (
    <div className="analysis-input glass-card">
      <div className="input-wrapper">
        <textarea
          className="input textarea"
          placeholder="Opisz sytuację, która Cię niepokoi lub wzorzec, który chcesz zrozumieć... (min. 50 znaków)"
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={maxChars}
          disabled={!canCreate}
        />
        
        <div className="input-footer">
          <div className="char-counter">
            <span className={charCount < minChars ? 'text-warning' : 'text-success'}>
              {charCount}
            </span>
            <span className="text-tertiary"> / {minChars} min</span>
          </div>
          
          <div className="char-status">
            {charCount < minChars ? (
              <span className="text-warning">✋ Jeszcze {minChars - charCount} znaków</span>
            ) : (
              <span className="text-success">✅ Gotowe do analizy</span>
            )}
          </div>
        </div>
      </div>

      <button
        className="btn btn-primary btn-lg btn-full mt-lg"
        onClick={handleSubmit}
        disabled={!isValid || !canCreate || creating || interpreting}
      >
        {creating || interpreting ? (
          <>
            <span className="spinner" />
            Analizuję...
          </>
        ) : (
          '🔍 Analizuj strukturę'
        )}
      </button>

      {!canCreate && (
        <div className="limit-warning">
          <p className="text-warning">🚫 Osiągnięto tygodniowy limit ({remaining === 0 ? '0/7' : '7/7'} obiektów)</p>
          <a href="/upgrade" className="btn btn-secondary btn-sm">Ulepsz do PRO</a>
        </div>
      )}

      <CrisisModal
        isOpen={showCrisis}
        onClose={() => setShowCrisis(false)}
        resources={crisisResources}
        level="medium"
      />

      <style jsx>{`
        .analysis-input { padding: var(--space-xl); }
        .input-wrapper { margin-top: var(--space-lg); }
        .textarea { min-height: 180px; }
        .input-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: var(--space-sm);
          font-size: var(--font-size-sm);
        }
        .limit-warning {
          margin-top: var(--space-lg);
          padding: var(--space-lg);
          background: rgba(245, 158, 11, 0.1);
          border: 1px solid rgba(245, 158, 11, 0.3);
          border-radius: var(--radius-md);
          text-align: center;
        }
        .limit-warning p { margin-bottom: var(--space-md); }
      `}</style>
    </div>
  );
}

export default AnalysisInput;
