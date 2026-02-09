// ============================================
// src/app/dashboard/page.tsx
// PatternLens v5.2 - Main Dashboard (Real data)
// ============================================

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { Header } from '@/components/layout/Header';
import AnalysisInput from '@/components/AnalysisInput';
import ObjectCard from '@/components/ObjectCard';
import { CrisisModal } from '@/components/safety/CrisisModal';
import { useObjects, useInterpret, useProfile, getProcessingStatus } from '@/hooks/useApi';

export default function DashboardPage() {
  const router = useRouter();

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const [loading, setLoading] = useState(true);
  const [showCrisis, setShowCrisis] = useState(false);
  const [crisisResources, setCrisisResources] = useState<any[]>([]);

  const { objects, fetchObjects, loading: objectsLoading } = useObjects();
  const { interpret, interpreting, result } = useInterpret();
  const { profile, fetchProfile, remainingObjects, canCreateObject } = useProfile();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }

      await Promise.all([fetchProfile(), fetchObjects()]);
      setLoading(false);
    };

    checkAuth();
  }, [supabase, router, fetchProfile, fetchObjects]);

  useEffect(() => {
    if (result?.crisis) {
      setCrisisResources(result.resources || []);
      setShowCrisis(true);
    }
  }, [result]);

  const handleInterpret = async (objectId: string) => {
    const res = await interpret(objectId);
    if (res && !res.error && !res.crisis) {
      await fetchObjects();
    }
  };

  const handleNewObject = async () => {
    await fetchObjects();
    await fetchProfile();
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, background: 'var(--bg-base)', color: 'var(--text-primary)' }}>
        <div className="spinner" />
        <p>{'\u0141adowanie...'}</p>
      </div>
    );
  }

  const recentObjects = objects.slice(0, 5);
  const pendingObjects = objects.filter(o => getProcessingStatus(o) === 'pending');
  const completedObjects = objects.filter(o => getProcessingStatus(o) === 'completed');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-base)' }}>
      <Header tier={profile?.tier || 'FREE'} remainingObjects={remainingObjects} />

      <main className="container" style={{ flex: 1, padding: '32px 16px' }}>
        {/* Welcome */}
        <section style={{ marginBottom: 32 }}>
          <h1 className="gradient-text" style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 700 }}>
            Dzie\u0144 dobry!
          </h1>
          <p style={{ color: 'var(--color-text-secondary)', marginTop: 4 }}>
            Co chcesz dzi\u015b przeanalizowa\u0107?
          </p>
        </section>

        {/* Stats */}
        <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, marginBottom: 32 }}>
          <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 28 }}>&#128202;</span>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-neon)' }}>{objects.length}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-tertiary)' }}>Obiekt\u00f3w</div>
            </div>
          </div>

          <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 28 }}>&#128269;</span>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-neon)' }}>{completedObjects.length}</div>
              <div style={{ fontSize: '0.875rem', color: 'var(--color-text-tertiary)' }}>Przeanalizowanych</div>
            </div>
          </div>

          <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 28 }}>{profile?.tier === 'PRO' ? '\u2b50' : '\ud83d\udcc8'}</span>
            <div>
              {profile?.tier === 'FREE' ? (
                <>
                  <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--primary-neon)' }}>{remainingObjects}/7</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-text-tertiary)' }}>Pozosta\u0142o</div>
                </>
              ) : (
                <>
                  <div><span className="badge badge-pro">PRO</span></div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--color-text-tertiary)' }}>Bez limit\u00f3w</div>
                </>
              )}
            </div>
          </div>
        </section>

        {/* New Analysis Input */}
        <section style={{ marginBottom: 32 }}>
          <h2 style={{ marginBottom: 16 }}>Nowa analiza</h2>
          <AnalysisInput
            onSuccess={handleNewObject}
            canCreate={canCreateObject}
            remaining={remainingObjects}
          />
        </section>

        {/* Pending Objects */}
        {pendingObjects.length > 0 && (
          <section style={{ marginBottom: 32 }}>
            <h2>Oczekuj\u0105ce na analiz\u0119 <span className="badge badge-warning" style={{ marginLeft: 8 }}>{pendingObjects.length}</span></h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 16, marginTop: 16 }}>
              {pendingObjects.map(obj => (
                <ObjectCard key={obj.id} object={obj} onInterpret={handleInterpret} />
              ))}
            </div>
          </section>
        )}

        {/* Recent Analyses */}
        <section style={{ marginBottom: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2>Ostatnie analizy</h2>
            <a href="/archive" className="btn btn-ghost">Zobacz wszystkie &rarr;</a>
          </div>

          {recentObjects.filter(o => getProcessingStatus(o) === 'completed').length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: 16 }}>
              {recentObjects.filter(o => getProcessingStatus(o) === 'completed').map(obj => (
                <ObjectCard key={obj.id} object={obj} onInterpret={handleInterpret} />
              ))}
            </div>
          ) : (
            <div className="glass-card" style={{ textAlign: 'center', padding: 48 }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>&#128269;</div>
              <p>Nie masz jeszcze \u017cadnych analiz.</p>
              <p style={{ color: 'var(--color-text-tertiary)', marginTop: 4 }}>Opisz sytuacj\u0119 powy\u017cej, aby rozpocz\u0105\u0107.</p>
            </div>
          )}
        </section>

        {/* Upgrade Banner */}
        {profile?.tier === 'FREE' && (
          <section className="glass-card" style={{
            display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 24,
            background: 'linear-gradient(135deg, rgba(157, 0, 255, 0.1), rgba(0, 247, 255, 0.1))',
            borderColor: 'var(--accent-purple)',
          }}>
            <div>
              <h3>Odblokuj pe\u0142ny potencja\u0142</h3>
              <p style={{ color: 'var(--color-text-secondary)' }}>Z PRO masz nieograniczon\u0105 liczb\u0119 analiz i wzorce ghost.</p>
            </div>
            <a href="/upgrade" className="btn btn-primary">Ulepsz do PRO - 49 PLN/mies</a>
          </section>
        )}
      </main>

      <footer style={{ padding: '24px 0', borderTop: '1px solid var(--color-border)' }}>
        <div className="container">
          <p style={{ color: 'var(--color-text-tertiary)', textAlign: 'center', fontSize: '0.875rem' }}>
            PatternLens to narz\u0119dzie analizy strukturalnej, nie terapia.
          </p>
        </div>
      </footer>

      <CrisisModal
        isOpen={showCrisis}
        onClose={() => setShowCrisis(false)}
        resources={crisisResources}
        level="medium"
      />
    </div>
  );
}
