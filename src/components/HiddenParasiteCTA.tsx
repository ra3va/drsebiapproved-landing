'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Download, ArrowRight, Shield, CheckCircle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface HiddenParasiteCTAProps {
  className?: string;
  variant?: 'default' | 'compact' | 'inline';
}

export default function HiddenParasiteCTA({ className = "", variant = 'default' }: HiddenParasiteCTAProps) {
  if (variant === 'compact') {
    return (
      <div className={`not-prose my-8 ${className}`}>
        <Card className="border-2 border-red-200 bg-gradient-to-r from-red-50 to-orange-50 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="flex-shrink-0">
                <Image
                  src="/3066a71b-75c7-4a5c-876a-3d7c080cde01.jpeg"
                  alt="The Hidden Parasite Crisis - Free Guide"
                  width={120}
                  height={150}
                  className="rounded-lg shadow-lg"
                />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-xl font-bold text-red-900 mb-2">
                  🚨 Stop Parasites From Stealing Your Health
                </h3>
                <p className="text-red-700 mb-4">
                  Get our free guide: "The Hidden Parasite Crisis" - Dr. Sebi's complete 2-phase elimination protocol.
                </p>
                <Link href="/hidden-parasite-crisis">
                  <Button className="bg-red-600 hover:bg-red-700 text-white">
                    <Download className="w-4 h-4 mr-2" />
                    Get Free Guide
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (variant === 'inline') {
    return (
      <div className={`not-prose my-6 p-4 bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-500 rounded-r-lg ${className}`}>
        <div className="flex items-center gap-3 mb-2">
          <Shield className="w-5 h-5 text-red-600" />
          <span className="font-semibold text-red-900">Free Resource Alert</span>
        </div>
        <p className="text-red-700 mb-3">
          Want to learn more about identifying and eliminating parasites? Download our comprehensive guide for free.
        </p>
        <Link href="/hidden-parasite-crisis">
          <Button className="bg-red-600 hover:bg-red-700 text-white">
            Get "The Hidden Parasite Crisis" Guide
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
      </div>
    );
  }

  // Default variant - full CTA
  return (
    <div className={`not-prose my-12 ${className}`}>
      <Card className="border-2 border-red-200 bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 overflow-hidden shadow-lg">
        <CardContent className="p-0">
          <div className="flex flex-col lg:flex-row">
            {/* Image Section */}
            <div className="lg:w-1/3 p-6 lg:p-8 flex justify-center lg:justify-start">
              <div className="relative group">
                <div className="absolute inset-0 bg-red-500/10 rounded-2xl blur-xl scale-110 group-hover:scale-125 transition-transform duration-500" />
                <Image
                  src="/3066a71b-75c7-4a5c-876a-3d7c080cde01.jpeg"
                  alt="The Hidden Parasite Crisis - Free Guide"
                  width={200}
                  height={250}
                  className="relative rounded-lg shadow-xl transform group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                  FREE
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="lg:w-2/3 p-6 lg:p-8">
              <div className="max-w-2xl">
                <div className="flex items-center gap-2 text-sm text-red-600 font-semibold uppercase tracking-wide mb-3">
                  <Download className="w-4 h-4" />
                  Free Download
                </div>
                
                <h3 className="text-2xl lg:text-3xl font-bold text-red-900 mb-4 leading-tight">
                  The Hidden Parasite Crisis: Dr. Sebi's Complete Elimination Guide
                </h3>
                
                <p className="text-red-700 text-lg mb-6 leading-relaxed">
                  <strong>Millions suffer from unexplained symptoms without knowing the real cause: hidden parasite infections.</strong> Get Dr. Sebi's proven 2-phase protocol that breaks biofilms and eliminates parasites naturally.
                </p>

                {/* Benefits */}
                <div className="grid gap-3 mb-6">
                  {[
                    "Identify the 7 hidden signs of parasite infection",
                    "Learn Dr. Sebi's biofilm-breaking protocol", 
                    "Get the complete 2-phase elimination system"
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <span className="text-red-800">{benefit}</span>
                    </div>
                  ))}
                </div>

                <Link href="/hidden-parasite-crisis">
                  <Button 
                    size="lg" 
                    className="bg-red-600 hover:bg-red-700 text-white rounded-full px-8 py-4 text-lg font-semibold shadow-lg hover:translate-y-[1px] transition-all"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download Your Free Guide Now
                  </Button>
                </Link>

                <p className="text-xs text-red-600 mt-3">
                  100% Free • No Email Required • Instant Access
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}