# Aussie E-bike Legality Checker

A comprehensive tool to check if your e-bike is legal across Australian states based on motor power, throttle functionality, and other specifications.

## Features

- **Database of 30+ e-bikes** (Lekker, Dirodi, Velectrix, Fatboy)
- **AI-powered search** with Gemini integration for unknown bikes
- **State-by-state legality analysis** for all Australian states
- **Unlock toggle functionality** for bikes with configurable power settings
- **Real-time database** with auto-save for new discoveries
- **Clean, responsive UI** with instant search results

## Run Locally

**Prerequisites:** Node.js

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   ```bash
   cp env.example .env
   ```
   
   Then edit `.env` and add:
   - `VITE_SUPABASE_URL` - Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key
   - `VITE_GEMINI_API_KEY` - Your Google Gemini API key (optional, for AI search)

3. Get your API keys:
   
   **Supabase (Required):**
   - Go to [supabase.com](https://supabase.com) and create a project
   - Find your URL and anon key in Settings > API
   - Run the SQL from `supabase-setup.sql` in your Supabase SQL editor
   
   **Gemini API (Optional):**
   - Go to [Google AI Studio](https://aistudio.google.com/)
   - Create an API key
   - Add it to your `.env` file as `VITE_GEMINI_API_KEY`

4. Run the app:
   ```bash
   npm run dev
   ```

## How It Works

1. **Search for e-bikes** - The app first searches the local database (instant, free)
2. **AI fallback** - If not found and Gemini is enabled, it uses AI to analyze unknown bikes
3. **Auto-save** - New bikes found by AI are automatically saved to the database
4. **Legal analysis** - Shows legality across all Australian states with detailed explanations

## Database Setup

See [DATABASE_SETUP.md](DATABASE_SETUP.md) for detailed instructions on setting up the Supabase database.

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Database**: Supabase (PostgreSQL)
- **AI**: Google Gemini API
- **Styling**: Tailwind CSS

## License

This project is open source and available under the MIT License.
