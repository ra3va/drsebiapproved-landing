import { NextResponse } from 'next/server';
import { loadBlogRegistry } from '@/lib/ai/registry-generator';

export async function GET() {
  try {
    const registry = loadBlogRegistry();
    return NextResponse.json(registry);
  } catch (error: any) {
    console.error('Error loading registry:', error);
    return NextResponse.json(
      { error: 'Failed to load blog registry', details: error.message },
      { status: 500 }
    );
  }
}
