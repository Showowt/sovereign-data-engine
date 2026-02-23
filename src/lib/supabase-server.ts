/**
 * Sovereign Data Engine - Server-side Supabase Client
 * Uses service role key for admin operations (scrapers, bulk inserts)
 */

import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Singleton for server client
let serverClient: SupabaseClient | null = null;

/**
 * Get server-side Supabase client with service role
 * ONLY use this on the server (API routes, server components)
 */
export function getServerSupabase(): SupabaseClient {
  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn(
      "[Supabase] Missing env vars - returning mock client for development",
    );
    // Return a client that will fail gracefully
    return createClient(
      supabaseUrl || "https://placeholder.supabase.co",
      supabaseServiceKey || "placeholder-key",
    );
  }

  if (!serverClient) {
    serverClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }

  return serverClient;
}

/**
 * Check if Supabase is properly configured
 */
export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseServiceKey);
}
