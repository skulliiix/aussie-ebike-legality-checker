-- Add thumbnail and manufacturer URL columns to existing ebikes table
-- Run this in your Supabase SQL editor

-- Add new columns for thumbnails and manufacturer URLs
ALTER TABLE ebikes 
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS manufacturer_url TEXT;

-- Add comments for documentation
COMMENT ON COLUMN ebikes.image_url IS 'URL to e-bike product image/thumbnail';
COMMENT ON COLUMN ebikes.manufacturer_url IS 'URL to manufacturer website';

-- Update the search view to include new columns
DROP VIEW IF EXISTS ebike_search_results;
CREATE VIEW ebike_search_results AS
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
  search_count,
  added_date,
  last_updated,
  image_url,
  manufacturer_url
FROM ebikes;

-- Grant permissions on the updated view
GRANT SELECT ON ebike_search_results TO anon, authenticated;
