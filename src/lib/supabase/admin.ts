// =====================================================
// Supabase Admin Client (Service Role)
// =====================================================
// DANGER: This client bypasses Row Level Security
// Only use server-side for admin operations
// NEVER expose to browser
// =====================================================

import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/supabase';

if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL');
}

if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY');
}

// Admin client with service role key (bypasses RLS)
export const supabaseAdmin = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Helper: Check if user is admin
export async function isAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from('admin_users')
    .select('id, is_active')
    .eq('id', userId)
    .eq('is_active', true)
    .single();

  return !error && !!data;
}

// Helper: Check if user is super admin
export async function isSuperAdmin(userId: string): Promise<boolean> {
  const { data, error } = await supabaseAdmin
    .from('admin_users')
    .select('id, role, is_active')
    .eq('id', userId)
    .eq('role', 'super_admin')
    .eq('is_active', true)
    .single();

  return !error && !!data;
}

// Helper: Get user's admin role
export async function getAdminRole(userId: string): Promise<string | null> {
  const { data } = await supabaseAdmin
    .from('admin_users')
    .select('role')
    .eq('id', userId)
    .eq('is_active', true)
    .single();

  return data?.role || null;
}
