interface PaymentFormProps {
  subtotal: number
  shippingCost: number
  discount: number
  total: number
  totalQuantity: number
  couponCode: string
  setCouponCode: (value: string) => void
  verifyingCoupon: boolean
  onVerifyCoupon: () => void
}

export function PaymentForm({
  subtotal,
  shippingCost,
  discount,
  total,
  totalQuantity,
  couponCode,
  setCouponCode,
  verifyingCoupon,
  onVerifyCoupon
}: PaymentFormProps) {
  return (
    <div className="space-y-3.5">
      <div>
        <h3 className="text-base font-bold text-gray-900 mb-0.5">Payment Details</h3>
        <p className="text-xs text-gray-600">Complete your secure checkout</p>
      </div>

      {/* Order Review - Compact */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-3">
        <div className="space-y-1.5 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600">Subtotal ({totalQuantity} {totalQuantity === 1 ? 'item' : 'items'})</span>
            <span className="font-medium">${(subtotal / 100).toFixed(2)}</span>
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
                <span className="font-medium">${(shippingCost / 100).toFixed(2)}</span>
              </>
            )}
          </div>
          {discount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span className="font-medium">-${(discount / 100).toFixed(2)}</span>
            </div>
          )}
          <div className="flex justify-between text-base font-bold text-gray-900 pt-1.5 border-t border-gray-300">
            <span>Total</span>
            <span>${(total / 100).toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Coupon Code */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Coupon Code (Optional)
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
            placeholder="Enter code"
            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent text-base"
          />
          <button
            onClick={onVerifyCoupon}
            disabled={verifyingCoupon || !couponCode.trim()}
            className={`px-5 py-3 rounded-lg font-semibold transition-all text-sm whitespace-nowrap ${
              verifyingCoupon || !couponCode.trim()
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-primary hover:bg-primary/90 text-white'
            }`}
          >
            {verifyingCoupon ? '...' : 'Apply'}
          </button>
        </div>
        {discount > 0 && (
          <p className="mt-2 text-sm text-green-600 font-medium">
            ✓ Coupon applied successfully!
          </p>
        )}
      </div>

      {/* Card Form */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Card Information *
        </label>
        <div id="card-container" className="border border-gray-300 rounded-lg p-3"></div>

        {/* Payment Method Icons */}
        <div className="flex items-center justify-center gap-2 mt-2">
          <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
            <span>We accept:</span>
          </div>
          <div className="flex items-center gap-1.5">
            {/* Visa */}
            <div className="w-8 h-5 bg-white border border-gray-200 rounded flex items-center justify-center">
              <svg className="w-6 h-4" viewBox="0 0 48 32" fill="none">
                <rect width="48" height="32" rx="4" fill="white"/>
                <path d="M20.5 11h-3.2l-2 10h3.2l2-10zm8.4 6.5l1.7-4.7 1 4.7h-2.7zm3.6 3.5h3l-2.6-10h-2.7c-.6 0-1.1.4-1.3.9l-4.6 9.1h3.4l.7-1.9h4.1v1.9zm-9.3-7.1c0-2.6-3.6-2.8-3.6-4 0-.4.4-.8 1.2-.9.4 0 1.5-.1 2.8.5l.5-2.3c-.7-.2-1.6-.5-2.7-.5-2.9 0-4.9 1.5-4.9 3.7 0 1.6 1.4 2.5 2.5 3 1.1.6 1.5.9 1.5 1.4 0 .8-.9 1.1-1.8 1.1-1.5 0-2.3-.2-3.5-.8l-.5 2.4c.8.4 2.3.7 3.8.7 3.1 0 5.1-1.5 5.1-3.8z" fill="#1434CB"/>
              </svg>
            </div>
            {/* Mastercard */}
            <div className="w-8 h-5 bg-white border border-gray-200 rounded flex items-center justify-center">
              <svg className="w-6 h-4" viewBox="0 0 48 32" fill="none">
                <rect width="48" height="32" rx="4" fill="white"/>
                <circle cx="18" cy="16" r="7" fill="#EB001B"/>
                <circle cx="30" cy="16" r="7" fill="#F79E1B"/>
                <path d="M24 11.5c-1.3 1.2-2 2.9-2 4.5s.7 3.3 2 4.5c1.3-1.2 2-2.9 2-4.5s-.7-3.3-2-4.5z" fill="#FF5F00"/>
              </svg>
            </div>
            {/* Amex */}
            <div className="w-8 h-5 bg-white border border-gray-200 rounded flex items-center justify-center">
              <svg className="w-6 h-4" viewBox="0 0 48 32" fill="none">
                <rect width="48" height="32" rx="4" fill="#006FCF"/>
                <path d="M15 13h-2.5l-.6 1.5-.6-1.5H8.8l1.5 3.5-1.5 3.5h2.5l.6-1.5.6 1.5h2.5l-1.5-3.5L15 13zm4.5 0h-3v7h3v-2h2v-1.5h-2v-1h2V14h-2v-1zm7 0h-4v7h4v-1.5h-2v-1h2v-1.5h-2v-1h2V13zm5 0l-1 2.5-1-2.5h-2.5l2 3.5-2 3.5h2.5l1-2.5 1 2.5H34l-2-3.5 2-3.5h-2.5z" fill="white"/>
              </svg>
            </div>
            {/* Discover */}
            <div className="w-8 h-5 bg-white border border-gray-200 rounded flex items-center justify-center">
              <svg className="w-6 h-4" viewBox="0 0 48 32" fill="none">
                <rect width="48" height="32" rx="4" fill="#FF6000"/>
                <circle cx="38" cy="16" r="8" fill="#F79E1B"/>
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-3">
        <div className="flex items-center gap-2 text-xs text-blue-900">
          <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
          </svg>
          <span className="font-medium">Join 1,200+ happy customers who trust Dr. Sebi's formulas</span>
        </div>
      </div>

      {/* Trust Badges - Minimal */}
      <div className="flex items-center justify-center gap-3 text-[10px] text-gray-500 py-1">
        <span>🔒 256-bit SSL Encrypted</span>
        <span>•</span>
        <span>✓ 30-Day Money Back</span>
      </div>
    </div>
  )
}
