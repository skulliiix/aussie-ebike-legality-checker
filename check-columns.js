// Script to check if the new columns exist in the database
import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://pgpegcvyuflrvenjsltl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBncGVnY3Z5dWZscnZlbmpzbHRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNDEzNzUsImV4cCI6MjA3MzgxNzM3NX0.e2Q5FOHAK6MmUlqCESQEUZ67veuJ_ykT3TU49-p-Bx0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkColumns() {
  console.log('🔍 Checking if image_url and manufacturer_url columns exist...');
  
  try {
    // Try to select from the new columns
    const { data, error } = await supabase
      .from('ebikes')
      .select('id, brand, model, image_url, manufacturer_url')
      .limit(1);

    if (error) {
      if (error.message.includes('image_url') || error.message.includes('manufacturer_url')) {
        console.log('❌ Columns do not exist yet.');
        console.log('💡 Please run the SQL commands in your Supabase dashboard first.');
        return false;
      } else {
        console.error('❌ Database error:', error.message);
        return false;
      }
    }

    console.log('✅ Columns exist! Database is ready for thumbnail updates.');
    console.log(`📊 Found ${data.length} sample record(s)`);
    return true;
    
  } catch (error) {
    console.error('❌ Error checking columns:', error.message);
    return false;
  }
}

// Run the check
checkColumns().catch(console.error);
