// Script to fix Lekker bike URLs with the correct ones from actual website
import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://pgpegcvyuflrvenjsltl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBncGVnY3Z5dWZscnZlbmpzbHRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNDEzNzUsImV4cCI6MjA3MzgxNzM3NX0.e2Q5FOHAK6MmUlqCESQEUZ67veuJ_ykT3TU49-p-Bx0';

const supabase = createClient(supabaseUrl, supabaseKey);

// Correct Lekker bike URLs and images from actual website inspection
const lekkerFixes = [
  { 
    brand: 'Lekker', 
    model: 'Jordaan GTS', 
    imageUrl: 'https://lekkerbikes.com.au/cdn/shop/files/JORDAAN_GTS_FRONT_Grey_Straps_Linen_Cream.png?v=1755836332&width=800', 
    manufacturerUrl: 'https://lekkerbikes.com.au/products/jordaan-gts-ebike' 
  },
  { 
    brand: 'Lekker', 
    model: 'Amsterdam Urban', 
    imageUrl: 'https://lekkerbikes.com.au/cdn/shop/files/A8S_FRONT_GREY_Alpine_White.png?v=1755834832&width=800', 
    manufacturerUrl: 'https://lekkerbikes.com.au/products/amsterdam-urban-8sp-ebike' 
  },
  { 
    brand: 'Lekker', 
    model: 'Amsterdam GTS', 
    imageUrl: 'https://lekkerbikes.com.au/cdn/shop/files/Amsterdam_GTS_Black_Front_Ride.png?v=1755834432&width=800', 
    manufacturerUrl: 'https://lekkerbikes.com.au/products/amsterdam-gts-ebike' 
  },
  { 
    brand: 'Lekker', 
    model: 'Jordaan Urban 8SP', 
    imageUrl: 'https://lekkerbikes.com.au/cdn/shop/files/JORDAAN_URBAN_8S_FRONT_Olive_Green.png?v=1755835232&width=800', 
    manufacturerUrl: 'https://lekkerbikes.com.au/products/jordaan-urban-8sp-ebike' 
  },
  { 
    brand: 'Lekker', 
    model: 'Limited Edition Jordaan GTS', 
    imageUrl: 'https://lekkerbikes.com.au/cdn/shop/files/JORDAAN_GTS_FRONT_Gloss_Charcoal_Grey_Gloss_Dark_Grey.png?v=1755835532&width=800', 
    manufacturerUrl: 'https://lekkerbikes.com.au/products/limited-edition-jordaan-gts-ebike' 
  }
];

async function fixLekkerUrls() {
  console.log('🔧 Fixing Lekker bike URLs with correct website data...');
  console.log(`📊 Updating ${lekkerFixes.length} Lekker bikes`);
  
  let successCount = 0;
  let failCount = 0;

  for (const fix of lekkerFixes) {
    try {
      console.log(`\n🔍 Fixing: ${fix.brand} ${fix.model}`);
      console.log(`   🔗 URL: ${fix.manufacturerUrl}`);
      console.log(`   🖼️ Image: ${fix.imageUrl}`);
      
      // Update the bike with correct image and manufacturer URL
      const { data, error } = await supabase
        .from('ebikes')
        .update({
          image_url: fix.imageUrl,
          manufacturer_url: fix.manufacturerUrl
        })
        .eq('brand', fix.brand)
        .eq('model', fix.model)
        .select('id');

      if (error) {
        console.error(`❌ Failed to update ${fix.brand} ${fix.model}:`, error.message);
        failCount++;
      } else if (data && data.length > 0) {
        console.log(`✅ Updated ${fix.brand} ${fix.model}`);
        successCount++;
      } else {
        console.log(`⚠️ No match found for ${fix.brand} ${fix.model}`);
        failCount++;
      }

      // Small delay to avoid overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error(`❌ Error updating ${fix.brand} ${fix.model}:`, error.message);
      failCount++;
    }
  }

  console.log(`\n🎉 Lekker URL fix complete!`);
  console.log(`✅ Successfully updated: ${successCount} bikes`);
  console.log(`❌ Failed/No match: ${failCount} bikes`);
  
  // Verify the Lekker updates
  console.log(`\n🔍 Verifying Lekker bike updates...`);
  const { data: verification, error: verifyError } = await supabase
    .from('ebikes')
    .select('brand, model, image_url, manufacturer_url')
    .eq('brand', 'Lekker');

  if (verifyError) {
    console.error('❌ Failed to verify Lekker updates:', verifyError.message);
  } else {
    console.log(`✅ Verification: ${verification.length} Lekker bikes in database`);
    verification.forEach(bike => {
      console.log(`   📱 ${bike.model}`);
      console.log(`      🖼️ ${bike.image_url}`);
      console.log(`      🌐 ${bike.manufacturer_url}`);
      console.log('');
    });
  }
}

// Test a simple search to see if thumbnails work
async function testThumbnails() {
  console.log('\n🧪 Testing if thumbnails now work...');
  
  try {
    const { data, error } = await supabase
      .from('ebikes')
      .select('brand, model, image_url, manufacturer_url')
      .eq('brand', 'Lekker')
      .eq('model', 'Jordaan GTS')
      .single();

    if (error) {
      console.error('❌ Test failed:', error.message);
      return;
    }

    console.log('🎯 Test result for Jordaan GTS:');
    console.log(`   Brand: ${data.brand}`);
    console.log(`   Model: ${data.model}`);
    console.log(`   Image URL: ${data.image_url}`);
    console.log(`   Manufacturer URL: ${data.manufacturer_url}`);
    
    if (data.image_url && data.manufacturer_url) {
      console.log('✅ Thumbnails should now work! URLs are properly set.');
    } else {
      console.log('❌ Still missing data');
    }

  } catch (error) {
    console.error('❌ Test error:', error.message);
  }
}

// Run the fixes and test
fixLekkerUrls()
  .then(() => testThumbnails())
  .catch(console.error);
