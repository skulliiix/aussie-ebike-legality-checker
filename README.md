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
   - `GEMINI_API_KEY` - Your Google Gemini API key

3. Run the app:
   ```bash
   npm run dev
   ```

## Database Setup

See [DATABASE_SETUP.md](DATABASE_SETUP.md) for instructions on setting up the Supabase database.

## Tech Stack

- **Frontend**: React + TypeScript + Vite
- **Database**: Supabase (PostgreSQL)
- **AI**: Google Gemini API
- **Styling**: Tailwind CSS

## License

This project is open source and available under the MIT License.
