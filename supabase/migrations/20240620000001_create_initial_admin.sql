-- Create an initial admin user if none exists
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
SELECT 
  gen_random_uuid(), 
  'admin@faculty-eval.com', 
  crypt('admin123', gen_salt('bf')), 
  now(), 
  now(), 
  now()
WHERE NOT EXISTS (SELECT 1 FROM auth.users LIMIT 1);

-- Get the ID of the admin user we just created or the first user if it already existed
DO $$
DECLARE
  admin_id uuid;
BEGIN
  SELECT id INTO admin_id FROM auth.users ORDER BY created_at ASC LIMIT 1;
  
  -- Insert into public.admins table with the same ID
  INSERT INTO public.admins (id, name, email, role, status, permissions, created_at, updated_at)
  VALUES (
    admin_id,
    'System Administrator',
    'admin@faculty-eval.com',
    'Super Admin',
    'active',
    ARRAY['manage_questionnaires', 'manage_forms', 'view_analytics', 'manage_admins'],
    now(),
    now()
  )
  ON CONFLICT (id) DO NOTHING;
  
 END $$;