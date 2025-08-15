/**
 * Brevo Claude Wrapper - Natural Language Interface
 * Enables conversational campaign management
 */

import brevoClient from './brevo-client.js';

export class BrevoClaudeWrapper {
  constructor() {
    this.client = brevoClient;
  }

  // ========================================
  // NATURAL LANGUAGE CONTACT MANAGEMENT
  // ========================================

  /**
   * Add email to a specific list (Claude command: "add email@example.com to gut health list")
   */
  async addContactToList(email, listName, attributes = {}) {
    try {
      const list = await this.client.findOrCreateList(listName);
      const contact = await this.client.addContact({
        email,
        listIds: [list.id],
        attributes: {
          SOURCE: 'claude-conversation',
          ADDED_BY: 'claude',
          ADDED_DATE: new Date().toISOString().split('T')[0],
          ...attributes
        }
      });

      return {
        success: true,
        message: `✅ Added ${email} to "${list.name}" list`,
        data: { contactId: contact.id, listId: list.id, listName: list.name }
      };
    } catch (error) {
      return {
        success: false,
        message: `❌ Failed to add ${email}: ${error.message}`,
        error: error.message
      };
    }
  }

  /**
   * Create a new list (Claude command: "create list called High Intent Leads")
   */
  async createList(name, description = '') {
    try {
      const list = await this.client.createList(name);
      return {
        success: true,
        message: `✅ Created list "${name}" (ID: ${list.id})`,
        data: list
      };
    } catch (error) {
      return {
        success: false,
        message: `❌ Failed to create list "${name}": ${error.message}`,
        error: error.message
      };
    }
  }

  /**
   * Show subscribers in a list (Claude command: "show me gut health list subscribers")
   */
  async getListSubscribers(listName, limit = 50) {
    try {
      const list = await this.client.getListByName(listName);
      if (!list) {
        return {
          success: false,
          message: `❌ List "${listName}" not found`
        };
      }

      const contacts = await this.client.getListContacts(list.id, limit);
      
      return {
        success: true,
        message: `📋 "${listName}" has ${contacts.count} total subscribers`,
        data: {
          listName: list.name,
          totalSubscribers: contacts.count,
          subscribers: contacts.contacts.map(contact => ({
            email: contact.email,
            firstName: contact.attributes?.FIRSTNAME || '',
            addedDate: contact.attributes?.SIGNUP_DATE || 'Unknown',
            source: contact.attributes?.SOURCE || 'Unknown'
          }))
        }
      };
    } catch (error) {
      return {
        success: false,
        message: `❌ Failed to get subscribers for "${listName}": ${error.message}`,
        error: error.message
      };
    }
  }

  // ========================================
  // CAMPAIGN MANAGEMENT
  // ========================================

  /**
   * Create email campaign (Claude command: "create campaign about parasite cleanse benefits")
   */
  async createCampaign(subject, topic, listName, content = null) {
    try {
      const list = await this.client.getListByName(listName);
      if (!list) {
        return {
          success: false,
          message: `❌ List "${listName}" not found. Create it first or use an existing list.`
        };
      }

      // Generate content if not provided (basic template)
      const htmlContent = content || this.generateCampaignContent(topic, subject);

      const campaign = await this.client.createEmailCampaign({
        name: `${topic} - ${new Date().toLocaleDateString()}`,
        subject,
        htmlContent,
        sender: {
          name: "Dr. Sebi Approved",
          email: "info@drsebiapproved.com"
        },
        recipients: {
          listIds: [list.id]
        },
        tags: ['claude-created', topic.toLowerCase().replace(/\s+/g, '-')]
      });

      return {
        success: true,
        message: `✅ Created campaign "${subject}" for "${listName}" (${list.totalSubscribers || 'Unknown'} recipients)`,
        data: {
          campaignId: campaign.id,
          campaignName: campaign.name,
          subject,
          listName: list.name,
          status: 'draft'
        }
      };
    } catch (error) {
      return {
        success: false,
        message: `❌ Failed to create campaign: ${error.message}`,
        error: error.message
      };
    }
  }

  /**
   * Show campaign performance (Claude command: "how did the gut health campaign perform?")
   */
  async getCampaignPerformance(campaignName) {
    try {
      const campaigns = await this.client.getCampaigns();
      const campaign = campaigns.campaigns.find(c => 
        c.name.toLowerCase().includes(campaignName.toLowerCase())
      );

      if (!campaign) {
        return {
          success: false,
          message: `❌ Campaign containing "${campaignName}" not found`
        };
      }

      const stats = await this.client.getCampaignStats(campaign.id);

      const openRate = ((stats.uniqueOpens / stats.delivered) * 100).toFixed(1);
      const clickRate = ((stats.uniqueClicks / stats.uniqueOpens) * 100).toFixed(1);

      return {
        success: true,
        message: `📊 "${campaign.name}" Performance Report`,
        data: {
          campaignName: campaign.name,
          subject: campaign.subject,
          sent: stats.delivered,
          opens: stats.uniqueOpens,
          clicks: stats.uniqueClicks,
          unsubscribes: stats.unsubscriptions,
          bounces: stats.hardBounces + stats.softBounces,
          openRate: `${openRate}%`,
          clickRate: `${clickRate}%`,
          revenue: 'N/A', // TODO: Integrate with Shopify tracking
        }
      };
    } catch (error) {
      return {
        success: false,
        message: `❌ Failed to get campaign performance: ${error.message}`,
        error: error.message
      };
    }
  }

  // ========================================
  // SEGMENTATION
  // ========================================

  /**
   * Create smart segment (Claude command: "segment users who opened 2+ emails")
   */
  async createEngagementSegment(name, criteria) {
    try {
      const queryString = this.client.buildSegmentQuery(criteria);
      const segment = await this.client.createSegment(name, queryString);

      return {
        success: true,
        message: `✅ Created segment "${name}" with criteria: ${this.describeCriteria(criteria)}`,
        data: {
          segmentId: segment.id,
          segmentName: segment.name,
          criteria,
          queryString
        }
      };
    } catch (error) {
      return {
        success: false,
        message: `❌ Failed to create segment "${name}": ${error.message}`,
        error: error.message
      };
    }
  }

  // ========================================
  // AUTOMATION WORKFLOWS
  // ========================================

  /**
   * Create welcome series (Claude command: "create welcome series for gut health list")
   */
  async createWelcomeSeries(listName, emails = null) {
    try {
      const list = await this.client.getListByName(listName);
      if (!list) {
        return {
          success: false,
          message: `❌ List "${listName}" not found`
        };
      }

      // Default welcome series if not provided
      const defaultEmails = [
        {
          subject: "Welcome to Your Gut Health Journey! 🌿",
          delay: 0,
          content: "Thank you for joining our community! Your gut health guide is attached."
        },
        {
          subject: "The Hidden Signs of Parasite Infection",
          delay: 259200, // 3 days
          content: "Most people don't realize they have parasites. Here are the warning signs..."
        },
        {
          subject: "Dr. Sebi's Natural Parasite Cleanse Protocol",
          delay: 604800, // 7 days  
          content: "Discover the natural methods that have helped thousands restore their gut health."
        }
      ];

      const emailSequence = emails || defaultEmails;

      const automation = await this.client.createAutomation({
        name: `Welcome Series - ${listName}`,
        triggerSettings: {
          triggerType: 'contact_list_addition',
          listId: list.id
        },
        steps: emailSequence.map((email, index) => ({
          type: 'email',
          delay: email.delay,
          subject: email.subject,
          content: email.content
        }))
      });

      return {
        success: true,
        message: `✅ Created ${emailSequence.length}-part welcome series for "${listName}"`,
        data: {
          automationId: automation.id,
          automationName: automation.name,
          listName: list.name,
          emailCount: emailSequence.length,
          emails: emailSequence.map(email => ({
            subject: email.subject,
            delayDays: Math.round(email.delay / 86400)
          }))
        }
      };
    } catch (error) {
      return {
        success: false,
        message: `❌ Failed to create welcome series: ${error.message}`,
        error: error.message
      };
    }
  }

  // ========================================
  // UTILITY METHODS
  // ========================================

  /**
   * Generate basic campaign content
   */
  generateCampaignContent(topic, subject) {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <img src="https://drsebiapproved.com/logo.png" alt="Dr. Sebi Approved" style="max-width: 200px;">
        </div>
        
        <h2 style="color: #22c55e; text-align: center;">${subject}</h2>
        
        <p>Dear Friend,</p>
        
        <p>I wanted to share some important insights about ${topic.toLowerCase()} that could transform your health journey.</p>
        
        <div style="background: #f0fdf4; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <p>This email was created by Claude to discuss ${topic}. Please customize this content with specific information about your products and services.</p>
        </div>
        
        <p>To your health,<br><strong>The Dr. Sebi Approved Team</strong></p>
        
        <div style="text-align: center; margin-top: 30px;">
          <a href="https://drsebiapproved.com" style="background: #22c55e; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold;">
            Visit Our Website
          </a>
        </div>
      </div>
    `;
  }

  /**
   * Describe segmentation criteria in human language
   */
  describeCriteria(criteria) {
    const descriptions = [];
    
    if (criteria.emailOpened) {
      descriptions.push(`opened ${criteria.emailOpened}+ emails`);
    }
    if (criteria.emailClicked) {
      descriptions.push(`clicked ${criteria.emailClicked}+ email links`);
    }
    if (criteria.pageVisited) {
      descriptions.push(`visited ${criteria.pageVisited} page`);
    }
    if (criteria.noActivityDays) {
      descriptions.push(`no activity in ${criteria.noActivityDays}+ days`);
    }

    return descriptions.join(', ');
  }

  /**
   * Get account overview (Claude command: "show me account status")
   */
  async getAccountOverview() {
    try {
      const account = await this.client.getAccount();
      const lists = await this.client.getLists();
      const campaigns = await this.client.getCampaigns('classic', 'sent', 10);

      const totalContacts = lists.lists.reduce((sum, list) => sum + (list.totalSubscribers || 0), 0);
      
      return {
        success: true,
        message: "📊 Brevo Account Overview",
        data: {
          planType: account.plan?.[0]?.type || 'Free',
          emailsRemaining: account.plan?.[0]?.creditsRemaining || 'Unknown',
          totalContacts,
          totalLists: lists.count,
          recentCampaigns: campaigns.count,
          lists: lists.lists.map(list => ({
            name: list.name,
            subscribers: list.totalSubscribers || 0,
            id: list.id
          }))
        }
      };
    } catch (error) {
      return {
        success: false,
        message: `❌ Failed to get account overview: ${error.message}`,
        error: error.message
      };
    }
  }

  /**
   * Test connection (Claude command: "test brevo connection")
   */
  async testConnection() {
    const result = await this.client.testConnection();
    return {
      success: result.success,
      message: result.success ? "✅ Brevo connection successful!" : `❌ Connection failed: ${result.message}`
    };
  }
}

// Export singleton instance
const brevoClaudeWrapper = new BrevoClaudeWrapper();
export default brevoClaudeWrapper;