require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  try {
    // There is no direct way to get columns via supabase-js without RPC or using the REST API differently
    // But we can try to insert a dummy record and see the error or just fetch one and look at keys
    const { data, error } = await supabase.from('collections').select('*').limit(1);
    if (data && data[0]) {
      console.log('Columns in collections:', Object.keys(data[0]));
    }
    
    const { data: pData } = await supabase.from('products').select('*').limit(1);
     if (pData && pData[0]) {
      console.log('Columns in products:', Object.keys(pData[0]));
    }
  } catch (err) {
    console.error(err);
  }
}

checkSchema();
