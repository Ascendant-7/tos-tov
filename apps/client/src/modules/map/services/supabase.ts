// apps/client/src/services/supabase.ts
// This file initializes and exports the Supabase client for your frontend.

import { createSupabaseClient } from '@repo/supabase'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://uhfjmbvbnuhotlnxdvgj.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_Z1pGXh0XEg83YKa6QAklcw_dsGFDR0x'

export const supabase = createSupabaseClient(supabaseUrl, supabaseAnonKey)
