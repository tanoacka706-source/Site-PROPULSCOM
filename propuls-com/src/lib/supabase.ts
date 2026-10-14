import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

/** Client Supabase côté serveur uniquement (clé service_role). Retourne null si non configuré. */
export function supabaseServeur(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const cle = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !cle) return null;
  client ??= createClient(url, cle, { auth: { persistSession: false, autoRefreshToken: false } });
  return client;
}
