-- Make sure all tables are part of the realtime publication
DO $$
BEGIN
  -- Check if tables are already in the publication before adding them
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'departments') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE departments;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'sections') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE sections;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'forms') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE forms;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'admins') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE admins;
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_publication_tables WHERE pubname = 'supabase_realtime' AND tablename = 'questionnaires') THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE questionnaires;
  END IF;
END;
$$;