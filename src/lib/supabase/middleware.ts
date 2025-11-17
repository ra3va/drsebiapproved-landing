// =====================================================
// Supabase Middleware (Auth Protection)
// =====================================================
// Protects routes that require authentication
// Redirects to login if not authenticated
// =====================================================

import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import type { Database } from '@/types/supabase';

export async function supabaseMiddleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient<Database>({ req, res });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protected routes
  const protectedRoutes = ['/portal', '/admin'];
  const isProtectedRoute = protectedRoutes.some((route) =>
    req.nextUrl.pathname.startsWith(route)
  );

  // If accessing protected route without session, redirect to login
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/portal/login', req.url);
    redirectUrl.searchParams.set('redirectTo', req.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  // If accessing admin route, check admin status
  if (req.nextUrl.pathname.startsWith('/admin') && session) {
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('id, is_active')
      .eq('id', session.user.id)
      .eq('is_active', true)
      .single();

    if (!adminUser) {
      // Not an admin, redirect to customer portal
      return NextResponse.redirect(new URL('/portal', req.url));
    }
  }

  return res;
}
