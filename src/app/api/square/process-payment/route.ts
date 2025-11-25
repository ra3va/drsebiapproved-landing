import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { sourceId, amount, cartItems, shippingCost, customerDetails, couponCode } = await request.json()

    const locationId = process.env.NEXT_PUBLIC_SQUARE_LOCATION_ID || 'LW8ZH194BZGKH'
    const SQUARE_VERSION = '2025-10-16'
    const SQUARE_ACCESS_TOKEN = process.env.SQUARE_ACCESS_TOKEN

    // Step 1: Create/Update Customer in Square Customer Directory
    console.log('👤 Creating customer in Square...')
    let customerId: string | undefined

    if (customerDetails?.email) {
      try {
        // Split name into first/last
        const nameParts = (customerDetails.name || '').trim().split(' ')
        const givenName = nameParts[0] || ''
        const familyName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : ''

        // First, search for existing customer by email
        const searchResponse = await fetch('https://connect.squareup.com/v2/customers/search', {
          method: 'POST',
          headers: {
            'Square-Version': SQUARE_VERSION,
            'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            query: {
              filter: {
                email_address: {
                  exact: customerDetails.email
                }
              }
            }
          })
        })

        const searchData = await searchResponse.json()

        if (searchData.customers && searchData.customers.length > 0) {
          // Customer exists, use their ID and update info
          customerId = searchData.customers[0].id
          console.log('✅ Found existing customer:', customerId)

          // Update customer with latest info
          await fetch(`https://connect.squareup.com/v2/customers/${customerId}`, {
            method: 'PUT',
            headers: {
              'Square-Version': SQUARE_VERSION,
              'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              given_name: givenName,
              family_name: familyName,
              email_address: customerDetails.email,
              phone_number: customerDetails.phone || undefined,
              address: customerDetails.address ? {
                address_line_1: customerDetails.address.addressLine1,
                locality: customerDetails.address.locality,
                administrative_district_level_1: customerDetails.address.administrativeDistrictLevel1,
                postal_code: customerDetails.address.postalCode,
                country: customerDetails.address.country || 'US'
              } : undefined
            })
          })
        } else {
          // Create new customer
          const customerResponse = await fetch('https://connect.squareup.com/v2/customers', {
            method: 'POST',
            headers: {
              'Square-Version': SQUARE_VERSION,
              'Authorization': `Bearer ${SQUARE_ACCESS_TOKEN}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              idempotency_key: `customer-${Date.now()}-${Math.random()}`,
              given_name: givenName,
              family_name: familyName,
              email_address: customerDetails.email,
              phone_number: customerDetails.phone || undefined,
              address: customerDetails.address ? {
                address_line_1: customerDetails.address.addressLine1,
                locality: customerDetails.address.locality,
                administrative_district_level_1: customerDetails.address.administrativeDistrictLevel1,
                postal_code: customerDetails.address.postalCode,
                country: customerDetails.address.country || 'US'
              } : undefined,
              note: 'Customer from drsebiapproved.com'
            })
          })

          const customerData = await customerResponse.json()

          if (customerData.errors) {
            console.warn('⚠️ Customer creation warning:', customerData.errors)
            // Continue without customer_id - don't fail the order
          } else {
            customerId = customerData.customer.id
            console.log('✅ Customer created:', customerId)
          }
        }
      } catch (err) {
        console.warn('⚠️ Customer creation/search failed:', err)
        // Continue without customer_id - don't fail the order
      }
    }

    // Step 2: Create Square Order with line items
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

    // Link customer to order
    if (customerId) {
      orderRequest.order.customer_id = customerId
      console.log('🔗 Linking order to customer:', customerId)
    }

    // Add coupon code to order metadata if present
    if (couponCode) {
      orderRequest.order.metadata = {
        coupon_code: couponCode
      }
      
      // Calculate and apply discount to match the payment amount
      const subtotal = cartItems.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0) + shippingCost
      const discountAmount = subtotal - amount
      
      if (discountAmount > 0) {
        orderRequest.order.discounts = [
          {
            name: `Discount (${couponCode})`,
            type: 'FIXED_AMOUNT',
            amount_money: {
              amount: discountAmount,
              currency: 'USD'
            },
            scope: 'ORDER'
          }
        ]
        console.log(`💸 Applied discount: $${(discountAmount / 100).toFixed(2)} (code: ${couponCode})`)
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

    // --- CAMPAIGN STOP SWITCH ---
    // If the customer is in our re-engagement campaign, mark them as converted
    if (customerDetails?.email) {
      try {
        const { supabase, isSupabaseConfigured } = await import('@/lib/supabase');

        if (isSupabaseConfigured()) {
          console.log(`🛑 Checking campaign status for ${customerDetails.email}...`);

          const { error: campaignError } = await supabase
            .from('reengagement_campaign')
            .update({
              status: 'converted',
              converted_at: new Date().toISOString()
            })
            .eq('customer_email', customerDetails.email);

          if (!campaignError) {
            console.log(`✅ Campaign stopped for ${customerDetails.email} (Converted)`);
          }
        }
      } catch (err) {
        console.warn('⚠️ Failed to update campaign status:', err);
      }
    }
    // ---------------------------

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
