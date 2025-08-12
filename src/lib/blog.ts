import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { serialize } from 'next-mdx-remote/serialize';
import readingTime from 'reading-time';
import { ReactElement } from 'react';
import { MDXRemoteSerializeResult } from 'next-mdx-remote';

export interface BlogPost {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  content: MDXRemoteSerializeResult;
  author: {
    name: string;
    image: string;
    bio: string;
  };
  tags: string[];
  slug: string;
}

const postsDirectory = path.join(process.cwd(), 'content/blog');

export async function getAllBlogPosts(): Promise<BlogPost[]> {
  // Ensure the directory exists
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = await Promise.all(
    fileNames
      .filter(fileName => fileName.endsWith('.mdx'))
      .map(async fileName => {
        const slug = fileName.replace(/\.mdx$/, '');
        const post = await getBlogPost(slug);
        return post;
      })
  );

  // Sort posts by date
  return allPostsData
    .filter((post): post is BlogPost => post !== undefined)
    .sort((a, b) => (new Date(b.date)).getTime() - (new Date(a.date)).getTime());
}

export async function getBlogPost(slug: string): Promise<BlogPost | undefined> {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.mdx`);
    
    if (!fs.existsSync(fullPath)) {
      return undefined;
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8');
    const { data, content } = matter(fileContents);
    
    // Serialize the content
    const mdxSource = await serialize(content, {
      parseFrontmatter: true,
      mdxOptions: {
        development: process.env.NODE_ENV === 'development',
      },
    });

    const stats = readingTime(content);

    const post: BlogPost = {
      slug,
      title: data.title,
      excerpt: data.excerpt,
      date: new Date(data.date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }),
      readTime: `${Math.ceil(stats.minutes)} min read`,
      category: data.category,
      image: data.image,
      content: mdxSource,
      author: {
        name: data.author.name,
        image: data.author.image,
        bio: data.author.bio
      },
      tags: data.tags || []
    };

    return post;
  } catch (error) {
    console.error(`Error getting blog post ${slug}:`, error);
    return undefined;
  }
} 