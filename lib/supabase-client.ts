import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseServiceRoleKey);

if (!isSupabaseConfigured && process.env.NODE_ENV !== "production") {
  console.warn(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables. Supabase queries will use local mock data."
  );
}

export const supabaseAdmin = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseServiceRoleKey!, {
      auth: { persistSession: false },
      global: { fetch }
    })
  : null;
