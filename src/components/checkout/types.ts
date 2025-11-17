// Shared TypeScript types for checkout system

export interface CartItem {
  id: string
  name: string
  price: number // in cents
  variationId: string
  quantity: number
  image?: string
}

export interface CustomerDetails {
  email: string
  name: string
  phone?: string
  address: {
    addressLine1: string
    locality: string // city
    administrativeDistrictLevel1: string // state
    postalCode: string
    country: string
  }
}

export interface CheckoutProps {
  productName: string
  price: number // in cents
  variationId: string
  productImage?: string
  productId: string
  onSuccess?: () => void
}

export interface Product {
  id: string
  name: string
  price: number
  variationId: string
  image?: string
}

export interface CheckoutStep {
  number: number
  title: string
  label: string
}

export interface OrderSummaryProps {
  cartItems: CartItem[]
  subtotal: number
  shippingCost: number
  discount: number
  total: number
  collapsed?: boolean
  showQuantityInline?: boolean
  onUpdateQuantity?: (itemId: string, quantity: number) => void
  onRemoveItem?: (itemId: string) => void
}

export interface UpsellProduct {
  id: string
  name: string
  price: number
  variationId: string
  image?: string
}
