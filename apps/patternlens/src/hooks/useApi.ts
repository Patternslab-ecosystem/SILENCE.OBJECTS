// ============================================
// src/hooks/useApi.ts
// PatternLens v4.0 - API Integration Hooks
// ============================================

'use client';

import { useState, useCallback } from 'react';
import { createBrowserClient } from '@supabase/ssr';

function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// Types
export interface PLObject {
  id: string;
  input_text: string;
  input_method?: 'text' | 'voice';
  object_theme: string | null;
  selected_lens: string | null;
  risk_level: string;
  processing_status: 'pending' | 'processing' | 'completed' | 'failed';
  is_archived: boolean;
  created_at: string;
  updated_at: string;
  interpretations?: Interpretation[];
}

export interface Interpretation {
  id: string;
  object_id: string;
  lens: 'A' | 'B';
  context_phase: string;
  tension_phase: string;
  meaning_phase: string;
  function_phase: string;
  model_version: string;
  generation_time_ms: number;
  created_at: string;
}

export interface Profile {
  id: string;
  tier: 'FREE' | 'PRO';
  object_count: number;
  weekly_objects_used: number;
  locale: string;
  onboarding_completed: boolean;
}

export interface CrisisResource {
  id: string;
  name: string;
  phone: string;
  description: string;
}

// ============================================
// useObjects Hook
// ============================================
export function useObjects() {
  const [objects, setObjects] = useState<PLObject[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchObjects = useCallback(async (page = 1, limit = 20) => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`/api/objects?page=${page}&limit=${limit}`);
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Failed to fetch objects');
      
      setObjects(data.objects || []);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createObject = useCallback(async (input_text: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch('/api/objects', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input_text })
      });
      
      const data = await res.json();
      
      if (data.crisis) {
        return { crisis: true, resources: data.resources };
      }
      
      if (!res.ok) throw new Error(data.error || 'Failed to create object');
      
      return { success: true, object_id: data.object_id };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return { error: err instanceof Error ? err.message : 'Unknown error' };
    } finally {
      setLoading(false);
    }
  }, []);

  return { objects, loading, error, fetchObjects, createObject };
}

// ============================================
// useInterpret Hook
// ============================================
export function useInterpret() {
  const [interpreting, setInterpreting] = useState(false);
  const [result, setResult] = useState<{
    lensA?: Interpretation;
    lensB?: Interpretation;
    crisis?: boolean;
    resources?: CrisisResource[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const interpret = useCallback(async (object_id: string) => {
    setInterpreting(true);
    setError(null);
    setResult(null);
    
    try {
      const res = await fetch('/api/objects/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ object_id })
      });
      
      const data = await res.json();
      
      if (data.crisis) {
        setResult({ crisis: true, resources: data.resources });
        return { crisis: true, resources: data.resources };
      }
      
      if (!res.ok) throw new Error(data.error || 'Interpretation failed');
      
      setResult({
        lensA: data.interpretations?.lensA,
        lensB: data.interpretations?.lensB
      });
      
      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      return { error: err instanceof Error ? err.message : 'Unknown error' };
    } finally {
      setInterpreting(false);
    }
  }, []);

  return { interpreting, result, error, interpret };
}

// ============================================
// useProfile Hook
// ============================================
export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchProfile = useCallback(async () => {
    setLoading(true);
    const supabase = createClient();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      setProfile(data);
      return data;
    } catch (err) {
      console.error('Profile fetch error:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const remainingObjects = profile?.tier === 'FREE' 
    ? Math.max(0, 7 - (profile?.weekly_objects_used || 0))
    : null;

  const canCreateObject = profile?.tier === 'PRO' || (remainingObjects !== null && remainingObjects > 0);

  return { profile, loading, fetchProfile, remainingObjects, canCreateObject };
}

// ============================================
// usePatterns Hook
// ============================================
export function usePatterns() {
  const [patterns, setPatterns] = useState<any[]>([]);
  const [synthesizing, setSynthesizing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPatterns = useCallback(async () => {
    try {
      const res = await fetch('/api/patterns');
      const data = await res.json();
      if (data.patterns) setPatterns(data.patterns);
      return data.patterns;
    } catch {
      return [];
    }
  }, []);

  const synthesize = useCallback(async (object_ids: string[]) => {
    if (object_ids.length < 3) {
      setError('Minimum 3 obiekty wymagane');
      return null;
    }
    
    setSynthesizing(true);
    setError(null);
    
    try {
      const res = await fetch('/api/patterns', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ object_ids })
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setPatterns(prev => [...(data.patterns || []), ...prev]);
      return data.patterns;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Synthesis failed');
      return null;
    } finally {
      setSynthesizing(false);
    }
  }, []);

  return { patterns, synthesizing, error, fetchPatterns, synthesize };
}

export default {
  useObjects,
  useInterpret,
  useProfile,
  usePatterns
};
