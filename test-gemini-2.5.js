// Test Gemini 2.5 Flash API with VelectriX Urban+ Electric Hybrid Bike
const apiKey = 'AIzaSyCpaIw6G0LdDKhiGl8Bq_W8N1J6anaiDlI';

async function testGemini25() {
  console.log('🚀 Testing Gemini 2.5 Flash API...');
  console.log('🔍 Searching for: VelectriX Urban+ Electric Hybrid Bike');
  
  const prompt = `You are an expert e-bike analyst specializing in Australian e-bike regulations. Your task is to analyze e-bike specifications and determine their legality across Australian states.

IMPORTANT AUSTRALIAN E-BIKE LAWS:
- NSW: Up to 500W with throttle allowed (throttle limited to 6km/h for electrically power-assisted cycles)
- VIC: Up to 250W with throttle allowed (throttle limited to 6km/h "walk mode")
- QLD, WA, TAS: Any throttle = motorbike requiring license and registration
- SA, NT, ACT: Up to 200W with throttle allowed, 250W+ throttle illegal

SEARCH FOR: "VelectriX Urban+ Electric Hybrid Bike"

Please analyze this e-bike and provide a JSON response with the following structure:
{
  "ebikeName": "Full brand and model name",
  "found": true/false,
  "wattage": {
    "value": number (motor power in watts),
    "source": "URL or source where found",
    "confidence": "high/medium/low"
  },
  "hasThrottle": {
    "value": true/false,
    "source": "URL or source where found", 
    "confidence": "high/medium/low"
  },
  "isPedalAssist": {
    "value": true/false,
    "source": "URL or source where found",
    "confidence": "high/medium/low"
  },
  "canUnlock": false,
  "unlockedSpecs": null
}

Find the exact e-bike model and provide:
1. Full model name (brand + model)
2. Motor power in watts (continuous rated power)
3. Whether it has a throttle (can propel without pedaling)
4. Whether it's primarily pedal-assist

Look for official specifications, manufacturer websites, and reliable e-bike databases. Be precise about power ratings and throttle capabilities.

If you cannot find the specific model, set found: false and provide the best available information.

Respond ONLY with valid JSON.`;

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
          maxOutputTokens: 2048,
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
    console.log('📝 Full response:', JSON.stringify(data, null, 2));
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const text = data.candidates[0].content.parts[0].text;
      console.log('🤖 AI Response text:', text);
      
      try {
        const analysis = JSON.parse(text);
        console.log('✅ Successfully parsed JSON response:');
        console.log('📋 E-bike Name:', analysis.ebikeName);
        console.log('🔋 Motor Power:', analysis.wattage?.value + 'W');
        console.log('🎮 Has Throttle:', analysis.hasThrottle?.value);
        console.log('🚴 Pedal Assist:', analysis.isPedalAssist?.value);
        console.log('✅ Found:', analysis.found);
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

testGemini25().then(success => {
  if (success) {
    console.log('\n🎉 SUCCESS! Gemini 2.5 Flash is working perfectly!');
    console.log('🔄 Your app should now work with AI search.');
  } else {
    console.log('\n❌ Gemini 2.5 Flash test failed. Check the errors above.');
  }
});
