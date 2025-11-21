import { UpsellProduct } from '../types'

interface UpsellSectionProps {
  currentProductId: string
  totalQuantity: number
  onAddProduct: (product: UpsellProduct) => void
  position: 'step1' | 'step2'
}

const UPSELL_PRODUCTS: Record<string, UpsellProduct> = {
  'maya': {
    id: 'maya',
    name: 'Maya Formula',
    price: 4499,
    variationId: 'TWJMT4CUFNFNQKG3S5EQRPLO',
    image: '/maya.png'
  },
  'seamoss': {
    id: 'seamoss',
    name: 'Sea Moss Capsules',
    price: 3199,
    variationId: 'YGDG42LYJKWH75NNW6HPWP5M',
    image: '/seamoss.png'
  },
  'mucus-cleanser': {
    id: 'mucus-cleanser',
    name: 'Mucus Cleanser',
    price: 3199,
    variationId: '6JARPI34BXU27SS36ZFSEJQP',
    image: '/mucus.png'
  }
}

export function UpsellSection({
  currentProductId,
  totalQuantity,
  onAddProduct,
  position
}: UpsellSectionProps) {
  // Get products to show (exclude current product)
  const productsToShow = Object.values(UPSELL_PRODUCTS).filter(
    p => p.id !== currentProductId
  )

  // Step 1 version - with quantity selector and shipping incentive
  if (position === 'step1') {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-4 mb-3 shadow-sm">
        {/* Free Shipping Incentive */}
        {totalQuantity < 2 && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-xs font-semibold text-amber-900 mb-2">
              🚚 Add 1 more item for FREE shipping (Save $5.95!)
            </p>
            <div className="space-y-2">
              {productsToShow.map((product) => (
                <button
                  key={product.id}
                  onClick={() => onAddProduct(product)}
                  className="w-full flex items-center justify-between p-2 bg-white border border-gray-200 rounded-lg hover:border-primary transition-colors text-left"
                >
                  <span className="text-xs font-medium text-gray-900">+ Add {product.name}</span>
                  <span className="text-xs font-semibold text-primary">${(product.price / 100).toFixed(2)}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Free Shipping Achieved */}
        {totalQuantity >= 2 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-xs font-semibold text-green-900 flex items-center gap-2">
              <span>✓</span>
              <span>You've unlocked FREE shipping!</span>
            </p>
          </div>
        )}
      </div>
    )
  }

  // Step 2 version - more subtle, below shipping form
  return (
    <div className="mt-4">
      <div className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">
          🎁 Complete Your Wellness Journey
        </h3>
        <p className="text-xs text-gray-600 mb-3">
          Customers who bought this also added:
        </p>
        <div className="grid grid-cols-2 gap-2">
          {productsToShow.slice(0, 2).map((product) => (
            <button
              key={product.id}
              onClick={() => onAddProduct(product)}
              className="flex flex-col items-center p-3 bg-white border border-gray-200 rounded-lg hover:border-primary hover:shadow-md transition-all text-center"
            >
              {product.image && (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-16 h-16 object-contain mb-2"
                />
              )}
              <span className="text-xs font-medium text-gray-900 mb-1">{product.name}</span>
              <span className="text-sm font-bold text-primary">${(product.price / 100).toFixed(2)}</span>
              <span className="text-xs text-green-600 mt-1">+ Add to Order</span>
            </button>
          ))}
        </div>
        {totalQuantity < 2 && (
          <p className="text-xs text-center text-green-600 font-medium mt-3">
            💚 Add any product for FREE shipping!
          </p>
        )}
      </div>
    </div>
  )
}
