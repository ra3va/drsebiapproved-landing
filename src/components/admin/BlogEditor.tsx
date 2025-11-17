'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';

// Dynamically import Monaco editor to avoid SSR issues
const Editor = dynamic(() => import('@monaco-editor/react'), { ssr: false });

interface BlogEditorProps {
  slug: string | null;
  onSaved: () => void;
  onCancel: () => void;
}

export function BlogEditor({ slug, onSaved, onCancel }: BlogEditorProps) {
  const [content, setContent] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const [optimizing, setOptimizing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (slug) {
      loadBlogPost(slug);
    } else {
      // New post template
      setContent(getNewPostTemplate());
    }
  }, [slug]);

  const loadBlogPost = async (slug: string) => {
    try {
      const response = await fetch(`/api/blog/load/${slug}`);
      const data = await response.json();
      if (data.success) {
        setContent(data.content);
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load blog post',
        variant: 'destructive'
      });
    }
  };

  const getNewPostTemplate = () => {
    const today = new Date().toISOString().split('T')[0];
    return `---
title: "Your Blog Post Title"
excerpt: "A compelling meta description under 160 characters"
date: "${today}"
category: "Education"
image: "/images/blog/placeholder.jpg"
author:
  name: "Dr. Sebi Approved Team"
  image: "/images/team-logo.jpg"
  bio: "Continuing Dr. Sebi's Legacy of Natural Healing"
tags:
  - "Tag 1"
  - "Tag 2"
  - "Tag 3"
---

# Your Blog Post Title

Your engaging introduction goes here. Hook the reader immediately!

<HiddenParasiteCTA variant="compact" />

## Main Section 1

Your content here...

## Main Section 2

More great content...

## Frequently Asked Questions

**Q: Question here?**
A: Answer here.

**Q: Another question?**
A: Another answer.

## Conclusion

Wrap it up with a strong conclusion and call to action.
`;
  };

  const saveDraft = async () => {
    if (!content.trim()) {
      toast({
        title: 'Error',
        description: 'Content cannot be empty',
        variant: 'destructive'
      });
      return;
    }

    setSaving(true);
    try {
      const postSlug = slug || extractSlugFromContent(content);
      const response = await fetch('/api/blog/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: postSlug,
          content,
          isDraft: true
        })
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: 'Success',
          description: 'Draft saved successfully'
        });
        onSaved();
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save draft',
        variant: 'destructive'
      });
    } finally {
      setSaving(false);
    }
  };

  const publish = async () => {
    if (!content.trim()) {
      toast({
        title: 'Error',
        description: 'Content cannot be empty',
        variant: 'destructive'
      });
      return;
    }

    setPublishing(true);
    try {
      const postSlug = slug || extractSlugFromContent(content);
      const response = await fetch('/api/blog/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: postSlug,
          content,
          commitToGit: true
        })
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: 'Success',
          description: data.gitCommitted
            ? 'Blog published and pushed to GitHub!'
            : 'Blog published (git push failed - check logs)'
        });
        onSaved();
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to publish',
        variant: 'destructive'
      });
    } finally {
      setPublishing(false);
    }
  };

  const optimizeWithAI = async () => {
    if (!slug) {
      toast({
        title: 'Error',
        description: 'Save the post first before optimizing',
        variant: 'destructive'
      });
      return;
    }

    setOptimizing(true);
    try {
      const response = await fetch('/api/ai/optimize-blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slug, content })
      });

      const data = await response.json();
      if (data.success) {
        setContent(data.optimizedContent);
        toast({
          title: 'Success',
          description: 'Content optimized by AI'
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to optimize',
        variant: 'destructive'
      });
    } finally {
      setOptimizing(false);
    }
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/blog/upload-image', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        // Insert image markdown at cursor
        const imageMarkdown = `\n![Alt text](${data.url})\n`;
        setContent(content + imageMarkdown);
        toast({
          title: 'Success',
          description: 'Image uploaded successfully'
        });
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to upload image',
        variant: 'destructive'
      });
    }
  };

  const extractSlugFromContent = (content: string): string => {
    const titleMatch = content.match(/title:\s*["'](.+?)["']/);
    if (titleMatch) {
      return titleMatch[1]
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }
    return `post-${Date.now()}`;
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Toolbar */}
      <div className="border-b px-6 py-3 flex items-center justify-between bg-gray-50">
        <div className="flex items-center gap-4">
          <h2 className="font-semibold text-gray-900">
            {slug ? `Editing: ${slug}` : 'New Post'}
          </h2>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showPreview}
              onChange={(e) => setShowPreview(e.target.checked)}
              className="rounded"
            />
            <span>Split Preview</span>
          </label>
        </div>

        <div className="flex gap-2">
          {/* Image Upload */}
          <label className="cursor-pointer">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && uploadImage(e.target.files[0])}
              className="hidden"
            />
            <Button variant="outline" size="sm" asChild>
              <span>📸 Upload Image</span>
            </Button>
          </label>

          {/* AI Optimize */}
          <Button
            onClick={optimizeWithAI}
            disabled={optimizing}
            variant="outline"
            size="sm"
          >
            {optimizing ? '✨ Optimizing...' : '✨ AI Optimize'}
          </Button>

          {/* Cancel */}
          <Button onClick={onCancel} variant="outline" size="sm">
            Cancel
          </Button>

          {/* Save Draft */}
          <Button
            onClick={saveDraft}
            disabled={saving}
            variant="outline"
            size="sm"
          >
            {saving ? '💾 Saving...' : '💾 Save Draft'}
          </Button>

          {/* Publish */}
          <Button
            onClick={publish}
            disabled={publishing}
            className="bg-green-600 hover:bg-green-700 text-white"
            size="sm"
          >
            {publishing ? '🚀 Publishing...' : '🚀 Publish'}
          </Button>
        </div>
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Monaco Editor */}
        <div className={showPreview ? 'w-1/2 border-r' : 'w-full'}>
          <Editor
            height="100%"
            defaultLanguage="markdown"
            value={content}
            onChange={(value) => setContent(value || '')}
            theme="vs-light"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: 'on',
              wordWrap: 'on',
              padding: { top: 20, bottom: 20 },
              scrollBeyondLastLine: false,
              automaticLayout: true
            }}
          />
        </div>

        {/* Live Preview */}
        {showPreview && (
          <div className="w-1/2 overflow-y-auto bg-white p-8">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-sm font-semibold text-gray-500 mb-4 uppercase">Preview</h3>
              <Card className="p-6">
                <div className="prose prose-lg max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: renderMarkdownPreview(content) }} />
                </div>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Simple markdown preview renderer
function renderMarkdownPreview(markdown: string): string {
  // Remove frontmatter
  const withoutFrontmatter = markdown.replace(/^---[\s\S]*?---\n/, '');

  // Convert headings
  let html = withoutFrontmatter
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" />')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2">$1</a>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/<HiddenParasiteCTA.*?\/>/g, '<div class="bg-blue-50 p-4 rounded">CTA Component</div>');

  return `<p>${html}</p>`;
}
