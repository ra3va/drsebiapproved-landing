import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(
  req: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;

    // Try blog directory first
    let filePath = path.join(process.cwd(), 'content/blog', `${slug}.mdx`);
    let isDraft = false;

    if (!fs.existsSync(filePath)) {
      // Try drafts directory
      filePath = path.join(process.cwd(), 'content/drafts', `${slug}.mdx`);
      isDraft = true;

      if (!fs.existsSync(filePath)) {
        return NextResponse.json(
          { error: 'Blog post not found' },
          { status: 404 }
        );
      }
    }

    const content = fs.readFileSync(filePath, 'utf8');

    return NextResponse.json({
      success: true,
      content,
      slug,
      isDraft,
      filePath: `content/${isDraft ? 'drafts' : 'blog'}/${slug}.mdx`
    });

  } catch (error: any) {
    console.error('Load blog error:', error);
    return NextResponse.json(
      { error: 'Failed to load blog post', details: error.message },
      { status: 500 }
    );
  }
}
