'use client';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Shield, Star, ArrowRight, Leaf, Zap, Brain, Heart, Users, Clock, Award } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"
import { useState } from 'react';
import Header from "@/components/Header";

export default function MayaPage() {
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
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/5 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2" />
          </div>
          
          <div className="container relative mx-auto px-4 max-w-[1200px]">
            {/* Center the content and make product image more prominent */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center rounded-lg bg-primary/10 px-4 py-2 text-sm text-primary mb-6">
                <Leaf className="w-4 h-4 mr-2" />
                <span>DR. SEBI'S ORIGINAL FORMULA</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-foreground mb-6 leading-tight">
                Dr. Sebi's
                <span className="text-primary block">26 Herb Maya</span>
                <span className="text-red-600 block">Formula</span>
              </h1>

              <p className="text-xl text-muted-foreground mb-8 max-w-[700px] mx-auto leading-relaxed">
                <strong>Enhanced iron-rich nourishment designed to support the blood, brain, and central nervous system.</strong> Made fresh in Honduras using Dr. Sebi's original 26-herb formula for cellular regeneration and vitality.
              </p>

              {/* Dr. Sebi Quote Section */}
              <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-3xl p-8 md:p-12 max-w-4xl mx-auto mb-12 border-2 border-primary/20">
                <div className="text-center">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Leaf className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                      Dr. Sebi's Greatest Creation
                    </h3>
                  </div>
                  
                  <blockquote className="text-xl md:text-2xl font-medium text-foreground mb-6 italic relative">
                    <span className="absolute -top-4 -left-4 text-4xl text-primary/30">"</span>
                    <span className="relative z-10">
                      This is the greatest formula I have ever crafted. Maya is the foundation supplement for the body.
                    </span>
                    <span className="absolute -bottom-4 -right-4 text-4xl text-primary/30">"</span>
                  </blockquote>
                  
                  <p className="text-lg font-semibold text-primary mb-4">— Dr. Sebi</p>
                  
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-primary/20">
                    <div className="grid gap-4 md:grid-cols-2 text-left">
                      <div className="flex items-start gap-3">
                        <Award className="h-5 w-5 text-red-600 flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-semibold text-foreground">One of His Last Works</p>
                          <p className="text-sm text-muted-foreground">Among the rarest formulas from Dr. Sebi's legacy</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-semibold text-foreground">Foundation Supplement</p>
                          <p className="text-sm text-muted-foreground">Designed as the cornerstone of total body wellness</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Left Content - Product Image (Now more prominent) */}
              <div className="flex justify-center lg:justify-start order-1 lg:order-1">
                <div className="relative group">
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-primary/10 rounded-2xl blur-2xl scale-110 group-hover:scale-125 transition-transform duration-500" />
                  
                  {/* Product image - Made larger */}
                  <div className="relative bg-white rounded-2xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-300">
                    <Image
                      src="/maya.png"
                      alt="Dr. Sebi's 26 Herb Maya Formula"
                      width={450}
                      height={550}
                      className="w-[350px] h-auto object-contain rounded-lg shadow-lg"
                      priority
                    />
                    
                    {/* Floating elements */}
                    <div className="absolute -top-4 -right-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full animate-pulse">
                      40% OFF
                    </div>
                    <div className="absolute -bottom-4 -left-4 bg-primary text-white text-sm font-medium px-3 py-1 rounded-full">
                      8 fl oz
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Content - Benefits and Pricing */}
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-2">
                {/* Key Benefits */}
                <div className="grid gap-4 mb-8 w-full max-w-[540px]">
                  {[
                    "Supports blood purification and iron levels",
                    "Nourishes brain and nervous system function", 
                    "Contains 26 wildcrafted herbs from Dr. Sebi's formula",
                    "Helps rebuild cells and boost natural energy"
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-left">{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* Pricing */}
                <div className="bg-white border-2 border-primary/20 rounded-2xl p-6 mb-8 w-full max-w-[540px]">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-3xl font-bold text-foreground">$59.99</p>
                      <p className="text-lg text-muted-foreground line-through">$99.99</p>
                    </div>
                    <div className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                      SAVE 40%
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">8 fl oz | Made fresh in Honduras</p>
                </div>

                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-white rounded-full px-10 py-6 text-lg shadow-lg shadow-primary/25 hover:translate-y-[1px] transition-all mb-6 w-full max-w-[540px]"
                  onClick={() => window.open('https://drsebiwebsite.com/collections/frontpage/products/maya', '_blank')}
                >
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Order Maya Formula Now
                </Button>

                {/* Social Proof */}
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>1,000+ Satisfied Customers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-primary text-primary" />
                    <span>4.8/5 Rating</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Powerful Herbs Section */}
        <section className="w-full py-20 bg-white">
          <div className="container px-4 md:px-6 max-w-[1200px] mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                The Most Powerful Herbs in Maya
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Dr. Sebi carefully selected these potent herbs for their proven effects on the body. Each works synergistically to create a powerful healing compound.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
              {[
                {
                  name: "Sarsaparilla Root",
                  icon: <Heart className="h-8 w-8 text-red-600" />,
                  effect: "Blood Purification",
                  description: "The greatest cleanser you'll ever encounter. Rich in plant-based iron, it purifies blood while providing abundant energy and calming the nervous system.",
                  bodyEffects: ["Increases energy levels", "Purifies blood naturally", "Supports hormonal balance"]
                },
                {
                  name: "Sea Moss",
                  icon: <Brain className="h-8 w-8 text-blue-600" />,
                  effect: "Mineral Powerhouse",
                  description: "Contains 92 of the 102 minerals your body needs. Supports thyroid function, boosts immunity, and provides essential nutrients for brain health.",
                  bodyEffects: ["Enhances mental clarity", "Boosts immune function", "Supports thyroid health"]
                },
                {
                  name: "Bladderwrack",
                  icon: <Zap className="h-8 w-8 text-green-600" />,
                  effect: "Metabolic Support",
                  description: "High in natural iodine, supports metabolism and thyroid function. Contains fucoidan which helps reduce inflammation throughout the body.",
                  bodyEffects: ["Accelerates metabolism", "Reduces inflammation", "Supports weight management"]
                },
                {
                  name: "Burdock Root",
                  icon: <Shield className="h-8 w-8 text-purple-600" />,
                  effect: "Detoxification",
                  description: "Powerful liver cleanser and blood purifier. Helps eliminate toxins while providing essential minerals for cellular regeneration.",
                  bodyEffects: ["Cleanses liver naturally", "Eliminates toxins", "Supports skin health"]
                },
                {
                  name: "Yellow Dock",
                  icon: <Leaf className="h-8 w-8 text-yellow-600" />,
                  effect: "Iron Absorption",
                  description: "One of nature's richest sources of bioavailable iron. Supports blood building and helps combat fatigue and weakness.",
                  bodyEffects: ["Combats fatigue", "Builds healthy blood", "Increases iron levels"]
                },
                {
                  name: "Elderberry",
                  icon: <Star className="h-8 w-8 text-indigo-600" />,
                  effect: "Immune Defense",
                  description: "Packed with antioxidants and vitamins. Strengthens immune system and provides powerful protection against oxidative stress.",
                  bodyEffects: ["Strengthens immunity", "Fights free radicals", "Supports recovery"]
                }
              ].map((herb, i) => (
                <Card key={i} className="relative overflow-hidden border-2 hover:border-primary transition-all duration-300 group">
                  <CardHeader>
                    <div className="absolute top-0 right-0 w-20 h-20 bg-primary/5 rounded-bl-full group-hover:bg-primary/10 transition-colors"></div>
                    <div className="flex items-center gap-3 mb-4">
                      {herb.icon}
                      <div>
                        <CardTitle className="text-lg">{herb.name}</CardTitle>
                        <p className="text-sm text-primary font-medium">{herb.effect}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{herb.description}</p>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-foreground">Effects on Your Body:</p>
                      {herb.bodyEffects.map((effect, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-primary flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{effect}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Synergy Section */}
            <div className="bg-gradient-to-br from-primary/5 via-accent/5 to-primary/5 rounded-3xl p-8 md:p-12">
              <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  The Power of Synergy
                </h3>
                <p className="text-lg text-muted-foreground mb-8">
                  When these powerful herbs combine, they create something greater than the sum of their parts
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {[
                  {
                    title: "Enhanced Bioavailability",
                    description: "Each herb enhances the absorption of others, making nutrients more available to your cells for maximum benefit."
                  },
                  {
                    title: "Amplified Energy",
                    description: "Iron-rich herbs work with adaptogenic compounds to provide sustained energy without crashes or jitters."
                  },
                  {
                    title: "Complete Cellular Support",
                    description: "Minerals, antioxidants, and phytonutrients work together to rebuild and regenerate cells throughout your body."
                  },
                  {
                    title: "Balanced Detoxification",
                    description: "Cleansing herbs are balanced with nourishing compounds to detoxify safely while strengthening your system."
                  },
                  {
                    title: "Holistic Healing",
                    description: "Blood, brain, and nervous system support work in harmony to address root causes, not just symptoms."
                  },
                  {
                    title: "Sustained Results",
                    description: "The compound effect creates lasting improvements in energy, mental clarity, and overall vitality that build over time."
                  }
                ].map((benefit, i) => (
                  <div key={i} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-primary/10">
                    <h4 className="font-semibold text-foreground mb-3">{benefit.title}</h4>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </div>
                ))}
              </div>

              <div className="mt-12 text-center">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border-2 border-primary/20 max-w-2xl mx-auto">
                  <h4 className="text-xl font-bold text-foreground mb-4">
                    What You Can Expect From Maya
                  </h4>
                  <div className="grid gap-4 text-left">
                    {[
                      "Increased energy and vitality within the first week",
                      "Enhanced mental clarity and focus as nutrients reach your brain",
                      "Improved blood circulation and iron levels",
                      "Stronger immune system and faster recovery",
                      "Better stress response and nervous system balance",
                      "Gradual cellular regeneration and overall health improvement"
                    ].map((expectation, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{expectation}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="w-full py-20 bg-gradient-to-b from-accent/10 to-white">
          <div className="container px-4 md:px-6 max-w-[1200px] mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Choose Dr. Sebi's Maya Formula?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Experience the power of authentic Dr. Sebi formulation with enhanced iron-rich nourishment for comprehensive health support.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: <Award className="h-8 w-8 text-primary" />,
                  title: "Original Formula",
                  description: "Authentic Dr. Sebi's 26 herb formula, unchanged from the original recipe."
                },
                {
                  icon: <Leaf className="h-8 w-8 text-primary" />,
                  title: "Wildcrafted Herbs",
                  description: "All herbs are wildcrafted and sourced for maximum potency and purity."
                },
                {
                  icon: <Heart className="h-8 w-8 text-primary" />,
                  title: "Iron-Rich",
                  description: "Enhanced with natural plant-based iron for blood and energy support."
                },
                {
                  icon: <Shield className="h-8 w-8 text-primary" />,
                  title: "Made in Honduras",
                  description: "Crafted fresh in Honduras following Dr. Sebi's traditional methods."
                }
              ].map((item, i) => (
                <Card key={i} className="text-center border-2 hover:border-primary transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="text-primary mb-4 flex justify-center">{item.icon}</div>
                    <h3 className="text-xl font-semibold mb-3">{item.title}</h3>
                    <p className="text-muted-foreground text-sm">{item.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Usage Instructions */}
        <section className="w-full py-20 bg-white">
          <div className="container px-4 md:px-6 max-w-[800px] mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                How to Use Maya Formula
              </h2>
              <p className="text-lg text-muted-foreground">
                Follow these simple instructions for optimal results with your Maya formula.
              </p>
            </div>

            <div className="bg-gradient-to-br from-primary/5 to-accent/5 rounded-2xl p-8">
              <div className="grid gap-6">
                <div className="flex items-start gap-4">
                  <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                    1
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Recommended Dosage</h3>
                    <p className="text-muted-foreground">Take 1-2 tablespoons daily, preferably on an empty stomach or as directed by a health professional.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                    2
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Best Time to Take</h3>
                    <p className="text-muted-foreground">Morning or early afternoon for energy support. Avoid taking late in the evening as it may affect sleep.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                    3
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Duration</h3>
                    <p className="text-muted-foreground">Use consistently for 30-90 days for best results. Each 8oz bottle provides approximately 2-4 weeks of use.</p>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
                  <h4 className="font-semibold text-yellow-800 mb-2">Important Notes</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Shake well before use</li>
                    <li>• Store in a cool, dry place</li>
                    <li>• Consult healthcare provider if pregnant or nursing</li>
                    <li>• Discontinue use if adverse reactions occur</li>
                  </ul>
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
                What Customers Are Saying
              </h2>
              <p className="text-lg text-muted-foreground">
                Real experiences from people using Dr. Sebi's Maya formula.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  quote: "I've been using Maya for 3 months and my energy levels are incredible. I feel more focused and alert than I have in years!",
                  author: "Maria S.",
                  location: "Miami, FL",
                  rating: 5
                },
                {
                  quote: "Finally found something that actually works! The iron content really helped with my fatigue. Dr. Sebi's formulas are unmatched.",
                  author: "David K.",
                  location: "Los Angeles, CA", 
                  rating: 5
                },
                {
                  quote: "Maya has become part of my daily routine. I love knowing I'm getting 26 powerful herbs in one formula. Quality is excellent!",
                  author: "Angela T.",
                  location: "Chicago, IL",
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
        <section className="w-full py-20 bg-gradient-to-b from-primary/10 to-white">
          <div className="container px-4 md:px-6 max-w-[800px] mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Experience Dr. Sebi's Greatest Creation
            </h2>
            <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
              Support your blood, brain, and nervous system with this authentic 26-herb formula. Made fresh in Honduras following Dr. Sebi's original recipe for cellular regeneration and natural vitality.
            </p>
            <div className="bg-gradient-to-r from-red-50 to-primary-50 border border-red-200 rounded-2xl p-6 mb-8 max-w-2xl mx-auto">
              <p className="text-red-800 font-medium text-center">
                <strong>"This is the greatest formula I have ever crafted"</strong> — Dr. Sebi
              </p>
              <p className="text-red-700 text-sm text-center mt-2">
                You're accessing one of the rarest and most powerful formulas from Dr. Sebi's legacy — designed as the foundation supplement for total body wellness.
              </p>
            </div>
            
            {/* Pricing Display */}
            <div className="bg-white border-2 border-primary/20 rounded-2xl p-8 mb-8 max-w-md mx-auto">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-foreground">$59.99</p>
                  <p className="text-lg text-muted-foreground line-through">$99.99</p>
                </div>
                <div className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                  SAVE 40%
                </div>
              </div>
              <p className="text-sm text-muted-foreground">8 fl oz | Free shipping available</p>
            </div>
            
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-white rounded-full px-12 py-6 text-xl font-semibold shadow-lg shadow-primary/25 hover:translate-y-[1px] transition-all mb-8"
              onClick={() => window.open('https://drsebiwebsite.com/collections/frontpage/products/maya', '_blank')}
            >
              <ArrowRight className="w-6 h-6 mr-3" />
              Order Maya Formula Now
            </Button>

            <div className="flex flex-col sm:flex-row gap-8 justify-center items-center text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                <span>Secure Checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span>Fast Shipping</span>
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