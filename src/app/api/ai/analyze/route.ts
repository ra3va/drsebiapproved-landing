import { NextResponse } from 'next/server';
import { BlogContextEngine } from '@/lib/ai/blog-context-engine';
import { OpenRouterClient } from '@/lib/ai/openrouter-client';

export async function GET() {
  try {
    console.log('🤖 Analyzing blog content...');

    const contextEngine = new BlogContextEngine();
    const context = await contextEngine.buildContext({
      task: 'analyze'
    });

    const client = new OpenRouterClient();
    const response = await client.chat([
      {
        role: 'system',
        content: context.systemPrompt
      },
      {
        role: 'user',
        content: 'Analyze our blog content and provide strategic recommendations. Return as JSON.'
      }
    ], 'anthropic/claude-3.5-sonnet');

    console.log('✅ Analysis complete');

    // Try to parse as JSON
    let analysis;
    try {
      analysis = JSON.parse(response.content);
    } catch (e) {
      analysis = { rawAnalysis: response.content };
    }

    return NextResponse.json({
      success: true,
      analysis,
      tokenUsage: response.usage,
      registryStats: {
        totalPosts: context.registry.meta.totalPosts,
        totalWords: context.registry.meta.totalWords,
        categories: context.registry.meta.categories,
        contentGaps: context.registry.contentGaps
      }
    });

  } catch (error: any) {
    console.error('Analyze content error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze content', details: error.message },
      { status: 500 }
    );
  }
}
