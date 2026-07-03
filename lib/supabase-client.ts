import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const fallbackSupabaseUrl = "http://localhost:54321";
const fallbackServiceRoleKey = "supabase-fallback-key";

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.warn(
    "Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables. Supabase client will use fallback values for build-time only."
  );
}

export const supabaseAdmin = createClient(
  supabaseUrl ?? fallbackSupabaseUrl,
  supabaseServiceRoleKey ?? fallbackServiceRoleKey,
  {
    auth: { persistSession: false },
    global: { fetch }
  }
);
