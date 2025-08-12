import { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import BlogPostClient from "./BlogPostClient";
import { getBlogPost, getAllBlogPosts } from "@/lib/blog";

interface BlogPost {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  image: string;
  content: string;
  author: {
    name: string;
    image: string;
    bio: string;
  };
  tags: string[];
  slug: string;
}

// Generate static params for all blog posts
export async function generateStaticParams() {
  const posts = await getAllBlogPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

interface Props {
  params: { slug: string }
}

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const post = await getBlogPost(params.slug);
  
  if (!post) {
    return {
      title: 'Post Not Found | Dr. Sebi Approved',
    }
  }

  // Get the absolute URL for the image
  const imageUrl = new URL(post.image, 'https://drsebiapproved.com').toString();

  return {
    title: `${post.title} | Dr. Sebi Approved`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [{
        url: imageUrl,
        width: 1200,
        height: 630,
        alt: post.title,
      }],
      type: 'article',
      publishedTime: post.date,
      authors: [post.author.name],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: [imageUrl],
    }
  };
}

export default async function BlogPost({ params }: Props) {
  const post = await getBlogPost(params.slug);
  
  if (!post) {
    notFound();
  }

  return <BlogPostClient post={post} />;
} 