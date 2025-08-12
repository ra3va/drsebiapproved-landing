'use client';

import { Button } from "@/components/ui/button";
import { Leaf, ExternalLink, Star, Shield, Book, Zap } from 'lucide-react';
import Link from "next/link";
import Header from "@/components/Header";

export default function LinksPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-white to-accent/10">
      <Header />
      {/* Spacer for fixed header */}
      <div className="h-[5.5rem]"></div>

      <main className="flex-1 container max-w-2xl mx-auto px-4 py-12">
        {/* Brand Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-4">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/10 rounded-full scale-150"></div>
              <Leaf className="h-12 w-12 text-primary relative" />
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2">Dr. Sebi Approved LLC</h1>
          <p className="text-muted-foreground">Authentic Natural Healing Solutions</p>
        </div>

        {/* Featured Product */}
        <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-primary mb-8 hover:border-primary/80 transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <Star className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium text-primary">Featured Product</span>
          </div>
          <h2 className="text-xl font-bold mb-2">ParaCleanse Elite Package</h2>
          <p className="text-muted-foreground mb-4">Complete 2-week intensive cleansing protocol with Dr. Sebi's original formula</p>
          <Link href="https://drsebiapproved.com/" target="_blank" rel="noopener noreferrer">
            <Button className="w-full rounded-full bg-primary hover:bg-primary/90 text-white">
              Shop Now
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        {/* Other Products */}
        <div className="space-y-4">
          <Link 
            href="https://waterysperm.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block"
          >
            <Button variant="outline" className="w-full rounded-full justify-between hover:border-primary group">
              <div className="flex items-center gap-3">
                <Zap className="h-5 w-5 text-primary" />
                <span>Male Vitality Solutions</span>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </Button>
          </Link>

          <Link 
            href="https://drsebiwebsite.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block"
          >
            <Button variant="outline" className="w-full rounded-full justify-between hover:border-primary group">
              <div className="flex items-center gap-3">
                <Leaf className="h-5 w-5 text-primary" />
                <span>Complete Wellness Collection</span>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </Button>
          </Link>

          <Link 
            href="https://26herbmaya.store/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block"
          >
            <Button variant="outline" className="w-full rounded-full justify-between hover:border-primary group">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-primary" />
                <span>Maya Herbal Collection</span>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </Button>
          </Link>

          <Link 
            href="https://drbatana.com/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block"
          >
            <Button variant="outline" className="w-full rounded-full justify-between hover:border-primary group">
              <div className="flex items-center gap-3">
                <Shield className="h-5 w-5 text-primary" />
                <span>Dr. Batana Natural Solutions</span>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </Button>
          </Link>

          <Link 
            href="https://drsebiwebsite.com/products/the-alkaline-black-book-beginners-guide" 
            target="_blank" 
            rel="noopener noreferrer"
            className="block"
          >
            <Button variant="outline" className="w-full rounded-full justify-between hover:border-primary group">
              <div className="flex items-center gap-3">
                <Book className="h-5 w-5 text-primary" />
                <span>Alkaline Black Book: Beginner's Guide</span>
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
            </Button>
          </Link>
        </div>

        {/* Trust Badge */}
        <div className="mt-12 text-center">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>110% Dr. Sebi Approved - Made in Honduras</span>
          </div>
        </div>
      </main>
    </div>
  );
} 