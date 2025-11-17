import { NextRequest, NextResponse } from 'next/server';
import { BlogContextEngine } from '@/lib/ai/blog-context-engine';
import { OpenRouterClient } from '@/lib/ai/openrouter-client';

export async function POST(req: NextRequest) {
  try {
    const { slug, content } = await req.json();

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      );
    }

    console.log(`🤖 Optimizing blog post: ${slug}`);

    // Build optimization context
    const contextEngine = new BlogContextEngine();
    const context = await contextEngine.buildContext({
      task: 'optimize',
      targetSlug: slug
    });

    // Generate optimization
    const client = new OpenRouterClient();
    const userPrompt = content
      ? `Optimize this blog post content:\n\n${content}`
      : `Optimize the blog post "${slug}" based on the context provided.`;

    const response = await client.generateBlogPost(context, userPrompt);

    console.log(`✅ Blog optimized. Tokens used: ${response.usage.totalTokens}`);

    return NextResponse.json({
      success: true,
      optimizedContent: response.content,
      tokenUsage: response.usage,
      model: response.model
    });

  } catch (error: any) {
    console.error('Optimize blog error:', error);
    return NextResponse.json(
      { error: 'Failed to optimize blog post', details: error.message },
      { status: 500 }
    );
  }
}
