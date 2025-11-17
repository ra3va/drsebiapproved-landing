/**
 * Zoho Custom Email Sender
 * POST /api/zoho/send-email
 *
 * Send custom emails to any recipient with custom content.
 * Used for ad-hoc emails, not the campaign template.
 */

import { NextRequest, NextResponse } from 'next/server';
import { sendEmail, getDefaultUserEmail } from '@/lib/zoho';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { to, subject, htmlContent, textContent, cc, bcc } = body;

    // Validate required fields
    if (!to || !Array.isArray(to) || to.length === 0) {
      return NextResponse.json(
        { error: 'Missing or invalid "to" field. Must be array of email addresses.' },
        { status: 400 }
      );
    }

    if (!subject || !htmlContent) {
      return NextResponse.json(
        { error: 'Missing required fields: subject and htmlContent' },
        { status: 400 }
      );
    }

    // Prepare recipients
    const recipients = to.map((email: string) => ({
      address: email,
      name: email.split('@')[0], // Use email prefix as name if not provided
    }));

    const ccRecipients = cc?.map((email: string) => ({
      address: email,
      name: email.split('@')[0],
    }));

    const bccRecipients = bcc?.map((email: string) => ({
      address: email,
      name: email.split('@')[0],
    }));

    // Send email via Zoho
    const userEmail = getDefaultUserEmail();
    const result = await sendEmail(userEmail, {
      to: recipients,
      subject,
      htmlContent,
      textContent,
      cc: ccRecipients,
      bcc: bccRecipients,
    });

    return NextResponse.json({
      success: true,
      message: `Email sent to ${to.length} recipient(s)`,
      recipients: to,
      subject,
      zohoResponse: result,
    });
  } catch (error: any) {
    console.error('Error sending custom email:', error);
    return NextResponse.json(
      {
        error: 'Failed to send email',
        message: error.message,
      },
      { status: 500 }
    );
  }
}
