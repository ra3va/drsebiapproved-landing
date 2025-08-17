'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { X, Download, Mail } from "lucide-react";
import Image from "next/image";

interface GutHealthLeadMagnetProps {
  className?: string;
  onClose?: () => void;
}

export default function GutHealthLeadMagnet({ className = "", onClose }: GutHealthLeadMagnetProps) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    try {
      // Submit to Brevo API endpoint
      const response = await fetch('/api/brevo/add-contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          firstName,
          source: 'gut-health-guide',
          listName: 'Gut Health Guide Downloads'
        })
      });

      const result = await response.json();

      if (result.success) {
        console.log('Email successfully added to Brevo:', result.data);
        
        // Identify user for behavioral tracking
        if ((window as any).Brevo) {
          (window as any).Brevo.push(['identify', {
            email: email,
            source: 'gut-health-guide',
            signup_date: new Date().toISOString()
          }]);
        }
        
        setIsSubmitted(true);
      } else {
        throw new Error(result.message || 'Failed to add email');
      }
    } catch (error) {
      console.error('Error submitting email:', error);
      alert('Sorry, there was an error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isDismissed) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setIsDismissed(true);
          onClose?.();
        }
      }}
    >
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto border-2 border-primary/20 bg-gradient-to-r from-green-50 to-blue-50 shadow-2xl">
        <CardContent className="p-0">
          <div className="relative">
            <button
              onClick={() => {
                setIsDismissed(true);
                onClose?.();
              }}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-white transition-all duration-200 shadow-lg"
              aria-label="Close Modal"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          
          <div className="flex flex-col md:flex-row items-center">
            {/* Image Section */}
            <div className="w-full md:w-2/5 p-6 md:p-8">
              <div className="relative aspect-[4/5] max-w-xs mx-auto">
                <Image
                  src="/3066a71b-75c7-4a5c-876a-3d7c080cde01.jpeg"
                  alt="The Hidden Parasite Crisis - Free Guide"
                  fill
                  className="object-contain rounded-lg"
                  priority={false}
                />
              </div>
            </div>

            {/* Content Section */}
            <div className="w-full md:w-3/5 p-6 md:p-8">
              {!isSubmitted ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm text-[#00A6E6] font-semibold uppercase tracking-wide">
                    <Download className="w-4 h-4" />
                    Free Download
                  </div>
                  
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 leading-tight">
                    Get "The Hidden Parasite Crisis" Guide FREE
                  </h3>
                  
                  <p className="text-gray-600 text-lg leading-relaxed">
                    <strong>Dr. Sebi's Complete Guide to Eliminate Silent Invaders and Reclaim Your Health.</strong> Discover why millions suffer from unexplained symptoms and the 2-phase protocol that actually works.
                  </p>

                  <div className="pt-2">
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col sm:flex-row gap-3">
                          <div className="flex-1">
                            <Input
                              type="text"
                              placeholder="First name"
                              value={firstName}
                              onChange={(e) => setFirstName(e.target.value)}
                              className="h-12 text-base border-gray-300 focus:border-[#00A6E6] focus:ring-[#00A6E6]"
                            />
                          </div>
                          <div className="flex-1">
                            <Input
                              type="email"
                              placeholder="Email address"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                              className="h-12 text-base border-gray-300 focus:border-[#00A6E6] focus:ring-[#00A6E6]"
                            />
                          </div>
                        </div>
                        <div className="w-full">
                          <Button
                            type="submit"
                            disabled={isLoading || !email}
                            className="w-full h-12 px-6 bg-[#00A6E6] hover:bg-[#0095D1] text-white font-semibold transition-all duration-200"
                          >
                          {isLoading ? (
                            <span className="flex items-center gap-2">
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                              Sending...
                            </span>
                          ) : (
                            <span className="flex items-center gap-2">
                              <Mail className="w-4 h-4" />
                              Get Free Guide
                            </span>
                          )}
                        </Button>
                        </div>
                      </div>
                      <p className="text-xs text-gray-500">
                        We respect your privacy. No spam, ever. Unsubscribe at any time.
                      </p>
                    </form>
                  </div>
                </div>
              ) : (
                <div className="text-center space-y-4 py-8">
                  <div className="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center">
                    <Download className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">Check Your Email{firstName && `, ${firstName}`}!</h3>
                  <p className="text-gray-600 max-w-md mx-auto">
                    We've sent "The Hidden Parasite Crisis" guide to <strong>{email}</strong>. 
                    Check your inbox (and spam folder) to discover the truth about parasites and Dr. Sebi's elimination protocol.
                  </p>
                  <Button
                    onClick={() => {
                      setIsDismissed(true);
                      onClose?.();
                    }}
                    variant="outline"
                    className="mt-4"
                  >
                    Continue Reading
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
    </div>
  );
}