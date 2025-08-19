'use client';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Shield, Star, ArrowRight, Leaf, Zap, Brain, Heart, Users, Clock, Award, Wind, Droplets, Activity, Target, AlertTriangle, Info } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"
import { useState } from 'react';
import Header from "@/components/Header";

export default function MucusCleanserPage() {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      {/* Spacer for fixed header */}
      <div className="h-[5.5rem]"></div>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-white to-accent/10 pt-16 pb-12">
          {/* Background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2" />
          </div>
          
          <div className="container relative mx-auto px-4 max-w-[1200px]">
            {/* Center the content and make product image more prominent */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center rounded-lg bg-cyan-500/10 px-4 py-2 text-sm text-cyan-600 mb-6">
                <Wind className="w-4 h-4 mr-2" />
                <span>RESPIRATORY & CELLULAR CLEANSING</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-foreground mb-6 leading-tight">
                Dr. Sebi's
                <span className="text-cyan-600 block">Mucus Cleanser</span>
                <span className="text-blue-600 block">Formula</span>
              </h1>

              <p className="text-xl text-muted-foreground mb-8 max-w-[700px] mx-auto leading-relaxed">
                <strong>Eliminate excess mucus and cleanse at the cellular level.</strong> Dr. Sebi's powerful blend of cascara, mullein root, and African bird pepper supports respiratory health and natural detoxification.
              </p>

              {/* Dr. Sebi Quote Section */}
              <div className="bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-cyan-500/10 rounded-3xl p-8 md:p-12 max-w-4xl mx-auto mb-12 border-2 border-cyan-500/20">
                <div className="text-center">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Wind className="w-8 h-8 text-cyan-600" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                      Eliminate the Root Cause
                    </h3>
                  </div>
                  
                  <blockquote className="text-xl md:text-2xl font-medium text-foreground mb-6 italic relative">
                    <span className="absolute -top-4 -left-4 text-4xl text-cyan-500/30">"</span>
                    <span className="relative z-10">
                      Mucus is the cause of every disease. Eliminate the mucus and you eliminate the disease.
                    </span>
                    <span className="absolute -bottom-4 -right-4 text-4xl text-cyan-500/30">"</span>
                  </blockquote>
                  
                  <p className="text-lg font-semibold text-cyan-600 mb-4">— Dr. Sebi's Teaching</p>
                  
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-cyan-500/20">
                    <div className="grid gap-4 md:grid-cols-2 text-left">
                      <div className="flex items-start gap-3">
                        <Award className="h-5 w-5 text-cyan-600 flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-semibold text-foreground">Handmade for Potency</p>
                          <p className="text-sm text-muted-foreground">Fresh preparation preserves herbal effectiveness</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-semibold text-foreground">Authentic Dr. Sebi Method</p>
                          <p className="text-sm text-muted-foreground">Following original herbal compound formulations</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Left Content - Product Image */}
              <div className="flex justify-center lg:justify-start order-1 lg:order-1">
                <div className="relative group">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-cyan-500/10 rounded-2xl blur-2xl scale-110 group-hover:scale-125 transition-transform duration-500" />
                  
                  {/* Product image */}
                  <div className="relative bg-white rounded-2xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-300">
                    <Image
                      src="/mucus.png"
                      alt="Dr. Sebi's Mucus Cleanser"
                      width={450}
                      height={550}
                      className="w-[350px] h-auto object-contain rounded-lg shadow-lg"
                      priority
                    />
                    
                    {/* Floating elements */}
                    <div className="absolute -top-4 -right-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full animate-pulse">
                      20% OFF
                    </div>
                    <div className="absolute -bottom-4 -left-4 bg-cyan-600 text-white text-sm font-medium px-3 py-1 rounded-full">
                      30 Capsules
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Content - Benefits and Pricing */}
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-2">
                {/* Key Benefits */}
                <div className="grid gap-4 mb-8 w-full max-w-[540px]">
                  {[
                    "Eliminates excess mucus naturally",
                    "Supports respiratory and breathing health", 
                    "Cleanses and rebuilds at cellular level",
                    "Made with authentic Dr. Sebi herbs"
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                      <span className="text-left">{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* Pricing */}
                <div className="bg-white border-2 border-cyan-500/20 rounded-2xl p-6 mb-8 w-full max-w-[540px]">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-3xl font-bold text-foreground">$59.99</p>
                      <p className="text-lg text-muted-foreground line-through">$75.00</p>
                    </div>
                    <div className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                      SAVE 20%
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">30 Capsules | Handmade to preserve potency</p>
                </div>

                <Button 
                  size="lg" 
                  className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-full px-10 py-6 text-lg shadow-lg shadow-cyan-600/25 hover:translate-y-[1px] transition-all mb-6 w-full max-w-[540px]"
                  onClick={() => window.open('https://drsebiwebsite.com/collections/frontpage/products/mucus-cleanser', '_blank')}
                >
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Order Mucus Cleanser Now
                </Button>

                {/* Social Proof */}
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>1,500+ Satisfied Customers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-cyan-600 text-cyan-600" />
                    <span>4.8/5 Rating</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Key Ingredients Section */}
        <section className="w-full py-20 bg-white">
          <div className="container px-4 md:px-6 max-w-[1200px] mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Powerful Natural Ingredients
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Each herb in Dr. Sebi's Mucus Cleanser formula has been carefully selected for its specific properties in eliminating mucus and supporting cellular health.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
              {[
                {
                  name: "Cascara Sagrada",
                  icon: <Leaf className="h-8 w-8 text-green-600" />,
                  description: "Sacred bark known for gentle but effective cleansing properties.",
                  benefits: ["Natural detoxification", "Supports elimination", "Gentle on system"]
                },
                {
                  name: "Mullein Root",
                  icon: <Wind className="h-8 w-8 text-blue-600" />,
                  description: "Powerful respiratory herb traditionally used for lung and breathing support.",
                  benefits: ["Respiratory health", "Mucus reduction", "Breathing support"]
                },
                {
                  name: "African Bird Pepper",
                  icon: <Zap className="h-8 w-8 text-red-600" />,
                  description: "Potent pepper that stimulates circulation and helps break down mucus.",
                  benefits: ["Circulation boost", "Mucus breakdown", "Energy enhancement"]
                },
                {
                  name: "Rhubarb Root",
                  icon: <Target className="h-8 w-8 text-purple-600" />,
                  description: "Traditional cleansing root that supports digestive and cellular health.",
                  benefits: ["Digestive support", "Cellular cleansing", "Natural detox"]
                },
                {
                  name: "Dandelion Root",
                  icon: <Droplets className="h-8 w-8 text-yellow-600" />,
                  description: "Powerful liver support herb that aids in toxin elimination.",
                  benefits: ["Liver support", "Toxin removal", "System cleansing"]
                }
              ].map((ingredient, i) => (
                <Card key={i} className="relative overflow-hidden border-2 hover:border-cyan-500 transition-all duration-300 group">
                  <CardHeader>
                    <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/5 rounded-bl-full group-hover:bg-cyan-500/10 transition-colors"></div>
                    <div className="flex items-center gap-3 mb-4">
                      {ingredient.icon}
                      <div>
                        <CardTitle className="text-lg">{ingredient.name}</CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{ingredient.description}</p>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-foreground">Key Benefits:</p>
                      {ingredient.benefits.map((benefit, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-cyan-600 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{benefit}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Health Benefits Section */}
        <section className="w-full py-20 bg-gradient-to-b from-accent/10 to-white">
          <div className="container px-4 md:px-6 max-w-[1200px] mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Transform Your Respiratory & Cellular Health
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Experience the comprehensive benefits of natural mucus elimination and cellular cleansing with Dr. Sebi's time-tested formula.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: <Wind className="h-8 w-8 text-blue-600" />,
                  title: "Respiratory Support",
                  description: "Clear airways and support natural breathing function through mucus elimination."
                },
                {
                  icon: <Activity className="h-8 w-8 text-green-600" />,
                  title: "Cellular Cleansing", 
                  description: "Deep cellular detoxification helps rebuild your body from the ground up."
                },
                {
                  icon: <Heart className="h-8 w-8 text-red-600" />,
                  title: "Overall Vitality",
                  description: "Remove toxins and mucus buildup for improved energy and well-being."
                },
                {
                  icon: <Shield className="h-8 w-8 text-purple-600" />,
                  title: "Natural Defense",
                  description: "Support your body's natural ability to maintain optimal health and function."
                }
              ].map((item, i) => (
                <Card key={i} className="text-center border-2 hover:border-cyan-500 transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="text-cyan-600 mb-4 flex justify-center">{item.icon}</div>
                    <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* What to Expect Section */}
            <div className="mt-16">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border-2 border-cyan-500/20 max-w-4xl mx-auto">
                <h3 className="text-2xl font-bold text-center text-foreground mb-8">
                  What You Can Expect From Mucus Cleanser
                </h3>
                <div className="grid gap-6 md:grid-cols-2 text-left">
                  {[
                    "Reduced mucus buildup in respiratory system",
                    "Improved breathing and airway clarity", 
                    "Enhanced cellular detoxification and renewal",
                    "Increased energy from toxin elimination",
                    "Better overall respiratory function",
                    "Natural support for body's cleansing processes"
                  ].map((expectation, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-cyan-600 flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{expectation}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Usage Instructions */}
        <section className="w-full py-20 bg-white">
          <div className="container px-4 md:px-6 max-w-[800px] mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                How to Use Mucus Cleanser
              </h2>
              <p className="text-lg text-muted-foreground">
                Follow these guidelines for safe and effective mucus elimination and cellular cleansing.
              </p>
            </div>

            <div className="bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-2xl p-8">
              <div className="grid gap-6">
                <div className="flex items-start gap-4">
                  <div className="bg-cyan-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                    1
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Recommended Dosage</h3>
                    <p className="text-muted-foreground">Follow bottle instructions or as directed by your healthcare provider. Start with lower doses to assess tolerance.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-cyan-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                    2
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Best Practices</h3>
                    <p className="text-muted-foreground">Take with plenty of water and maintain hydration throughout your cleansing period.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-cyan-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                    3
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Duration</h3>
                    <p className="text-muted-foreground">Use as directed for optimal results. Some customers report benefits within days of consistent use.</p>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-1" />
                    <div>
                      <h4 className="font-semibold text-yellow-800 mb-2">Important Safety Information</h4>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        <li>• Consult your healthcare provider before use, especially if pregnant or nursing</li>
                        <li>• Discontinue use if adverse reactions occur</li>
                        <li>• Not intended to diagnose, treat, cure, or prevent any disease</li>
                        <li>• Keep out of reach of children</li>
                        <li>• Store in a cool, dry place</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="w-full py-20 bg-gradient-to-b from-accent/10 to-white">
          <div className="container px-4 md:px-6 max-w-[1200px] mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Real Results from Real Customers
              </h2>
              <p className="text-lg text-muted-foreground">
                See how Dr. Sebi's Mucus Cleanser has helped people breathe better and feel healthier.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  quote: "I noticed a significant reduction in mucus buildup within just a few days. My breathing feels so much clearer and I have more energy.",
                  author: "Jennifer M.",
                  location: "Phoenix, AZ",
                  rating: 5
                },
                {
                  quote: "This formula really works! I've struggled with respiratory issues for years, and the Mucus Cleanser has made such a difference in my daily comfort.",
                  author: "David R.",
                  location: "Chicago, IL", 
                  rating: 5
                },
                {
                  quote: "Dr. Sebi's approach to eliminating mucus makes so much sense. I feel like I'm breathing better and my whole system feels cleaner.",
                  author: "Maria L.",
                  location: "Los Angeles, CA",
                  rating: 5
                }
              ].map((testimonial, i) => (
                <Card key={i} className="relative overflow-hidden group hover:border-cyan-500 transition-all duration-300">
                  <CardContent className="p-6">
                    {/* Rating stars */}
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-cyan-600 text-cyan-600" />
                      ))}
                    </div>

                    {/* Quote */}
                    <blockquote className="text-gray-700 mb-4 relative">
                      <span className="absolute -top-2 -left-2 text-2xl text-cyan-500/20">"</span>
                      <span className="relative z-10">{testimonial.quote}</span>
                      <span className="absolute -bottom-2 -right-2 text-2xl text-cyan-500/20">"</span>
                    </blockquote>

                    {/* Author info */}
                    <div className="text-sm">
                      <p className="font-semibold">{testimonial.author}</p>
                      <p className="text-muted-foreground">{testimonial.location}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="w-full py-20 bg-gradient-to-b from-cyan-500/10 to-white">
          <div className="container px-4 md:px-6 max-w-[800px] mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Start Your Mucus Cleansing Journey Today
            </h2>
            <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
              Experience the power of Dr. Sebi's natural approach to eliminating excess mucus and supporting cellular health. Clear your respiratory system and revitalize your body naturally.
            </p>
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 border border-cyan-200 rounded-2xl p-6 mb-8 max-w-2xl mx-auto">
              <p className="text-cyan-800 font-medium text-center">
                <strong>"Mucus is the cause of every disease. Eliminate the mucus and you eliminate the disease."</strong> — Dr. Sebi's Teaching
              </p>
              <p className="text-cyan-700 text-sm text-center mt-2">
                Handmade with authentic herbs following Dr. Sebi's original methods for maximum potency and effectiveness.
              </p>
            </div>
            
            {/* Pricing Display */}
            <div className="bg-white border-2 border-cyan-500/20 rounded-2xl p-8 mb-8 max-w-md mx-auto">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-foreground">$59.99</p>
                  <p className="text-lg text-muted-foreground line-through">$75.00</p>
                </div>
                <div className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                  SAVE 20%
                </div>
              </div>
              <p className="text-sm text-muted-foreground">30 Capsules | Handmade to preserve potency</p>
            </div>
            
            <Button 
              size="lg" 
              className="bg-cyan-600 hover:bg-cyan-700 text-white rounded-full px-12 py-6 text-xl font-semibold shadow-lg shadow-cyan-600/25 hover:translate-y-[1px] transition-all mb-8"
              onClick={() => window.open('https://drsebiwebsite.com/collections/frontpage/products/mucus-cleanser', '_blank')}
            >
              <ArrowRight className="w-6 h-6 mr-3" />
              Order Mucus Cleanser Now
            </Button>

            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Secure Checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Ships in 5-10 Days</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>100% Authentic</span>
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