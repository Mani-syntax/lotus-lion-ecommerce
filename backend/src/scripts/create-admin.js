require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function createAdmin() {
  const email = 'admin@example.com';
  const password = 'Password123!';
  const name = 'Admin User';

  console.log(`Creating admin user: ${email}...`);

  // 1. Create Auth User (if using Supabase Auth)
  // Note: For now we use the public.profiles table as per my authController refactor
  const hashedPassword = await bcrypt.hash(password, 10);

  const { data: user, error } = await supabase
    .from('profiles')
    .upsert({
      email,
      password: hashedPassword,
      name,
      role: 'super-admin',
      is_blocked: false
    }, { onConflict: 'email' })
    .select()
    .single();

  if (error) {
    console.error('Error creating admin profile:', error.message);
  } else {
    console.log('Admin profile created successfully!');
    console.log('Email:', email);
    console.log('Password:', password);
  }
}

createAdmin();
