// =====================================================
// Supabase Server Client (Server-Side)
// =====================================================
// Use this in:
// - Server Components
// - API Routes
// - Server Actions
// Uses cookies for authentication
// =====================================================

import { createServerComponentClient, createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import type { Database } from '@/types/supabase';

// For Server Components
export function createServerClient() {
  return createServerComponentClient<Database>({ cookies });
}

// For API Route Handlers
export function createRouteClient() {
  return createRouteHandlerClient<Database>({ cookies });
}
