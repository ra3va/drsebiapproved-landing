'use client';

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { CheckCircle, Star, ShoppingCart, Gift, Users, Award, ShieldCheck, Download, Zap, Flame, Target, Clock, Heart } from 'lucide-react'
import Image from "next/image"
import { useState, useEffect } from 'react';
import Header from "@/components/Header";
import * as fpixel from '@/lib/fpixel'

export default function MaleWarriorPage() {
    const [quantity, setQuantity] = useState(1);
    const [isLoading, setIsLoading] = useState(false);

    // Product pricing
    const price = 49.99;

    useEffect(() => {
        // Track GA4 view_item event
        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'view_item', {
                currency: 'USD',
                value: price,
                items: [{
                    item_id: 'male-warrior',
                    item_name: 'Male Warrior',
                    item_category: 'Male Vitality',
                    price,
                    item_brand: 'Dr. Sebi Approved'
                }]
            });
        }

        // Track ViewContent on Facebook Pixel
        fpixel.event('ViewContent', {
            content_ids: ['male-warrior'],
            content_type: 'product',
            content_name: 'Male Warrior',
            content_category: 'Male Vitality',
            value: price,
            currency: 'USD'
        });
    }, []);

    const handleAddToCart = () => {
        setIsLoading(true);

        if (typeof window !== 'undefined' && window.gtag) {
            window.gtag('event', 'add_to_cart', {
                currency: 'USD',
                value: price * quantity,
                items: [{
                    item_id: 'male-warrior',
                    item_name: 'Male Warrior',
                    item_category: 'Male Vitality',
                    price,
                    quantity: quantity
                }]
            });

            window.gtag('event', 'begin_checkout', {
                currency: 'USD',
                value: price * quantity,
                items: [{
                    item_id: 'male-warrior',
                    item_name: 'Male Warrior',
                    item_category: 'Male Vitality',
                    price,
                    quantity: quantity
                }]
            });
        }

        fpixel.event('AddToCart', {
            content_ids: ['male-warrior'],
            content_type: 'product',
            content_name: 'Male Warrior',
            value: price * quantity,
            currency: 'USD'
        });

        window.location.href = `/checkout?product=male-warrior&quantity=${quantity}`;
    };

    return (
        <div className="flex flex-col min-h-screen bg-white pt-[4.5rem]">
            <Header />

            <main className="flex-1">
                {/* Product Detail Section */}
                <section className="w-full py-8 md:py-12">
                    <div className="container px-4 md:px-6 max-w-[1200px] mx-auto">
                        <div className="grid md:grid-cols-2 gap-8 md:gap-12">

                            {/* Left Column - Product Image */}
                            <div className="flex flex-col">
                                <div className="relative bg-gradient-to-br from-red-500/5 to-black/5 rounded-2xl p-8 mb-6">
                                    <Image
                                        src="/male-warrior.png"
                                        alt="Male Warrior - Natural Vitality Supplement"
                                        width={500}
                                        height={500}
                                        className="w-full h-auto object-contain"
                                        priority
                                    />
                                </div>

                                {/* Trust Badges */}
                                <div className="grid grid-cols-3 gap-3">
                                    <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-lg">
                                        <ShieldCheck className="w-6 h-6 text-red-600 mb-1" />
                                        <span className="text-xs font-medium">100% Organic</span>
                                    </div>
                                    <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-lg">
                                        <Flame className="w-6 h-6 text-red-600 mb-1" />
                                        <span className="text-xs font-medium">Fast-Acting</span>
                                    </div>
                                    <div className="flex flex-col items-center text-center p-3 bg-gray-50 rounded-lg">
                                        <Users className="w-6 h-6 text-red-600 mb-1" />
                                        <span className="text-xs font-medium">5,000+ Men</span>
                                    </div>
                                </div>
                            </div>

                            {/* Right Column - Product Info */}
                            <div className="flex flex-col">
                                {/* Product Title */}
                                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                                    Male Warrior
                                </h1>
                                <p className="text-lg text-red-600 font-medium mb-2">
                                    Reclaim Your Edge. Reignite Your Fire.
                                </p>
                                <p className="text-muted-foreground mb-4">
                                    The all-natural formula trusted by 5,000+ men who refuse to let age, stress, or fatigue slow them down.
                                </p>

                                {/* Rating */}
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className="w-4 h-4 fill-red-600 text-red-600" />
                                        ))}
                                    </div>
                                    <span className="text-sm font-semibold">4.8/5</span>
                                    <span className="text-sm text-muted-foreground">(1,247 verified reviews)</span>
                                </div>

                                {/* Badges */}
                                <div className="flex flex-wrap gap-2 mb-6">
                                    <div className="bg-red-100 text-red-700 text-xs font-bold px-3 py-1 rounded-full border border-red-200">
                                        🔥 BESTSELLER
                                    </div>
                                    <div className="bg-black text-white text-xs font-bold px-3 py-1 rounded-full">
                                        30 CAPSULES
                                    </div>
                                    <div className="bg-green-100 text-green-700 text-xs font-bold px-3 py-1 rounded-full border border-green-200">
                                        ✓ NO PRESCRIPTION
                                    </div>
                                </div>

                                {/* Pricing */}
                                <div className="mb-6 p-6 bg-gradient-to-br from-red-50 to-red-100/50 rounded-2xl border-2 border-red-500/30">
                                    <div className="flex items-baseline gap-3 mb-2">
                                        <span className="text-4xl font-bold text-foreground">${price}</span>
                                        <span className="text-lg text-muted-foreground line-through">$79.99</span>
                                        <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">SAVE 37%</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        7 powerful herbs working together so you can perform like you&apos;re in your prime — naturally, without side effects.
                                    </p>
                                </div>

                                {/* Quantity Selector & Add to Cart */}
                                <div className="mb-6">
                                    <label className="text-sm font-medium mb-2 block">Select Your Package:</label>

                                    <div className="space-y-3 mb-4">
                                        {/* Buy 1 */}
                                        <button
                                            onClick={() => setQuantity(1)}
                                            className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all ${quantity === 1
                                                ? 'border-red-500 bg-red-50'
                                                : 'border-gray-200 bg-white hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${quantity === 1 ? 'border-red-500' : 'border-gray-300'
                                                    }`}>
                                                    {quantity === 1 && <div className="w-3 h-3 rounded-full bg-red-500" />}
                                                </div>
                                                <div className="flex flex-col items-start">
                                                    <span className="font-semibold">Starter (1 Bottle)</span>
                                                    <span className="text-xs text-muted-foreground">30-day supply</span>
                                                </div>
                                            </div>
                                            <span className="font-bold text-lg">${price}</span>
                                        </button>

                                        {/* Buy 2 */}
                                        <button
                                            onClick={() => setQuantity(2)}
                                            className={`w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all relative ${quantity === 2
                                                ? 'border-red-500 bg-red-50 ring-2 ring-red-500/20'
                                                : 'border-gray-200 bg-white hover:border-gray-300'
                                                }`}
                                        >
                                            <div className="absolute -top-2 left-4 bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                                                MOST POPULAR
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${quantity === 2 ? 'border-red-500' : 'border-gray-300'
                                                    }`}>
                                                    {quantity === 2 && <div className="w-3 h-3 rounded-full bg-red-500" />}
                                                </div>
                                                <div className="flex flex-col items-start">
                                                    <span className="font-semibold">Best Value (2 Bottles)</span>
                                                    <span className="text-xs text-green-600 font-medium">FREE Shipping + Save $10</span>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="font-bold text-lg">${(price * 2 - 10).toFixed(2)}</span>
                                                <span className="text-xs text-muted-foreground line-through">${(price * 2).toFixed(2)}</span>
                                            </div>
                                        </button>
                                    </div>

                                    {/* Add to Cart Button */}
                                    <Button
                                        onClick={handleAddToCart}
                                        disabled={isLoading}
                                        size="lg"
                                        className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-bold text-lg py-7 rounded-full shadow-lg shadow-red-500/25 hover:scale-105 transition-all"
                                    >
                                        <ShoppingCart className="w-5 h-5 mr-2" />
                                        {isLoading ? 'Processing...' : 'Add to Cart — Feel the Difference'}
                                    </Button>

                                    <p className="text-center text-xs text-muted-foreground mt-3">
                                        🔒 Secure checkout • 30-day money-back guarantee
                                    </p>
                                </div>

                                {/* What You'll Experience */}
                                <div className="mb-6">
                                    <h3 className="font-bold text-lg mb-3">What You&apos;ll Experience:</h3>
                                    <div className="space-y-3">
                                        {[
                                            { icon: <Flame className="h-5 w-5 text-red-600" />, text: "Renewed stamina & staying power when it matters most" },
                                            { icon: <Target className="h-5 w-5 text-red-600" />, text: "Harder, more reliable performance — without the pills" },
                                            { icon: <Zap className="h-5 w-5 text-red-600" />, text: "All-day energy that doesn't crash" },
                                            { icon: <Heart className="h-5 w-5 text-red-600" />, text: "Improved drive & desire — feel like yourself again" },
                                            { icon: <Award className="h-5 w-5 text-red-600" />, text: "Confidence that comes from knowing your body works" }
                                        ].map((benefit, i) => (
                                            <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                                {benefit.icon}
                                                <span className="text-sm font-medium">{benefit.text}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Free Gifts Section */}
                                <div className="p-6 bg-gradient-to-br from-red-500/5 to-black/5 rounded-2xl border-2 border-red-500/20">
                                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                                        <Gift className="w-5 h-5 text-red-600" />
                                        FREE WITH YOUR ORDER
                                    </h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="flex flex-col items-center text-center p-4 bg-white rounded-xl border border-gray-200">
                                            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-2">
                                                <Download className="w-6 h-6 text-red-600" />
                                            </div>
                                            <span className="text-xs font-bold mb-1">FREE EBOOK</span>
                                            <span className="text-xs text-muted-foreground">"The Modern Man's Vitality Blueprint"</span>
                                        </div>

                                        <div className="flex flex-col items-center text-center p-4 bg-white rounded-xl border border-gray-200">
                                            <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mb-2">
                                                <ShieldCheck className="w-6 h-6 text-red-600" />
                                            </div>
                                            <span className="text-xs font-bold mb-1">FREE SHIPPING</span>
                                            <span className="text-xs text-muted-foreground">On 2+ bottles</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Who This Is For Section */}
                <section className="w-full py-12 bg-black text-white">
                    <div className="container px-4 md:px-6 max-w-[1000px] mx-auto">
                        <h2 className="text-3xl font-bold mb-8 text-center">Is Male Warrior Right For You?</h2>

                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="p-6 bg-green-900/30 rounded-2xl border border-green-500/30">
                                <h3 className="font-bold text-lg mb-4 text-green-400">✓ This IS for you if:</h3>
                                <ul className="space-y-3">
                                    {[
                                        "You've noticed your energy and drive aren't what they used to be",
                                        "You want to feel confident and capable in the bedroom again",
                                        "You're tired of feeling sluggish and 'old before your time'",
                                        "You want a natural solution — no prescriptions, no side effects",
                                        "You're ready to invest in your health and relationship"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                            <CheckCircle className="h-4 w-4 text-green-400 flex-shrink-0 mt-0.5" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <div className="p-6 bg-red-900/30 rounded-2xl border border-red-500/30">
                                <h3 className="font-bold text-lg mb-4 text-red-400">✗ This is NOT for you if:</h3>
                                <ul className="space-y-3">
                                    {[
                                        "You're looking for an instant 'magic pill' fix",
                                        "You won't take it consistently for at least 30 days",
                                        "You don't believe natural herbs can make a difference",
                                        "You're not willing to invest in quality ingredients"
                                    ].map((item, i) => (
                                        <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                                            <span className="text-red-400">✗</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Ingredients Section */}
                <section className="w-full py-12 bg-gray-50">
                    <div className="container px-4 md:px-6 max-w-[1200px] mx-auto">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold mb-4">7 Ancient Herbs. One Powerful Formula.</h2>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                Each ingredient in Male Warrior has been used for centuries by traditional healers to support male vitality. We&apos;ve combined them in precise ratios for maximum effect.
                            </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6 mb-8">
                            <Card className="border-2 hover:border-red-500 transition-colors">
                                <CardContent className="p-6">
                                    <h3 className="text-xl font-bold mb-2 text-red-600">Tongkat Ali</h3>
                                    <p className="text-xs text-muted-foreground mb-3">Malaysian Ginseng</p>
                                    <p className="text-sm text-muted-foreground">
                                        Called "Nature's Viagra" in Southeast Asia. Studies show it may boost testosterone by up to 37% and significantly improve male performance markers.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-2 hover:border-red-500 transition-colors">
                                <CardContent className="p-6">
                                    <h3 className="text-xl font-bold mb-2 text-red-600">Yohimbe</h3>
                                    <p className="text-xs text-muted-foreground mb-3">African Bark Extract</p>
                                    <p className="text-sm text-muted-foreground">
                                        Used by African warriors for centuries. Supports healthy blood flow exactly where you need it most, helping you achieve and maintain peak performance.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-2 hover:border-red-500 transition-colors">
                                <CardContent className="p-6">
                                    <h3 className="text-xl font-bold mb-2 text-red-600">Damiana</h3>
                                    <p className="text-xs text-muted-foreground mb-3">Mexican Love Herb</p>
                                    <p className="text-sm text-muted-foreground">
                                        The Mayans used this "herb of the gods" for arousal and desire. Natural aphrodisiac that helps reignite passion and drive.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-2 hover:border-red-500 transition-colors">
                                <CardContent className="p-6">
                                    <h3 className="text-xl font-bold mb-2 text-red-600">Sarsaparilla Root</h3>
                                    <p className="text-xs text-muted-foreground mb-3">Hormone Balancer</p>
                                    <p className="text-sm text-muted-foreground">
                                        Contains plant sterols that mimic testosterone's effects. Helps restore hormonal balance and supports sustained energy throughout the day.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-2 hover:border-red-500 transition-colors">
                                <CardContent className="p-6">
                                    <h3 className="text-xl font-bold mb-2 text-red-600">Irish Sea Moss</h3>
                                    <p className="text-xs text-muted-foreground mb-3">92 Minerals from Honduras</p>
                                    <p className="text-sm text-muted-foreground">
                                        Nature's multivitamin with 92 of the 102 minerals your body needs. Supports thyroid function, which directly impacts energy and metabolism.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-2 hover:border-red-500 transition-colors">
                                <CardContent className="p-6">
                                    <h3 className="text-xl font-bold mb-2 text-red-600">Capadulla + Nopal</h3>
                                    <p className="text-xs text-muted-foreground mb-3">Amazonian Power Duo</p>
                                    <p className="text-sm text-muted-foreground">
                                        Capadulla is called "jungle Viagra" in South America. Combined with Nopal cactus for sustained endurance and blood sugar balance.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="w-full py-12 bg-white">
                    <div className="container px-4 md:px-6 max-w-[1200px] mx-auto">
                        <h2 className="text-3xl font-bold mb-8 text-center">Real Men. Real Results.</h2>

                        <div className="grid md:grid-cols-3 gap-6">
                            {[
                                {
                                    name: "Marcus T.",
                                    age: "52",
                                    location: "Houston, TX",
                                    quote: "I was skeptical, but after 3 weeks my wife noticed the difference before I did. We're like newlyweds again. This stuff actually works.",
                                    rating: 5
                                },
                                {
                                    name: "David R.",
                                    age: "47",
                                    location: "Atlanta, GA",
                                    quote: "Tried the blue pills and hated the side effects. Male Warrior gives me the confidence without the headaches. Natural is the way to go.",
                                    rating: 5
                                },
                                {
                                    name: "James K.",
                                    age: "38",
                                    location: "Chicago, IL",
                                    quote: "My energy was gone after hitting 35. Two weeks in and I'm waking up ready to go. My workouts are better, my drive is back. Game changer.",
                                    rating: 5
                                }
                            ].map((testimonial, i) => (
                                <Card key={i} className="border-2">
                                    <CardContent className="p-6">
                                        <div className="flex mb-4">
                                            {[...Array(testimonial.rating)].map((_, i) => (
                                                <Star key={i} className="h-4 w-4 fill-red-600 text-red-600" />
                                            ))}
                                        </div>
                                        <p className="text-sm text-muted-foreground mb-4 italic">"{testimonial.quote}"</p>
                                        <div className="flex items-center gap-2">
                                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                                                <span className="text-red-600 font-bold">{testimonial.name.charAt(0)}</span>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm">{testimonial.name}, {testimonial.age}</p>
                                                <p className="text-xs text-muted-foreground">{testimonial.location}</p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Disclaimer */}
                        <p className="text-xs text-gray-400 text-center mt-6 italic">
                            *Individual results may vary. These testimonials represent individual experiences.
                        </p>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="w-full py-12 bg-gray-50">
                    <div className="container px-4 md:px-6 max-w-[800px] mx-auto">
                        <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>

                        <div className="space-y-4">
                            {[
                                {
                                    q: "How quickly will I see results?",
                                    a: "Most men notice increased energy within the first week. For the full effects on stamina and performance, give it 2-4 weeks of consistent use. The herbs need time to build up in your system."
                                },
                                {
                                    q: "Are there any side effects?",
                                    a: "Male Warrior uses 100% natural, organic ingredients. Unlike prescription medications, there are no harsh side effects. However, if you're on blood thinners or have heart conditions, consult your doctor first."
                                },
                                {
                                    q: "How do I take it?",
                                    a: "Take 1 capsule daily with food, preferably in the morning. For best results, take consistently at the same time each day. Each bottle contains a 30-day supply."
                                },
                                {
                                    q: "Is this safe with my medications?",
                                    a: "While Male Warrior is all-natural, we always recommend consulting with your healthcare provider before starting any new supplement, especially if you're on prescription medications."
                                },
                                {
                                    q: "What if it doesn't work for me?",
                                    a: "We offer a 30-day money-back guarantee. If you're not satisfied with your results, contact us for a full refund. We're confident you'll feel the difference."
                                }
                            ].map((faq, i) => (
                                <div key={i} className="p-6 bg-white rounded-xl border border-gray-200">
                                    <h3 className="font-bold text-lg mb-2">{faq.q}</h3>
                                    <p className="text-sm text-muted-foreground">{faq.a}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Final CTA Section */}
                <section className="w-full py-16 bg-gradient-to-br from-black via-gray-900 to-black">
                    <div className="container px-4 md:px-6 max-w-[800px] mx-auto text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                            Stop Making Excuses. Start Being the Man You Used to Be.
                        </h2>
                        <p className="text-xl text-gray-300 mb-6">
                            Every day you wait is another day of low energy, missed moments, and frustration. Male Warrior gives you back what time and stress have taken.
                        </p>
                        <div className="flex flex-col items-center gap-4">
                            <Button
                                onClick={handleAddToCart}
                                size="lg"
                                className="bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-600 text-white font-bold text-lg px-12 py-7 rounded-full shadow-2xl hover:scale-105 transition-all"
                            >
                                <ShoppingCart className="w-5 h-5 mr-2" />
                                Get Male Warrior Now — ${price}
                            </Button>
                            <div className="flex items-center gap-4 text-sm text-gray-400">
                                <span>🔒 Secure Checkout</span>
                                <span>•</span>
                                <span>📦 Ships in 24 Hours</span>
                                <span>•</span>
                                <span>✓ 30-Day Guarantee</span>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="w-full border-t border-gray-200 bg-gray-50">
                <div className="container px-4 py-8 md:px-6">
                    <div className="text-center text-sm text-gray-600">
                        <p className="mb-2">© 2024 Dr. Sebi Approved LLC. All rights reserved.</p>
                        <p className="text-xs text-gray-500">
                            These statements have not been evaluated by the FDA. This product is not intended to diagnose, treat, cure, or prevent any disease.
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
