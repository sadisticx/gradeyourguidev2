-- Add department_id to forms table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'forms' AND column_name = 'department_id') THEN
        ALTER TABLE forms ADD COLUMN department_id UUID REFERENCES departments(id);
    END IF;
END
$$;

-- Add isUsedInForm to questionnaires table if it doesn't exist
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'questionnaires' AND column_name = 'is_used_in_form') THEN
        ALTER TABLE questionnaires ADD COLUMN is_used_in_form BOOLEAN DEFAULT FALSE;
    END IF;
END
$$;

-- Update existing questionnaires to set isUsedInForm based on forms table
UPDATE questionnaires q
SET is_used_in_form = TRUE
WHERE EXISTS (
    SELECT 1 FROM forms f WHERE f.questionnaire_id = q.id
);

-- Enable realtime for updated tables
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'forms'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE forms;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'questionnaires'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE questionnaires;
  END IF;
END
$$;