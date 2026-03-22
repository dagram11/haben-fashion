'use client'

import { useState, useCallback } from 'react'
import { X, Check, CreditCard, Truck, Shield } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useCartStore } from '@/store/cart'

function CheckoutModalContent() {
  const [step, setStep] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const items = useCartStore((state) => state.items)
  const getTotal = useCartStore((state) => state.getTotal)
  const clearCart = useCartStore((state) => state.clearCart)
  const closeCheckout = useCartStore((state) => state.closeCheckout)
  const total = getTotal()

  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  })

  const handleSubmit = useCallback(async () => {
    setIsProcessing(true)
    // Simulate processing
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsProcessing(false)
    setIsComplete(true)
    clearCart()
  }, [clearCart])

  return (
    <div className="relative z-10 w-full max-w-2xl mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div>
          <h2 className="text-2xl font-bold text-black">Checkout</h2>
          <p className="text-gray-500 mt-1">Complete your order</p>
        </div>
        <button
          onClick={closeCheckout}
          className="p-2 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5 text-gray-500" />
        </button>
      </div>

      {/* Content */}
      {isComplete ? (
        <div className="p-12 text-center">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-8 h-8 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-black mb-2">Order Placed!</h3>
          <p className="text-gray-500 mb-8">
            Thank you for your purchase.
          </p>
          <Button
            onClick={closeCheckout}
            className="rounded-xl bg-black text-white hover:bg-gray-800 px-8"
          >
            Continue Shopping
          </Button>
        </div>
      ) : (
        <div className="p-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-center gap-2 sm:gap-4 mb-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex items-center gap-1 sm:gap-2">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= s ? 'bg-black text-white' : 'bg-gray-100 text-gray-400'
                  }`}
                >
                  {s}
                </div>
                <span className={`text-sm hidden sm:inline ${step >= s ? 'text-black' : 'text-gray-400'}`}>
                  {s === 1 ? 'Shipping' : s === 2 ? 'Payment' : 'Review'}
                </span>
                {s < 3 && <div className="w-6 sm:w-8 h-px bg-gray-200 mx-1 sm:mx-2" />}
              </div>
            ))}
          </div>

          {/* Step 1: Shipping */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">First Name</label>
                  <Input
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="bg-gray-50 border-gray-200 rounded-xl"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Last Name</label>
                  <Input
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="bg-gray-50 border-gray-200 rounded-xl"
                    placeholder="Doe"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Email</label>
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-gray-50 border-gray-200 rounded-xl"
                  placeholder="john@example.com"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Address</label>
                <Input
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="bg-gray-50 border-gray-200 rounded-xl"
                  placeholder="123 Main Street"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">City</label>
                  <Input
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="bg-gray-50 border-gray-200 rounded-xl"
                    placeholder="New York"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">State</label>
                  <Input
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="bg-gray-50 border-gray-200 rounded-xl"
                    placeholder="NY"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">ZIP Code</label>
                  <Input
                    value={formData.zip}
                    onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                    className="bg-gray-50 border-gray-200 rounded-xl"
                    placeholder="10001"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Country</label>
                  <Input
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="bg-gray-50 border-gray-200 rounded-xl"
                    placeholder="United States"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl mb-6 border border-gray-200">
                <CreditCard className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-600">Card payment</span>
              </div>
              <div>
                <label className="block text-sm text-gray-600 mb-1">Card Number</label>
                <Input
                  value={formData.cardNumber}
                  onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                  className="bg-gray-50 border-gray-200 rounded-xl"
                  placeholder="4242 4242 4242 4242"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-600 mb-1">Expiry Date</label>
                  <Input
                    value={formData.expiry}
                    onChange={(e) => setFormData({ ...formData, expiry: e.target.value })}
                    className="bg-gray-50 border-gray-200 rounded-xl"
                    placeholder="MM/YY"
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-600 mb-1">CVV</label>
                  <Input
                    value={formData.cvv}
                    onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                    className="bg-gray-50 border-gray-200 rounded-xl"
                    placeholder="123"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-4">
                <Shield className="w-4 h-4" />
                <span>Your payment is secure</span>
              </div>
            </div>
          )}

          {/* Step 3: Review */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <Truck className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-500">Shipping to</span>
                </div>
                <p className="text-black font-medium">
                  {formData.firstName} {formData.lastName}
                </p>
                <p className="text-gray-500 text-sm">
                  {formData.address}, {formData.city}, {formData.state} {formData.zip}
                </p>
              </div>

              <div>
                <h4 className="text-sm text-gray-500 mb-3">Order Summary</h4>
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={`${item.productId}-${item.size}-${item.color}`} className="flex items-center gap-4">
                      <div className="w-16 h-20 rounded-lg overflow-hidden bg-gray-100">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-black">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.size} / {item.color} × {item.quantity}
                        </p>
                      </div>
                      <p className="font-medium text-black">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Subtotal</span>
                  <span className="text-black">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500">Shipping</span>
                  <span className="text-black">Free</span>
                </div>
                <div className="flex justify-between text-lg font-bold mt-4">
                  <span className="text-black">Total</span>
                  <span className="text-black">${total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-8">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                className="flex-1 rounded-xl border-gray-300"
                disabled={isProcessing}
              >
                Back
              </Button>
            )}
            <Button
              onClick={() => {
                if (step < 3) {
                  setStep(step + 1)
                } else {
                  handleSubmit()
                }
              }}
              className="flex-1 rounded-xl bg-black text-white hover:bg-gray-800"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </span>
              ) : step === 3 ? (
                'Place Order'
              ) : (
                'Continue'
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export function CheckoutModal() {
  const isCheckoutOpen = useCartStore((state) => state.isCheckoutOpen)
  const closeCheckout = useCartStore((state) => state.closeCheckout)

  if (!isCheckoutOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={closeCheckout} />
      
      {/* Use key to reset state when modal opens */}
      <CheckoutModalContent key="checkout" />
    </div>
  )
}
