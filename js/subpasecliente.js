// --- js/supabaseclient.js ---

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

// ----------------------------------------------------
// ¡¡IMPORTANTE!! CAMBIA ESTO POR TUS DATOS DE SUPABASE
// ----------------------------------------------------
const SUPABASE_URL = 'https://TU_PROYECTO_URL.supabase.co'
const SUPABASE_ANON_KEY = 'TU_LLAVE_PUBLICA_ANON'
// ----------------------------------------------------

// Exporta el cliente de Supabase para que otros archivos lo puedan usar
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)