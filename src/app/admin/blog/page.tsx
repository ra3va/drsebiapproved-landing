'use client';

import { useState, useEffect } from 'react';
import { BlogRegistry } from '@/lib/ai/registry-generator';
import { BlogListSidebar } from '@/components/admin/BlogListSidebar';
import { BlogEditor } from '@/components/admin/BlogEditor';
import { BlogOverview } from '@/components/admin/BlogOverview';
import { AIAssistantPanel } from '@/components/admin/AIAssistantPanel';
import { Button } from '@/components/ui/button';

export default function BlogCMSDashboard() {
  const [view, setView] = useState<'list' | 'edit' | 'create'>('list');
  const [registry, setRegistry] = useState<BlogRegistry | null>(null);
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRegistry();
  }, []);

  const loadRegistry = async () => {
    try {
      const response = await fetch('/api/ai/registry');
      const data = await response.json();
      setRegistry(data);
    } catch (error) {
      console.error('Failed to load registry:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPost = (slug: string) => {
    setSelectedSlug(slug);
    setView('edit');
  };

  const handleCreateNew = (mode: 'manual' | 'ai') => {
    setSelectedSlug(null);
    setView('create');
  };

  const handlePostSaved = () => {
    loadRegistry();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white border-b px-6 py-4 sticky top-0 z-10 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-gray-900">Blog CMS</h1>
            {registry && (
              <span className="text-sm text-gray-500">
                {registry.meta.totalPosts} posts • {registry.meta.totalWords.toLocaleString()} words
              </span>
            )}
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => handleCreateNew('ai')}
              className="bg-purple-600 hover:bg-purple-700 text-white"
            >
              ✨ AI Generate Post
            </Button>
            <Button
              onClick={() => handleCreateNew('manual')}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              ✍️ Write Manually
            </Button>
          </div>
        </div>
      </header>

      <div className="flex h-[calc(100vh-73px)]">
        {/* Sidebar - Blog List */}
        <aside className="w-80 bg-white border-r overflow-y-auto">
          {loading ? (
            <div className="p-6 text-center text-gray-500">Loading...</div>
          ) : (
            <BlogListSidebar
              registry={registry}
              selectedSlug={selectedSlug}
              onSelect={handleSelectPost}
            />
          )}
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-hidden">
          {view === 'list' && <BlogOverview registry={registry} onRefresh={loadRegistry} />}
          {(view === 'edit' || view === 'create') && (
            <BlogEditor
              slug={selectedSlug}
              onSaved={handlePostSaved}
              onCancel={() => {
                setView('list');
                setSelectedSlug(null);
              }}
            />
          )}
        </main>

        {/* AI Assistant Panel (Collapsible) */}
        <AIAssistantPanel onTopicSelected={(topic) => {
          // Handle AI-generated topic selection
          console.log('Selected topic:', topic);
        }} />
      </div>
    </div>
  );
}
