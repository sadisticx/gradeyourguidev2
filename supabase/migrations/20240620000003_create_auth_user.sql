-- Create a user in auth.users table first
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_super_admin)
SELECT 
  gen_random_uuid(),
  'admin@faculty-eval.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Admin User"}',
  false
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'admin@faculty-eval.com'
);

-- Get the user ID to link to the admins table
DO $$
DECLARE
  auth_user_id UUID;
BEGIN
  SELECT id INTO auth_user_id FROM auth.users WHERE email = 'admin@faculty-eval.com';
  
  -- Insert into public.admins table if not exists
  INSERT INTO public.admins (id, name, email, role, status, permissions)
  VALUES (
    auth_user_id,
    'System Administrator',
    'admin@faculty-eval.com',
    'Super Admin',
    'active',
    ARRAY['manage_questionnaires', 'manage_forms', 'view_analytics', 'manage_admins']
  )
  ON CONFLICT (id) DO NOTHING;
END $$;
