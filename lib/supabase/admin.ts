/**
 * Server-side Supabase client using the service role key.
 * Use only for trusted admin operations. Never import in client components.
 */
import { createClient } from "@supabase/supabase-js";
import { getServerEnv } from "@/lib/env";

export function createAdminClient() {
  const env = getServerEnv();

  return createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}

/** @deprecated Use createAdminClient() instead */
export const createServerSupabaseClient = createAdminClient;
