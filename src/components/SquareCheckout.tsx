'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react'

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
  onSuccess
}: SquareCheckoutProps) {
  // Cart state - support multiple items
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: productId,
      name: productName,
      price: price,
      variationId: variationId,
      quantity: 1,
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
    // Only initialize Square when we reach step 3
    if (currentStep !== 3) return

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
  }, [currentStep, initializeSquare])

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

  const goToNextStep = () => {
    if (validateStep(currentStep)) {
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
                      <img
                        src={cartItems[0].image}
                        alt={cartItems[0].name}
                        className="w-full h-full object-contain p-0.5"
                      />
                    )}
                  </div>
                  <div className="absolute bottom-0 right-0 w-12 h-12 bg-gray-50 rounded-lg overflow-hidden border-2 border-white shadow-sm">
                    {cartItems[1]?.image && (
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
                <div className="flex justify-between text-green-600">
                  <span>Discount</span>
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
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                    currentStep > step.number
                      ? 'bg-green-600 text-white'
                      : currentStep === step.number
                      ? 'bg-primary text-white'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {currentStep > step.number ? '✓' : step.number}
                </div>
                <p className={`text-[10px] mt-1 font-medium ${
                  currentStep >= step.number ? 'text-gray-900' : 'text-gray-400'
                }`}>
                  {step.title}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className={`h-0.5 flex-1 mx-1.5 ${
                  currentStep > step.number ? 'bg-green-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

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
                      price: 4499,
                      variationId: 'TWJMT4CUFNFNQKG3S5EQRPLO',
                      image: '/maya.png'
                    })}
                    className="w-full flex items-center justify-between p-2 bg-white border border-gray-200 rounded-lg hover:border-primary transition-colors text-left"
                  >
                    <span className="text-xs font-medium text-gray-900">+ Add Maya Formula</span>
                    <span className="text-xs font-semibold text-primary">$44.99</span>
                  </button>
                )}
                {productId !== 'seamoss' && (
                  <button
                    onClick={() => addUpsellProduct({
                      id: 'seamoss',
                      name: 'Sea Moss Capsules',
                      price: 3199,
                      variationId: 'YGDG42LYJKWH75NNW6HPWP5M',
                      image: '/seamoss.png'
                    })}
                    className="w-full flex items-center justify-between p-2 bg-white border border-gray-200 rounded-lg hover:border-primary transition-colors text-left"
                  >
                    <span className="text-xs font-medium text-gray-900">+ Add Sea Moss</span>
                    <span className="text-xs font-semibold text-primary">$31.99</span>
                  </button>
                )}
                {productId !== 'mucus-cleanser' && (
                  <button
                    onClick={() => addUpsellProduct({
                      id: 'mucus-cleanser',
                      name: 'Mucus Cleanser',
                      price: 3199,
                      variationId: '6JARPI34BXU27SS36ZFSEJQP',
                      image: '/mucus.png'
                    })}
                    className="w-full flex items-center justify-between p-2 bg-white border border-gray-200 rounded-lg hover:border-primary transition-colors text-left"
                  >
                    <span className="text-xs font-medium text-gray-900">+ Add Mucus Cleanser</span>
                    <span className="text-xs font-semibold text-primary">$31.99</span>
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
                onChange={(e) => setPhone(e.target.value)}
                placeholder="(555) 123-4567"
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
                  <div className="flex justify-between text-green-600">
                    <span>Discount</span>
                    <span className="font-medium">-${(discount / 100).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between text-base font-bold text-gray-900 pt-1.5 border-t border-gray-300">
                  <span>Total</span>
                  <span>${(finalTotal / 100).toFixed(2)}</span>
                </div>
              </div>
            </div>

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
                  className={`px-5 py-3 rounded-lg font-semibold transition-all text-sm whitespace-nowrap ${
                    verifyingCoupon || !couponCode.trim()
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
            </div>

            {/* Trust Badges - Minimal */}
            <div className="flex items-center justify-center gap-3 text-[10px] text-gray-500 py-1">
              <span>🔒 Secure</span>
              <span>•</span>
              <span>✓ 30-Day Guarantee</span>
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
            <button
              onClick={handlePayment}
              disabled={isLoading || !cardInitialized}
              className={`flex-1 py-3.5 rounded-lg font-semibold transition-all text-base shadow-lg ${
                isLoading || !cardInitialized
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {isLoading ? 'Processing...' : `Complete Order • $${(finalTotal / 100).toFixed(2)}`}
            </button>
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
