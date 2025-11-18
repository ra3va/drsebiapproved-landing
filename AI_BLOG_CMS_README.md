# AI-Powered Blog CMS

## Overview

This is a custom-built, AI-powered Content Management System for the Dr. Sebi Approved blog. It features intelligent content generation, optimization, and management powered by OpenRouter AI.

## Key Features

### 🤖 AI-Powered Content Creation
- **Topic Suggestions**: AI analyzes content gaps and suggests high-value blog topics
- **Auto-Generation**: Generate complete blog posts from a topic in 30-60 seconds
- **Content Optimization**: Improve SEO, readability, and engagement with one click
- **Brand Voice Consistency**: AI trained on your existing content to match tone

### 📝 Manual Editing
- **Monaco Editor**: Professional code editor with MDX syntax highlighting
- **Live Preview**: Split-view preview of rendered content
- **Image Upload**: Drag-and-drop image uploads to `/public/images/blog/`
- **Draft System**: Save drafts in `content/drafts/` before publishing

### 🚀 Smart Context Engine
- **No RAG Bloat**: Lightweight registry system (not a heavy vector database)
- **Dynamic Loading**: Only loads relevant blog posts when needed
- **Token Optimization**: Uses ~90% fewer tokens than loading all content
- **Scales Efficiently**: Works for 6 posts or 600 posts

### 📊 Content Analytics
- **SEO Scoring**: Automatic SEO analysis for every post
- **Content Gaps**: AI identifies missing topics in your content strategy
- **Performance Tracking**: Monitor which topics perform best
- **Category Insights**: See content distribution across categories

### 🔄 Git Integration
- **Auto-Commit**: Publishes automatically commit to GitHub
- **Auto-Push**: Changes sync to Render.com automatically
- **Retry Logic**: Exponential backoff for network resilience
- **Branch Safety**: Ensures proper branch naming conventions

## Architecture

### File Structure
```
src/
├── lib/ai/
│   ├── registry-generator.ts    # Blog metadata index
│   ├── blog-context-engine.ts   # Smart context builder
│   ├── openrouter-client.ts     # AI API wrapper
│   ├── git-helper.ts            # Auto-commit functionality
│   └── scripts/
│       └── generate-registry-script.ts
├── app/
│   ├── admin/blog/              # CMS dashboard
│   └── api/
│       ├── ai/                  # AI endpoints
│       │   ├── generate-blog/
│       │   ├── suggest-topics/
│       │   ├── optimize-blog/
│       │   ├── analyze/
│       │   └── registry/
│       └── blog/                # Blog management
│           ├── save/
│           ├── publish/
│           ├── load/
│           └── upload-image/
├── components/admin/
│   ├── BlogEditor.tsx           # Monaco editor
│   ├── BlogListSidebar.tsx      # Post list
│   ├── BlogOverview.tsx         # Analytics dashboard
│   └── AIAssistantPanel.tsx     # AI helper panel
└── data/
    └── blog-registry.json       # Auto-generated index

content/
├── blog/                        # Published posts
└── drafts/                      # Draft posts
```

### How It Works

1. **Registry System** (Not RAG)
   - Generates lightweight JSON index of all blog metadata
   - Stores title, excerpt, tags, SEO score, word count, etc.
   - Only ~500-1000 tokens vs 50K+ for loading all posts
   - Regenerates automatically on publish

2. **Context-Aware AI**
   - Analyzes topic and finds 2-3 most relevant existing posts
   - Loads only those posts for context (not all 6+)
   - Builds optimized prompt with brand voice guidelines
   - Generates content via OpenRouter (Claude 3.5 Sonnet)

3. **Smart Publishing**
   - Saves drafts to `content/drafts/` for review
   - Publishes to `content/blog/` and deletes draft
   - Auto-regenerates registry
   - Commits and pushes to GitHub
   - Render.com auto-deploys

## Setup

### 1. Install Dependencies
```bash
npm install
```

New dependencies added:
- `@monaco-editor/react` - Code editor
- `tsx` - TypeScript script runner

### 2. Set Environment Variables
```env
# Required for AI features
OPENROUTER_API_KEY=your_openrouter_api_key

# Optional (for site URL in OpenRouter requests)
NEXT_PUBLIC_SITE_URL=https://drsebiapproved.com
```

### 3. Generate Initial Registry
```bash
npm run generate-registry
```

This creates `src/data/blog-registry.json` from existing blog posts.

### 4. Start Development Server
```bash
npm run cms
# Or: npm run dev
```

### 5. Access CMS
Navigate to: `http://localhost:3000/admin/blog`

## Usage

### Generating a Blog Post

1. **Via AI Assistant**:
   - Click "AI Generate Post" or open AI Assistant panel
   - Select "Generate" tab
   - Enter topic and keywords
   - Click "Generate Blog Post"
   - AI writes complete MDX file in 30-60 seconds
   - Review and edit in Monaco editor
   - Publish when ready

2. **Via Topic Suggestions**:
   - Open AI Assistant panel
   - Select "Suggest" tab
   - Click "Get Topic Suggestions"
   - AI analyzes content gaps
   - Click "Generate This" on any suggestion

### Manual Writing

1. Click "Write Manually"
2. Edit MDX in Monaco editor
3. Use live preview to see rendered output
4. Upload images as needed
5. Save as draft or publish directly

### Optimizing Existing Content

1. Select post from sidebar
2. Click "AI Optimize" button
3. AI improves SEO, adds internal links, enhances readability
4. Review changes
5. Save or publish

### Publishing Workflow

1. **Save Draft**: Saves to `content/drafts/` (not committed)
2. **Publish**:
   - Moves to `content/blog/`
   - Regenerates registry
   - Commits to GitHub
   - Pushes to origin
   - Render.com deploys automatically

## API Endpoints

### AI Endpoints

**POST `/api/ai/generate-blog`**
```json
{
  "topic": "Parasite Prevention for Children",
  "keywords": ["kids", "parasites", "prevention"],
  "targetLength": 1500
}
```

**GET `/api/ai/suggest-topics`**
Returns AI-generated topic suggestions based on content gaps.

**POST `/api/ai/optimize-blog`**
```json
{
  "slug": "understanding-biofilms",
  "content": "..."
}
```

**GET `/api/ai/analyze`**
Returns comprehensive content strategy analysis.

**GET `/api/ai/registry`**
Returns blog registry JSON.

### Blog Management Endpoints

**POST `/api/blog/save`**
Save draft or published post.

**POST `/api/blog/publish`**
Publish post with git auto-commit.

**GET `/api/blog/load/[slug]`**
Load blog post content.

**POST `/api/blog/upload-image`**
Upload image to `/public/images/blog/`.

**POST `/api/blog/regenerate-registry`**
Manually regenerate registry.

## Cost Analysis

### OpenRouter Pricing
- **Claude 3.5 Sonnet**: $3/1M input, $15/1M output
- **Average blog post**: ~8K input + 4K output = $0.08
- **Monthly estimate** (10 posts + optimization): **$5-15**

### Token Savings
- **Without registry**: 50K+ tokens per generation
- **With registry**: 8K tokens per generation
- **Savings**: 84%+ reduction

## Git Workflow

### Auto-Commit Behavior
- Commits to current branch (must start with `claude/`)
- Retries push up to 4 times with exponential backoff (2s, 4s, 8s, 16s)
- Fails safely if push rejected (403 errors)
- Updates registry in same commit

### Manual Git Operations
All standard git commands work as expected. The CMS commits are labeled:
```
📝 Publish blog post: {slug}
```

## Troubleshooting

### Registry Not Found
```bash
npm run generate-registry
```

### Build Fails
Make sure registry exists before building:
```bash
npm run build
```

### AI Features Not Working
1. Check `OPENROUTER_API_KEY` is set
2. Verify API key is valid
3. Check browser console for errors
4. Ensure network connectivity

### Git Push Fails
- Verify branch name starts with `claude/`
- Check GitHub credentials
- Ensure remote repository is accessible
- Review Render.com git integration

## Development Notes

### No RAG Database Required
This system intentionally avoids RAG (Retrieval-Augmented Generation) complexity:
- No vector database needed
- No embedding API calls
- No chunking algorithms
- Just a simple JSON registry

For 6-100 posts, this is perfect. If you reach 500+ posts, consider:
- Adding semantic search with embeddings
- Implementing proper vector store
- But for now, KISS (Keep It Simple, Stupid)

### Adding New AI Features

Edit `src/lib/ai/blog-context-engine.ts` to add new tasks:
```typescript
case 'new-task':
  context.systemPrompt = `Your new task prompt...`;
  break;
```

Create new API route in `src/app/api/ai/new-task/route.ts`.

### Extending the Registry

Add new fields to `BlogRegistryEntry` in `registry-generator.ts`:
```typescript
export interface BlogRegistryEntry {
  // ... existing fields
  customField: string;  // Add your field
}
```

Update `generateBlogRegistry()` to populate the new field.

## Future Enhancements

Potential improvements (not needed now):
- [ ] A/B testing for headlines
- [ ] Scheduled publishing
- [ ] Multi-language support
- [ ] Automatic social media posts
- [ ] Email newsletter integration (Brevo)
- [ ] Performance-based learning
- [ ] Collaborative editing
- [ ] Version history

## Support

For issues or questions:
1. Check console logs (browser + server)
2. Verify environment variables
3. Regenerate registry
4. Review API responses in Network tab

## License

Proprietary - Dr. Sebi Approved internal tool.
