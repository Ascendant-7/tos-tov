import { createClient } from "@supabase/supabase-js";
export function createSupabaseClient(url, key, overrides) {
    return createClient(url, key, { global: { headers: { ...overrides?.headers } } });
}
//# sourceMappingURL=client.js.map