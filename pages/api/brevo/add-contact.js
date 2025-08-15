/**
 * Brevo Contact Addition API Endpoint
 * Handles lead magnet email capture and automation triggers
 */

import brevoClient from '../../../src/lib/brevo-client.js';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Method not allowed',
      message: 'This endpoint only accepts POST requests' 
    });
  }

  const { email, firstName = '', source = 'website', listName = 'Gut Health Guide Downloads' } = req.body;

  // Validate required fields
  if (!email) {
    return res.status(400).json({ 
      error: 'Missing required field',
      message: 'Email address is required' 
    });
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      error: 'Invalid email format',
      message: 'Please provide a valid email address' 
    });
  }

  try {
    // Step 1: Find or create the list
    console.log(`Finding or creating list: ${listName}`);
    const list = await brevoClient.findOrCreateList(listName);
    console.log(`List ready: ${list.name} (ID: ${list.id})`);

    // Step 2: Add contact to list with attributes
    console.log(`Adding contact: ${email}`);
    const contact = await brevoClient.addContact({
      email,
      attributes: {
        FIRSTNAME: firstName,
        SOURCE: source,
        SIGNUP_DATE: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
        LEAD_MAGNET: 'gut-health-guide'
      },
      listIds: [list.id],
      updateEnabled: true // Update if contact already exists
    });

    console.log(`Contact added successfully: ${contact.id || 'updated existing'}`);

    // Step 3: Send welcome email with PDF download
    try {
      console.log('Sending welcome email with gut health guide...');
      
      // For now, send a simple transactional email
      // TODO: Create proper template in Brevo dashboard and use templateId
      const emailResult = await brevoClient.sendTransactionalEmail({
        sender: {
          name: "Dr. Sebi Approved Team",
          email: "info@drsebiapproved.com"
        },
        to: [{ 
          email,
          name: firstName || 'Friend'
        }],
        subject: `${firstName ? `${firstName}, y` : 'Y'}our Free Gut Health Guide is Here! 🌿`,
        htmlContent: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <img src="https://drsebiapproved.com/logo.png" alt="Dr. Sebi Approved" style="max-width: 200px;">
            </div>
            
            <h2 style="color: #22c55e; text-align: center;">Welcome to Your Gut Health Journey! 🌿</h2>
            
            <p>Hi ${firstName || 'Friend'},</p>
            
            <p>Thank you for downloading our comprehensive gut health guide! You've taken the first step toward reclaiming your digestive wellness using Dr. Sebi's time-tested natural methods.</p>
            
            <div style="background: #f0fdf4; padding: 20px; border-radius: 10px; margin: 20px 0; text-align: center;">
              <h3 style="color: #15803d; margin-top: 0;">🎯 Your Free Gut Health Guide</h3>
              <p style="margin: 15px 0;">Discover the natural path to remove parasites and restore your digestive health with this comprehensive guide based on Dr. Sebi's proven methods.</p>
              
              <div style="margin: 20px 0;">
                <a href="${process.env.NODE_ENV === 'production' ? 'https://drsebiapproved.com' : 'http://localhost:3000'}/download/gut-health-guide" 
                   style="display: inline-block; background: #22c55e; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; margin-bottom: 15px;">
                  📥 Access Your Download Page
                </a>
                <br>
                <a href="${process.env.NODE_ENV === 'production' ? 'https://drsebiapproved.com' : 'http://localhost:3000'}/guthealthguide.pdf" 
                   style="color: #22c55e; text-decoration: none; font-size: 14px;">
                  Or download PDF directly
                </a>
              </div>
            </div>
            
            <p><strong>What's inside your guide:</strong></p>
            <ul style="color: #374151;">
              <li>🔍 Signs you may have parasites (many people don't realize)</li>
              <li>🌱 Dr. Sebi's natural parasite removal protocols</li>
              <li>🍃 Foods that create an inhospitable environment for parasites</li>
              <li>💪 How to rebuild your gut health naturally</li>
              <li>📅 Step-by-step 30-day cleanse protocol</li>
            </ul>
            
            <div style="background: #eff6ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0;"><strong>💡 Pro Tip:</strong> Start implementing the dietary changes from Chapter 2 immediately while you prepare for your cleanse. Small changes now create big results later!</p>
            </div>
            
            <p>Over the next few days, I'll be sending you additional insights about gut health and natural wellness. Keep an eye on your inbox!</p>
            
            <p>To your health,<br>
            <strong>The Dr. Sebi Approved Team</strong></p>
            
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
            
            <div style="font-size: 12px; color: #6b7280; text-align: center;">
              <p>You received this email because you requested our gut health guide from drsebiapproved.com</p>
              <p>Dr. Sebi Approved | Natural Wellness Solutions</p>
              <p>🌐 <a href="https://drsebiapproved.com" style="color: #22c55e;">Visit Our Website</a> | 
                 📧 <a href="mailto:info@drsebiapproved.com" style="color: #22c55e;">Contact Us</a></p>
            </div>
          </div>
        `,
        tags: ["lead-magnet", "gut-health-guide", "welcome-email"]
      });

      console.log(`Welcome email sent successfully: ${emailResult.messageId}`);

      // Step 4: Trigger behavioral tracking (identify user)
      // This will be handled by the frontend when the success response is received

      // Return success response
      res.status(200).json({ 
        success: true, 
        message: 'Contact added and welcome email sent successfully',
        data: {
          contactId: contact.id,
          listId: list.id,
          listName: list.name,
          emailSent: true,
          messageId: emailResult.messageId
        }
      });

    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
      
      // Contact was added successfully, but email failed
      res.status(200).json({ 
        success: true, 
        message: 'Contact added successfully, but welcome email failed to send',
        warning: 'Please manually follow up with this lead',
        data: {
          contactId: contact.id,
          listId: list.id,
          listName: list.name,
          emailSent: false,
          emailError: emailError.message
        }
      });
    }

  } catch (error) {
    console.error('Brevo API error:', error);

    // Handle specific Brevo errors
    if (error.response && error.response.code === 'duplicate_parameter') {
      // Contact already exists - this is actually success
      return res.status(200).json({ 
        success: true, 
        message: 'Contact already exists in our system',
        data: {
          contactExists: true,
          email: email
        }
      });
    }

    // General error response
    res.status(500).json({ 
      error: 'Failed to add contact',
      message: error.message,
      details: process.env.NODE_ENV === 'development' ? error.response : undefined
    });
  }
}