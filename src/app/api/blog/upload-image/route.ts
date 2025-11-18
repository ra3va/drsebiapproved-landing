import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only images are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: 'File too large. Max size is 5MB.' },
        { status: 400 }
      );
    }

    // Create unique filename
    const timestamp = Date.now();
    const originalName = file.name.replace(/[^a-z0-9.]/gi, '-').toLowerCase();
    const filename = `${timestamp}-${originalName}`;

    // Ensure upload directory exists
    const uploadDir = path.join(process.cwd(), 'public/images/blog');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Save file
    const filePath = path.join(uploadDir, filename);
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    fs.writeFileSync(filePath, buffer);

    const publicPath = `/images/blog/${filename}`;

    console.log(`📸 Image uploaded: ${publicPath}`);

    return NextResponse.json({
      success: true,
      message: 'Image uploaded successfully',
      url: publicPath,
      filename
    });

  } catch (error: any) {
    console.error('Upload image error:', error);
    return NextResponse.json(
      { error: 'Failed to upload image', details: error.message },
      { status: 500 }
    );
  }
}
