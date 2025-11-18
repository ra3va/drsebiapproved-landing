import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { generateBlogRegistry } from '@/lib/ai/registry-generator';
import { GitHelper } from '@/lib/ai/git-helper';

export async function POST(req: NextRequest) {
  try {
    const { slug, content, commitToGit = true } = await req.json();

    if (!slug || !content) {
      return NextResponse.json(
        { error: 'Slug and content are required' },
        { status: 400 }
      );
    }

    const blogDir = path.join(process.cwd(), 'content/blog');
    const draftDir = path.join(process.cwd(), 'content/drafts');

    // Ensure blog directory exists
    if (!fs.existsSync(blogDir)) {
      fs.mkdirSync(blogDir, { recursive: true });
    }

    // Write to blog directory
    const filePath = path.join(blogDir, `${slug}.mdx`);
    fs.writeFileSync(filePath, content, 'utf8');

    console.log(`📝 Published blog post: ${slug}`);

    // Delete draft if it exists
    const draftPath = path.join(draftDir, `${slug}.mdx`);
    if (fs.existsSync(draftPath)) {
      fs.unlinkSync(draftPath);
      console.log(`🗑️  Removed draft: ${slug}`);
    }

    // Regenerate registry
    console.log('🔄 Regenerating blog registry...');
    await generateBlogRegistry();

    // Commit to git if enabled
    let gitResult = null;
    if (commitToGit) {
      console.log('📤 Committing to git...');
      gitResult = await GitHelper.commitAndPush(
        `content/blog/${slug}.mdx`,
        `📝 Publish blog post: ${slug}`
      );

      if (!gitResult.success) {
        console.warn('Git commit failed:', gitResult.message);
      } else {
        console.log('✅ Changes pushed to GitHub');
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Blog post published successfully',
      filePath: `content/blog/${slug}.mdx`,
      slug,
      registryUpdated: true,
      gitCommitted: gitResult?.success || false,
      gitMessage: gitResult?.message
    });

  } catch (error: any) {
    console.error('Publish blog error:', error);
    return NextResponse.json(
      { error: 'Failed to publish blog post', details: error.message },
      { status: 500 }
    );
  }
}
