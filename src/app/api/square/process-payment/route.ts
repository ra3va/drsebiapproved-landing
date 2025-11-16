import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { sourceId, amount, cartItems, shippingCost, customerDetails, couponCode } = await request.json()

    const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID || 'LW8ZH194BZGKH'
    const SQUARE_VERSION = '2025-10-16'
    const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN

    // Step 1: Create Square Order with line items
    console.log('📝 Creating Square Order with line items...')
    
    const lineItems = cartItems.map((item: any) => ({
      name: item.name,
      quantity: item.quantity.toString(),
      catalog_object_id: item.variationId,
      base_price_money: {
        amount: item.price,
        currency: 'USD'
      }
    }))

    // Add shipping as a line item if applicable
    if (shippingCost > 0) {
      lineItems.push({
        name: 'Shipping',
        quantity: '1',
        base_price_money: {
          amount: shippingCost,
          currency: 'USD'
        }
      })
    }

    const orderRequest: any = {
      idempotency_key: `order-${Date.now()}-${Math.random()}`,
      order: {
        location_id: locationId,
        line_items: lineItems,
        state: 'OPEN'
      }
    }

    // Add customer info to order
    if (customerDetails?.email || customerDetails?.name) {
      orderRequest.order.customer_id = undefined // We'll create customer inline
      orderRequest.order.metadata = {
        customer_name: customerDetails?.name || '',
        customer_email: customerDetails?.email || '',
        customer_phone: customerDetails?.phone || ''
      }
    }

    // Add fulfillment details (shipping)
    if (customerDetails?.address) {
      const nameParts = (customerDetails.name || '').split(' ')
      orderRequest.order.fulfillments = [
        {
          type: 'SHIPMENT',
          state: 'PROPOSED',
          shipment_details: {
            recipient: {
              display_name: customerDetails.name || '',
              email_address: customerDetails.email || '',
              phone_number: customerDetails.phone || '',
              address: {
                address_line_1: customerDetails.address.addressLine1,
                locality: customerDetails.address.locality,
                administrative_district_level_1: customerDetails.address.administrativeDistrictLevel1,
                postal_code: customerDetails.address.postalCode,
                country: customerDetails.address.country || 'US',
                first_name: nameParts[0] || '',
                last_name: nameParts.slice(1).join(' ') || ''
              }
            }
          }
        }
      ]
    }

    // Add coupon code to order metadata
    if (couponCode) {
      if (!orderRequest.order.metadata) {
        orderRequest.order.metadata = {}
      }
      orderRequest.order.metadata.coupon_code = couponCode
    }

    // Create the order
    const orderResponse = await fetch('https://connect.squareup.com/v2/orders', {
      method: 'POST',
      headers: {
        'Square-Version': SQUARE_VERSION,
        'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(orderRequest)
    })

    const orderData = await orderResponse.json()

    if (orderData.errors) {
      console.error('❌ Order creation failed:', orderData.errors)
      return NextResponse.json({
        success: false,
        error: orderData.errors?.[0]?.detail || 'Order creation failed'
      }, { status: 400 })
    }

    const orderId = orderData.order.id
    console.log('✅ Order created:', orderId)

    // Step 2: Create payment and link it to the order
    console.log('💳 Processing payment...')

    const paymentRequest: any = {
      source_id: sourceId,
      idempotency_key: `payment-${Date.now()}-${Math.random()}`,
      amount_money: {
        amount: amount,
        currency: 'USD'
      },
      order_id: orderId, // Link payment to order
      location_id: locationId
    }

    // Add customer email for receipt
    if (customerDetails?.email) {
      paymentRequest.buyer_email_address = customerDetails.email
    }

    // Add shipping address to payment
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

    // Create payment
    const paymentResponse = await fetch('https://connect.squareup.com/v2/payments', {
      method: 'POST',
      headers: {
        'Square-Version': SQUARE_VERSION,
        'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentRequest)
    })

    const paymentData = await paymentResponse.json()

    if (paymentData.errors) {
      console.error('❌ Payment failed:', paymentData.errors)
      return NextResponse.json({
        success: false,
        error: paymentData.errors?.[0]?.detail || 'Payment failed'
      }, { status: 400 })
    }

    console.log('✅ Payment successful:', paymentData.payment.id)

    // Step 3: Update order state to COMPLETED
    const updateOrderResponse = await fetch(`https://connect.squareup.com/v2/orders/${orderId}/pay`, {
      method: 'POST',
      headers: {
        'Square-Version': SQUARE_VERSION,
        'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        idempotency_key: `pay-${Date.now()}-${Math.random()}`,
        payment_ids: [paymentData.payment.id]
      })
    })

    const updatedOrderData = await updateOrderResponse.json()

    if (updatedOrderData.errors) {
      console.warn('⚠️ Order update warning:', updatedOrderData.errors)
      // Don't fail the request, payment was successful
    } else {
      console.log('✅ Order marked as paid')
    }

    // Log comprehensive order details
    console.log('📦 Order Fulfillment Details:', {
      orderId: orderId,
      paymentId: paymentData.payment.id,
      customer: {
        name: customerDetails?.name,
        email: customerDetails?.email,
        phone: customerDetails?.phone
      },
      shippingAddress: customerDetails?.address,
      items: cartItems.map((item: any) => ({
        name: item.name,
        variationId: item.variationId,
        quantity: item.quantity,
        price: `$${(item.price / 100).toFixed(2)}`,
        total: `$${((item.price * item.quantity) / 100).toFixed(2)}`
      })),
      shipping: shippingCost > 0 ? `$${(shippingCost / 100).toFixed(2)}` : 'FREE',
      couponCode: couponCode || 'None',
      totalAmount: `$${(amount / 100).toFixed(2)}`
    })

    return NextResponse.json({
      success: true,
      orderId: orderId,
      paymentId: paymentData.payment.id,
      message: 'Order created and payment processed successfully'
    })

  } catch (error: any) {
    console.error('❌ Payment processing error:', error)
    return NextResponse.json({
      success: false,
      error: error.message || 'Payment processing failed'
    }, { status: 500 })
  }
}
