'use client';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Shield, Download, Clock, Users, Star, ArrowRight, Leaf, Zap } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"
import { useState } from 'react';
import Header from "@/components/Header";
import GutHealthLeadMagnet from "@/components/GutHealthLeadMagnet";

export default function HiddenParasiteCrisisPage() {
  const [showLeadMagnet, setShowLeadMagnet] = useState(false);

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
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2" />
          </div>
          
          <div className="container relative mx-auto px-4 max-w-[1200px]">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Left Content */}
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
                <div className="inline-flex items-center rounded-lg bg-primary/10 px-4 py-2 text-sm text-primary mb-6">
                  <Download className="w-4 h-4 mr-2" />
                  <span>FREE INSTANT DOWNLOAD</span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-foreground mb-6 leading-tight">
                  The Hidden
                  <span className="text-red-600 block">Parasite Crisis</span>
                  <span className="text-primary block">Free Guide</span>
                </h1>

                <p className="text-xl text-muted-foreground mb-8 max-w-[540px] leading-relaxed">
                  <strong>Dr. Sebi's Complete Guide to Eliminate Silent Invaders and Reclaim Your Health.</strong> Why millions suffer from unexplained fatigue, brain fog, and digestive issues - and the natural 2-phase solution that actually works.
                </p>

                {/* Benefits List */}
                <div className="grid gap-4 mb-8 w-full max-w-[540px]">
                  {[
                    "Identify the 7 hidden signs of parasite infection",
                    "Learn why most parasite cleanses fail completely", 
                    "Discover Dr. Sebi's biofilm-breaking protocol",
                    "Get the complete 2-phase elimination system"
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-left">{benefit}</span>
                    </div>
                  ))}
                </div>

                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-6 text-lg shadow-lg shadow-primary/25 hover:translate-y-[1px] transition-all mb-6"
                  onClick={() => setShowLeadMagnet(true)}
                >
                  <Download className="w-5 h-5 mr-2" />
                  Download Your Free Guide Now
                </Button>

                {/* Social Proof */}
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>10,000+ Downloads</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    <span>4.9/5 Rating</span>
                  </div>
                </div>
              </div>

              {/* Right Content - Book Cover */}
              <div className="flex justify-center lg:justify-end">
                <div className="relative group">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-2xl scale-110 group-hover:scale-125 transition-transform duration-500" />
                  
                  {/* Book cover */}
                  <div className="relative bg-white rounded-2xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-300">
                    <Image
                      src="/3066a71b-75c7-4a5c-876a-3d7c080cde01.jpeg"
                      alt="The Hidden Parasite Crisis - Free Guide"
                      width={400}
                      height={500}
                      className="w-[300px] h-auto object-contain rounded-lg shadow-lg"
                      priority
                    />
                    
                    {/* Floating elements */}
                    <div className="absolute -top-4 -right-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full animate-pulse">
                      FREE
                    </div>
                    <div className="absolute -bottom-4 -left-4 bg-primary text-white text-sm font-medium px-3 py-1 rounded-full">
                      PDF Download
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What You'll Learn Section */}
        <section className="w-full py-20 bg-white">
          <div className="container px-4 md:px-6 max-w-[1200px] mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                What You'll Learn About Hidden Parasites
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                This comprehensive 30-page guide exposes the parasite crisis affecting millions and reveals Dr. Sebi's proven elimination protocol.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  icon: <Shield className="h-8 w-8 text-primary" />,
                  title: "Parasite Identification",
                  description: "Learn to recognize the 7 most common signs of parasitic infection, including subtle symptoms that doctors often miss."
                },
                {
                  icon: <Zap className="h-8 w-8 text-primary" />,
                  title: "Biofilm Science",
                  description: "Understand how parasites protect themselves with biofilms and why breaking these shields is crucial for effective cleansing."
                },
                {
                  icon: <Leaf className="h-8 w-8 text-primary" />,
                  title: "Dr. Sebi's Method",
                  description: "Discover the authentic two-phase approach that has helped thousands achieve complete parasite elimination."
                },
                {
                  icon: <Clock className="h-8 w-8 text-primary" />,
                  title: "14-Day Protocol",
                  description: "Get a complete day-by-day timeline for your cleanse, including what to expect and how to maximize results."
                },
                {
                  icon: <CheckCircle className="h-8 w-8 text-primary" />,
                  title: "Natural Compounds",
                  description: "Learn about powerful plant-based ingredients that safely eliminate parasites without harsh chemicals."
                },
                {
                  icon: <ArrowRight className="h-8 w-8 text-primary" />,
                  title: "Success Strategies",
                  description: "Proven tips to support your body during cleansing and maintain long-term digestive health."
                }
              ].map((item, i) => (
                <Card key={i} className="relative overflow-hidden border-2 hover:border-primary transition-all duration-300 group">
                  <CardHeader>
                    <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-full group-hover:bg-primary/10 transition-colors"></div>
                    <div className="text-primary mb-4">{item.icon}</div>
                    <CardTitle className="text-xl mb-2">{item.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Urgency Section */}
        <section className="w-full py-20 bg-gradient-to-b from-red-50 to-white">
          <div className="container px-4 md:px-6 max-w-[900px] mx-auto text-center">
            <div className="bg-white border-2 border-red-200 rounded-2xl p-8 shadow-lg">
              <h3 className="text-2xl md:text-3xl font-bold text-red-900 mb-4">
                ⚠️ The Hidden Parasite Crisis Is Real
              </h3>
              <p className="text-red-700 mb-6 text-lg leading-relaxed">
                Right now, millions of people are suffering from unexplained fatigue, brain fog, and digestive issues without knowing the real cause: <strong>hidden parasite infections.</strong> These silent invaders are stealing your nutrients, poisoning your system, and multiplying daily. <strong>The longer they remain undetected, the more damage they cause to your gut, brain, and energy levels.</strong>
              </p>
              <p className="text-red-800 font-semibold mb-8">
                Stop guessing what's wrong - get the truth about parasites and the solution that actually works.
              </p>
              <Button 
                size="lg" 
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 text-lg font-semibold shadow-lg animate-pulse"
                onClick={() => setShowLeadMagnet(true)}
              >
                <Download className="w-5 h-5 mr-2" />
                Get Your Free Guide - Stop Parasites Now
              </Button>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="w-full py-20 bg-white">
          <div className="container px-4 md:px-6 max-w-[1200px] mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                What Readers Are Saying
              </h2>
              <p className="text-lg text-muted-foreground">
                Thousands have already downloaded this guide and transformed their health.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  quote: "This guide opened my eyes to symptoms I never connected to parasites. Following the protocols completely changed my energy levels!",
                  author: "Jennifer M.",
                  location: "Austin, TX",
                  rating: 5
                },
                {
                  quote: "Finally, a clear explanation of Dr. Sebi's method! The biofilm section was especially eye-opening. This information is priceless.",
                  author: "Marcus R.",
                  location: "Atlanta, GA", 
                  rating: 5
                },
                {
                  quote: "I wish I had found this guide years ago. The two-phase approach makes so much sense now. Thank you for making this free!",
                  author: "Lisa K.",
                  location: "Phoenix, AZ",
                  rating: 5
                }
              ].map((testimonial, i) => (
                <Card key={i} className="relative overflow-hidden group hover:border-primary transition-all duration-300">
                  <CardContent className="p-6">
                    {/* Rating stars */}
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                      ))}
                    </div>

                    {/* Quote */}
                    <blockquote className="text-gray-700 mb-4 relative">
                      <span className="absolute -top-2 -left-2 text-2xl text-primary/20">"</span>
                      <span className="relative z-10">{testimonial.quote}</span>
                      <span className="absolute -bottom-2 -right-2 text-2xl text-primary/20">"</span>
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
        <section className="w-full py-20 bg-gradient-to-b from-accent/10 to-white">
          <div className="container px-4 md:px-6 max-w-[800px] mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Ready to Eliminate Hidden Parasites For Good?
            </h2>
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              Download your free guide now and discover the truth about the hidden parasite crisis affecting millions. Learn Dr. Sebi's proven 2-phase protocol that breaks biofilms and eliminates parasites naturally. No strings attached - just life-changing information.
            </p>
            
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-white rounded-full px-12 py-6 text-xl font-semibold shadow-lg shadow-primary/25 hover:translate-y-[1px] transition-all mb-8"
              onClick={() => setShowLeadMagnet(true)}
            >
              <Download className="w-6 h-6 mr-3" />
              Download Your Free Guide Now
            </Button>

            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>100% Free - No Credit Card Required</span>
              </div>
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                <span>Instant PDF Download</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span>Based on Dr. Sebi's Methods</span>
              </div>
            </div>

            {/* Additional value proposition */}
            <div className="mt-12 bg-white border-2 border-primary/10 rounded-2xl p-8">
              <h3 className="text-xl font-semibold mb-4">Why We're Exposing the Parasite Crisis for Free</h3>
              <p className="text-muted-foreground leading-relaxed">
                The hidden parasite crisis is affecting millions who don't even know they're infected. This guide represents decades of Dr. Sebi's research into natural parasite elimination, and we're sharing it freely because too many people are suffering needlessly. Once you understand how parasites are secretly stealing your health, you'll see why exposing this truth is more important than profit.
              </p>
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
              These statements have not been evaluated by the FDA. This information is not intended to diagnose, treat, cure, or prevent any disease.
            </p>
          </div>
        </div>
      </footer>

      {/* Lead Magnet Modal */}
      {showLeadMagnet && <GutHealthLeadMagnet onClose={() => setShowLeadMagnet(false)} />}
    </div>
  )
}