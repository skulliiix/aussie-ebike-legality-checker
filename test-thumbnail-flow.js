// Test the complete flow from database to UI to see why thumbnails aren't showing
import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://pgpegcvyuflrvenjsltl.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBncGVnY3Z5dWZscnZlbmpzbHRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNDEzNzUsImV4cCI6MjA3MzgxNzM3NX0.e2Q5FOHAK6MmUlqCESQEUZ67veuJ_ykT3TU49-p-Bx0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testSearchFlow() {
  console.log('🧪 Testing complete search flow for "Jordaan GTS"...');
  
  try {
    // Simulate the exact search that the app does
    const query = 'Jordaan GTS';
    
    console.log(`\n1️⃣ TESTING DATABASE SEARCH: "${query}"`);
    console.log('='.repeat(50));
    
    // This mimics databaseService.searchBikes()
    const { data, error } = await supabase
      .from('ebikes')
      .select('*')
      .or(`canonical_name.ilike.%${query}%,brand.ilike.%${query}%,model.ilike.%${query}%`)
      .order('search_count', { ascending: false })
      .limit(20);

    if (error) {
      console.error('❌ Database search error:', error);
      return;
    }

    console.log(`📊 Found ${data.length} matches in database`);
    
    if (data.length === 0) {
      console.log('❌ No matches found!');
      return;
    }

    // Show the first match (what would be returned)
    const firstMatch = data[0];
    console.log('\n2️⃣ FIRST MATCH DATA FROM DATABASE:');
    console.log('='.repeat(50));
    console.log(`Brand: ${firstMatch.brand}`);
    console.log(`Model: ${firstMatch.model}`);
    console.log(`Canonical Name: ${firstMatch.canonical_name}`);
    console.log(`Image URL: ${firstMatch.image_url}`);
    console.log(`Manufacturer URL: ${firstMatch.manufacturer_url}`);
    
    // Check if image URL is accessible
    console.log('\n3️⃣ TESTING IMAGE URL ACCESSIBILITY:');
    console.log('='.repeat(50));
    
    if (firstMatch.image_url) {
      try {
        const imageResponse = await fetch(firstMatch.image_url, { method: 'HEAD' });
        console.log(`Image URL Status: ${imageResponse.status} ${imageResponse.statusText}`);
        console.log(`Content-Type: ${imageResponse.headers.get('content-type')}`);
        
        if (imageResponse.ok) {
          console.log('✅ Image URL is accessible');
        } else {
          console.log('❌ Image URL is not accessible');
        }
      } catch (imageError) {
        console.log(`❌ Failed to fetch image: ${imageError.message}`);
      }
    } else {
      console.log('❌ No image URL in database');
    }

    // Test manufacturer URL
    console.log('\n4️⃣ TESTING MANUFACTURER URL:');
    console.log('='.repeat(50));
    
    if (firstMatch.manufacturer_url) {
      try {
        const urlResponse = await fetch(firstMatch.manufacturer_url, { method: 'HEAD' });
        console.log(`Manufacturer URL Status: ${urlResponse.status} ${urlResponse.statusText}`);
        
        if (urlResponse.ok) {
          console.log('✅ Manufacturer URL is accessible');
        } else {
          console.log('❌ Manufacturer URL is not accessible');
        }
      } catch (urlError) {
        console.log(`❌ Failed to fetch manufacturer URL: ${urlError.message}`);
      }
    } else {
      console.log('❌ No manufacturer URL in database');
    }

    // Show what the convertDbToSearchable function would produce
    console.log('\n5️⃣ CONVERTED TO SEARCHABLE FORMAT:');
    console.log('='.repeat(50));
    const searchableBike = {
      id: firstMatch.id,
      brand: firstMatch.brand,
      model: firstMatch.model,
      canonicalName: firstMatch.canonical_name,
      aliases: firstMatch.aliases,
      motorPower: firstMatch.motor_power,
      hasThrottle: firstMatch.has_throttle,
      maxSpeed: firstMatch.max_speed,
      torque: firstMatch.torque,
      motorDetails: firstMatch.motor_details,
      batteryVoltage: firstMatch.battery_voltage,
      batteryCapacityWh: firstMatch.battery_capacity_wh,
      bikeType: firstMatch.bike_type,
      compliance: firstMatch.compliance,
      legalInAustralia: firstMatch.legal_in_australia,
      notes: firstMatch.notes,
      canUnlock: firstMatch.can_unlock,
      unlockedMotorPower: firstMatch.unlocked_motor_power,
      unlockedTorque: firstMatch.unlocked_torque,
      unlockedThrottleRestricted: firstMatch.unlocked_throttle_restricted,
      unlockedMaxSpeed: firstMatch.unlocked_max_speed,
      unlockedLegalInStates: firstMatch.unlocked_legal_in_states,
      unlockedCompliance: firstMatch.unlocked_compliance,
      unlockedNotes: firstMatch.unlocked_notes,
      imageUrl: firstMatch.image_url,
      manufacturerUrl: firstMatch.manufacturer_url
    };

    console.log(`📱 SearchableBike imageUrl: ${searchableBike.imageUrl}`);
    console.log(`🌐 SearchableBike manufacturerUrl: ${searchableBike.manufacturerUrl}`);

    // Show what would go to the UI
    console.log('\n6️⃣ WHAT WOULD BE SENT TO UI:');
    console.log('='.repeat(50));
    
    const analysisResult = {
      ebikeName: `${searchableBike.brand} ${searchableBike.model}`,
      found: true,
      wattage: { value: searchableBike.motorPower, confidence: 'high' },
      hasThrottle: { value: searchableBike.hasThrottle, confidence: 'high' },
      isPedalAssist: { value: !searchableBike.hasThrottle, confidence: 'high' },
      legality: [], // Would be calculated
      dataSource: 'database',
      canUnlock: searchableBike.canUnlock || false,
      isUnlocked: false,
      bikeId: searchableBike.id,
      imageUrl: searchableBike.imageUrl,
      manufacturerUrl: searchableBike.manufacturerUrl
    };

    console.log(`🎯 Final imageUrl for UI: ${analysisResult.imageUrl}`);
    console.log(`🎯 Final manufacturerUrl for UI: ${analysisResult.manufacturerUrl}`);

    if (analysisResult.imageUrl && analysisResult.manufacturerUrl) {
      console.log('\n✅ THUMBNAILS SHOULD WORK!');
      console.log('The data flow is complete and URLs are present.');
      console.log('\nIf thumbnails still don\'t show, the issue is likely in:');
      console.log('1. Image CORS policy');
      console.log('2. UI rendering logic');
      console.log('3. CSS styling hiding the images');
    } else {
      console.log('\n❌ THUMBNAILS WILL NOT WORK!');
      console.log('Missing imageUrl or manufacturerUrl in the final result.');
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testSearchFlow().catch(console.error);
