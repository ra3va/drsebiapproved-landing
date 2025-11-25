import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin, isSupabaseConfigured } from '@/lib/supabase';

// Force dynamic rendering and disable caching
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function DELETE(request: NextRequest) {
    try {
        if (!isSupabaseConfigured()) {
            return NextResponse.json(
                { error: 'Supabase not configured' },
                { status: 503 }
            );
        }

        const { searchParams } = new URL(request.url);
        const campaignName = searchParams.get('name');

        if (!campaignName) {
            return NextResponse.json(
                { error: 'Missing name parameter', message: 'Provide ?name=CampaignName' },
                { status: 400 }
            );
        }

        const decodedName = decodeURIComponent(campaignName);

        console.log(`[Delete Campaign] Removing campaign "${decodedName}"...`);

        // IMPORTANT: Delete clicks FIRST (foreign key constraint)
        const { count: clicksDeleted } = await supabaseAdmin
            .from('campaign_clicks')
            .delete({ count: 'exact' })
            .eq('campaign_name', decodedName);

        console.log(`[Delete Campaign] Deleted ${clicksDeleted || 0} click records`);

        // Now delete campaign records
        const { error: deleteError, count } = await supabaseAdmin
            .from('reengagement_campaign')
            .delete({ count: 'exact' })
            .eq('campaign_name', decodedName);

        if (deleteError) {
            console.error('[Delete Campaign] Error:', deleteError);
            return NextResponse.json(
                { error: 'Failed to delete campaign', details: deleteError },
                { status: 500 }
            );
        }

        console.log(`✅ [Delete Campaign] Removed ${count} campaign records, ${clicksDeleted || 0} clicks for "${decodedName}"`);

        return NextResponse.json({
            success: true,
            message: `Campaign "${decodedName}" deleted`,
            deletedCount: count,
        });

    } catch (error: any) {
        console.error('[Delete Campaign] Error:', error);
        return NextResponse.json(
            { error: 'Delete failed', message: error.message },
            { status: 500 }
        );
    }
}
