'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PhoneInput } from '@/components/ui/phone-input'
import { CreditCard, Check, Crown, Star, Sparkles, ChevronDown, ChevronUp, ArrowRight, ChevronLeft } from 'lucide-react'

interface CardData {
  name: string
  phone: string
  email: string
  selectedCard: 'classic' | 'gold' | null
}

const CLASSIC_BENEFITS = [
  { title: 'FREE Welcome Treat', desc: 'Large Thin Classic Pizza or Pasta Platter' },
  { title: '15% Welcome Discount', desc: 'On day of purchase (max ₱500)' },
  { title: 'Buy One Take One', desc: 'Pizza on delivery & carryout' },
  { title: '10% OFF Year-Round', desc: 'Dine-in & carryout (max ₱500/day)' },
  { title: 'Birthday Treat', desc: 'FREE Large Thin Classic Pizza' },
  { title: 'Earn SuperPoints', desc: '1 point per ₱100 spent' }
]

const CLASSIC_EXTRA = [
  { title: '15% Birthday Discount', desc: 'During birth month (max ₱500)' },
  { title: 'FREE Coffee/Drink Upgrade', desc: 'With minimum ₱300 dine-in' },
  { title: 'Exclusive Promos', desc: 'Special deals all year' }
]

const GOLD_BENEFITS = [
  { title: 'FREE Welcome Treat', desc: 'PARTY Pizza or Pasta or Salad Family' },
  { title: '20% Welcome Discount', desc: 'On day of purchase (max ₱500)' },
  { title: 'Buy One Take One', desc: 'Pizza on delivery & carryout' },
  { title: '10% OFF Year-Round', desc: 'Dine-in & carryout (max ₱500/day)' },
  { title: 'Birthday Treat', desc: 'FREE Large Thin Classic Pizza' },
  { title: 'Double SuperPoints', desc: '2 points per ₱100 spent' }
]

const GOLD_EXTRA = [
  { title: '20% Birthday Discount', desc: 'During birth month (max ₱1,000)' },
  { title: 'FREE Coffee/Drink Upgrade', desc: 'With minimum ₱300 dine-in' },
  { title: 'Exclusive Promos', desc: 'Gold members only deals' },
  { title: 'Multi-Brand Access', desc: 'Use at Peri-Peri & R&B' }
]

export default function CardsPage() {
  const [showClassicDetails, setShowClassicDetails] = useState(false)
  const [showGoldDetails, setShowGoldDetails] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState<CardData>({
    name: '',
    phone: '',
    email: '',
    selectedCard: null
  })

  const handleBuyNow = (cardType: 'classic' | 'gold') => {
    setFormData(prev => ({ ...prev, selectedCard: cardType }))
    setShowForm(true)
  }

  const handleSubmit = async () => {
    const webhookUrl = process.env.NEXT_PUBLIC_WEBHOOK_URL
    const payload = {
      type: 'card_purchase',
      data: formData,
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

  if (showForm) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
        <header className="sticky top-0 z-50 bg-gradient-to-r from-secondary via-yellow-500 to-secondary text-black shadow-xl">
          <div className="px-4 py-6">
            <div className="flex items-center gap-3">
              <button onClick={() => setShowForm(false)} className="p-2 hover:bg-black/10 rounded-full transition-colors">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-3">
                <div className="bg-black/20 p-2 rounded-full">
                  {formData.selectedCard === 'gold' ? <Crown className="w-6 h-6" /> : <Star className="w-6 h-6" />}
                </div>
                <div>
                  <h1 className="text-xl font-bold">Purchase Supercard</h1>
                  <p className="text-sm opacity-90">
                    {formData.selectedCard === 'classic' ? 'Classic - ₱699' : 'Gold - ₱999'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto px-4 py-6 pb-32">
          <Card className="max-w-md mx-auto shadow-xl slide-up">
            <CardHeader>
              <CardTitle>Your Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  placeholder="Juan Dela Cruz"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <PhoneInput
                  id="phone"
                  placeholder="9XX XXX XXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="juan@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="h-12"
                />
              </div>
            </CardContent>
          </Card>
        </main>

        <footer className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-2xl">
          <div className="px-4 py-4">
            <Button
              onClick={handleSubmit}
              disabled={!formData.name || !formData.phone || !formData.email}
              className="w-full h-14 text-lg font-bold shadow-lg relative overflow-hidden group bg-gradient-to-r from-secondary to-yellow-500 text-black hover:from-yellow-500 hover:to-secondary"
              size="lg"
            >
              <span className="absolute inset-0 metal-shine" />
              <span className="relative flex items-center justify-center gap-2">
                Complete Purchase
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
          </div>
        </footer>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      <header className="sticky top-0 z-50 bg-gradient-to-r from-primary to-red-600 text-white shadow-xl">
        <div className="px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-full">
              <Sparkles className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Supercard Offers</h1>
              <p className="text-sm opacity-90">Save thousands every year!</p>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6 pb-24">
        <div className="max-w-md mx-auto space-y-6">
          {/* Classic Card */}
          <Card className="border-2 border-primary shadow-xl slide-up overflow-hidden">
            <div className="bg-gradient-to-br from-primary via-red-500 to-red-600 text-white p-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-white/20 p-3 rounded-full">
                    <Star className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Supercard Classic</h2>
                    <p className="text-sm opacity-90">1 Year Validity</p>
                  </div>
                </div>
                <div>
                  <div className="text-sm opacity-90">ONLY</div>
                  <div className="text-4xl font-bold">₱ 699.00</div>
                </div>
              </div>
            </div>

            <CardContent className="p-6 space-y-4">
              <div className="space-y-3">
                {CLASSIC_BENEFITS.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-3 slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
                    <div className="mt-0.5"><Check className="w-5 h-5 text-primary flex-shrink-0" /></div>
                    <div>
                      <p className="font-semibold text-sm">{benefit.title}</p>
                      <p className="text-xs text-gray-600">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {showClassicDetails && (
                <div className="space-y-3 pt-3 border-t fade-in">
                  {CLASSIC_EXTRA.map((benefit, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="mt-0.5"><Check className="w-5 h-5 text-primary flex-shrink-0" /></div>
                      <div>
                        <p className="font-semibold text-sm">{benefit.title}</p>
                        <p className="text-xs text-gray-600">{benefit.desc}</p>
                      </div>
                    </div>
                  ))}
                  <div className="bg-secondary/10 p-3 rounded-lg mt-2">
                    <p className="font-bold text-sm text-center">Over ₱5,000 in savings!</p>
                  </div>
                </div>
              )}

              <Button
                variant="ghost"
                onClick={() => setShowClassicDetails(!showClassicDetails)}
                className="w-full"
              >
                {showClassicDetails ? (
                  <>Show Less <ChevronUp className="ml-2 w-4 h-4" /></>
                ) : (
                  <>View All Benefits <ChevronDown className="ml-2 w-4 h-4" /></>
                )}
              </Button>

              <Button onClick={() => handleBuyNow('classic')} className="w-full h-12 text-base font-bold relative overflow-hidden group" size="lg">
                <span className="absolute inset-0 metal-shine" />
                <span className="relative flex items-center justify-center gap-2">
                  Buy Now - ₱699
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </CardContent>
          </Card>

          {/* Gold Card */}
          <Card className="border-2 border-secondary shadow-xl slide-up overflow-hidden" style={{ animationDelay: '0.2s' }}>
            <div className="relative bg-gradient-to-br from-yellow-400 via-secondary to-yellow-600 text-black p-6 overflow-hidden">
              <div className="absolute top-2 right-2 bg-black text-secondary px-3 py-1 rounded-full text-xs font-bold z-10">
                BEST VALUE
              </div>
              <div className="absolute top-0 right-0 w-32 h-32 bg-black/10 rounded-full -mr-16 -mt-16" />
              <div className="relative">
                <div className="flex items-center gap-3 mb-4">
                  <div className="bg-black/20 p-3 rounded-full">
                    <Crown className="w-8 h-8" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold">Supercard Gold</h2>
                    <p className="text-sm opacity-90">1 Year Validity</p>
                  </div>
                </div>
                <div>
                  <div className="text-sm opacity-90 font-semibold">ONLY</div>
                  <div className="text-4xl font-bold">₱ 999.00</div>
                  <div className="text-sm font-semibold mt-1">INTRO PRICE</div>
                </div>
              </div>
            </div>

            <CardContent className="p-6 space-y-4">
              <div className="bg-gradient-to-r from-secondary/20 to-yellow-100 p-3 rounded-lg border border-secondary/30">
                <p className="font-bold text-sm flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-secondary" />
                  All Classic benefits PLUS upgraded perks!
                </p>
              </div>

              <div className="space-y-3">
                {GOLD_BENEFITS.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-3 slide-up" style={{ animationDelay: `${i * 0.05}s` }}>
                    <div className="mt-0.5"><Check className="w-5 h-5 text-secondary flex-shrink-0" /></div>
                    <div>
                      <p className="font-semibold text-sm">{benefit.title}</p>
                      <p className="text-xs text-gray-600">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              {showGoldDetails && (
                <div className="space-y-3 pt-3 border-t fade-in">
                  {GOLD_EXTRA.map((benefit, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <div className="mt-0.5"><Check className="w-5 h-5 text-secondary flex-shrink-0" /></div>
                      <div>
                        <p className="font-semibold text-sm">{benefit.title}</p>
                        <p className="text-xs text-gray-600">{benefit.desc}</p>
                      </div>
                    </div>
                  ))}
                  <div className="bg-secondary/10 p-3 rounded-lg border border-secondary/30 mt-2">
                    <p className="font-bold text-sm text-center">Over ₱10,000 in savings!</p>
                  </div>
                </div>
              )}

              <Button
                variant="ghost"
                onClick={() => setShowGoldDetails(!showGoldDetails)}
                className="w-full"
              >
                {showGoldDetails ? (
                  <>Show Less <ChevronUp className="ml-2 w-4 h-4" /></>
                ) : (
                  <>View All Benefits <ChevronDown className="ml-2 w-4 h-4" /></>
                )}
              </Button>

              <Button
                onClick={() => handleBuyNow('gold')}
                className="w-full h-12 text-base font-bold relative overflow-hidden group bg-gradient-to-r from-secondary to-yellow-500 text-black hover:from-yellow-500 hover:to-secondary"
                size="lg"
              >
                <span className="absolute inset-0 metal-shine" />
                <span className="relative flex items-center justify-center gap-2">
                  Buy Now - ₱999
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </span>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <footer className="sticky bottom-0 z-50 bg-white border-t shadow-lg">
        <div className="px-4 py-3">
          <p className="text-center text-xs text-gray-500">
            Valid at all Shakey's, Peri-Peri & R&B stores nationwide
          </p>
        </div>
      </footer>
    </div>
  )
}
