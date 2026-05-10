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

async function cleanAndSeed() {
  console.log('🚀 Cleaning and Reseeding Navbar...');

  const NAVBAR_DATA = [
    { label: 'Lotus Collections', href: '/collections/lotus' },
    { label: 'Lion Collections', href: '/collections/lion' },
    { label: 'Shop All', href: '/products' },
    { label: 'Journal', href: '/blog' }
  ];

  const { error } = await supabase.from('content').upsert({
    key: 'navbar',
    type: 'config',
    data: NAVBAR_DATA
  }, { onConflict: 'key' });

  if (error) console.error('Error seeding navbar:', error);
  else console.log('✅ Navbar seeded successfully.');

  // Also ensure collections exist with these slugs
  await supabase.from('collections').upsert([
    { name: 'Lotus Collections', slug: 'lotus', is_active: true, display_order: 1 },
    { name: 'Lion Collections', slug: 'lion', is_active: true, display_order: 2 }
  ], { onConflict: 'slug' });

  console.log('✨ Clean seed finished.');
}

cleanAndSeed();
