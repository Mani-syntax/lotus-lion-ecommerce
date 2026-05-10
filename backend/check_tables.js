require('dotenv').config();
const supabase = require('./src/config/supabase');

async function checkTables() {
  console.log('Checking tables in public schema...');
  const { data, error } = await supabase.rpc('get_tables'); // Custom RPC or just try to select
  
  // Alternative: try to select from users
  const { error: usersError } = await supabase.from('users').select('count', { count: 'exact', head: true });
  console.log('Users table exists:', !usersError);
  if (usersError) console.log('Users error:', usersError.message);

  const { error: profilesError } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
  console.log('Profiles table exists:', !profilesError);
  if (profilesError) console.log('Profiles error:', profilesError.message);
}

checkTables();
