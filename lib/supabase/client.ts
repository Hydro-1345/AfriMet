import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { getPublicEnv } from "@/lib/env";

let browserClient: SupabaseClient | null = null;

/**
 * Browser Supabase client using the public anon key.
 * Safe for use in client components.
 */
export function createBrowserSupabaseClient(): SupabaseClient {
  if (browserClient) {
    return browserClient;
  }

  const env = getPublicEnv();

  browserClient = createClient(
    env.NEXT_PUBLIC_SUPABASE_URL,
    env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  return browserClient;
}
