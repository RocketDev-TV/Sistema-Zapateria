// js/supabaseClient.js
export const SUPABASE_URL = 'https://dyurizmeonhdhwrwausf.supabase.co';  // tu URL del panel [Data API]
export const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5dXJpem1lb25oZGh3cndhdXNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0Mzk3MDMsImV4cCI6MjA3ODAxNTcwM30.v_y673eUqOLJ0GzRbLHPQWsLkb9keWL1WoBgqDoOzPc';              // API Keys → anon public

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: { persistSession: true, autoRefreshToken: true },
});
