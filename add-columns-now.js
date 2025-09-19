// Script to add image_url and manufacturer_url columns to the database
import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://pgpegcvyuflrvenjsltl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBncGVnY3Z5dWZscnZlbmpzbHRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNDEzNzUsImV4cCI6MjA3MzgxNzM3NX0.e2Q5FOHAK6MmUlqCESQEUZ67veuJ_ykT3TU49-p-Bx0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function addColumns() {
  console.log('🔧 Adding image_url and manufacturer_url columns to database...');
  
  try {
    // Add the columns using raw SQL
    const { error } = await supabase.rpc('exec_sql', {
      sql: `
        ALTER TABLE ebikes 
        ADD COLUMN IF NOT EXISTS image_url TEXT,
        ADD COLUMN IF NOT EXISTS manufacturer_url TEXT;
      `
    });

    if (error) {
      console.error('❌ Failed to add columns:', error.message);
      console.log('💡 You may need to run this SQL manually in your Supabase dashboard:');
      console.log('');
      console.log('ALTER TABLE ebikes');
      console.log('ADD COLUMN IF NOT EXISTS image_url TEXT,');
      console.log('ADD COLUMN IF NOT EXISTS manufacturer_url TEXT;');
      return false;
    }

    console.log('✅ Successfully added image_url and manufacturer_url columns!');
    return true;
    
  } catch (error) {
    console.error('❌ Error adding columns:', error.message);
    console.log('💡 You may need to run this SQL manually in your Supabase dashboard:');
    console.log('');
    console.log('ALTER TABLE ebikes');
    console.log('ADD COLUMN IF NOT EXISTS image_url TEXT,');
    console.log('ADD COLUMN IF NOT EXISTS manufacturer_url TEXT;');
    return false;
  }
}

// Run the column addition
addColumns().catch(console.error);
