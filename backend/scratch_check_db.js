require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkCollections() {
  try {
    const { data, error } = await supabase.from('collections').select('*');
    if (error) {
      console.error('Error fetching collections:', error);
    } else {
      console.log('Collections:', data);
    }
    
    const { data: products, error: prodError } = await supabase.from('products').select('*').limit(5);
    if (prodError) {
      console.error('Error fetching products:', prodError);
    } else {
      console.log('Products sample:', products);
    }
  } catch (err) {
    console.error('Fatal error:', err);
  }
}

checkCollections();
