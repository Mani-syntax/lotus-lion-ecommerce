require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const bucketName = process.env.SUPABASE_STORAGE_BUCKET || 'lotus-lion';

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function setupStorage() {
  console.log(`Setting up Supabase Storage bucket: ${bucketName}...`);

  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  
  if (listError) {
    console.error('Error listing buckets:', listError.message);
    return;
  }

  const bucketExists = buckets.find(b => b.name === bucketName);

  if (!bucketExists) {
    console.log(`Bucket "${bucketName}" not found. Creating...`);
    const { error: createError } = await supabase.storage.createBucket(bucketName, {
      public: true,
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp', 'image/gif'],
      fileSizeLimit: 5242880 // 5MB
    });

    if (createError) {
      console.error('Error creating bucket:', createError.message);
    } else {
      console.log(`Bucket "${bucketName}" created successfully!`);
    }
  } else {
    console.log(`Bucket "${bucketName}" already exists.`);
  }
}

setupStorage();
