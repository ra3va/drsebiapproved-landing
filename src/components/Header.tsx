'use client';

import Link from "next/link";
import { ArrowRight, Leaf, Menu, Star } from "lucide-react";

export default function Header() {
  return (
    <header className="fixed w-full top-0 z-50">
      {/* Top announcement bar */}
      <div className="bg-primary py-2 px-4 text-primary-foreground text-center text-sm">
        <span className="inline-flex items-center">
          <Star className="w-4 h-4 mr-2" /> Free Shipping on Orders Over $100
        </span>
      </div>

      {/* Main navigation */}
      <div className="bg-background/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex h-16 items-center justify-between">
            <Link className="flex items-center justify-center group" href="/">
              <div className="relative">
                <div className="absolute inset-0 bg-primary/10 rounded-full scale-125 group-hover:scale-150 transition-transform duration-300"></div>
                <Leaf className="h-6 w-6 md:h-7 md:w-7 text-primary relative" />
              </div>
              <span className="ml-3 text-lg md:text-2xl font-bold text-foreground whitespace-nowrap">
                Dr. Sebi Approved LLC
              </span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-1">
              <Link 
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors" 
                href="/#testimonials"
              >
                Success Stories
              </Link>
              <Link 
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors" 
                href="/blog"
              >
                Blog
              </Link>
              <Link 
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors" 
                href="/paracleanse"
              >
                ParaCleanse
              </Link>
              <Link 
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors" 
                href="/maya"
              >
                Maya Formula
              </Link>
              <Link 
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors" 
                href="/seamoss"
              >
                Sea Moss
              </Link>
              <Link 
                className="px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-md transition-colors" 
                href="/mucus-cleanser"
              >
                Mucus Cleanser
              </Link>
              <div className="w-px h-6 bg-border mx-2"></div>
              <Link 
                className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-white bg-primary hover:bg-primary/90 rounded-full shadow-lg shadow-primary/25 hover:translate-y-[1px] transition-all duration-200" 
                href="/quiz"
              >
                Take Health Quiz
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </nav>

            <button className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
} 