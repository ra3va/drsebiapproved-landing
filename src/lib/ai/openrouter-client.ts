import { BlogContext } from './blog-context-engine';

export interface OpenRouterMessage {
  role: 'system' | 'user' | 'assistant';
  content: string;
}

export interface OpenRouterResponse {
  content: string;
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  model: string;
}

export class OpenRouterClient {
  private apiKey: string;
  private baseURL = 'https://openrouter.ai/api/v1';

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.OPENROUTER_API_KEY || '';
    if (!this.apiKey) {
      throw new Error('OpenRouter API key not configured. Set OPENROUTER_API_KEY in environment.');
    }
  }

  /**
   * Generate blog content with optimized context
   */
  async generateBlogPost(context: BlogContext, userPrompt: string): Promise<OpenRouterResponse> {
    const messages: OpenRouterMessage[] = [
      {
        role: 'system',
        content: context.systemPrompt
      },
      {
        role: 'user',
        content: userPrompt
      }
    ];

    // Add relevant post content as context if available
    if (context.relevantPosts && context.relevantPosts.length > 0) {
      const contextMessage = `
For reference, here are related posts for context and internal linking:

${context.relevantPosts.map((p, i) => `
=== RELATED POST ${i + 1}: ${p.title} ===
${p.content}
Relevance: ${p.relevance}
`).join('\n\n')}

Use these posts to:
1. Add relevant internal links in your content
2. Ensure your post complements (not duplicates) existing content
3. Maintain consistent brand voice and style
`;

      messages.push({
        role: 'user',
        content: contextMessage
      });
    }

    return this.chat(messages, 'anthropic/claude-3.5-sonnet', 4000);
  }

  /**
   * Generic chat completion with retry logic
   */
  async chat(
    messages: OpenRouterMessage[],
    model: string = 'anthropic/claude-3.5-sonnet',
    maxTokens: number = 4000,
    retries: number = 3
  ): Promise<OpenRouterResponse> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < retries; attempt++) {
      try {
        const response = await fetch(`${this.baseURL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': process.env.NEXT_PUBLIC_SITE_URL || 'https://drsebiapproved.com',
            'X-Title': 'Dr. Sebi Approved Blog CMS'
          },
          body: JSON.stringify({
            model,
            messages,
            max_tokens: maxTokens,
            temperature: 0.7
          })
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(`OpenRouter API error: ${JSON.stringify(error)}`);
        }

        const data = await response.json();

        return {
          content: data.choices[0].message.content,
          usage: {
            promptTokens: data.usage?.prompt_tokens || 0,
            completionTokens: data.usage?.completion_tokens || 0,
            totalTokens: data.usage?.total_tokens || 0
          },
          model: data.model
        };
      } catch (error: any) {
        lastError = error;
        console.error(`OpenRouter attempt ${attempt + 1} failed:`, error.message);

        // Wait before retry (exponential backoff)
        if (attempt < retries - 1) {
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }

    throw lastError || new Error('OpenRouter request failed after retries');
  }

  /**
   * Quick suggestions using cheaper model
   */
  async quickSuggest(prompt: string): Promise<OpenRouterResponse> {
    return this.chat(
      [
        {
          role: 'user',
          content: prompt
        }
      ],
      'anthropic/claude-3-haiku', // Cheaper for quick tasks
      1000
    );
  }
}
