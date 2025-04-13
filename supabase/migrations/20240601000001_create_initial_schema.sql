-- Create questionnaires table
CREATE TABLE IF NOT EXISTS questionnaires (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  sections JSONB,
  status TEXT DEFAULT 'draft',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create forms table
CREATE TABLE IF NOT EXISTS forms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  questionnaire_id UUID REFERENCES questionnaires(id),
  section TEXT,
  status TEXT DEFAULT 'inactive',
  responses INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE
);

-- Create admins table
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  role TEXT,
  status TEXT DEFAULT 'active',
  permissions TEXT[],
  last_login TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create responses table for analytics
CREATE TABLE IF NOT EXISTS responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  form_id UUID REFERENCES forms(id),
  section_id TEXT,
  answers JSONB,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS but make tables accessible to all (for demo purposes)
ALTER TABLE questionnaires ENABLE ROW LEVEL SECURITY;
ALTER TABLE forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE responses ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (for demo purposes)
DROP POLICY IF EXISTS "Public questionnaires access" ON questionnaires;
CREATE POLICY "Public questionnaires access" ON questionnaires FOR ALL USING (true);

DROP POLICY IF EXISTS "Public forms access" ON forms;
CREATE POLICY "Public forms access" ON forms FOR ALL USING (true);

DROP POLICY IF EXISTS "Public admins access" ON admins;
CREATE POLICY "Public admins access" ON admins FOR ALL USING (true);

DROP POLICY IF EXISTS "Public responses access" ON responses;
CREATE POLICY "Public responses access" ON responses FOR ALL USING (true);

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE questionnaires;
ALTER PUBLICATION supabase_realtime ADD TABLE forms;
ALTER PUBLICATION supabase_realtime ADD TABLE admins;
ALTER PUBLICATION supabase_realtime ADD TABLE responses;
