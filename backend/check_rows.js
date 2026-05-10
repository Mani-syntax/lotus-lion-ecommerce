require('dotenv').config();
const supabase = require('./src/config/supabase');

async function checkRows() {
  const { count: usersCount } = await supabase.from('users').select('*', { count: 'exact', head: true });
  const { count: profilesCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
  
  console.log('Users count:', usersCount);
  console.log('Profiles count:', profilesCount);
  
  if (usersCount > 0) {
    const { data } = await supabase.from('users').select('*').limit(1);
    console.log('Sample user:', data[0]);
  }
  
  if (profilesCount > 0) {
    const { data } = await supabase.from('profiles').select('*').limit(1);
    console.log('Sample profile:', data[0]);
  }
}

checkRows();
