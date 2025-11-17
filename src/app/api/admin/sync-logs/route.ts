import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { isAdmin } from '@/lib/supabase/admin';

export async function GET(request: Request) {
  const supabase = createRouteHandlerClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user || !(await isAdmin(user.id))) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const service = searchParams.get('service');
  const status = searchParams.get('status');
  const limit = parseInt(searchParams.get('limit') || '100');

  try {
    let query = supabase
      .from('sync_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (service) {
      query = query.eq('service', service);
    }

    if (status) {
      query = query.eq('status', status);
    }

    const { data, error } = await query;

    if (error) throw error;

    return NextResponse.json({ logs: data });
  } catch (error) {
    console.error('Fetch sync logs error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sync logs' },
      { status: 500 }
    );
  }
}
