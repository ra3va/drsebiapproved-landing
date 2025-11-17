import { NextResponse } from 'next/server';
import { syncSquareOrder } from '@/lib/integrations/square-sync';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  try {
    const { squareOrderId, userId } = await request.json();

    if (!squareOrderId) {
      return NextResponse.json(
        { error: 'Square order ID required' },
        { status: 400 }
      );
    }

    // Verify user is admin if userId provided
    if (userId) {
      const { data: adminUser } = await supabaseAdmin
        .from('admin_users')
        .select('id')
        .eq('id', userId)
        .single();

      if (!adminUser) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
    }

    const result = await syncSquareOrder(squareOrderId);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Manual sync error:', error);
    return NextResponse.json(
      { error: 'Sync failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
