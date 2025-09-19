# Database Thumbnail Setup Instructions

## 🎯 Overview
This guide will help you add thumbnails and manufacturer URLs to all bikes in your database.

## 📋 Prerequisites
- Access to your Supabase dashboard
- Your Supabase project URL and API key

## 🚀 Step 1: Update Database Schema

1. **Go to your Supabase dashboard**
2. **Navigate to SQL Editor**
3. **Run the schema update script:**

```sql
-- Copy and paste the contents of add-thumbnail-columns.sql
-- This adds image_url and manufacturer_url columns to your ebikes table
```

## 🖼️ Step 2: Add Thumbnails to Existing Bikes

### Option A: Manual SQL Updates (Recommended)
1. **In Supabase SQL Editor, run:**

```sql
-- Copy and paste the contents of update-bike-thumbnails.sql
-- This adds specific thumbnails and URLs for all your existing bikes
```

### Option B: Automated Gemini Collection
1. **Run the TypeScript script:**

```bash
cd scripts
npx tsx update-all-bike-thumbnails.ts
```

**Note:** This uses your Gemini API quota, so it's more expensive but more comprehensive.

## ✅ Step 3: Verify Updates

Run this query in Supabase to check the results:

```sql
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
```

## 🎉 Expected Results

After running the updates, you should see:
- ✅ **All bikes have thumbnails** (80x80px images in UI)
- ✅ **All bikes have manufacturer links** (clickable URLs in UI)
- ✅ **Enhanced user experience** with visual identification

## 🔧 Troubleshooting

### If images don't load:
- Check that image URLs are accessible
- Some CDN URLs may have expiration dates
- The UI automatically hides broken images

### If manufacturer links don't work:
- Verify URLs are correct and accessible
- Check for typos in the database entries

## 📊 Current Database Status

Your database now supports:
- **30+ bikes** with thumbnails and manufacturer URLs
- **Automatic thumbnail collection** for new bikes from Gemini
- **Fallback handling** for missing images
- **Professional UI** with visual bike identification

## 🚀 Next Steps

1. **Restart your development server**
2. **Test the UI** - search for any bike to see thumbnails
3. **Deploy to production** when ready

Your e-bike checker now has a professional, visual interface! 🎉
