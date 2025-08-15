'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import dynamic from 'next/dynamic';
import type { MDXRemoteProps } from "next-mdx-remote";
import { BlogPost } from "@/lib/blog";
import Header from "@/components/Header";
import GutHealthLeadMagnet from "@/components/GutHealthLeadMagnet";
import React from "react";

// Dynamically import MDXRemote with SSR disabled
const MDXRemoteNoSSR = dynamic(() => import('next-mdx-remote').then(mod => mod.MDXRemote), { ssr: false });

// Custom components for MDX
const components = {
  // Lead magnet component
  LeadMagnet: () => <GutHealthLeadMagnet />,
  
  img: ({ className, alt, ...props }: any) => (
    <Image
      className={`${className || ''} rounded-lg`}
      alt={alt || ''}
      {...props}
      width={Number(props.width) || 800}
      height={Number(props.height) || 400}
    />
  ),
  div: ({ className, children, ...props }: any) => (
    <div className={className || ''} {...props}>
      {children}
    </div>
  ),
  a: ({ className, href, children, ...props }: any) => (
    <Link 
      href={href || '#'} 
      className={`text-primary hover:underline ${className || ''}`}
      {...props}
    >
      {children}
    </Link>
  ),
  h2: ({ className, children, ...props }: any) => (
    <h2 className={`text-3xl font-bold mt-12 mb-6 ${className || ''}`} {...props}>
      {children}
    </h2>
  ),
  h3: ({ className, children, ...props }: any) => (
    <h3 className={`text-2xl font-bold mt-8 mb-4 ${className || ''}`} {...props}>
      {children}
    </h3>
  ),
  p: ({ className, children, ...props }: any) => (
    <div className={`text-lg text-muted-foreground leading-relaxed mb-6 ${className || ''}`} {...props}>
      {children}
    </div>
  ),
  strong: ({ className, children, ...props }: any) => (
    <strong className={`font-bold ${className || ''}`} {...props}>
      {children}
    </strong>
  ),
  table: ({ className, children, ...props }: any) => (
    <div className="overflow-x-auto">
      <table className={`w-full border-collapse ${className || ''}`} {...props}>
        {children}
      </table>
    </div>
  ),
  th: ({ className, children, ...props }: any) => (
    <th className={`py-4 px-4 text-left ${className || ''}`} {...props}>
      {children}
    </th>
  ),
  td: ({ className, children, ...props }: any) => (
    <td className={`py-4 px-4 ${className || ''}`} {...props}>
      {children}
    </td>
  ),
  tr: ({ className, children, ...props }: any) => (
    <tr className={`border-b border-accent/10 ${className || ''}`} {...props}>
      {children}
    </tr>
  )
} as MDXRemoteProps['components'];

interface BlogPostClientProps {
  post: BlogPost | undefined;
}

export default function BlogPostClient({ post }: BlogPostClientProps) {
  if (!post) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        {/* Spacer for fixed header */}
        <div className="h-[5.5rem]"></div>
        <div className="container mx-auto px-4 py-12">
          <Card>
            <CardContent className="p-6">
              <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
              <p className="text-muted-foreground mb-6">The blog post you're looking for doesn't exist.</p>
              <Link href="/#blog">
                <Button variant="outline" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Blog
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {/* Spacer for fixed header */}
      <div className="h-[5.5rem]"></div>
      
      <main className="flex-1 bg-gradient-to-b from-accent/5 to-transparent">
        <div className="container mx-auto px-4 py-12">
          <Link href="/#blog">
            <Button variant="outline" className="mb-8 gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Blog
            </Button>
          </Link>

          <article className="max-w-4xl mx-auto">
            {/* Hero Section */}
            <div className="aspect-[16/9] sm:aspect-[21/9] relative mb-12 rounded-xl overflow-hidden shadow-xl">
              <Image
                src={post.image}
                alt={post.title}
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 md:p-12">
                <div className="flex flex-wrap items-center gap-3 text-sm text-white/90 mb-3 sm:mb-4">
                  <span className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {post.date}
                  </span>
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {post.readTime}
                  </span>
                  <span className="bg-[#00A6E6]/90 text-white px-3 py-1 rounded-full text-sm">
                    {post.category}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 sm:mb-4 leading-tight">
                  {post.title}
                </h1>
                <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-3xl leading-relaxed">
                  {post.excerpt}
                </p>
              </div>
            </div>

            {/* Content */}
            <div className="prose prose-lg max-w-none bg-white rounded-xl shadow-sm border border-accent/10 p-6 sm:p-8 md:p-12">
              <MDXRemoteNoSSR {...post.content} components={components} />
              
              {/* Lead magnet positioned after content intro */}
              <div className="not-prose my-8">
                <GutHealthLeadMagnet />
              </div>
            </div>

            {/* CTA Section */}
            <div className="mt-12 bg-white rounded-3xl shadow-sm border border-accent/10 overflow-hidden">
              <div className="relative px-8 py-12 md:p-12">
                <div className="relative max-w-3xl mx-auto text-center space-y-6">
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900">Ready to Begin Your Transformation?</h3>
                  <p className="text-xl text-gray-600">Experience the power of Dr. Sebi's original formulations with our comprehensive ParaCleanse Elite package. Break through biofilm barriers and achieve lasting cellular health.</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
                    <Link 
                      href="/#elite-package"
                      className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-white bg-[#00A6E6] rounded-full hover:bg-[#0095D1] transition-all duration-200"
                    >
                      Get the Elite Package
                    </Link>
                    <Link 
                      href="/quiz"
                      className="inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-[#00A6E6] bg-white border-2 border-[#00A6E6] rounded-full hover:bg-blue-50 transition-all duration-200"
                    >
                      Take our Quiz
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t">
                <h3 className="text-xl font-semibold mb-4">Related Topics</h3>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <Link 
                      key={tag} 
                      href={`/blog/tag/${tag}`}
                      className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-accent/5 rounded-full text-sm text-muted-foreground transition-colors border border-accent/10"
                    >
                      <Tag className="w-4 h-4" />
                      {tag}
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </article>
        </div>
      </main>
    </div>
  );
} 