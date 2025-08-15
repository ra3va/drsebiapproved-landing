/**
 * Test Brevo Email Sending
 * Debug transactional email functionality
 */

import brevoClient from '../../../src/lib/brevo-client.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, firstName = 'Friend' } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  console.log('🧪 Testing Brevo email sending...');
  console.log('📧 Email:', email);
  console.log('👤 Name:', firstName);

  try {
    // Step 1: Test API connection
    console.log('🔍 Testing API connection...');
    const connection = await brevoClient.testConnection();
    console.log('📡 Connection result:', connection);

    if (!connection.success) {
      return res.status(500).json({
        error: 'API connection failed',
        details: connection.message
      });
    }

    // Step 2: Get account info
    console.log('📊 Getting account info...');
    const account = await brevoClient.getAccount();
    console.log('👤 Account:', {
      email: account.email,
      firstName: account.firstName,
      lastName: account.lastName,
      plan: account.plan?.[0]?.type || 'Unknown'
    });

    // Step 3: Test simple transactional email
    console.log('📤 Sending test transactional email...');
    
    const emailPayload = {
      sender: {
        name: "Dr. Sebi Approved Team",
        email: "info@drsebiapproved.com"
      },
      to: [{ 
        email: email,
        name: firstName
      }],
      subject: `Test Email from Brevo API - ${new Date().toLocaleTimeString()}`,
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <h2 style="color: #22c55e;">🧪 Test Email Success!</h2>
          
          <p>Hi ${firstName},</p>
          
          <p>This is a test email from the Brevo API to verify the email sending functionality is working correctly.</p>
          
          <div style="background: #f0fdf4; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #15803d; margin-top: 0;">✅ API Connection Verified</h3>
            <p style="margin: 0;">Your Brevo integration is working properly!</p>
          </div>
          
          <p>Timestamp: ${new Date().toISOString()}</p>
          
          <p>Best regards,<br><strong>Dr. Sebi Approved Team</strong></p>
        </div>
      `,
      tags: ["test-email", "api-verification"]
    };

    console.log('📋 Email payload:', {
      sender: emailPayload.sender,
      to: emailPayload.to,
      subject: emailPayload.subject,
      hasHtmlContent: !!emailPayload.htmlContent
    });

    const result = await brevoClient.sendTransactionalEmail(emailPayload);
    
    console.log('✅ Email sent successfully:', result);

    return res.status(200).json({
      success: true,
      message: 'Test email sent successfully',
      data: {
        messageId: result.messageId,
        sender: emailPayload.sender,
        recipient: email,
        subject: emailPayload.subject,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Email sending failed:', error);

    // Detailed error logging
    console.error('Error details:', {
      message: error.message,
      status: error.status,
      response: error.response
    });

    return res.status(500).json({
      success: false,
      error: 'Failed to send test email',
      message: error.message,
      details: {
        status: error.status,
        brevoResponse: error.response
      }
    });
  }
}