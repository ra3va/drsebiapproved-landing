import { NextRequest, NextResponse } from 'next/server';

const PRODUCTS: Record<string, string> = {
  paracleanse: '/paracleanse',
  maya: '/maya',
  seamoss: '/seamoss',
  mucus: '/mucus-cleanser',
};

const BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://drsebiapproved.com' 
  : 'http://localhost:3000';

export async function GET(
  request: NextRequest,
  { params }: { params: { product: string } }
) {
  const product = params.product.toLowerCase();
  const destination = PRODUCTS[product];

  if (!destination) {
    return NextResponse.redirect(`${BASE_URL}/`);
  }

  // Build UTM params for GA4 (evergreen email tracking)
  const utmParams = new URLSearchParams({
    utm_source: 'zoho',
    utm_medium: 'email',
    utm_campaign: 'email-product-redirect',
  });

  return NextResponse.redirect(`${BASE_URL}${destination}?${utmParams}`);
}
