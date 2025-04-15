-- Drop existing tables if they exist to recreate them with proper structure
-- First truncate the departments table and repopulate it
TRUNCATE TABLE departments CASCADE;

-- Insert the departments
INSERT INTO departments (name, code, created_at)
VALUES 
  ('BSIT', 'BSIT', NOW()),
  ('BAPS', 'BAPS', NOW()),
  ('BSA', 'BSA', NOW()),
  ('BSBA-MM', 'BSBA', NOW());

-- Truncate the sections table to recreate it
TRUNCATE TABLE sections CASCADE;

-- Insert sections for each department (1A-1D to 4A-4D)
-- For BSIT department
DO $$
DECLARE
  dept_id uuid;
  year_num int;
  section_letter text;
BEGIN
  -- Get BSIT department ID
  SELECT id INTO dept_id FROM departments WHERE code = 'BSIT';
  
  -- Create sections for years 1-4 and letters A-D
  FOR year_num IN 1..4 LOOP
    FOREACH section_letter IN ARRAY ARRAY['A', 'B', 'C', 'D'] LOOP
      INSERT INTO sections (name, code, department_id, created_at)
      VALUES (
        year_num || section_letter,
        year_num || section_letter,
        dept_id,
        NOW()
      );
    END LOOP;
  END LOOP;
  
  -- Get BAPS department ID
  SELECT id INTO dept_id FROM departments WHERE code = 'BAPS';
  
  -- Create sections for years 1-4 and letters A-D
  FOR year_num IN 1..4 LOOP
    FOREACH section_letter IN ARRAY ARRAY['A', 'B', 'C', 'D'] LOOP
      INSERT INTO sections (name, code, department_id, created_at)
      VALUES (
        year_num || section_letter,
        year_num || section_letter,
        dept_id,
        NOW()
      );
    END LOOP;
  END LOOP;
  
  -- Get BSA department ID
  SELECT id INTO dept_id FROM departments WHERE code = 'BSA';
  
  -- Create sections for years 1-4 and letters A-D
  FOR year_num IN 1..4 LOOP
    FOREACH section_letter IN ARRAY ARRAY['A', 'B', 'C', 'D'] LOOP
      INSERT INTO sections (name, code, department_id, created_at)
      VALUES (
        year_num || section_letter,
        year_num || section_letter,
        dept_id,
        NOW()
      );
    END LOOP;
  END LOOP;
  
  -- Get BSBA department ID
  SELECT id INTO dept_id FROM departments WHERE code = 'BSBA';
  
  -- Create sections for years 1-4 and letters A-D
  FOR year_num IN 1..4 LOOP
    FOREACH section_letter IN ARRAY ARRAY['A', 'B', 'C', 'D'] LOOP
      INSERT INTO sections (name, code, department_id, created_at)
      VALUES (
        year_num || section_letter,
        year_num || section_letter,
        dept_id,
        NOW()
      );
    END LOOP;
  END LOOP;
END;
$$;

-- Make sure forms table has additional_instructions column
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'forms' AND column_name = 'additional_instructions') THEN
    ALTER TABLE forms ADD COLUMN additional_instructions TEXT;
  END IF;
END;
$$;

-- Make sure admins table has auth_user_id, last_login, and status columns
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'admins' AND column_name = 'auth_user_id') THEN
    ALTER TABLE admins ADD COLUMN auth_user_id UUID;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'admins' AND column_name = 'last_login') THEN
    ALTER TABLE admins ADD COLUMN last_login TIMESTAMP WITH TIME ZONE;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'admins' AND column_name = 'status') THEN
    ALTER TABLE admins ADD COLUMN status TEXT DEFAULT 'active';
  END IF;
END;
$$;

-- Realtime publication is handled in the next migration file
