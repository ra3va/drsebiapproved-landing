import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const { slug, content, isDraft = true } = await req.json();

    if (!slug || !content) {
      return NextResponse.json(
        { error: 'Slug and content are required' },
        { status: 400 }
      );
    }

    // Determine directory based on draft status
    const dir = isDraft
      ? path.join(process.cwd(), 'content/drafts')
      : path.join(process.cwd(), 'content/blog');

    // Ensure directory exists
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Write file
    const filePath = path.join(dir, `${slug}.mdx`);
    fs.writeFileSync(filePath, content, 'utf8');

    console.log(`💾 Saved ${isDraft ? 'draft' : 'post'}: ${slug}`);

    return NextResponse.json({
      success: true,
      message: `${isDraft ? 'Draft' : 'Post'} saved successfully`,
      filePath: `content/${isDraft ? 'drafts' : 'blog'}/${slug}.mdx`,
      slug
    });

  } catch (error: any) {
    console.error('Save blog error:', error);
    return NextResponse.json(
      { error: 'Failed to save blog post', details: error.message },
      { status: 500 }
    );
  }
}
