/**
 * Server-side Supabase client using the service role key.
 * Use only in server contexts (API routes, Server Actions, server components).
 * Never import this module in client components.
 */
import { createClient } from "@supabase/supabase-js";
import { getServerEnv } from "@/lib/env";

export function createServerSupabaseClient() {
  const env = getServerEnv();

  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
