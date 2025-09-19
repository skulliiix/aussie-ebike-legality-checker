// Test the new thumbnail and manufacturer URL functionality
const apiKey = 'AIzaSyCpaIw6G0LdDKhiGl8Bq_W8N1J6anaiDlI';

async function testThumbnailAndUrl() {
  console.log('🖼️ Testing thumbnail and manufacturer URL collection...');
  console.log('🔍 Searching for: VelectriX Urban+ Electric Hybrid Bike');
  
  const prompt = `Analyze this e-bike with HIGH FOCUS on specific criteria. Prioritize manufacturer websites first.

SEARCH FOR: "VelectriX Urban+ Electric Hybrid Bike"

MANDATORY DATA COLLECTION:
1. MOTOR POWER: Continuous rated power in watts (locked/unlocked if applicable)
2. THROTTLE: Does it have throttle? Speed limits when locked/unlocked?
3. LOCK/UNLOCK: Can it be unlocked to higher power (500W+)?
4. CLASSIFICATION: "Electrically power-assisted cycles" OR "Power-assisted pedal cycles"
5. AUSTRALIAN COMPLIANCE: Which states is it legal in?
6. IMAGE URL: Find a product image/thumbnail of the e-bike
7. MANUFACTURER URL: Official manufacturer website URL

SEARCH PRIORITIES:
1. Manufacturer website ([brand].com.au or [brand].com)
2. Official manuals/specifications
3. Authorized dealers
4. Reputable review sites

REQUIRED JSON FORMAT:
{
  "ebikeName": "Exact brand and model name",
  "found": true/false,
  "wattage": {
    "value": number,
    "source": "URL",
    "confidence": "high/medium/low"
  },
  "hasThrottle": {
    "value": true/false,
    "source": "URL",
    "confidence": "high/medium/low"
  },
  "isPedalAssist": {
    "value": true/false,
    "source": "URL",
    "confidence": "high/medium/low"
  },
  "canUnlock": true/false,
  "unlockedSpecs": {
    "motorPower": number,
    "throttleMaxSpeed": number,
    "throttleRestricted": true/false,
    "compliance": "string",
    "notes": "string"
  },
  "imageUrl": "URL to e-bike product image/thumbnail",
  "manufacturerUrl": "URL to manufacturer website"
}

Be thorough. If insufficient data found, set found: false. Respond ONLY with valid JSON.`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
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
          maxOutputTokens: 4096,
        }
      })
    });

    console.log('📊 Response status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error:', response.status, errorText);
      return false;
    }

    const data = await response.json();
    console.log('✅ API Response received!');
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const text = data.candidates[0].content.parts[0].text;
      console.log('🤖 AI Response text:', text);
      
      try {
        const analysis = JSON.parse(text);
        console.log('\n🖼️ THUMBNAIL & URL TEST RESULTS:');
        console.log('==================================');
        console.log('📋 E-bike Name:', analysis.ebikeName);
        console.log('🔋 Motor Power:', analysis.wattage?.value + 'W');
        console.log('🎮 Has Throttle:', analysis.hasThrottle?.value);
        console.log('🚴 Pedal Assist:', analysis.isPedalAssist?.value);
        console.log('🔓 Can Unlock:', analysis.canUnlock);
        console.log('✅ Found:', analysis.found);
        
        console.log('\n🖼️ NEW UI FEATURES:');
        console.log('===================');
        console.log('🖼️ Image URL:', analysis.imageUrl || 'Not found');
        console.log('🌐 Manufacturer URL:', analysis.manufacturerUrl || 'Not found');
        
        if (analysis.imageUrl) {
          console.log('✅ Thumbnail will be displayed in UI');
        } else {
          console.log('❌ No thumbnail available');
        }
        
        if (analysis.manufacturerUrl) {
          console.log('✅ Manufacturer link will be clickable in UI');
        } else {
          console.log('❌ No manufacturer URL available');
        }
        
        return true;
      } catch (parseError) {
        console.error('❌ Failed to parse JSON:', parseError);
        console.log('📝 Raw text:', text);
        return false;
      }
    } else {
      console.log('❌ Unexpected response format');
      return false;
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    return false;
  }
}

testThumbnailAndUrl().then(success => {
  if (success) {
    console.log('\n🎉 SUCCESS! Thumbnail and URL collection is working!');
    console.log('🖼️ UI will now display e-bike thumbnails and manufacturer links.');
  } else {
    console.log('\n❌ Thumbnail and URL test failed. Check the errors above.');
  }
});
