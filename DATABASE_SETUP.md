# 🗄️ Database Setup Guide

This guide will help you set up Supabase database for the E-bike Legality Checker.

## 🚀 Quick Setup

### 1. Create Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up/Login and create a new project
3. Choose a region close to Australia (e.g., Sydney)
4. Wait for project to be ready (2-3 minutes)

### 2. Set Up Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the contents of `supabase-setup.sql`
3. Paste and run the SQL script
4. Verify the `ebikes` table was created

### 3. Configure Environment Variables

1. Copy `env.example` to `.env`
2. Get your project URL and anon key from Supabase dashboard:
   - Go to **Settings** → **API**
   - Copy **Project URL** and **anon public** key
3. Update your `.env` file:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
API_KEY=your_gemini_api_key
```

### 4. Migrate Existing Data

Run the migration script to move all embedded bike data to the database:

```bash
# Install tsx for running TypeScript files
npm install -g tsx

# Set environment variables for migration
export VITE_SUPABASE_URL="your_supabase_url"
export VITE_SUPABASE_ANON_KEY="your_supabase_anon_key"

# Run migration
npx tsx scripts/migrate-data.ts
```

### 5. Update Your App

Replace the old services with the new database-powered versions:

```typescript
// In your main app files, replace:
import { searchEbikes } from './services/searchService';
// With:
import { searchEbikes } from './services/searchServiceV2';
```

## 🔧 Database Features

### ✅ What's Included

- **Full-text search** with ranking
- **Auto-save** new bikes from Gemini
- **Search analytics** (track popular searches)
- **Scalable** to 10,000+ bikes
- **Real-time sync** across users
- **Backup & recovery** built-in

### 📊 Database Schema

```sql
ebikes table:
├── id (UUID, Primary Key)
├── brand (VARCHAR)
├── model (VARCHAR) 
├── canonical_name (VARCHAR)
├── aliases (TEXT[])
├── motor_power (INTEGER)
├── has_throttle (BOOLEAN)
├── max_speed (INTEGER)
├── torque (INTEGER)
├── motor_details (TEXT)
├── battery_voltage (INTEGER)
├── battery_capacity_wh (INTEGER)
├── bike_type (VARCHAR)
├── compliance (VARCHAR)
├── legal_in_australia (BOOLEAN)
├── notes (TEXT)
├── can_unlock (BOOLEAN)
├── unlocked_* (unlock specifications)
├── source ('manual' | 'gemini')
├── search_count (INTEGER)
├── created_at (TIMESTAMP)
└── updated_at (TIMESTAMP)
```

## 🎯 Benefits Over Embedded Data

| **Before (Embedded)** | **After (Database)** |
|----------------------|---------------------|
| ~50 bikes max | 10,000+ bikes |
| Code changes for new bikes | Automatic from Gemini |
| Memory only | Persistent storage |
| Manual maintenance | Self-updating |
| Single user | Multi-user ready |
| No analytics | Search tracking |

## 🔍 Testing Your Setup

1. **Check database connection:**
   ```typescript
   import { databaseService } from './services/databaseService';
   const stats = await databaseService.getStats();
   console.log('Database stats:', stats);
   ```

2. **Test search:**
   ```typescript
   import { searchEbikes } from './services/searchServiceV2';
   const result = await searchEbikes('Lekker Amsterdam');
   console.log('Search result:', result);
   ```

3. **Test auto-save:**
   - Search for a bike not in database
   - Enable Gemini search
   - Check if new bike appears in Supabase dashboard

## 🚨 Troubleshooting

### Database Connection Issues
- Verify your `.env` file has correct Supabase credentials
- Check Supabase project is active (not paused)
- Ensure RLS policies allow public read access

### Migration Issues
- Make sure you have the latest embedded data in `searchService.ts`
- Check Supabase logs for any constraint violations
- Verify the `ebikes` table exists and has correct schema

### Search Issues
- Check browser console for database errors
- Verify full-text search indexes are created
- Test with simple queries first (e.g., "Lekker")

## 📈 Next Steps

1. **Monitor usage** in Supabase dashboard
2. **Add more bikes** via Gemini searches
3. **Optimize queries** based on search patterns
4. **Set up alerts** for database issues
5. **Consider caching** for frequently searched bikes

## 🆘 Support

If you encounter issues:
1. Check Supabase dashboard logs
2. Verify environment variables
3. Test database connection separately
4. Check browser console for errors

The database setup is designed to be robust and self-healing, but proper configuration is essential for optimal performance.
