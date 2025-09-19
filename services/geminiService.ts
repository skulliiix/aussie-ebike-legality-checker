import type { EbikeAnalysisResult } from '../types';
import { determineLegality, getAllStateCodes } from './lawService';
import { databaseService } from './databaseService';

// Get API key from environment with proper Vite handling
function getGeminiApiKey(): string | null {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  console.log('🔍 Checking for Gemini API key...');
  console.log('Environment check:', {
    hasViteGeminiKey: !!import.meta.env.VITE_GEMINI_API_KEY,
    keyLength: apiKey ? apiKey.length : 0
  });
  
  return apiKey || null;
}

// Call Gemini API using fetch (more compatible approach)
async function callGeminiAPI(prompt: string): Promise<any> {
  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    throw new Error('Gemini API key not found. Make sure VITE_GEMINI_API_KEY is set in your .env file.');
  }

  console.log('🚀 Calling Gemini API...');
  
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

  if (!response.ok) {
    const errorText = await response.text();
    console.error('❌ Gemini API error:', response.status, errorText);
    throw new Error(`Gemini API error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  console.log('🔍 Gemini API response:', data);
  
  if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
    throw new Error('Invalid response format from Gemini API');
  }

  const text = data.candidates[0].content.parts[0].text;
  console.log('🔍 Raw Gemini response text:', text);
  
  try {
    // Clean up the response text (remove any markdown formatting)
    const cleanText = text.replace(/```json\s*|\s*```/g, '').trim();
    return JSON.parse(cleanText);
  } catch (parseError) {
    console.error('❌ Failed to parse Gemini response as JSON:', parseError);
    console.error('❌ Raw response:', text);
    throw new Error('Invalid response format from Gemini AI');
  }
}

const prompt = `Analyze this e-bike with HIGH FOCUS on specific criteria. Prioritize manufacturer websites first.

SEARCH FOR: "{query}"

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

export async function analyzeEbikeLegality(query: string): Promise<EbikeAnalysisResult> {
  console.log(`🤖 GEMINI ANALYSIS: "${query}"`);
  
  try {
    const analysis = await callGeminiAPI(prompt.replace('{query}', query));
    
    console.log(`✅ Gemini analysis complete for: ${analysis.ebikeName}`);
    
    // Calculate legality for all states
    const stateCodes = getAllStateCodes();
    const legality = stateCodes.map(stateCode => 
      determineLegality(analysis.wattage, analysis.hasThrottle, analysis.isPedalAssist, stateCode)
    );
    
    const resultWithLegality: EbikeAnalysisResult = {
      ...analysis,
      legality,
      dataSource: 'gemini' as const,
      canUnlock: analysis.canUnlock || false,
      isUnlocked: false,
      bikeId: null
    };

    // Auto-save to database if bike was found
    if (analysis.found) {
      console.log(`💾 Auto-saving new bike to database: ${analysis.ebikeName}`);
      try {
        const bikeId = await databaseService.saveBikeFromGemini(resultWithLegality);
        if (bikeId) {
          resultWithLegality.bikeId = bikeId;
          console.log(`✅ Bike saved with ID: ${bikeId}`);
        }
      } catch (error) {
        console.error('❌ Failed to save bike to database:', error);
        // Continue anyway - don't fail the analysis
      }
    }
    
    return resultWithLegality;
    
  } catch (error) {
    console.error('❌ Gemini analysis failed:', error);
    
    // Provide helpful error messages
    if (error instanceof Error) {
      if (error.message?.includes('API_KEY_INVALID') || error.message?.includes('API key')) {
        throw new Error('Invalid Gemini API key. Please check your VITE_GEMINI_API_KEY in your .env file.');
      } else if (error.message?.includes('quota') || error.message?.includes('limit')) {
        throw new Error('Gemini API quota exceeded. Please check your Google AI Studio usage.');
      } else {
        throw new Error(`AI analysis failed: ${error.message}`);
      }
    } else {
      throw new Error('AI analysis failed: Unknown error');
    }
  }
}

// Check if Gemini is available
export function isGeminiAvailable(): boolean {
  const apiKey = getGeminiApiKey();
  console.log('🔍 Checking Gemini availability:', !!apiKey);
  return !!apiKey;
}

// Legacy function for backward compatibility
export async function searchEbikes(query: string, enableGemini: boolean = true): Promise<EbikeAnalysisResult> {
  if (!enableGemini) {
    throw new Error(`E-bike "${query}" not found in database. Enable AI search to analyze unknown bikes.`);
  }
  
  return analyzeEbikeLegality(query);
}
