// ============================================
// src/app/dashboard/page.tsx
// PatternLens v4.0 - Main Dashboard
// ============================================

'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrowserClient } from '@supabase/ssr';
import { Header } from '@/components/layout/Header';
import AnalysisInput from '@/components/AnalysisInput';
import ObjectCard from '@/components/ObjectCard';
import { CrisisModal } from '@/components/safety/CrisisModal';
import { useObjects, useInterpret, useProfile } from '@/hooks/useApi';

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
      <div className="loading-screen">
        <div className="spinner" />
        <p>Åadowanie...</p>
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

  const recentObjects = objects.slice(0, 5);
  const pendingCount = objects.filter(o => o.processing_status === 'pending').length;

  return (
    <div className="dashboard">
      <Header tier={profile?.tier || 'FREE'} remainingObjects={remainingObjects} />

      <main className="container">
        <section className="welcome-section">
          <h1 className="gradient-text">DzieÅ„ dobry! ðŸ‘‹</h1>
          <p className="text-secondary">Co chcesz dziÅ› przeanalizowaÄ‡?</p>
        </section>

        <section className="stats-grid">
          <div className="glass-card stat-card">
            <div className="stat-icon">ðŸ“Š</div>
            <div className="stat-content">
              <span className="stat-value">{objects.length}</span>
              <span className="stat-label">ObiektÃ³w</span>
            </div>
          </div>

          <div className="glass-card stat-card">
            <div className="stat-icon">ðŸ”</div>
            <div className="stat-content">
              <span className="stat-value">
                {objects.filter(o => o.processing_status === 'completed').length}
              </span>
              <span className="stat-label">Przeanalizowanych</span>
            </div>
          </div>

          <div className="glass-card stat-card">
            <div className="stat-icon">{profile?.tier === 'PRO' ? 'â­' : 'ðŸ“ˆ'}</div>
            <div className="stat-content">
              {profile?.tier === 'FREE' ? (
                <>
                  <span className="stat-value">{remainingObjects}/7</span>
                  <span className="stat-label">PozostaÅ‚o</span>
                </>
              ) : (
                <>
                  <span className="stat-value badge badge-pro">PRO</span>
                  <span className="stat-label">Bez limitÃ³w</span>
                </>
              )}
            </div>
          </div>
        </section>

        <section className="input-section">
          <h2>Nowa analiza</h2>
          <AnalysisInput 
            onSuccess={handleNewObject}
            canCreate={canCreateObject}
            remaining={remainingObjects}
          />
        </section>

        {pendingCount > 0 && (
          <section className="pending-section">
            <h2>OczekujÄ…ce na analizÄ™ <span className="badge badge-warning ml-md">{pendingCount}</span></h2>
            <div className="objects-grid">
              {objects.filter(o => o.processing_status === 'pending').map(obj => (
                <ObjectCard key={obj.id} object={obj} onInterpret={handleInterpret} />
              ))}
            </div>
          </section>
        )}

        <section className="recent-section">
          <div className="section-header">
            <h2>Ostatnie analizy</h2>
            <a href="/archive" className="btn btn-ghost">Zobacz wszystkie â†’</a>
          </div>
          
          {recentObjects.length > 0 ? (
            <div className="objects-grid">
              {recentObjects.filter(o => o.processing_status === 'completed').map(obj => (
                <ObjectCard key={obj.id} object={obj} onInterpret={handleInterpret} />
              ))}
            </div>
          ) : (
            <div className="empty-state glass-card">
              <div className="empty-icon">ðŸ”</div>
              <p>Nie masz jeszcze Å¼adnych analiz.</p>
              <p className="text-tertiary">Opisz sytuacjÄ™ powyÅ¼ej, aby rozpoczÄ…Ä‡.</p>
            </div>
          )}
        </section>

        {profile?.tier === 'FREE' && (
          <section className="upgrade-banner glass-card">
            <div className="upgrade-content">
              <h3>ðŸš€ Odblokuj peÅ‚ny potencjaÅ‚</h3>
              <p className="text-secondary">Z PRO masz nieograniczonÄ… liczbÄ™ analiz i wzorce ghost.</p>
            </div>
            <a href="/upgrade" className="btn btn-primary">Ulepsz do PRO - 49 PLN/mies</a>
          </section>
        )}
      </main>

      <footer className="footer">
        <div className="container">
          <p className="text-tertiary text-center">
            âš ï¸ PatternLens to narzÄ™dzie analizy strukturalnej, nie terapia.
          </p>
        </div>
      </footer>

      <CrisisModal
        isOpen={showCrisis}
        onClose={() => setShowCrisis(false)}
        resources={crisisResources}
        level="medium"
      />

      <style jsx>{`
        .dashboard { min-height: 100vh; display: flex; flex-direction: column; }
        main { flex: 1; padding: var(--space-2xl) var(--space-lg); }
        .welcome-section { margin-bottom: var(--space-2xl); }
        .welcome-section h1 { margin-bottom: var(--space-sm); }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: var(--space-lg);
          margin-bottom: var(--space-2xl);
        }
        .stat-card {
          display: flex;
          align-items: center;
          gap: var(--space-md);
          padding: var(--space-lg);
        }
        .stat-icon { font-size: 32px; }
        .stat-content { display: flex; flex-direction: column; }
        .stat-value { font-size: var(--font-size-2xl); font-weight: 700; color: var(--primary-neon); }
        .stat-label { font-size: var(--font-size-sm); color: var(--color-text-tertiary); }
        .input-section { margin-bottom: var(--space-2xl); }
        .input-section h2 { margin-bottom: var(--space-lg); }
        .pending-section, .recent-section { margin-bottom: var(--space-2xl); }
        .section-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: var(--space-lg);
        }
        .objects-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: var(--space-lg);
        }
        .empty-state { text-align: center; padding: var(--space-3xl); }
        .empty-icon { font-size: 48px; margin-bottom: var(--space-lg); }
        .upgrade-banner {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: var(--space-xl);
          background: linear-gradient(135deg, rgba(157, 0, 255, 0.1), rgba(0, 247, 255, 0.1));
          border-color: var(--accent-purple);
        }
        .upgrade-content h3 { margin-bottom: var(--space-sm); }
        .footer { padding: var(--space-xl) 0; border-top: 1px solid var(--color-border); }
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: repeat(3, 1fr); }
          .stat-card { flex-direction: column; text-align: center; padding: var(--space-md); }
          .objects-grid { grid-template-columns: 1fr; }
          .upgrade-banner { flex-direction: column; text-align: center; gap: var(--space-lg); }
        }
      `}</style>
    </div>
  );
}
