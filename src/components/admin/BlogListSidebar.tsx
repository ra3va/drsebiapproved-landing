'use client';

import { BlogRegistry } from '@/lib/ai/registry-generator';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface BlogListSidebarProps {
  registry: BlogRegistry | null;
  selectedSlug: string | null;
  onSelect: (slug: string) => void;
}

export function BlogListSidebar({ registry, selectedSlug, onSelect }: BlogListSidebarProps) {
  if (!registry) {
    return (
      <div className="p-6">
        <p className="text-gray-500">No posts found</p>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-500 uppercase">All Posts</h3>
        <p className="text-xs text-gray-400 mt-1">{registry.posts.length} published</p>
      </div>

      <div className="space-y-2">
        {registry.posts.map((post) => (
          <button
            key={post.slug}
            onClick={() => onSelect(post.slug)}
            className={`w-full text-left p-3 rounded-lg transition-colors ${
              selectedSlug === post.slug
                ? 'bg-blue-50 border-2 border-blue-500'
                : 'bg-white border border-gray-200 hover:border-gray-300'
            }`}
          >
            <h4 className="font-semibold text-sm text-gray-900 line-clamp-2 mb-1">
              {post.title}
            </h4>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="text-xs">
                {post.category}
              </Badge>
              <span className="text-xs text-gray-500">{post.readTime}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">{post.date}</span>
              <div className="flex items-center gap-1">
                {post.hasCTA && (
                  <span className="text-xs text-green-600" title="Has CTA">✓</span>
                )}
                <span className={`text-xs ${
                  post.seoScore >= 80 ? 'text-green-600' :
                  post.seoScore >= 60 ? 'text-yellow-600' : 'text-red-600'
                }`} title={`SEO Score: ${post.seoScore}`}>
                  {post.seoScore}
                </span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
