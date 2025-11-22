'use client';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Shield, Star, ArrowRight, Leaf, Clock, Wind, Heart, Users, Zap, Award, AlertCircle, Droplets, Activity, Target, Gift, Snowflake } from 'lucide-react'
import Image from "next/image"
import { useState } from 'react';
import Header from "@/components/Header";
import CountdownTimer from "@/components/CountdownTimer";
import WinBackOptIn from "@/components/WinBackOptIn";
import { useProductTracking } from "@/hooks/useProductTracking";

export default function MucusWinBackPage() {
  const [hasOptedIn, setHasOptedIn] = useState(false);
  const [discountCode, setDiscountCode] = useState('');

  // Initialize product tracking
  const { trackCTAClick } = useProductTracking({
    productName: 'Mucus Cleanser - Win-Back',
    productSlug: 'mucus-cleanser-winback',
    price: 24.99
  });

  const handleOptInSuccess = (code: string) => {
    setDiscountCode(code);
    setHasOptedIn(true);
    // Scroll to top to show checkout CTA
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const handleCTAClick = () => {
    trackCTAClick('checkout-cta');
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      {/* Spacer for fixed header */}
      <div className="h-[5.5rem]"></div>

      <main className="flex-1">
        {/* Hero Section with Product Image & Pricing */}
        <section className="relative overflow-hidden bg-gradient-to-b from-white to-cyan-500/10 pt-12 pb-16">
          {/* Background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-green-500/5 rounded-full blur-3xl" />
          </div>

          <div className="container relative mx-auto px-3 sm:px-4 max-w-[1200px]">
            {/* Top Badge */}
            <div className="text-center mb-6 sm:mb-8">
              <div className="inline-flex items-center rounded-lg bg-red-500/10 px-3 sm:px-4 py-2 text-xs sm:text-sm text-red-600 mb-3 sm:mb-4 border-2 border-red-500/20">
                <Snowflake className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                <span className="font-semibold">FLU SEASON SPECIAL - RETURNING CUSTOMERS ONLY</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-3 sm:mb-4 leading-tight px-2">
                We Miss You!
                <span className="text-green-600 block mt-2">Save $15 on Your</span>
                <span className="text-cyan-600 block">Mucus Cleanser Restock</span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-gray-700 max-w-[700px] mx-auto mb-4 sm:mb-6 px-2">
                <strong>Flu season is here.</strong> Protect yourself with the same powerful formula that gave you relief before.
              </p>
            </div>

            {/* Product Showcase & Pricing */}
            <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-start max-w-5xl mx-auto mb-8 sm:mb-12">
              {/* Left: Product Image */}
              <div className="flex flex-col items-center">
                <div className="relative w-full max-w-md bg-gradient-to-br from-cyan-500/10 to-blue-500/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 mb-4 sm:mb-6 border-2 border-cyan-500/20">
                  <Image
                    src="/mucus.png"
                    alt="Dr. Sebi's Mucus Cleanser"
                    width={400}
                    height={400}
                    className="w-full h-auto object-contain"
                    priority
                  />
                  <div className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-cyan-500 text-white px-2 py-1 sm:px-4 sm:py-2 rounded-full font-bold text-xs sm:text-sm shadow-lg">
                    RESPIRATORY SUPPORT
                  </div>
                </div>

                {/* Product Details */}
                <div className="space-y-2 sm:space-y-3 w-full max-w-md">
                  {[
                    { icon: Wind, text: "Eliminates excess mucus naturally" },
                    { icon: Activity, text: "Supports respiratory health" },
                    { icon: Droplets, text: "Cellular cleansing & detoxification" },
                    { icon: Award, text: "Handmade for maximum potency" }
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-2 sm:gap-3 bg-white/80 backdrop-blur-sm rounded-lg p-2 sm:p-3 border border-cyan-500/20">
                      <item.icon className="h-4 w-4 sm:h-5 sm:w-5 text-cyan-600 flex-shrink-0" />
                      <span className="text-sm sm:text-base text-gray-700 font-medium">{item.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right: Pricing & Opt-In */}
              <div className="flex flex-col justify-center">
                {!hasOptedIn ? (
                  <div className="space-y-4 sm:space-y-6">
                    {/* Countdown Timer */}
                    <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-xl border-2 border-red-500/20">
                      <p className="text-center text-sm sm:text-base md:text-lg font-semibold text-gray-700 mb-3 sm:mb-4">
                        ⏰ Your Exclusive Offer Expires In:
                      </p>
                      <CountdownTimer hours={72} />
                    </div>

                    {/* Pricing Display */}
                    <div className="bg-gradient-to-r from-green-50 to-cyan-50 rounded-2xl p-4 sm:p-6 md:p-8 border-2 border-green-500/30">
                      <p className="text-center text-xs sm:text-sm text-gray-600 mb-2">Regular Price</p>
                      <p className="text-center text-2xl sm:text-3xl font-bold text-gray-400 line-through mb-3 sm:mb-4">$39.99</p>

                      <div className="flex items-center justify-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                        <ArrowRight className="w-4 h-4 sm:w-6 sm:h-6 text-green-600 flex-shrink-0" />
                        <div className="text-center">
                          <p className="text-xs sm:text-sm text-green-600 font-semibold mb-1">Your Return Customer Price</p>
                          <p className="text-3xl sm:text-4xl md:text-5xl font-bold text-green-600">$24.99</p>
                        </div>
                        <ArrowRight className="w-4 h-4 sm:w-6 sm:h-6 text-green-600 flex-shrink-0" />
                      </div>

                      <div className="bg-white rounded-lg p-3 sm:p-4 text-center border border-green-500/30">
                        <p className="text-xl sm:text-2xl font-bold text-green-600 mb-1">Save $15</p>
                        <p className="text-xs sm:text-sm text-gray-600">That's 37% OFF just for returning!</p>
                      </div>
                    </div>

                    {/* Opt-In Form */}
                    <div className="bg-gradient-to-br from-cyan-500/5 to-green-500/5 rounded-2xl p-1">
                      <WinBackOptIn onSuccess={handleOptInSuccess} className="!shadow-none" />
                    </div>
                  </div>
                ) : (
                  <div className="bg-gradient-to-br from-green-500/10 to-cyan-500/10 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 border-2 border-green-500/30 shadow-xl">
                    <div className="text-center mb-4 sm:mb-6">
                      <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 bg-green-600 rounded-full mb-3 sm:mb-4">
                        <CheckCircle className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                        Your Discount is Active!
                      </h2>
                      <p className="text-sm sm:text-base text-gray-600">Code: <strong className="text-green-600 text-lg sm:text-xl">{discountCode}</strong></p>
                    </div>

                    <div className="space-y-3 sm:space-y-4">
                      <a
                        href={`/checkout?product=mucus-cleanser&coupon=${discountCode}`}
                        onClick={handleCTAClick}
                        className="block w-full bg-green-600 hover:bg-green-700 text-white px-4 sm:px-6 md:px-8 py-4 sm:py-5 md:py-6 text-base sm:text-lg md:text-xl text-center font-bold shadow-lg rounded-lg transition-colors"
                      >
                        Get My Mucus Cleanser for $24.99 →
                      </a>

                      <p className="text-xs sm:text-sm text-gray-600 text-center">
                        ✅ Your code will be automatically applied at checkout
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Why Now? Flu Season Section */}
        <section className="py-8 sm:py-12 md:py-16 bg-white">
          <div className="container mx-auto px-3 sm:px-4 max-w-[1200px]">
            <div className="text-center mb-8 sm:mb-10 md:mb-12">
              <div className="inline-flex items-center gap-2 bg-red-50 px-3 sm:px-4 py-2 rounded-lg mb-3 sm:mb-4">
                <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600" />
                <span className="text-sm sm:text-base text-red-600 font-semibold">Flu Season Alert</span>
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4 px-2">
                Why Restock Your Mucus Cleanser NOW?
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 max-w-[700px] mx-auto px-2">
                November through March is peak flu season. Don't wait until symptoms hit.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              <Card className="border-2 border-red-500/20 bg-gradient-to-br from-red-50 to-white">
                <CardHeader>
                  <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center mb-4">
                    <Snowflake className="w-8 h-8 text-red-600" />
                  </div>
                  <CardTitle className="text-xl">Flu Season Protection</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    Peak flu season runs November through March. Stock up NOW before symptoms start, not after.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-cyan-500/20 bg-gradient-to-br from-cyan-50 to-white">
                <CardHeader>
                  <div className="w-14 h-14 bg-cyan-500/10 rounded-full flex items-center justify-center mb-4">
                    <Wind className="w-8 h-8 text-cyan-600" />
                  </div>
                  <CardTitle className="text-xl">Clear Breathing</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    Remember how it felt to breathe clearly? Eliminate excess mucus before winter congestion hits.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-2 border-green-500/20 bg-gradient-to-br from-green-50 to-white">
                <CardHeader>
                  <div className="w-14 h-14 bg-green-500/10 rounded-full flex items-center justify-center mb-4">
                    <Target className="w-8 h-8 text-green-600" />
                  </div>
                  <CardTitle className="text-xl">Root Cause Solution</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    Dr. Sebi taught: "Mucus is the cause of every disease." Address it at the cellular level.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* What's Inside - Formula Breakdown */}
        <section className="py-16 bg-gradient-to-b from-white to-cyan-500/5">
          <div className="container mx-auto px-3 sm:px-4 max-w-[1200px]">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                The Same Powerful Formula You Trust
              </h2>
              <p className="text-xl text-gray-600">
                Dr. Sebi's authentic blend — nothing has changed since you last ordered.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white rounded-lg p-6 shadow-md border border-cyan-500/20">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Leaf className="w-8 h-8 text-cyan-600" />
                  </div>
                  <h3 className="font-bold text-lg">Cascara Sagrada</h3>
                </div>
                <p className="text-sm text-gray-600 text-center">
                  Gentle yet powerful bowel cleanser that helps eliminate mucus from digestive tract
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md border border-cyan-500/20">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Wind className="w-8 h-8 text-cyan-600" />
                  </div>
                  <h3 className="font-bold text-lg">Mullein Root</h3>
                </div>
                <p className="text-sm text-gray-600 text-center">
                  Traditional respiratory herb that breaks up chest congestion and mucus buildup
                </p>
              </div>

              <div className="bg-white rounded-lg p-6 shadow-md border border-cyan-500/20">
                <div className="text-center mb-4">
                  <div className="w-16 h-16 bg-cyan-500/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Zap className="w-8 h-8 text-cyan-600" />
                  </div>
                  <h3 className="font-bold text-lg">African Bird Pepper</h3>
                </div>
                <p className="text-sm text-gray-600 text-center">
                  Boosts circulation and helps carry herbal compounds to every cell in your body
                </p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <div className="inline-flex items-center gap-3 bg-white rounded-full px-6 py-3 shadow-md border border-cyan-500/20">
                <Award className="w-5 h-5 text-cyan-600" />
                <span className="text-gray-700 font-medium">Handmade for Maximum Potency</span>
              </div>
            </div>
          </div>
        </section>

        {/* Dr. Sebi Quote */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-3 sm:px-4 max-w-[1200px]">
            <div className="bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-cyan-500/10 rounded-3xl p-8 md:p-12 max-w-4xl mx-auto border-2 border-cyan-500/20">
              <div className="text-center">
                <div className="w-20 h-20 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Wind className="w-10 h-10 text-cyan-600" />
                </div>
                <blockquote className="text-2xl md:text-3xl font-medium text-foreground mb-6 italic relative">
                  <span className="absolute -top-4 -left-4 text-6xl text-cyan-500/30">"</span>
                  <span className="relative z-10">
                    Mucus is the cause of every disease. Eliminate the mucus and you eliminate the disease.
                  </span>
                  <span className="absolute -bottom-4 -right-4 text-6xl text-cyan-500/30">"</span>
                </blockquote>
                <p className="text-lg font-semibold text-cyan-600">— Dr. Sebi's Teaching</p>
              </div>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section className="py-16 bg-gradient-to-b from-white to-cyan-500/5">
          <div className="container mx-auto px-3 sm:px-4 max-w-[1200px]">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Customers Keep Coming Back
              </h2>
              <p className="text-xl text-gray-600">
                You're not alone — thousands restock their Mucus Cleanser every flu season.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              <Card className="bg-white shadow-lg border-2 border-cyan-500/20">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic leading-relaxed">
                    "I order this every year before winter hits. Last time I ran out during flu season — never again! My breathing stays clear, and I don't get the usual congestion."
                  </p>
                  <p className="font-semibold text-gray-900">— Returning Customer Since 2021</p>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-lg border-2 border-cyan-500/20">
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-gray-700 mb-4 italic leading-relaxed">
                    "This is my fourth bottle. I can literally feel the difference in my respiratory system within days. At $24.99, it's a no-brainer to stock up before the holiday rush."
                  </p>
                  <p className="font-semibold text-gray-900">— Loyal Customer</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        {hasOptedIn && (
          <section className="py-16 bg-gradient-to-b from-white to-green-500/10">
            <div className="container mx-auto px-3 sm:px-4 max-w-[800px]">
              <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-2 border-green-500/30">
                <div className="text-center mb-8">
                  <div className="inline-flex items-center rounded-lg bg-red-500/10 px-4 py-2 text-sm text-red-600 mb-4 border-2 border-red-500/20">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="font-semibold">LIMITED TIME - 72 HOURS ONLY</span>
                  </div>

                  <h2 className="text-3xl md:text-4xl font-bold mb-4">
                    Don't Wait Until You're Sick
                  </h2>

                  <p className="text-xl text-gray-600 mb-6">
                    Stock up NOW while you have this exclusive 37% discount. Once the timer hits zero, this offer disappears forever.
                  </p>

                  <div className="mb-8">
                    <CountdownTimer hours={72} />
                  </div>
                </div>

                <a
                  href={`/checkout?product=mucus-cleanser&coupon=${discountCode}`}
                  onClick={handleCTAClick}
                  className="block w-full bg-green-600 hover:bg-green-700 text-white px-8 py-6 text-xl text-center font-bold shadow-lg rounded-lg transition-colors mb-6"
                >
                  Get My Mucus Cleanser for $24.99 →
                </a>

                <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Free Shipping on 2+ Items</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <span>Secure Checkout</span>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t py-8">
        <div className="container mx-auto px-3 sm:px-4 text-center text-sm text-gray-600">
          <p className="mb-2">
            <strong>Disclaimer:</strong> These statements have not been evaluated by the Food and Drug Administration.
            This product is not intended to diagnose, treat, cure, or prevent any disease.
          </p>
          <p>&copy; {new Date().getFullYear()} Dr. Sebi Approved. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
