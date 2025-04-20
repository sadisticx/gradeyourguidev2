-- Create form_sections table to link forms with sections
CREATE TABLE IF NOT EXISTS form_sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  form_id UUID NOT NULL REFERENCES evaluation_forms(id) ON DELETE CASCADE,
  section_id UUID NOT NULL REFERENCES sections(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(form_id, section_id)
);

-- Enable row-level security
ALTER TABLE form_sections ENABLE ROW LEVEL SECURITY;

-- Create policies
DROP POLICY IF EXISTS "Allow full access to authenticated users" ON form_sections;
CREATE POLICY "Allow full access to authenticated users"
  ON form_sections
  USING (auth.role() = 'authenticated');

-- Add to realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE form_sections;
