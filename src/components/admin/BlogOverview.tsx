'use client';

import { BlogRegistry } from '@/lib/ai/registry-generator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface BlogOverviewProps {
  registry: BlogRegistry | null;
  onRefresh: () => void;
}

export function BlogOverview({ registry, onRefresh }: BlogOverviewProps) {
  if (!registry) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  const avgSEO = Math.round(
    registry.posts.reduce((sum, p) => sum + p.seoScore, 0) / registry.posts.length
  );

  const categoryCounts = registry.posts.reduce((acc, post) => {
    acc[post.category] = (acc[post.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="h-full overflow-y-auto p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Content Overview</h2>
          <Button onClick={onRefresh} variant="outline">
            🔄 Refresh
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-500">Total Posts</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{registry.meta.totalPosts}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-500">Total Words</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{registry.meta.totalWords.toLocaleString()}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-500">Avg SEO Score</CardTitle>
            </CardHeader>
            <CardContent>
              <p className={`text-3xl font-bold ${
                avgSEO >= 80 ? 'text-green-600' :
                avgSEO >= 60 ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {avgSEO}/100
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-500">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{registry.meta.categories.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Category Breakdown */}
        <Card>
          <CardHeader>
            <CardTitle>Posts by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(categoryCounts).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="font-medium">{category}</span>
                  <span className="text-gray-500">{count} posts</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Content Gaps */}
        {registry.contentGaps.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Content Gaps</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 mb-3">
                Topics not yet covered in your blog:
              </p>
              <div className="flex flex-wrap gap-2">
                {registry.contentGaps.map((gap) => (
                  <span
                    key={gap}
                    className="px-3 py-1 bg-red-100 text-red-700 text-sm rounded-full"
                  >
                    {gap}
                  </span>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* SEO Opportunities */}
        <Card>
          <CardHeader>
            <CardTitle>SEO Opportunities</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-3">
              High-volume keywords to target:
            </p>
            <div className="space-y-2">
              {registry.seoOpportunities.map((opp) => (
                <div key={opp.keyword} className="flex items-center justify-between">
                  <span className="font-medium">{opp.keyword}</span>
                  <span className="text-sm text-gray-500">{opp.volume.toLocaleString()} searches/mo</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Low SEO Posts */}
        {registry.posts.filter(p => p.seoScore < 70).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Posts Needing SEO Improvement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {registry.posts
                  .filter(p => p.seoScore < 70)
                  .map((post) => (
                    <div key={post.slug} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <span className="font-medium text-sm">{post.title}</span>
                      <span className="text-sm text-red-600">Score: {post.seoScore}</span>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
