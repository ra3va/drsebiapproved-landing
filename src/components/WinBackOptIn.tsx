'use client';

import { useState } from 'react';

interface WinBackOptInProps {
  onSuccess?: (discountCode: string) => void;
  className?: string;
}

export default function WinBackOptIn({ onSuccess, className = '' }: WinBackOptInProps) {
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [discountCode, setDiscountCode] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/brevo/winback-optin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          firstName,
          source: 'winback-landing'
        })
      });

      const result = await response.json();

      if (result.success) {
        // Identify user for behavioral tracking
        if ((window as any).Brevo) {
          (window as any).Brevo.push(['identify', {
            email: email,
            FIRSTNAME: firstName,
            source: 'winback-landing',
            signup_date: new Date().toISOString()
          }]);
        }

        setDiscountCode(result.discountCode);
        setIsSubmitted(true);

        if (onSuccess) {
          onSuccess(result.discountCode);
        }

        // Redirect to checkout with auto-applied coupon AND pre-filled contact data
        setTimeout(() => {
          const checkoutUrl = new URLSearchParams({
            product: 'mucus-cleanser',
            coupon: result.discountCode,
            email: email,
            ...(firstName && { firstName: firstName })
          });
          window.location.href = `/checkout?${checkoutUrl.toString()}`;
        }, 1000); // 1 second delay to show success state
      } else {
        setError(result.message || 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting email:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className={`bg-white rounded-lg shadow-xl p-8 ${className}`}>
        <div className="text-center">
          <div className="mb-6">
            <svg
              className="mx-auto h-16 w-16 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Discount Claimed! 🎉
          </h3>

          <div className="bg-green-50 border-2 border-green-600 rounded-lg p-6 mb-6">
            <p className="text-sm text-gray-600 mb-2">Your Discount Code:</p>
            <p className="text-4xl font-bold text-green-600 tracking-wider">
              {discountCode}
            </p>
          </div>

          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
            <p className="text-lg font-semibold text-gray-700">
              Redirecting to secure checkout...
            </p>
          </div>

          <p className="text-sm text-gray-500">
            Your code will be automatically applied
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-white rounded-lg shadow-xl p-8 ${className}`}>
      <div className="text-center mb-6">
        <h3 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
          Unlock Your Exclusive Return Offer
        </h3>
        <p className="text-gray-600">
          Enter your email to reveal your 37% off discount code
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
            First Name (Optional)
          </label>
          <input
            type="text"
            id="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="Your first name"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            placeholder="you@example.com"
            disabled={isLoading}
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !email}
          className="w-full bg-green-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-green-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Unlocking Your Discount...' : 'Get My Discount Code →'}
        </button>

        <p className="text-xs text-gray-500 text-center">
          By submitting, you'll receive exclusive offers and health tips from Dr. Sebi Approved.
          You can unsubscribe anytime.
        </p>
      </form>
    </div>
  );
}
