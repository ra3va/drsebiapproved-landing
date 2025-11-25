/**
 * Claude GA4 Helper Functions
 * 
 * These are the functions I (Claude) use to interact with your GA4 account
 * directly through natural language commands.
 */

/* eslint-disable @typescript-eslint/no-explicit-any */

/**
 * Execute a GA4 command through the Claude interface
 */
export async function executeGA4Command(command: string, baseUrl: string = 'http://localhost:3000') {
  try {
    const response = await fetch(`${baseUrl}/api/analytics/claude`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ command })
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    throw new Error(`GA4 command failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Helper function to format GA4 responses for display
 */
export function formatGA4Response(response: any) {
  if (!response.success) {
    return `❌ **Error**: ${response.message}`;
  }

  let output = `✅ **${response.intent.replace(/_/g, ' ').toUpperCase()}**\n`;
  output += `📊 ${response.message}\n\n`;

  if (response.insights && response.insights.length > 0) {
    output += `💡 **Key Insights:**\n`;
    response.insights.forEach((insight: string) => {
      output += `• ${insight}\n`;
    });
    output += '\n';
  }

  if (response.data) {
    // Format specific data types
    if (response.intent === 'newsletter_conversions_query') {
      const data = response.data;
      output += `📈 **Newsletter Performance (${data.period.period})**:\n`;
      output += `• Total Signups: ${data.totalSignups}\n`;
      output += `• Total Value: $${data.totalValue.toFixed(2)}\n`;
      
      if (data.dailyBreakdown.length > 0) {
        output += `• Recent Activity:\n`;
        data.dailyBreakdown.slice(0, 5).forEach((day: any) => {
          output += `  - ${day.date}: ${day.signups} signups (${day.source})\n`;
        });
      }
    } else if (response.intent === 'traffic_sources_query') {
      const data = response.data;
      output += `🌐 **Traffic Sources (${data.period.period})**:\n`;
      output += `• Total Users: ${data.totalUsers.toLocaleString()}\n`;
      output += `• Top Sources:\n`;
      data.sources.slice(0, 5).forEach((source: any, index: number) => {
        output += `  ${index + 1}. ${source.source}/${source.medium}: ${source.users} users (${source.bounceRate.toFixed(1)}% bounce)\n`;
      });
    } else if (response.intent === 'list_conversions') {
      const data = response.data;
      output += `🎯 **Conversion Events (${data.count} total)**:\n`;
      data.conversions.forEach((conv: any) => {
        output += `• ${conv.eventName} (${conv.countingMethod})\n`;
      });
    } else if (response.intent === 'realtime_data_query') {
      const data = response.data;
      output += `⚡ **Real-time Activity**:\n`;
      output += `• Active Users: ${data.totalActiveUsers}\n`;
      if (data.breakdown.length > 0) {
        output += `• Active Pages:\n`;
        data.breakdown.slice(0, 3).forEach((page: any) => {
          output += `  - ${page.page}: ${page.activeUsers} users\n`;
        });
      }
    }
  }

  output += `\n*Updated: ${new Date(response.timestamp).toLocaleString()}*`;
  
  return output;
}

/**
 * Common GA4 commands I use frequently
 */
export const commonCommands = {
  // Data queries
  checkNewsletterConversions: (days: number = 7) => `show newsletter conversions last ${days} days`,
  getTrafficSources: (period: string = 'month') => `get traffic sources this ${period}`,
  getRealtimeUsers: () => 'real-time users right now',
  getAudienceDemographics: (period: string = '30 days') => `audience demographics last ${period}`,
  
  // Configuration
  listConversions: () => 'list all conversion goals',
  createConversion: (eventName: string) => `create conversion event for ${eventName}`,
  createDimension: (parameterName: string, scope: string = 'event') => `create ${scope} dimension for ${parameterName}`,
  getAccountSummary: () => 'show account summary',
  
  // Analysis
  findBestTrafficSource: () => 'which traffic source converts best',
  analyzeConversionTrends: () => 'analyze conversion trends last 30 days',
  compareMonths: () => 'compare this month vs last month'
};

/**
 * Quick analysis functions for common requests
 */
export async function quickNewsletterReport(days: number = 7) {
  const command = commonCommands.checkNewsletterConversions(days);
  const response = await executeGA4Command(command);
  return formatGA4Response(response);
}

export async function quickTrafficReport(period: string = 'month') {
  const command = commonCommands.getTrafficSources(period);
  const response = await executeGA4Command(command);
  return formatGA4Response(response);
}

export async function quickRealtimeCheck() {
  const command = commonCommands.getRealtimeUsers();
  const response = await executeGA4Command(command);
  return formatGA4Response(response);
}

export async function quickAccountStatus() {
  const command = commonCommands.getAccountSummary();
  const response = await executeGA4Command(command);
  return formatGA4Response(response);
}