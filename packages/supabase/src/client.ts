import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types.js";

export function createSupabaseClient(
    url: string,
    key: string,
    overrides?: {
        headers?: Record<string, string>;
    },
): SupabaseClient<Database> {
    return createClient<Database>(
        url,
        key,
        { global: { headers: { ...overrides?.headers } } }
    );
}