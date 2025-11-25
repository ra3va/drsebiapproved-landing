'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react'
import * as fpixel from '@/lib/fpixel'

interface CartItem {
  id: string
  name: string
  price: number
  variationId: string
  quantity: number
  image?: string
}

interface SquareCheckoutProps {
  productName: string
  price: number // in cents
  variationId: string
  productImage?: string
  productId: string
  initialCoupon?: string
  initialEmail?: string
  initialFirstName?: string
  initialQuantity?: number
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
  productImage,
  productId,
  initialCoupon,
  initialEmail,
  initialFirstName,
  initialQuantity = 1,
  onSuccess
}: SquareCheckoutProps) {
  // Cart state - support multiple items
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: productId,
      name: productName,
      price: price,
      variationId: variationId,
      quantity: initialQuantity,
      image: productImage
    }
  ])

  // Multi-step state
  const [currentStep, setCurrentStep] = useState(1)
  const [summaryExpanded, setSummaryExpanded] = useState(false)

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
  const formRef = useRef<HTMLDivElement>(null)

  // Customer details
  const [email, setEmail] = useState('')
  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zipCode, setZipCode] = useState('')

  // Format phone number as user types: (555) 123-4567
  const formatPhoneNumber = (value: string) => {
    // Remove all non-digit characters
    const phoneNumber = value.replace(/\D/g, '')

    // Don't format if empty
    if (!phoneNumber) return ''

    // Format based on length
    if (phoneNumber.length <= 3) {
      return phoneNumber
    } else if (phoneNumber.length <= 6) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`
    } else {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`
    }
  }

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value)
    setPhone(formatted)
  }

  const steps = [
    { number: 1, title: 'Contact', label: 'Contact Info' },
    { number: 2, title: 'Shipping', label: 'Shipping Address' },
    { number: 3, title: 'Payment', label: 'Payment & Review' }
  ]

  // Calculate totals
  const SHIPPING_COST = 595 // $5.95 in cents
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const shippingCost = totalQuantity >= 2 ? 0 : SHIPPING_COST
  const totalBeforeDiscount = subtotal + shippingCost
  const finalTotal = totalBeforeDiscount - discount

  // Update quantity for main product
  const updateQuantity = (newQuantity: number) => {
    if (newQuantity < 1) return
    setCartItems(prev => prev.map(item =>
      item.id === productId
        ? { ...item, quantity: newQuantity }
        : item
    ))
  }

  // Add upsell product to cart
  const addUpsellProduct = (product: { id: string, name: string, price: number, variationId: string, image?: string }) => {
    // Track GA4 add_to_cart for bundle/upsell item
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'add_to_cart', {
        currency: 'USD',
        value: product.price / 100,
        items: [{
          item_id: product.id,
          item_name: product.name,
          item_category: 'Health Supplements',
          price: product.price / 100,
          quantity: 1,
          item_list_name: 'Checkout Upsell'
        }]
      });
    }

    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  // Remove item from cart
  const removeFromCart = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId))
  }

  // Scroll to top when step changes
  useEffect(() => {
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }, [currentStep])

  // Pre-fill contact info from URL parameters (win-back flow)
  useEffect(() => {
    if (initialEmail && !email) {
      setEmail(initialEmail)
    }
    if (initialFirstName && !fullName) {
      setFullName(initialFirstName)
    }
  }, [initialEmail, initialFirstName, email, fullName]) // Only run on mount or when props change

  // Auto-apply coupon from URL parameter
  useEffect(() => {
    if (initialCoupon && !couponCode) {
      setCouponCode(initialCoupon)
      // Auto-verify the coupon once subtotal is available
      if (subtotal > 0) {
        const autoVerify = async () => {
          setVerifyingCoupon(true)
          try {
            const response = await fetch('/api/square/verify-coupon', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ code: initialCoupon, price: subtotal })
            })
            const data = await response.json()
            if (data.valid) {
              setDiscount(data.discount)
            }
          } catch (e) {
            console.error('Failed to auto-apply coupon:', e)
          } finally {
            setVerifyingCoupon(false)
          }
        }
        autoVerify()
      }
    }
  }, [initialCoupon, subtotal, couponCode]) // Include couponCode to prevent re-runs

  // Cart abandonment tracking
  useEffect(() => {
    // Only track if email has been entered
    if (!email) return

    const handleBeforeUnload = () => {
      // Don't track if purchase was completed
      if (localStorage.getItem('lastOrder')) return

      // Mark cart as abandoned
      const alreadyAbandoned = localStorage.getItem('cartAbandoned')
      if (alreadyAbandoned) return // Already tracked

      localStorage.setItem('cartAbandoned', 'true')

      // NEW: Determine abandonment stage and intent level
      let abandonmentStage = 'step_1';
      let intentLevel = 'low';

      if (currentStep === 2) {
        abandonmentStage = 'step_2';
        intentLevel = 'medium';
      } else if (currentStep === 3) {
        abandonmentStage = 'step_3';
        intentLevel = 'high';
      }

      // Send to Brevo API with stage-aware data
      fetch('/api/brevo/cart-abandoned', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          cartItems,
          cartValue: finalTotal / 100,
          checkoutUrl: window.location.href,
          abandonmentStage,  // NEW: track which step they abandoned at
          checkoutStep: currentStep,  // NEW: current step number
          intentLevel  // NEW: low/medium/high for recovery strategy
        }),
        keepalive: true // Ensure request completes even as page unloads
      }).catch(err => console.error('Cart abandonment tracking failed:', err))
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [email, finalTotal, cartItems, currentStep])

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

  const paymentStepTracked = useRef(false)

  useEffect(() => {
    // Only initialize Square when we reach step 3
    if (currentStep !== 3) {
      paymentStepTracked.current = false
      return
    }

    // Track GA4 add_payment_info event (user reached payment step)
    if (!paymentStepTracked.current && typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'add_payment_info', {
        currency: 'USD',
        value: finalTotal / 100,
        coupon: couponCode || undefined,
        payment_type: 'Credit Card',
        items: cartItems.map(item => ({
          item_id: item.id,
          item_name: item.name,
          item_category: 'Health Supplements',
          price: item.price / 100,
          quantity: item.quantity
        }))
      });
      paymentStepTracked.current = true
    }

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
  }, [cartItems, couponCode, currentStep, finalTotal, initializeSquare])

  // Step validation
  const validateStep = (step: number): boolean => {
    setError(null)

    if (step === 1) {
      if (!email || !fullName) {
        setError('Please fill in your email and full name')
        return false
      }
      if (!email.includes('@')) {
        setError('Please enter a valid email address')
        return false
      }
    }

    if (step === 2) {
      if (!address || !city || !state || !zipCode) {
        setError('Please fill in all shipping address fields')
        return false
      }
      if (zipCode.length < 5) {
        setError('Please enter a valid ZIP code')
        return false
      }
    }

    return true
  }

  const goToNextStep = async () => {
    if (validateStep(currentStep)) {
      // Track email entered - user is now identifiable
      if (currentStep === 1 && email) {
        // Identify user in Brevo for behavioral tracking
        if (typeof window !== 'undefined' && (window as any).Brevo) {
          (window as any).Brevo.push(['identify', {
            email: email,
            firstname: fullName.split(' ')[0] || '',
            source: 'checkout'
          }]);
        }

        // NEW: Create contact in Brevo database with Step 1 data
        try {
          const nameParts = fullName.trim().split(' ');
          const firstName = nameParts[0] || '';
          const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

          // Detect if this is a win-back flow based on coupon or pre-filled data
          const isWinBackFlow = initialEmail || couponCode === 'STOPMUCUS';
          const source = isWinBackFlow ? 'winback-checkout' : 'checkout';

          await fetch('/api/brevo/checkout-started', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email,
              firstName,
              lastName,
              phone: phone || undefined,
              cartItems,
              cartValue: finalTotal / 100,
              checkoutStep: 'contact_info',
              source: source
            })
          });

          // Track InitiateCheckout event on Facebook Pixel
          fpixel.event('InitiateCheckout', {
            content_name: productName,
            content_ids: cartItems.map(item => item.id),
            content_type: 'product',
            value: finalTotal / 100,
            currency: 'USD',
            num_items: cartItems.reduce((sum, item) => sum + item.quantity, 0)
          });
        } catch (error) {
          console.error('Checkout tracking failed:', error);
          // Don't block checkout flow
        }

        // Track cart state for abandonment recovery
        localStorage.setItem('checkoutEmail', email)
        localStorage.setItem('checkoutCartValue', finalTotal.toString())
      }

      // NEW: Capture shipping data when Step 2 completes
      if (currentStep === 2 && email) {
        // Track GA4 add_shipping_info event
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'add_shipping_info', {
            currency: 'USD',
            value: finalTotal / 100,
            coupon: couponCode || undefined,
            shipping_tier: shippingCost === 0 ? 'Free' : 'Standard',
            items: cartItems.map(item => ({
              item_id: item.id,
              item_name: item.name,
              item_category: 'Health Supplements',
              price: item.price / 100,
              quantity: item.quantity
            }))
          });
        }

        try {
          await fetch('/api/brevo/checkout-shipping', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              email,
              shippingAddress: {
                addressLine1: address,
                locality: city,
                administrativeDistrictLevel1: state,
                postalCode: zipCode
              },
              checkoutStep: 'shipping_info'
            })
          });

          // Track AddPaymentInfo event on Facebook Pixel (shipping info entered = ready for payment)
          fpixel.event('AddPaymentInfo', {
            content_ids: cartItems.map(item => item.id),
            content_type: 'product',
            value: finalTotal / 100,
            currency: 'USD'
          });
        } catch (error) {
          console.error('Shipping tracking failed:', error);
          // Don't block checkout flow
        }
      }

      setCurrentStep(prev => Math.min(prev + 1, 3))
    }
  }

  const goToPreviousStep = () => {
    setError(null)
    setCurrentStep(prev => Math.max(prev - 1, 1))
  }

  async function verifyCoupon() {
    if (!couponCode.trim()) return

    setVerifyingCoupon(true)
    setError(null)

    try {
      const response = await fetch('/api/square/verify-coupon', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, price: subtotal })
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

    setIsLoading(true)
    setError(null)

    try {
      const result = await cardToUse.tokenize()

      if (result.status === 'OK') {
        // Send payment to backend with cart items
        const response = await fetch('/api/square/process-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sourceId: result.token,
            amount: finalTotal,
            cartItems: cartItems.map(item => ({
              name: item.name,
              variationId: item.variationId,
              quantity: item.quantity,
              price: item.price
            })),
            shippingCost,
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
          // Save order data to localStorage for success page tracking
          const orderData = {
            orderId: data.orderId,
            email,
            fullName,
            phone,
            address: {
              addressLine1: address,
              locality: city,
              administrativeDistrictLevel1: state,
              postalCode: zipCode,
              country: 'US'
            },
            cartItems,
            subtotal,
            shippingCost,
            discount,
            finalTotal,
            couponCode
          }
          localStorage.setItem('lastOrder', JSON.stringify(orderData))

          // Clear cart abandonment flag
          localStorage.removeItem('cartAbandoned')

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
    <div ref={formRef} className="max-w-full overflow-hidden">
      {/* Compact Order Summary - Collapsed by Default */}
      <div className="mb-3">
        <button
          onClick={() => setSummaryExpanded(!summaryExpanded)}
          className="w-full bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:bg-gray-50 transition-colors"
        >
          <div className="flex gap-3 items-start">
            {/* Product Image(s) */}
            <div className="flex-shrink-0">
              {cartItems.length === 1 ? (
                <div className="w-14 h-14 bg-gray-50 rounded-lg overflow-hidden">
                  {cartItems[0].image && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={cartItems[0].image}
                      alt={cartItems[0].name}
                      className="w-full h-full object-contain p-1"
                    />
                  )}
                </div>
              ) : (
                <div className="relative w-14 h-14">
                  <div className="absolute top-0 left-0 w-12 h-12 bg-gray-50 rounded-lg overflow-hidden border-2 border-white shadow-sm">
                    {cartItems[0].image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={cartItems[0].image}
                        alt={cartItems[0].name}
                        className="w-full h-full object-contain p-0.5"
                      />
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0 w-12 h-12 bg-gray-50 rounded-lg overflow-hidden border-2 border-white shadow-sm">
                    {cartItems[1]?.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={cartItems[1].image}
                        alt={cartItems[1].name}
                        className="w-full h-full object-contain p-0.5"
                      />
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Order Info */}
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {cartItems.length === 1
                    ? cartItems[0].name
                    : `${cartItems.length} Products`
                  }
                </p>
                <span className="text-xs text-gray-500 whitespace-nowrap">Show details</span>
              </div>

              <div className="space-y-0.5 text-xs text-gray-600">
                <div className="flex justify-between">
                  <span>Subtotal ({totalQuantity} {totalQuantity === 1 ? 'item' : 'items'})</span>
                  <span>${(subtotal / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  {shippingCost === 0 ? (
                    <span className="text-green-600 font-medium">FREE</span>
                  ) : (
                    <span>${(shippingCost / 100).toFixed(2)}</span>
                  )}
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600 font-semibold">
                    <span>Discount ({couponCode.toUpperCase()})</span>
                    <span>-${(discount / 100).toFixed(2)}</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
                <span className="text-sm font-semibold text-gray-900">Total</span>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-gray-900">
                    ${(finalTotal / 100).toFixed(2)}
                  </span>
                  {summaryExpanded ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </button>

        {summaryExpanded && (
          <div className="mt-2 bg-white border border-gray-200 rounded-lg p-4 shadow-sm animate-in slide-in-from-top-2 duration-200">
            {/* Cart Items */}
            <div className="mb-4 pb-4 border-b border-gray-200 space-y-3">
              {cartItems.map((item) => (
                <div key={item.id} className="flex gap-3">
                  {item.image && (
                    <div className="relative w-16 h-16 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-contain p-1"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm">{item.name}</h3>
                    <p className="text-xs text-gray-600 mt-0.5">
                      Qty: {item.quantity} × ${(item.price / 100).toFixed(2)}
                    </p>
                    <p className="text-sm font-medium text-gray-900 mt-1">
                      ${((item.price * item.quantity) / 100).toFixed(2)}
                    </p>
                  </div>
                  {cartItems.length > 1 && (
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-600 hover:text-red-700 text-xs"
                    >
                      Remove
                    </button>
                  )}
                </div>
              ))}
            </div>
            {/* What's Included - Only show for main product */}
            {cartItems.length === 1 && (
              <div className="mb-4 pb-4 border-b border-gray-200">
                <h4 className="text-xs font-semibold text-gray-700 mb-2">What's Included:</h4>
                <ul className="space-y-1.5">
                  {productName === 'ParaCleanse Elite' && (
                    <>
                      <li className="flex items-start gap-2 text-xs text-gray-600">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>Phase 1: ParaWash Biofilm Disruptor</span>
                      </li>
                      <li className="flex items-start gap-2 text-xs text-gray-600">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>Phase 2: Intracellular Body Cleanse</span>
                      </li>
                      <li className="flex items-start gap-2 text-xs text-gray-600">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>14-Day Supply (Full Treatment)</span>
                      </li>
                      <li className="flex items-start gap-2 text-xs text-gray-600">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>Detailed Instructions & Protocol</span>
                      </li>
                    </>
                  )}
                  {productName === 'Maya Formula' && (
                    <>
                      <li className="flex items-start gap-2 text-xs text-gray-600">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>26 Wildcrafted Herbs</span>
                      </li>
                      <li className="flex items-start gap-2 text-xs text-gray-600">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>Iron-Rich Blood Support</span>
                      </li>
                      <li className="flex items-start gap-2 text-xs text-gray-600">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>Brain & Nervous System</span>
                      </li>
                      <li className="flex items-start gap-2 text-xs text-gray-600">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>8 fl oz Liquid Formula</span>
                      </li>
                    </>
                  )}
                  {productName === 'Sea Moss Capsules' && (
                    <>
                      <li className="flex items-start gap-2 text-xs text-gray-600">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>92 Essential Minerals</span>
                      </li>
                      <li className="flex items-start gap-2 text-xs text-gray-600">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>Thyroid Support</span>
                      </li>
                      <li className="flex items-start gap-2 text-xs text-gray-600">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>Immune System Boost</span>
                      </li>
                      <li className="flex items-start gap-2 text-xs text-gray-600">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>40 Capsules</span>
                      </li>
                    </>
                  )}
                  {productName === 'Mucus Cleanser' && (
                    <>
                      <li className="flex items-start gap-2 text-xs text-gray-600">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>Eliminates Excess Mucus</span>
                      </li>
                      <li className="flex items-start gap-2 text-xs text-gray-600">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>Respiratory Support</span>
                      </li>
                      <li className="flex items-start gap-2 text-xs text-gray-600">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>Cellular Detoxification</span>
                      </li>
                      <li className="flex items-start gap-2 text-xs text-gray-600">
                        <span className="text-green-600 mt-0.5">✓</span>
                        <span>30 Capsules</span>
                      </li>
                    </>
                  )}
                </ul>
              </div>
            )}

            {/* Price Breakdown */}
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${(subtotal / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                {shippingCost === 0 ? (
                  <>
                    <span className="text-green-600">Shipping</span>
                    <span className="font-medium text-green-600">FREE</span>
                  </>
                ) : (
                  <>
                    <span className="text-gray-600">Shipping</span>
                    <span className="text-gray-600">${(shippingCost / 100).toFixed(2)}</span>
                  </>
                )}
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-green-600 font-semibold">
                  <span>Discount ({couponCode.toUpperCase()})</span>
                  <span>-${(discount / 100).toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t">
                <span>Total</span>
                <span>${(finalTotal / 100).toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Compact Progress Indicator */}
      <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 mb-3 shadow-sm">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center flex-1">
              <div className="flex flex-col items-center flex-1">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${currentStep > step.number
                    ? 'bg-green-600 text-white'
                    : currentStep === step.number
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-500'
                    }`}
                >
                  {currentStep > step.number ? '✓' : step.number}
                </div>
                <p className={`text-[10px] mt-1 font-medium ${currentStep >= step.number ? 'text-gray-900' : 'text-gray-400'
                  }`}>
                  {step.title}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className={`h-0.5 flex-1 mx-1.5 ${currentStep > step.number ? 'bg-green-600' : 'bg-gray-200'
                  }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Discount Applied Banner - Show when coupon is active */}
      {discount > 0 && (
        <div className="bg-gradient-to-r from-yellow-600 to-yellow-500 border-2 border-yellow-700 rounded-lg p-4 mb-4 shadow-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="font-bold text-white text-base">
                🎉 Discount Applied: {couponCode.toUpperCase()}
              </p>
              <p className="text-green-50 text-sm">
                You're saving ${(discount / 100).toFixed(2)} on your order!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Social Proof Banner - Step 1 Only */}
      {currentStep === 1 && (
        <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-3 mb-3 shadow-sm">
          <div className="flex items-center gap-2 text-xs">
            <div className="flex -space-x-2">
              <div className="w-6 h-6 rounded-full bg-green-600 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold">
                ✓
              </div>
              <div className="w-6 h-6 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold">
                ✓
              </div>
              <div className="w-6 h-6 rounded-full bg-purple-600 border-2 border-white flex items-center justify-center text-white text-[10px] font-bold">
                ✓
              </div>
            </div>
            <div className="flex-1">
              <p className="font-semibold text-gray-900">
                <span className="text-green-600">23 people</span> are viewing this right now
              </p>
              <p className="text-gray-600 text-[10px]">
                Join 1,200+ customers who've transformed their health
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Quantity Selector & Upsell */}
      {currentStep === 1 && (
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-3 shadow-sm">
          {/* Quantity Selector for Main Product */}
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-gray-900">Quantity</span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => updateQuantity(cartItems[0].quantity - 1)}
                disabled={cartItems[0].quantity <= 1}
                className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                -
              </button>
              <span className="text-base font-semibold w-8 text-center">{cartItems[0].quantity}</span>
              <button
                onClick={() => updateQuantity(cartItems[0].quantity + 1)}
                className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
              >
                +
              </button>
            </div>
          </div>

          {/* Free Shipping Incentive */}
          {totalQuantity < 2 && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <p className="text-xs font-semibold text-amber-900 mb-2">
                🚚 Add 1 more item for FREE shipping (Save $5.95!)
              </p>
              <div className="space-y-2">
                {/* Upsell Products */}
                {productId !== 'maya' && (
                  <button
                    onClick={() => addUpsellProduct({
                      id: 'maya',
                      name: 'Maya Formula',
                      price: 5999,  // $59.99 regular
                      variationId: 'TWJMT4CUFNFNQKG3S5EQRPLO',
                      image: '/maya.png'
                    })}
                    className="w-full flex items-center justify-between p-2 bg-white border border-gray-200 rounded-lg hover:border-primary transition-colors text-left"
                  >
                    <div className="flex flex-col items-start">
                      <span className="text-xs font-medium text-gray-900">+ Add Maya Formula</span>
                      <span className="text-[10px] text-gray-500 line-through">$59.99</span>
                    </div>
                    <span className="text-xs font-semibold text-yellow-700">$41.99</span>
                  </button>
                )}
                {productId !== 'seamoss' && (
                  <button
                    onClick={() => addUpsellProduct({
                      id: 'seamoss',
                      name: 'Sea Moss Capsules',
                      price: 3999,  // $39.99 regular
                      variationId: 'YGDG42LYJKWH75NNW6HPWP5M',
                      image: '/seamoss.png'
                    })}
                    className="w-full flex items-center justify-between p-2 bg-white border border-gray-200 rounded-lg hover:border-primary transition-colors text-left"
                  >
                    <div className="flex flex-col items-start">
                      <span className="text-xs font-medium text-gray-900">+ Add Sea Moss</span>
                      <span className="text-[10px] text-gray-500 line-through">$39.99</span>
                    </div>
                    <span className="text-xs font-semibold text-yellow-700">$27.99</span>
                  </button>
                )}
                {productId !== 'mucus-cleanser' && (
                  <button
                    onClick={() => addUpsellProduct({
                      id: 'mucus-cleanser',
                      name: 'Mucus Cleanser',
                      price: 3999,  // $39.99 regular
                      variationId: '6JARPI34BXU27SS36ZFSEJQP',
                      image: '/mucus.png'
                    })}
                    className="w-full flex items-center justify-between p-2 bg-white border border-gray-200 rounded-lg hover:border-primary transition-colors text-left"
                  >
                    <div className="flex flex-col items-start">
                      <span className="text-xs font-medium text-gray-900">+ Add Mucus Cleanser</span>
                      <span className="text-[10px] text-gray-500 line-through">$39.99</span>
                    </div>
                    <span className="text-xs font-semibold text-yellow-700">$27.99</span>
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Free Shipping Achieved */}
          {totalQuantity >= 2 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <p className="text-xs font-semibold text-green-900 flex items-center gap-2">
                <span>✓</span>
                <span>You've unlocked FREE shipping!</span>
              </p>
            </div>
          )}
        </div>
      )}

      {/* Form Container */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-lg">
        {/* Step 1: Contact Information */}
        {currentStep === 1 && (
          <div className="space-y-3.5">
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-0.5">Contact Information</h3>
              <p className="text-xs text-gray-600">We'll send your confirmation here</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address *
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Full Name *
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-base"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Phone Number (Optional)
              </label>
              <input
                type="tel"
                value={phone}
                onChange={handlePhoneChange}
                placeholder="(555) 123-4567"
                maxLength={14}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-base"
              />
            </div>
          </div>
        )}

        {/* Step 2: Shipping Address */}
        {currentStep === 2 && (
          <div className="space-y-3.5">
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-0.5">Shipping Address</h3>
              <p className="text-xs text-gray-600">Where should we send your order?</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Street Address *
              </label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 Main St, Apt 4B"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                autoFocus
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                City *
              </label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="New York"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-base"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  State *
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value.toUpperCase())}
                  placeholder="NY"
                  maxLength={2}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-base uppercase"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  value={zipCode}
                  onChange={(e) => setZipCode(e.target.value)}
                  placeholder="10001"
                  maxLength={10}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Payment */}
        {currentStep === 3 && (
          <div className="space-y-3.5">
            <div>
              <h3 className="text-base font-bold text-gray-900 mb-0.5">Payment Details</h3>
              <p className="text-xs text-gray-600">Complete your secure checkout</p>
            </div>

            {/* Order Review - Compact */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
              <div className="space-y-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal ({totalQuantity} {totalQuantity === 1 ? 'item' : 'items'})</span>
                  <span className="font-medium">${(subtotal / 100).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  {shippingCost === 0 ? (
                    <>
                      <span className="text-green-600">Shipping</span>
                      <span className="font-medium text-green-600">FREE</span>
                    </>
                  ) : (
                    <>
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">${(shippingCost / 100).toFixed(2)}</span>
                    </>
                  )}
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-green-600 font-semibold">
                    <span>Discount ({couponCode.toUpperCase()})</span>
                    <span>-${(discount / 100).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-gray-900 pt-1.5 border-t border-gray-300">
                  <span>Total</span>
                  <span>${(finalTotal / 100).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Black Friday Savings Banner - Step 3 Only */}
            {currentStep === 3 && discount > 0 && (
              <div className="bg-gradient-to-r from-yellow-50 to-white border-2 border-yellow-500 rounded-lg p-4 mb-4">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">🎉</div>
                  <div className="flex-1">
                    <p className="font-bold text-gray-900">Black Friday Savings Applied</p>
                    <p className="text-sm text-gray-600">
                      You're saving <span className="text-yellow-700 font-bold">${(discount / 100).toFixed(2)}</span> with code
                      <span className="font-mono text-yellow-700 font-bold ml-1">BLACKFRIDAY30</span>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Coupon Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Coupon Code (Optional)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter code"
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-base"
                />
                <button
                  onClick={verifyCoupon}
                  disabled={verifyingCoupon || !couponCode.trim()}
                  className={`px-5 py-3 rounded-lg font-semibold transition-all text-sm whitespace-nowrap ${verifyingCoupon || !couponCode.trim()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-primary hover:bg-primary/90 text-white'
                    }`}
                >
                  {verifyingCoupon ? '...' : 'Apply'}
                </button>
              </div>
              {discount > 0 && (
                <p className="mt-2 text-sm text-green-600 font-medium">
                  ✓ Coupon applied successfully!
                </p>
              )}
            </div>

            {/* Card Form */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Card Information *
              </label>
              <div id="card-container" className="border border-gray-300 rounded-lg p-3"></div>

              {/* Payment Method Icons */}
              <div className="flex items-center justify-center gap-2 mt-2">
                <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                  <span>We accept:</span>
                </div>
                <div className="flex items-center gap-1.5">
                  {/* Visa */}
                  <div className="w-8 h-5 bg-white border border-gray-200 rounded flex items-center justify-center">
                    <svg className="w-6 h-4" viewBox="0 0 48 32" fill="none">
                      <rect width="48" height="32" rx="4" fill="white" />
                      <path d="M20.5 11h-3.2l-2 10h3.2l2-10zm8.4 6.5l1.7-4.7 1 4.7h-2.7zm3.6 3.5h3l-2.6-10h-2.7c-.6 0-1.1.4-1.3.9l-4.6 9.1h3.4l.7-1.9h4.1v1.9zm-9.3-7.1c0-2.6-3.6-2.8-3.6-4 0-.4.4-.8 1.2-.9.4 0 1.5-.1 2.8.5l.5-2.3c-.7-.2-1.6-.5-2.7-.5-2.9 0-4.9 1.5-4.9 3.7 0 1.6 1.4 2.5 2.5 3 1.1.6 1.5.9 1.5 1.4 0 .8-.9 1.1-1.8 1.1-1.5 0-2.3-.2-3.5-.8l-.5 2.4c.8.4 2.3.7 3.8.7 3.1 0 5.1-1.5 5.1-3.8z" fill="#1434CB" />
                    </svg>
                  </div>
                  {/* Mastercard */}
                  <div className="w-8 h-5 bg-white border border-gray-200 rounded flex items-center justify-center">
                    <svg className="w-6 h-4" viewBox="0 0 48 32" fill="none">
                      <rect width="48" height="32" rx="4" fill="white" />
                      <circle cx="18" cy="16" r="7" fill="#EB001B" />
                      <circle cx="30" cy="16" r="7" fill="#F79E1B" />
                      <path d="M24 11.5c-1.3 1.2-2 2.9-2 4.5s.7 3.3 2 4.5c1.3-1.2 2-2.9 2-4.5s-.7-3.3-2-4.5z" fill="#FF5F00" />
                    </svg>
                  </div>
                  {/* Amex */}
                  <div className="w-8 h-5 bg-white border border-gray-200 rounded flex items-center justify-center">
                    <svg className="w-6 h-4" viewBox="0 0 48 32" fill="none">
                      <rect width="48" height="32" rx="4" fill="#006FCF" />
                      <path d="M15 13h-2.5l-.6 1.5-.6-1.5H8.8l1.5 3.5-1.5 3.5h2.5l.6-1.5.6 1.5h2.5l-1.5-3.5L15 13zm4.5 0h-3v7h3v-2h2v-1.5h-2v-1h2V14h-2v-1zm7 0h-4v7h4v-1.5h-2v-1h2v-1.5h-2v-1h2V13zm5 0l-1 2.5-1-2.5h-2.5l2 3.5-2 3.5h2.5l1-2.5 1 2.5H34l-2-3.5 2-3.5h-2.5z" fill="white" />
                    </svg>
                  </div>
                  {/* Discover */}
                  <div className="w-8 h-5 bg-white border border-gray-200 rounded flex items-center justify-center">
                    <svg className="w-6 h-4" viewBox="0 0 48 32" fill="none">
                      <rect width="48" height="32" rx="4" fill="#FF6000" />
                      <circle cx="38" cy="16" r="8" fill="#F79E1B" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Social Proof */}
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
              <div className="flex items-center gap-2 text-xs text-blue-900">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                <span className="font-medium">Join 1,200+ happy customers who trust Dr. Sebi's formulas</span>
              </div>
            </div>

            {/* Trust Badges - Minimal */}
            <div className="flex items-center justify-center gap-3 text-[10px] text-gray-500 py-1">
              <span>🔒 256-bit SSL Encrypted</span>
              <span>•</span>
              <span>✓ 30-Day Money Back</span>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-5 flex gap-2.5">
          {currentStep > 1 && (
            <button
              onClick={goToPreviousStep}
              className="flex items-center justify-center gap-1.5 px-5 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-all text-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          )}

          {currentStep < 3 ? (
            <button
              onClick={goToNextStep}
              className="flex-1 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold transition-all text-base shadow-lg"
            >
              Continue to {steps[currentStep].title}
            </button>
          ) : (
            <>
              {/* Guarantee Badge Above Button */}
              <div className="flex-1">
                <div className="bg-green-50 border border-green-200 rounded-lg p-2 mb-2 flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs font-semibold text-green-900">Protected by 30-Day Money Back Guarantee</span>
                </div>
                <button
                  onClick={handlePayment}
                  disabled={isLoading || !cardInitialized}
                  className={`w-full py-3.5 rounded-lg font-bold transition-all text-base shadow-lg ${isLoading || !cardInitialized
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black shadow-yellow-500/25'
                    }`}
                >
                  {isLoading ? 'Processing...' : `Complete Order • $${(finalTotal / 100).toFixed(2)}`}
                </button>
              </div>
            </>
          )}
        </div>

        {currentStep === 3 && (
          <p className="mt-2.5 text-[10px] text-center text-gray-500">
            🔒 Secure payment powered by Square
          </p>
        )}
      </div>
    </div>
  )
}
