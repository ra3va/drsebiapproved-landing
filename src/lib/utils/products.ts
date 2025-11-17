// =====================================================
// Product Configuration & Utilities
// =====================================================

export const PRODUCTS = {
  paracleanse: {
    id: 'paracleanse',
    name: 'ParaCleanse Elite',
    price: 5999, // cents
    squareCatalogId: '5JV44RI47GC5IMYSENVXMV3D',
    description: 'Two-Phase Parasite Cleansing System',
    image: '/images/paracleanse.jpg',
    recommendedFrequency: 'every_90_days',
  },
  maya: {
    id: 'maya',
    name: 'Maya Formula',
    price: 4499,
    squareCatalogId: 'TWJMT4CUFNFNQKG3S5EQRPLO',
    description: '26 Herb Iron-Rich Formula',
    image: '/images/maya.jpg',
    recommendedFrequency: 'monthly',
  },
  seamoss: {
    id: 'seamoss',
    name: 'Sea Moss Capsules',
    price: 3199,
    squareCatalogId: 'YGDG42LYJKWH75NNW6HPWP5M',
    description: 'Honduran Wildcrafted Sea Moss',
    image: '/images/seamoss.jpg',
    recommendedFrequency: 'monthly',
  },
  'mucus-cleanser': {
    id: 'mucus-cleanser',
    name: 'Mucus Cleanser',
    price: 3199,
    squareCatalogId: '6JARPI34BXU27SS36ZFSEJQP',
    description: 'Respiratory & Cellular Cleansing',
    image: '/images/mucus-cleanser.jpg',
    recommendedFrequency: 'every_60_days',
  },
} as const;

export type ProductId = keyof typeof PRODUCTS;

export function getProduct(productId: string) {
  return PRODUCTS[productId as ProductId];
}

export function getProductByCatalogId(catalogId: string) {
  return Object.values(PRODUCTS).find(p => p.squareCatalogId === catalogId);
}

export function formatPrice(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

export function getAllProducts() {
  return Object.values(PRODUCTS);
}
