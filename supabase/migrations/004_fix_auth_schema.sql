-- Fix authentication table schema
-- Add missing columns to users table to match auth controller expectations

ALTER TABLE users ADD COLUMN IF NOT EXISTS password TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;

-- Create alias: profiles -> users (for backward compatibility)
-- Note: In PostgreSQL, we'll just update the code to use 'users' table instead

-- Update role check constraint to include new role values
ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
ALTER TABLE users ADD CONSTRAINT users_role_check 
  CHECK (role IN ('customer', 'admin', 'super-admin', 'editor', 'user', 'superadmin'));
