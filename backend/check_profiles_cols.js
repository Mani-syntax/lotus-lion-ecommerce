require('dotenv').config();
const supabase = require('./src/config/supabase');

async function checkProfilesColumns() {
  const { data, error } = await supabase.from('profiles').select('*').limit(1);
  if (error) {
    console.error('Error:', error);
    return;
  }
  console.log('Profiles columns:', Object.keys(data[0] || {}));
}

checkProfilesColumns();
