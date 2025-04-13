-- Create departments table
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create sections table
CREATE TABLE IF NOT EXISTS sections (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  department_id UUID REFERENCES departments(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create instructors table
CREATE TABLE IF NOT EXISTS instructors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  department_id UUID REFERENCES departments(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create section_instructors junction table
CREATE TABLE IF NOT EXISTS section_instructors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  section_id UUID REFERENCES sections(id) ON DELETE CASCADE,
  instructor_id UUID REFERENCES instructors(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(section_id, instructor_id)
);

-- Enable row level security but allow all operations for now
ALTER TABLE departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE section_instructors ENABLE ROW LEVEL SECURITY;

-- Create policies that allow all operations
DROP POLICY IF EXISTS "Allow all operations on departments" ON departments;
CREATE POLICY "Allow all operations on departments" ON departments USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations on sections" ON sections;
CREATE POLICY "Allow all operations on sections" ON sections USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations on instructors" ON instructors;
CREATE POLICY "Allow all operations on instructors" ON instructors USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Allow all operations on section_instructors" ON section_instructors;
CREATE POLICY "Allow all operations on section_instructors" ON section_instructors USING (true) WITH CHECK (true);

-- Enable realtime for all tables
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'departments'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE departments;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'sections'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE sections;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'instructors'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE instructors;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'section_instructors'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE section_instructors;
  END IF;
END
$$;