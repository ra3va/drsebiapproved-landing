'use client'

import { ChevronLeft } from 'lucide-react'
import { useCart } from '../hooks/useCart'
import { useCheckoutFlow } from '../hooks/useCheckoutFlow'
import { useSquarePayment } from '../hooks/useSquarePayment'
import { CheckoutProps, CheckoutStep } from '../types'
import { OrderSummary } from '../shared/OrderSummary'
import { ProgressIndicator } from '../shared/ProgressIndicator'
import { SocialProof } from '../shared/SocialProof'
import { UpsellSection } from '../shared/UpsellSection'
import { ContactForm } from '../shared/ContactForm'
import { ShippingForm } from '../shared/ShippingForm'
import { PaymentForm } from '../shared/PaymentForm'

const STEPS: CheckoutStep[] = [
  { number: 1, title: 'Contact', label: 'Contact Info' },
  { number: 2, title: 'Shipping', label: 'Shipping Address' },
  { number: 3, title: 'Payment', label: 'Payment & Review' }
]

/**
 * CheckoutV2 - Optimized Flow
 * - Quantity selector inline in collapsed order summary (always visible)
 * - Clean Step 1 (only contact form + social proof)
 * - Upsells moved to Step 2 (after email capture)
 * - Less cognitive load upfront
 */
export default function CheckoutV2({
  productName,
  price,
  variationId,
  productImage,
  productId,
  onSuccess
}: CheckoutProps) {
  // Cart management
  const {
    cartItems,
    updateQuantity,
    addProduct,
    removeItem,
    subtotal,
    totalQuantity,
    shippingCost
  } = useCart({
    id: productId,
    name: productName,
    price,
    variationId,
    image: productImage
  })

  // Checkout flow (steps, validation, form state)
  const {
    currentStep,
    error,
    setError,
    formRef,
    goToNextStep,
    goToPreviousStep,
    getCustomerDetails,
    email,
    setEmail,
    fullName,
    setFullName,
    phone,
    setPhone,
    address,
    setAddress,
    city,
    setCity,
    state,
    setState,
    zipCode,
    setZipCode
  } = useCheckoutFlow()

  // Square payment (SDK initialization, payment processing)
  const {
    cardInitialized,
    isLoading,
    error: paymentError,
    setError: setPaymentError,
    couponCode,
    setCouponCode,
    discount,
    verifyingCoupon,
    verifyCoupon,
    processPayment
  } = useSquarePayment(currentStep)

  // Calculate final total
  const finalTotal = subtotal + shippingCost - discount

  // Handle payment submission
  const handlePayment = async () => {
    await processPayment(
      cartItems,
      finalTotal,
      shippingCost,
      getCustomerDetails(),
      onSuccess
    )
  }

  // Combine errors
  const displayError = error || paymentError

  return (
    <div ref={formRef} className="max-w-full overflow-hidden">
      {/* Optimized Order Summary - Quantity Always Visible */}
      <OrderSummary
        cartItems={cartItems}
        subtotal={subtotal}
        shippingCost={shippingCost}
        discount={discount}
        total={finalTotal}
        collapsed={true}
        showQuantityInline={true} // KEY DIFFERENCE: Quantity visible in collapsed view
        onUpdateQuantity={updateQuantity}
        onRemoveItem={removeItem}
      />

      {/* Progress Indicator */}
      <ProgressIndicator currentStep={currentStep} steps={STEPS} />

      {/* Step 1: Clean Contact Form - NO QUANTITY/UPSELLS */}
      {currentStep === 1 && (
        <SocialProof />
      )}

      {/* Form Container */}
      <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-lg">
        {/* Step 1: Contact Information ONLY */}
        {currentStep === 1 && (
          <ContactForm
            email={email}
            setEmail={setEmail}
            fullName={fullName}
            setFullName={setFullName}
            phone={phone}
            setPhone={setPhone}
          />
        )}

        {/* Step 2: Shipping Address + Upsells */}
        {currentStep === 2 && (
          <>
            <ShippingForm
              address={address}
              setAddress={setAddress}
              city={city}
              setCity={setCity}
              state={state}
              setState={setState}
              zipCode={zipCode}
              setZipCode={setZipCode}
            />

            {/* KEY DIFFERENCE: Upsells in Step 2 */}
            <UpsellSection
              currentProductId={productId}
              totalQuantity={totalQuantity}
              onAddProduct={addProduct}
              position="step2"
            />
          </>
        )}

        {/* Step 3: Payment */}
        {currentStep === 3 && (
          <PaymentForm
            subtotal={subtotal}
            shippingCost={shippingCost}
            discount={discount}
            total={finalTotal}
            totalQuantity={totalQuantity}
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            verifyingCoupon={verifyingCoupon}
            onVerifyCoupon={() => verifyCoupon(subtotal)}
          />
        )}

        {/* Error Message */}
        {displayError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {displayError}
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="mt-5 flex gap-2.5">
          {currentStep > 1 && (
            <button
              onClick={goToPreviousStep}
              className="flex items-center justify-center gap-1.5 px-5 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-all text-sm"
            >
              <ChevronLeft className="w-4 h-4" />
              Back
            </button>
          )}

          {currentStep < 3 ? (
            <button
              onClick={goToNextStep}
              className="flex-1 py-3 bg-primary hover:bg-primary/90 text-white rounded-lg font-semibold transition-all text-base shadow-lg"
            >
              Continue to {STEPS[currentStep].title}
            </button>
          ) : (
            <div className="flex-1">
              <div className="bg-green-50 border border-green-200 rounded-lg p-2 mb-2 flex items-center justify-center gap-2">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span className="text-xs font-semibold text-green-900">Protected by 30-Day Money Back Guarantee</span>
              </div>
              <button
                onClick={handlePayment}
                disabled={isLoading || !cardInitialized}
                className={`w-full py-3.5 rounded-lg font-semibold transition-all text-base shadow-lg ${
                  isLoading || !cardInitialized
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {isLoading ? 'Processing...' : `Complete Order • $${(finalTotal / 100).toFixed(2)}`}
              </button>
            </div>
          )}
        </div>

        {currentStep === 3 && (
          <p className="mt-2.5 text-[10px] text-center text-gray-500">
            🔒 Secure payment powered by Square
          </p>
        )}
      </div>
    </div>
  )
}
