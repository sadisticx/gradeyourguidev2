-- Create departments table if it doesn't exist
CREATE TABLE IF NOT EXISTS departments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create sections table if it doesn't exist
CREATE TABLE IF NOT EXISTS sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  department_id UUID REFERENCES departments(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create instructors table if it doesn't exist
CREATE TABLE IF NOT EXISTS instructors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  department_id UUID REFERENCES departments(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create section_instructors junction table if it doesn't exist
CREATE TABLE IF NOT EXISTS section_instructors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id UUID REFERENCES sections(id) ON DELETE CASCADE,
  instructor_id UUID REFERENCES instructors(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(section_id, instructor_id)
);

-- Insert sample data if tables are empty
DO $$
BEGIN
  -- Insert departments if none exist
  IF NOT EXISTS (SELECT 1 FROM departments LIMIT 1) THEN
    INSERT INTO departments (name, code) VALUES
      ('Computer Science', 'CS'),
      ('Information Technology', 'IT'),
      ('Engineering', 'ENG');
  END IF;
  
  -- Get department IDs
  DECLARE
    cs_dept_id UUID;
    it_dept_id UUID;
    eng_dept_id UUID;
  BEGIN
    SELECT id INTO cs_dept_id FROM departments WHERE code = 'CS' LIMIT 1;
    SELECT id INTO it_dept_id FROM departments WHERE code = 'IT' LIMIT 1;
    SELECT id INTO eng_dept_id FROM departments WHERE code = 'ENG' LIMIT 1;
    
    -- Insert sections if none exist
    IF NOT EXISTS (SELECT 1 FROM sections LIMIT 1) THEN
      INSERT INTO sections (name, code, department_id) VALUES
        ('Introduction to Programming', 'CS101-A', cs_dept_id),
        ('Data Structures', 'CS201-B', cs_dept_id),
        ('Web Development', 'IT102-C', it_dept_id),
        ('Software Engineering', 'ENG401-D', eng_dept_id);
    END IF;
    
    -- Insert instructors if none exist
    IF NOT EXISTS (SELECT 1 FROM instructors LIMIT 1) THEN
      INSERT INTO instructors (name, email, department_id) VALUES
        ('Dr. John Smith', 'john.smith@example.com', cs_dept_id),
        ('Prof. Jane Doe', 'jane.doe@example.com', it_dept_id),
        ('Dr. Robert Johnson', 'robert.johnson@example.com', eng_dept_id);
    END IF;
    
    -- Get section and instructor IDs
    DECLARE
      cs101_id UUID;
      cs201_id UUID;
      it102_id UUID;
      eng401_id UUID;
      john_id UUID;
      jane_id UUID;
      robert_id UUID;
    BEGIN
      SELECT id INTO cs101_id FROM sections WHERE code = 'CS101-A' LIMIT 1;
      SELECT id INTO cs201_id FROM sections WHERE code = 'CS201-B' LIMIT 1;
      SELECT id INTO it102_id FROM sections WHERE code = 'IT102-C' LIMIT 1;
      SELECT id INTO eng401_id FROM sections WHERE code = 'ENG401-D' LIMIT 1;
      
      SELECT id INTO john_id FROM instructors WHERE email = 'john.smith@example.com' LIMIT 1;
      SELECT id INTO jane_id FROM instructors WHERE email = 'jane.doe@example.com' LIMIT 1;
      SELECT id INTO robert_id FROM instructors WHERE email = 'robert.johnson@example.com' LIMIT 1;
      
      -- Insert section-instructor relationships if none exist
      IF NOT EXISTS (SELECT 1 FROM section_instructors LIMIT 1) THEN
        INSERT INTO section_instructors (section_id, instructor_id) VALUES
          (cs101_id, john_id),
          (cs201_id, john_id),
          (it102_id, jane_id),
          (eng401_id, robert_id);
      END IF;
    END;
  END;
END;
$$;

-- Enable realtime for all tables
ALTER PUBLICATION supabase_realtime ADD TABLE departments;
ALTER PUBLICATION supabase_realtime ADD TABLE sections;
ALTER PUBLICATION supabase_realtime ADD TABLE instructors;
ALTER PUBLICATION supabase_realtime ADD TABLE section_instructors;