const { SquareClient, SquareEnvironment } = require('square');

// Initialize Square client
const client = new SquareClient({
  token: process.env.SQUARE_ACCESS_TOKEN || '',
  environment: process.env.SQUARE_ENVIRONMENT === 'production'
    ? SquareEnvironment.Production
    : SquareEnvironment.Sandbox,
});

// Export the configured client and individual APIs
export const squareClient = client;
export const catalogApi = client.catalog;
export const paymentsApi = client.payments;
export const ordersApi = client.orders;
export const customersApi = client.customers;

// Webhook verification utility
export const verifySquareWebhook = (
  signature: string,
  body: string,
  url: string
): boolean => {
  const { WebhooksHelper } = require('square');
  return WebhooksHelper.isValidWebhookEventSignature(
    body,
    signature,
    url,
    process.env.SQUARE_WEBHOOK_SIGNATURE_KEY || ''
  );
};

// Helper function to get environment info
export const getSquareEnvironment = () => {
  return {
    environment: process.env.SQUARE_ENVIRONMENT || 'sandbox',
    isProduction: process.env.SQUARE_ENVIRONMENT === 'production',
    applicationId: process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID,
    hasAccessToken: !!process.env.SQUARE_ACCESS_TOKEN
  };
};

// Helper function to validate Square configuration
export const validateSquareConfig = (): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (!process.env.SQUARE_ACCESS_TOKEN) {
    errors.push('Missing SQUARE_ACCESS_TOKEN');
  }

  if (!process.env.NEXT_PUBLIC_SQUARE_APPLICATION_ID) {
    errors.push('Missing NEXT_PUBLIC_SQUARE_APPLICATION_ID');
  }

  if (!process.env.SQUARE_ENVIRONMENT) {
    errors.push('Missing SQUARE_ENVIRONMENT');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};
