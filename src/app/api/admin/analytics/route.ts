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
  const timeframe = searchParams.get('timeframe') || 'week'; // day, week, month, year

  try {
    const now = new Date();
    let startDate: Date;

    switch (timeframe) {
      case 'day':
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case 'week':
        startDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case 'month':
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        break;
      case 'year':
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        break;
      default:
        startDate = new Date(now.setDate(now.getDate() - 7));
    }

    // Total revenue
    const { data: orders } = await supabase
      .from('orders')
      .select('total_amount, created_at')
      .gte('created_at', startDate.toISOString());

    const totalRevenue = orders?.reduce((sum, order) => sum + order.total_amount, 0) || 0;

    // Total customers
    const { count: totalCustomers } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startDate.toISOString());

    // Total orders
    const { count: totalOrders } = await supabase
      .from('orders')
      .select('*', { count: 'exact', head: true })
      .gte('created_at', startDate.toISOString());

    // Loyalty stats
    const { data: loyaltyStats } = await supabase
      .from('loyalty_transactions')
      .select('points_change')
      .gte('created_at', startDate.toISOString());

    const pointsIssued = loyaltyStats?.filter(t => t.points_change > 0)
      .reduce((sum, t) => sum + t.points_change, 0) || 0;

    const pointsRedeemed = Math.abs(loyaltyStats?.filter(t => t.points_change < 0)
      .reduce((sum, t) => sum + t.points_change, 0) || 0);

    // Active subscriptions
    const { count: activeSubscriptions } = await supabase
      .from('subscriptions')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active');

    return NextResponse.json({
      timeframe,
      totalRevenue,
      totalCustomers,
      totalOrders,
      pointsIssued,
      pointsRedeemed,
      activeSubscriptions,
    });
  } catch (error) {
    console.error('Fetch analytics error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
