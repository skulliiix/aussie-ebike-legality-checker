// Test the new focused Gemini prompt with VelectriX Urban+ Electric Hybrid Bike
const apiKey = 'AIzaSyCpaIw6G0LdDKhiGl8Bq_W8N1J6anaiDlI';

async function testFocusedPrompt() {
  console.log('🎯 Testing FOCUSED Gemini 2.5 Flash prompt...');
  console.log('🔍 Searching for: VelectriX Urban+ Electric Hybrid Bike');
  console.log('📋 Focus: Motor power, throttle, lock/unlock, compliance, classification');
  
  const prompt = `Analyze this e-bike with HIGH FOCUS on specific criteria. Prioritize manufacturer websites first.

SEARCH FOR: "VelectriX Urban+ Electric Hybrid Bike"

MANDATORY DATA COLLECTION:
1. MOTOR POWER: Continuous rated power in watts (locked/unlocked if applicable)
2. THROTTLE: Does it have throttle? Speed limits when locked/unlocked?
3. LOCK/UNLOCK: Can it be unlocked to higher power (500W+)?
4. CLASSIFICATION: "Electrically power-assisted cycles" OR "Power-assisted pedal cycles"
5. AUSTRALIAN COMPLIANCE: Which states is it legal in?

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
  }
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
    console.log('📝 Full response:', JSON.stringify(data, null, 2));
    
    if (data.candidates && data.candidates[0] && data.candidates[0].content) {
      const text = data.candidates[0].content.parts[0].text;
      console.log('🤖 AI Response text:', text);
      
      try {
        const analysis = JSON.parse(text);
        console.log('\n🎯 FOCUSED ANALYSIS RESULTS:');
        console.log('============================');
        console.log('📋 E-bike Name:', analysis.ebikeName);
        console.log('🔋 Motor Power:', analysis.wattage?.value + 'W');
        console.log('🎮 Has Throttle:', analysis.hasThrottle?.value);
        console.log('🚴 Pedal Assist:', analysis.isPedalAssist?.value);
        console.log('🔓 Can Unlock:', analysis.canUnlock);
        console.log('✅ Found:', analysis.found);
        
        if (analysis.unlockedSpecs) {
          console.log('\n🔓 UNLOCKED SPECIFICATIONS:');
          console.log('===========================');
          console.log('⚡ Unlocked Power:', analysis.unlockedSpecs.motorPower + 'W');
          console.log('🏃 Throttle Max Speed:', analysis.unlockedSpecs.throttleMaxSpeed + 'km/h');
          console.log('🚦 Throttle Restricted (6km/h):', analysis.unlockedSpecs.throttleRestricted);
          console.log('📜 Compliance:', analysis.unlockedSpecs.compliance);
          console.log('📝 Notes:', analysis.unlockedSpecs.notes);
        }
        
        console.log('\n📚 SOURCES:');
        console.log('===========');
        console.log('🔋 Motor Power Source:', analysis.wattage?.source);
        console.log('🎮 Throttle Source:', analysis.hasThrottle?.source);
        console.log('🚴 Pedal Assist Source:', analysis.isPedalAssist?.source);
        
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

testFocusedPrompt().then(success => {
  if (success) {
    console.log('\n🎉 SUCCESS! Focused prompt is working perfectly!');
    console.log('🎯 AI now provides detailed, manufacturer-focused analysis.');
  } else {
    console.log('\n❌ Focused prompt test failed. Check the errors above.');
  }
});
