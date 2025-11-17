import { NextResponse } from 'next/server';
import { syncBrevoContact } from '@/lib/integrations/brevo-sync';

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID required' },
        { status: 400 }
      );
    }

    const result = await syncBrevoContact(userId);

    return NextResponse.json(result);
  } catch (error) {
    console.error('Brevo sync error:', error);
    return NextResponse.json(
      { error: 'Sync failed', message: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
