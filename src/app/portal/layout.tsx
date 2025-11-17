import { createServerClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import PortalNav from '@/components/portal/PortalNav';

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Redirect to login if not authenticated
  // (except for login/register/reset-password pages which have their own logic)
  const publicPaths = ['/portal/login', '/portal/register', '/portal/reset-password'];

  if (!session && !publicPaths.some(path => typeof window !== 'undefined' && window.location.pathname.startsWith(path))) {
    redirect('/portal/login');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {session && <PortalNav />}
      <main className="container mx-auto px-4 py-8 max-w-7xl">{children}</main>
    </div>
  );
}
