import { createClient } from "@supabase/supabase-js";

/**
 * Supabase admin client for server-side aggregate queries.
 * Uses SERVICE_ROLE_KEY — never expose to the browser.
 */
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return null;
  }

  return createClient(url, key, {
    auth: { persistSession: false },
  });
}
