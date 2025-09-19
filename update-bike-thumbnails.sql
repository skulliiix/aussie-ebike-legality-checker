-- Update all existing bikes with thumbnails and manufacturer URLs
-- Run this in your Supabase SQL editor after running add-thumbnail-columns.sql

-- Lekker Bikes
UPDATE ebikes SET 
  image_url = 'https://cdn.shopify.com/s/files/1/0569/6078/0207/products/Lekker_Amsterdam_GT_1_1024x1024.jpg?v=1680664972',
  manufacturer_url = 'https://lekkerbikes.com.au'
WHERE brand = 'Lekker' AND model LIKE '%Amsterdam%';

UPDATE ebikes SET 
  image_url = 'https://cdn.shopify.com/s/files/1/0569/6078/0207/products/Lekker_Jordaan_GTS_1_1024x1024.jpg?v=1680664972',
  manufacturer_url = 'https://lekkerbikes.com.au'
WHERE brand = 'Lekker' AND model LIKE '%Jordaan%';

UPDATE ebikes SET 
  image_url = 'https://cdn.shopify.com/s/files/1/0569/6078/0207/products/Lekker_Urban_1_1024x1024.jpg?v=1680664972',
  manufacturer_url = 'https://lekkerbikes.com.au'
WHERE brand = 'Lekker' AND model LIKE '%Urban%';

-- Dirodi Bikes
UPDATE ebikes SET 
  image_url = 'https://dirodi.com.au/wp-content/uploads/2024/01/Dirodi-Nova-250W-500W-Electric-Bike.jpg',
  manufacturer_url = 'https://dirodi.com.au'
WHERE brand = 'Dirodi' AND model LIKE '%Nova%';

UPDATE ebikes SET 
  image_url = 'https://dirodi.com.au/wp-content/uploads/2024/01/Dirodi-xTreme-Gen3-250W-500W-Electric-Bike.jpg',
  manufacturer_url = 'https://dirodi.com.au'
WHERE brand = 'Dirodi' AND model LIKE '%xTreme%';

UPDATE ebikes SET 
  image_url = 'https://dirodi.com.au/wp-content/uploads/2024/01/Dirodi-Cruiser-250W-500W-Electric-Bike.jpg',
  manufacturer_url = 'https://dirodi.com.au'
WHERE brand = 'Dirodi' AND model LIKE '%Cruiser%';

UPDATE ebikes SET 
  image_url = 'https://dirodi.com.au/wp-content/uploads/2024/01/Dirodi-Explorer-250W-500W-Electric-Bike.jpg',
  manufacturer_url = 'https://dirodi.com.au'
WHERE brand = 'Dirodi' AND model LIKE '%Explorer%';

UPDATE ebikes SET 
  image_url = 'https://dirodi.com.au/wp-content/uploads/2024/01/Dirodi-Adventure-250W-500W-Electric-Bike.jpg',
  manufacturer_url = 'https://dirodi.com.au'
WHERE brand = 'Dirodi' AND model LIKE '%Adventure%';

-- Velectrix Bikes
UPDATE ebikes SET 
  image_url = 'https://cdn.shopify.com/s/files/1/0569/6078/0207/products/VelectriX_Foldaway_1_1024x1024.jpg?v=1680664972',
  manufacturer_url = 'https://velectrix.com.au'
WHERE brand = 'Velectrix' AND model LIKE '%Foldaway%';

UPDATE ebikes SET 
  image_url = 'https://cdn.shopify.com/s/files/1/0569/6078/0207/products/VelectriX_Urban_Plus_1_1024x1024.jpg?v=1680664972',
  manufacturer_url = 'https://velectrix.com.au'
WHERE brand = 'Velectrix' AND model LIKE '%Urban%';

UPDATE ebikes SET 
  image_url = 'https://cdn.shopify.com/s/files/1/0569/6078/0207/products/VelectriX_Urban_Pulse_1_1024x1024.jpg?v=1680664972',
  manufacturer_url = 'https://velectrix.com.au'
WHERE brand = 'Velectrix' AND model LIKE '%Pulse%';

UPDATE ebikes SET 
  image_url = 'https://cdn.shopify.com/s/files/1/0569/6078/0207/products/VelectriX_Cruiser_ST_1_1024x1024.jpg?v=1680664972',
  manufacturer_url = 'https://velectrix.com.au'
WHERE brand = 'Velectrix' AND model LIKE '%Cruiser%';

UPDATE ebikes SET 
  image_url = 'https://cdn.shopify.com/s/files/1/0569/6078/0207/products/VelectriX_Adventurer_Pulse_ST_1_1024x1024.jpg?v=1680664972',
  manufacturer_url = 'https://velectrix.com.au'
WHERE brand = 'Velectrix' AND model LIKE '%Adventurer%';

UPDATE ebikes SET 
  image_url = 'https://cdn.shopify.com/s/files/1/0569/6078/0207/products/VelectriX_Ascent_1_1024x1024.jpg?v=1680664972',
  manufacturer_url = 'https://velectrix.com.au'
WHERE brand = 'Velectrix' AND model LIKE '%Ascent%';

UPDATE ebikes SET 
  image_url = 'https://cdn.shopify.com/s/files/1/0569/6078/0207/products/VelectriX_SUV_1_1024x1024.jpg?v=1680664972',
  manufacturer_url = 'https://velectrix.com.au'
WHERE brand = 'Velectrix' AND model LIKE '%SUV%';

-- Fatboy Bikes
UPDATE ebikes SET 
  image_url = 'https://fatboybikes.com.au/wp-content/uploads/2024/01/Fatboy-Harlem-500W-Electric-Bike.jpg',
  manufacturer_url = 'https://fatboybikes.com.au'
WHERE brand = 'Fatboy' AND model LIKE '%Harlem%';

UPDATE ebikes SET 
  image_url = 'https://fatboybikes.com.au/wp-content/uploads/2024/01/Fatboy-Scrambler-500W-Electric-Bike.jpg',
  manufacturer_url = 'https://fatboybikes.com.au'
WHERE brand = 'Fatboy' AND model LIKE '%Scrambler%';

UPDATE ebikes SET 
  image_url = 'https://fatboybikes.com.au/wp-content/uploads/2024/01/Fatboy-Bagus-500W-Electric-Bike.jpg',
  manufacturer_url = 'https://fatboybikes.com.au'
WHERE brand = 'Fatboy' AND model LIKE '%Bagus%';

-- Verify updates
SELECT 
  brand, 
  model, 
  image_url, 
  manufacturer_url,
  CASE 
    WHEN image_url IS NOT NULL AND manufacturer_url IS NOT NULL THEN '✅ Complete'
    WHEN image_url IS NULL AND manufacturer_url IS NULL THEN '❌ Missing both'
    WHEN image_url IS NULL THEN '⚠️ Missing image'
    WHEN manufacturer_url IS NULL THEN '⚠️ Missing URL'
  END as status
FROM ebikes 
ORDER BY brand, model;
