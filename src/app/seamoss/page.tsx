'use client';

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Star, ShoppingCart, Gift, Users, TrendingUp, Award, ShieldCheck, Download, Zap } from 'lucide-react'
import Image from "next/image"
import { useState, useEffect } from 'react';
import Header from "@/components/Header";

export default function SeaMossBlackFridayPDP() {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [inCartCount, setInCartCount] = useState(0);
  const [recentPurchases, setRecentPurchases] = useState(0);

  // Simulate realistic dynamic numbers
  useEffect(() => {
    // Random number between 2.3K - 2.8K for cart count
    const baseCartCount = 1500 + Math.floor(Math.random() * 400);
    setInCartCount(baseCartCount);

    // Random number between 120-240 for recent purchases
    const basePurchases = 120 + Math.floor(Math.random() * 50);
    setRecentPurchases(basePurchases);

    // Update cart count every 15-30 seconds
    const interval = setInterval(() => {
      setInCartCount(prev => prev + Math.floor(Math.random() * 3) - 1); // +/- 0-2
    }, Math.random() * 14000 + 14000);

    return () => clearInterval(interval);
  }, []);

  // Product pricing
  const originalPrice = 39.99;
  const salePrice = 27.99;
  const discount = Math.round(((originalPrice - salePrice) / originalPrice) * 100);
  const savings = originalPrice - salePrice;

  const handleAddToCart = () => {
    setIsLoading(true);

    // Track GA4 add_to_cart event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'add_to_cart', {
        currency: 'USD',
        value: salePrice * quantity,
        items: [{
          item_id: 'sea-moss-bf',
          item_name: 'Sea Moss Capsules - Black Friday',
          item_category: 'Mineral Support',
          price: salePrice,
          quantity: quantity
        }]
      });
    }

    // Redirect to checkout
    window.location.href = `/checkout?product=seamoss&quantity=${quantity}&coupon=BLACKFRIDAY30`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <div className="flex flex-col min-h-screen bg-white pt-[4.5rem]">
      <Header />

      <main className="flex-1">
        {/* Black Friday Sticky Banner - Compact */}
        <div className="sticky top-[72px] z-40 bg-gradient-to-r from-black via-gray-900 to-black border-b-2 border-yellow-400/30 py-2">
          <div className="container mx-auto px-4 flex items-center justify-center gap-3 text-xs sm:text-sm">
            <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-white font-bold">BLACK FRIDAY:</span>
            <span className="text-yellow-400 font-bold">30% OFF</span>
            <span className="text-gray-400">|</span>
            <span className="text-gray-300">Code: <span className="text-yellow-400 font-mono">BLACKFRIDAY30</span></span>
          </div>
        </div>

        {/* Product Detail Section */}
        <section className="w-full py-8 md:py-12">
          <div className="container px-4 md:px-6 max-w-[1200px] mx-auto">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12">

              {/* Left Column - Product Image */}
              <div className="flex flex-col">
                {/* Social Proof Badge */}
                <div className="flex items-center gap-2 mb-4 text-sm text-muted-foreground">
                  <ShoppingCart className="w-4 h-4 text-primary" />
                  <span>In the carts of <strong className="text-foreground">{formatNumber(inCartCount)} people</strong> — buy before it's gone!</span>
                </div>

                {/* Product Image */}
                <div className="relative bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8 mb-6">
                  {/* Black Friday Badge */}
                  <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-500 to-yellow-400 text-black text-xs font-bold px-3 py-1.5 rounded-full shadow-lg z-10 uppercase tracking-wide">
                    BLACK FRIDAY
                  </div>

                  <Image
                    src="/seamoss.png"
                    alt="Dr. Sebi's Honduran Sea Moss Capsules"
                    width={400}
                    height={400}
                    className="w-full h-auto object-contain"
                    priority
                  />
                </div>

                {/* Trust Badges */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-lg">
                    <ShieldCheck className="w-6 h-6 text-primary mb-1" />
                    <span className="text-xs font-medium">100% Natural</span>
                  </div>
                  <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-lg">
                    <Award className="w-6 h-6 text-primary mb-1" />
                    <span className="text-xs font-medium">Dr. Sebi Formula</span>
                  </div>
                  <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-lg">
                    <Users className="w-6 h-6 text-primary mb-1" />
                    <span className="text-xs font-medium">10K+ Reviews</span>
                  </div>
                </div>
              </div>

              {/* Right Column - Product Info */}
              <div className="flex flex-col">
                {/* Product Title */}
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  Sea Moss Capsules
                </h1>
                <p className="text-lg text-primary font-medium mb-4">
                  Nature's Multi-Vitamin - 92 Essential Minerals
                </p>

                {/* Rating */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <span className="text-sm font-semibold">Rated 4.9</span>
                  <span className="text-sm text-muted-foreground">(2,654 reviews)</span>
                  <span className="text-sm text-primary font-medium">Happy Customers</span>
                </div>

                {/* Badges */}
                <div className="flex flex-wrap gap-2 mb-6">
                  <div className="bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-full border border-yellow-200">
                    92 OF 102 ESSENTIAL MINERALS
                  </div>
                  <div className="bg-primary/10 text-primary text-xs font-bold px-3 py-1 rounded-full border border-primary/20">
                    Wildcrafted from Honduras
                  </div>
                </div>

                {/* Pricing */}
                <div className="mb-6 p-6 bg-gradient-to-br from-yellow-50 to-yellow-100/50 rounded-2xl border-2 border-yellow-400/30">
                  <div className="flex items-baseline gap-3 mb-2">
                    <span className="text-4xl font-bold text-foreground">${salePrice}</span>
                    <span className="text-2xl text-muted-foreground line-through">${originalPrice}</span>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <div className="bg-yellow-400 text-black text-sm font-bold px-3 py-1 rounded-full">
                      SAVE {discount}% | ${savings.toFixed(2)} OFF
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Use code: <span className="text-yellow-700 font-mono font-bold">BLACKFRIDAY30</span> at checkout
                  </p>
                </div>

                {/* Quantity Selector & Add to Cart */}
                <div className="mb-6">
                  <label className="text-sm font-medium mb-2 block">Quantity:</label>

                  {/* Buy Options */}
                  <div className="space-y-3 mb-4">
                    {/* Buy 1 */}
                    <button
                      onClick={() => setQuantity(1)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${
                        quantity === 1
                          ? 'border-yellow-400 bg-yellow-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          quantity === 1 ? 'border-yellow-400' : 'border-gray-300'
                        }`}>
                          {quantity === 1 && <div className="w-3 h-3 rounded-full bg-yellow-400" />}
                        </div>
                        <span className="font-semibold">Buy 1</span>
                      </div>
                      <span className="font-bold text-lg">${salePrice}</span>
                    </button>

                    {/* Buy 2 Get 1 Free */}
                    <button
                      onClick={() => setQuantity(2)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all relative ${
                        quantity === 2
                          ? 'border-yellow-400 bg-yellow-50'
                          : 'border-gray-200 bg-white hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                          quantity === 2 ? 'border-yellow-400' : 'border-gray-300'
                        }`}>
                          {quantity === 2 && <div className="w-3 h-3 rounded-full bg-yellow-400" />}
                        </div>
                        <div className="flex flex-col items-start">
                          <span className="font-semibold">Buy 2</span>
                          <span className="text-xs text-primary font-medium">Best Value</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <span className="font-bold text-lg">${(salePrice * 2).toFixed(2)}</span>
                        <span className="text-xs text-muted-foreground line-through">${(originalPrice * 2).toFixed(2)}</span>
                      </div>
                      <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        -{discount}%
                      </div>
                    </button>
                  </div>

                  {/* Add to Cart Button */}
                  <Button
                    onClick={handleAddToCart}
                    disabled={isLoading}
                    size="lg"
                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold text-lg py-7 rounded-full shadow-lg shadow-yellow-400/25 hover:scale-105 transition-all"
                  >
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    {isLoading ? 'Processing...' : 'Add to Cart'}
                  </Button>
                </div>

                {/* Recent Activity */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6 p-3 bg-primary/5 rounded-lg border border-primary/10">
                  <TrendingUp className="w-4 h-4 text-primary" />
                  <span><strong className="text-foreground">{recentPurchases} people</strong> purchased this in the last 24 hours</span>
                </div>

                {/* Key Benefits */}
                <div className="mb-6">
                  <h3 className="font-semibold text-lg mb-3">What You Get:</h3>
                  <div className="space-y-2">
                    {[
                      "92 of 102 essential minerals",
                      "Thyroid & immune support",
                      "Digestive health boost",
                      "Wildcrafted from Honduras",
                      "Dr. Sebi's mineral-rich formula"
                    ].map((benefit, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Free Gifts Section */}
                <div className="p-6 bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl border-2 border-primary/20">
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Gift className="w-5 h-5 text-primary" />
                    FREE GIFTS WITH YOUR ORDER
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {/* E-book */}
                    <div className="flex flex-col items-center text-center p-4 bg-white rounded-xl border border-gray-200">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                        <Download className="w-6 h-6 text-primary" />
                      </div>
                      <span className="text-xs font-bold mb-1">FREE EBOOK</span>
                      <span className="text-xs text-muted-foreground">Hidden Parasite Crisis Guide</span>
                    </div>

                    {/* Free Shipping */}
                    <div className="flex flex-col items-center text-center p-4 bg-white rounded-xl border border-gray-200">
                      <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-2">
                        <ShieldCheck className="w-6 h-6 text-primary" />
                      </div>
                      <span className="text-xs font-bold mb-1">FREE SHIPPING</span>
                      <span className="text-xs text-muted-foreground">On orders 2+ items</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Product Description Section */}
        <section className="w-full py-12 bg-gray-50">
          <div className="container px-4 md:px-6 max-w-[1200px] mx-auto">
            <h2 className="text-3xl font-bold mb-6">Why Sea Moss Capsules Works</h2>

            <div className="prose prose-lg max-w-none">
              <p className="text-lg text-muted-foreground mb-6">
                Dr. Sebi's Sea Moss Capsules is the only two-phase system that addresses the root cause of why most parasite cleanses fail: <strong>biofilms</strong>. These protective shields allow parasites to hide from traditional treatments, but our revolutionary formula breaks through them.
              </p>

              <div className="grid md:grid-cols-2 gap-6 mt-8">
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">1</div>
                      Phase 1: Biofilm Disruption
                    </h3>
                    <p className="text-muted-foreground">
                      The first 7 days break down the protective biofilm layer using powerful natural enzymes. This exposes parasites and makes them vulnerable to elimination.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-3 flex items-center gap-2">
                      <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">2</div>
                      Phase 2: Deep Elimination
                    </h3>
                    <p className="text-muted-foreground">
                      Days 8-14 target and eliminate parasites at every stage of their lifecycle using Dr. Sebi's wildcrafted herb blend. Complete system cleansing.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="w-full py-12 bg-white">
          <div className="container px-4 md:px-6 max-w-[1200px] mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center">What Our Customers Say</h2>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  name: "Sarah M.",
                  location: "Dallas, TX",
                  rating: 5,
                  text: "After just 14 days, my energy levels are through the roof! I can't believe how much better I feel. This is the real deal.",
                  image: "/images/testimonials/E1lm-p99Mp_mid.jpg"
                },
                {
                  name: "Michael C.",
                  location: "San Francisco, CA",
                  rating: 5,
                  text: "I've tried other cleanses before, but Sea Moss Capsules is different. The two-phase system actually works. No more bloating!",
                  image: "/images/testimonials/4JL1TreUi_mid (2).jpg"
                },
                {
                  name: "Emma R.",
                  location: "Miami, FL",
                  rating: 5,
                  text: "My brain fog is completely gone. I wish I had found Dr. Sebi's products years ago. Worth every penny!",
                  image: "/images/testimonials/9c05X9Grw_mid.jpg"
                }
              ].map((testimonial, i) => (
                <Card key={i} className="border-2 hover:border-primary transition-all">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Image
                        src={testimonial.image}
                        alt={testimonial.name}
                        width={48}
                        height={48}
                        className="rounded-full"
                      />
                      <div>
                        <p className="font-semibold">{testimonial.name}</p>
                        <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                      </div>
                    </div>
                    <div className="flex mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    </div>
                    <p className="text-sm text-muted-foreground">"{testimonial.text}"</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="w-full py-12 bg-gradient-to-br from-black via-gray-900 to-black">
          <div className="container px-4 md:px-6 max-w-[800px] mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Don't Miss This Black Friday Deal
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              30% off ends November 29th. Stock is limited.
            </p>
            <Button
              onClick={handleAddToCart}
              size="lg"
              className="bg-gradient-to-r from-yellow-500 to-yellow-400 hover:from-yellow-400 hover:to-yellow-500 text-black font-bold text-lg px-12 py-7 rounded-full shadow-2xl hover:scale-105 transition-all"
            >
              <ShoppingCart className="w-5 h-5 mr-2" />
              Get 30% Off Now
            </Button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-gray-200 bg-gray-50">
        <div className="container px-4 py-8 md:px-6">
          <div className="text-center text-sm text-gray-500">
            <p className="mb-2">© 2024 Dr. Sebi Approved LLC. All rights reserved.</p>
            <p className="text-xs text-gray-400">
              These statements have not been evaluated by the FDA. This product is not intended to diagnose, treat, cure, or prevent any disease.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
