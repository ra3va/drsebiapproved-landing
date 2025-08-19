'use client';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Leaf, Shield, Zap, Star, ArrowRight, Menu, Heart, Brain, Droplets, Award, Wind } from 'lucide-react'
import Image from "next/image"
import Link from "next/link"
import Header from "@/components/Header";

export default function Home() {
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
            <div className="text-center mb-16">
              <div className="inline-flex items-center rounded-lg bg-primary/10 px-4 py-2 text-sm text-primary mb-6">
                <Leaf className="w-4 h-4 mr-2" />
                <span>DR. SEBI'S AUTHENTIC FORMULAS</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tighter text-foreground mb-6 leading-tight">
                Transform Your Health with
                <span className="text-primary block">Dr. Sebi's Natural</span>
                <span className="text-green-600 block">Healing Solutions</span>
              </h1>

              <p className="text-xl text-muted-foreground mb-12 max-w-[700px] mx-auto leading-relaxed">
                Discover authentic Dr. Sebi approved products for complete body wellness. From parasite cleansing to mineral supplementation, experience the power of nature's most effective healing compounds.
              </p>

              <div className="grid grid-cols-3 gap-6 max-w-[600px] mx-auto border rounded-xl p-6 bg-card/50 backdrop-blur-sm">
                <div className="flex flex-col items-center">
                  <div className="text-3xl font-bold text-primary mb-1">30+</div>
                  <div className="text-sm text-muted-foreground">Years Legacy</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-3xl font-bold text-primary mb-1">100%</div>
                  <div className="text-sm text-muted-foreground">Natural</div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-3xl font-bold text-primary mb-1">50K+</div>
                  <div className="text-sm text-muted-foreground">Customers</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="w-full py-20 bg-white">
          <div className="container px-4 md:px-6 max-w-[1200px] mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Our Complete Dr. Sebi Product Line
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Each product is crafted following Dr. Sebi's proven methodologies, using only the finest natural ingredients for optimal health transformation.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">
              {/* ParaCleanse Elite */}
              <Card className="relative overflow-hidden border-2 hover:border-primary transition-all duration-300 group">
                <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  BESTSELLER
                </div>
                <CardHeader className="text-center">
                  <div className="w-full h-48 flex items-center justify-center mb-4 bg-gradient-to-br from-primary/5 to-accent/5 rounded-lg">
                    <div className="relative">
                      <Image
                        src="/images/a-professional-product-photograph-of-a-w_zeo86TvIQFau7gWgbBC4-w_CZQgJHF8T3a9i_QJIFkMfQ-removebg-preview.png"
                        alt="ParaCleanse Elite Two-Phase System"
                        width={200}
                        height={200}
                        className="w-32 h-auto object-contain group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  </div>
                  <CardTitle className="text-xl mb-2">ParaCleanse Elite</CardTitle>
                  <p className="text-primary font-medium">Two-Phase Parasite Cleansing System</p>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Dr. Sebi's complete parasite elimination system. Breaks down biofilms and eliminates parasites with our powerful two-phase protocol.
                  </p>
                  <div className="space-y-2 mb-6">
                    {[
                      "Phase 1: Biofilm disruption",
                      "Phase 2: Deep parasite elimination", 
                      "Complete 14-day protocol",
                      "Natural & powerful formula"
                    ].map((benefit, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-primary flex-shrink-0" />
                        <span className="text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-2xl font-bold text-foreground">$89.99</p>
                      <p className="text-sm text-muted-foreground">Complete 2-phase system</p>
                    </div>
                  </div>
                  <Link href="/paracleanse">
                    <Button className="w-full bg-primary hover:bg-primary/90 text-white">
                      Learn More
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Maya Formula */}
              <Card className="relative overflow-hidden border-2 hover:border-primary transition-all duration-300 group">
                <div className="absolute top-4 right-4 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  DR. SEBI'S GREATEST
                </div>
                <CardHeader className="text-center">
                  <div className="w-full h-48 flex items-center justify-center mb-4 bg-gradient-to-br from-red-500/5 to-primary/5 rounded-lg">
                    <div className="relative">
                      <Image
                        src="/maya.png"
                        alt="Dr. Sebi's Maya 26 Herb Formula"
                        width={200}
                        height={200}
                        className="w-32 h-auto object-contain group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  </div>
                  <CardTitle className="text-xl mb-2">Maya Formula</CardTitle>
                  <p className="text-red-600 font-medium">26 Herb Iron-Rich Formula</p>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Dr. Sebi's greatest creation for blood, brain, and nervous system support. Enhanced iron-rich nourishment from 26 powerful herbs.
                  </p>
                  <div className="space-y-2 mb-6">
                    {[
                      "Blood purification & iron support",
                      "Brain & nervous system health",
                      "26 wildcrafted herbs",
                      "Made fresh in Honduras"
                    ].map((benefit, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Heart className="h-4 w-4 text-red-600 flex-shrink-0" />
                        <span className="text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-2xl font-bold text-foreground">$59.99</p>
                      <p className="text-sm text-red-600">Save 40% | Was $99.99</p>
                    </div>
                  </div>
                  <Link href="/maya">
                    <Button className="w-full bg-red-600 hover:bg-red-700 text-white">
                      Learn More
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Sea Moss */}
              <Card className="relative overflow-hidden border-2 hover:border-primary transition-all duration-300 group">
                <div className="absolute top-4 right-4 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  92 MINERALS
                </div>
                <CardHeader className="text-center">
                  <div className="w-full h-48 flex items-center justify-center mb-4 bg-gradient-to-br from-blue-500/5 to-teal-500/5 rounded-lg">
                    <div className="relative">
                      <Image
                        src="/seamoss.png"
                        alt="Dr. Sebi's Honduran Sea Moss"
                        width={200}
                        height={200}
                        className="w-32 h-auto object-contain group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  </div>
                  <CardTitle className="text-xl mb-2">Sea Moss Capsules</CardTitle>
                  <p className="text-blue-600 font-medium">Nature's Multi-Vitamin</p>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Honduran wildcrafted Sea Moss with 92 essential minerals. Supports thyroid function, immune health, and digestive wellness.
                  </p>
                  <div className="space-y-2 mb-6">
                    {[
                      "92 of 102 essential minerals",
                      "Thyroid & immune support",
                      "Digestive health boost",
                      "Wildcrafted from Honduras"
                    ].map((benefit, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Droplets className="h-4 w-4 text-blue-600 flex-shrink-0" />
                        <span className="text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-2xl font-bold text-foreground">$49.99</p>
                      <p className="text-sm text-blue-600">Save 17% | Was $60.00</p>
                    </div>
                  </div>
                  <Link href="/seamoss">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                      Learn More
                    </Button>
                  </Link>
                </CardContent>
              </Card>

              {/* Mucus Cleanser */}
              <Card className="relative overflow-hidden border-2 hover:border-primary transition-all duration-300 group">
                <div className="absolute top-4 right-4 bg-cyan-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  RESPIRATORY SUPPORT
                </div>
                <CardHeader className="text-center">
                  <div className="w-full h-48 flex items-center justify-center mb-4 bg-gradient-to-br from-cyan-500/5 to-blue-500/5 rounded-lg">
                    <div className="relative">
                      <Image
                        src="/mucus.png"
                        alt="Dr. Sebi's Mucus Cleanser"
                        width={200}
                        height={200}
                        className="w-32 h-auto object-contain group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                  </div>
                  <CardTitle className="text-xl mb-2">Mucus Cleanser</CardTitle>
                  <p className="text-cyan-600 font-medium">Respiratory & Cellular Cleansing</p>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Dr. Sebi's powerful blend eliminates excess mucus and cleanses at the cellular level. Made with cascara, mullein root, and African bird pepper.
                  </p>
                  <div className="space-y-2 mb-6">
                    {[
                      "Eliminates excess mucus naturally",
                      "Supports respiratory health",
                      "Cellular cleansing & detox",
                      "Handmade for potency"
                    ].map((benefit, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Wind className="h-4 w-4 text-cyan-600 flex-shrink-0" />
                        <span className="text-sm">{benefit}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-2xl font-bold text-foreground">$59.99</p>
                      <p className="text-sm text-cyan-600">Save 20% | Was $75.00</p>
                    </div>
                  </div>
                  <Link href="/mucus-cleanser">
                    <Button className="w-full bg-cyan-600 hover:bg-cyan-700 text-white">
                      Learn More
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            <div className="text-center mt-12">
              <div className="bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 rounded-2xl p-8 max-w-2xl mx-auto">
                <h3 className="text-2xl font-bold mb-4">Start Your Healing Journey Today</h3>
                <p className="text-muted-foreground mb-6">
                  Experience the transformative power of Dr. Sebi's natural healing protocols. Each product is designed to work synergistically for complete body wellness.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/quiz">
                    <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                      Take Our Health Quiz
                    </Button>
                  </Link>
                  <Link href="/hidden-parasite-crisis">
                    <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/5">
                      Free Health Guide
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Dr. Sebi Products Section */}
        <section className="w-full py-20 bg-gradient-to-b from-accent/10 to-white">
          <div className="container px-4 md:px-6 max-w-[1200px] mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Why Choose Dr. Sebi's Natural Healing Products?
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Each product is crafted following Dr. Sebi's proven methodologies, using only wildcrafted herbs and natural compounds for optimal health transformation.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: <Award className="h-8 w-8 text-primary" />,
                  title: "Authentic Formulas",
                  description: "Original Dr. Sebi recipes made with wildcrafted herbs from Honduras and other pristine locations."
                },
                {
                  icon: <Leaf className="h-8 w-8 text-green-600" />,
                  title: "100% Natural",
                  description: "Pure, potent plant-based ingredients with no artificial additives or synthetic compounds."
                },
                {
                  icon: <Shield className="h-8 w-8 text-blue-600" />,
                  title: "Quality Assured",
                  description: "Each batch is carefully prepared to preserve freshness and ensure consistent potency."
                },
                {
                  icon: <Heart className="h-8 w-8 text-red-600" />,
                  title: "Proven Results",
                  description: "Thousands of satisfied customers experiencing improved health and vitality naturally."
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



        <section id="testimonials" className="w-full py-24 bg-white">
          <div className="container px-4 md:px-6">
            <div className="max-w-3xl mx-auto text-center mb-16">
              <span className="text-primary font-medium">Success Stories</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2 mb-4">Life-Changing Results</h2>
              <p className="text-lg text-muted-foreground">
                Join thousands who have transformed their health with Dr. Sebi's authentic natural healing products.
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-3">
              {[
                {
                  quote: "Dr. Sebi's products have completely changed my life. My energy levels are incredible and I feel healthier than I have in years!",
                  author: "Sarah Johnson",
                  title: "Verified Customer",
                  rating: 5,
                  image: "/images/testimonials/E1lm-p99Mp_mid.jpg",
                  location: "Dallas, TX"
                },
                {
                  quote: "After trying everything, Dr. Sebi's natural formulas finally gave me the results I was looking for. The quality is amazing.",
                  author: "Michael Chen",
                  title: "Verified Customer",
                  rating: 5,
                  image: "/images/testimonials/4JL1TreUi_mid (2).jpg",
                  location: "San Francisco, CA"
                },
                {
                  quote: "I love having access to authentic Dr. Sebi products. My overall health and vitality have improved tremendously since I started.",
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
                Join thousands who have already discovered the power of Dr. Sebi's authentic natural healing products. Your path to optimal health begins here.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link href="/quiz">
                    <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-full px-8 py-6 text-lg">
                      Take Our Health Quiz
                    </Button>
                  </Link>
                  <Link href="/hidden-parasite-crisis">
                    <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/5 rounded-full px-8 py-6 text-lg">
                      Free Health Guide
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="mt-12 grid gap-6 md:grid-cols-3">
                <div className="flex flex-col items-center p-6 bg-accent/5 rounded-2xl">
                  <Shield className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-semibold mb-2">100% Authentic</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Original Dr. Sebi formulas made with wildcrafted herbs
                  </p>
                </div>
                <div className="flex flex-col items-center p-6 bg-accent/5 rounded-2xl">
                  <Leaf className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-semibold mb-2">Natural Ingredients</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Pure, potent plant-based compounds
                  </p>
                </div>
                <div className="flex flex-col items-center p-6 bg-accent/5 rounded-2xl">
                  <Heart className="h-8 w-8 text-primary mb-4" />
                  <h3 className="font-semibold mb-2">Proven Results</h3>
                  <p className="text-sm text-muted-foreground text-center">
                    Thousands of satisfied customers worldwide
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
                  <Link className="text-sm text-muted-foreground hover:text-foreground transition-colors" href="#testimonials">
                    Success Stories
                  </Link>
                </li>
                <li>
                  <Link className="text-sm text-muted-foreground hover:text-foreground transition-colors" href="/blog">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link className="text-sm text-muted-foreground hover:text-foreground transition-colors" href="/paracleanse">
                    ParaCleanse Elite
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
                <li>
                  <Link className="text-sm text-muted-foreground hover:text-foreground transition-colors" href="/mucus-cleanser">
                    Mucus Cleanser
                  </Link>
                </li>
                <li>
                  <Link className="text-sm text-muted-foreground hover:text-foreground transition-colors" href="/quiz">
                    Health Quiz
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
