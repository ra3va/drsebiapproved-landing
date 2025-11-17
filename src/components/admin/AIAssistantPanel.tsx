'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';

interface AIAssistantPanelProps {
  onTopicSelected?: (topic: string) => void;
}

export function AIAssistantPanel({ onTopicSelected }: AIAssistantPanelProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [mode, setMode] = useState<'suggest' | 'generate' | 'analyze'>('suggest');
  const { toast } = useToast();

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed right-0 top-1/2 -translate-y-1/2 bg-purple-600 text-white px-2 py-8 rounded-l-lg shadow-lg hover:bg-purple-700 transition-colors z-20"
      >
        <span className="writing-mode-vertical">🤖 AI Assistant</span>
      </button>
    );
  }

  return (
    <aside className="w-96 bg-gradient-to-b from-purple-50 to-blue-50 border-l overflow-y-auto">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <span>🤖</span>
            <span>AI Assistant</span>
          </h3>
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-500 hover:text-gray-700 text-xl"
          >
            ✕
          </button>
        </div>

        {/* Mode Selector */}
        <div className="flex gap-2 mb-6">
          <Button
            onClick={() => setMode('suggest')}
            variant={mode === 'suggest' ? 'default' : 'outline'}
            size="sm"
            className={mode === 'suggest' ? 'bg-purple-600' : ''}
          >
            Suggest
          </Button>
          <Button
            onClick={() => setMode('generate')}
            variant={mode === 'generate' ? 'default' : 'outline'}
            size="sm"
            className={mode === 'generate' ? 'bg-purple-600' : ''}
          >
            Generate
          </Button>
          <Button
            onClick={() => setMode('analyze')}
            variant={mode === 'analyze' ? 'default' : 'outline'}
            size="sm"
            className={mode === 'analyze' ? 'bg-purple-600' : ''}
          >
            Analyze
          </Button>
        </div>

        {/* Content Area */}
        {mode === 'suggest' && <TopicSuggester onTopicSelected={onTopicSelected} />}
        {mode === 'generate' && <BlogGenerator />}
        {mode === 'analyze' && <ContentAnalyzer />}
      </div>
    </aside>
  );
}

function TopicSuggester({ onTopicSelected }: { onTopicSelected?: (topic: string) => void }) {
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [contentGaps, setContentGaps] = useState<string[]>([]);
  const { toast } = useToast();

  const getSuggestions = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/suggest-topics');
      const data = await response.json();

      if (data.success) {
        // Parse suggestions if they're a string
        let parsedSuggestions = data.suggestions;
        if (typeof parsedSuggestions === 'string') {
          try {
            parsedSuggestions = JSON.parse(parsedSuggestions);
          } catch (e) {
            // If not JSON, create array from text
            parsedSuggestions = [{ title: parsedSuggestions, reason: 'AI suggestion' }];
          }
        }

        setSuggestions(Array.isArray(parsedSuggestions) ? parsedSuggestions : [parsedSuggestions]);
        setContentGaps(data.contentGaps || []);
        toast({
          title: 'Success',
          description: 'Topic suggestions generated'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to get suggestions',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={getSuggestions}
        disabled={loading}
        className="w-full bg-purple-600 hover:bg-purple-700"
      >
        {loading ? '⏳ Analyzing...' : '✨ Get Topic Suggestions'}
      </Button>

      {contentGaps.length > 0 && (
        <Card className="p-3 bg-white">
          <h4 className="font-semibold text-sm mb-2">Content Gaps</h4>
          <div className="flex flex-wrap gap-1">
            {contentGaps.map((gap) => (
              <span key={gap} className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                {gap}
              </span>
            ))}
          </div>
        </Card>
      )}

      {suggestions.length > 0 && (
        <div className="space-y-3">
          {suggestions.map((suggestion, i) => (
            <Card key={i} className="p-4 bg-white">
              <h4 className="font-semibold mb-1">{suggestion.title}</h4>
              <p className="text-sm text-gray-600 mb-2">{suggestion.reason}</p>
              {suggestion.keywords && (
                <div className="flex flex-wrap gap-1 mb-2">
                  {suggestion.keywords.map((kw: string) => (
                    <span key={kw} className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                      {kw}
                    </span>
                  ))}
                </div>
              )}
              {suggestion.estimatedVolume && (
                <p className="text-xs text-gray-500 mb-2">
                  ~{suggestion.estimatedVolume.toLocaleString()} searches/mo
                </p>
              )}
              <Button
                size="sm"
                className="w-full bg-purple-600 hover:bg-purple-700"
                onClick={() => onTopicSelected?.(suggestion.title)}
              >
                Generate This →
              </Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function BlogGenerator() {
  const [topic, setTopic] = useState('');
  const [keywords, setKeywords] = useState('');
  const [generating, setGenerating] = useState(false);
  const { toast } = useToast();

  const generate = async () => {
    if (!topic.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a topic',
        variant: 'destructive'
      });
      return;
    }

    setGenerating(true);
    try {
      const response = await fetch('/api/ai/generate-blog', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic,
          keywords: keywords.split(',').map(k => k.trim()).filter(k => k),
          targetLength: 1500
        })
      });

      const data = await response.json();
      if (data.success) {
        // Save as draft
        await fetch('/api/blog/save', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            slug: data.slug,
            content: data.content,
            isDraft: true
          })
        });

        toast({
          title: 'Success',
          description: `Blog post generated! Saved as draft: ${data.slug}`
        });

        // Reload page to show in editor
        window.location.reload();
      } else {
        throw new Error(data.error);
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to generate blog',
        variant: 'destructive'
      });
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Topic</label>
        <Input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="e.g., Parasite Prevention for Children"
          className="w-full"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Keywords (comma-separated)
        </label>
        <Input
          type="text"
          value={keywords}
          onChange={(e) => setKeywords(e.target.value)}
          placeholder="kids, parasites, prevention"
          className="w-full"
        />
      </div>

      <Button
        onClick={generate}
        disabled={!topic || generating}
        className="w-full bg-purple-600 hover:bg-purple-700"
      >
        {generating ? '✍️ Generating...' : '🚀 Generate Blog Post'}
      </Button>

      {generating && (
        <Card className="p-3 bg-blue-50">
          <p className="text-sm text-blue-700">
            AI is writing your blog post... This takes about 30-60 seconds.
          </p>
        </Card>
      )}
    </div>
  );
}

function ContentAnalyzer() {
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/analyze');
      const data = await response.json();

      if (data.success) {
        setAnalysis(data);
        toast({
          title: 'Success',
          description: 'Analysis complete'
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to analyze content',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <Button
        onClick={runAnalysis}
        disabled={loading}
        className="w-full bg-purple-600 hover:bg-purple-700"
      >
        {loading ? '📊 Analyzing...' : '📊 Analyze Content'}
      </Button>

      {analysis && (
        <>
          <Card className="p-4 bg-white">
            <h4 className="font-semibold mb-2">Content Health</h4>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total Posts</span>
                <span className="font-semibold">{analysis.registryStats?.totalPosts}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Total Words</span>
                <span className="font-semibold">
                  {analysis.registryStats?.totalWords.toLocaleString()}
                </span>
              </div>
            </div>
          </Card>

          {analysis.analysis && (
            <Card className="p-4 bg-white">
              <h4 className="font-semibold mb-2">AI Recommendations</h4>
              <div className="text-sm space-y-2">
                {analysis.analysis.contentStrategy && (
                  <p className="text-gray-700">{analysis.analysis.contentStrategy}</p>
                )}
                {analysis.analysis.seoPriorities && (
                  <div>
                    <p className="font-medium mb-1">SEO Priorities:</p>
                    <ul className="list-disc list-inside text-gray-600 space-y-1">
                      {analysis.analysis.seoPriorities.map((priority: string, i: number) => (
                        <li key={i}>{priority}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
