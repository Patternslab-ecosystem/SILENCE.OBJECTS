-- ============================================
-- 002_full_schema.sql
-- SILENCE.OBJECTS Full Database Schema
-- Run manually in Supabase SQL Editor
-- ============================================

-- PROFILES (extends auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  tier TEXT DEFAULT 'free' CHECK (tier IN ('free', 'pro', 'enterprise')),
  object_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- OBJECTS
CREATE TABLE IF NOT EXISTS objects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  input_text TEXT NOT NULL CHECK (char_length(input_text) >= 10 AND char_length(input_text) <= 5000),
  input_method TEXT NOT NULL DEFAULT 'text' CHECK (input_method IN ('text', 'voice')),
  processing_status TEXT NOT NULL DEFAULT 'pending' CHECK (processing_status IN ('pending', 'processing', 'completed', 'failed', 'blocked')),
  crisis_level TEXT DEFAULT 'NONE' CHECK (crisis_level IN ('NONE', 'LOW', 'MEDIUM', 'HIGH', 'CRITICAL')),
  crisis_category TEXT CHECK (crisis_category IN ('SUICIDE', 'SELF_HARM', 'VIOLENCE', 'PANIC', 'EATING_DISORDER', 'SUBSTANCE', 'ABUSE')),
  deleted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- INTERPRETATIONS
CREATE TABLE IF NOT EXISTS interpretations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  object_id UUID NOT NULL REFERENCES objects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lens_a JSONB NOT NULL,
  lens_b JSONB NOT NULL,
  dominant_archetype TEXT NOT NULL,
  archetype_scores JSONB NOT NULL,
  confidence REAL NOT NULL DEFAULT 0,
  processing_time_ms INTEGER,
  model TEXT NOT NULL DEFAULT 'mock',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- PATTERNS
CREATE TABLE IF NOT EXISTS patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  object_id UUID NOT NULL REFERENCES objects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  label TEXT NOT NULL,
  confidence REAL NOT NULL DEFAULT 0,
  archetype_alignment TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ARCHETYPE HISTORY
CREATE TABLE IF NOT EXISTS archetype_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  blend JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- NUCLEAR EVENTS (safety log)
CREATE TABLE IF NOT EXISTS nuclear_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  session_id TEXT,
  event_type TEXT NOT NULL CHECK (event_type IN ('CRISIS_DETECTED', 'INTERVENTION_SHOWN', 'RESOURCE_CLICKED', 'ESCALATION')),
  crisis_level TEXT NOT NULL,
  crisis_category TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- EVENTS LOG (all @silence/events persisted)
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL,
  payload JSONB NOT NULL,
  source TEXT NOT NULL,
  tenant_id UUID,
  user_id UUID,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES
CREATE INDEX IF NOT EXISTS idx_objects_user ON objects(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_objects_status ON objects(processing_status);
CREATE INDEX IF NOT EXISTS idx_interpretations_object ON interpretations(object_id);
CREATE INDEX IF NOT EXISTS idx_interpretations_user ON interpretations(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_patterns_user ON patterns(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_patterns_object ON patterns(object_id);
CREATE INDEX IF NOT EXISTS idx_archetype_history_user ON archetype_history(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(type, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_nuclear_events_user ON nuclear_events(user_id, created_at DESC);

-- RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE objects ENABLE ROW LEVEL SECURITY;
ALTER TABLE interpretations ENABLE ROW LEVEL SECURITY;
ALTER TABLE patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE archetype_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE nuclear_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- RLS POLICIES
DO $$ BEGIN
  -- Profiles
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users read own profile') THEN
    CREATE POLICY "Users read own profile" ON profiles FOR SELECT USING (auth.uid() = id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users update own profile') THEN
    CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
  END IF;

  -- Objects
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users read own objects') THEN
    CREATE POLICY "Users read own objects" ON objects FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users create own objects') THEN
    CREATE POLICY "Users create own objects" ON objects FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users update own objects') THEN
    CREATE POLICY "Users update own objects" ON objects FOR UPDATE USING (auth.uid() = user_id);
  END IF;

  -- Interpretations
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users read own interpretations') THEN
    CREATE POLICY "Users read own interpretations" ON interpretations FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users insert own interpretations') THEN
    CREATE POLICY "Users insert own interpretations" ON interpretations FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Patterns
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users read own patterns') THEN
    CREATE POLICY "Users read own patterns" ON patterns FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users insert own patterns') THEN
    CREATE POLICY "Users insert own patterns" ON patterns FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Archetype history
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users read own archetype_history') THEN
    CREATE POLICY "Users read own archetype_history" ON archetype_history FOR SELECT USING (auth.uid() = user_id);
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Users insert own archetype_history') THEN
    CREATE POLICY "Users insert own archetype_history" ON archetype_history FOR INSERT WITH CHECK (auth.uid() = user_id);
  END IF;

  -- Nuclear events (system-wide insert)
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'System insert nuclear events') THEN
    CREATE POLICY "System insert nuclear events" ON nuclear_events FOR INSERT WITH CHECK (true);
  END IF;

  -- Events (system-wide insert)
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'System insert events') THEN
    CREATE POLICY "System insert events" ON events FOR INSERT WITH CHECK (true);
  END IF;
END $$;

-- AUTO-CREATE PROFILE ON SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
