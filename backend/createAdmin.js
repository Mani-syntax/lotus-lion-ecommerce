require('dotenv').config();
const supabase = require('./src/config/supabase');
const bcrypt = require('bcryptjs');

const createAdmin = async () => {
  const hashedPassword = await bcrypt.hash('password123', 10);
  const { data, error } = await supabase.from('users').insert({
    email: 'admin@example.com',
    password: hashedPassword,
    name: 'Admin User',
    role: 'super-admin',
    is_active: true
  }).select();

  if (error) {
    console.error('Error creating admin:', error);
  } else {
    console.log('Admin user created successfully:', data);
  }
};

createAdmin();
