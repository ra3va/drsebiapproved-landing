'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, Package, Mail, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function CheckoutSuccessPage() {
  const [purchaseTracked, setPurchaseTracked] = useState(false)

  useEffect(() => {
    // Only track once
    if (purchaseTracked) return

    // Get order data from localStorage (set by SquareCheckout component)
    const orderDataStr = localStorage.getItem('lastOrder')
    if (!orderDataStr) {
      console.warn('No order data found in localStorage')
      return
    }

    try {
      const orderData = JSON.parse(orderDataStr)

      // Track conversion with GTM
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'purchase', {
          transaction_id: orderData.orderId || Date.now().toString(),
          value: orderData.finalTotal / 100,
          currency: 'USD',
          items: orderData.cartItems.map((item: any) => ({
            item_name: item.name,
            category: 'Health Supplements',
            price: item.price / 100,
            quantity: item.quantity || 1
          }))
        })
      }

      // Track with Brevo behavioral tracking
      if (typeof window !== 'undefined' && (window as any).Brevo) {
        (window as any).Brevo.push(['track', 'order_completed', {
          order_id: orderData.orderId,
          revenue: orderData.finalTotal / 100,
          products: orderData.cartItems.map((item: any) => item.name).join(', '),
          product_count: orderData.cartItems.length
        }]);
      }

      // Send to Brevo API for customer list management
      fetch('/api/brevo/purchase-complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: orderData.email,
          firstName: orderData.fullName?.split(' ')[0] || '',
          lastName: orderData.fullName?.split(' ').slice(1).join(' ') || '',
          productsPurchased: orderData.cartItems.map((item: any) => ({
            name: item.name,
            quantity: item.quantity || 1,
            price: item.price / 100
          })),
          orderValue: orderData.finalTotal / 100,
          orderId: orderData.orderId,
          shippingAddress: orderData.address
        })
      })
      .then(res => res.json())
      .then(data => {
        console.log('Purchase tracked in Brevo:', data)
        setPurchaseTracked(true)
        // Clear order data after tracking
        localStorage.removeItem('lastOrder')
      })
      .catch(error => {
        console.error('Brevo purchase tracking error:', error)
        // Still mark as tracked to prevent retries
        setPurchaseTracked(true)
      })

    } catch (error) {
      console.error('Error parsing order data:', error)
    }
  }, [purchaseTracked])

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center px-4">
      <div className="max-w-2xl w-full">
        {/* Success Icon */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Order Confirmed!
          </h1>
          <p className="text-xl text-gray-600">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">What Happens Next?</h2>
          
          <div className="space-y-6">
            {/* Step 1 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Mail className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">1. Check Your Email</h3>
                <p className="text-gray-600 text-sm">
                  You'll receive an order confirmation email within the next few minutes with your order details and receipt.
                </p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                  <Package className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">2. We Prepare Your Order</h3>
                <p className="text-gray-600 text-sm">
                  Your order will be carefully prepared and packaged. Most orders ship within 1-2 business days.
                </p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="flex gap-4">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">3. Track Your Shipment</h3>
                <p className="text-gray-600 text-sm">
                  Once shipped, you'll receive a tracking number via email so you can follow your package every step of the way.
                </p>
              </div>
            </div>
          </div>

          {/* Shipping Info */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-900">
              <strong>Estimated Delivery:</strong> 3-5 business days for US orders. Free shipping included!
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              Continue Shopping
            </Button>
          </Link>
          <Link href="/blog">
            <Button size="lg" className="w-full sm:w-auto">
              <span>Read Our Health Blog</span>
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>

        {/* Support */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-600">
            Questions about your order?{' '}
            <a href="mailto:support@drsebiapproved.com" className="text-primary hover:underline font-medium">
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
