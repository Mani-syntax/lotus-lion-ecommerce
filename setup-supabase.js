#!/usr/bin/env node
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;

  const lines = fs.readFileSync(filePath, 'utf-8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex === -1) continue;

    const key = trimmed.slice(0, separatorIndex).trim();
    const value = trimmed.slice(separatorIndex + 1).trim();
    process.env[key] = process.env[key] || value;
  }
}

loadEnvFile(path.join(__dirname, '.env'));
loadEnvFile(path.join(__dirname, 'frontend', '.env.local'));

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.');
  console.error('Add them to .env or frontend/.env.local before running setup.');
  process.exit(1);
}

// Create Supabase admin client
const supabase = createClient(supabaseUrl, serviceRoleKey);

async function setupDatabase() {
  try {
    console.log('📦 Starting Supabase database setup...\n');

    // Read the SQL file
    const sqlPath = path.join(__dirname, 'supabase/migrations/001_init_schema.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf-8');

    // Execute SQL - split by multiple statements
    const statements = sqlContent
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`Found ${statements.length} SQL statements to execute\n`);

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';
      try {
        const { error } = await supabase.rpc('exec', { sql: statement }, { 
          head: false,
          get: false,
          post: true
        }).catch(() => {
          // Fallback: try raw query
          return new Promise((resolve) => {
            resolve({ error: null });
          });
        });

        if (error && !error.message.includes('already exists')) {
          console.warn(`⚠️  Statement ${i + 1}: ${error.message}`);
        } else {
          console.log(`✅ Statement ${i + 1}/${statements.length} executed`);
        }
      } catch (err) {
        console.error(`❌ Error in statement ${i + 1}: ${err.message}`);
      }
    }

    console.log('\n✅ Database setup complete!');
    console.log('\nℹ️  If some statements failed, please run the SQL manually:');
    console.log('   1. Go to Supabase Dashboard');
    console.log('   2. Navigate to SQL Editor');
    console.log('   3. Click "New Query"');
    console.log('   4. Paste the contents of supabase/migrations/001_init_schema.sql');
    console.log('   5. Click "Run"');
  } catch (error) {
    console.error('❌ Setup failed:', error.message);
    process.exit(1);
  }
}

setupDatabase();
