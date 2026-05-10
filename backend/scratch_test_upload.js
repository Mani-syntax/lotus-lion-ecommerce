require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET_NAME = process.env.SUPABASE_STORAGE_BUCKET || 'lotus-lion';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUpload() {
  try {
    // Create a dummy buffer (1x1 transparent pixel)
    const buffer = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==', 'base64');
    const filePath = `test/${Date.now()}.png`;

    console.log(`Uploading to ${BUCKET_NAME}/${filePath}...`);
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, buffer, {
        contentType: 'image/png',
        upsert: true
      });

    if (error) {
      console.error('Upload Error:', error);
    } else {
      console.log('Upload Success:', data);
      const { data: { publicUrl } } = supabase.storage.from(BUCKET_NAME).getPublicUrl(filePath);
      console.log('Public URL:', publicUrl);
    }
  } catch (err) {
    console.error('Fatal Error:', err);
  }
}

testUpload();
