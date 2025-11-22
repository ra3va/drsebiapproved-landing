/**
 * Campaign CSV Upload API
 * POST /api/campaign/upload-list
 *
 * Uploads the 8,000 customer CSV list and populates the database.
 * CSV format: email, name (optional)
 *
 * Example CSV:
 * customer1@example.com,John Doe
 * customer2@example.com,Jane Smith
 * customer3@example.com
 */

import { NextRequest, NextResponse } from 'next/server';
import { supabase, supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

interface CsvRow {
  email: string;
  name?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Check if Supabase is configured
    if (!isSupabaseConfigured()) {
      return NextResponse.json(
        {
          error: 'Supabase not configured',
          message: 'Database not ready. Please configure Supabase first.',
        },
        { status: 503 }
      );
    }

    // Parse request body
    const body = await request.json();
    const {
      csvData,
      batchSize = 50,
      campaignName = 'Default Campaign',
      campaignType = 'general',
      campaignDescription = null,
      sourceFiles = []
    } = body;

    if (!csvData) {
      return NextResponse.json(
        { error: 'Missing CSV data', message: 'Please provide csvData in request body' },
        { status: 400 }
      );
    }

    const normalizedCampaignName = (campaignName || '').trim();
    if (!normalizedCampaignName) {
      return NextResponse.json(
        { error: 'Campaign name required', message: 'Please provide a campaignName when uploading CSVs' },
        { status: 400 }
      );
    }

    const allowedTypes = ['winback', 'warm', 'cold', 'general'];
    const requestedType = ((campaignType || '') as string).toString().toLowerCase();
    const normalizedCampaignType = allowedTypes.includes(requestedType)
      ? requestedType
      : 'general';
    const normalizedDescription = campaignDescription ? String(campaignDescription).trim() : null;
    const uploadTimestamp = new Date().toISOString();

    // Parse CSV (simple parser - expects email,name format)
    const rows = csvData.trim().split('\n');
    const customers: CsvRow[] = [];

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i].trim();
      if (!row) continue; // Skip empty lines

      const [email, name] = row.split(',').map((s: string) => s.trim());

      // Basic email validation
      if (!email || !email.includes('@')) {
        console.warn(`Skipping invalid email on row ${i + 1}:`, email);
        continue;
      }

      customers.push({ email, name: name || null });
    }

    if (customers.length === 0) {
      return NextResponse.json(
        { error: 'No valid customers found', message: 'CSV contains no valid email addresses' },
        { status: 400 }
      );
    }

    console.log(`Parsed ${customers.length} valid customers from CSV`);

    // Calculate batch numbers (for rate limiting)
    // Example: 8000 customers ÷ 50 per day = 160 batches
    const totalBatches = Math.ceil(customers.length / batchSize);

    // Prepare data for database insertion
    const campaignRecords = customers.map((customer, index) => ({
      customer_email: customer.email,
      customer_name: customer.name,
      status: 'pending', // ALWAYS reset to pending on upload
      batch_number: Math.floor(index / batchSize) + 1, // Batch 1, 2, 3, etc.
      campaign_stage: 1, // Start at stage 1
      next_action_date: new Date().toISOString(), // Ready to send now
      sent_at: null, // Clear sent timestamp
      clicked_at: null, // Clear click timestamp
      converted_at: null, // Clear conversion timestamp
      campaign_name: normalizedCampaignName,
      campaign_type: normalizedCampaignType,
      campaign_description: normalizedDescription,
      uploaded_at: uploadTimestamp,
    }));

    console.log('[Upload API] Upserting', campaignRecords.length, 'records...');

    // Insert into database (upsert to handle duplicates)
    // Using supabaseAdmin to bypass RLS and ensure writes succeed
    const { data, error } = await supabaseAdmin
      .from('reengagement_campaign')
      .upsert(campaignRecords, {
        onConflict: 'customer_email', // Don't duplicate emails
        ignoreDuplicates: false, // Update existing records - RESET their status!
      })
      .select();

    if (error) {
      console.error('[Upload API] Database error:', error);
      console.error('[Upload API] Error details:', JSON.stringify(error, null, 2));
      return NextResponse.json(
        { error: 'Failed to upload customers', message: error.message, details: error },
        { status: 500 }
      );
    }

    const insertedCount = data?.length || 0;
    console.log('[Upload API] Upsert complete. Inserted/updated:', insertedCount);

    if (insertedCount === 0) {
      console.error('[Upload API] WARNING: No records were inserted! This might be an RLS issue.');
      return NextResponse.json(
        {
          error: 'No records inserted',
          message: 'Upsert returned 0 rows. Check Supabase RLS policies.',
          hint: 'Make sure reengagement_campaign table has INSERT and UPDATE permissions enabled.'
        },
        { status: 500 }
      );
    }

    if (insertedCount < customers.length) {
      console.warn(`[Upload API] Only ${insertedCount} of ${customers.length} records were inserted!`);
    }

    console.log(`✅ Successfully uploaded ${data.length} customers to campaign database under "${normalizedCampaignName}"`);
    if (Array.isArray(sourceFiles) && sourceFiles.length > 0) {
      console.log('[Upload API] Source files:', sourceFiles.join(', '));
    }

    // Get campaign statistics (read-only, regular client is fine)
    const { data: stats } = await supabase
      .from('reengagement_campaign')
      .select('status', { count: 'exact' });

    const statusCounts = stats?.reduce((acc: any, row: any) => {
      acc[row.status] = (acc[row.status] || 0) + 1;
      return acc;
    }, {}) || {};

    return NextResponse.json({
      success: true,
      message: `Successfully uploaded ${data.length} customers`,
      stats: {
        total: customers.length,
        uploaded: data.length,
        totalBatches,
        batchSize,
        estimatedDays: totalBatches,
        statusBreakdown: statusCounts,
        campaignName: normalizedCampaignName,
        campaignType: normalizedCampaignType,
      },
    });

  } catch (error: any) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Upload failed', message: error.message },
      { status: 500 }
    );
  }
}

/**
 * GET /api/campaign/upload-list
 * Returns upload instructions and CSV format
 */
export async function GET() {
  return NextResponse.json({
    endpoint: '/api/campaign/upload-list',
    method: 'POST',
    description: 'Upload 8K customer CSV list for re-engagement campaign',
    requestFormat: {
      csvData: 'email1@example.com,Customer Name\nemail2@example.com,Another Name',
      batchSize: 50, // Optional: emails per day (default 50)
    },
    csvFormat: 'email,name (optional)',
    example: `customer1@example.com,John Doe
customer2@example.com,Jane Smith
customer3@example.com`,
    notes: [
      'One email per line',
      'Name is optional (will use email if not provided)',
      'Invalid emails will be skipped',
      'Duplicates will be updated, not duplicated',
      'Customers will be assigned to batches based on batchSize',
    ],
  });
}
