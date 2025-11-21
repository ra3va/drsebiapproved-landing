import { useState } from 'react'
import { ChevronDown, ChevronUp, CheckCircle } from 'lucide-react'
import { QuantitySelector } from './QuantitySelector'
import { OrderSummaryProps } from '../types'

export function OrderSummary({
  cartItems,
  subtotal,
  shippingCost,
  discount,
  total,
  collapsed = false,
  showQuantityInline = false,
  onUpdateQuantity,
  onRemoveItem
}: OrderSummaryProps) {
  const [summaryExpanded, setSummaryExpanded] = useState(!collapsed)
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const mainProduct = cartItems[0]

  // Get product features based on product name
  const getProductFeatures = (productName: string) => {
    const features: Record<string, string[]> = {
      'ParaCleanse Elite': [
        'Phase 1: ParaWash Biofilm Disruptor',
        'Phase 2: Intracellular Body Cleanse',
        '14-Day Supply (Full Treatment)',
        'Detailed Instructions & Protocol'
      ],
      'Maya Formula': [
        '26 Wildcrafted Herbs',
        'Iron-Rich Blood Support',
        'Brain & Nervous System',
        '8 fl oz Liquid Formula'
      ],
      'Sea Moss Capsules': [
        '92 Essential Minerals',
        'Thyroid Support',
        'Immune System Boost',
        '40 Capsules'
      ],
      'Mucus Cleanser': [
        'Eliminates Excess Mucus',
        'Respiratory Support',
        'Cellular Detoxification',
        '30 Capsules'
      ]
    }
    return features[productName] || []
  }

  return (
    <div className="mb-3">
      <button
        onClick={() => setSummaryExpanded(!summaryExpanded)}
        className="w-full bg-white border border-gray-200 rounded-lg p-3 shadow-sm hover:bg-gray-50 transition-colors"
      >
        <div className="flex gap-3 items-start">
          {/* Product Image(s) */}
          <div className="flex-shrink-0">
            {cartItems.length === 1 ? (
              <div className="w-14 h-14 bg-gray-50 rounded-lg overflow-hidden">
                {cartItems[0].image && (
                  <img
                    src={cartItems[0].image}
                    alt={cartItems[0].name}
                    className="w-full h-full object-contain p-1"
                  />
                )}
              </div>
            ) : (
              <div className="relative w-14 h-14">
                <div className="absolute top-0 left-0 w-12 h-12 bg-gray-50 rounded-lg overflow-hidden border-2 border-white shadow-sm">
                  {cartItems[0].image && (
                    <img
                      src={cartItems[0].image}
                      alt={cartItems[0].name}
                      className="w-full h-full object-contain p-0.5"
                    />
                  )}
                </div>
                <div className="absolute bottom-0 right-0 w-12 h-12 bg-gray-50 rounded-lg overflow-hidden border-2 border-white shadow-sm">
                  {cartItems[1]?.image && (
                    <img
                      src={cartItems[1].image}
                      alt={cartItems[1].name}
                      className="w-full h-full object-contain p-0.5"
                    />
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Order Info */}
          <div className="flex-1 min-w-0 text-left">
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {cartItems.length === 1
                    ? cartItems[0].name
                    : `${cartItems.length} Products`
                  }
                </p>
                {showQuantityInline && onUpdateQuantity && cartItems.length === 1 && (
                  <QuantitySelector
                    quantity={mainProduct.quantity}
                    onUpdateQuantity={(qty) => onUpdateQuantity(mainProduct.id, qty)}
                    compact
                    inline
                  />
                )}
              </div>
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {summaryExpanded ? 'Hide' : 'Show'} details
              </span>
            </div>

            <div className="space-y-0.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal ({totalQuantity} {totalQuantity === 1 ? 'item' : 'items'})</span>
                <span>${(subtotal / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping</span>
                {shippingCost === 0 ? (
                  <span className="text-green-600 font-medium">FREE</span>
                ) : (
                  <span>${(shippingCost / 100).toFixed(2)}</span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-200">
              <span className="text-sm font-semibold text-gray-900">Total</span>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-gray-900">
                  ${(total / 100).toFixed(2)}
                </span>
                {summaryExpanded ? (
                  <ChevronUp className="w-4 h-4 text-gray-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>
          </div>
        </div>
      </button>

      {summaryExpanded && (
        <div className="mt-2 bg-white border border-gray-200 rounded-lg p-4 shadow-sm animate-in slide-in-from-top-2 duration-200">
          {/* Cart Items */}
          <div className="mb-4 pb-4 border-b border-gray-200 space-y-3">
            {cartItems.map((item) => (
              <div key={item.id} className="flex gap-3">
                {item.image && (
                  <div className="relative w-16 h-16 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain p-1"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm">{item.name}</h3>
                  <p className="text-xs text-gray-600 mt-0.5">
                    Qty: {item.quantity} × ${(item.price / 100).toFixed(2)}
                  </p>
                  <p className="text-sm font-medium text-gray-900 mt-1">
                    ${((item.price * item.quantity) / 100).toFixed(2)}
                  </p>
                </div>
                {cartItems.length > 1 && onRemoveItem && (
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="text-red-600 hover:text-red-700 text-xs"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* What's Included - Only show for single product */}
          {cartItems.length === 1 && (
            <div className="mb-4 pb-4 border-b border-gray-200">
              <h4 className="text-xs font-semibold text-gray-700 mb-2">What's Included:</h4>
              <ul className="space-y-1.5">
                {getProductFeatures(mainProduct.name).map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-xs text-gray-600">
                    <span className="text-green-600 mt-0.5">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Price Breakdown */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${(subtotal / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              {shippingCost === 0 ? (
                <>
                  <span className="text-green-600">Shipping</span>
                  <span className="font-medium text-green-600">FREE</span>
                </>
              ) : (
                <>
                  <span className="text-gray-600">Shipping</span>
                  <span className="text-gray-600">${(shippingCost / 100).toFixed(2)}</span>
                </>
              )}
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-${(discount / 100).toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-base font-bold text-gray-900 pt-2 border-t">
              <span>Total</span>
              <span>${(total / 100).toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
