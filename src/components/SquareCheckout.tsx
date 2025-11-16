'use client'

import { useEffect, useState, useRef, useCallback } from 'react'

interface SquareCheckoutProps {
  productName: string
  price: number // in cents
  variationId: string
  onSuccess?: () => void
}

declare global {
  interface Window {
    Square?: any
  }
}

export default function SquareCheckout({
  productName,
  price,
  variationId,
  onSuccess
}: SquareCheckoutProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [card, setCard] = useState<any>(null)
  const [couponCode, setCouponCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [verifyingCoupon, setVerifyingCoupon] = useState(false)
  const [cardInitialized, setCardInitialized] = useState(false)
  
  // Use ref to prevent double initialization in React Strict Mode
  const initializingRef = useRef(false)
  const cardInstanceRef = useRef<any>(null)
  
  // Customer details
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zipCode, setZipCode] = useState('')

  const initializeSquare = useCallback(async () => {
    // Prevent multiple simultaneous initializations
    if (initializingRef.current) {
      console.log('Already initializing, skipping...')
      return
    }

    // Prevent re-initialization if already done
    if (cardInstanceRef.current || cardInitialized) {
      console.log('Square already initialized, skipping...')
      return
    }

    if (!window.Square) {
      console.error('Square.js failed to load')
      setError('Payment form blocked. Please disable ad blocker and refresh.')
      return
    }

    initializingRef.current = true

    try {
      const container = document.getElementById('card-container')
      if (!container) {
        console.error('Card container not found')
        initializingRef.current = false
        return
      }

      // Clear any existing content
      container.innerHTML = ''

      const payments = window.Square.payments(
        process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID,
        process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID
      )

      const cardInstance = await payments.card()
      await cardInstance.attach('#card-container')
      
      cardInstanceRef.current = cardInstance
      setCard(cardInstance)
      setCardInitialized(true)
      console.log('✅ Square card form initialized')
    } catch (e: any) {
      console.error('Failed to initialize Square:', e)
      setError('Payment form blocked. Please disable ad blocker and refresh.')
    } finally {
      initializingRef.current = false
    }
  }, [cardInitialized])

  useEffect(() => {
    // Check if Square is already loaded
    if (window.Square) {
      initializeSquare()
      return
    }

    // Check if script is already in the document
    const existingScript = document.querySelector('script[src="https://web.squarecdn.com/v1/square.js"]')
    if (existingScript) {
      existingScript.addEventListener('load', initializeSquare)
      return () => {
        existingScript.removeEventListener('load', initializeSquare)
      }
    }

    // Load Square script
    const script = document.createElement('script')
    script.src = 'https://web.squarecdn.com/v1/square.js'
    script.async = true
    script.onload = initializeSquare
    document.body.appendChild(script)

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script)
      }
    }
  }, [initializeSquare])

  async function verifyCoupon() {
    if (!couponCode.trim()) return

    setVerifyingCoupon(true)
    setError(null)

    try {
      const response = await fetch('/api/square/verify-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, price })
      })

      const data = await response.json()

      if (data.valid) {
        setDiscount(data.discount)
      } else {
        setError('Invalid coupon code')
        setDiscount(0)
      }
    } catch (e: any) {
      setError('Failed to verify coupon')
      setDiscount(0)
    } finally {
      setVerifyingCoupon(false)
    }
  }

  async function handlePayment() {
    const cardToUse = cardInstanceRef.current || card
    if (!cardToUse) return

    // Validate required fields
    if (!email || !fullName || !address || !city || !state || !zipCode) {
      setError('Please fill in all required shipping information')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const result = await cardToUse.tokenize()

      if (result.status === 'OK') {
        const finalAmount = price - discount

        // Send payment to backend
        const response = await fetch('/api/square/process-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sourceId: result.token,
            amount: finalAmount,
            productName,
            variationId,
            couponCode: couponCode || undefined,
            customerDetails: {
              email,
              name: fullName,
              phone,
              address: {
                addressLine1: address,
                locality: city,
                administrativeDistrictLevel1: state,
                postalCode: zipCode,
                country: 'US'
              }
            }
          })
        })

        const data = await response.json()

        if (data.success) {
          onSuccess?.()
        } else {
          setError(data.error || 'Payment failed')
        }
      } else {
        setError('Card validation failed')
      }
    } catch (e: any) {
      setError(e.message || 'Payment failed')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 shadow-lg max-w-full overflow-hidden">
      <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 break-words">
        {productName}
      </h3>
      <p className="text-2xl sm:text-3xl font-bold text-primary mb-4 sm:mb-6">
        ${(price / 100).toFixed(2)}
      </p>

      {/* Customer Information */}
      <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
        <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Contact Information</h4>
        
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            Email Address *
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
            required
          />
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="John Doe"
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
            required
          />
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(555) 123-4567"
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
          />
        </div>
      </div>

      {/* Shipping Address */}
      <div className="space-y-3 sm:space-y-4 mb-4 sm:mb-6">
        <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Shipping Address</h4>
        
        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            Street Address *
          </label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="123 Main St"
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              City *
            </label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="New York"
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
              required
            />
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              State *
            </label>
            <input
              type="text"
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="NY"
              className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
            ZIP Code *
          </label>
          <input
            type="text"
            value={zipCode}
            onChange={(e) => setZipCode(e.target.value)}
            placeholder="10001"
            className="w-full px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
            required
          />
        </div>
      </div>

      {/* Payment Information */}
      <div className="mb-4 sm:mb-6">
        <h4 className="font-semibold text-gray-900 mb-3 sm:mb-4 text-sm sm:text-base">Payment Information</h4>
        <div id="card-container" className="mb-3 sm:mb-4 max-w-full overflow-hidden"></div>
      </div>

      {/* Coupon Code */}
      <div className="mb-4 sm:mb-6">
        <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
          Coupon Code (Optional)
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            placeholder="Enter code"
            className="flex-1 min-w-0 px-3 sm:px-4 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-sm sm:text-base"
          />
          <button
            onClick={verifyCoupon}
            disabled={verifyingCoupon || !couponCode.trim()}
            className={`px-4 sm:px-6 py-2 sm:py-2.5 rounded-lg font-semibold transition-all text-sm sm:text-base whitespace-nowrap ${
              verifyingCoupon || !couponCode.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-primary hover:bg-primary/90 text-white'
            }`}
          >
            {verifyingCoupon ? 'Checking...' : 'Apply'}
          </button>
        </div>
        {discount > 0 && (
          <p className="mt-2 text-sm text-green-600">
            ✓ Discount applied: -${(discount / 100).toFixed(2)}
          </p>
        )}
      </div>

      {/* Price Summary */}
      {discount > 0 && (
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="flex justify-between text-xs sm:text-sm text-gray-600 mb-1">
            <span>Subtotal:</span>
            <span>${(price / 100).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xs sm:text-sm text-green-600 mb-1">
            <span>Discount:</span>
            <span>-${(discount / 100).toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-base sm:text-lg font-bold text-gray-900 pt-2 border-t border-gray-200">
            <span>Total:</span>
            <span>${((price - discount) / 100).toFixed(2)}</span>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-xs sm:text-sm">
          {error}
        </div>
      )}

      <button
        onClick={handlePayment}
        disabled={isLoading || !cardInitialized}
        className={`w-full py-3 sm:py-4 rounded-lg font-semibold transition-all text-base sm:text-lg ${
          isLoading || !cardInitialized
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-primary hover:bg-primary/90 text-white shadow-lg'
        }`}
      >
        {isLoading ? 'Processing...' : `Complete Purchase - $${((price - discount) / 100).toFixed(2)}`}
      </button>

      <p className="mt-3 sm:mt-4 text-xs text-center text-gray-500">
        🔒 Secure payment powered by Square
      </p>
    </div>
  )
}
