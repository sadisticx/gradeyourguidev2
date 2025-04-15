-- This migration fixes the issue with the admins table already being a member of the supabase_realtime publication

-- First, check if the admins table is already in the publication
DO $$
DECLARE
  table_exists BOOLEAN;
BEGIN
  -- Check if the admins table is already in the publication
  SELECT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'admins'
  ) INTO table_exists;
  
  -- Only try to add the table if it's not already in the publication
  IF NOT table_exists THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE admins';
  END IF;
END;
$$;
