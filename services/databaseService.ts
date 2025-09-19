import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { EbikeAnalysisResult } from '../types';

// Database types
export interface DatabaseEbike {
  id: string;
  brand: string;
  model: string;
  canonical_name: string;
  aliases: string[];
  motor_power: number;
  has_throttle: boolean;
  max_speed: number;
  torque?: number;
  motor_details?: string;
  battery_voltage?: number;
  battery_capacity_wh?: number;
  bike_type?: string;
  compliance: string;
  legal_in_australia: boolean;
  notes: string;
  can_unlock?: boolean;
  unlocked_motor_power?: number;
  unlocked_torque?: number;
  unlocked_throttle_restricted?: boolean;
  unlocked_max_speed?: number;
  unlocked_legal_in_states?: string[];
  unlocked_compliance?: string;
  unlocked_notes?: string;
  image_url?: string;
  manufacturer_url?: string;
  source: 'manual' | 'gemini';
  search_count: number;
  created_at: string;
  updated_at: string;
}

export interface SearchableBike {
  id: string;
  brand: string;
  model: string;
  canonicalName: string;
  aliases: string[];
  motorPower: number;
  hasThrottle: boolean;
  maxSpeed: number;
  torque?: number;
  motorDetails?: string;
  batteryVoltage?: number;
  batteryCapacityWh?: number;
  bikeType?: string;
  compliance: string;
  legalInAustralia: boolean;
  notes: string;
  canUnlock?: boolean;
  unlockedMotorPower?: number;
  unlockedTorque?: number;
  unlockedThrottleRestricted?: boolean;
  unlockedMaxSpeed?: number;
  unlockedLegalInStates?: string[];
  unlockedCompliance?: string;
  unlockedNotes?: string;
  imageUrl?: string;
  manufacturerUrl?: string;
}

class DatabaseService {
  private supabase: SupabaseClient;

  constructor() {
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
    const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      console.warn('⚠️ Supabase credentials not found. Database features will be disabled.');
      this.supabase = null as any;
      return;
    }

    this.supabase = createClient(supabaseUrl, supabaseKey);
    console.log('✅ Database service initialized');
  }

  // Check if database is available
  private isAvailable(): boolean {
    return this.supabase !== null;
  }

  // Search bikes in database
  async searchBikes(query: string): Promise<SearchableBike[]> {
    if (!this.isAvailable()) {
      console.log('🚫 Database not available, returning empty results');
      return [];
    }

    console.log(`🔍 DATABASE SEARCH: "${query}"`);

    try {
      // Use simple text search with ILIKE for compatibility
      const { data, error } = await this.supabase
        .from('ebikes')
        .select('*')
        .or(`canonical_name.ilike.%${query}%,brand.ilike.%${query}%,model.ilike.%${query}%`)
        .order('search_count', { ascending: false })
        .limit(20);

      if (error) {
        console.error('❌ Database search error:', error);
        return [];
      }

      const results = (data || []).map(this.convertDbToSearchable);
      console.log(`📊 Found ${results.length} database matches`);
      return results;

    } catch (error) {
      console.error('❌ Database search failed:', error);
      return [];
    }
  }

  // Get bike by ID
  async getBikeById(id: string): Promise<SearchableBike | null> {
    if (!this.isAvailable()) {
      console.log('🚫 Database not available');
      return null;
    }

    console.log(`🔍 Getting bike by ID: ${id}`);

    try {
      const { data, error } = await this.supabase
        .from('ebikes')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        console.error('❌ Database get error:', error);
        return null;
      }

      const result = this.convertDbToSearchable(data);
      console.log(`✅ Found: ${result.canonicalName}`);
      return result;

    } catch (error) {
      console.error('❌ Database get failed:', error);
      return null;
    }
  }

  // Save bike from Gemini analysis
  async saveBikeFromGemini(analysis: EbikeAnalysisResult): Promise<string | null> {
    if (!this.isAvailable()) {
      console.log('🚫 Database not available, cannot save');
      return null;
    }

    console.log(`💾 Saving bike from Gemini: ${analysis.ebikeName}`);

    try {
      const bikeData: Partial<DatabaseEbike> = {
        brand: analysis.ebikeName.split(' ')[0] || 'Unknown',
        model: analysis.ebikeName.replace(/^[^\s]+\s/, '') || 'Unknown',
        canonical_name: analysis.ebikeName,
        aliases: [analysis.ebikeName],
        motor_power: typeof analysis.wattage.value === 'number' ? analysis.wattage.value : 250,
        has_throttle: typeof analysis.hasThrottle.value === 'boolean' ? analysis.hasThrottle.value : false,
        max_speed: 25,
        compliance: 'To be verified',
        legal_in_australia: true,
        notes: `Added from AI analysis. Source: ${analysis.wattage.source}`,
        image_url: analysis.imageUrl,
        manufacturer_url: analysis.manufacturerUrl,
        source: 'gemini',
        search_count: 0
      };

      const { data, error } = await this.supabase
        .from('ebikes')
        .insert(bikeData)
        .select('id')
        .single();

      if (error) {
        console.error('❌ Database save error:', error);
        return null;
      }

      console.log(`✅ Saved bike with ID: ${data.id}`);
      return data.id;

    } catch (error) {
      console.error('❌ Database save failed:', error);
      return null;
    }
  }

  // Increment search count
  async incrementSearchCount(bikeId: string): Promise<void> {
    if (!this.isAvailable()) {
      return;
    }

    try {
      await this.supabase.rpc('increment_search_count', { bike_id: bikeId });
    } catch (error) {
      console.error('❌ Failed to increment search count:', error);
    }
  }

  // Convert database record to searchable format
  private convertDbToSearchable(db: DatabaseEbike): SearchableBike {
    return {
      id: db.id,
      brand: db.brand,
      model: db.model,
      canonicalName: db.canonical_name,
      aliases: db.aliases,
      motorPower: db.motor_power,
      hasThrottle: db.has_throttle,
      maxSpeed: db.max_speed,
      torque: db.torque,
      motorDetails: db.motor_details,
      batteryVoltage: db.battery_voltage,
      batteryCapacityWh: db.battery_capacity_wh,
      bikeType: db.bike_type,
      compliance: db.compliance,
      legalInAustralia: db.legal_in_australia,
      notes: db.notes,
      canUnlock: db.can_unlock,
      unlockedMotorPower: db.unlocked_motor_power,
      unlockedTorque: db.unlocked_torque,
      unlockedThrottleRestricted: db.unlocked_throttle_restricted,
      unlockedMaxSpeed: db.unlocked_max_speed,
      unlockedLegalInStates: db.unlocked_legal_in_states,
      unlockedCompliance: db.unlocked_compliance,
      unlockedNotes: db.unlocked_notes,
      imageUrl: db.image_url,
      manufacturerUrl: db.manufacturer_url
    };
  }

  // Get database statistics
  async getStats(): Promise<{ total: number; bySource: Record<string, number> } | null> {
    if (!this.isAvailable()) {
      return null;
    }

    try {
      const { data, error } = await this.supabase
        .from('ebikes')
        .select('source');

      if (error) {
        console.error('❌ Database stats error:', error);
        return null;
      }

      const total = data.length;
      const bySource = data.reduce((acc, bike) => {
        acc[bike.source] = (acc[bike.source] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return { total, bySource };
    } catch (error) {
      console.error('❌ Database stats failed:', error);
      return null;
    }
  }
}

// Export singleton instance
export const databaseService = new DatabaseService();
