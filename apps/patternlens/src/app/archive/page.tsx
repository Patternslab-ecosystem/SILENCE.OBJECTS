// ============================================
// src/app/archive/page.tsx
// PatternLens v4.0 - Objects Archive
// ============================================

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { Header } from '@/components/layout/Header';
import ObjectCard from '@/components/ObjectCard';
import { useObjects, useInterpret, useProfile, usePatterns, getProcessingStatus } from '@/hooks/useApi';

export default function ArchivePage() {
  const router = useRouter();
  
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
  
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  
  const { objects, fetchObjects } = useObjects();
  const { interpret } = useInterpret();
  const { profile, fetchProfile, remainingObjects } = useProfile();
  const { synthesize, synthesizing } = usePatterns();

  useEffect(() => {
    const init = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      await Promise.all([fetchProfile(), fetchObjects()]);
      setLoading(false);
    };
    init();
  }, [supabase, router, fetchProfile, fetchObjects]);

  const handleSelect = (id: string, selected: boolean) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      selected ? next.add(id) : next.delete(id);
      return next;
    });
  };

  const handleSelectAll = () => {
    if (selectedIds.size === filteredObjects.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredObjects.map(o => o.id)));
    }
  };

  const handleInterpret = async (id: string) => {
    await interpret(id);
    await fetchObjects();
  };

  const handleSynthesize = async () => {
    if (selectedIds.size < 3) {
      alert('Wybierz minimum 3 obiekty do syntezy wzorców');
      return;
    }
    const result = await synthesize(Array.from(selectedIds));
    if (result) router.push('/patterns');
  };

  const filteredObjects = objects.filter(obj => {
    if (filter === 'all') return true;
    if (filter === 'completed') return getProcessingStatus(obj) === 'completed';
    if (filter === 'pending') return getProcessingStatus(obj) === 'pending';
    return true;
  });

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner" />
        <p>Ładowanie...</p>
        <style jsx>{`
          .loading-screen {
            min-height: 100vh;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: var(--space-lg);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="archive-page">
      <Header tier={profile?.tier || 'FREE'} remainingObjects={remainingObjects} />

      <main className="container">
        <section className="page-header">
          <h1 className="gradient-text">Archiwum obiektów</h1>
          <p className="text-secondary">
            {objects.length} obiektów | {objects.filter(o => getProcessingStatus(o) === 'completed').length} przeanalizowanych
          </p>
        </section>

        <section className="toolbar glass-card-static">
          <div className="filters">
            <button className={`btn btn-sm ${filter === 'all' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilter('all')}>
              Wszystkie ({objects.length})
            </button>
            <button className={`btn btn-sm ${filter === 'completed' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilter('completed')}>
              ✓ Gotowe ({objects.filter(o => getProcessingStatus(o) === 'completed').length})
            </button>
            <button className={`btn btn-sm ${filter === 'pending' ? 'btn-primary' : 'btn-ghost'}`} onClick={() => setFilter('pending')}>
              ⏳ Oczekujące ({objects.filter(o => getProcessingStatus(o) === 'pending').length})
            </button>
          </div>

          <div className="actions">
            <button className="btn btn-ghost btn-sm" onClick={handleSelectAll}>
              {selectedIds.size === filteredObjects.length ? '☐ Odznacz' : '☑ Zaznacz wszystkie'}
            </button>
            
            {selectedIds.size >= 3 && (
              <button className="btn btn-primary btn-sm" onClick={handleSynthesize} disabled={synthesizing}>
                {synthesizing ? '⏳ Synteza...' : `🔮 Syntetyzuj wzorce (${selectedIds.size})`}
              </button>
            )}
          </div>
        </section>

        {selectedIds.size > 0 && (
          <div className="selection-info">
            <span className="text-neon">{selectedIds.size}</span> obiektów zaznaczonych
            {selectedIds.size < 3 && <span className="text-tertiary"> (min. 3 do syntezy)</span>}
          </div>
        )}

        <section className="objects-section">
          {filteredObjects.length > 0 ? (
            <div className="objects-grid">
              {filteredObjects.map(obj => (
                <ObjectCard 
                  key={obj.id} 
                  object={obj}
                  onInterpret={handleInterpret}
                  onSelect={handleSelect}
                  selectable={true}
                  selected={selectedIds.has(obj.id)}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state glass-card">
              <div className="empty-icon">📭</div>
              <p>Brak obiektów w tej kategorii</p>
            </div>
          )}
        </section>
      </main>

      <style jsx>{`
        .archive-page { min-height: 100vh; }
        main { padding: var(--space-2xl) var(--space-lg); }
        .page-header { margin-bottom: var(--space-xl); }
        .page-header h1 { margin-bottom: var(--space-sm); }
        .toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-md);
          margin-bottom: var(--space-lg);
          flex-wrap: wrap;
          gap: var(--space-md);
        }
        .filters, .actions { display: flex; gap: var(--space-sm); }
        .selection-info {
          padding: var(--space-md);
          background: rgba(0, 247, 255, 0.1);
          border-radius: var(--radius-md);
          margin-bottom: var(--space-lg);
          text-align: center;
        }
        .objects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: var(--space-lg);
        }
        .empty-state { text-align: center; padding: var(--space-3xl); }
        .empty-icon { font-size: 48px; margin-bottom: var(--space-lg); }
        @media (max-width: 768px) {
          .toolbar { flex-direction: column; }
          .filters, .actions { width: 100%; justify-content: center; }
          .objects-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
}
