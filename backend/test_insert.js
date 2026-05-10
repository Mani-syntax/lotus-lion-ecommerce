require('dotenv').config();
const supabase = require('./src/config/supabase');

async function testInsert() {
  const productId = '8c6cb70d-816c-4058-a9bf-9ba77042c3c0'; // Signature Lotus Wrap
  const testUrl = 'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&q=80&w=1000';
  
  console.log('Testing insert for product:', productId);
  
  const { data, error } = await supabase
    .from('product_images')
    .insert({
      product_id: productId,
      image_url: testUrl,
      is_main: true
    })
    .select();
    
  if (error) {
    console.error('Insert failed:', error);
  } else {
    console.log('Insert successful:', data);
  }
}

testInsert();
