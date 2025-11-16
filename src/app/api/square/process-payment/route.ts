import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { sourceId, amount, productName, variationId, customerDetails, couponCode } = await request.json()

    const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID || 'LW8ZH194BZGKH'

    // Prepare payment request with all customer details
    const paymentRequest: any = {
      source_id: sourceId,
      idempotency_key: `${Date.now()}-${Math.random()}`,
      amount_money: {
        amount: amount,
        currency: 'USD'
      },
      location_id: locationId,
      note: `${productName} - Order for ${customerDetails?.name || 'Customer'}`
    }

    // Add customer email (required for receipts)
    if (customerDetails?.email) {
      paymentRequest.buyer_email_address = customerDetails.email
      // Square will automatically send receipt to this email
    }

    // Add shipping address to Square payment
    if (customerDetails?.address) {
      const nameParts = (customerDetails.name || '').split(' ')
      paymentRequest.shipping_address = {
        address_line_1: customerDetails.address.addressLine1,
        locality: customerDetails.address.locality,
        administrative_district_level_1: customerDetails.address.administrativeDistrictLevel1,
        postal_code: customerDetails.address.postalCode,
        country: customerDetails.address.country || 'US',
        first_name: nameParts[0] || '',
        last_name: nameParts.slice(1).join(' ') || ''
      }
    }

    // Add phone to note for fulfillment
    if (customerDetails?.phone) {
      paymentRequest.note += ` | Phone: ${customerDetails.phone}`
    }

    // Add coupon code to note if used
    if (couponCode) {
      paymentRequest.note += ` | Coupon: ${couponCode}`
    }

    // Create payment with Square
    const response = await fetch('https://connect.squareup.com/v2/payments', {
      method: 'POST',
      headers: {
        'Square-Version': '2025-10-16',
        'Authorization': `Bearer ${process.env.SQUARE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentRequest)
    })

    const data = await response.json()

    if (data.payment) {
      // Log successful payment with full details
      console.log('✅ Payment successful:', {
        paymentId: data.payment.id,
        amount: `$${(amount / 100).toFixed(2)}`,
        product: productName,
        customer: customerDetails?.email || 'Guest',
        shippingAddress: customerDetails?.address ? 
          `${customerDetails.address.addressLine1}, ${customerDetails.address.locality}, ${customerDetails.address.administrativeDistrictLevel1} ${customerDetails.address.postalCode}` : 
          'No address provided'
      })

      // Log full order details for fulfillment
      console.log('📦 Order Fulfillment Details:', {
        orderId: data.payment.id,
        name: customerDetails?.name,
        email: customerDetails?.email,
        phone: customerDetails?.phone,
        shippingAddress: customerDetails?.address,
        productName,
        variationId,
        amount: `$${(amount / 100).toFixed(2)}`,
        couponCode: couponCode || 'None'
      })

      return NextResponse.json({
        success: true,
        paymentId: data.payment.id,
        message: 'Payment processed successfully'
      })
    } else {
      console.error('❌ Payment failed:', data.errors)
      return NextResponse.json({
        success: false,
        error: data.errors?.[0]?.detail || 'Payment failed'
      }, { status: 400 })
    }
  } catch (error: any) {
    console.error('❌ Payment processing error:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Payment processing failed'
    }, { status: 500 })
  }
}
