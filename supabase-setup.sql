-- Supabase Database Schema for E-bike Legality Checker
-- Run this in your Supabase SQL editor

-- Create the ebikes table
CREATE TABLE IF NOT EXISTS ebikes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  brand VARCHAR(100) NOT NULL,
  model VARCHAR(200) NOT NULL,
  canonical_name VARCHAR(300) NOT NULL,
  aliases TEXT[] DEFAULT '{}',
  motor_power INTEGER NOT NULL,
  has_throttle BOOLEAN NOT NULL DEFAULT false,
  max_speed INTEGER NOT NULL DEFAULT 25,
  torque INTEGER,
  motor_details TEXT,
  battery_voltage INTEGER,
  battery_capacity_wh INTEGER,
  bike_type VARCHAR(100),
  compliance VARCHAR(200) NOT NULL,
  legal_in_australia BOOLEAN NOT NULL DEFAULT true,
  notes TEXT,
  
  -- Unlock capabilities
  can_unlock BOOLEAN DEFAULT false,
  unlocked_motor_power INTEGER,
  unlocked_torque INTEGER,
  unlocked_throttle_restricted BOOLEAN,
  unlocked_max_speed INTEGER,
  unlocked_legal_in_states TEXT[],
  unlocked_compliance VARCHAR(200),
  unlocked_notes TEXT,
  
  -- Metadata
  source VARCHAR(50) NOT NULL DEFAULT 'manual', -- 'manual' or 'gemini'
  search_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for fast searching
CREATE INDEX IF NOT EXISTS idx_ebikes_brand ON ebikes(brand);
CREATE INDEX IF NOT EXISTS idx_ebikes_model ON ebikes(model);
CREATE INDEX IF NOT EXISTS idx_ebikes_canonical_name ON ebikes(canonical_name);
CREATE INDEX IF NOT EXISTS idx_ebikes_aliases ON ebikes USING GIN(aliases);
CREATE INDEX IF NOT EXISTS idx_ebikes_motor_power ON ebikes(motor_power);
CREATE INDEX IF NOT EXISTS idx_ebikes_has_throttle ON ebikes(has_throttle);
CREATE INDEX IF NOT EXISTS idx_ebikes_legal_australia ON ebikes(legal_in_australia);
CREATE INDEX IF NOT EXISTS idx_ebikes_source ON ebikes(source);
CREATE INDEX IF NOT EXISTS idx_ebikes_search_count ON ebikes(search_count);

-- Create individual text search indexes (simpler approach)
CREATE INDEX IF NOT EXISTS idx_ebikes_brand_fts ON ebikes USING GIN(to_tsvector('english', brand));
CREATE INDEX IF NOT EXISTS idx_ebikes_model_fts ON ebikes USING GIN(to_tsvector('english', model));
CREATE INDEX IF NOT EXISTS idx_ebikes_canonical_fts ON ebikes USING GIN(to_tsvector('english', canonical_name));

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_ebikes_updated_at 
    BEFORE UPDATE ON ebikes 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create a function to increment search count
CREATE OR REPLACE FUNCTION increment_search_count(bike_id UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE ebikes 
    SET search_count = search_count + 1,
        updated_at = NOW()
    WHERE id = bike_id;
END;
$$ language 'plpgsql';

-- Enable Row Level Security (RLS)
ALTER TABLE ebikes ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Allow public read access" ON ebikes
    FOR SELECT USING (true);

-- Create policies for public access (for migration and app usage)
CREATE POLICY "Allow public insert" ON ebikes
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public update" ON ebikes
    FOR UPDATE USING (true);

-- Create a simplified view for search results
CREATE OR REPLACE VIEW ebike_search_results AS
SELECT 
    id,
    brand,
    model,
    canonical_name,
    aliases,
    motor_power,
    has_throttle,
    max_speed,
    torque,
    motor_details,
    battery_voltage,
    battery_capacity_wh,
    bike_type,
    compliance,
    legal_in_australia,
    notes,
    can_unlock,
    unlocked_motor_power,
    unlocked_torque,
    unlocked_throttle_restricted,
    unlocked_max_speed,
    unlocked_legal_in_states,
    unlocked_compliance,
    unlocked_notes,
    source,
    search_count,
    created_at,
    updated_at
FROM ebikes;

-- Grant permissions
GRANT SELECT ON ebike_search_results TO anon, authenticated;
GRANT ALL ON ebikes TO authenticated;
