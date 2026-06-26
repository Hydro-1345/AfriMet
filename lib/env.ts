/**
 * Validated public environment variables (safe for client and server).
 */
export type PublicEnv = {
  NEXT_PUBLIC_SUPABASE_URL: string;
  NEXT_PUBLIC_SUPABASE_ANON_KEY: string;
};

/**
 * Full server-side environment including secrets.
 */
export type ServerEnv = PublicEnv & {
  SUPABASE_SERVICE_ROLE_KEY: string;
  OPENAI_API_KEY?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
};

function requireEnv(name: string, value: string | undefined): string {
  if (!value) {
    throw new Error(
      `Missing required environment variable: ${name}. Copy .env.example to .env.local and fill in your values.`
    );
  }
  return value;
}

/**
 * Returns public env vars. Required for Supabase client initialization.
 */
export function getPublicEnv(): PublicEnv {
  return {
    NEXT_PUBLIC_SUPABASE_URL: requireEnv(
      "NEXT_PUBLIC_SUPABASE_URL",
      process.env.NEXT_PUBLIC_SUPABASE_URL
    ),
    NEXT_PUBLIC_SUPABASE_ANON_KEY: requireEnv(
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ),
  };
}

/**
 * Returns server-only env vars including secrets.
 * Call only from server contexts (API routes, Server Actions, server modules).
 */
export function getServerEnv(): ServerEnv {
  const publicEnv = getPublicEnv();

  return {
    ...publicEnv,
    SUPABASE_SERVICE_ROLE_KEY: requireEnv(
      "SUPABASE_SERVICE_ROLE_KEY",
      process.env.SUPABASE_SERVICE_ROLE_KEY
    ),
    OPENAI_API_KEY: process.env.OPENAI_API_KEY,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  };
}
