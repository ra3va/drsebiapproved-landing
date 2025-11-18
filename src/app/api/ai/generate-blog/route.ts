import { NextRequest, NextResponse } from 'next/server';
import { BlogContextEngine } from '@/lib/ai/blog-context-engine';
import { OpenRouterClient } from '@/lib/ai/openrouter-client';

export async function POST(req: NextRequest) {
  try {
    const { topic, keywords, targetLength = 1200 } = await req.json();

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    console.log(`🤖 Generating blog post about: ${topic}`);

    // Build optimized context
    const contextEngine = new BlogContextEngine();
    const context = await contextEngine.buildContext({
      task: 'generate',
      topic,
      maxPosts: 3 // Load max 3 related posts for context
    });

    console.log(`📊 Context built. Estimated tokens: ${context.estimatedTokens}`);

    // Generate with OpenRouter
    const client = new OpenRouterClient();
    const userPrompt = `
Write a comprehensive, engaging blog post about: ${topic}

${keywords && keywords.length > 0 ? `Target keywords: ${keywords.join(', ')}` : ''}
Target length: ${targetLength} words

Remember to:
- Make the title compelling and specific
- Include clear, scannable headings
- Add internal links to related posts (provided in context)
- Place <HiddenParasiteCTA variant="compact" /> after the introduction
- Create a helpful FAQ section
- Keep the tone conversational yet authoritative
- Include practical takeaways

Format the entire response as a complete MDX file with frontmatter, ready to save.
`;

    const response = await client.generateBlogPost(context, userPrompt);

    console.log(`✅ Blog generated. Tokens used: ${response.usage.totalTokens}`);

    // Generate slug from topic
    const slug = topic
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    return NextResponse.json({
      success: true,
      content: response.content,
      slug,
      estimatedTokens: context.estimatedTokens,
      actualTokens: response.usage.totalTokens,
      tokenSavings: `${Math.round((1 - context.estimatedTokens / 50000) * 100)}% vs loading all posts`,
      model: response.model,
      metadata: {
        topic,
        keywords,
        targetLength,
        relevantPostsUsed: context.relevantPosts?.length || 0
      }
    });

  } catch (error: any) {
    console.error('Generate blog error:', error);
    return NextResponse.json(
      { error: 'Failed to generate blog post', details: error.message },
      { status: 500 }
    );
  }
}
