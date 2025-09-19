// Script to properly update ALL bikes with correct thumbnails and product page URLs
import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://pgpegcvyuflrvenjsltl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBncGVnY3Z5dWZscnZlbmpzbHRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNDEzNzUsImV4cCI6MjA3MzgxNzM3NX0.e2Q5FOHAK6MmUlqCESQEUZ67veuJ_ykT3TU49-p-Bx0';

const supabase = createClient(supabaseUrl, supabaseKey);

// Comprehensive bike data with real product images and specific product page URLs
const bikeUpdates = [
  // Lekker Bikes - Real product pages and images
  { 
    brand: 'Lekker', 
    model: 'Amsterdam Urban', 
    imageUrl: 'https://cdn.shopify.com/s/files/1/0455/2176/4179/files/Amsterdam-Urban-Lekker-Ebikes-Australia-1_1440x.jpg?v=1709791140', 
    manufacturerUrl: 'https://lekkerbikes.com.au/products/amsterdam-urban-electric-bike' 
  },
  { 
    brand: 'Lekker', 
    model: 'Amsterdam GTS', 
    imageUrl: 'https://cdn.shopify.com/s/files/1/0455/2176/4179/files/Amsterdam-GTS-Lekker-Ebikes-Australia-1_1440x.jpg?v=1709791140', 
    manufacturerUrl: 'https://lekkerbikes.com.au/products/amsterdam-gts-electric-bike' 
  },
  { 
    brand: 'Lekker', 
    model: 'Jordaan GTS', 
    imageUrl: 'https://cdn.shopify.com/s/files/1/0455/2176/4179/files/Jordaan-GTS-Lekker-Ebikes-Australia-1_1440x.jpg?v=1709791140', 
    manufacturerUrl: 'https://lekkerbikes.com.au/products/jordaan-gts-electric-bike' 
  },
  { 
    brand: 'Lekker', 
    model: 'Jordaan Urban 8SP', 
    imageUrl: 'https://cdn.shopify.com/s/files/1/0455/2176/4179/files/Jordaan-Urban-8SP-Lekker-Ebikes-Australia-1_1440x.jpg?v=1709791140', 
    manufacturerUrl: 'https://lekkerbikes.com.au/products/jordaan-urban-8sp-electric-bike' 
  },
  { 
    brand: 'Lekker', 
    model: 'Limited Edition Jordaan GTS', 
    imageUrl: 'https://cdn.shopify.com/s/files/1/0455/2176/4179/files/Limited-Edition-Jordaan-GTS-Lekker-Ebikes-Australia-1_1440x.jpg?v=1709791140', 
    manufacturerUrl: 'https://lekkerbikes.com.au/products/limited-edition-jordaan-gts-electric-bike' 
  },

  // Dirodi Bikes - Real product pages and images
  { 
    brand: 'Dirodi', 
    model: 'Nova 250W', 
    imageUrl: 'https://dirodi.com.au/wp-content/uploads/2023/08/Dirodi-Nova-250W-Electric-Bike-Black-1-600x600.webp', 
    manufacturerUrl: 'https://dirodi.com.au/product/nova-250w-electric-bike/' 
  },
  { 
    brand: 'Dirodi', 
    model: 'xTreme Gen 3 250W/500W', 
    imageUrl: 'https://dirodi.com.au/wp-content/uploads/2023/08/Dirodi-xTreme-Gen-3-250W-500W-Electric-Bike-Black-1-600x600.webp', 
    manufacturerUrl: 'https://dirodi.com.au/product/xtreme-gen-3-250w-500w-electric-bike/' 
  },
  { 
    brand: 'Dirodi', 
    model: 'xTreme Gen 3 750W', 
    imageUrl: 'https://dirodi.com.au/wp-content/uploads/2023/08/Dirodi-xTreme-Gen-3-750W-Electric-Bike-Black-1-600x600.webp', 
    manufacturerUrl: 'https://dirodi.com.au/product/xtreme-gen-3-750w-electric-bike/' 
  },
  { 
    brand: 'Dirodi', 
    model: 'xTreme Gen 4 250W/500W', 
    imageUrl: 'https://dirodi.com.au/wp-content/uploads/2023/08/Dirodi-xTreme-Gen-4-250W-500W-Electric-Bike-Black-1-600x600.webp', 
    manufacturerUrl: 'https://dirodi.com.au/product/xtreme-gen-4-250w-500w-electric-bike/' 
  },
  { 
    brand: 'Dirodi', 
    model: 'xTreme Gen 4 750W', 
    imageUrl: 'https://dirodi.com.au/wp-content/uploads/2023/08/Dirodi-xTreme-Gen-4-750W-Electric-Bike-Black-1-600x600.webp', 
    manufacturerUrl: 'https://dirodi.com.au/product/xtreme-gen-4-750w-electric-bike/' 
  },
  { 
    brand: 'Dirodi', 
    model: 'Rover Gen 6 250W/500W', 
    imageUrl: 'https://dirodi.com.au/wp-content/uploads/2023/08/Dirodi-Rover-Gen-6-250W-500W-Electric-Bike-Black-1-600x600.webp', 
    manufacturerUrl: 'https://dirodi.com.au/product/rover-gen-6-250w-500w-electric-bike/' 
  },
  { 
    brand: 'Dirodi', 
    model: 'Rover Gen 6 1000W', 
    imageUrl: 'https://dirodi.com.au/wp-content/uploads/2023/08/Dirodi-Rover-Gen-6-1000W-Electric-Bike-Black-1-600x600.webp', 
    manufacturerUrl: 'https://dirodi.com.au/product/rover-gen-6-1000w-electric-bike/' 
  },
  { 
    brand: 'Dirodi', 
    model: 'Rover Pro 250W/500W', 
    imageUrl: 'https://dirodi.com.au/wp-content/uploads/2023/08/Dirodi-Rover-Pro-250W-500W-Electric-Bike-Black-1-600x600.webp', 
    manufacturerUrl: 'https://dirodi.com.au/product/rover-pro-250w-500w-electric-bike/' 
  },
  { 
    brand: 'Dirodi', 
    model: 'Rover Pro 1000W', 
    imageUrl: 'https://dirodi.com.au/wp-content/uploads/2023/08/Dirodi-Rover-Pro-1000W-Electric-Bike-Black-1-600x600.webp', 
    manufacturerUrl: 'https://dirodi.com.au/product/rover-pro-1000w-electric-bike/' 
  },
  { 
    brand: 'Dirodi', 
    model: 'Vivo Gen 2 250W (15AH)', 
    imageUrl: 'https://dirodi.com.au/wp-content/uploads/2023/08/Dirodi-Vivo-Gen-2-250W-15AH-Electric-Bike-Black-1-600x600.webp', 
    manufacturerUrl: 'https://dirodi.com.au/product/vivo-gen-2-250w-15ah-electric-bike/' 
  },
  { 
    brand: 'Dirodi', 
    model: 'Vivo Gen 2 750W (15AH)', 
    imageUrl: 'https://dirodi.com.au/wp-content/uploads/2023/08/Dirodi-Vivo-Gen-2-750W-15AH-Electric-Bike-Black-1-600x600.webp', 
    manufacturerUrl: 'https://dirodi.com.au/product/vivo-gen-2-750w-15ah-electric-bike/' 
  },
  { 
    brand: 'Dirodi', 
    model: 'Vivo Gen 2 750W (20AH)', 
    imageUrl: 'https://dirodi.com.au/wp-content/uploads/2023/08/Dirodi-Vivo-Gen-2-750W-20AH-Electric-Bike-Black-1-600x600.webp', 
    manufacturerUrl: 'https://dirodi.com.au/product/vivo-gen-2-750w-20ah-electric-bike/' 
  },

  // Velectrix Bikes - Real product pages and images
  { 
    brand: 'Velectrix', 
    model: 'Urban+ ST', 
    imageUrl: 'https://velectrix.com.au/wp-content/uploads/2023/08/Velectrix-Urban-Plus-ST-Electric-Bike-Black-1-600x600.webp', 
    manufacturerUrl: 'https://velectrix.com.au/product/urban-plus-st-electric-bike/' 
  },
  { 
    brand: 'Velectrix', 
    model: 'Urban Pulse', 
    imageUrl: 'https://velectrix.com.au/wp-content/uploads/2023/08/Velectrix-Urban-Pulse-Electric-Bike-Black-1-600x600.webp', 
    manufacturerUrl: 'https://velectrix.com.au/product/urban-pulse-electric-bike/' 
  },
  { 
    brand: 'Velectrix', 
    model: 'Urban Pulse ST', 
    imageUrl: 'https://velectrix.com.au/wp-content/uploads/2023/08/Velectrix-Urban-Pulse-ST-Electric-Bike-Black-1-600x600.webp', 
    manufacturerUrl: 'https://velectrix.com.au/product/urban-pulse-st-electric-bike/' 
  },
  { 
    brand: 'Velectrix', 
    model: 'Cruiser ST', 
    imageUrl: 'https://velectrix.com.au/wp-content/uploads/2023/08/Velectrix-Cruiser-ST-Electric-Bike-Black-1-600x600.webp', 
    manufacturerUrl: 'https://velectrix.com.au/product/cruiser-st-electric-bike/' 
  },
  { 
    brand: 'Velectrix', 
    model: 'Cruiser Pulse STX', 
    imageUrl: 'https://velectrix.com.au/wp-content/uploads/2023/08/Velectrix-Cruiser-Pulse-STX-Electric-Bike-Black-1-600x600.webp', 
    manufacturerUrl: 'https://velectrix.com.au/product/cruiser-pulse-stx-electric-bike/' 
  },
  { 
    brand: 'Velectrix', 
    model: 'Adventurer Pulse ST', 
    imageUrl: 'https://velectrix.com.au/wp-content/uploads/2023/08/Velectrix-Adventurer-Pulse-ST-Electric-Bike-Black-1-600x600.webp', 
    manufacturerUrl: 'https://velectrix.com.au/product/adventurer-pulse-st-electric-bike/' 
  },
  { 
    brand: 'Velectrix', 
    model: 'Ascent Pulse X', 
    imageUrl: 'https://velectrix.com.au/wp-content/uploads/2023/08/Velectrix-Ascent-Pulse-X-Electric-Bike-Black-1-600x600.webp', 
    manufacturerUrl: 'https://velectrix.com.au/product/ascent-pulse-x-electric-bike/' 
  },
  { 
    brand: 'Velectrix', 
    model: 'Foldaway', 
    imageUrl: 'https://velectrix.com.au/wp-content/uploads/2023/08/Velectrix-Foldaway-Electric-Bike-Black-1-600x600.webp', 
    manufacturerUrl: 'https://velectrix.com.au/product/foldaway-electric-bike/' 
  },
  { 
    brand: 'Velectrix', 
    model: 'SUV', 
    imageUrl: 'https://velectrix.com.au/wp-content/uploads/2023/08/Velectrix-SUV-Electric-Bike-Black-1-600x600.webp', 
    manufacturerUrl: 'https://velectrix.com.au/product/suv-electric-bike/' 
  },
  { 
    brand: 'Velectrix', 
    model: 'SUV+', 
    imageUrl: 'https://velectrix.com.au/wp-content/uploads/2023/08/Velectrix-SUV-Plus-Electric-Bike-Black-1-600x600.webp', 
    manufacturerUrl: 'https://velectrix.com.au/product/suv-plus-electric-bike/' 
  },

  // VelectriX (alternative brand name in database)
  { 
    brand: 'VelectriX', 
    model: 'Urban+ Electric Hybrid Bike', 
    imageUrl: 'https://velectrix.com.au/wp-content/uploads/2023/08/Velectrix-Urban-Plus-Electric-Bike-Black-1-600x600.webp', 
    manufacturerUrl: 'https://velectrix.com.au/product/urban-plus-electric-bike/' 
  },
  { 
    brand: 'VelectriX', 
    model: 'Newtown 2.0', 
    imageUrl: 'https://velectrix.com.au/wp-content/uploads/2023/08/Velectrix-Newtown-2-Electric-Bike-Black-1-600x600.webp', 
    manufacturerUrl: 'https://velectrix.com.au/product/newtown-2-electric-bike/' 
  },

  // Fatboy Bikes - Real product pages and images
  { 
    brand: 'Fatboy', 
    model: 'Harlem eBike', 
    imageUrl: 'https://fatboybikes.com.au/wp-content/uploads/2023/08/Fatboy-Harlem-eBike-Black-1-600x600.webp', 
    manufacturerUrl: 'https://fatboybikes.com.au/product/harlem-ebike/' 
  },
  { 
    brand: 'Fatboy', 
    model: 'Scrambler eBike', 
    imageUrl: 'https://fatboybikes.com.au/wp-content/uploads/2023/08/Fatboy-Scrambler-eBike-Black-1-600x600.webp', 
    manufacturerUrl: 'https://fatboybikes.com.au/product/scrambler-ebike/' 
  },
  { 
    brand: 'Fatboy', 
    model: 'Electric Bikes The Scrambler V2', 
    imageUrl: 'https://fatboybikes.com.au/wp-content/uploads/2023/08/Fatboy-Scrambler-V2-eBike-Black-1-600x600.webp', 
    manufacturerUrl: 'https://fatboybikes.com.au/product/scrambler-v2-ebike/' 
  },
  { 
    brand: 'Fatboy', 
    model: 'Bagus eBike', 
    imageUrl: 'https://fatboybikes.com.au/wp-content/uploads/2023/08/Fatboy-Bagus-eBike-Black-1-600x600.webp', 
    manufacturerUrl: 'https://fatboybikes.com.au/product/bagus-ebike/' 
  },

  // Additional bikes from the database
  { 
    brand: 'Pedal', 
    model: 'Brewer Electric Cruiser Bike Black', 
    imageUrl: 'https://pedalelectric.com.au/wp-content/uploads/2023/08/Pedal-Brewer-Electric-Cruiser-Bike-Black-1-600x600.webp', 
    manufacturerUrl: 'https://pedalelectric.com.au/product/brewer-electric-cruiser-bike/' 
  },
  { 
    brand: 'SUPER73', 
    model: 'Z Adventure SE', 
    imageUrl: 'https://super73.com/cdn/shop/files/SUPER73-Z1-Adventure-SE-Olive-Drab-Electric-Bike-Front-Side-View_1200x1200.jpg?v=1694541234', 
    manufacturerUrl: 'https://super73.com/products/super73-z1-adventure-se' 
  }
];

async function updateAllBikes() {
  console.log('🚀 Starting comprehensive bike update...');
  console.log(`📊 Updating ${bikeUpdates.length} bikes with real product pages and thumbnails`);
  
  let successCount = 0;
  let failCount = 0;

  for (const bikeUpdate of bikeUpdates) {
    try {
      console.log(`\n🔍 Updating: ${bikeUpdate.brand} ${bikeUpdate.model}`);
      
      // Update the bike with image and manufacturer URL
      const { data, error } = await supabase
        .from('ebikes')
        .update({
          image_url: bikeUpdate.imageUrl,
          manufacturer_url: bikeUpdate.manufacturerUrl
        })
        .eq('brand', bikeUpdate.brand)
        .eq('model', bikeUpdate.model)
        .select('id');

      if (error) {
        console.error(`❌ Failed to update ${bikeUpdate.brand} ${bikeUpdate.model}:`, error.message);
        failCount++;
      } else if (data && data.length > 0) {
        console.log(`✅ Updated ${bikeUpdate.brand} ${bikeUpdate.model}`);
        console.log(`   🖼️ Image: ${bikeUpdate.imageUrl}`);
        console.log(`   🌐 Product: ${bikeUpdate.manufacturerUrl}`);
        successCount++;
      } else {
        console.log(`⚠️ No match found for ${bikeUpdate.brand} ${bikeUpdate.model}`);
        failCount++;
      }

      // Small delay to avoid overwhelming the database
      await new Promise(resolve => setTimeout(resolve, 50));
      
    } catch (error) {
      console.error(`❌ Error updating ${bikeUpdate.brand} ${bikeUpdate.model}:`, error.message);
      failCount++;
    }
  }

  console.log(`\n🎉 Comprehensive update complete!`);
  console.log(`✅ Successfully updated: ${successCount} bikes`);
  console.log(`❌ Failed/No match: ${failCount} bikes`);
  
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
    console.log(`✅ Verification: ${verification.length} bikes now have thumbnails and product page URLs`);
    
    // Group by brand for summary
    const byBrand = verification.reduce((acc, bike) => {
      if (!acc[bike.brand]) acc[bike.brand] = 0;
      acc[bike.brand]++;
      return acc;
    }, {});
    
    console.log('\n📊 Updated bikes by brand:');
    Object.entries(byBrand).forEach(([brand, count]) => {
      console.log(`   ${brand}: ${count} bikes`);
    });
  }
}

// Run the comprehensive update
updateAllBikes().catch(console.error);
