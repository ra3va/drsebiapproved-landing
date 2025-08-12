import { GraphQLClient } from 'graphql-request';

// Ensure we have the full URL with protocol
const storeDomain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN?.includes('myshopify.com') 
  ? `https://${process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN}`
  : process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN;

const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;

// Extract just the hostname for the API endpoint
const apiDomain = storeDomain?.replace(/^https?:\/\//, '');

interface ShopifyResponse {
  product: {
    variants: {
      edges: Array<{
        node: {
          id: string;
        };
      }>;
    };
  };
}

interface CartResponse {
  cartCreate: {
    cart: {
      id: string;
      checkoutUrl: string;
    };
  };
}

interface CartInput {
  attributes?: Array<{
    key: string;
    value: string;
  }>;
}

interface CartLineResponse {
  cartLinesAdd: {
    cart: {
      checkoutUrl: string;
    };
  };
}

// Initialize the GraphQL client with the proper URL
const shopifyClient = new GraphQLClient(
  `${storeDomain}/api/2024-01/graphql.json`,
  {
    headers: {
      'X-Shopify-Storefront-Access-Token': process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || '',
      'Content-Type': 'application/json',
    },
  }
);

// Helper function to convert product ID to Shopify's Global ID format
const getGlobalId = (productId: string): string => {
  // If it's already a global ID (base64 encoded), return as is
  if (productId.includes('gid://')) {
    return productId;
  }
  // Convert to Shopify's Global ID format
  return Buffer.from(`gid://shopify/Product/${productId}`).toString('base64');
};

export const getVariantId = async (productId: string): Promise<string> => {
  try {
    const globalId = getGlobalId(productId);
    const query = `
      query getVariantId($productId: ID!) {
        product(id: $productId) {
          variants(first: 1) {
            edges {
              node {
                id
              }
            }
          }
        }
      }
    `;

    const variables = { productId: globalId };
    const response = await shopifyClient.request<ShopifyResponse>(query, variables);
    return response.product.variants.edges[0].node.id;
  } catch (error) {
    console.error('Error fetching variant ID:', error);
    throw error;
  }
};

export const createCart = async () => {
  try {
    const mutation = `
      mutation createCart($input: CartInput) {
        cartCreate(input: $input) {
          cart {
            id
            checkoutUrl
          }
        }
      }
    `;

    const variables = {
      input: {
        attributes: [
          {
            key: "source",
            value: "landing_page"
          },
          {
            key: "campaign",
            value: "paracleanse_elite"
          },
          {
            key: "timestamp",
            value: new Date().toISOString()
          }
        ]
      }
    };

    const response = await shopifyClient.request<CartResponse>(mutation, variables);
    return response.cartCreate.cart;
  } catch (error) {
    console.error('Error creating cart:', error);
    throw error;
  }
};

export const addToCart = async (cartId: string, variantId: string, quantity: number) => {
  try {
    const mutation = `
      mutation addToCart($cartId: ID!, $lines: [CartLineInput!]!) {
        cartLinesAdd(cartId: $cartId, lines: $lines) {
          cart {
            checkoutUrl
          }
        }
      }
    `;

    const variables = {
      cartId,
      lines: [
        {
          merchandiseId: variantId,
          quantity,
        },
      ],
    };

    const response = await shopifyClient.request<CartLineResponse>(mutation, variables);
    
    // Add UTM parameters to track landing page source
    const checkoutUrl = new URL(response.cartLinesAdd.cart.checkoutUrl);
    checkoutUrl.searchParams.set('utm_source', 'landing_page');
    checkoutUrl.searchParams.set('utm_medium', 'website');
    checkoutUrl.searchParams.set('utm_campaign', 'paracleanse_elite');
    checkoutUrl.searchParams.set('utm_content', 'buy_button');
    
    return checkoutUrl.toString();
  } catch (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
};

export const initiateCheckout = async (productId: string, quantity: number) => {
  try {
    const variantId = await getVariantId(productId);
    const cart = await createCart();
    return await addToCart(cart.id, variantId, quantity);
  } catch (error) {
    console.error('Error during checkout:', error);
    throw error;
  }
}; 