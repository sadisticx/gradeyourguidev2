-- Check if admins table exists, if not create it
CREATE TABLE IF NOT EXISTS admins (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  role TEXT NOT NULL DEFAULT 'Viewer',
  status TEXT NOT NULL DEFAULT 'active',
  permissions JSONB DEFAULT '[]',
  password TEXT,
  last_login TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert a default admin if none exists
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM admins LIMIT 1) THEN
    INSERT INTO admins (name, email, role, status, permissions)
    VALUES ('System Admin', 'admin@faculty-eval.com', 'Super Admin', 'active', '["manage_questionnaires", "manage_forms", "view_analytics", "manage_admins"]');
  END IF;
END
$$;

-- Enable realtime for admins table
ALTER PUBLICATION supabase_realtime ADD TABLE admins;