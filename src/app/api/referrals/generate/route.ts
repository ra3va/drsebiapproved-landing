import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { generateReferralUrl } from '@/lib/utils/referrals';

export async function GET() {
  const supabase = createRouteHandlerClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // Get user's referral code
  const { data: profile } = await supabase
    .from('profiles')
    .select('referral_code')
    .eq('id', user.id)
    .single();

  if (!profile?.referral_code) {
    return NextResponse.json({ error: 'No referral code found' }, { status: 404 });
  }

  const referralUrl = generateReferralUrl(profile.referral_code);

  return NextResponse.json({
    referralCode: profile.referral_code,
    referralUrl,
  });
}
