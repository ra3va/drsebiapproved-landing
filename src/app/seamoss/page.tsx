'use client';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Shield, Star, ArrowRight, Leaf, Zap, Brain, Heart, Users, Clock, Award, Droplets } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"
import { useState } from 'react';
import Header from "@/components/Header";

export default function SeaMossPage() {
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
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/5 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-teal-500/5 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2" />
          </div>
          
          <div className="container relative mx-auto px-4 max-w-[1200px]">
            {/* Center the content and make product image more prominent */}
            <div className="text-center mb-12">
              <div className="inline-flex items-center rounded-lg bg-blue-500/10 px-4 py-2 text-sm text-blue-600 mb-6">
                <Droplets className="w-4 h-4 mr-2" />
                <span>NATURE'S MULTI-VITAMIN</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-foreground mb-6 leading-tight">
                Dr. Sebi's
                <span className="text-blue-600 block">Honduran Sea Moss</span>
                <span className="text-teal-600 block">Capsules</span>
              </h1>

              <p className="text-xl text-muted-foreground mb-8 max-w-[700px] mx-auto leading-relaxed">
                <strong>92 of 102 essential minerals your body needs for optimal health.</strong> Wildcrafted from the pristine waters of Honduras, this ancient superfood supports thyroid function, immune health, and digestive wellness.
              </p>

              {/* Dr. Sebi Quote Section */}
              <div className="bg-gradient-to-r from-blue-500/10 via-teal-500/10 to-blue-500/10 rounded-3xl p-8 md:p-12 max-w-4xl mx-auto mb-12 border-2 border-blue-500/20">
                <div className="text-center">
                  <div className="mb-6">
                    <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Droplets className="w-8 h-8 text-blue-600" />
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                      Mother Nature's Multi-Vitamin
                    </h3>
                  </div>
                  
                  <blockquote className="text-xl md:text-2xl font-medium text-foreground mb-6 italic relative">
                    <span className="absolute -top-4 -left-4 text-4xl text-blue-500/30">"</span>
                    <span className="relative z-10">
                      Sea Moss contains 92 of the 102 minerals that make up the human body.
                    </span>
                    <span className="absolute -bottom-4 -right-4 text-4xl text-blue-500/30">"</span>
                  </blockquote>
                  
                  <p className="text-lg font-semibold text-blue-600 mb-4">— Dr. Sebi's Teaching</p>
                  
                  <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 border border-blue-500/20">
                    <div className="grid gap-4 md:grid-cols-2 text-left">
                      <div className="flex items-start gap-3">
                        <Award className="h-5 w-5 text-blue-600 flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-semibold text-foreground">Wildcrafted from Honduras</p>
                          <p className="text-sm text-muted-foreground">Sourced from Dr. Sebi's preferred waters</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-teal-600 flex-shrink-0 mt-1" />
                        <div>
                          <p className="font-semibold text-foreground">Unprocessed & Natural</p>
                          <p className="text-sm text-muted-foreground">Preserved in its most potent natural state</p>
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
                  <div className="absolute inset-0 bg-blue-500/10 rounded-2xl blur-2xl scale-110 group-hover:scale-125 transition-transform duration-500" />
                  
                  {/* Product image - Made larger */}
                  <div className="relative bg-white rounded-2xl shadow-2xl p-8 transform hover:scale-105 transition-transform duration-300">
                    <Image
                      src="/seamoss.png"
                      alt="Dr. Sebi's Honduran Sea Moss Capsules"
                      width={450}
                      height={550}
                      className="w-[350px] h-auto object-contain rounded-lg shadow-lg"
                      priority
                    />
                    
                    {/* Floating elements */}
                    <div className="absolute -top-4 -right-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full animate-pulse">
                      17% OFF
                    </div>
                    <div className="absolute -bottom-4 -left-4 bg-blue-600 text-white text-sm font-medium px-3 py-1 rounded-full">
                      40 Capsules
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Content - Benefits and Pricing */}
              <div className="flex flex-col items-center lg:items-start text-center lg:text-left order-2 lg:order-2">
                {/* Key Benefits */}
                <div className="grid gap-4 mb-8 w-full max-w-[540px]">
                  {[
                    "Contains 92 of 102 essential minerals",
                    "Supports healthy thyroid function naturally", 
                    "Boosts immune system and energy levels",
                    "Promotes digestive health and gut wellness"
                  ].map((benefit, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                      <span className="text-left">{benefit}</span>
                    </div>
                  ))}
                </div>

                {/* Pricing */}
                <div className="bg-white border-2 border-blue-500/20 rounded-2xl p-6 mb-8 w-full max-w-[540px]">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-3xl font-bold text-foreground">$49.99</p>
                      <p className="text-lg text-muted-foreground line-through">$60.00</p>
                    </div>
                    <div className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                      SAVE 17%
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">40 Capsules | 1-3 capsules daily</p>
                </div>

                <Button 
                  size="lg" 
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-10 py-6 text-lg shadow-lg shadow-blue-600/25 hover:translate-y-[1px] transition-all mb-6 w-full max-w-[540px]"
                  onClick={() => window.open('https://drsebiwebsite.com/collections/frontpage/products/seamoss', '_blank')}
                >
                  <ArrowRight className="w-5 h-5 mr-2" />
                  Order Sea Moss Now
                </Button>

                {/* Social Proof */}
                <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>2,000+ Satisfied Customers</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 fill-blue-600 text-blue-600" />
                    <span>4.9/5 Rating</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 92 Minerals Section */}
        <section className="w-full py-20 bg-white">
          <div className="container px-4 md:px-6 max-w-[1200px] mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                The Power of 92 Essential Minerals
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Sea Moss naturally contains 92 of the 102 minerals that make up the human body, providing comprehensive nutritional support like no other superfood.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-16">
              {[
                {
                  category: "Thyroid Support",
                  icon: <Brain className="h-8 w-8 text-purple-600" />,
                  minerals: "Iodine, Selenium, Zinc",
                  description: "Natural iodine supports healthy thyroid function and metabolism regulation.",
                  bodyEffects: ["Regulates metabolism", "Supports hormone balance", "Enhances energy production"]
                },
                {
                  category: "Immune Defense",
                  icon: <Shield className="h-8 w-8 text-green-600" />,
                  minerals: "Vitamin C, Iron, Potassium",
                  description: "Antioxidants and minerals strengthen your body's natural defense systems.",
                  bodyEffects: ["Boosts immune response", "Fights inflammation", "Protects against illness"]
                },
                {
                  category: "Digestive Health",
                  icon: <Heart className="h-8 w-8 text-orange-600" />,
                  minerals: "Fiber, Magnesium, Calcium",
                  description: "Prebiotic fibers and minerals support gut health and nutrient absorption.",
                  bodyEffects: ["Improves digestion", "Promotes gut bacteria", "Enhances nutrient uptake"]
                },
                {
                  category: "Energy & Vitality",
                  icon: <Zap className="h-8 w-8 text-yellow-600" />,
                  minerals: "Iron, B-Vitamins, Phosphorus",
                  description: "Essential minerals combat fatigue and support cellular energy production.",
                  bodyEffects: ["Increases energy levels", "Reduces fatigue", "Supports muscle function"]
                }
              ].map((category, i) => (
                <Card key={i} className="relative overflow-hidden border-2 hover:border-blue-500 transition-all duration-300 group">
                  <CardHeader>
                    <div className="absolute top-0 right-0 w-20 h-20 bg-blue-500/5 rounded-bl-full group-hover:bg-blue-500/10 transition-colors"></div>
                    <div className="flex items-center gap-3 mb-4">
                      {category.icon}
                      <div>
                        <CardTitle className="text-lg">{category.category}</CardTitle>
                        <p className="text-sm text-blue-600 font-medium">{category.minerals}</p>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{category.description}</p>
                    <div className="space-y-2">
                      <p className="text-sm font-semibold text-foreground">Benefits:</p>
                      {category.bodyEffects.map((effect, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <CheckCircle className="h-3 w-3 text-blue-600 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{effect}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Mineral Composition Highlight */}
            <div className="bg-gradient-to-br from-blue-500/5 via-teal-500/5 to-blue-500/5 rounded-3xl p-8 md:p-12">
              <div className="text-center mb-8">
                <h3 className="text-2xl md:text-3xl font-bold mb-4">
                  Complete Mineral Profile
                </h3>
                <p className="text-lg text-muted-foreground mb-8">
                  Sea Moss provides a comprehensive mineral profile that mirrors what your body needs
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-6 text-center">
                {[
                  { name: "Iodine", benefit: "Thyroid Function" },
                  { name: "Iron", benefit: "Blood Health" },
                  { name: "Magnesium", benefit: "Muscle Function" },
                  { name: "Calcium", benefit: "Bone Strength" },
                  { name: "Potassium", benefit: "Heart Health" },
                  { name: "Zinc", benefit: "Immune Support" }
                ].map((mineral, i) => (
                  <div key={i} className="bg-white/70 backdrop-blur-sm rounded-xl p-4 border border-blue-500/10">
                    <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Droplets className="h-6 w-6 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-foreground mb-1">{mineral.name}</h4>
                    <p className="text-xs text-muted-foreground">{mineral.benefit}</p>
                  </div>
                ))}
              </div>

              <div className="mt-12 text-center">
                <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-8 border-2 border-blue-500/20 max-w-2xl mx-auto">
                  <h4 className="text-xl font-bold text-foreground mb-4">
                    What You Can Expect From Sea Moss
                  </h4>
                  <div className="grid gap-4 text-left">
                    {[
                      "Increased energy and reduced fatigue within 1-2 weeks",
                      "Better thyroid function and metabolism support",
                      "Enhanced immune system and faster recovery",
                      "Improved digestive health and nutrient absorption",
                      "Healthier skin, hair, and nails from mineral nourishment",
                      "Overall vitality and wellness improvement over time"
                    ].map((expectation, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{expectation}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Dr. Sebi's Sea Moss */}
        <section className="w-full py-20 bg-gradient-to-b from-accent/10 to-white">
          <div className="container px-4 md:px-6 max-w-[1200px] mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Dr. Sebi's Honduran Sea Moss?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Not all sea moss is created equal. Dr. Sebi specifically chose Honduran waters for their purity and mineral richness.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: <Award className="h-8 w-8 text-blue-600" />,
                  title: "Honduran Source",
                  description: "Wildcrafted from the pristine waters Dr. Sebi trusted for optimal mineral content."
                },
                {
                  icon: <Leaf className="h-8 w-8 text-green-600" />,
                  title: "Unprocessed",
                  description: "Preserved in its natural state to maintain maximum potency and bioavailability."
                },
                {
                  icon: <Shield className="h-8 w-8 text-purple-600" />,
                  title: "Quality Assured",
                  description: "Each batch is handmade to preserve freshness and ensure consistent quality."
                },
                {
                  icon: <Clock className="h-8 w-8 text-orange-600" />,
                  title: "Fresh Made",
                  description: "Orders are prepared fresh to maintain potency, shipping within 5-10 business days."
                }
              ].map((item, i) => (
                <Card key={i} className="text-center border-2 hover:border-blue-500 transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="text-blue-600 mb-4 flex justify-center">{item.icon}</div>
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
                How to Use Sea Moss Capsules
              </h2>
              <p className="text-lg text-muted-foreground">
                Simple daily supplementation for maximum mineral absorption and health benefits.
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-500/5 to-teal-500/5 rounded-2xl p-8">
              <div className="grid gap-6">
                <div className="flex items-start gap-4">
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                    1
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Daily Dosage</h3>
                    <p className="text-muted-foreground">Take 1-3 capsules daily with water, preferably with meals for optimal absorption.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                    2
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Best Time</h3>
                    <p className="text-muted-foreground">Morning with breakfast is ideal for energy support, or as directed by your healthcare provider.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                    3
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Consistency</h3>
                    <p className="text-muted-foreground">Use consistently for 30-60 days to experience full mineral replenishment and health benefits.</p>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-6">
                  <h4 className="font-semibold text-yellow-800 mb-2">Important Notes</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Consult your healthcare provider before use, especially if you have thyroid conditions</li>
                    <li>• Sea moss is naturally high in iodine - follow recommended dosage</li>
                    <li>• Store in a cool, dry place away from direct sunlight</li>
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
                Real experiences from people using Dr. Sebi's Sea Moss capsules.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  quote: "My energy levels have skyrocketed since starting sea moss! I feel more alert and my digestion has improved dramatically.",
                  author: "Sandra M.",
                  location: "Houston, TX",
                  rating: 5
                },
                {
                  quote: "After struggling with thyroid issues, sea moss has been a game-changer. My doctor noticed improvement in my thyroid function.",
                  author: "Michael R.",
                  location: "Atlanta, GA", 
                  rating: 5
                },
                {
                  quote: "I love that it's from Honduras like Dr. Sebi recommended. The quality is amazing and I can feel the difference in my overall health.",
                  author: "Carmen L.",
                  location: "Miami, FL",
                  rating: 5
                }
              ].map((testimonial, i) => (
                <Card key={i} className="relative overflow-hidden group hover:border-blue-500 transition-all duration-300">
                  <CardContent className="p-6">
                    {/* Rating stars */}
                    <div className="flex mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-blue-600 text-blue-600" />
                      ))}
                    </div>

                    {/* Quote */}
                    <blockquote className="text-gray-700 mb-4 relative">
                      <span className="absolute -top-2 -left-2 text-2xl text-blue-500/20">"</span>
                      <span className="relative z-10">{testimonial.quote}</span>
                      <span className="absolute -bottom-2 -right-2 text-2xl text-blue-500/20">"</span>
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
        <section className="w-full py-20 bg-gradient-to-b from-blue-500/10 to-white">
          <div className="container px-4 md:px-6 max-w-[800px] mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Experience Nature's Multi-Vitamin
            </h2>
            <p className="text-lg text-muted-foreground mb-4 leading-relaxed">
              Nourish your body with 92 essential minerals from Dr. Sebi's trusted Honduran Sea Moss. Support your thyroid, immune system, and overall vitality naturally.
            </p>
            <div className="bg-gradient-to-r from-blue-50 to-teal-50 border border-blue-200 rounded-2xl p-6 mb-8 max-w-2xl mx-auto">
              <p className="text-blue-800 font-medium text-center">
                <strong>"Sea Moss contains 92 of the 102 minerals that make up the human body"</strong> — Dr. Sebi's Teaching
              </p>
              <p className="text-blue-700 text-sm text-center mt-2">
                Wildcrafted from the pristine Honduran waters Dr. Sebi trusted for optimal mineral content and purity.
              </p>
            </div>
            
            {/* Pricing Display */}
            <div className="bg-white border-2 border-blue-500/20 rounded-2xl p-8 mb-8 max-w-md mx-auto">
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="text-center">
                  <p className="text-3xl font-bold text-foreground">$49.99</p>
                  <p className="text-lg text-muted-foreground line-through">$60.00</p>
                </div>
                <div className="bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold">
                  SAVE 17%
                </div>
              </div>
              <p className="text-sm text-muted-foreground">40 Capsules | Made fresh to order</p>
            </div>
            
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-12 py-6 text-xl font-semibold shadow-lg shadow-blue-600/25 hover:translate-y-[1px] transition-all mb-8"
              onClick={() => window.open('https://drsebiwebsite.com/collections/frontpage/products/seamoss', '_blank')}
            >
              <ArrowRight className="w-6 h-6 mr-3" />
              Order Sea Moss Now
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