-- CreatorOS Middleware MVP - Supabase Database Schema
-- Run this in your Supabase SQL Editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  platform_connections JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Episodes table
CREATE TABLE IF NOT EXISTS episodes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL DEFAULT 'demo-user',
  title TEXT NOT NULL,
  description TEXT,
  original_language TEXT NOT NULL DEFAULT 'en',
  target_language TEXT NOT NULL DEFAULT 'es',
  audio_url TEXT NOT NULL,
  file_size BIGINT,
  duration INTEGER,
  status TEXT NOT NULL DEFAULT 'processing' CHECK (status IN ('uploading', 'processing', 'completed', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Processing steps table
CREATE TABLE IF NOT EXISTS processing_steps (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  episode_id UUID NOT NULL REFERENCES episodes(id) ON DELETE CASCADE,
  step_id TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'completed', 'error')),
  progress INTEGER DEFAULT 0,
  logs JSONB DEFAULT '[]'::jsonb,
  error TEXT,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(episode_id, step_id)
);

-- Transcripts table
CREATE TABLE IF NOT EXISTS transcripts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  episode_id UUID NOT NULL REFERENCES episodes(id) ON DELETE CASCADE,
  language TEXT NOT NULL,
  text TEXT NOT NULL,
  segments JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Translations table
CREATE TABLE IF NOT EXISTS translations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  episode_id UUID NOT NULL REFERENCES episodes(id) ON DELETE CASCADE,
  original_language TEXT NOT NULL,
  target_language TEXT NOT NULL,
  original_text TEXT NOT NULL,
  translated_text TEXT NOT NULL,
  cultural_adaptations JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Generated audio table
CREATE TABLE IF NOT EXISTS generated_audio (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  episode_id UUID NOT NULL REFERENCES episodes(id) ON DELETE CASCADE,
  language TEXT NOT NULL,
  audio_url TEXT NOT NULL,
  duration INTEGER,
  voice_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Distributions table
CREATE TABLE IF NOT EXISTS distributions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  episode_id UUID NOT NULL REFERENCES episodes(id) ON DELETE CASCADE,
  platform TEXT NOT NULL CHECK (platform IN ('youtube', 'linkedin', 'discord', 'email', 'rss')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'publishing', 'published', 'failed')),
  platform_url TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  published_at TIMESTAMPTZ,
  error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_episodes_user_id ON episodes(user_id);
CREATE INDEX IF NOT EXISTS idx_episodes_status ON episodes(status);
CREATE INDEX IF NOT EXISTS idx_processing_steps_episode_id ON processing_steps(episode_id);
CREATE INDEX IF NOT EXISTS idx_transcripts_episode_id ON transcripts(episode_id);
CREATE INDEX IF NOT EXISTS idx_translations_episode_id ON translations(episode_id);
CREATE INDEX IF NOT EXISTS idx_generated_audio_episode_id ON generated_audio(episode_id);
CREATE INDEX IF NOT EXISTS idx_distributions_episode_id ON distributions(episode_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_episodes_updated_at BEFORE UPDATE ON episodes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_processing_steps_updated_at BEFORE UPDATE ON processing_steps
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE episodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE processing_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE transcripts ENABLE ROW LEVEL SECURITY;
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE generated_audio ENABLE ROW LEVEL SECURITY;
ALTER TABLE distributions ENABLE ROW LEVEL SECURITY;

-- RLS Policies (for MVP, we'll use permissive policies)
-- In production, you'd want to restrict based on auth.uid()

-- Users policies
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (true);

-- Episodes policies
CREATE POLICY "Anyone can view episodes" ON episodes
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert episodes" ON episodes
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update episodes" ON episodes
  FOR UPDATE USING (true);

-- Processing steps policies
CREATE POLICY "Anyone can view processing steps" ON processing_steps
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert processing steps" ON processing_steps
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update processing steps" ON processing_steps
  FOR UPDATE USING (true);

-- Transcripts policies
CREATE POLICY "Anyone can view transcripts" ON transcripts
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert transcripts" ON transcripts
  FOR INSERT WITH CHECK (true);

-- Translations policies
CREATE POLICY "Anyone can view translations" ON translations
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert translations" ON translations
  FOR INSERT WITH CHECK (true);

-- Generated audio policies
CREATE POLICY "Anyone can view generated audio" ON generated_audio
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert generated audio" ON generated_audio
  FOR INSERT WITH CHECK (true);

-- Distributions policies
CREATE POLICY "Anyone can view distributions" ON distributions
  FOR SELECT USING (true);

CREATE POLICY "Anyone can insert distributions" ON distributions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update distributions" ON distributions
  FOR UPDATE USING (true);

-- Create storage bucket for episodes
INSERT INTO storage.buckets (id, name, public)
VALUES ('episodes', 'episodes', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for episodes bucket
CREATE POLICY "Anyone can upload to episodes bucket"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'episodes');

CREATE POLICY "Anyone can view episodes bucket"
ON storage.objects FOR SELECT
USING (bucket_id = 'episodes');

CREATE POLICY "Anyone can update episodes bucket"
ON storage.objects FOR UPDATE
USING (bucket_id = 'episodes');

-- Note: In production, replace "Anyone" policies with proper auth checks
-- Example: USING (auth.uid() = user_id)
