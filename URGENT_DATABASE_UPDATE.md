# 🚨 URGENT: Database Update Required

## 🎯 What You Need to Do Right Now

Your database needs to be updated to support thumbnails and manufacturer URLs. Follow these steps:

## 📋 Step 1: Add Database Columns

1. **Go to your Supabase dashboard**: https://supabase.com/dashboard
2. **Navigate to your project**: `pgpegcvyuflrvenjsltl`
3. **Go to SQL Editor** (left sidebar)
4. **Run this SQL command**:

```sql
ALTER TABLE ebikes
ADD COLUMN IF NOT EXISTS image_url TEXT,
ADD COLUMN IF NOT EXISTS manufacturer_url TEXT;
```

## 📋 Step 2: Update the Search View

**In the same SQL Editor, run this**:

```sql
DROP VIEW IF EXISTS ebike_search_results;
CREATE VIEW ebike_search_results AS
SELECT * FROM ebikes;

GRANT SELECT ON ebike_search_results TO anon, authenticated;
```

## ✅ Step 3: Verify the Update

**Run this verification query**:

```sql
SELECT 
  brand, 
  model, 
  image_url, 
  manufacturer_url
FROM ebikes 
LIMIT 5;
```

You should see the new columns (they'll be NULL for now).

## 🚀 Step 4: Let Me Know When Done

Once you've run the SQL commands, let me know and I'll immediately update all 30+ bikes with their thumbnails and manufacturer URLs!

## 🎯 Expected Results

After I update the bikes, you'll see:
- ✅ **All bikes have thumbnails** (80x80px images)
- ✅ **All bikes have manufacturer links** (clickable URLs)
- ✅ **Professional UI** with visual bike identification

## ⚡ Quick Copy-Paste Commands

**Command 1:**
```sql
ALTER TABLE ebikes ADD COLUMN IF NOT EXISTS image_url TEXT, ADD COLUMN IF NOT EXISTS manufacturer_url TEXT;
```

**Command 2:**
```sql
DROP VIEW IF EXISTS ebike_search_results; CREATE VIEW ebike_search_results AS SELECT * FROM ebikes; GRANT SELECT ON ebike_search_results TO anon, authenticated;
```

**Verification:**
```sql
SELECT brand, model, image_url, manufacturer_url FROM ebikes LIMIT 5;
```

---

**This will take 2 minutes to complete. Once done, your app will have professional thumbnails for all bikes!** 🎉
