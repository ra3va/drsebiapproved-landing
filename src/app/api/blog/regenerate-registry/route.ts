import { NextResponse } from 'next/server';
import { generateBlogRegistry } from '@/lib/ai/registry-generator';

export async function POST() {
  try {
    console.log('🔄 Manually regenerating blog registry...');
    const registry = await generateBlogRegistry();

    return NextResponse.json({
      success: true,
      message: 'Registry regenerated successfully',
      stats: {
        totalPosts: registry.meta.totalPosts,
        totalWords: registry.meta.totalWords,
        categories: registry.meta.categories,
        lastUpdated: registry.meta.lastUpdated
      }
    });

  } catch (error: any) {
    console.error('Regenerate registry error:', error);
    return NextResponse.json(
      { error: 'Failed to regenerate registry', details: error.message },
      { status: 500 }
    );
  }
}
