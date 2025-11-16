'use client';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Leaf, Shield, Zap, Star, ArrowRight } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"
import { useState } from 'react';
import Header from "@/components/Header";

interface BuyButtonProps {
  variant?: 'default' | 'hero';
}

const BuyButton = ({ variant = 'default' }: BuyButtonProps) => {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleBuyNow = () => {
    // Track GA4 begin_checkout event
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'begin_checkout', {
        currency: 'USD',
        value: 89.99,
        items: [{
          item_name: 'ParaCleanse Elite Package',
          category: 'Health Supplements',
          quantity: quantity,
          price: 89.99
        }]
      });
    }
    
    // Redirect to checkout page
    window.location.href = '/checkout?product=paracleanse';
  };

  const scrollToPackage = () => {
    const packageSection = document.querySelector('.paracleanse-package');
    if (packageSection) {
      const headerOffset = 80;
      const elementPosition = packageSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return variant === "hero" ? (
    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start w-full sm:w-auto mb-6">
      <Button 
        size="lg" 
        className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-8 py-6 text-lg shadow-lg shadow-primary/25 hover:translate-y-[1px] transition-all"
        onClick={scrollToPackage}
      >
        Start Your Transformation
      </Button>
      <Link href="/quiz">
        <Button 
          size="lg" 
          variant="outline" 
          className="rounded-full px-8 py-6 text-lg hover:bg-primary/5 border-primary text-primary"
        >
          Take Quiz
        </Button>
      </Link>
    </div>
  ) : (
    <div className="flex items-center gap-4">
      <div className="flex items-center border rounded-lg">
        <button 
          onClick={() => setQuantity(Math.max(1, quantity - 1))}
          className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-l-lg"
        >
          -
        </button>
        <span className="px-4 py-2 text-gray-800">{quantity}</span>
        <button 
          onClick={() => setQuantity(quantity + 1)}
          className="px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-r-lg"
        >
          +
        </button>
      </div>
      <Button 
        onClick={handleBuyNow} 
        disabled={isLoading}
        className="bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-2 rounded-md shadow-lg shadow-primary/25 hover:translate-y-[1px] transition-all"
      >
        {isLoading ? 'Processing...' : `Buy Now - $${(89.99 * quantity).toFixed(2)}`}
      </Button>
    </div>
  );
};

export default function ParaCleansePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      {/* Spacer for fixed header */}
      <div className="h-[5.5rem]"></div>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-white to-accent/10 pt-12 md:pt-16 pb-12">
          {/* Background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2" />
            <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          
          <div className="container relative mx-auto px-4 max-w-[1440px]">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center mt-6 md:mt-8">
              {/* Text Content - Left Side */}
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <div className="inline-flex items-center rounded-lg bg-primary/10 px-3 py-1 text-sm text-primary mb-4">
                  <span className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4" />
                    Dr. Sebi's Original Formula
                  </span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-foreground mb-4 leading-tight max-w-[600px]">
                  Reclaim Your Health with Nature's Most Powerful Cleanse
                </h1>

                {/* Product Images - Mobile Only */}
                <div className="lg:hidden w-full mb-6">
                  <div className="relative flex justify-center items-center gap-4">
                    {/* ParaWash */}
                    <div className="relative group">
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary/90 text-white text-sm font-medium px-4 py-1 rounded-full shadow-lg">
                        Phase 1: Biofilm Disruptor
                      </div>
                      <Image
                        src="/images/a-professional-product-photograph-of-a-w_zeo86TvIQFau7gWgbBC4-w_CZQgJHF8T3a9i_QJIFkMfQ-removebg-preview.png"
                        alt="ParaWash Biofilm Disruptor"
                        width={960}
                        height={960}
                        className="w-[250px] sm:w-[300px] h-auto object-contain -rotate-3 hover:scale-105 transition-transform duration-300"
                        priority
                      />
                    </div>

                    {/* Connecting arrow */}
                    <div className="flex flex-col items-center justify-center px-2">
                      <ArrowRight className="w-10 h-10 text-primary" />
                      <span className="text-sm text-primary font-medium mt-1">Then</span>
                    </div>

                    {/* Intracellular Cleanse */}
                    <div className="relative group">
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary/90 text-white text-sm font-medium px-4 py-1 rounded-full shadow-lg">
                        Phase 2: Deep Cleanse
                      </div>
                      <Image
                        src="/images/cellular.png"
                        alt="Intracellular Body Cleanse"
                        width={960}
                        height={960}
                        className="w-[250px] sm:w-[300px] h-auto object-contain rotate-3 hover:scale-105 transition-transform duration-300"
                        priority
                      />
                    </div>
                  </div>
                </div>

                <p className="text-lg sm:text-xl text-muted-foreground mb-6 max-w-[540px] leading-relaxed">
                  Experience our powerful two-phase cleanse: ParaWash first dissolves biofilms with our powerful anti-parasite formula, then our intracellular cleanse sweeps parasites away. Dr. Sebi's authentic formula for complete parasite elimination.
                </p>

                <BuyButton variant="hero" />

                <div className="grid grid-cols-3 gap-4 sm:gap-6 w-full max-w-[540px] border rounded-xl p-4 sm:p-6 bg-card/50 backdrop-blur-sm">
                  <div className="flex flex-col items-center lg:items-start">
                    <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">50K+</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Satisfied Customers</div>
                  </div>
                  <div className="flex flex-col items-center lg:items-start">
                    <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">30+</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Years of Legacy</div>
                  </div>
                  <div className="flex flex-col items-center lg:items-start">
                    <div className="text-2xl sm:text-3xl font-bold text-primary mb-1">100%</div>
                    <div className="text-xs sm:text-sm text-muted-foreground">Natural Ingredients</div>
                  </div>
                </div>
              </div>

              {/* Product Images - Desktop Only */}
              <div className="hidden lg:flex w-full justify-center items-center">
                <div className="relative flex justify-center items-center gap-4 lg:gap-6">
                  {/* ParaWash */}
                  <div className="relative group">
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary/90 text-white text-sm font-medium px-4 py-1 rounded-full shadow-lg">
                      Phase 1: Biofilm Disruptor
                    </div>
                    <Image
                      src="/images/a-professional-product-photograph-of-a-w_zeo86TvIQFau7gWgbBC4-w_CZQgJHF8T3a9i_QJIFkMfQ-removebg-preview.png"
                      alt="ParaWash Biofilm Disruptor"
                      width={960}
                      height={960}
                      className="w-[250px] sm:w-[300px] md:w-[350px] lg:w-[400px] h-auto object-contain -rotate-3 hover:scale-105 transition-transform duration-300"
                      priority
                    />
                  </div>

                  {/* Connecting arrow */}
                  <div className="flex flex-col items-center justify-center px-2 lg:px-4">
                    <ArrowRight className="w-10 h-10 lg:w-14 lg:h-14 text-primary" />
                    <span className="text-sm lg:text-base text-primary font-medium mt-1">Then</span>
                  </div>

                  {/* Intracellular Cleanse */}
                  <div className="relative group">
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-primary/90 text-white text-sm font-medium px-4 py-1 rounded-full shadow-lg">
                      Phase 2: Deep Cleanse
                    </div>
                    <Image
                      src="/images/cellular.png"
                      alt="Intracellular Body Cleanse"
                      width={960}
                      height={960}
                      className="w-[250px] sm:w-[300px] md:w-[350px] lg:w-[400px] h-auto object-contain rotate-3 hover:scale-105 transition-transform duration-300"
                      priority
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Symptoms Warning Section */}
        <section id="symptoms" className="w-full py-24 bg-white">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center mb-12">
              <span className="text-red-600 font-medium">⚠️ WARNING SIGNS</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4 text-red-900">Are Hidden Parasites Stealing Your Life Away?</h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                <strong>Every day you wait, parasites multiply and spread deeper</strong> into your system. These silent invaders are robbing you of energy, clouding your mind, and slowly destroying your health from the inside out. <span className="text-red-600 font-semibold">If you're experiencing any of these symptoms, you could be hosting millions of these parasites right now...</span>
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                { 
                  icon: <Zap className="h-8 w-8 text-red-500" />, 
                  title: "Crushing Fatigue That Won't Go Away", 
                  desc: "No matter how much you sleep, you wake up exhausted. Parasites are literally feeding off your nutrients 24/7, leaving you drained and lifeless. Every day feels like you're running on empty." 
                },
                { 
                  icon: <Shield className="h-8 w-8 text-red-500" />, 
                  title: "Gut-Wrenching Digestive Torture", 
                  desc: "Constant bloating makes you look pregnant. Painful gas that embarrasses you in public. Unpredictable bathroom emergencies that control your life. Parasites are destroying your digestive system from within." 
                },
                { 
                  icon: <CheckCircle className="h-8 w-8 text-red-500" />, 
                  title: "Mind-Numbing Brain Fog", 
                  desc: "You can't think clearly anymore. Simple decisions feel impossible. You forget important things constantly. Parasitic toxins are literally poisoning your brain, making you feel like a shadow of your former self." 
                },
              ].map((item, i) => (
                <Card key={i} className="relative overflow-hidden border-2 hover:border-primary transition-colors">
                  <CardHeader>
                    <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-full"></div>
                    <div className="text-primary mb-4">{item.icon}</div>
                    <CardTitle className="text-xl mb-2">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            {/* Urgency CTA after symptoms */}
            <div className="max-w-2xl mx-auto mt-16 text-center">
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8">
                <h3 className="text-2xl font-bold text-red-900 mb-4">
                  Don't Let Parasites Rob Another Day of Your Life
                </h3>
                <p className="text-red-700 mb-6 text-lg">
                  Right now, while you're reading this, parasites are multiplying inside you. Every hour you delay treatment, they're getting stronger and harder to eliminate. The longer you wait, the more damage they cause to your body, your energy, and your quality of life.
                </p>
                <p className="text-red-800 font-semibold mb-8">
                  Stop suffering in silence. Take back control of your health TODAY.
                </p>
                <Button 
                  size="lg" 
                  className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg font-semibold shadow-lg animate-pulse"
                  onClick={() => document.getElementById('solution')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Get Your Life Back Now - 55% Off Today Only
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Solution Section */}
        <section id="solution" className="w-full py-24 bg-gradient-to-b from-white to-accent/20">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="text-primary font-medium">The Solution</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
                A Complete Cleansing System Backed by 30+ Years of Success
              </h2>
              <p className="text-lg text-muted-foreground">
                Dr. Sebi's comprehensive approach combines traditional wisdom with proven natural ingredients to create the most effective cleansing system available.
              </p>
            </div>
            
            <div className="grid gap-12 lg:grid-cols-2 items-start">
              <div className="order-2 lg:order-1">
                <div className="space-y-12">
                  <div className="relative">
                    <div className="absolute -left-4 top-0 h-full w-1 bg-primary/20 rounded-full">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary"></div>
                    </div>
                    <div className="pl-6">
                      <h3 className="text-2xl font-bold mb-4">Phase 1: ParaWash Biofilm Disruptor</h3>
                      <p className="text-muted-foreground mb-6">
                        The critical first phase uses ParaWash to break down protective biofilms, exposing parasites and making them vulnerable:
                      </p>
                      <ul className="space-y-4">
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                          <div>
                            <span className="font-medium block mb-1">Biofilm Dissolution</span>
                            <span className="text-muted-foreground">Dysphania ambrosioides actively breaks down the protective shields that parasites hide behind</span>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                          <div>
                            <span className="font-medium block mb-1">Paralyzing Action</span>
                            <span className="text-muted-foreground">Powerful compounds immobilize parasites, preventing them from maintaining their grip</span>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                          <div>
                            <span className="font-medium block mb-1">Maximum Potency Formula</span>
                            <span className="text-muted-foreground">Precisely balanced blend ensures optimal biofilm disruption</span>
                          </div>
                        </li>
                      </ul>
                      <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                        <p className="text-sm font-medium text-primary">Key Ingredients</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          • Dysphania ambrosioides (Primary active compound)<br />
                          • Wormwood (Artemisia absinthium)<br />
                          • Black Walnut Hull<br />
                          • Dr. Sebi Approved Proprietary Blend
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute -left-4 top-0 h-full w-1 bg-primary/20 rounded-full">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full bg-primary"></div>
                    </div>
                    <div className="pl-6">
                      <h3 className="text-2xl font-bold mb-4">Phase 2: Intracellular Body Cleanse</h3>
                      <p className="text-muted-foreground mb-6">
                        Once biofilms are disrupted, our powerful intracellular cleanse sweeps away parasites and restores cellular health:
                      </p>
                      <ul className="space-y-4">
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                          <div>
                            <span className="font-medium block mb-1">Deep Cellular Cleansing</span>
                            <span className="text-muted-foreground">Penetrates cells to eliminate parasites and their toxins at the source</span>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                          <div>
                            <span className="font-medium block mb-1">Complete Elimination</span>
                            <span className="text-muted-foreground">Ensures thorough removal of weakened parasites and their waste products</span>
                          </div>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                          <div>
                            <span className="font-medium block mb-1">Cellular Restoration</span>
                            <span className="text-muted-foreground">Supports cell regeneration and optimal function after cleansing</span>
                          </div>
                        </li>
                      </ul>
                      <div className="mt-6 p-4 bg-primary/5 rounded-lg">
                        <p className="text-sm font-medium text-primary">Key Ingredients</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          • Cascara Sagrada (Deep cleansing)<br />
                          • Rhammus Purshiana (Cellular support)<br />
                          • Brickellia Grandiflora (Restoration)<br />
                          • Dr. Sebi's Proprietary Blend
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="order-1 lg:order-2 lg:sticky lg:top-24">
                <Card className="paracleanse-package max-w-lg mx-auto">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div>
                        <h3 className="text-2xl font-bold">ParaCleanse Elite Package</h3>
                        <div className="space-y-1 mt-2">
                          <div className="text-sm text-muted-foreground">
                            Regular Price: <span className="line-through">$199.98</span>
                          </div>
                          <div className="text-3xl font-bold text-primary">
                            Today Only: $59.99
                          </div>
                          <div className="inline-flex items-center bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                            YOU SAVE: $110.99 (55% OFF)
                          </div>
                        </div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <Image
                          src="/images/a-professional-product-photograph-of-a-w_zeo86TvIQFau7gWgbBC4-w_CZQgJHF8T3a9i_QJIFkMfQ-removebg-preview.png"
                          alt="ParaWash Phase 1"
                          width={80}
                          height={80}
                          className="w-20 h-20 object-contain"
                        />
                        <div>
                          <h4 className="font-semibold">Phase 1: ParaWash</h4>
                          <p className="text-sm text-muted-foreground">Biofilm Disruptor Formula</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <Image
                          src="/images/cellular.png"
                          alt="Phase 2 Intracellular Cleanse"
                          width={80}
                          height={80}
                          className="w-20 h-20 object-contain"
                        />
                        <div>
                          <h4 className="font-semibold">Phase 2: Intracellular Cleanse</h4>
                          <p className="text-sm text-muted-foreground">Deep Cellular Cleansing System</p>
                        </div>
                      </div>

                      <div className="space-y-2 pt-4">
                        <h4 className="font-semibold text-sm">Package Includes:</h4>
                        <div className="space-y-2">
                          {[
                            "Complete 2-Phase Cleansing System",
                            "14-Day Supply (Full Treatment)",
                            "Detailed Instructions & Protocol",
                            "Free US Shipping",
                            "30-Day Money Back Guarantee"
                          ].map((item, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <CheckCircle className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                              <span className="text-sm">{item}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pt-4">
                        <Link href="/checkout?product=paracleanse">
                          <Button className="w-full bg-primary hover:bg-primary/90 text-white py-6 text-lg font-semibold shadow-lg">
                            Proceed to Secure Checkout
                          </Button>
                        </Link>
                        <div className="flex items-center justify-center gap-2 mt-3 text-xs text-muted-foreground">
                          <Shield className="h-4 w-4" />
                          <span>Secure Checkout • SSL Protected • 30-Day Guarantee</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section id="timeline" className="w-full py-24 bg-white">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="text-primary font-medium">Your Journey</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
                What to Expect During Your 14-Day Cleanse
              </h2>
              <p className="text-lg text-muted-foreground">
                Experience the progressive benefits as your body eliminates parasites and restores optimal health.
              </p>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="relative">
                {/* Timeline line */}
                <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 top-0 bottom-0 w-1 bg-primary/20"></div>
                
                <div className="space-y-16">
                  {[
                    {
                      day: "Days 1-3",
                      title: "Initial Biofilm Disruption",
                      description: "ParaWash begins breaking down protective biofilms. You may experience mild detox symptoms as parasites are exposed and begin to weaken.",
                      symptoms: ["Mild headaches possible", "Slight fatigue", "Beginning of parasite die-off"]
                    },
                    {
                      day: "Days 4-7", 
                      title: "Parasite Elimination Begins",
                      description: "As biofilms dissolve, parasites lose their protection. The intracellular cleanse begins eliminating weakened parasites from your system.",
                      symptoms: ["Increased energy starting", "Better sleep quality", "Digestive improvements"]
                    },
                    {
                      day: "Days 8-11",
                      title: "Deep Cellular Cleansing", 
                      description: "Intensive elimination of parasites and toxins. Your body begins recovering and regenerating at the cellular level.",
                      symptoms: ["Clearer thinking", "Reduced bloating", "Improved bowel movements"]
                    },
                    {
                      day: "Days 12-14",
                      title: "Restoration & Renewal",
                      description: "Final elimination phase and cellular restoration. Your body completes the cleanse and begins optimal function.",
                      symptoms: ["Dramatically increased energy", "Mental clarity returns", "Overall vitality restored"]
                    }
                  ].map((phase, i) => (
                    <div key={i} className="relative flex items-start gap-8 md:gap-12">
                      {/* Timeline marker */}
                      <div className="absolute left-0 md:left-1/2 md:-translate-x-1/2 w-8 h-8 bg-primary rounded-full flex items-center justify-center z-10">
                        <div className="w-4 h-4 bg-white rounded-full"></div>
                      </div>
                      
                      {/* Content */}
                      <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right md:pr-12' : 'md:pl-12'} pl-12 md:pl-0`}>
                        <Card className="max-w-md md:max-w-lg mx-auto md:mx-0">
                          <CardHeader>
                            <div className="text-primary font-medium text-sm">{phase.day}</div>
                            <CardTitle className="text-xl">{phase.title}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <p className="text-muted-foreground mb-4">{phase.description}</p>
                            <div className="space-y-2">
                              <p className="text-sm font-medium">What You'll Experience:</p>
                              {phase.symptoms.map((symptom, j) => (
                                <div key={j} className="flex items-center gap-2">
                                  <CheckCircle className="h-3 w-3 text-primary flex-shrink-0" />
                                  <span className="text-sm text-muted-foreground">{symptom}</span>
                                </div>
                              ))}
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="text-center mt-16">
              <div className="bg-primary/5 rounded-2xl p-8 max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold mb-4">Ready to Start Your Transformation?</h3>
                <p className="text-muted-foreground mb-6">
                  Join thousands who have successfully eliminated parasites and reclaimed their health with Dr. Sebi's proven two-phase system.
                </p>
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-white px-8 py-4 text-lg"
                  onClick={() => document.querySelector('.paracleanse-package')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Get Your ParaCleanse Elite Package
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="w-full py-24 bg-gradient-to-b from-accent/20 to-white">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <span className="text-primary font-medium">Start Your Journey</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
                Transform Your Health Today
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands who have already discovered the power of Dr. Sebi's authentic cleansing system. Your path to optimal health begins here.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-6 text-lg"
                  onClick={() => document.querySelector('.paracleanse-package')?.scrollIntoView({ behavior: 'smooth' })}
                >
                  Order Your Package Now
                </Button>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-5 w-5" />
                  <span>110% Dr. Sebi Approved</span>
                </div>
              </div>
              <div className="grid gap-6 md:grid-cols-3">
                <div className="flex flex-col items-center p-6 bg-accent/5 rounded-2xl">
                  <Shield className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-semibold mb-2">100% Authentic</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Original Dr. Sebi formula made in Honduras
                  </p>
                </div>
                <div className="flex flex-col items-center p-6 bg-accent/5 rounded-2xl">
                  <Leaf className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-semibold mb-2">Natural Ingredients</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Pure, potent herbs and compounds
                  </p>
                </div>
                <div className="flex flex-col items-center p-6 bg-accent/5 rounded-2xl">
                  <Zap className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-semibold mb-2">Fast Results</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    See improvements in just weeks
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="w-full border-t border-border bg-white">
        <div className="container px-4 py-12 md:px-6">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Leaf className="h-6 w-6 text-primary" />
              <span className="ml-2 text-lg font-bold">Dr. Sebi Approved LLC</span>
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Continuing Dr. Sebi's mission of bringing natural healing to the world.
            </p>
            <div className="flex flex-col md:flex-row justify-center items-center gap-4 text-xs text-muted-foreground">
              <Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link>
              <span>© 2024 Dr. Sebi Approved LLC. All rights reserved.</span>
            </div>
            <p className="text-xs text-muted-foreground mt-4">
              These statements have not been evaluated by the FDA. This product is not intended to diagnose, treat, cure, or prevent any disease.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}