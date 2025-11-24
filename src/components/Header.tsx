'use client';

import Link from "next/link";
import { ArrowRight, Leaf, Menu, Star, X } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="w-full relative z-40">
      {/* Top announcement bar - Black Friday Theme */}
      <div className="bg-black py-2 px-4 text-center text-sm border-b border-yellow-600/20">
        <span className="inline-flex items-center text-yellow-400 font-semibold">
          <Star className="w-4 h-4 mr-2 fill-yellow-400" /> Free Shipping on Orders Over $100
        </span>
      </div>

      {/* Main navigation - Black Friday Theme */}
      <div className="bg-black/95 backdrop-blur-lg border-b border-yellow-600/20">
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex h-16 items-center justify-between">
            <Link className="flex items-center justify-center group" href="/">
              <div className="relative">
                <div className="absolute inset-0 bg-yellow-500/20 rounded-full scale-125 group-hover:scale-150 transition-transform duration-300"></div>
                <Leaf className="h-6 w-6 md:h-7 md:w-7 text-yellow-400 relative" />
              </div>
              <span className="ml-3 text-lg md:text-2xl font-bold text-white whitespace-nowrap">
                Dr. Sebi Approved LLC
              </span>
            </Link>
            
            <nav className="hidden md:flex items-center space-x-1">
              <Link
                className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-yellow-400 hover:bg-yellow-500/10 rounded-md transition-colors"
                href="/#testimonials"
              >
                Success Stories
              </Link>
              <Link
                className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-yellow-400 hover:bg-yellow-500/10 rounded-md transition-colors"
                href="/blog"
              >
                Blog
              </Link>
              <Link
                className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-yellow-400 hover:bg-yellow-500/10 rounded-md transition-colors"
                href="/paracleanse"
              >
                ParaCleanse
              </Link>
              <Link
                className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-yellow-400 hover:bg-yellow-500/10 rounded-md transition-colors"
                href="/maya"
              >
                Maya Formula
              </Link>
              <Link
                className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-yellow-400 hover:bg-yellow-500/10 rounded-md transition-colors"
                href="/seamoss"
              >
                Sea Moss
              </Link>
              <Link
                className="px-3 py-2 text-sm font-medium text-gray-300 hover:text-yellow-400 hover:bg-yellow-500/10 rounded-md transition-colors"
                href="/mucus-cleanser"
              >
                Mucus Cleanser
              </Link>
              <div className="w-px h-6 bg-yellow-600/30 mx-2"></div>
              <Link
                className="inline-flex items-center justify-center px-6 py-2.5 text-sm font-medium text-black bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 rounded-full shadow-lg shadow-yellow-500/25 hover:translate-y-[1px] transition-all duration-200"
                href="/quiz"
              >
                Take Health Quiz
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </nav>

            <button
              className="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-300 hover:text-yellow-400 hover:bg-yellow-500/10 transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-yellow-600/20">
              <nav className="flex flex-col space-y-1 py-4">
                <Link
                  className="px-4 py-3 text-sm font-medium text-gray-300 hover:text-yellow-400 hover:bg-yellow-500/10 transition-colors"
                  href="/#testimonials"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Success Stories
                </Link>
                <Link
                  className="px-4 py-3 text-sm font-medium text-gray-300 hover:text-yellow-400 hover:bg-yellow-500/10 transition-colors"
                  href="/paracleanse"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  ParaCleanse
                </Link>
                <Link
                  className="px-4 py-3 text-sm font-medium text-gray-300 hover:text-yellow-400 hover:bg-yellow-500/10 transition-colors"
                  href="/maya"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Maya Formula
                </Link>
                <Link
                  className="px-4 py-3 text-sm font-medium text-gray-300 hover:text-yellow-400 hover:bg-yellow-500/10 transition-colors"
                  href="/seamoss"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sea Moss
                </Link>
                <Link
                  className="px-4 py-3 text-sm font-medium text-gray-300 hover:text-yellow-400 hover:bg-yellow-500/10 transition-colors"
                  href="/mucus-cleanser"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Mucus Cleanser
                </Link>
                <div className="px-4 pt-2">
                  <Link
                    className="inline-flex items-center justify-center w-full px-6 py-3 text-sm font-medium text-black bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 rounded-full shadow-lg shadow-yellow-500/25 transition-all duration-200"
                    href="/quiz"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Take Health Quiz
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </div>
              </nav>
            </div>
          )}
        </div>
      </div>
    </header>
  );
} 