import { GoogleGenAI, Type } from "@google/genai";
import type { EbikeAnalysisResult } from '../types';
import { determineLegality, getAllStateCodes } from './lawService';
import { databaseService } from './databaseService';

// Get API key from environment with proper fallback
function getGeminiApiKey(): string | null {
  // Try different possible environment variable names
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY || 
                import.meta.env.GEMINI_API_KEY ||
                process.env.GEMINI_API_KEY ||
                process.env.API_KEY;
  
  return apiKey || null;
}

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    ebikeName: { type: Type.STRING, description: 'The full name of the e-bike model found.' },
    found: { type: Type.BOOLEAN, description: 'Whether the e-bike specifications could be found.' },
    wattage: { 
      type: Type.OBJECT,
      properties: {
        value: { type: Type.NUMBER, description: 'The continuous motor power in watts.' },
        source: { type: Type.STRING, description: 'URL or source where this specification was found.' },
        confidence: { type: Type.STRING, enum: ['high', 'medium', 'low'], description: 'Confidence level in the accuracy of this specification.' }
      },
      required: ['value', 'source', 'confidence']
    },
    hasThrottle: { 
      type: Type.OBJECT,
      properties: {
        value: { type: Type.BOOLEAN, description: 'Does the e-bike have a throttle that can propel it without pedaling?' },
        source: { type: Type.STRING, description: 'URL or source where this specification was found.' },
        confidence: { type: Type.STRING, enum: ['high', 'medium', 'low'], description: 'Confidence level in the accuracy of this specification.' }
      },
      required: ['value', 'source', 'confidence']
    },
    isPedalAssist: { 
      type: Type.OBJECT,
      properties: {
        value: { type: Type.BOOLEAN, description: 'Is the motor primarily a pedal-assist type?' },
        source: { type: Type.STRING, description: 'URL or source where this specification was found.' },
        confidence: { type: Type.STRING, enum: ['high', 'medium', 'low'], description: 'Confidence level in the accuracy of this specification.' }
      },
      required: ['value', 'source', 'confidence']
    },
    canUnlock: {
      type: Type.BOOLEAN,
      description: 'Can this e-bike be unlocked to higher power settings? Look for mentions of "unlockable", "derestricted", or similar terms.'
    },
    unlockedSpecs: {
      type: Type.OBJECT,
      properties: {
        motorPower: { type: Type.NUMBER, description: 'Motor power when unlocked (watts)' },
        torque: { type: Type.NUMBER, description: 'Motor torque when unlocked (Nm)' },
        throttleRestricted: { type: Type.BOOLEAN, description: 'Is throttle still restricted when unlocked?' },
        maxSpeed: { type: Type.NUMBER, description: 'Maximum speed when unlocked (km/h)' },
        legalInStates: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Which Australian states allow the unlocked configuration' },
        compliance: { type: Type.STRING, description: 'Compliance status when unlocked' },
        notes: { type: Type.STRING, description: 'Additional notes about unlocked configuration' }
      },
      required: ['motorPower', 'throttleRestricted', 'maxSpeed']
    }
  },
  required: ['ebikeName', 'found', 'wattage', 'hasThrottle', 'isPedalAssist', 'canUnlock']
};

// Initialize AI client lazily
let aiClient: GoogleGenAI | null = null;
let model: any = null;

function initializeGemini(): { client: GoogleGenAI; model: any } | null {
  if (aiClient && model) {
    return { client: aiClient, model };
  }

  const apiKey = getGeminiApiKey();
  if (!apiKey) {
    console.warn('🚫 Gemini API key not found. AI search will be unavailable.');
    return null;
  }

  try {
    aiClient = new GoogleGenAI({ apiKey });
    model = aiClient.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      generationConfig: {
        responseSchema: responseSchema,
        temperature: 0.1,
        topK: 1,
        topP: 0.8,
        maxOutputTokens: 1024,
      }
    });

    console.log('✅ Gemini AI initialized successfully');
    return { client: aiClient, model };
  } catch (error) {
    console.error('❌ Failed to initialize Gemini AI:', error);
    return null;
  }
}

const prompt = `You are an expert e-bike analyst specializing in Australian e-bike regulations. Your task is to analyze e-bike specifications and determine their legality across Australian states.

IMPORTANT AUSTRALIAN E-BIKE LAWS:
- NSW: Up to 500W with throttle allowed (throttle limited to 6km/h for electrically power-assisted cycles)
- VIC: Up to 250W with throttle allowed (throttle limited to 6km/h "walk mode")
- QLD, WA, TAS: Any throttle = motorbike requiring license and registration
- SA, NT, ACT: Up to 200W with throttle allowed, 250W+ throttle illegal

SEARCH FOR: "{query}"

Find the exact e-bike model and provide:
1. Full model name (brand + model)
2. Motor power in watts (continuous rated power)
3. Whether it has a throttle (can propel without pedaling)
4. Whether it's primarily pedal-assist
5. If it can be unlocked to higher power settings
6. Unlocked specifications if applicable

Look for official specifications, manufacturer websites, and reliable e-bike databases. Be precise about power ratings and throttle capabilities.

If you cannot find the specific model, set found: false and provide the best available information.`;

export async function analyzeEbikeLegality(query: string): Promise<EbikeAnalysisResult> {
  console.log(`🤖 GEMINI ANALYSIS: "${query}"`);
  
  // Check if Gemini is available
  const gemini = initializeGemini();
  if (!gemini) {
    throw new Error('Gemini AI is not available. Please set up your GEMINI_API_KEY environment variable.');
  }

  try {
    const result = await gemini.model.generateContent(prompt.replace('{query}', query));
    const response = await result.response;
    const analysis = JSON.parse(response.text());
    
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
    if (error.message?.includes('API_KEY_INVALID') || error.message?.includes('API key')) {
      throw new Error('Invalid Gemini API key. Please check your GEMINI_API_KEY environment variable.');
    } else if (error.message?.includes('quota') || error.message?.includes('limit')) {
      throw new Error('Gemini API quota exceeded. Please check your Google AI Studio usage.');
    } else {
      throw new Error(`AI analysis failed: ${error.message || 'Unknown error'}`);
    }
  }
}

// Check if Gemini is available
export function isGeminiAvailable(): boolean {
  return getGeminiApiKey() !== null;
}

// Legacy function for backward compatibility
export async function searchEbikes(query: string, enableGemini: boolean = true): Promise<EbikeAnalysisResult> {
  if (!enableGemini) {
    throw new Error(`E-bike "${query}" not found in database. Enable AI search to analyze unknown bikes.`);
  }
  
  return analyzeEbikeLegality(query);
}
