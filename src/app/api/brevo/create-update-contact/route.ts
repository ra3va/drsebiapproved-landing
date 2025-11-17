import { NextResponse } from 'next/server';

const BREVO_API_KEY = process.env.BREVO_API_KEY;

export async function POST(request: Request) {
  if (!BREVO_API_KEY) {
    return NextResponse.json({ error: 'Brevo API key not configured' }, { status: 500 });
  }

  try {
    const { email, attributes } = await request.json();

    const response = await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY,
      },
      body: JSON.stringify({
        email,
        attributes,
        updateEnabled: true,
      }),
    });

    // Brevo returns 201 for created, 204 for updated
    if (response.status === 204) {
      return NextResponse.json({ success: true, updated: true });
    }

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Brevo API error');
    }

    return NextResponse.json({ success: true, contact: data });
  } catch (error) {
    console.error('Brevo create/update error:', error);
    return NextResponse.json(
      { error: 'Failed to create/update contact' },
      { status: 500 }
    );
  }
}
