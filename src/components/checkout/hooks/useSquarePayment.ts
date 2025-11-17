import { useState, useEffect, useRef, useCallback } from 'react'
import { CartItem, CustomerDetails } from '../types'

declare global {
  interface Window {
    Square?: any
  }
}

export function useSquarePayment(currentStep: number) {
  const [card, setCard] = useState<any>(null)
  const [cardInitialized, setCardInitialized] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [couponCode, setCouponCode] = useState('')
  const [discount, setDiscount] = useState(0)
  const [verifyingCoupon, setVerifyingCoupon] = useState(false)

  // Use refs to prevent double initialization
  const initializingRef = useRef(false)
  const cardInstanceRef = useRef<any>(null)

  const initializeSquare = useCallback(async () => {
    // Prevent multiple simultaneous initializations
    if (initializingRef.current || cardInstanceRef.current || cardInitialized) {
      return
    }

    if (!window.Square) {
      setError('Payment form blocked. Please disable ad blocker and refresh.')
      return
    }

    initializingRef.current = true

    try {
      const container = document.getElementById('card-container')
      if (!container) {
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
    } catch (e: any) {
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

  const verifyCoupon = async (subtotal: number) => {
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

  const processPayment = async (
    cartItems: CartItem[],
    finalTotal: number,
    shippingCost: number,
    customerDetails: CustomerDetails,
    onSuccess?: () => void
  ) => {
    const cardToUse = cardInstanceRef.current || card
    if (!cardToUse) return

    setIsLoading(true)
    setError(null)

    try {
      const result = await cardToUse.tokenize()

      if (result.status === 'OK') {
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
            customerDetails
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

  return {
    cardInitialized,
    isLoading,
    error,
    setError,
    couponCode,
    setCouponCode,
    discount,
    verifyingCoupon,
    verifyCoupon,
    processPayment
  }
}
