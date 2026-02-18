import { environments } from '@/app/environments';
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    environments.SUPABASE_URL!,
    environments.SUPABASE_PUBLISHABLE_KEY!
  )
}