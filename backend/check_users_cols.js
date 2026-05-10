require('dotenv').config();
const supabase = require('./src/config/supabase');

async function checkColumns() {
  const { data, error } = await supabase.from('users').select('*').limit(1);
  if (error) {
    console.error('Error:', error);
    return;
  }
  console.log('Users columns:', Object.keys(data[0] || {}));
}

checkColumns();
