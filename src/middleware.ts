import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protected portal routes (require authentication)
  const portalRoutes = [
    '/portal',
    '/portal/orders',
    '/portal/subscriptions',
    '/portal/rewards',
    '/portal/referrals',
    '/portal/profile',
    '/portal/settings',
    '/portal/digital-content',
  ];

  const isPortalRoute = portalRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Public portal routes (no auth required)
  const publicPortalRoutes = [
    '/portal/login',
    '/portal/register',
    '/portal/reset-password',
  ];

  const isPublicPortalRoute = publicPortalRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Redirect to login if accessing protected portal route without session
  if (isPortalRoute && !isPublicPortalRoute && !session) {
    return NextResponse.redirect(
      new URL(
        `/portal/login?redirectTo=${encodeURIComponent(request.nextUrl.pathname)}`,
        request.url
      )
    );
  }

  // Redirect to portal if accessing public portal route with session
  if (isPublicPortalRoute && session) {
    return NextResponse.redirect(new URL('/portal', request.url));
  }

  // Admin routes (require authentication + admin role)
  const isAdminRoute = request.nextUrl.pathname.startsWith('/admin');

  if (isAdminRoute && !session) {
    return NextResponse.redirect(
      new URL('/portal/login?redirectTo=/admin', request.url)
    );
  }

  if (isAdminRoute && session) {
    // Check if user is admin (this is a simple check, full verification happens in layout)
    const { data: adminUser } = await supabase
      .from('admin_users')
      .select('*')
      .eq('user_id', session.user.id)
      .single();

    if (!adminUser) {
      return NextResponse.redirect(new URL('/portal', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
