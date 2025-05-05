import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Warning: Supabase environment variables not found');
  process.exit(1);
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey); 