import { NextResponse } from 'next/server';
import { BlogContextEngine } from '@/lib/ai/blog-context-engine';
import { OpenRouterClient } from '@/lib/ai/openrouter-client';

export async function GET() {
  try {
    console.log('🤖 Generating topic suggestions...');

    const contextEngine = new BlogContextEngine();
    const context = await contextEngine.buildContext({
      task: 'suggest'
    });

    const client = new OpenRouterClient();
    const response = await client.chat([
      {
        role: 'system',
        content: context.systemPrompt
      },
      {
        role: 'user',
        content: 'Based on our blog registry, suggest 5 high-value blog topics we should write next. Provide your response as a JSON array.'
      }
    ], 'anthropic/claude-3.5-sonnet');

    console.log('✅ Topics suggested');

    // Try to parse as JSON, fallback to text
    let suggestions;
    try {
      suggestions = JSON.parse(response.content);
    } catch (e) {
      suggestions = response.content;
    }

    return NextResponse.json({
      success: true,
      suggestions,
      tokenUsage: response.usage,
      contentGaps: context.registry.contentGaps,
      seoOpportunities: context.registry.seoOpportunities,
      currentStats: {
        totalPosts: context.registry.meta.totalPosts,
        categories: context.registry.meta.categories
      }
    });

  } catch (error: any) {
    console.error('Suggest topics error:', error);
    return NextResponse.json(
      { error: 'Failed to generate topic suggestions', details: error.message },
      { status: 500 }
    );
  }
}
