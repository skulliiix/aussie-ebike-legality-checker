// Test if environment variables are loading correctly
console.log('🔍 Environment Variable Test');
console.log('============================');
console.log('VITE_GEMINI_API_KEY:', import.meta.env.VITE_GEMINI_API_KEY ? 'Found (' + import.meta.env.VITE_GEMINI_API_KEY.length + ' chars)' : 'NOT FOUND');
console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL ? 'Found' : 'NOT FOUND');
console.log('VITE_SUPABASE_ANON_KEY:', import.meta.env.VITE_SUPABASE_ANON_KEY ? 'Found' : 'NOT FOUND');
console.log('All env vars:', import.meta.env);
