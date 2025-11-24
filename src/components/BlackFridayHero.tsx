'use client';

import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Zap, ShoppingBag, Gift } from 'lucide-react';
import Link from 'next/link';

export default function BlackFridayHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black pt-24 pb-16 md:pt-32 md:pb-24">
      {/* Background texture overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
        }}
      />

      {/* Animated gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-600/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="container relative mx-auto px-4 max-w-[1200px]">
        <div className="text-center">
          {/* Black Friday Badge */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="inline-flex items-center justify-center mb-6"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-500/30 rounded-full blur-xl animate-pulse" />
              <div className="relative bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-600 text-black px-6 py-3 rounded-full font-bold text-sm md:text-base uppercase tracking-wider shadow-2xl">
                <div className="flex items-center gap-2">
                  <Zap className="w-5 h-5 fill-black" />
                  <span>Nov 25-29 Only</span>
                  <Zap className="w-5 h-5 fill-black" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight"
          >
            <span className="text-white">Black Friday</span>
            <br />
            <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
              Cleanse Sale
            </span>
          </motion.h1>

          {/* Subheadline */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl md:text-2xl lg:text-3xl text-gray-300 mb-4 max-w-[800px] mx-auto leading-relaxed font-medium"
          >
            The lowest prices we've ever offered on
            <br />
            <span className="text-yellow-400">Dr. Sebi's original formulas</span>
          </motion.p>

          {/* Discount Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <div className="inline-block relative">
              <div className="absolute inset-0 bg-yellow-500/20 blur-2xl" />
              <div className="relative bg-gradient-to-r from-black via-gray-900 to-black border-2 border-yellow-500 rounded-2xl px-8 py-6 shadow-2xl">
                <div className="text-6xl md:text-7xl font-black text-yellow-400 mb-2">
                  30% OFF
                </div>
                <div className="text-white text-lg md:text-xl font-semibold uppercase tracking-widest">
                  Sitewide
                </div>
                <div className="mt-3 text-gray-400 text-sm md:text-base">
                  Use code: <span className="text-yellow-400 font-bold">BLACKFRIDAY30</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8"
          >
            <a href="#products">
              <Button
                size="lg"
                className="bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-bold text-lg px-10 py-7 rounded-full shadow-2xl hover:shadow-yellow-500/50 transition-all hover:scale-105"
              >
                <ShoppingBag className="w-6 h-6 mr-2" />
                Shop All Products
              </Button>
            </a>
            <Link href="/quiz">
              <Button
                size="lg"
                variant="outline"
                className="border-2 border-yellow-500 text-yellow-400 hover:bg-yellow-500/10 font-bold text-lg px-10 py-7 rounded-full transition-all hover:scale-105"
              >
                <Gift className="w-6 h-6 mr-2" />
                Find Your Perfect Product
              </Button>
            </Link>
          </motion.div>

          {/* Trust Signals */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex flex-wrap justify-center gap-6 md:gap-8 text-sm md:text-base text-gray-400"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full" />
              <span>Authentic Dr. Sebi Formulas</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full" />
              <span>100% Wildcrafted Herbs</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-yellow-500 rounded-full" />
              <span>Limited Time Only</span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade to white */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
    </section>
  );
}
