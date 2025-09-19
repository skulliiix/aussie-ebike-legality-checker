import { createClient } from '@supabase/supabase-js';

// This script migrates ALL embedded bike data to Supabase
// Run with: npx tsx scripts/migrate-all-bikes.ts

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials');
  console.error('Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Complete bike data from searchService.ts
const allBikes = [
  // LEKKER BIKES
  {
    brand: "Lekker",
    model: "Amsterdam Urban",
    canonical_name: "Lekker Amsterdam Urban",
    aliases: ["Lekker Amsterdam", "Amsterdam Urban", "Lekker Amsterdam Urban", "Lekker Urban"],
    motor_power: 250,
    has_throttle: false,
    max_speed: 25,
    torque: 50,
    motor_details: "Bafang H400 Front Hub Motor",
    compliance: "Electrically power-assisted cycle",
    legal_in_australia: true,
    notes: "Lightweight, minimalist design with 7-speed or 8-speed Shimano hub options.",
    source: 'manual' as const,
    search_count: 0
  },
  {
    brand: "Lekker",
    model: "Amsterdam GTS",
    canonical_name: "Lekker Amsterdam GTS",
    aliases: ["Lekker Amsterdam GTS", "Amsterdam GTS", "Lekker GTS"],
    motor_power: 250,
    has_throttle: false,
    max_speed: 25,
    torque: 80,
    motor_details: "Bafang M420 Mid-Drive Motor",
    compliance: "Electrically power-assisted cycle",
    legal_in_australia: true,
    notes: "Enviolo stepless gearing, integrated display, handles gradients up to 25%.",
    source: 'manual' as const,
    search_count: 0
  },
  {
    brand: "Lekker",
    model: "Jordaan Urban 8SP",
    canonical_name: "Lekker Jordaan Urban 8SP",
    aliases: ["Lekker Jordaan", "Jordaan Urban", "Lekker Jordaan Urban", "Jordaan Urban 8SP", "Lekker Urban"],
    motor_power: 250,
    has_throttle: false,
    max_speed: 25,
    torque: 50,
    motor_details: "Bafang H400 Front Hub Motor",
    compliance: "Electrically power-assisted cycle",
    legal_in_australia: true,
    notes: "Classic Dutch step-through design, upright riding position, front and rear racks standard.",
    source: 'manual' as const,
    search_count: 0
  },
  {
    brand: "Lekker",
    model: "Jordaan GTS",
    canonical_name: "Lekker Jordaan GTS",
    aliases: ["Lekker Jordaan GTS", "Jordaan GTS", "Lekker Jordaan"],
    motor_power: 250,
    has_throttle: false,
    max_speed: 25,
    torque: 80,
    motor_details: "Bafang M420 Mid-Drive Motor",
    compliance: "Electrically power-assisted cycle",
    legal_in_australia: true,
    notes: "Gates CDX belt drive, Enviolo stepless gearing, handles child seats and trailers.",
    source: 'manual' as const,
    search_count: 0
  },
  {
    brand: "Lekker",
    model: "Limited Edition Jordaan GTS",
    canonical_name: "Lekker Limited Edition Jordaan GTS",
    aliases: ["Limited Edition Jordaan GTS", "Lekker Limited Edition", "Jordaan GTS Limited"],
    motor_power: 250,
    has_throttle: false,
    max_speed: 25,
    torque: 80,
    motor_details: "Bafang M420 Mid-Drive Motor",
    compliance: "Electrically power-assisted cycle",
    legal_in_australia: true,
    notes: "Same specs as Jordaan GTS but with high-gloss Dark Grey finish.",
    source: 'manual' as const,
    search_count: 0
  },

  // DIRODI BIKES
  {
    brand: "Dirodi",
    model: "Nova 250W",
    canonical_name: "Dirodi Nova Electric Bike",
    aliases: ["Dirodi Nova", "Nova", "Dirodi Nova 250W"],
    motor_power: 250,
    has_throttle: false,
    max_speed: 25,
    torque: 80,
    motor_details: "Bafang M420 Mid Drive Motor, 250W, 80NM",
    compliance: "Electrically power-assisted cycle",
    legal_in_australia: true,
    notes: "Urban/Commuter bike with NO throttle. Matte Black or Matte Grey. 36V 460.8Wh battery, 80km max range.",
    can_unlock: false,
    source: 'manual' as const,
    search_count: 0
  },
  {
    brand: "Dirodi",
    model: "Rover Pro 250W/500W",
    canonical_name: "Dirodi Rover Pro 250W/500W",
    aliases: ["Dirodi Rover Pro", "Rover Pro", "Rover Pro 250W", "Rover Pro 500W"],
    motor_power: 250,
    has_throttle: true,
    max_speed: 25,
    torque: 60,
    motor_details: "Shengyi Rear Hub Motor, 250W (unlockable to 500W for NSW)",
    compliance: "Electrically power-assisted cycle",
    legal_in_australia: true,
    notes: "Dual-suspension Fat Tire Cruiser. Throttle 6km/h default, unlockable to 35-40km/h. 52V 1040Wh battery.",
    can_unlock: true,
    unlocked_motor_power: 500,
    unlocked_torque: 70,
    unlocked_throttle_restricted: false,
    unlocked_max_speed: 40,
    unlocked_legal_in_states: ["NSW"],
    unlocked_compliance: "Electrically power-assisted cycle (NSW only)",
    unlocked_notes: "UNLOCKED: 500W motor, 70NM torque, throttle up to 40km/h. Legal in NSW only.",
    source: 'manual' as const,
    search_count: 0
  },
  {
    brand: "Dirodi",
    model: "Rover Pro 1000W",
    canonical_name: "Dirodi Rover Pro 1000W",
    aliases: ["Dirodi Rover Pro 1000W", "Rover Pro 1000W", "Rover Pro 1000"],
    motor_power: 1000,
    has_throttle: true,
    max_speed: 50,
    torque: 95,
    motor_details: "Shengyi Rear Hub Motor, 1000W",
    compliance: "Not classified as e-bike - Off-road vehicle",
    legal_in_australia: false,
    notes: "High-power off-road version. Throttle up to 50km/h. For private property use only. Same frame as 250W/500W model.",
    can_unlock: false,
    source: 'manual' as const,
    search_count: 0
  },
  {
    brand: "Dirodi",
    model: "Rover Gen 6 250W/500W",
    canonical_name: "Dirodi Rover Standard & Plus Gen 6 250W/500W",
    aliases: ["Dirodi Rover Gen 6", "Rover Gen 6", "Rover Standard", "Rover Plus", "Rover Gen 6 250W"],
    motor_power: 250,
    has_throttle: true,
    max_speed: 25,
    torque: 60,
    motor_details: "Shengyi Rear Hub Motor, 250W (unlockable to 500W for NSW)",
    compliance: "Electrically power-assisted cycle",
    legal_in_australia: true,
    notes: "Fat Tire Utility bike. Standard (no suspension) or Plus (front suspension). Throttle 6km/h default. 52V 1040Wh battery.",
    can_unlock: true,
    unlocked_motor_power: 500,
    unlocked_torque: 70,
    unlocked_throttle_restricted: false,
    unlocked_max_speed: 40,
    unlocked_legal_in_states: ["NSW"],
    unlocked_compliance: "Electrically power-assisted cycle (NSW only)",
    unlocked_notes: "UNLOCKED: 500W motor, 70NM torque, throttle up to 40km/h. Legal in NSW only.",
    source: 'manual' as const,
    search_count: 0
  },
  {
    brand: "Dirodi",
    model: "Rover Gen 6 1000W",
    canonical_name: "Dirodi Rover Standard & Plus Gen 6 1000W",
    aliases: ["Dirodi Rover Gen 6 1000W", "Rover Gen 6 1000W", "Rover Gen 6 1000"],
    motor_power: 1000,
    has_throttle: true,
    max_speed: 50,
    torque: 95,
    motor_details: "Shengyi Rear Hub Motor, 1000W",
    compliance: "Not classified as e-bike - Off-road vehicle",
    legal_in_australia: false,
    notes: "High-power off-road version. Throttle up to 50km/h. For private property use only. Same frame as 250W/500W model.",
    can_unlock: false,
    source: 'manual' as const,
    search_count: 0
  },
  {
    brand: "Dirodi",
    model: "Vivo Gen 2 250W (15AH)",
    canonical_name: "Dirodi Vivo Electric Bike Gen 2 250W 15AH",
    aliases: ["Dirodi Vivo Gen 2", "Vivo Gen 2", "Vivo 250W", "Vivo 15AH"],
    motor_power: 250,
    has_throttle: true,
    max_speed: 25,
    torque: 60,
    motor_details: "Shengyi 250W Brushless Rear Hub Motor (unlockable to 500W for NSW)",
    compliance: "Electrically power-assisted cycle",
    legal_in_australia: true,
    notes: "All-Terrain Fat Tire bike. Thumb throttle 6km/h default. 52V 780Wh (15AH) battery, 80km max range.",
    can_unlock: true,
    unlocked_motor_power: 500,
    unlocked_torque: 70,
    unlocked_throttle_restricted: false,
    unlocked_max_speed: 40,
    unlocked_legal_in_states: ["NSW"],
    unlocked_compliance: "Electrically power-assisted cycle (NSW only)",
    unlocked_notes: "UNLOCKED: 500W motor, 70NM torque, throttle up to 40km/h. Legal in NSW only.",
    source: 'manual' as const,
    search_count: 0
  },
  {
    brand: "Dirodi",
    model: "Vivo Gen 2 750W (15AH)",
    canonical_name: "Dirodi Vivo Electric Bike Gen 2 750W 15AH",
    aliases: ["Dirodi Vivo 750W", "Vivo 750W", "Vivo Gen 2 750W"],
    motor_power: 750,
    has_throttle: true,
    max_speed: 40,
    torque: 90,
    motor_details: "750W Brushless Rear Hub Motor",
    compliance: "Not classified as e-bike - Off-road vehicle",
    legal_in_australia: false,
    notes: "High-power off-road version. Throttle up to 40km/h. 52V 780Wh (15AH) battery. For private property use only.",
    can_unlock: false,
    source: 'manual' as const,
    search_count: 0
  },
  {
    brand: "Dirodi",
    model: "Vivo Gen 2 750W (20AH)",
    canonical_name: "Dirodi Vivo Electric Bike Gen 2 750W 20AH",
    aliases: ["Dirodi Vivo 750W 20AH", "Vivo 750W 20AH", "Vivo Gen 2 750W 20AH"],
    motor_power: 750,
    has_throttle: true,
    max_speed: 40,
    torque: 90,
    motor_details: "750W Brushless Rear Hub Motor",
    compliance: "Not classified as e-bike - Off-road vehicle",
    legal_in_australia: false,
    notes: "High-power off-road version with extended battery. Throttle up to 40km/h. 52V 1040Wh (20AH) battery, 100km max range.",
    can_unlock: false,
    source: 'manual' as const,
    search_count: 0
  },
  {
    brand: "Dirodi",
    model: "xTreme Gen 4 250W/500W",
    canonical_name: "Dirodi xTreme Electric Bike Gen 4 250W/500W",
    aliases: ["Dirodi xTreme Gen 4", "xTreme Gen 4", "Xtreme Gen 4", "xTreme 250W"],
    motor_power: 250,
    has_throttle: true,
    max_speed: 25,
    torque: 60,
    motor_details: "MXUS 250W Brushless Rear Hub Motor (unlockable to 500W)",
    compliance: "Electrically power-assisted cycle",
    legal_in_australia: true,
    notes: "Hybrid/Urban commuter bike. Throttle locked to 6km/h when road legal. 48V 720Wh battery. Matte Black or Matte White.",
    can_unlock: true,
    unlocked_motor_power: 500,
    unlocked_torque: 80,
    unlocked_throttle_restricted: false,
    unlocked_max_speed: 40,
    unlocked_legal_in_states: [],
    unlocked_compliance: "Not classified as e-bike - Off-road vehicle",
    unlocked_notes: "UNLOCKED: 500W motor, unrestricted throttle up to 40km/h. For private property use only.",
    source: 'manual' as const,
    search_count: 0
  },
  {
    brand: "Dirodi",
    model: "xTreme Gen 4 750W",
    canonical_name: "Dirodi xTreme Electric Bike Gen 4 750W",
    aliases: ["Dirodi xTreme Gen 4 750W", "xTreme Gen 4 750W", "Xtreme Gen 4 750W"],
    motor_power: 750,
    has_throttle: true,
    max_speed: 40,
    torque: 80,
    motor_details: "MXUS 750W Brushless Rear Hub Motor",
    compliance: "Not classified as e-bike - Off-road vehicle",
    legal_in_australia: false,
    notes: "High-power off-road version. Throttle up to 40km/h. For private property use only. Same frame as 250W model.",
    can_unlock: false,
    source: 'manual' as const,
    search_count: 0
  },
  {
    brand: "Dirodi",
    model: "xTreme Gen 3 250W/500W",
    canonical_name: "Dirodi xTreme Electric Bike Gen 3 250W/500W",
    aliases: ["Dirodi xTreme Gen 3", "xTreme Gen 3", "Xtreme Gen 3", "xTreme 250W Gen 3"],
    motor_power: 250,
    has_throttle: true,
    max_speed: 25,
    torque: 60,
    motor_details: "MXUS 250W Brushless Rear Hub Motor (unlockable to 500W)",
    compliance: "Electrically power-assisted cycle",
    legal_in_australia: true,
    notes: "Hybrid/Commuter bike. Throttle locked to 6km/h when road legal. 48V 672Wh battery. Matte Black or Matte White.",
    can_unlock: true,
    unlocked_motor_power: 500,
    unlocked_torque: 80,
    unlocked_throttle_restricted: false,
    unlocked_max_speed: 40,
    unlocked_legal_in_states: [],
    unlocked_compliance: "Not classified as e-bike - Off-road vehicle",
    unlocked_notes: "UNLOCKED: 500W motor, unrestricted throttle up to 40km/h. For private property use only.",
    source: 'manual' as const,
    search_count: 0
  },
  {
    brand: "Dirodi",
    model: "xTreme Gen 3 750W",
    canonical_name: "Dirodi xTreme Electric Bike Gen 3 750W",
    aliases: ["Dirodi xTreme Gen 3 750W", "xTreme Gen 3 750W", "Xtreme Gen 3 750W"],
    motor_power: 750,
    has_throttle: true,
    max_speed: 40,
    torque: 80,
    motor_details: "MXUS 750W Brushless Rear Hub Motor",
    compliance: "Not classified as e-bike - Off-road vehicle",
    legal_in_australia: false,
    notes: "High-power off-road version. Throttle up to 40km/h. For private property use only. Same frame as 250W model.",
    can_unlock: false,
    source: 'manual' as const,
    search_count: 0
  },

  // VELECTRIX BIKES
  {
    brand: "Velectrix",
    model: "Foldaway",
    canonical_name: "Velectrix Foldaway – Compact Folding Electric Bike",
    aliases: ["Velectrix Foldaway", "Foldaway", "Velectrix Compact Folding"],
    motor_power: 200,
    has_throttle: true,
    max_speed: 25,
    torque: 40,
    motor_details: "Bafang 200W Motor with twist throttle",
    compliance: "Power-assisted pedal cycles",
    legal_in_australia: true,
    notes: "Compact folding e-bike with twist throttle. Only Velectrix model with throttle functionality.",
    can_unlock: false,
    source: 'manual' as const,
    search_count: 0
  },
  {
    brand: "Velectrix",
    model: "Urban+ ST",
    canonical_name: "Velectrix Urban+ ST – Commuter Electric Bike",
    aliases: ["Velectrix Urban+", "Urban+ ST", "Urban Plus ST", "Velectrix Urban Plus"],
    motor_power: 250,
    has_throttle: false,
    max_speed: 25,
    torque: 50,
    motor_details: "Bafang 250W Rear Hub Motor",
    compliance: "Electrically power-assisted cycles",
    legal_in_australia: true,
    notes: "Commuter e-bike with step-through frame. Pedal assist only, 5 levels of assistance.",
    can_unlock: false,
    source: 'manual' as const,
    search_count: 0
  },
  {
    brand: "Velectrix",
    model: "Urban Pulse",
    canonical_name: "Velectrix Urban Pulse – Commuter Electric Bike",
    aliases: ["Velectrix Urban Pulse", "Urban Pulse", "Velectrix Pulse Urban"],
    motor_power: 250,
    has_throttle: false,
    max_speed: 25,
    torque: 80,
    motor_details: "Bafang M410 250W Mid-Drive Motor",
    compliance: "Electrically power-assisted cycles",
    legal_in_australia: true,
    notes: "Mid-drive commuter e-bike. 80Nm torque for superior climbing. Pedal assist only, 5 levels.",
    can_unlock: false,
    source: 'manual' as const,
    search_count: 0
  },
  {
    brand: "Velectrix",
    model: "Urban Pulse ST",
    canonical_name: "Velectrix Urban Pulse ST – Step Through Commuter Electric Bike",
    aliases: ["Velectrix Urban Pulse ST", "Urban Pulse ST", "Urban Pulse Step Through"],
    motor_power: 250,
    has_throttle: false,
    max_speed: 25,
    torque: 80,
    motor_details: "Bafang M410 250W Mid-Drive Motor",
    compliance: "Electrically power-assisted cycles",
    legal_in_australia: true,
    notes: "Step-through mid-drive commuter e-bike. 80Nm torque, pedal assist only, 5 levels.",
    can_unlock: false,
    source: 'manual' as const,
    search_count: 0
  },
  {
    brand: "Velectrix",
    model: "Cruiser ST",
    canonical_name: "Velectrix Cruiser ST – Step Through Electric Bike",
    aliases: ["Velectrix Cruiser", "Cruiser ST", "Velectrix Cruiser Step Through"],
    motor_power: 250,
    has_throttle: false,
    max_speed: 25,
    torque: 50,
    motor_details: "Bafang 250W Rear Hub Motor",
    compliance: "Electrically power-assisted cycles",
    legal_in_australia: true,
    notes: "Classic step-through cruiser design. Rear hub motor, pedal assist only, 5 levels.",
    can_unlock: false,
    source: 'manual' as const,
    search_count: 0
  },
  {
    brand: "Velectrix",
    model: "Cruiser Pulse STX",
    canonical_name: "Velectrix Cruiser Pulse STX – Step-Through Cruiser Electric Bike",
    aliases: ["Velectrix Cruiser Pulse", "Cruiser Pulse STX", "Cruiser Pulse", "Velectrix STX"],
    motor_power: 250,
    has_throttle: false,
    max_speed: 25,
    torque: 80,
    motor_details: "Bafang M410 250W Mid-Drive Motor",
    compliance: "Electrically power-assisted cycles",
    legal_in_australia: true,
    notes: "Mid-drive step-through cruiser. 80Nm torque, pedal assist only, 5 levels.",
    can_unlock: false,
    source: 'manual' as const,
    search_count: 0
  },
  {
    brand: "Velectrix",
    model: "Adventurer Pulse ST",
    canonical_name: "Velectrix Adventurer Pulse ST – Step-Through Adventure Electric Bike",
    aliases: ["Velectrix Adventurer", "Adventurer Pulse ST", "Adventurer Pulse", "Velectrix Adventure"],
    motor_power: 250,
    has_throttle: false,
    max_speed: 25,
    torque: 80,
    motor_details: "Bafang M410 250W Mid-Drive Motor",
    compliance: "Electrically power-assisted cycles",
    legal_in_australia: true,
    notes: "Adventure e-bike with step-through frame. Mid-drive motor, 80Nm torque, pedal assist only.",
    can_unlock: false,
    source: 'manual' as const,
    search_count: 0
  },
  {
    brand: "Velectrix",
    model: "Ascent Pulse X",
    canonical_name: "Velectrix Ascent Pulse X – Adventure Electric Mountain Bike",
    aliases: ["Velectrix Ascent", "Ascent Pulse X", "Ascent Pulse", "Velectrix Mountain"],
    motor_power: 250,
    has_throttle: false,
    max_speed: 25,
    torque: 95,
    motor_details: "Bafang M510 250W Mid-Drive Motor",
    compliance: "Electrically power-assisted cycles",
    legal_in_australia: true,
    notes: "Electric mountain bike. Bafang M510 with 95Nm torque for superior climbing. Pedal assist only.",
    can_unlock: false,
    source: 'manual' as const,
    search_count: 0
  },
  {
    brand: "Velectrix",
    model: "SUV",
    canonical_name: "Velectrix SUV – Fat Tyre Electric Bike",
    aliases: ["Velectrix SUV", "SUV", "Velectrix Fat Tyre", "Velectrix Fat Tire"],
    motor_power: 250,
    has_throttle: false,
    max_speed: 25,
    torque: 50,
    motor_details: "Bafang 250W Rear Hub Motor",
    compliance: "Electrically power-assisted cycles",
    legal_in_australia: true,
    notes: "Fat tyre e-bike. Thumb throttle accessory available but not legal for road use. Pedal assist only.",
    can_unlock: false,
    source: 'manual' as const,
    search_count: 0
  },
  {
    brand: "Velectrix",
    model: "SUV+",
    canonical_name: "Velectrix SUV+ – Fat Tyre Electric Bike",
    aliases: ["Velectrix SUV+", "SUV+", "SUV Plus", "Velectrix SUV Plus"],
    motor_power: 500,
    has_throttle: false,
    max_speed: 25,
    torque: 80,
    motor_details: "Bafang 500W Motor (NSW specific)",
    compliance: "Electrically power-assisted cycles",
    legal_in_australia: true,
    notes: "High-power fat tyre e-bike designed for NSW 500W regulations. Pedal assist only, not available outside NSW.",
    can_unlock: false,
    source: 'manual' as const,
    search_count: 0
  },

  // FATBOY BIKES
  {
    brand: "Fatboy",
    model: "Harlem eBike",
    canonical_name: "Fatboy Harlem eBike",
    aliases: ["Fatboy Harlem", "Harlem eBike", "Fatboy Harlem eBike", "Harlem"],
    motor_power: 500,
    has_throttle: true,
    max_speed: 25,
    battery_voltage: 52,
    battery_capacity_wh: 1040,
    bike_type: "cargo_utility",
    compliance: "Electrically power-assisted cycles",
    legal_in_australia: true,
    notes: "500W BAFANG hub motor with throttle, restricted to 25km/h for public use. 180kg weight capacity.",
    can_unlock: false,
    source: 'manual' as const,
    search_count: 0
  },
  {
    brand: "Fatboy",
    model: "Scrambler eBike",
    canonical_name: "Fatboy Scrambler eBike",
    aliases: ["Fatboy Scrambler", "Scrambler eBike", "Fatboy Scrambler eBike", "Scrambler"],
    motor_power: 500,
    has_throttle: true,
    max_speed: 25,
    battery_voltage: 52,
    battery_capacity_wh: 1040,
    bike_type: "cargo_utility",
    compliance: "Electrically power-assisted cycles",
    legal_in_australia: true,
    notes: "500W BAFANG hub motor with throttle, restricted to 25km/h for public use. Premium front and rear suspension.",
    can_unlock: false,
    source: 'manual' as const,
    search_count: 0
  },
  {
    brand: "Fatboy",
    model: "Bagus eBike",
    canonical_name: "Fatboy Bagus eBike",
    aliases: ["Fatboy Bagus", "Bagus eBike", "Fatboy Bagus eBike", "Bagus"],
    motor_power: 500,
    has_throttle: true,
    max_speed: 25,
    battery_voltage: 52,
    battery_capacity_wh: 1040,
    bike_type: "cargo_utility",
    compliance: "Electrically power-assisted cycles",
    legal_in_australia: true,
    notes: "500W BAFANG hub motor with throttle, restricted to 25km/h for public use. Class leading 180kg weight capacity.",
    can_unlock: false,
    source: 'manual' as const,
    search_count: 0
  }
];

async function migrateAllBikes() {
  console.log('🚀 Starting FULL data migration...');
  console.log(`📊 Found ${allBikes.length} bikes to migrate`);

  let successCount = 0;
  let errorCount = 0;
  let duplicateCount = 0;

  for (const bike of allBikes) {
    try {
      // Check if bike already exists
      const { data: existing } = await supabase
        .from('ebikes')
        .select('id')
        .eq('canonical_name', bike.canonical_name)
        .single();

      if (existing) {
        console.log(`⏭️  Skipped (already exists): ${bike.canonical_name}`);
        duplicateCount++;
        continue;
      }

      const { data, error } = await supabase
        .from('ebikes')
        .insert(bike)
        .select('id')
        .single();

      if (error) {
        console.error(`❌ Failed to migrate ${bike.canonical_name}:`, error.message);
        errorCount++;
      } else {
        console.log(`✅ Migrated: ${bike.canonical_name} (ID: ${data.id})`);
        successCount++;
      }

      // Small delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));

    } catch (error) {
      console.error(`❌ Error migrating ${bike.canonical_name}:`, error);
      errorCount++;
    }
  }

  console.log('\n📊 Migration Summary:');
  console.log(`✅ Successfully migrated: ${successCount} bikes`);
  console.log(`⏭️  Skipped (duplicates): ${duplicateCount} bikes`);
  console.log(`❌ Failed to migrate: ${errorCount} bikes`);
  console.log(`📈 Success rate: ${((successCount / (allBikes.length - duplicateCount)) * 100).toFixed(1)}%`);

  if (successCount > 0 || duplicateCount > 0) {
    console.log('\n🎉 Full migration completed! Database is ready for production.');
    console.log(`📚 Total bikes in database: ${successCount + duplicateCount}`);
    console.log('💡 Next steps:');
    console.log('1. Remove embedded data files');
    console.log('2. Update all imports to use database only');
    console.log('3. Test full system functionality');
  }
}

// Run migration
migrateAllBikes().catch(console.error);
