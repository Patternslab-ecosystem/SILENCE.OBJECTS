// ============================================
// src/components/ObjectCard.tsx
// PatternLens v4.0 - Object Display Card
// ============================================

'use client';

import { useState } from 'react';
import type { PLObject } from '@/hooks/useApi';
import { getProcessingStatus } from '@/hooks/useApi';

interface ObjectCardProps {
  object: PLObject;
  onInterpret?: (id: string) => void;
  onSelect?: (id: string, selected: boolean) => void;
  selectable?: boolean;
  selected?: boolean;
}

export function ObjectCard({ 
  object, 
  onInterpret, 
  onSelect,
  selectable = false,
  selected = false 
}: ObjectCardProps) {
  const [expanded, setExpanded] = useState(false);

  const status = getProcessingStatus(object);

  const getRiskBadge = () => {
    const risk = object.interpretations?.[0]?.risk_level;
    switch (risk?.toLowerCase()) {
      case 'none':
      case 'low':
        return <span className="badge badge-success">NISKIE</span>;
      case 'medium':
        return <span className="badge badge-warning">ŚREDNIE</span>;
      case 'high':
      case 'crisis':
        return <span className="badge badge-danger">WYSOKIE</span>;
      default:
        return null;
    }
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'completed':
        return <span className="badge badge-success">Gotowe</span>;
      default:
        return <span className="badge badge-info">Oczekuje</span>;
    }
  };

  const formatDate = (date: string) => {
    const d = new Date(date);
    const now = new Date();
    const diff = now.getTime() - d.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Dzisiaj';
    if (days === 1) return 'Wczoraj';
    if (days < 7) return `${days} dni temu`;
    return d.toLocaleDateString('pl-PL');
  };

  const lensA = object.interpretations?.find(i => i.lens === 'A');
  const lensB = object.interpretations?.find(i => i.lens === 'B');

  return (
    <div className={`object-card glass-card ${selected ? 'selected' : ''}`}>
      {selectable && (
        <div className="card-checkbox">
          <input 
            type="checkbox" 
            checked={selected}
            onChange={(e) => onSelect?.(object.id, e.target.checked)}
          />
        </div>
      )}

      <div className="card-header">
        <div className="card-meta">
          <span className="card-date">{formatDate(object.created_at)}</span>
          <span className="card-source">
            {object.input_method === 'voice' ? '🎤' : '✍️'}
          </span>
        </div>
        <div className="card-badges">
          {getRiskBadge()}
          {getStatusBadge()}
        </div>
      </div>

      <div className="card-content">
        <p className="card-text">
          {object.input_text.substring(0, 150)}
          {object.input_text.length > 150 && '...'}
        </p>
        
        {object.detected_theme && (
          <div className="card-theme">
            <span className="theme-label">Temat:</span>
            <span className="theme-value">{object.detected_theme}</span>
          </div>
        )}
      </div>

      {/* Interpretations Preview */}
      {status === 'completed' && (lensA || lensB) && (
        <div className={`card-interpretations ${expanded ? 'expanded' : ''}`}>
          <button
            className="expand-btn"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? 'Zwi\u0144' : 'Poka\u017c interpretacje'}
          </button>

          {expanded && (
            <div className="interpretations-grid">
              {lensA && (
                <div className="lens-card lens-a">
                  <h4>Soczewka A <span className="lens-subtitle">Ochronna</span></h4>
                  <div className="lens-phases">
                    <div className="phase">
                      <span className="phase-label">Kontekst</span>
                      <p>{lensA.phase_1_context?.content || ''}</p>
                    </div>
                    <div className="phase">
                      <span className="phase-label">Napi\u0119cie</span>
                      <p>{lensA.phase_2_tension?.content || ''}</p>
                    </div>
                    <div className="phase">
                      <span className="phase-label">Znaczenie</span>
                      <p>{lensA.phase_3_meaning?.content || ''}</p>
                    </div>
                    <div className="phase">
                      <span className="phase-label">Funkcja</span>
                      <p>{lensA.phase_4_function?.content || ''}</p>
                    </div>
                  </div>
                </div>
              )}

              {lensB && (
                <div className="lens-card lens-b">
                  <h4>Soczewka B <span className="lens-subtitle">Rozwojowa</span></h4>
                  <div className="lens-phases">
                    <div className="phase">
                      <span className="phase-label">Kontekst</span>
                      <p>{lensB.phase_1_context?.content || ''}</p>
                    </div>
                    <div className="phase">
                      <span className="phase-label">Napi\u0119cie</span>
                      <p>{lensB.phase_2_tension?.content || ''}</p>
                    </div>
                    <div className="phase">
                      <span className="phase-label">Znaczenie</span>
                      <p>{lensB.phase_3_meaning?.content || ''}</p>
                    </div>
                    <div className="phase">
                      <span className="phase-label">Funkcja</span>
                      <p>{lensB.phase_4_function?.content || ''}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="card-actions">
        {status === 'pending' && (
          <button
            className="btn btn-primary btn-sm"
            onClick={() => onInterpret?.(object.id)}
          >
            Analizuj
          </button>
        )}
      </div>

      <style jsx>{`
        .object-card {
          position: relative;
        }

        .object-card.selected {
          border-color: var(--primary-neon);
          box-shadow: 0 0 20px rgba(0, 247, 255, 0.3);
        }

        .card-checkbox {
          position: absolute;
          top: var(--space-md);
          left: var(--space-md);
        }

        .card-checkbox input {
          width: 20px;
          height: 20px;
          cursor: pointer;
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: var(--space-md);
        }

        .card-meta {
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }

        .card-date {
          color: var(--color-text-tertiary);
          font-size: var(--font-size-sm);
        }

        .card-source {
          font-size: 16px;
        }

        .card-badges {
          display: flex;
          gap: var(--space-sm);
        }

        .card-content {
          margin-bottom: var(--space-md);
        }

        .card-text {
          color: var(--color-text-secondary);
          line-height: 1.6;
        }

        .card-theme {
          margin-top: var(--space-sm);
          font-size: var(--font-size-sm);
        }

        .theme-label {
          color: var(--color-text-tertiary);
        }

        .theme-value {
          color: var(--primary-neon);
          margin-left: var(--space-xs);
        }

        .card-interpretations {
          border-top: 1px solid var(--color-border);
          padding-top: var(--space-md);
        }

        .expand-btn {
          background: none;
          border: none;
          color: var(--color-text-secondary);
          cursor: pointer;
          font-size: var(--font-size-sm);
          padding: var(--space-sm);
          width: 100%;
          text-align: center;
        }

        .expand-btn:hover {
          color: var(--primary-neon);
        }

        .interpretations-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: var(--space-md);
          margin-top: var(--space-md);
        }

        .lens-card {
          padding: var(--space-md);
          border-radius: var(--radius-md);
          background: rgba(0, 0, 0, 0.2);
        }

        .lens-a {
          border-left: 3px solid var(--primary-neon);
        }

        .lens-b {
          border-left: 3px solid var(--accent-purple);
        }

        .lens-card h4 {
          font-size: var(--font-size-base);
          margin-bottom: var(--space-md);
          display: flex;
          align-items: center;
          gap: var(--space-sm);
        }

        .lens-subtitle {
          font-size: var(--font-size-xs);
          color: var(--color-text-tertiary);
          font-weight: normal;
        }

        .lens-phases {
          display: flex;
          flex-direction: column;
          gap: var(--space-sm);
        }

        .phase {
          padding: var(--space-sm);
          background: rgba(0, 0, 0, 0.2);
          border-radius: var(--radius-sm);
        }

        .phase-label {
          display: block;
          font-size: var(--font-size-xs);
          color: var(--color-text-tertiary);
          text-transform: uppercase;
          margin-bottom: var(--space-xs);
        }

        .phase p {
          font-size: var(--font-size-sm);
          color: var(--color-text-secondary);
          margin: 0;
        }

        .card-actions {
          display: flex;
          gap: var(--space-sm);
          margin-top: var(--space-md);
        }
      `}</style>
    </div>
  );
}

export default ObjectCard;
