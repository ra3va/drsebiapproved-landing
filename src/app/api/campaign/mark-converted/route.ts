import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: 'Email required' }, { status: 400 });
    }

    // Mark user as converted in campaign
    const { data, error } = await supabaseAdmin
      .from('reengagement_campaign')
      .update({
        status: 'converted',
        converted_at: new Date().toISOString()
      })
      .eq('customer_email', email.toLowerCase())
      .select();

    if (error) {
      console.error('Conversion tracking error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      converted: data?.length || 0,
      message: data?.length ? `Marked ${email} as converted` : 'Email not in campaign'
    });

  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
