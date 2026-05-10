require('dotenv').config();
const supabase = require('./src/config/supabase');

async function checkCollections() {
  const { data, error } = await supabase.from('collections').select('*');
  if (error) {
    console.error('Error fetching collections:', error);
    return;
  }
  console.log('Collections:', JSON.stringify(data, null, 2));
}

checkCollections();
