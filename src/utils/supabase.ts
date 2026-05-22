import { createClient, type SupabaseClient } from '@supabase/supabase-js'

let client: SupabaseClient | null = null

function ensureClient() {
  if (client) return client
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY
  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error('Missing Supabase environment variables. Check your .env file.')
  }
  client = createClient(supabaseUrl, supabasePublishableKey)
  return client
}

export const supabase = new Proxy({} as SupabaseClient, {
  get(_, prop) {
    return Reflect.get(ensureClient(), prop as keyof SupabaseClient)
  },
})
