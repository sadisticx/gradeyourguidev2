-- Create a user in auth.users table
INSERT INTO auth.users (instance_id, id, aud, email, encrypted_password, email_confirmed_at, recovery_sent_at, last_sign_in_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at, confirmation_token, email_change, email_change_token_new, recovery_token)
SELECT
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'admin@faculty-eval.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"role":"admin"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE email = 'admin@faculty-eval.com'
);

-- Get the user ID from auth.users
DO $$
DECLARE
  auth_user_id uuid;
BEGIN
  SELECT id INTO auth_user_id FROM auth.users WHERE email = 'admin@faculty-eval.com';
  
  -- Insert into public.admins table with correct columns
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
END
$$;

-- Enable realtime for admins table if not already enabled
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'admins'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.admins;
  END IF;
END
$$;