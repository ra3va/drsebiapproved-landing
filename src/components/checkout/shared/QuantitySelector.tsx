interface QuantitySelectorProps {
  quantity: number
  onUpdateQuantity: (newQuantity: number) => void
  compact?: boolean
  inline?: boolean
}

export function QuantitySelector({
  quantity,
  onUpdateQuantity,
  compact = false,
  inline = false
}: QuantitySelectorProps) {
  const handleDecrease = () => {
    if (quantity > 1) {
      onUpdateQuantity(quantity - 1)
    }
  }

  const handleIncrease = () => {
    onUpdateQuantity(quantity + 1)
  }

  if (compact && inline) {
    // Compact inline version for collapsed summary
    return (
      <div className="flex items-center gap-1">
        <span className="text-xs text-gray-600">Qty:</span>
        <button
          onClick={handleDecrease}
          disabled={quantity <= 1}
          className="w-5 h-5 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-xs"
        >
          −
        </button>
        <span className="text-xs font-medium w-4 text-center">{quantity}</span>
        <button
          onClick={handleIncrease}
          className="w-5 h-5 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50 text-xs"
        >
          +
        </button>
      </div>
    )
  }

  // Full version for expanded summary or Step 1
  return (
    <div className="flex items-center justify-between mb-3">
      <span className="text-sm font-medium text-gray-900">Quantity</span>
      <div className="flex items-center gap-3">
        <button
          onClick={handleDecrease}
          disabled={quantity <= 1}
          className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          −
        </button>
        <span className="text-base font-semibold w-8 text-center">{quantity}</span>
        <button
          onClick={handleIncrease}
          className="w-8 h-8 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
        >
          +
        </button>
      </div>
    </div>
  )
}
