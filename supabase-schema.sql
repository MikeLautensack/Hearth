-- Supabase Database Schema for Mike's Hearth
-- Run this SQL in your Supabase SQL Editor to set up the database

-- Create the profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  access_status TEXT NOT NULL DEFAULT 'pending' CHECK (access_status IN ('pending', 'approved', 'denied')),
  access_requested_at TIMESTAMPTZ,
  access_granted_at TIMESTAMPTZ,
  access_granted_by UUID REFERENCES profiles(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create a security definer function to check if user is admin
-- This avoids infinite recursion in RLS policies
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = user_id AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Policy: Users can read their own profile OR admins can read all
CREATE POLICY "Users can read own profile or admin reads all"
  ON profiles
  FOR SELECT
  USING (
    auth.uid() = id 
    OR is_admin(auth.uid())
  );

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Policy: Users can update their own profile OR admins can update all
CREATE POLICY "Users can update own profile or admin updates all"
  ON profiles
  FOR UPDATE
  USING (
    auth.uid() = id 
    OR is_admin(auth.uid())
  );

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS profiles_access_status_idx ON profiles(access_status);
CREATE INDEX IF NOT EXISTS profiles_role_idx ON profiles(role);

-- =====================================================
-- Access Codes Table
-- =====================================================

CREATE TABLE IF NOT EXISTS access_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  created_by UUID NOT NULL REFERENCES profiles(id),
  used_by UUID REFERENCES profiles(id),
  used_at TIMESTAMPTZ,
  used_by_email TEXT,
  note TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE access_codes ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone authenticated can check if a code exists (for redemption)
CREATE POLICY "Authenticated users can read unused codes"
  ON access_codes
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Policy: Admins can insert new codes
CREATE POLICY "Admins can create codes"
  ON access_codes
  FOR INSERT
  WITH CHECK (is_admin(auth.uid()));

-- Policy: Users can update codes (to redeem them) or admins can update any
CREATE POLICY "Users can redeem codes or admins update all"
  ON access_codes
  FOR UPDATE
  USING (
    (used_by IS NULL AND auth.uid() IS NOT NULL)
    OR is_admin(auth.uid())
  );

-- Policy: Admins can delete codes
CREATE POLICY "Admins can delete codes"
  ON access_codes
  FOR DELETE
  USING (is_admin(auth.uid()));

-- Create index for faster code lookups
CREATE INDEX IF NOT EXISTS access_codes_code_idx ON access_codes(code);

-- =====================================================
-- IMPORTANT: Set yourself as the first admin!
-- =====================================================
-- After signing in for the first time, run this query
-- replacing 'your-user-id' with your actual user ID from
-- the auth.users table, and 'your@email.com' with your email:
--
-- INSERT INTO profiles (id, email, full_name, role, access_status, access_granted_at)
-- VALUES (
--   'your-user-id-here',
--   'your@email.com',
--   'Mike',
--   'admin',
--   'approved',
--   NOW()
-- );
--
-- You can find your user ID by running:
-- SELECT id, email FROM auth.users;
-- =====================================================
