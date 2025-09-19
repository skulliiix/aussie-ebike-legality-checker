export interface StateLegality {
  state: string;
  isLegal: boolean;
  reason: string;
  usageType: 'Road Legal (Unlicensed)' | 'Requires License/Registration' | 'Off-Road / Private Property Only' | 'Unknown';
}

export interface EbikeSpecification {
  value: string | number | boolean;
  source: string;
  confidence: 'high' | 'medium' | 'low';
}

export interface UnlockSpecifications {
  motorPower: number;
  torque?: number;
  throttleRestricted: boolean;
  maxSpeed: number;
  legalInStates: string[];
  compliance: string;
  notes: string;
}

export interface EbikeAnalysisResult {
  ebikeName: string;
  found: boolean;
  wattage: EbikeSpecification;
  hasThrottle: EbikeSpecification;
  isPedalAssist: EbikeSpecification;
  legality: StateLegality[];
  dataSource: 'database' | 'gemini';
  canUnlock?: boolean;
  isUnlocked?: boolean;
  unlockedSpecs?: UnlockSpecifications;
  bikeId?: string; // For database results, store the bike ID for unlock functionality
  imageUrl?: string; // URL to e-bike thumbnail/image
  manufacturerUrl?: string; // URL to manufacturer website
}

export interface BikeOption {
  id: string;
  name: string;
  brand: string;
  model: string;
  description: string;
}

export interface MultipleMatchResult {
  type: 'multiple_matches';
  query: string;
  matches: BikeOption[];
}
