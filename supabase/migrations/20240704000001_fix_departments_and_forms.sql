-- Fix departments table and ensure it's properly populated
TRUNCATE TABLE departments RESTART IDENTITY CASCADE;

INSERT INTO departments (name, code, created_at) VALUES
('BSIT', 'BSIT', NOW()),
('BAPS', 'BAPS', NOW()),
('BSA', 'BSA', NOW()),
('BSBA-MM', 'BSBA', NOW());

-- Fix sections table with proper sections (1A-1D to 4A-4D for each department)
TRUNCATE TABLE sections RESTART IDENTITY CASCADE;

-- Function to generate sections for each department
DO $$
DECLARE
  dept_id INT;
  year INT;
  section_letter TEXT;
  letters TEXT[] := ARRAY['A', 'B', 'C', 'D'];
  i INT;
BEGIN
  -- For each department
  FOR dept_id IN 1..4 LOOP
    -- For each year
    FOR year IN 1..4 LOOP
      -- For each section letter
      FOR i IN 1..array_length(letters, 1) LOOP
        section_letter := letters[i];
        -- Insert the section
        INSERT INTO sections (name, code, department_id, created_at)
        VALUES (
          year || section_letter,
          year || section_letter,
          dept_id,
          NOW()
        );
      END LOOP;
    END LOOP;
  END LOOP;
END;
$$;

-- Ensure forms table has the correct structure
DO $$
BEGIN
  -- Check if additional_instructions column exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'forms' AND column_name = 'additional_instructions') THEN
    -- Add the column if it doesn't exist
    ALTER TABLE forms ADD COLUMN additional_instructions TEXT;
  END IF;
END;
$$;

-- Ensure admins table has the correct structure
DO $$
BEGIN
  -- Check if auth_user_id column exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'admins' AND column_name = 'auth_user_id') THEN
    -- Add the column if it doesn't exist
    ALTER TABLE admins ADD COLUMN auth_user_id UUID NULL;
  END IF;
  
  -- Check if last_login column exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'admins' AND column_name = 'last_login') THEN
    -- Add the column if it doesn't exist
    ALTER TABLE admins ADD COLUMN last_login TIMESTAMP WITH TIME ZONE;
  END IF;
  
  -- Check if status column exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'admins' AND column_name = 'status') THEN
    -- Add the column if it doesn't exist
    ALTER TABLE admins ADD COLUMN status TEXT DEFAULT 'active';
  END IF;
END;
$$;

-- Make sure all tables are part of the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE departments, sections, forms, admins;