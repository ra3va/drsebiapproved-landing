'use client';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Leaf, Shield, Zap, Star, ArrowRight, Menu } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"
import { initiateCheckout } from '@/utils/shopify';
import { useState } from 'react';
import Header from "@/components/Header";

interface BuyButtonProps {
  variant?: 'default' | 'hero';
}

const BuyButton = ({ variant = 'default' }: BuyButtonProps) => {
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  const handleBuyNow = async () => {
    try {
      setIsLoading(true);
      
      // Track GA4 begin_checkout event
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'begin_checkout', {
          currency: 'USD',
          value: 89.99,
          items: [{
            item_id: process.env.NEXT_PUBLIC_PRODUCT_ID,
            item_name: 'ParaCleanse Elite Package',
            category: 'Health Supplements',
            quantity: quantity,
            price: 89.99
          }]
        });
      }
      
      const checkoutUrl = await initiateCheckout(process.env.NEXT_PUBLIC_PRODUCT_ID!, quantity);
      window.location.href = checkoutUrl;
    } catch (error) {
      console.error('Error during checkout:', error);
      setIsLoading(false);
    }
  };

  const scrollToPackage = () => {
    // Account for the fixed header height (approximately 80px)
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
        className="rounded-full bg-primary text-white"
      >
        {isLoading ? 'Processing...' : 'Claim Your Package Now'}
      </Button>
    </div>
  );
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      {/* Spacer for fixed header */}
      <div className="h-[5.5rem]"></div>

      <main className="flex-1">
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
                            Today Only: $89.99
                          </div>
                          <div className="inline-flex items-center bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                            YOU SAVE: $110.99 (55% OFF)
                          </div>
                        </div>
                      </div>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4 mb-8">
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium">Total Body Cleanse Formula</span>
                          <p className="text-sm text-muted-foreground">Complete 2-week intensive cleansing protocol</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium">Advanced Parasite Cleanse</span>
                          <p className="text-sm text-muted-foreground">Two powerful phases for maximum effectiveness</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium">Complete Guide & Support</span>
                          <p className="text-sm text-muted-foreground">Step-by-step instructions for optimal results</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <span className="font-medium">110% Dr. Sebi Approved</span>
                          <p className="text-sm text-muted-foreground">Authentic formula made in Honduras</p>
                        </div>
                      </div>
                    </div>
                    <BuyButton />
                    <div className="mt-6 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                      <Shield className="h-4 w-4" />
                      <span>Authentic Dr. Sebi Formula - Made in Honduras</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        <section id="timeline" className="w-full py-24 bg-white">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="text-primary font-medium">Treatment Timeline</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
                Your 14-Day Intensive Cleanse Journey
              </h2>
              <p className="text-lg text-muted-foreground">
                Our scientifically designed two-phase protocol maximizes effectiveness through targeted cleansing stages.
              </p>
            </div>

            <div className="grid gap-12 lg:grid-cols-2">
              {/* Phase 1 */}
              <div className="relative bg-accent/5 rounded-3xl p-8">
                <div className="absolute -top-6 left-8 bg-primary text-white text-sm font-medium px-6 py-2 rounded-full shadow-lg">
                  Phase 1: Days 1-7
                </div>
                <div className="mt-4">
                  <h3 className="text-xl font-semibold text-primary mb-4">Biofilm Dissolution Phase</h3>
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="flex-1">
                      <p className="text-muted-foreground mb-6">
                        The initial phase focuses on breaking down protective biofilms where parasites hide, preparing for deep cleansing.
                      </p>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span>Targets stubborn biofilm barriers</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span>Gentle yet effective cleansing begins</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span>Prepares body for deep cleansing</span>
                        </li>
                      </ul>
                    </div>
                    <div className="w-32 md:w-48">
                      <Image
                        src="/images/a-professional-product-photograph-of-a-w_zeo86TvIQFau7gWgbBC4-w_CZQgJHF8T3a9i_QJIFkMfQ-removebg-preview.png"
                        alt="ParaWash Biofilm Disruptor"
                        width={200}
                        height={200}
                        className="w-full h-auto object-contain hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>
                  <div className="mt-8 space-y-6">
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm">1</span>
                        Days 1-3
                      </h4>
                      <p className="text-muted-foreground">
                        Initial adjustment as biofilm breakdown begins. You may experience mild detox symptoms as your body starts the cleansing process.
                      </p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm">2</span>
                        Days 4-7
                      </h4>
                      <p className="text-muted-foreground">
                        Biofilms dissolve and initial parasitic die-off begins. Energy levels may fluctuate as body adjusts to cleansing.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phase 2 */}
              <div className="relative bg-accent/5 rounded-3xl p-8">
                <div className="absolute -top-6 left-8 bg-primary text-white text-sm font-medium px-6 py-2 rounded-full shadow-lg">
                  Phase 2: Days 8-14
                </div>
                <div className="mt-4">
                  <h3 className="text-xl font-semibold text-primary mb-4">Maximum Strength Elimination</h3>
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    <div className="flex-1">
                      <p className="text-muted-foreground mb-6">
                        With barriers removed, this intensive phase delivers maximum-strength herbs to eliminate parasites and restore gut health.
                      </p>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span>Powerful parasite elimination</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span>Deep cellular detoxification</span>
                        </li>
                        <li className="flex items-start gap-3">
                          <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                          <span>Intensive gut restoration</span>
                        </li>
                      </ul>
                    </div>
                    <div className="w-32 md:w-48">
                      <Image
                        src="/images/cellular.png"
                        alt="Intracellular Body Cleanse"
                        width={200}
                        height={200}
                        className="w-full h-auto object-contain hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  </div>
                  <div className="mt-8 space-y-6">
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm">3</span>
                        Days 8-11
                      </h4>
                      <p className="text-muted-foreground">
                        Maximum strength herbs begin their work. Expect significant changes in elimination patterns and increased energy.
                      </p>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-sm">
                      <h4 className="font-semibold mb-2 flex items-center gap-2">
                        <span className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-white text-sm">4</span>
                        Days 12-14
                      </h4>
                      <p className="text-muted-foreground">
                        Final elimination phase with deep restoration. Experience improved clarity, energy, and digestive function.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Important Note - Now spans full width */}
              <div className="lg:col-span-2 mt-8">
                <div className="bg-white border-2 border-primary/10 rounded-2xl p-8">
                  <div className="flex items-start gap-4">
                    <Shield className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold mb-2">Important Note</h4>
                      <p className="text-muted-foreground">
                        This is an intensive cleanse protocol. Listen to your body and stay well hydrated. Some may experience stronger detox symptoms, while others might have milder reactions.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="w-full py-24 bg-white">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="text-primary font-medium">Success Stories</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">Life-Changing Results</h2>
              <p className="text-lg text-muted-foreground">
                Join thousands who have transformed their health with Dr. Sebi's authentic cleansing system.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  quote: "The two-phase approach made all the difference. I could actually feel the biofilm breaking down, and by week 2, I had more energy than ever!",
                  author: "Sarah Johnson",
                  title: "Verified Customer",
                  rating: 5,
                  image: "/images/testimonials/E1lm-p99Mp_mid.jpg",
                  location: "Dallas, TX"
                },
                {
                  quote: "After trying so many cleanses, this is the only one that actually worked. The ParaWash really does dissolve biofilms - I saw the evidence!",
                  author: "Michael Chen",
                  title: "Verified Customer",
                  rating: 5,
                  image: "/images/testimonials/4JL1TreUi_mid (2).jpg",
                  location: "San Francisco, CA"
                },
                {
                  quote: "I was skeptical at first, but the results speak for themselves. My digestion has improved dramatically, and my energy levels are through the roof.",
                  author: "Emma Rodriguez",
                  title: "Verified Customer",
                  rating: 5,
                  image: "/images/testimonials/9c05X9Grw_mid.jpg",
                  location: "Miami, FL"
                }
              ].map((testimonial, i) => (
                <Card key={i} className="relative overflow-hidden group hover:border-primary transition-all duration-300">
                  <CardContent className="p-8">
                    {/* Decorative elements */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-bl-full -z-10 group-hover:bg-primary/10 transition-colors"></div>
                    <div className="absolute bottom-0 left-0 w-24 h-24 bg-primary/5 rounded-tr-full -z-10 group-hover:bg-primary/10 transition-colors"></div>
                    
                    {/* Rating stars */}
                    <div className="flex mb-6">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-5 w-5 fill-primary text-primary" />
                      ))}
                    </div>

                    {/* Profile Image - Moved to top */}
                    <div className="mb-6 flex justify-center">
                      <div className="relative">
                        <div className="absolute inset-0 bg-primary/10 rounded-full scale-125 group-hover:scale-150 transition-transform duration-300"></div>
                        <Image
                          src={testimonial.image}
                          alt={testimonial.author}
                          width={120}
                          height={120}
                          className="rounded-full object-cover relative shadow-lg"
                        />
                        <div className="absolute -bottom-2 -right-2 bg-primary text-white rounded-full p-2">
                          <CheckCircle className="h-4 w-4" />
                        </div>
                      </div>
                    </div>

                    {/* Quote */}
                    <blockquote className="text-lg mb-6 relative">
                      <span className="absolute -top-4 -left-2 text-4xl text-primary/20">"</span>
                      <span className="relative z-10">{testimonial.quote}</span>
                      <span className="absolute -bottom-4 -right-2 text-4xl text-primary/20">"</span>
                    </blockquote>

                    {/* Author info */}
                    <div className="text-center">
                      <p className="font-semibold text-lg group-hover:text-primary transition-colors">{testimonial.author}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.title}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.location}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section id="blog" className="w-full py-24 bg-white">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="text-primary font-medium">Latest Articles</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
                Learn More About Natural Healing
              </h2>
              <p className="text-lg text-muted-foreground">
                Discover insights about parasites, cleansing, and holistic wellness from our experts.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  slug: "understanding-biofilms",
                  title: "Understanding Biofilms: The Hidden Shield of Parasites",
                  excerpt: "Learn how biofilms protect parasites and why breaking them down is crucial for effective cleansing.",
                  image: "/images/blog1.jpg",
                  category: "Education",
                  readTime: "5 min read",
                  date: "Feb 15, 2024"
                },
                {
                  slug: "7-signs-of-parasite-infection",
                  title: "7 Signs You May Have a Parasite Infection",
                  excerpt: "Discover the common and lesser-known symptoms of parasitic infections that often go unnoticed.",
                  image: "/images/blog2.jpg",
                  category: "Health",
                  readTime: "4 min read",
                  date: "Feb 12, 2024"
                },
                {
                  slug: "dr-sebis-approach",
                  title: "Dr. Sebi's Approach to Parasite Cleansing",
                  excerpt: "Explore the unique methodology and natural compounds used in Dr. Sebi's cleansing protocols.",
                  image: "/images/blog3.jpg",
                  category: "Methods",
                  readTime: "6 min read",
                  date: "Feb 10, 2024"
                },
                {
                  slug: "two-phase-cleansing",
                  title: "The Science Behind Two-Phase Cleansing",
                  excerpt: "Why a two-phase approach is more effective for eliminating parasites and restoring gut health.",
                  image: "/images/blog4.jpg",
                  category: "Research",
                  readTime: "7 min read",
                  date: "Feb 8, 2024"
                },
                {
                  slug: "supporting-your-body",
                  title: "Supporting Your Body During a Cleanse",
                  excerpt: "Essential tips and practices to maximize the benefits of your cleansing journey.",
                  image: "/images/blog5.jpg",
                  category: "Wellness",
                  readTime: "5 min read",
                  date: "Feb 5, 2024"
                },
                {
                  slug: "gut-brain-connection",
                  title: "The Gut-Brain Connection: Why Parasites Affect Your Mind",
                  excerpt: "Understanding how parasites impact mental clarity and emotional well-being.",
                  image: "/images/blog6.jpg",
                  category: "Research",
                  readTime: "6 min read",
                  date: "Feb 1, 2024"
                }
              ].map((post, i) => (
                <Link href={`/blog/${post.slug}`} key={i} className="group">
                  <Card className="overflow-hidden h-full transition-all hover:border-primary">
                    <div className="relative aspect-[16/9] overflow-hidden">
                      <Image
                        src={post.image}
                        alt={post.title}
                        width={600}
                        height={340}
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute top-4 left-4 bg-primary text-white text-xs px-2 py-1 rounded-full">
                        {post.category}
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span>{post.date}</span>
                        <span>{post.readTime}</span>
                      </div>
                      <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">
                        {post.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {post.excerpt}
                      </p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            <div className="mt-12 text-center">
              <Button variant="outline" size="lg" className="rounded-full">
                View All Articles
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </section>

        <section id="order" className="w-full py-24 bg-gradient-to-b from-accent/20 to-white">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center">
              <span className="text-primary font-medium">Start Your Journey</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">
                Transform Your Health Today
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join thousands who have already discovered the power of Dr. Sebi's authentic cleansing system. Your path to optimal health begins here.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-6 text-lg">
                  Order Your Package Now
                </Button>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-5 w-5" />
                  <span>110% Dr. Sebi Approved</span>
                </div>
              </div>
              <div className="mt-12 grid gap-6 md:grid-cols-3">
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
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <div className="flex items-center mb-4">
                <Leaf className="h-6 w-6 text-primary" />
                <span className="ml-2 text-lg font-bold">Dr. Sebi Approved LLC</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Continuing Dr. Sebi's mission of bringing natural healing to the world through authentic, proven formulas.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li>
                  <Link className="text-sm text-muted-foreground hover:text-foreground transition-colors" href="#symptoms">
                    Why Cleanse
                  </Link>
                </li>
                <li>
                  <Link className="text-sm text-muted-foreground hover:text-foreground transition-colors" href="#solution">
                    Our Solution
                  </Link>
                </li>
                <li>
                  <Link className="text-sm text-muted-foreground hover:text-foreground transition-colors" href="#testimonials">
                    Success Stories
                  </Link>
                </li>
                <li>
                  <Link className="text-sm text-muted-foreground hover:text-foreground transition-colors" href="/maya">
                    Maya Formula
                  </Link>
                </li>
                <li>
                  <Link className="text-sm text-muted-foreground hover:text-foreground transition-colors" href="/seamoss">
                    Sea Moss
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2">
                <li>
                  <Link className="text-sm text-muted-foreground hover:text-foreground transition-colors" href="#">
                    Shipping Policy
                  </Link>
                </li>
                <li>
                  <Link className="text-sm text-muted-foreground hover:text-foreground transition-colors" href="#">
                    Return Policy
                  </Link>
                </li>
                <li>
                  <Link className="text-sm text-muted-foreground hover:text-foreground transition-colors" href="#">
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="text-sm text-muted-foreground">
                  990 Hwy. 287 N, Suite 106 #157
                </li>
                <li className="text-sm text-muted-foreground">
                  Mansfield, Texas 76063
                </li>
                <li>
                  <Link className="text-sm text-primary hover:text-primary/90 transition-colors" href="mailto:info@drsebiwebsite.com">
                    info@drsebiwebsite.com
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-border">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
                <p className="text-sm text-muted-foreground">
                © 2024 Dr. Sebi Approved LLC. All rights reserved.
              </p>
                <p className="text-xs text-muted-foreground mt-1">
                These statements have not been evaluated by the FDA. This product is not intended to diagnose, treat, cure, or prevent any disease.
              </p>
            </div>
              <div className="flex gap-4">
                <Link className="text-xs text-muted-foreground hover:text-foreground transition-colors" href="#">
                  Privacy Policy
                </Link>
                <Link className="text-xs text-muted-foreground hover:text-foreground transition-colors" href="#">
                  Terms of Service
                </Link>
                <Link className="text-xs text-muted-foreground hover:text-foreground transition-colors" href="#">
                  Legal
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
