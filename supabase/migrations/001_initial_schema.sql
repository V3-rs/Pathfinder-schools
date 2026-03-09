-- Career Dreamer + Demand Intelligence Schema
-- Run in Supabase SQL Editor or via `supabase db push`

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable pgvector for embeddings (Supabase has this by default)
CREATE EXTENSION IF NOT EXISTS vector;

-- Students (PII decoupled: use email_hash only for analytics)
CREATE TABLE students (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email_hash TEXT,
  major TEXT,
  year TEXT,
  consent BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Submissions: student dreams + embeddings
CREATE TABLE submissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  student_id UUID REFERENCES students(id),
  dream_text TEXT NOT NULL,
  embedding vector(1536),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Opportunities (workshops, internships, etc.)
CREATE TABLE opportunities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  type TEXT,
  description TEXT,
  link TEXT,
  embedding vector(1536),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Archetypes for keyword/vector matching
CREATE TABLE archetypes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  keywords TEXT[],
  embedding vector(1536),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Events for analytics (view/click)
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  submission_id UUID REFERENCES submissions(id),
  opportunity_id UUID REFERENCES opportunities(id),
  type TEXT CHECK (type IN ('view', 'click')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_submissions_student ON submissions(student_id);
CREATE INDEX idx_submissions_created ON submissions(created_at);
CREATE INDEX idx_events_submission ON events(submission_id);
CREATE INDEX idx_events_opportunity ON events(opportunity_id);
CREATE INDEX idx_events_created ON events(created_at);

-- Seed archetypes (Week 1 keyword matching)
INSERT INTO archetypes (title, description, keywords) VALUES
  ('Tech Innovator', 'Building software, startups, and digital products', ARRAY['software', 'coding', 'startup', 'tech', 'developer', 'programming', 'app', 'web']),
  ('Research Pioneer', 'Academic research, labs, and discovery', ARRAY['research', 'lab', 'phd', 'academic', 'publish', 'experiment', 'discovery', 'science']),
  ('Social Impact Leader', 'Nonprofits, policy, and community change', ARRAY['nonprofit', 'policy', 'community', 'social impact', 'advocacy', 'justice', 'sustainability']),
  ('Creative Professional', 'Design, arts, media, and content', ARRAY['design', 'art', 'creative', 'media', 'film', 'music', 'writing', 'content']),
  ('Business Builder', 'Consulting, finance, and corporate leadership', ARRAY['consulting', 'finance', 'business', 'corporate', 'management', 'leadership', 'investment']);
