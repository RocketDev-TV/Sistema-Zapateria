// /js/supabaseClient.js  (ESM)
const SUPABASE_URL = 'https://dyurizmeonhdhwruausf.supabase.co'; // TU URL
const SUPABASE_ANON_KEY = 'TU_ANON_PUBLIC_KEY';                  // Settings → API Keys → anon

export const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
