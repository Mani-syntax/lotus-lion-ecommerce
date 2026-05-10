require('dotenv').config();
const supabase = require('./src/config/supabase');

async function fixUserSchema() {
  console.log('Fixing users table schema...');
  
  // Note: supabase-js cannot directly run ALTER TABLE unless we use an RPC or it's a superuser.
  // But wait! We can try to use the 'exec' RPC if it exists, or just warn the user.
  
  const sql = `
    ALTER TABLE users ADD COLUMN IF NOT EXISTS password TEXT;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN DEFAULT FALSE;
    ALTER TABLE users ADD COLUMN IF NOT EXISTS last_login TIMESTAMP WITH TIME ZONE;
    ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;
    ALTER TABLE users ADD CONSTRAINT users_role_check CHECK (role IN ('customer', 'admin', 'super-admin', 'editor'));
  `;
  
  console.log('Please run the following SQL in your Supabase SQL Editor:');
  console.log(sql);
  
  // I'll try to insert the super-admin from profiles into users if possible.
  const { data: profiles } = await supabase.from('profiles').select('*');
  if (profiles && profiles.length > 0) {
    console.log('Found users in profiles table. You should migrate them to the users table.');
  }
}

fixUserSchema();
