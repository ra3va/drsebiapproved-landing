// =====================================================
// Supabase Client (Browser/Client-Side)
// =====================================================
// Use this in Client Components ('use client')
// Safe to use in browser - uses anon key
// =====================================================

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import type { Database } from '@/types/supabase';

export function createClient() {
  return createClientComponentClient<Database>();
}

// Export default instance for convenience
export const supabase = createClient();
