require('dotenv').config();
const supabase = require('./src/config/supabase');

async function testUpdate() {
  const id = '8c6cb70d-816c-4058-a9bf-9ba77042c3c0'; // Signature Lotus Wrap
  const mockBody = {
    name: 'Signature Lotus Wrap UPDATED',
    price: 4500,
    images: [
      'https://images.unsplash.com/photo-1556906781-9a412961c28c?auto=format&fit=crop&q=80&w=1000'
    ]
  };
  
  console.log('Testing update for product:', id);
  
  // 1. Update product
  const { data: product, error: pError } = await supabase
    .from('products')
    .update({ name: mockBody.name, price: mockBody.price })
    .eq('id', id)
    .select()
    .single();
    
  if (pError) {
    console.error('Product update failed:', pError);
    return;
  }
  console.log('Product updated:', product.name);
  
  // 2. Sync images
  if (mockBody.images && Array.isArray(mockBody.images)) {
    console.log('Syncing images...');
    await supabase.from('product_images').delete().eq('product_id', id);
    
    const imageInserts = mockBody.images.map((url, i) => ({
      product_id: id,
      image_url: url,
      is_main: i === 0
    }));
    
    const { data: iData, error: iError } = await supabase.from('product_images').insert(imageInserts).select();
    if (iError) {
      console.error('Image insert failed:', iError);
    } else {
      console.log('Images synced:', iData.length);
    }
  }
}

testUpdate();
