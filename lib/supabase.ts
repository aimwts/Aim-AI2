import { createClient } from '@supabase/supabase-js';

// Access environment variables using process.env to ensure compatibility
// and avoid runtime errors where import.meta.env is undefined.
declare const process: any;

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

// Create a single supabase client for interacting with your database
// If keys are missing, we export null to trigger "Mock Mode" in services
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;

export const isSupabaseConfigured = !!supabase;