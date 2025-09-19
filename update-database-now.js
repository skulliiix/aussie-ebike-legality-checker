// Script to update all existing bikes with thumbnails and manufacturer URLs
import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://pgpegcvyuflrvenjsltl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBncGVnY3Z5dWZscnZlbmpzbHRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNDEzNzUsImV4cCI6MjA3MzgxNzM3NX0.e2Q5FOHAK6MmUlqCESQEUZ67veuJ_ykT3TU49-p-Bx0';

const supabase = createClient(supabaseUrl, supabaseKey);

// Comprehensive bike data with thumbnails and manufacturer URLs
const bikeUpdates = [
  // Lekker Bikes
  { brand: 'Lekker', model: 'Amsterdam GT', imageUrl: 'https://cdn.shopify.com/s/files/1/0569/6078/0207/products/Lekker_Amsterdam_GT_1_1024x1024.jpg?v=1680664972', manufacturerUrl: 'https://lekkerbikes.com.au' },
  { brand: 'Lekker', model: 'Amsterdam Urban', imageUrl: 'https://cdn.shopify.com/s/files/1/0569/6078/0207/products/Lekker_Amsterdam_Urban_1_1024x1024.jpg?v=1680664972', manufacturerUrl: 'https://lekkerbikes.com.au' },
  { brand: 'Lekker', model: 'Jordaan GTS', imageUrl: 'https://cdn.shopify.com/s/files/1/0569/6078/0207/products/Lekker_Jordaan_GTS_1_1024x1024.jpg?v=1680664972', manufacturerUrl: 'https://lekkerbikes.com.au' },
  { brand: 'Lekker', model: 'Jordaan Urban', imageUrl: 'https://cdn.shopify.com/s/files/1/0569/6078/0207/products/Lekker_Jordaan_Urban_1_1024x1024.jpg?v=1680664972', manufacturerUrl: 'https://lekkerbikes.com.au' },
  { brand: 'Lekker', model: 'Urban', imageUrl: 'https://cdn.shopify.com/s/files/1/0569/6078/0207/products/Lekker_Urban_1_1024x1024.jpg?v=1680664972', manufacturerUrl: 'https://lekkerbikes.com.au' },

  // Dirodi Bikes
  { brand: 'Dirodi', model: 'Nova 250W', imageUrl: 'https://dirodi.com.au/wp-content/uploads/2024/01/Dirodi-Nova-250W-Electric-Bike.jpg', manufacturerUrl: 'https://dirodi.com.au' },
  { brand: 'Dirodi', model: 'Nova 500W', imageUrl: 'https://dirodi.com.au/wp-content/uploads/2024/01/Dirodi-Nova-500W-Electric-Bike.jpg', manufacturerUrl: 'https://dirodi.com.au' },
  { brand: 'Dirodi', model: 'xTreme Electric Bike Gen 3 250W', imageUrl: 'https://dirodi.com.au/wp-content/uploads/2024/01/Dirodi-xTreme-Gen3-250W-Electric-Bike.jpg', manufacturerUrl: 'https://dirodi.com.au' },
  { brand: 'Dirodi', model: 'xTreme Electric Bike Gen 3 500W', imageUrl: 'https://dirodi.com.au/wp-content/uploads/2024/01/Dirodi-xTreme-Gen3-500W-Electric-Bike.jpg', manufacturerUrl: 'https://dirodi.com.au' },
  { brand: 'Dirodi', model: 'Cruiser 250W', imageUrl: 'https://dirodi.com.au/wp-content/uploads/2024/01/Dirodi-Cruiser-250W-Electric-Bike.jpg', manufacturerUrl: 'https://dirodi.com.au' },
  { brand: 'Dirodi', model: 'Cruiser 500W', imageUrl: 'https://dirodi.com.au/wp-content/uploads/2024/01/Dirodi-Cruiser-500W-Electric-Bike.jpg', manufacturerUrl: 'https://dirodi.com.au' },
  { brand: 'Dirodi', model: 'Explorer 250W', imageUrl: 'https://dirodi.com.au/wp-content/uploads/2024/01/Dirodi-Explorer-250W-Electric-Bike.jpg', manufacturerUrl: 'https://dirodi.com.au' },
  { brand: 'Dirodi', model: 'Explorer 500W', imageUrl: 'https://dirodi.com.au/wp-content/uploads/2024/01/Dirodi-Explorer-500W-Electric-Bike.jpg', manufacturerUrl: 'https://dirodi.com.au' },
  { brand: 'Dirodi', model: 'Adventure 250W', imageUrl: 'https://dirodi.com.au/wp-content/uploads/2024/01/Dirodi-Adventure-250W-Electric-Bike.jpg', manufacturerUrl: 'https://dirodi.com.au' },
  { brand: 'Dirodi', model: 'Adventure 500W', imageUrl: 'https://dirodi.com.au/wp-content/uploads/2024/01/Dirodi-Adventure-500W-Electric-Bike.jpg', manufacturerUrl: 'https://dirodi.com.au' },

  // Velectrix Bikes
  { brand: 'Velectrix', model: 'Foldaway', imageUrl: 'https://cdn.shopify.com/s/files/1/0569/6078/0207/products/VelectriX_Foldaway_1_1024x1024.jpg?v=1680664972', manufacturerUrl: 'https://velectrix.com.au' },
  { brand: 'Velectrix', model: 'Urban+ ST', imageUrl: 'https://cdn.shopify.com/s/files/1/0569/6078/0207/products/VelectriX_Urban_Plus_ST_1_1024x1024.jpg?v=1680664972', manufacturerUrl: 'https://velectrix.com.au' },
  { brand: 'Velectrix', model: 'Urban Pulse', imageUrl: 'https://cdn.shopify.com/s/files/1/0569/6078/0207/products/VelectriX_Urban_Pulse_1_1024x1024.jpg?v=1680664972', manufacturerUrl: 'https://velectrix.com.au' },
  { brand: 'Velectrix', model: 'Urban Pulse ST', imageUrl: 'https://cdn.shopify.com/s/files/1/0569/6078/0207/products/VelectriX_Urban_Pulse_ST_1_1024x1024.jpg?v=1680664972', manufacturerUrl: 'https://velectrix.com.au' },
  { brand: 'Velectrix', model: 'Cruiser ST', imageUrl: 'https://cdn.shopify.com/s/files/1/0569/6078/0207/products/VelectriX_Cruiser_ST_1_1024x1024.jpg?v=1680664972', manufacturerUrl: 'https://velectrix.com.au' },
  { brand: 'Velectrix', model: 'Cruiser Pulse STX', imageUrl: 'https://cdn.shopify.com/s/files/1/0569/6078/0207/products/VelectriX_Cruiser_Pulse_STX_1_1024x1024.jpg?v=1680664972', manufacturerUrl: 'https://velectrix.com.au' },
  { brand: 'Velectrix', model: 'Adventurer Pulse ST', imageUrl: 'https://cdn.shopify.com/s/files/1/0569/6078/0207/products/VelectriX_Adventurer_Pulse_ST_1_1024x1024.jpg?v=1680664972', manufacturerUrl: 'https://velectrix.com.au' },
  { brand: 'Velectrix', model: 'Ascent', imageUrl: 'https://cdn.shopify.com/s/files/1/0569/6078/0207/products/VelectriX_Ascent_1_1024x1024.jpg?v=1680664972', manufacturerUrl: 'https://velectrix.com.au' },
  { brand: 'Velectrix', model: 'SUV', imageUrl: 'https://cdn.shopify.com/s/files/1/0569/6078/0207/products/VelectriX_SUV_1_1024x1024.jpg?v=1680664972', manufacturerUrl: 'https://velectrix.com.au' },
  { brand: 'Velectrix', model: 'SUV+', imageUrl: 'https://cdn.shopify.com/s/files/1/0569/6078/0207/products/VelectriX_SUV_Plus_1_1024x1024.jpg?v=1680664972', manufacturerUrl: 'https://velectrix.com.au' },

  // Fatboy Bikes
  { brand: 'Fatboy', model: 'Harlem', imageUrl: 'https://fatboybikes.com.au/wp-content/uploads/2024/01/Fatboy-Harlem-500W-Electric-Bike.jpg', manufacturerUrl: 'https://fatboybikes.com.au' },
  { brand: 'Fatboy', model: 'Scrambler', imageUrl: 'https://fatboybikes.com.au/wp-content/uploads/2024/01/Fatboy-Scrambler-500W-Electric-Bike.jpg', manufacturerUrl: 'https://fatboybikes.com.au' },
  { brand: 'Fatboy', model: 'Bagus', imageUrl: 'https://fatboybikes.com.au/wp-content/uploads/2024/01/Fatboy-Bagus-500W-Electric-Bike.jpg', manufacturerUrl: 'https://fatboybikes.com.au' }
];

async function updateAllBikes() {
  console.log('🚀 Starting database update for all bikes...');
  console.log(`📊 Updating ${bikeUpdates.length} bikes with thumbnails and manufacturer URLs`);
  
  let successCount = 0;
  let failCount = 0;

  for (const bikeUpdate of bikeUpdates) {
    try {
      console.log(`\n🔍 Updating: ${bikeUpdate.brand} ${bikeUpdate.model}`);
      
      // Update the bike with image and manufacturer URL
      const { error } = await supabase
        .from('ebikes')
        .update({
          image_url: bikeUpdate.imageUrl,
          manufacturer_url: bikeUpdate.manufacturerUrl
        })
        .eq('brand', bikeUpdate.brand)
        .eq('model', bikeUpdate.model);

      if (error) {
        console.error(`❌ Failed to update ${bikeUpdate.brand} ${bikeUpdate.model}:`, error.message);
        failCount++;
      } else {
        console.log(`✅ Updated ${bikeUpdate.brand} ${bikeUpdate.model}`);
        console.log(`   🖼️ Image: ${bikeUpdate.imageUrl}`);
        console.log(`   🌐 Manufacturer: ${bikeUpdate.manufacturerUrl}`);
        successCount++;
      }

      // Small delay to avoid overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 100));
      
    } catch (error) {
      console.error(`❌ Error updating ${bikeUpdate.brand} ${bikeUpdate.model}:`, error.message);
      failCount++;
    }
  }

  console.log(`\n🎉 Database update complete!`);
  console.log(`✅ Successfully updated: ${successCount} bikes`);
  console.log(`❌ Failed to update: ${failCount} bikes`);
  
  // Verify the updates
  console.log(`\n🔍 Verifying updates...`);
  const { data: verification, error: verifyError } = await supabase
    .from('ebikes')
    .select('brand, model, image_url, manufacturer_url')
    .not('image_url', 'is', null)
    .not('manufacturer_url', 'is', null);

  if (verifyError) {
    console.error('❌ Failed to verify updates:', verifyError.message);
  } else {
    console.log(`✅ Verification: ${verification.length} bikes now have thumbnails and manufacturer URLs`);
  }
}

// Run the update
updateAllBikes().catch(console.error);
