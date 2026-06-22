import { type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "./database.types.js";
export declare function createSupabaseClient(url: string, key: string, overrides?: {
    headers?: Record<string, string>;
}): SupabaseClient<Database>;
