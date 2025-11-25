/**
 * Divine Income Engine - Unified Google Analytics 4 Client
 * 
 * Provides a unified interface for both GA4 Data API and Admin API
 * with intelligent error handling, rate limiting, and response parsing.
 */

import { BetaAnalyticsDataClient } from '@google-analytics/data';
import { AnalyticsAdminServiceClient } from '@google-analytics/admin';

export interface GA4Config {
  propertyId: string;
  measurementId?: string;
  apiSecret?: string;
}

export interface ReportRequest {
  startDate: string;
  endDate: string;
  dimensions?: string[];
  metrics?: string[];
  filters?: any[];
  orderBy?: any[];
  limit?: number;
}

export interface ConversionEvent {
  eventName: string;
  countingMethod?: 'ONCE_PER_EVENT' | 'ONCE_PER_SESSION';
  defaultValue?: number;
  currencyCode?: string;
}

export interface CustomDimension {
  parameterName: string;
  displayName: string;
  scope: 'EVENT' | 'USER' | 'ITEM';
  description?: string;
}

export class GA4Client {
  private dataClient: BetaAnalyticsDataClient;
  private adminClient: AnalyticsAdminServiceClient;
  private config: GA4Config;
  private propertyPath: string;

  constructor(config: GA4Config) {
    this.config = config;
    this.propertyPath = `properties/${config.propertyId}`;
    this.dataClient = new BetaAnalyticsDataClient();
    this.adminClient = new AnalyticsAdminServiceClient();
  }

  // === DATA API METHODS ===

  /**
   * Run a standard report with intelligent defaults
   */
  async runReport(request: ReportRequest) {
    try {
      const [response] = await this.dataClient.runReport({
        property: this.propertyPath,
        dateRanges: [{ 
          startDate: request.startDate, 
          endDate: request.endDate 
        }],
        dimensions: request.dimensions?.map(name => ({ name })) || [],
        metrics: request.metrics?.map(name => ({ name })) || [],
        dimensionFilter: request.filters?.[0],
        orderBys: request.orderBy || [],
        limit: request.limit || 1000
      });

      return this.parseReportResponse(response);
    } catch (error) {
      throw new Error(`GA4 Report failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get real-time data (last 30 minutes)
   */
  async getRealtimeData(dimensions: string[] = ['unifiedScreenName'], metrics: string[] = ['activeUsers']) {
    try {
      const [response] = await this.dataClient.runRealtimeReport({
        property: this.propertyPath,
        dimensions: dimensions.map(name => ({ name })),
        metrics: metrics.map(name => ({ name }))
      });

      return this.parseRealtimeResponse(response);
    } catch (error) {
      throw new Error(`GA4 Realtime failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get conversion events data
   */
  async getConversions(startDate: string = '7daysAgo', endDate: string = 'today') {
    return this.runReport({
      startDate,
      endDate,
      dimensions: ['eventName', 'date', 'firstUserSource', 'firstUserMedium'],
      metrics: ['eventCount', 'eventValue'],
      filters: [{
        orGroup: {
          expressions: [
            { filter: { fieldName: 'eventName', stringFilter: { value: 'purchase' } } },
            { filter: { fieldName: 'eventName', stringFilter: { value: 'newsletter_signup' } } },
            { filter: { fieldName: 'eventName', stringFilter: { value: 'form_submit' } } },
            { filter: { fieldName: 'eventName', stringFilter: { value: 'close_convert_lead' } } },
            { filter: { fieldName: 'eventName', stringFilter: { value: 'qualify_lead' } } }
          ]
        }
      }],
      orderBy: [{ dimension: { dimensionName: 'date' }, desc: true }]
    });
  }

  /**
   * Get traffic source data
   */
  async getTrafficSources(startDate: string = '7daysAgo', endDate: string = 'today') {
    return this.runReport({
      startDate,
      endDate,
      dimensions: ['firstUserSource', 'firstUserMedium', 'firstUserCampaignName'],
      metrics: ['totalUsers', 'sessions', 'bounceRate', 'averageSessionDuration'],
      orderBy: [{ metric: { metricName: 'totalUsers' }, desc: true }],
      limit: 20
    });
  }

  /**
   * Get audience demographics
   */
  async getAudienceDemographics(startDate: string = '30daysAgo', endDate: string = 'today') {
    return this.runReport({
      startDate,
      endDate,
      dimensions: ['country', 'city', 'deviceCategory', 'userAgeBracket', 'userGender'],
      metrics: ['totalUsers', 'sessions', 'averageSessionDuration'],
      orderBy: [{ metric: { metricName: 'totalUsers' }, desc: true }],
      limit: 50
    });
  }

  // === ADMIN API METHODS ===

  /**
   * List all conversion events (key events)
   */
  async listConversions() {
    try {
      const [keyEvents] = await this.adminClient.listKeyEvents({
        parent: this.propertyPath
      });

      return keyEvents.map(event => ({
        name: event.name,
        eventName: event.eventName,
        countingMethod: event.countingMethod,
        defaultValue: event.defaultValue,
        createTime: event.createTime
      }));
    } catch (error) {
      throw new Error(`Failed to list conversions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create a new conversion event
   */
  async createConversion(conversion: ConversionEvent) {
    try {
      const [keyEvent] = await this.adminClient.createKeyEvent({
        parent: this.propertyPath,
        keyEvent: {
          eventName: conversion.eventName,
          countingMethod: conversion.countingMethod || 'ONCE_PER_EVENT',
          defaultValue: conversion.defaultValue ? {
            numericValue: conversion.defaultValue,
            currencyCode: conversion.currencyCode || 'USD'
          } : undefined
        }
      });

      return {
        success: true,
        name: keyEvent.name,
        eventName: keyEvent.eventName,
        countingMethod: keyEvent.countingMethod
      };
    } catch (error: any) {
      if (error.code === 6) { // ALREADY_EXISTS
        return {
          success: true,
          message: `Conversion '${conversion.eventName}' already exists`,
          skipped: true
        };
      }
      throw new Error(`Failed to create conversion: ${error.message}`);
    }
  }

  /**
   * List all custom dimensions
   */
  async listCustomDimensions() {
    try {
      const [dimensions] = await this.adminClient.listCustomDimensions({
        parent: this.propertyPath
      });

      return dimensions.map(dim => ({
        name: dim.name,
        parameterName: dim.parameterName,
        displayName: dim.displayName,
        scope: dim.scope,
        description: dim.description
      }));
    } catch (error) {
      throw new Error(`Failed to list dimensions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Create a new custom dimension
   */
  async createCustomDimension(dimension: CustomDimension) {
    try {
      const [customDimension] = await this.adminClient.createCustomDimension({
        parent: this.propertyPath,
        customDimension: {
          parameterName: dimension.parameterName,
          displayName: dimension.displayName,
          scope: dimension.scope,
          description: dimension.description || `Divine Income Engine: ${dimension.displayName}`
        }
      });

      return {
        success: true,
        name: customDimension.name,
        parameterName: customDimension.parameterName,
        displayName: customDimension.displayName,
        scope: customDimension.scope
      };
    } catch (error: any) {
      if (error.code === 6) { // ALREADY_EXISTS
        return {
          success: true,
          message: `Dimension '${dimension.parameterName}' already exists`,
          skipped: true
        };
      }
      throw new Error(`Failed to create dimension: ${error.message}`);
    }
  }

  // === UTILITY METHODS ===

  /**
   * Parse report response into a cleaner format
   */
  private parseReportResponse(response: any) {
    const rows = response.rows?.map((row: any) => {
      const dimensions: Record<string, string> = {};
      const metrics: Record<string, number> = {};

      row.dimensionValues?.forEach((value: any, index: number) => {
        const dimensionName = response.dimensionHeaders?.[index]?.name || `dimension_${index}`;
        dimensions[dimensionName] = value.value;
      });

      row.metricValues?.forEach((value: any, index: number) => {
        const metricName = response.metricHeaders?.[index]?.name || `metric_${index}`;
        metrics[metricName] = parseFloat(value.value) || 0;
      });

      return { dimensions, metrics };
    }) || [];

    return {
      rows,
      totalRows: response.rowCount,
      dimensionHeaders: response.dimensionHeaders?.map((h: any) => h.name) || [],
      metricHeaders: response.metricHeaders?.map((h: any) => h.name) || [],
      metadata: response.metadata
    };
  }

  /**
   * Parse realtime response into a cleaner format
   */
  private parseRealtimeResponse(response: any) {
    const rows = response.rows?.map((row: any) => {
      const dimensions: Record<string, string> = {};
      const metrics: Record<string, number> = {};

      row.dimensionValues?.forEach((value: any, index: number) => {
        const dimensionName = response.dimensionHeaders?.[index]?.name || `dimension_${index}`;
        dimensions[dimensionName] = value.value;
      });

      row.metricValues?.forEach((value: any, index: number) => {
        const metricName = response.metricHeaders?.[index]?.name || `metric_${index}`;
        metrics[metricName] = parseFloat(value.value) || 0;
      });

      return { dimensions, metrics };
    }) || [];

    return {
      rows,
      totalRows: response.rowCount,
      timestamp: new Date().toISOString(),
      totalActiveUsers: rows.reduce((sum: number, row: any) => sum + (row.metrics.activeUsers || 0), 0)
    };
  }

  /**
   * Get a summary of account configuration
   */
  async getAccountSummary() {
    try {
      const [conversions, dimensions] = await Promise.all([
        this.listConversions(),
        this.listCustomDimensions()
      ]);

      return {
        propertyId: this.config.propertyId,
        conversions: {
          count: conversions.length,
          events: conversions.map(c => c.eventName)
        },
        customDimensions: {
          count: dimensions.length,
          dimensions: dimensions.map(d => ({
            name: d.displayName,
            parameter: d.parameterName,
            scope: d.scope
          }))
        }
      };
    } catch (error) {
      throw new Error(`Failed to get account summary: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Export a singleton instance
export const ga4Client = new GA4Client({
  propertyId: process.env.GA_PROPERTY_ID || '',
  measurementId: process.env.GA_MEASUREMENT_ID,
  apiSecret: process.env.GA_API_SECRET
});