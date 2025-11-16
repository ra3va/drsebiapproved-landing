'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Shield, Lock, CheckCircle, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import SquareCheckout from '@/components/SquareCheckout'

// Product configuration
const PRODUCTS = {
  'paracleanse': {
    id: 'paracleanse',
    name: 'ParaCleanse Elite',
    price: 8999,
    variationId: '5JV44RI47GC5IMYSENVXMV3D',
    image: '/images/a-professional-product-photograph-of-a-w_zeo86TvIQFau7gWgbBC4-w_CZQgJHF8T3a9i_QJIFkMfQ-removebg-preview.png',
    description: 'Two-Phase Parasite Cleansing System',
    features: [
      'Phase 1: ParaWash Biofilm Disruptor',
      'Phase 2: Intracellular Body Cleanse',
      '14-Day Supply (Full Treatment)',
      'Detailed Instructions & Protocol'
    ]
  },
  'maya': {
    id: 'maya',
    name: 'Maya Formula',
    price: 5999,
    variationId: 'TWJMT4CUFNFNQKG3S5EQRPLO',
    image: '/maya.png',
    description: '26 Herb Iron-Rich Formula',
    features: [
      '26 Wildcrafted Herbs',
      'Iron-Rich Blood Support',
      'Brain & Nervous System',
      '8 fl oz Liquid Formula'
    ]
  },
  'seamoss': {
    id: 'seamoss',
    name: 'Sea Moss Capsules',
    price: 4999,
    variationId: 'YGDG42LYJKWH75NNW6HPWP5M',
    image: '/seamoss.png',
    description: 'Honduran Wildcrafted Sea Moss',
    features: [
      '92 Essential Minerals',
      'Thyroid Support',
      'Immune System Boost',
      '40 Capsules'
    ]
  },
  'mucus-cleanser': {
    id: 'mucus-cleanser',
    name: 'Mucus Cleanser',
    price: 5999,
    variationId: '6JARPI34BXU27SS36ZFSEJQP',
    image: '/mucus.png',
    description: 'Respiratory & Cellular Cleansing',
    features: [
      'Eliminates Excess Mucus',
      'Respiratory Support',
      'Cellular Detoxification',
      '30 Capsules'
    ]
  }
}

function CheckoutContent() {
  const searchParams = useSearchParams()
  const [product, setProduct] = useState<any>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const productId = searchParams?.get('product') || 'paracleanse'
    setProduct(PRODUCTS[productId as keyof typeof PRODUCTS] || PRODUCTS.paracleanse)
  }, [searchParams])

  if (!mounted || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Minimal Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href={`/${product.id}`} className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span className="text-sm">Back to Product</span>
            </Link>
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-900">Secure Checkout</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8 lg:py-12">
        <div className="grid lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-12">
          {/* Left Column - Checkout Form */}
          <div className="order-2 lg:order-1 min-w-0">
            <SquareCheckout
              productName={product.name}
              price={product.price}
              variationId={product.variationId}
              onSuccess={() => {
                // Redirect to success page
                window.location.href = '/checkout/success'
              }}
            />
          </div>

          {/* Right Column - Order Summary */}
          <div className="order-1 lg:order-2 min-w-0">
            <div className="lg:sticky lg:top-24">
              {/* Order Summary Card */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm mb-4 sm:mb-6">
                <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4 sm:mb-6">Order Summary</h2>
                
                {/* Product Details */}
                <div className="flex gap-3 sm:gap-4 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-200">
                  <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-contain p-2"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 mb-1 text-sm sm:text-base">{product.name}</h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-2">{product.description}</p>
                    <p className="text-base sm:text-lg font-bold text-primary">${(product.price / 100).toFixed(2)}</p>
                  </div>
                </div>

                {/* What's Included */}
                <div className="mb-4 sm:mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2 sm:mb-3 text-sm sm:text-base">What's Included:</h4>
                  <ul className="space-y-1.5 sm:space-y-2">
                    {product.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-start gap-2 text-xs sm:text-sm text-gray-600">
                        <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Price Breakdown */}
                <div className="space-y-2 sm:space-y-3 pt-4 sm:pt-6 border-t border-gray-200">
                  <div className="flex justify-between text-sm sm:text-base text-gray-600">
                    <span>Subtotal</span>
                    <span>${(product.price / 100).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm sm:text-base text-green-600 font-medium">
                    <span>Shipping</span>
                    <span>FREE</span>
                  </div>
                  <div className="flex justify-between text-lg sm:text-xl font-bold text-gray-900 pt-2 sm:pt-3 border-t border-gray-200">
                    <span>Total</span>
                    <span>${(product.price / 100).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Trust Badges */}
              <div className="bg-white rounded-lg border border-gray-200 p-4 sm:p-6 shadow-sm">
                <h3 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Why Shop With Us?</h3>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-medium text-gray-900 text-xs sm:text-sm">30-Day Money Back Guarantee</h4>
                      <p className="text-xs text-gray-600 mt-0.5 sm:mt-1">Not satisfied? Get a full refund, no questions asked.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-medium text-gray-900 text-xs sm:text-sm">Secure Payment</h4>
                      <p className="text-xs text-gray-600 mt-0.5 sm:mt-1">Your payment information is encrypted and secure.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-2 sm:gap-3">
                    <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-medium text-gray-900 text-xs sm:text-sm">100% Authentic</h4>
                      <p className="text-xs text-gray-600 mt-0.5 sm:mt-1">Original Dr. Sebi formulas, made in Honduras.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Support */}
              <div className="mt-4 sm:mt-6 text-center">
                <p className="text-xs sm:text-sm text-gray-600">
                  Need help? <a href="mailto:support@drsebiapproved.com" className="text-primary hover:underline font-medium">Contact Support</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer Trust Bar */}
      <div className="bg-white border-t border-gray-200 mt-8 sm:mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-8 text-xs sm:text-sm text-gray-600">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Lock className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
              <span>SSL Encrypted</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <Shield className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
              <span>30-Day Guarantee</span>
            </div>
            <div className="flex items-center gap-1.5 sm:gap-2">
              <CheckCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-gray-400" />
              <span>Free US Shipping</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


export default function CheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    }>
      <CheckoutContent />
    </Suspense>
  )
}
