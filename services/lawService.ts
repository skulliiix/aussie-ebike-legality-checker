import type { StateLegality } from '../types';
import type { EbikeSpecification } from '../types';

export interface LawDatabase {
  version: string;
  description: string;
  states: {
    [key: string]: StateLawInfo;
  };
}

export interface StateLawInfo {
  name: string;
  officialSource: string;
  additionalSources: string[];
  generalRules: {
    [key: string]: {
      maxPower: number;
      maxSpeed: number;
      throttleAllowed: boolean;
      throttleMaxSpeed?: number;
      description: string;
    };
  };
  specialRules: {
    [key: string]: {
      description: string;
      requiresLicense?: boolean;
      requiresRegistration?: boolean;
      enforcement?: string;
      maxPower?: number;
    };
  };
  throttleRestrictions: {
    description: string;
    enforcement: string;
  };
}

// Import the law database
import lawDatabase from '../data/ebikeLaws.json';

export function getStateLawInfo(stateCode: string): StateLawInfo | null {
  return lawDatabase.states[stateCode] || null;
}

export function getAllStateCodes(): string[] {
  return Object.keys(lawDatabase.states);
}

export function getLawDatabase(): LawDatabase {
  return lawDatabase;
}

export function determineLegality(
  wattage: EbikeSpecification,
  hasThrottle: EbikeSpecification,
  isPedalAssist: EbikeSpecification,
  stateCode: string
): StateLegality {
  const stateLaw = getStateLawInfo(stateCode);
  
  if (!stateLaw) {
    return {
      state: stateCode,
      isLegal: false,
      reason: 'State law information not available',
      usageType: 'Unknown'
    };
  }

  const power = typeof wattage.value === 'number' ? wattage.value : 0;
  const hasThrottleValue = typeof hasThrottle.value === 'boolean' ? hasThrottle.value : false;
  const isPedalAssistValue = typeof isPedalAssist.value === 'boolean' ? isPedalAssist.value : false;

  // Check for NSW electrically power-assisted cycles (250W-500W with throttle restrictions)
  if (stateCode === 'NSW' && power <= 500) {
    if (hasThrottleValue) {
      return {
        state: stateLaw.name,
        isLegal: true,
        reason: `Legal electrically power-assisted cycle: ${power}W motor with throttle (throttle limited to 6km/h without pedaling, motor cuts off at 25km/h).`,
        usageType: 'Road Legal (Unlicensed)'
      };
    } else {
      return {
        state: stateLaw.name,
        isLegal: true,
        reason: `Legal electrically power-assisted cycle: ${power}W motor, pedal-assist only.`,
        usageType: 'Road Legal (Unlicensed)'
      };
    }
  }

  // Check for Victoria electrically power-assisted cycles (250W with 6km/h throttle)
  if (stateCode === 'VIC' && power <= 250) {
    if (hasThrottleValue) {
      return {
        state: stateLaw.name,
        isLegal: true,
        reason: `Legal electrically power-assisted cycle: ${power}W motor with throttle (throttle limited to 6km/h 'walk mode', motor cuts off at 25km/h).`,
        usageType: 'Road Legal (Unlicensed)'
      };
    } else {
      return {
        state: stateLaw.name,
        isLegal: true,
        reason: `Legal electrically power-assisted cycle: ${power}W motor, pedal-assist only.`,
        usageType: 'Road Legal (Unlicensed)'
      };
    }
  }

  // Check throttle restrictions for QLD, WA, TAS
  if (['QLD', 'WA', 'TAS'].includes(stateCode) && hasThrottleValue) {
    return {
      state: stateLaw.name,
      isLegal: false,
      reason: `${stateLaw.name} classifies ANY e-bike with throttle as a motorbike requiring license and registration.`,
      usageType: 'Off-Road / Private Property Only'
    };
  }

  // Check if it's a legal pedelec (no throttle, <=250W)
  if (!hasThrottleValue && power <= 250 && isPedalAssistValue) {
    return {
      state: stateLaw.name,
      isLegal: true,
      reason: `Legal pedelec: ${power}W motor, pedal-assist only, no throttle.`,
      usageType: 'Road Legal (Unlicensed)'
    };
  }

  // Check if it's a legal throttle bike (with throttle, <=200W) for states without special rules
  if (hasThrottleValue && power <= 200 && !['NSW', 'VIC', 'QLD', 'WA', 'TAS'].includes(stateCode)) {
    return {
      state: stateLaw.name,
      isLegal: true,
      reason: `Legal power-assisted pedal cycle: ${power}W motor with throttle (within 200W limit for throttle bikes).`,
      usageType: 'Road Legal (Unlicensed)'
    };
  }

  // Check if it exceeds power limits
  if (power > 500) {
    return {
      state: stateLaw.name,
      isLegal: false,
      reason: `Bike has ${power}W motor, exceeding maximum allowed power limits.`,
      usageType: 'Off-Road / Private Property Only'
    };
  }

  // Check if throttle bike exceeds power limits (state-specific)
  if (hasThrottleValue && power > 200 && !['NSW', 'VIC'].includes(stateCode)) {
    return {
      state: stateLaw.name,
      isLegal: false,
      reason: `Throttle bike with ${power}W motor exceeds 200W limit for throttle bikes in ${stateLaw.name}.`,
      usageType: 'Off-Road / Private Property Only'
    };
  }

  // Check if pedelec exceeds 250W limit
  if (!hasThrottleValue && power > 250) {
    return {
      state: stateLaw.name,
      isLegal: false,
      reason: `Pedelec with ${power}W motor exceeds 250W limit for pedal-assist bikes.`,
      usageType: 'Off-Road / Private Property Only'
    };
  }

  // Default case
  return {
    state: stateLaw.name,
    isLegal: false,
    reason: 'Bike specifications do not meet legal requirements for unlicensed use.',
    usageType: 'Off-Road / Private Property Only'
  };
}

export function getOfficialSource(stateCode: string): string | null {
  const stateLaw = getStateLawInfo(stateCode);
  return stateLaw?.officialSource || null;
}

export function getAdditionalSources(stateCode: string): string[] {
  const stateLaw = getStateLawInfo(stateCode);
  return stateLaw?.additionalSources || [];
}

