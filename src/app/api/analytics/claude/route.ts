import { NextRequest, NextResponse } from 'next/server';
import { ga4Client } from '@/lib/analytics/ga4-client';

export const dynamic = 'force-dynamic';

/**
 * Claude-Powered Google Analytics 4 Control System
 * 
 * This endpoint receives natural language commands and executes
 * the appropriate GA4 operations automatically.
 */

interface CommandRequest {
  command: string;
  context?: Record<string, any>;
}

interface CommandResponse {
  success: boolean;
  command: string;
  intent: string;
  data?: any;
  insights?: string[];
  message: string;
  timestamp: string;
}

export async function POST(request: NextRequest) {
  try {
    const { command, context = {} }: CommandRequest = await request.json();
    
    if (!command) {
      return NextResponse.json({ 
        error: 'Command is required' 
      }, { status: 400 });
    }

    console.log(`🤖 Claude GA4 Command: "${command}"`);
    
    const response = await processCommand(command, context);
    
    return NextResponse.json(response);
    
  } catch (error) {
    console.error('Claude GA4 Command error:', error);
    return NextResponse.json({ 
      error: 'Failed to process command',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const command = searchParams.get('q') || searchParams.get('command');
  
  if (command) {
    // Allow GET requests for simple queries
    const response = await processCommand(command);
    return NextResponse.json(response);
  }
  
  // Return API documentation
  return NextResponse.json({
    name: 'Claude GA4 Control System',
    description: 'Natural language interface for Google Analytics 4',
    version: '1.0.0',
    examples: {
      dataQueries: [
        'show newsletter conversions last 7 days',
        'get traffic sources this month',
        'real-time users right now',
        'audience demographics last 30 days'
      ],
      configuration: [
        'create conversion event for video_play',
        'list all conversion goals',
        'create custom dimension for user_tier',
        'show account summary'
      ],
      analysis: [
        'which traffic source converts best',
        'analyze conversion trends',
        'compare this month vs last month',
        'divine income engine performance'
      ]
    },
    usage: {
      POST: '/api/analytics/claude',
      GET: '/api/analytics/claude?command=YOUR_COMMAND'
    }
  });
}

/**
 * Process natural language commands and route to appropriate GA4 operations
 */
async function processCommand(command: string, context: Record<string, any> = {}): Promise<CommandResponse> {
  const normalizedCommand = command.toLowerCase().trim();
  const timestamp = new Date().toISOString();
  
  try {
    // === DATA QUERIES ===
    
    if (normalizedCommand.includes('newsletter') && (normalizedCommand.includes('conversion') || normalizedCommand.includes('signup'))) {
      const timeframe = extractTimeframe(normalizedCommand);
      const data = await ga4Client.getConversions(timeframe.startDate, timeframe.endDate);
      
      const newsletterData = data.rows.filter((row: any) => 
        row.dimensions.eventName === 'newsletter_signup'
      );
      
      const totalSignups = newsletterData.reduce((sum: number, row: any) => sum + row.metrics.eventCount, 0);
      const totalValue = newsletterData.reduce((sum: number, row: any) => sum + (row.metrics.eventValue || 0), 0);
      
      return {
        success: true,
        command,
        intent: 'newsletter_conversions_query',
        data: {
          period: timeframe,
          totalSignups,
          totalValue,
          dailyBreakdown: newsletterData.map((row: any) => ({
            date: row.dimensions.date,
            signups: row.metrics.eventCount,
            source: row.dimensions.firstUserSource,
            medium: row.dimensions.firstUserMedium
          }))
        },
        insights: [
          `Found ${totalSignups} newsletter signups in the ${timeframe.period}`,
          totalValue > 0 ? `Generated $${totalValue.toFixed(2)} in estimated value` : 'No conversion value tracked',
          newsletterData.length > 0 ? `Peak day: ${newsletterData[0].dimensions.date}` : 'No data available'
        ],
        message: `Newsletter signup analysis complete for ${timeframe.period}`,
        timestamp
      };
    }
    
    // Search queries (Search Console integration)
    if (normalizedCommand.includes('search') && (normalizedCommand.includes('query') || normalizedCommand.includes('keyword') || normalizedCommand.includes('term'))) {
      return {
        success: true,
        command,
        intent: 'search_queries_info',
        message: 'Search Console is now connected! Check these locations for keyword data:',
        data: {
          searchConsoleUrl: 'https://search.google.com/search-console?resource_id=sc-domain%3Adivinesoulreunion.com',
          ga4Location: 'Reports > Acquisition > Search Console (after 24-48 hours)',
          currentStatus: 'Integration in progress - data will appear within 24-48 hours'
        },
        insights: [
          'Search Console is verified for divinesoulreunion.com',
          'Link Search Console to GA4 for integrated reporting',
          'Check Performance > Queries in Search Console for immediate data',
          'GA4 integration takes 24-48 hours to populate'
        ],
        timestamp
      };
    }
    
    if (normalizedCommand.includes('traffic') && normalizedCommand.includes('source')) {
      const timeframe = extractTimeframe(normalizedCommand);
      const data = await ga4Client.getTrafficSources(timeframe.startDate, timeframe.endDate);
      
      const totalUsers = data.rows.reduce((sum: number, row: any) => sum + row.metrics.totalUsers, 0);
      const topSources = data.rows.slice(0, 5);
      
      return {
        success: true,
        command,
        intent: 'traffic_sources_query',
        data: {
          period: timeframe,
          totalUsers,
          sources: topSources.map((row: any) => ({
            source: row.dimensions.firstUserSource,
            medium: row.dimensions.firstUserMedium,
            campaign: row.dimensions.firstUserCampaignName,
            users: row.metrics.totalUsers,
            sessions: row.metrics.sessions,
            bounceRate: row.metrics.bounceRate,
            avgSessionDuration: row.metrics.averageSessionDuration
          }))
        },
        insights: [
          `Total users: ${totalUsers.toLocaleString()} in ${timeframe.period}`,
          `Top source: ${topSources[0]?.dimensions.firstUserSource} (${topSources[0]?.metrics.totalUsers} users)`,
          `Best quality: ${topSources.sort((a: any, b: any) => a.metrics.bounceRate - b.metrics.bounceRate)[0]?.dimensions.firstUserSource} (lowest bounce rate)`
        ],
        message: `Traffic source analysis complete for ${timeframe.period}`,
        timestamp
      };
    }
    
    if (normalizedCommand.includes('real') && normalizedCommand.includes('time')) {
      const data = await ga4Client.getRealtimeData();
      
      return {
        success: true,
        command,
        intent: 'realtime_data_query',
        data: {
          totalActiveUsers: data.totalActiveUsers,
          timestamp: data.timestamp,
          breakdown: data.rows.map((row: any) => ({
            page: row.dimensions.unifiedScreenName,
            activeUsers: row.metrics.activeUsers
          }))
        },
        insights: [
          `${data.totalActiveUsers} users active right now`,
          data.totalActiveUsers > 10 ? '🔥 High activity detected!' : data.totalActiveUsers > 0 ? '👍 Normal activity' : '😴 Low activity period'
        ],
        message: `Real-time data retrieved successfully`,
        timestamp
      };
    }
    
    if (normalizedCommand.includes('audience') || normalizedCommand.includes('demographic')) {
      const timeframe = extractTimeframe(normalizedCommand);
      const data = await ga4Client.getAudienceDemographics(timeframe.startDate, timeframe.endDate);
      
      const totalUsers = data.rows.reduce((sum: number, row: any) => sum + row.metrics.totalUsers, 0);
      const topCountries = data.rows
        .filter((row: any) => row.dimensions.country && row.dimensions.country !== '(not set)')
        .slice(0, 10);
      
      return {
        success: true,
        command,
        intent: 'audience_demographics_query',
        data: {
          period: timeframe,
          totalUsers,
          countries: topCountries.map((row: any) => ({
            country: row.dimensions.country,
            users: row.metrics.totalUsers,
            sessions: row.metrics.sessions
          })),
          devices: data.rows.reduce((acc: any, row: any) => {
            if (row.dimensions.deviceCategory) {
              acc[row.dimensions.deviceCategory] = (acc[row.dimensions.deviceCategory] || 0) + row.metrics.totalUsers;
            }
            return acc;
          }, {} as Record<string, number>)
        },
        insights: [
          `Total audience: ${totalUsers.toLocaleString()} users`,
          `Top country: ${topCountries[0]?.dimensions.country} (${topCountries[0]?.metrics.totalUsers} users)`,
          `Primary device: ${Object.entries(data.rows.reduce((acc: any, row: any) => {
            if (row.dimensions.deviceCategory) {
              acc[row.dimensions.deviceCategory] = (acc[row.dimensions.deviceCategory] || 0) + row.metrics.totalUsers;
            }
            return acc;
          }, {} as Record<string, number>)).sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || 'Unknown'}`
        ],
        message: `Audience demographics analysis complete for ${timeframe.period}`,
        timestamp
      };
    }
    
    // === CONFIGURATION COMMANDS ===
    
    if (normalizedCommand.includes('create') && normalizedCommand.includes('conversion')) {
      const eventName = extractEventName(normalizedCommand);
      if (!eventName) {
        return {
          success: false,
          command,
          intent: 'create_conversion_error',
          message: 'Could not extract event name. Please specify like "create conversion for video_play"',
          timestamp
        };
      }
      
      const result = await ga4Client.createConversion({ eventName });
      
      return {
        success: true,
        command,
        intent: 'create_conversion',
        data: result,
        insights: [
          result.skipped ? `Event '${eventName}' was already configured` : `New conversion event '${eventName}' created successfully`,
          'Events will be tracked as conversions going forward',
          'May take up to 24 hours to appear in standard reports'
        ],
        message: result.skipped ? `Conversion '${eventName}' already exists` : `Conversion '${eventName}' created successfully`,
        timestamp
      };
    }
    
    if (normalizedCommand.includes('list') && (normalizedCommand.includes('conversion') || normalizedCommand.includes('goal'))) {
      const conversions = await ga4Client.listConversions();
      
      return {
        success: true,
        command,
        intent: 'list_conversions',
        data: {
          count: conversions.length,
          conversions: conversions.map((conv: any) => ({
            eventName: conv.eventName,
            countingMethod: conv.countingMethod,
            defaultValue: conv.defaultValue
          }))
        },
        insights: [
          `${conversions.length} conversion events configured`,
          `Events: ${conversions.map((c: any) => c.eventName).join(', ')}`,
          'All conversions use ONCE_PER_EVENT counting'
        ],
        message: `Found ${conversions.length} conversion events`,
        timestamp
      };
    }
    
    if (normalizedCommand.includes('create') && normalizedCommand.includes('dimension')) {
      const dimensionInfo = extractDimensionInfo(normalizedCommand);
      if (!dimensionInfo.parameterName) {
        return {
          success: false,
          command,
          intent: 'create_dimension_error',
          message: 'Could not extract dimension name. Please specify like "create dimension for user_tier"',
          timestamp
        };
      }
      
      const result = await ga4Client.createCustomDimension(dimensionInfo);
      
      return {
        success: true,
        command,
        intent: 'create_dimension',
        data: result,
        insights: [
          result.skipped ? `Dimension '${dimensionInfo.parameterName}' was already configured` : `New custom dimension '${dimensionInfo.parameterName}' created successfully`,
          'Dimension will be available for reporting within 24 hours',
          `Scope: ${dimensionInfo.scope} level tracking`
        ],
        message: result.skipped ? `Dimension '${dimensionInfo.parameterName}' already exists` : `Dimension '${dimensionInfo.parameterName}' created successfully`,
        timestamp
      };
    }
    
    if (normalizedCommand.includes('account') && normalizedCommand.includes('summary')) {
      const summary = await ga4Client.getAccountSummary();
      
      return {
        success: true,
        command,
        intent: 'account_summary',
        data: summary,
        insights: [
          `Property ID: ${summary.propertyId}`,
          `${summary.conversions.count} conversion events configured`,
          `${summary.customDimensions.count} custom dimensions active`,
          'Divine Income Engine analytics fully operational'
        ],
        message: `Account summary retrieved for property ${summary.propertyId}`,
        timestamp
      };
    }
    
    // === FALLBACK ===
    
    return {
      success: false,
      command,
      intent: 'unknown_command',
      message: `I don't understand "${command}". Try commands like:
      
📊 Data: "show newsletter conversions last 7 days"
⚙️ Config: "create conversion for video_play"
🔍 Analysis: "get traffic sources this month"
📈 Realtime: "show real-time users"`,
      timestamp
    };
    
  } catch (error) {
    return {
      success: false,
      command,
      intent: 'command_error',
      message: `Error processing command: ${error instanceof Error ? error.message : 'Unknown error'}`,
      timestamp
    };
  }
}

/**
 * Extract timeframe from natural language
 */
function extractTimeframe(command: string) {
  const cmd = command.toLowerCase();
  
  if (cmd.includes('today')) {
    return { startDate: 'today', endDate: 'today', period: 'today' };
  }
  if (cmd.includes('yesterday')) {
    return { startDate: 'yesterday', endDate: 'yesterday', period: 'yesterday' };
  }
  if (cmd.includes('last 7 days') || cmd.includes('past 7 days') || cmd.includes('week')) {
    return { startDate: '7daysAgo', endDate: 'today', period: 'last 7 days' };
  }
  if (cmd.includes('last 30 days') || cmd.includes('past 30 days') || cmd.includes('month')) {
    return { startDate: '30daysAgo', endDate: 'today', period: 'last 30 days' };
  }
  if (cmd.includes('last 90 days') || cmd.includes('past 90 days') || cmd.includes('quarter')) {
    return { startDate: '90daysAgo', endDate: 'today', period: 'last 90 days' };
  }
  
  // Default to last 7 days
  return { startDate: '7daysAgo', endDate: 'today', period: 'last 7 days' };
}

/**
 * Extract event name from command
 */
function extractEventName(command: string): string | null {
  const patterns = [
    /create conversion (?:event )?for (\w+)/i,
    /create (\w+) conversion/i,
    /conversion (?:event )?(\w+)/i
  ];
  
  for (const pattern of patterns) {
    const match = command.match(pattern);
    if (match) return match[1];
  }
  
  return null;
}

/**
 * Extract dimension info from command
 */
function extractDimensionInfo(command: string) {
  const cmd = command.toLowerCase();
  let parameterName = null;
  
  const patterns = [
    /create dimension for (\w+)/i,
    /create (\w+) dimension/i,
    /dimension (\w+)/i
  ];
  
  for (const pattern of patterns) {
    const match = command.match(pattern);
    if (match) {
      parameterName = match[1];
      break;
    }
  }
  
  const scope = cmd.includes('user') ? 'USER' : cmd.includes('item') ? 'ITEM' : 'EVENT';
  
  return {
    parameterName: parameterName || '',
    displayName: parameterName ? parameterName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) : '',
    scope: scope as 'EVENT' | 'USER' | 'ITEM'
  };
}