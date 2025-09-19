import type { EbikeAnalysisResult, MultipleMatchResult, BikeOption } from '../types';
import { databaseService, type SearchableBike } from './databaseService';

// Simple string similarity for fallback search
function calculateSimilarity(query: string, target: string): number {
  if (!query || !target) return 0;
  
  const q = query.toLowerCase().trim();
  const t = target.toLowerCase().trim();
  
  if (q === t) return 1.0;
  if (t.includes(q) || q.includes(t)) return 0.9;
  
  // Word overlap
  const qWords = q.split(/\s+/).filter(w => w.length > 2);
  const tWords = t.split(/\s+/).filter(w => w.length > 2);
  const overlap = qWords.filter(w => tWords.includes(w)).length;
  
  if (overlap === 0) return 0;
  return Math.min(0.8, (overlap * 2) / (qWords.length + tWords.length));
}

// Convert bike to analysis result
function convertBikeToAnalysisResult(bike: SearchableBike, isUnlocked: boolean = false): EbikeAnalysisResult {
  const motorPower = isUnlocked && bike.unlockedMotorPower ? bike.unlockedMotorPower : bike.motorPower;
  const hasThrottle = isUnlocked && bike.unlockedThrottleRestricted !== undefined ? !bike.unlockedThrottleRestricted : bike.hasThrottle;
  const maxSpeed = isUnlocked && bike.unlockedMaxSpeed ? bike.unlockedMaxSpeed : bike.maxSpeed;
  const compliance = isUnlocked && bike.unlockedCompliance ? bike.unlockedCompliance : bike.compliance;
  const notes = isUnlocked && bike.unlockedNotes ? bike.unlockedNotes : bike.notes;

  const result: EbikeAnalysisResult = {
    ebikeName: bike.canonicalName,
    found: true,
    wattage: {
      value: motorPower,
      source: "database",
      confidence: "high" as const
    },
    hasThrottle: {
      value: hasThrottle,
      source: "database", 
      confidence: "high" as const
    },
    isPedalAssist: {
      value: !hasThrottle,
      source: "database",
      confidence: "high" as const
    },
    legality: [], // Will be filled by caller
    dataSource: 'database' as const,
    canUnlock: bike.canUnlock || false,
    isUnlocked: isUnlocked,
    bikeId: bike.id,
    imageUrl: bike.imageUrl,
    manufacturerUrl: bike.manufacturerUrl
  };

  if (bike.canUnlock && bike.unlockedMotorPower) {
    result.unlockedSpecs = {
      motorPower: bike.unlockedMotorPower,
      torque: bike.unlockedTorque,
      throttleRestricted: bike.unlockedThrottleRestricted || false,
      maxSpeed: bike.unlockedMaxSpeed || 35,
      legalInStates: bike.unlockedLegalInStates || [],
      compliance: bike.unlockedCompliance || "Unlocked - check local laws",
      notes: bike.unlockedNotes || "Unlocked configuration"
    };
  }

  return result;
}

// Get bike by ID
export async function getBikeById(bikeId: string): Promise<SearchableBike | null> {
  console.log(`🔍 Getting bike by ID: ${bikeId}`);
  return await databaseService.getBikeById(bikeId);
}

// Main search function - database first, then AI
export async function searchEbikes(
  query: string, 
  enableGemini: boolean = true
): Promise<EbikeAnalysisResult | MultipleMatchResult> {
  console.log(`🎯 SEARCH SERVICE V2: "${query}" (Gemini: ${enableGemini})`);
  
  // Step 1: Search database
  const dbMatches = await databaseService.searchBikes(query);
  
  if (dbMatches.length === 1) {
    // Single match - return analysis result  
    const bike = dbMatches[0];
    console.log(`📚 Single database match: ${bike.canonicalName}`);
    
    // Increment search count
    await databaseService.incrementSearchCount(bike.id);
    
    const result = convertBikeToAnalysisResult(bike);
    
    // Add legality calculation
    const { determineLegality, getAllStateCodes } = await import('./lawService');
    const stateCodes = getAllStateCodes();
    const legality = stateCodes.map(stateCode => 
      determineLegality(result.wattage, result.hasThrottle, result.isPedalAssist, stateCode)
    );
    
    return { ...result, legality };
    
  } else if (dbMatches.length > 1) {
    // Multiple matches - return selection options
    console.log(`📚 Multiple database matches: ${dbMatches.length}`);
    
    const bikeOptions: BikeOption[] = dbMatches.map(bike => ({
      id: bike.id,
      name: bike.canonicalName,
      brand: bike.brand,
      model: bike.model,
      description: `${bike.motorDetails} - ${bike.torque}Nm torque`
    }));
    
    return {
      type: 'multiple_matches' as const,
      query,
      matches: bikeOptions
    };
  }
  
  // Step 2: No database matches - try Gemini if enabled
  if (!enableGemini) {
    console.log(`🚫 No database matches and Gemini disabled`);
    throw new Error(`E-bike "${query}" not found in database. Enable AI search to analyze unknown bikes.`);
  }
  
  console.log(`🤖 No database matches, trying Gemini AI...`);
  
  // Import and use Gemini service
  const { analyzeEbikeLegality } = await import('./geminiService');
  return analyzeEbikeLegality(query);
}

// Get specific bike analysis by ID
export async function getBikeAnalysisById(bikeId: string, isUnlocked: boolean = false): Promise<EbikeAnalysisResult> {
  console.log(`🎯 GET BIKE ANALYSIS: ${bikeId} ${isUnlocked ? '(UNLOCKED)' : '(LOCKED)'}`);
  
  const bike = await getBikeById(bikeId);
  if (!bike) {
    throw new Error(`Bike with ID ${bikeId} not found in database`);
  }
  
  // Check if unlock is requested but not available
  if (isUnlocked && !bike.canUnlock) {
    throw new Error(`Bike ${bike.canonicalName} cannot be unlocked`);
  }
  
  // Increment search count
  await databaseService.incrementSearchCount(bikeId);
  
  const result = convertBikeToAnalysisResult(bike, isUnlocked);
  
  // Add legality calculation
  const { determineLegality, getAllStateCodes } = await import('./lawService');
  const stateCodes = getAllStateCodes();
  const legality = stateCodes.map(stateCode => 
    determineLegality(result.wattage, result.hasThrottle, result.isPedalAssist, stateCode)
  );
  
  return { ...result, legality };
}

// Get database statistics
export async function getDatabaseStats() {
  return await databaseService.getStats();
}
