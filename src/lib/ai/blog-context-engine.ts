import { loadBlogRegistry, BlogRegistry, BlogRegistryEntry } from './registry-generator';
import { getBlogPost } from '@/lib/blog';

export interface ContextOptions {
  task: 'generate' | 'optimize' | 'suggest' | 'analyze';
  topic?: string;
  targetSlug?: string;
  maxPosts?: number;
}

export interface BlogContext {
  registry: BlogRegistry;
  relevantPosts?: Array<{
    slug: string;
    title: string;
    content: string;
    relevance: string;
  }>;
  systemPrompt: string;
  estimatedTokens: number;
}

export class BlogContextEngine {
  private registry: BlogRegistry;

  constructor() {
    this.registry = loadBlogRegistry();
  }

  /**
   * Build optimized context for AI based on task
   * Only loads full content when necessary
   */
  async buildContext(options: ContextOptions): Promise<BlogContext> {
    const { task, topic, targetSlug, maxPosts = 3 } = options;

    let context: BlogContext = {
      registry: this.registry,
      systemPrompt: '',
      estimatedTokens: 0
    };

    // Base system prompt with brand voice
    const basePrompt = this.getBrandVoicePrompt();

    switch (task) {
      case 'suggest':
        // For topic suggestions, only need registry (no full content)
        context.systemPrompt = `${basePrompt}

You have access to our blog registry with ${this.registry.meta.totalPosts} posts.
Analyze content gaps and suggest 5 new blog topics that:
1. Fill identified gaps: ${this.registry.contentGaps.join(', ')}
2. Target SEO opportunities
3. Complement existing content
4. Match our brand voice

Current coverage by topic:
${Object.entries(this.registry.topicCoverage).slice(0, 10).map(([topic, posts]) =>
  `- ${topic}: ${posts.length} post(s)`
).join('\n')}

Provide your response as a JSON array with this structure:
[
  {
    "title": "Blog post title",
    "reason": "Why this topic fills a gap",
    "keywords": ["keyword1", "keyword2"],
    "estimatedVolume": 1500
  }
]`;
        context.estimatedTokens = 1000; // Registry only
        break;

      case 'generate':
        // For generation, load 2-3 similar posts for context
        if (topic) {
          const relevantPosts = await this.findRelevantPosts(topic, maxPosts);
          context.relevantPosts = relevantPosts;

          const relatedPostsList = relevantPosts.map((p, i) => {
            const registryEntry = this.registry.posts.find(rp => rp.slug === p.slug);
            return `${i + 1}. "${registryEntry?.title}" (/blog/${p.slug})
   Excerpt: ${registryEntry?.excerpt}
   Tags: ${registryEntry?.tags.join(', ')}`;
          }).join('\n\n');

          context.systemPrompt = `${basePrompt}

You are writing a new blog post about: "${topic}"

For context and internal linking, here are related existing posts:

${relatedPostsList}

Requirements:
1. Create complete MDX file with frontmatter in this exact format:
---
title: "Compelling title (under 60 characters)"
excerpt: "Meta description (under 160 characters)"
date: "${new Date().toISOString().split('T')[0]}"
category: "Education | Health | Methods | Research | Wellness"
image: "/images/blog/placeholder.jpg"
author:
  name: "Dr. Sebi Approved Team"
  image: "/images/team-logo.jpg"
  bio: "Continuing Dr. Sebi's Legacy of Natural Healing"
tags:
  - "Tag 1"
  - "Tag 2"
  - "Tag 3"
  - "Tag 4"
  - "Tag 5"
---

2. Include 3-5 internal links to related posts shown above
3. Add <HiddenParasiteCTA variant="compact" /> component after the introduction
4. Structure with clear H2/H3 headings (using ##, ###)
5. Include an FAQ section near the end
6. Add medical disclaimer in appropriate section
7. Target length: 1200-1500 words
8. Use conversational but authoritative tone
9. Include practical, actionable advice

Format the entire response as a complete MDX file ready to save.`;

          // Registry + 2-3 posts
          context.estimatedTokens = 1000 + (relevantPosts.length * 3000);
        }
        break;

      case 'optimize':
        // For optimization, only load target post
        if (targetSlug) {
          const post = await getBlogPost(targetSlug);
          if (post) {
            // Extract content from MDX source
            const contentStr = typeof post.content === 'string'
              ? post.content
              : JSON.stringify(post.content);

            context.relevantPosts = [{
              slug: targetSlug,
              title: post.title,
              content: contentStr,
              relevance: 'target post for optimization'
            }];

            const registryEntry = this.registry.posts.find(p => p.slug === targetSlug);

            const availableLinks = this.registry.posts
              .filter(p => p.slug !== targetSlug)
              .slice(0, 10)
              .map(p => `- "${p.title}" (/blog/${p.slug}) - Tags: ${p.tags.join(', ')}`)
              .join('\n');

            context.systemPrompt = `${basePrompt}

Optimize this blog post for SEO, readability, and engagement.

Current post stats:
- SEO Score: ${registryEntry?.seoScore}/100
- Internal Links: ${registryEntry?.internalLinks.length}
- Word Count: ${registryEntry?.wordCount}
- Has CTA: ${registryEntry?.hasCTA ? 'Yes' : 'No'}
- Category: ${registryEntry?.category}

Available posts for internal linking:
${availableLinks}

Optimization tasks:
1. Improve SEO (meta, headings, keywords)
2. Add 2-3 more internal links where relevant
3. Ensure HiddenParasiteCTA is present and well-placed
4. Improve readability and flow
5. Add/improve FAQ section if missing
6. Strengthen calls-to-action

Return the complete optimized MDX file with frontmatter.`;

            context.estimatedTokens = 1000 + 3000; // Registry + 1 post
          }
        }
        break;

      case 'analyze':
        // For analysis, only need registry (aggregate stats)
        const avgSEO = this.getAverageSEOScore();
        const topCategories = this.getTopCategories();
        const lowSEOPosts = this.registry.posts
          .filter(p => p.seoScore < 70)
          .map(p => `- "${p.title}" (Score: ${p.seoScore})`)
          .join('\n');

        context.systemPrompt = `${basePrompt}

Analyze our blog performance and provide strategic recommendations.

Current stats:
- Total posts: ${this.registry.meta.totalPosts}
- Total words: ${this.registry.meta.totalWords.toLocaleString()}
- Categories: ${this.registry.meta.categories.join(', ')}
- Average SEO score: ${avgSEO}/100
- Total unique tags: ${this.registry.meta.totalTags}

Top performing categories:
${topCategories}

Posts needing SEO improvement (score < 70):
${lowSEOPosts || 'None - all posts above 70!'}

Content gaps identified: ${this.registry.contentGaps.join(', ')}

SEO opportunities:
${this.registry.seoOpportunities.map(o => `- "${o.keyword}" (${o.volume} searches/month)`).join('\n')}

Provide analysis in JSON format:
{
  "contentStrategy": "Overall content strategy recommendation",
  "seoPriorities": ["Priority 1", "Priority 2", "Priority 3"],
  "linkingOpportunities": ["Opportunity 1", "Opportunity 2"],
  "nextTopics": ["Topic 1", "Topic 2", "Topic 3"],
  "strengths": ["Strength 1", "Strength 2"],
  "weaknesses": ["Weakness 1", "Weakness 2"]
}`;

        context.estimatedTokens = 1500; // Registry + analysis
        break;
    }

    return context;
  }

  /**
   * Find relevant posts without loading full content
   * Uses simple keyword matching (can upgrade to embeddings later)
   */
  private async findRelevantPosts(topic: string, limit: number): Promise<Array<{
    slug: string;
    title: string;
    content: string;
    relevance: string;
  }>> {
    const topicLower = topic.toLowerCase();
    const topicWords = topicLower.split(' ').filter(w => w.length > 3);

    // Score posts by relevance
    const scored = this.registry.posts.map(post => {
      let score = 0;

      // Title match (highest weight)
      topicWords.forEach(word => {
        if (post.title.toLowerCase().includes(word)) score += 10;
      });

      // Tag match
      post.tags.forEach(tag => {
        topicWords.forEach(word => {
          if (tag.toLowerCase().includes(word)) score += 5;
        });
      });

      // Excerpt match
      topicWords.forEach(word => {
        if (post.excerpt.toLowerCase().includes(word)) score += 3;
      });

      // Category match
      if (post.category.toLowerCase().includes(topicLower)) score += 2;

      return { post, score };
    });

    // Get top N relevant posts
    const topPosts = scored
      .filter(s => s.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    // If no matches, just get the 3 most recent posts
    const postsToLoad = topPosts.length > 0
      ? topPosts
      : this.registry.posts.slice(0, limit).map(post => ({ post, score: 0 }));

    // Load full content for these posts only
    const withContent = await Promise.all(
      postsToLoad.map(async ({ post, score }) => {
        try {
          const fullPost = await getBlogPost(post.slug);
          // We don't need the full content, just a snippet for context
          return {
            slug: post.slug,
            title: post.title,
            content: `Title: ${post.title}\nExcerpt: ${post.excerpt}\nTags: ${post.tags.join(', ')}\nCategory: ${post.category}`,
            relevance: score > 0
              ? `Score: ${score} (matched on: ${this.getMatchReason(post, topicLower)})`
              : 'Recent post for general context'
          };
        } catch (error) {
          console.error(`Error loading post ${post.slug}:`, error);
          return {
            slug: post.slug,
            title: post.title,
            content: `Title: ${post.title}\nExcerpt: ${post.excerpt}`,
            relevance: 'Metadata only'
          };
        }
      })
    );

    return withContent;
  }

  private getMatchReason(post: BlogRegistryEntry, topic: string): string {
    const reasons = [];
    if (post.title.toLowerCase().includes(topic)) reasons.push('title');
    if (post.tags.some(t => t.toLowerCase().includes(topic))) reasons.push('tags');
    if (post.excerpt.toLowerCase().includes(topic)) reasons.push('excerpt');
    return reasons.join(', ') || 'general';
  }

  private getBrandVoicePrompt(): string {
    return `You are a content creator for Dr. Sebi Approved, a premium wellness brand focused on natural parasite cleansing and holistic health.

Brand Voice & Style:
- Authoritative but accessible - balance expertise with readability
- Educational focus on natural healing and Dr. Sebi's methodology
- Empathetic to health struggles - acknowledge reader's concerns
- Evidence-based with holistic approach - cite facts, embrace whole-body wellness
- Always include appropriate health disclaimers

Writing Guidelines:
- Use "you" to address readers directly (conversational)
- Break complex topics into digestible sections with clear headings
- Include practical, actionable advice readers can implement
- Balance technical information with accessibility
- Use subheadings (H2, H3) for scannability
- Keep paragraphs short (2-4 sentences)
- Use bullet points and numbered lists for clarity
- Include specific examples and analogies
- End sections with clear takeaways

Content Structure:
- Engaging hook in first paragraph
- Clear problem/solution framework
- Educational middle sections
- FAQ section addressing common questions
- Strong CTA placement (after intro, at end)
- Medical disclaimer where appropriate

Health Compliance:
- Never make absolute medical claims
- Use phrases like "may help", "research suggests", "some people experience"
- Include disclaimer: "This information is educational. Consult a healthcare professional before starting any cleanse."
- Acknowledge that results vary by individual`;
  }

  private getAverageSEOScore(): number {
    if (this.registry.posts.length === 0) return 0;
    const total = this.registry.posts.reduce((sum, p) => sum + p.seoScore, 0);
    return Math.round(total / this.registry.posts.length);
  }

  private getTopCategories(): string {
    const counts: Record<string, number> = {};
    this.registry.posts.forEach(p => {
      counts[p.category] = (counts[p.category] || 0) + 1;
    });

    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([cat, count]) => `- ${cat}: ${count} posts`)
      .join('\n');
  }
}
