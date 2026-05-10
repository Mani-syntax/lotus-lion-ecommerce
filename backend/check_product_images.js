require('dotenv').config();
const supabase = require('./src/config/supabase');

async function checkProductImages() {
  const { data: product, error: pError } = await supabase.from('products').select('*').eq('slug', 'lotus-wrap').single();
  if (pError) {
    console.error('Error fetching product:', pError);
    return;
  }
  console.log('Product Found:', product.id, product.name);
  
  const { data: images, error: iError } = await supabase.from('product_images').select('*').eq('product_id', product.id);
  if (iError) {
    console.error('Error fetching images:', iError);
    return;
  }
  console.log('Images Found:', JSON.stringify(images, null, 2));
}

checkProductImages();
