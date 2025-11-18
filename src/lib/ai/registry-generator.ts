import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';

export interface BlogRegistryEntry {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  tags: string[];
  author: string;
  readTime: string;
  wordCount: number;
  filePath: string;
  internalLinks: string[];
  hasCTA: boolean;
  seoScore: number;
  isDraft?: boolean;
}

export interface BlogRegistry {
  meta: {
    totalPosts: number;
    lastUpdated: string;
    totalWords: number;
    categories: string[];
    totalTags: number;
  };
  posts: BlogRegistryEntry[];
  topicCoverage: Record<string, string[]>;
  contentGaps: string[];
  seoOpportunities: Array<{keyword: string; volume: number}>;
}

const BLOG_DIR = path.join(process.cwd(), 'content/blog');
const REGISTRY_PATH = path.join(process.cwd(), 'src/data/blog-registry.json');

export async function generateBlogRegistry(): Promise<BlogRegistry> {
  console.log('🔄 Generating blog registry...');

  // Ensure directories exist
  const dataDir = path.dirname(REGISTRY_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  if (!fs.existsSync(BLOG_DIR)) {
    console.warn('⚠️  Blog directory not found, creating empty registry');
    const emptyRegistry: BlogRegistry = {
      meta: {
        totalPosts: 0,
        lastUpdated: new Date().toISOString(),
        totalWords: 0,
        categories: [],
        totalTags: 0
      },
      posts: [],
      topicCoverage: {},
      contentGaps: [],
      seoOpportunities: []
    };
    fs.writeFileSync(REGISTRY_PATH, JSON.stringify(emptyRegistry, null, 2));
    return emptyRegistry;
  }

  // Read all blog files
  const files = fs.readdirSync(BLOG_DIR).filter(f => f.endsWith('.mdx'));

  const posts: BlogRegistryEntry[] = files.map(file => {
    const filePath = path.join(BLOG_DIR, file);
    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);
    const stats = readingTime(content);

    // Extract internal links
    const internalLinkMatches = content.matchAll(/\[.*?\]\((\/blog\/[^)]+)\)/g);
    const internalLinks = [...internalLinkMatches].map(match => match[1]);

    // Check for CTAs
    const hasCTA = content.includes('HiddenParasiteCTA') ||
                   content.includes('LeadMagnet');

    // Calculate SEO score
    const seoScore = calculateSEOScore(data, content);

    return {
      slug: file.replace('.mdx', ''),
      title: data.title || 'Untitled',
      excerpt: data.excerpt || '',
      date: data.date || new Date().toISOString(),
      category: data.category || 'Uncategorized',
      tags: data.tags || [],
      author: data.author?.name || 'Dr. Sebi Approved Team',
      readTime: `${Math.ceil(stats.minutes)} min read`,
      wordCount: stats.words,
      filePath: `content/blog/${file}`,
      internalLinks: [...new Set(internalLinks)],
      hasCTA,
      seoScore,
      isDraft: data.draft || false
    };
  });

  // Filter out drafts for public posts, sort by date
  const publishedPosts = posts.filter(p => !p.isDraft);
  publishedPosts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  // Generate topic coverage map
  const topicCoverage: Record<string, string[]> = {};
  publishedPosts.forEach(post => {
    post.tags.forEach(tag => {
      if (!topicCoverage[tag]) topicCoverage[tag] = [];
      topicCoverage[tag].push(post.slug);
    });
  });

  // Identify content gaps
  const contentGaps = identifyContentGaps(publishedPosts);

  // SEO opportunities (can integrate real keyword data later)
  const seoOpportunities = [
    { keyword: 'parasite cleanse diet', volume: 2400 },
    { keyword: 'natural dewormer', volume: 1800 },
    { keyword: 'biofilm disruptors', volume: 1200 },
    { keyword: 'parasite symptoms', volume: 3200 },
    { keyword: 'gut health parasites', volume: 1500 }
  ];

  const registry: BlogRegistry = {
    meta: {
      totalPosts: publishedPosts.length,
      lastUpdated: new Date().toISOString(),
      totalWords: publishedPosts.reduce((sum, p) => sum + p.wordCount, 0),
      categories: [...new Set(publishedPosts.map(p => p.category))],
      totalTags: [...new Set(publishedPosts.flatMap(p => p.tags))].length
    },
    posts: publishedPosts,
    topicCoverage,
    contentGaps,
    seoOpportunities
  };

  // Write to file
  fs.writeFileSync(REGISTRY_PATH, JSON.stringify(registry, null, 2));

  console.log(`✅ Blog registry generated: ${publishedPosts.length} posts indexed`);

  return registry;
}

function calculateSEOScore(frontmatter: any, content: string): number {
  let score = 50;

  // Title optimization (under 60 chars)
  if (frontmatter.title && frontmatter.title.length > 0 && frontmatter.title.length < 60) {
    score += 10;
  }

  // Meta description (under 160 chars)
  if (frontmatter.excerpt && frontmatter.excerpt.length > 0 && frontmatter.excerpt.length < 160) {
    score += 10;
  }

  // Tags (3+ tags)
  if (frontmatter.tags && frontmatter.tags.length >= 3) {
    score += 10;
  }

  // Headings present
  if (content.includes('##')) {
    score += 5;
  }

  // Internal links (2+ links)
  const internalLinks = content.match(/\[.*?\]\(\/blog\/[^)]+\)/g);
  if (internalLinks && internalLinks.length >= 2) {
    score += 10;
  }

  // Content length (1000+ chars)
  if (content.length > 1000) {
    score += 5;
  }

  // Has images
  if (content.includes('![') || content.includes('<Image')) {
    score += 5;
  }

  // Has FAQ section
  if (content.toLowerCase().includes('faq') || content.toLowerCase().includes('frequently asked')) {
    score += 5;
  }

  return Math.min(score, 100);
}

function identifyContentGaps(posts: BlogRegistryEntry[]): string[] {
  const coveredKeywords = new Set(
    posts.flatMap(p =>
      [...p.title.toLowerCase().split(' '), ...p.tags.map(t => t.toLowerCase())]
    )
  );

  const desiredTopics = [
    'prevention', 'testing', 'children', 'pregnancy',
    'diet', 'recipes', 'supplements', 'herbs', 'dosage',
    'side effects', 'testimonials', 'science', 'research',
    'pets', 'travel', 'water', 'food safety'
  ];

  return desiredTopics.filter(topic => !coveredKeywords.has(topic));
}

// Helper to load registry
export function loadBlogRegistry(): BlogRegistry {
  if (!fs.existsSync(REGISTRY_PATH)) {
    throw new Error('Blog registry not found. Run generateBlogRegistry() first.');
  }

  return JSON.parse(fs.readFileSync(REGISTRY_PATH, 'utf8'));
}

// Helper to get a single post from registry
export function getPostFromRegistry(slug: string): BlogRegistryEntry | undefined {
  const registry = loadBlogRegistry();
  return registry.posts.find(p => p.slug === slug);
}
