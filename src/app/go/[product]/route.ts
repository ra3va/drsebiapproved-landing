import { NextRequest, NextResponse } from 'next/server';

const PRODUCTS: Record<string, string> = {
  paracleanse: '/paracleanse',
  maya: '/maya',
  seamoss: '/seamoss',
  mucus: '/mucus-cleanser',
};

export async function GET(
  request: NextRequest,
  { params }: { params: { product: string } }
) {
  const product = params.product.toLowerCase();
  const destination = PRODUCTS[product];

  if (!destination) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  // Build UTM params for GA4
  const utmParams = new URLSearchParams({
    coupon: 'BLACKFRIDAY30',
    utm_source: 'zoho',
    utm_medium: 'email',
    utm_campaign: 'blackfriday2025',
  });

  return NextResponse.redirect(new URL(`${destination}?${utmParams}`, request.url));
}
