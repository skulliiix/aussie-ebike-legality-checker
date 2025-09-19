// Script to update all bikes in database with thumbnails and manufacturer URLs
import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = process.env.VITE_SUPABASE_URL || 'https://pgpegcvyuflrvenjsltl.supabase.co';
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBncGVnY3Z5dWZscnZlbmpzbHRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNDEzNzUsImV4cCI6MjA3MzgxNzM3NX0.e2Q5FOHAK6MmUlqCESQEUZ67veuJ_ykT3TU49-p-Bx0';
const geminiApiKey = process.env.VITE_GEMINI_API_KEY || 'AIzaSyCpaIw6G0LdDKhiGl8Bq_W8N1J6anaiDlI';

const supabase = createClient(supabaseUrl, supabaseKey);

interface BikeRecord {
  id: string;
  brand: string;
  model: string;
  canonical_name: string;
  image_url?: string;
  manufacturer_url?: string;
}

interface GeminiResponse {
  imageUrl: string;
  manufacturerUrl: string;
}

async function callGeminiForThumbnails(bikeName: string): Promise<GeminiResponse | null> {
  const prompt = `Find the product image URL and manufacturer website URL for this e-bike: "${bikeName}"

Return ONLY a JSON response with this exact format:
{
  "imageUrl": "direct URL to product image/thumbnail",
  "manufacturerUrl": "manufacturer website URL"
}

Search for:
1. Official manufacturer website
2. Product pages with high-quality images
3. Authorized dealer websites

Respond ONLY with valid JSON.`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: prompt
          }]
        }],
        generationConfig: {
          responseMimeType: "application/json",
          temperature: 0.1,
          topK: 1,
          topP: 0.8,
          maxOutputTokens: 1024,
        }
      })
    });

    if (!response.ok) {
      console.error(`❌ Gemini API error for ${bikeName}:`, response.status);
      return null;
    }

    const data = await response.json();
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const text = data.candidates[0].content.parts[0].text;
      const result = JSON.parse(text);
      
      if (result.imageUrl && result.manufacturerUrl) {
        return result;
      }
    }
    
    return null;
  } catch (error) {
    console.error(`❌ Failed to get thumbnails for ${bikeName}:`, error);
    return null;
  }
}

async function updateBikeThumbnails() {
  console.log('🚀 Starting thumbnail update for all bikes...');
  
  try {
    // Get all bikes that don't have thumbnails or manufacturer URLs
    const { data: bikes, error } = await supabase
      .from('ebikes')
      .select('id, brand, model, canonical_name, image_url, manufacturer_url')
      .or('image_url.is.null,manufacturer_url.is.null');

    if (error) {
      console.error('❌ Failed to fetch bikes:', error);
      return;
    }

    if (!bikes || bikes.length === 0) {
      console.log('✅ All bikes already have thumbnails and manufacturer URLs!');
      return;
    }

    console.log(`📊 Found ${bikes.length} bikes needing thumbnails and URLs`);

    let successCount = 0;
    let failCount = 0;

    for (const bike of bikes) {
      console.log(`\n🔍 Processing: ${bike.canonical_name}`);
      
      try {
        const thumbnails = await callGeminiForThumbnails(bike.canonical_name);
        
        if (thumbnails) {
          const { error: updateError } = await supabase
            .from('ebikes')
            .update({
              image_url: thumbnails.imageUrl,
              manufacturer_url: thumbnails.manufacturerUrl
            })
            .eq('id', bike.id);

          if (updateError) {
            console.error(`❌ Failed to update ${bike.canonical_name}:`, updateError);
            failCount++;
          } else {
            console.log(`✅ Updated ${bike.canonical_name}`);
            console.log(`   🖼️ Image: ${thumbnails.imageUrl}`);
            console.log(`   🌐 Manufacturer: ${thumbnails.manufacturerUrl}`);
            successCount++;
          }
        } else {
          console.log(`⚠️ No thumbnails found for ${bike.canonical_name}`);
          failCount++;
        }

        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (error) {
        console.error(`❌ Error processing ${bike.canonical_name}:`, error);
        failCount++;
      }
    }

    console.log(`\n🎉 Thumbnail update complete!`);
    console.log(`✅ Successfully updated: ${successCount} bikes`);
    console.log(`❌ Failed to update: ${failCount} bikes`);

  } catch (error) {
    console.error('❌ Script failed:', error);
  }
}

// Run the script
updateBikeThumbnails();
