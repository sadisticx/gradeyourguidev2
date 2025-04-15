-- Update departments table with new department data
TRUNCATE TABLE departments RESTART IDENTITY CASCADE;

INSERT INTO departments (name, code) VALUES
('BSIT', 'BSIT'),
('BAPS', 'BAPS'),
('BSA', 'BSA'),
('BSBA-MM', 'BSBA');

-- Update sections table with new section data (1A-1D to 4A-4D for each department)
TRUNCATE TABLE sections RESTART IDENTITY CASCADE;

-- Function to generate sections for each department
DO $$
DECLARE
  dept_id INT;
  year INT;
  section_letter TEXT;
BEGIN
  -- For each department
  FOR dept_id IN 1..4 LOOP
    -- For each year
    FOR year IN 1..4 LOOP
      -- For each section letter
      FOR section_letter IN ARRAY['A', 'B', 'C', 'D'] LOOP
        -- Insert the section
        INSERT INTO sections (name, code, department_id)
        VALUES (
          year || section_letter,
          year || section_letter,
          dept_id
        );
      END LOOP;
    END LOOP;
  END LOOP;
END;
$$;

-- Make sure the tables are part of the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE departments, sections;
