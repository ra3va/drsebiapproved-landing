import { useState } from 'react'
import { CartItem, Product } from '../types'

const SHIPPING_COST = 595 // $5.95 in cents

export function useCart(initialProduct: Product) {
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: initialProduct.id,
      name: initialProduct.name,
      price: initialProduct.price,
      variationId: initialProduct.variationId,
      quantity: 1,
      image: initialProduct.image
    }
  ])

  // Update quantity for a specific item
  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    setCartItems(prev => prev.map(item =>
      item.id === itemId
        ? { ...item, quantity: newQuantity }
        : item
    ))
  }

  // Add product to cart (or increment quantity if exists)
  const addProduct = (product: Product) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id)
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  // Remove item from cart
  const removeItem = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId))
  }

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const totalQuantity = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const shippingCost = totalQuantity >= 2 ? 0 : SHIPPING_COST

  return {
    cartItems,
    updateQuantity,
    addProduct,
    removeItem,
    subtotal,
    totalQuantity,
    shippingCost
  }
}
