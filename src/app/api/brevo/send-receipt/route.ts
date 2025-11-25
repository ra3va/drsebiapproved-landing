import { NextRequest, NextResponse } from 'next/server';
import brevoClient from '@/lib/brevo-client';

export async function POST(req: NextRequest) {
  try {
    const {
      email,
      customerName,
      orderId,
      cartItems,
      subtotal,
      shippingCost,
      discount,
      couponCode,
      total,
      shippingAddress
    } = await req.json();

    if (!email || !orderId) {
      return NextResponse.json({ error: 'Email and orderId required' }, { status: 400 });
    }

    // Build line items HTML
    const itemsHtml = cartItems.map((item: any) => `
      <tr>
        <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5;">
          <strong>${item.name}</strong>
          ${item.quantity > 1 ? `<span style="color: #666;"> × ${item.quantity}</span>` : ''}
        </td>
        <td style="padding: 12px 0; border-bottom: 1px solid #e5e5e5; text-align: right;">
          $${((item.price * item.quantity) / 100).toFixed(2)}
        </td>
      </tr>
    `).join('');

    // Build address HTML
    const addressHtml = shippingAddress ? `
      <p style="margin: 0; color: #333;">
        ${customerName}<br/>
        ${shippingAddress.addressLine1}<br/>
        ${shippingAddress.locality}, ${shippingAddress.administrativeDistrictLevel1} ${shippingAddress.postalCode}
      </p>
    ` : '';

    // Determine if bundle
    const isBundle = cartItems.length > 1;
    const bundleMessage = isBundle 
      ? `<p style="color: #22c55e; font-weight: bold;">🎉 Bundle Purchase - Thank you for your trust in our products!</p>`
      : '';

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f5f5f5; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
    
    <!-- Header -->
    <div style="background: linear-gradient(135deg, #22c55e 0%, #16a34a 100%); padding: 30px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 24px;">Order Confirmed! ✓</h1>
      <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0;">Thank you for your order, ${customerName?.split(' ')[0] || 'valued customer'}!</p>
    </div>

    <!-- Order Details -->
    <div style="padding: 30px;">
      ${bundleMessage}
      
      <div style="background: #f9fafb; padding: 15px; border-radius: 6px; margin-bottom: 25px;">
        <p style="margin: 0; color: #666; font-size: 14px;">
          <strong>Order ID:</strong> ${orderId}<br/>
          <strong>Date:</strong> ${new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </p>
      </div>

      <h2 style="color: #333; font-size: 18px; margin: 0 0 15px;">Order Summary</h2>
      
      <table style="width: 100%; border-collapse: collapse;">
        ${itemsHtml}
        
        <!-- Subtotal -->
        <tr>
          <td style="padding: 12px 0; color: #666;">Subtotal</td>
          <td style="padding: 12px 0; text-align: right;">$${(subtotal / 100).toFixed(2)}</td>
        </tr>
        
        <!-- Shipping -->
        <tr>
          <td style="padding: 12px 0; color: #666;">Shipping</td>
          <td style="padding: 12px 0; text-align: right; color: ${shippingCost === 0 ? '#22c55e' : '#333'};">
            ${shippingCost === 0 ? 'FREE' : '$' + (shippingCost / 100).toFixed(2)}
          </td>
        </tr>
        
        ${discount > 0 ? `
        <!-- Discount -->
        <tr>
          <td style="padding: 12px 0; color: #22c55e;">
            Discount${couponCode ? ` (${couponCode})` : ''}
          </td>
          <td style="padding: 12px 0; text-align: right; color: #22c55e;">
            -$${(discount / 100).toFixed(2)}
          </td>
        </tr>
        ` : ''}
        
        <!-- Total -->
        <tr>
          <td style="padding: 15px 0; border-top: 2px solid #333; font-size: 18px; font-weight: bold;">Total</td>
          <td style="padding: 15px 0; border-top: 2px solid #333; text-align: right; font-size: 18px; font-weight: bold; color: #22c55e;">
            $${(total / 100).toFixed(2)}
          </td>
        </tr>
      </table>

      ${shippingAddress ? `
      <!-- Shipping Address -->
      <div style="margin-top: 30px; padding-top: 25px; border-top: 1px solid #e5e5e5;">
        <h3 style="color: #333; font-size: 16px; margin: 0 0 10px;">Shipping To</h3>
        ${addressHtml}
      </div>
      ` : ''}

      <!-- What's Next -->
      <div style="margin-top: 30px; padding: 20px; background: #fefce8; border-radius: 6px; border-left: 4px solid #eab308;">
        <h3 style="color: #333; font-size: 16px; margin: 0 0 10px;">📦 What's Next?</h3>
        <p style="margin: 0; color: #666; font-size: 14px; line-height: 1.6;">
          We're preparing your order with care. You'll receive a shipping confirmation email with tracking information once your order ships (typically within 1-2 business days).
        </p>
      </div>
    </div>

    <!-- Footer -->
    <div style="background: #f9fafb; padding: 25px; text-align: center; border-top: 1px solid #e5e5e5;">
      <p style="margin: 0 0 10px; color: #666; font-size: 14px;">
        Questions? Reply to this email or contact us at<br/>
        <a href="mailto:info@drsebiapproved.com" style="color: #22c55e;">info@drsebiapproved.com</a>
      </p>
      <p style="margin: 15px 0 0; color: #999; font-size: 12px;">
        © ${new Date().getFullYear()} Dr. Sebi Approved | drsebiapproved.com
      </p>
    </div>
  </div>
</body>
</html>
    `;

    // Send via Brevo transactional
    await brevoClient.sendTransactionalEmail({
      sender: { name: 'Dr. Sebi Approved', email: 'info@drsebiapproved.com' },
      to: [{ email, name: customerName || '' }],
      subject: `Order Confirmed - #${orderId.slice(-8).toUpperCase()}`,
      htmlContent: emailHtml
    });

    console.log(`📧 Receipt sent to ${email} for order ${orderId}`);

    return NextResponse.json({ success: true });

  } catch (error: any) {
    console.error('Receipt email error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
