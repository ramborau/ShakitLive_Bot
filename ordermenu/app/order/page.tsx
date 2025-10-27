'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PhoneInput } from '@/components/ui/phone-input'
import { QuantitySpinner } from '@/components/ui/quantity-spinner'
import { ShoppingCart, ArrowRight, ChevronLeft, Sparkles } from 'lucide-react'
import { getMenuImage } from '@/lib/menu-images'
import Image from 'next/image'

interface MenuItem {
  id: number
  name: string
  description: string
  price: string
  category: string
}

interface CartItem {
  item: MenuItem
  quantity: number
}

interface OrderData {
  cart: CartItem[]
  name: string
  phone: string
  address: string
  notes: string
}

export default function OrderPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [step, setStep] = useState(1)
  const [orderData, setOrderData] = useState<OrderData>({
    cart: [],
    name: '',
    phone: '',
    address: '',
    notes: ''
  })

  useEffect(() => {
    fetch('/menu.json')
      .then(res => res.json())
      .then(data => setMenuItems(data))
      .catch(err => console.error('Error loading menu:', err))
  }, [])

  const pizzaItems = menuItems.filter(item => item.category === 'Pizza').slice(0, 12)
  const drinkItems = menuItems.filter(item => item.category === 'Drinks').slice(0, 10)
  const dessertItems = menuItems.filter(item => item.category === 'Desserts')

  const addToCart = (item: MenuItem) => {
    const existing = orderData.cart.find(ci => ci.item.id === item.id)
    if (existing) {
      setOrderData(prev => ({
        ...prev,
        cart: prev.cart.map(ci =>
          ci.item.id === item.id ? { ...ci, quantity: ci.quantity + 1 } : ci
        )
      }))
    } else {
      setOrderData(prev => ({
        ...prev,
        cart: [...prev.cart, { item, quantity: 1 }]
      }))
    }
  }

  const updateQuantity = (itemId: number, quantity: number) => {
    if (quantity === 0) {
      setOrderData(prev => ({
        ...prev,
        cart: prev.cart.filter(ci => ci.item.id !== itemId)
      }))
    } else {
      setOrderData(prev => ({
        ...prev,
        cart: prev.cart.map(ci =>
          ci.item.id === itemId ? { ...ci, quantity } : ci
        )
      }))
    }
  }

  const getItemQuantity = (itemId: number) => {
    return orderData.cart.find(ci => ci.item.id === itemId)?.quantity || 0
  }

  const handleNext = () => {
    if (step < 4) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSkip = () => {
    if (step < 4) setStep(step + 1)
  }

  const handleSubmit = async () => {
    const webhookUrl = process.env.NEXT_PUBLIC_WEBHOOK_URL
    const payload = {
      type: 'order',
      data: orderData,
      timestamp: new Date().toISOString()
    }

    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        })
      } catch (error) {
        console.error('Webhook error:', error)
      }
    }

    if (typeof window !== 'undefined') {
      window.close()
    }
  }

  const getStepTitle = () => {
    switch (step) {
      case 1: return 'Select Pizza'
      case 2: return 'Select Drink'
      case 3: return 'Select Dessert'
      case 4: return 'Delivery Details'
      default: return ''
    }
  }

  const canProceed = () => {
    if (step === 4) {
      return orderData.name && orderData.phone && orderData.address && orderData.cart.length > 0
    }
    return true // Can skip other steps
  }

  const getTotalItems = () => {
    return orderData.cart.reduce((sum, item) => sum + item.quantity, 0)
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-primary to-red-600 text-white shadow-xl">
        <div className="px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {step > 1 && (
                <button onClick={handleBack} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}
              <div>
                <h1 className="text-xl font-bold">{getStepTitle()}</h1>
                <p className="text-sm opacity-90">Step {step} of 4</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-white/20 px-3 py-1 rounded-full flex items-center gap-2">
                <ShoppingCart className="w-5 h-5" />
                <span className="font-bold">{getTotalItems()}</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-1 mt-4">
            {[1, 2, 3, 4].map(s => (
              <div
                key={s}
                className={`h-1 rounded-full flex-1 transition-all ${
                  s <= step ? 'bg-secondary' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-32 px-4 py-6">
        {/* Step 1: Pizza Selection */}
        {step === 1 && (
          <div className="space-y-3">
            {pizzaItems.map((item, index) => {
              const quantity = getItemQuantity(item.id)
              return (
                <Card
                  key={item.id}
                  className="overflow-hidden shadow-md hover:shadow-lg transition-all slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CardContent className="p-0">
                    <div className="flex gap-3">
                      <div className="w-24 h-24 relative flex-shrink-0 bg-gray-100">
                        <Image
                          src={getMenuImage(item.name)}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 p-3 pr-2">
                        <h3 className="font-semibold text-base line-clamp-1">{item.name}</h3>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{item.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-primary font-bold">{item.price}</p>
                          {quantity === 0 ? (
                            <Button
                              size="sm"
                              onClick={() => addToCart(item)}
                              className="h-8 px-4 text-sm font-semibold"
                            >
                              Add
                            </Button>
                          ) : (
                            <QuantitySpinner
                              value={quantity}
                              onChange={(val) => updateQuantity(item.id, val)}
                              min={0}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Step 2: Drinks Selection */}
        {step === 2 && (
          <div className="space-y-3">
            {drinkItems.map((item, index) => {
              const quantity = getItemQuantity(item.id)
              return (
                <Card
                  key={item.id}
                  className="overflow-hidden shadow-md hover:shadow-lg transition-all slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CardContent className="p-0">
                    <div className="flex gap-3">
                      <div className="w-24 h-24 relative flex-shrink-0 bg-gray-100">
                        <Image
                          src={getMenuImage(item.name)}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 p-3 pr-2">
                        <h3 className="font-semibold text-base line-clamp-1">{item.name}</h3>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{item.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-primary font-bold">{item.price}</p>
                          {quantity === 0 ? (
                            <Button
                              size="sm"
                              onClick={() => addToCart(item)}
                              className="h-8 px-4 text-sm font-semibold"
                            >
                              Add
                            </Button>
                          ) : (
                            <QuantitySpinner
                              value={quantity}
                              onChange={(val) => updateQuantity(item.id, val)}
                              min={0}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Step 3: Dessert Selection */}
        {step === 3 && (
          <div className="space-y-3">
            {dessertItems.map((item, index) => {
              const quantity = getItemQuantity(item.id)
              return (
                <Card
                  key={item.id}
                  className="overflow-hidden shadow-md hover:shadow-lg transition-all slide-up"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CardContent className="p-0">
                    <div className="flex gap-3">
                      <div className="w-24 h-24 relative flex-shrink-0 bg-gray-100">
                        <Image
                          src={getMenuImage(item.name)}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex-1 p-3 pr-2">
                        <h3 className="font-semibold text-base line-clamp-1">{item.name}</h3>
                        <p className="text-xs text-gray-600 mt-1 line-clamp-2">{item.description}</p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-primary font-bold">{item.price}</p>
                          {quantity === 0 ? (
                            <Button
                              size="sm"
                              onClick={() => addToCart(item)}
                              className="h-8 px-4 text-sm font-semibold"
                            >
                              Add
                            </Button>
                          ) : (
                            <QuantitySpinner
                              value={quantity}
                              onChange={(val) => updateQuantity(item.id, val)}
                              min={0}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Step 4: Address & Details */}
        {step === 4 && (
          <div className="space-y-4">
            <Card className="shadow-md slide-up">
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-primary" />
                  Order Summary
                </h3>
                <div className="space-y-2">
                  {orderData.cart.map(cartItem => (
                    <div key={cartItem.item.id} className="flex justify-between items-center text-sm">
                      <div className="flex items-center gap-2 flex-1">
                        <span className="font-medium">{cartItem.quantity}x</span>
                        <span className="line-clamp-1">{cartItem.item.name}</span>
                      </div>
                      <span className="font-semibold text-primary ml-2">{cartItem.item.price}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md slide-up" style={{ animationDelay: '0.1s' }}>
              <CardContent className="p-4 space-y-4">
                <h3 className="font-semibold text-lg">Delivery Information</h3>

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    placeholder="Juan Dela Cruz"
                    value={orderData.name}
                    onChange={(e) => setOrderData(prev => ({ ...prev, name: e.target.value }))}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <PhoneInput
                    id="phone"
                    placeholder="9XX XXX XXXX"
                    value={orderData.phone}
                    onChange={(e) => setOrderData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Delivery Address</Label>
                  <Input
                    id="address"
                    placeholder="Complete address with landmarks"
                    value={orderData.address}
                    onChange={(e) => setOrderData(prev => ({ ...prev, address: e.target.value }))}
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Order Notes (Optional)</Label>
                  <Input
                    id="notes"
                    placeholder="Special instructions"
                    value={orderData.notes}
                    onChange={(e) => setOrderData(prev => ({ ...prev, notes: e.target.value }))}
                    className="h-12"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </main>

      {/* Fixed Footer */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-2xl">
        <div className="px-4 py-4">
          <div className="flex gap-3">
            {step > 1 && step < 4 && (
              <Button
                variant="outline"
                onClick={handleSkip}
                className="w-24 h-14 text-base font-semibold"
              >
                Skip
              </Button>
            )}
            {step < 4 ? (
              <Button
                onClick={handleNext}
                className="flex-1 h-14 text-lg font-bold shadow-lg relative overflow-hidden group"
              >
                <span className="absolute inset-0 metal-shine" />
                <span className="relative flex items-center justify-center gap-2">
                  Next
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!canProceed()}
                className="flex-1 h-14 text-lg font-bold shadow-lg relative overflow-hidden group"
              >
                <span className="absolute inset-0 metal-shine" />
                <span className="relative flex items-center justify-center gap-2">
                  Place Order
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            )}
          </div>
        </div>
      </footer>
    </div>
  )
}
