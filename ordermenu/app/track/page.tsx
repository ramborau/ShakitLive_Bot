'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { PhoneInput } from '@/components/ui/phone-input'
import { OTPInput } from '@/components/ui/otp-input'
import { MapPin, Clock, Package, CheckCircle2, Search, ArrowRight, ChevronLeft } from 'lucide-react'

interface TrackingData {
  orderId: string
  status: string
  items: string[]
  address: string
  estimatedTime: string
  timeline: {
    step: string
    time: string
    completed: boolean
  }[]
}

export default function TrackOrderPage() {
  const [searchTab, setSearchTab] = useState('mobile')
  const [mobileNumber, setMobileNumber] = useState('')
  const [otp, setOtp] = useState('')
  const [orderId, setOrderId] = useState('')
  const [showOTP, setShowOTP] = useState(false)
  const [trackingData, setTrackingData] = useState<TrackingData | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSendOTP = () => {
    if (mobileNumber.length >= 10) {
      setShowOTP(true)
    }
  }

  const handleVerifyOTP = async () => {
    if (otp.length === 4) {
      setLoading(true)
      // Simulate API call
      setTimeout(() => {
        setTrackingData({
          orderId: 'ORD-12345',
          status: 'Out for Delivery',
          items: ['Hawaiian Delight Pizza', 'Coke 1.5L', "Choc'O S'Mores"],
          address: '123 Main St, Manila',
          estimatedTime: '15-20 mins',
          timeline: [
            { step: 'Order Placed', time: '2:30 PM', completed: true },
            { step: 'Preparing', time: '2:35 PM', completed: true },
            { step: 'Out for Delivery', time: '2:50 PM', completed: true },
            { step: 'Delivered', time: 'Pending', completed: false }
          ]
        })
        setLoading(false)
      }, 1000)
    }
  }

  const handleTrackByOrderId = async () => {
    if (orderId) {
      setLoading(true)
      setTimeout(() => {
        setTrackingData({
          orderId: orderId,
          status: 'Preparing',
          items: ['Manager\'s Choice Pizza', 'Sprite 1.5L'],
          address: '456 Avenue St, Quezon City',
          estimatedTime: '25-30 mins',
          timeline: [
            { step: 'Order Placed', time: '3:15 PM', completed: true },
            { step: 'Preparing', time: '3:20 PM', completed: true },
            { step: 'Out for Delivery', time: 'Pending', completed: false },
            { step: 'Delivered', time: 'Pending', completed: false }
          ]
        })
        setLoading(false)
      }, 1000)
    }
  }

  const handleBack = () => {
    setTrackingData(null)
    setShowOTP(false)
    setOtp('')
    setMobileNumber('')
    setOrderId('')
  }

  if (trackingData) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
        {/* Header with Back Button */}
        <header className="sticky top-0 z-50 bg-gradient-to-r from-primary to-red-600 text-white shadow-xl">
          <div className="px-4 py-6">
            <div className="flex items-center gap-3">
              <button onClick={handleBack} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                <ChevronLeft className="w-6 h-6" />
              </button>
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Order Status</h1>
                  <p className="text-sm opacity-90">#{trackingData.orderId}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto px-4 py-6 pb-32">
          <div className="max-w-md mx-auto space-y-4">
            {/* Status Card */}
            <Card className="border-2 border-primary shadow-lg slide-up overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16" />
              <CardContent className="p-6 relative">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary to-red-600 rounded-full mb-4 shadow-lg">
                    <Package className="w-10 h-10 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-primary">{trackingData.status}</h2>
                  <p className="text-sm text-gray-600 mt-1">Your order is on its way!</p>
                </div>
              </CardContent>
            </Card>

            {/* Estimated Time */}
            <Card className="shadow-md slide-up" style={{ animationDelay: '0.1s' }}>
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-secondary/30 to-yellow-300/30 p-4 rounded-xl">
                    <Clock className="w-7 h-7 text-secondary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600">Estimated Delivery</p>
                    <p className="font-bold text-xl text-gray-900">{trackingData.estimatedTime}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="shadow-md slide-up" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="w-1 h-6 bg-primary rounded-full" />
                  Order Timeline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {trackingData.timeline.map((item, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-all duration-300 ${
                          item.completed
                            ? 'bg-gradient-to-br from-primary to-red-600 scale-110'
                            : 'bg-gray-200'
                        }`}>
                          {item.completed ? (
                            <CheckCircle2 className="w-6 h-6 text-white" />
                          ) : (
                            <div className="w-4 h-4 rounded-full bg-gray-400" />
                          )}
                        </div>
                        {index < trackingData.timeline.length - 1 && (
                          <div className={`w-1 h-16 rounded-full transition-all duration-500 ${
                            item.completed ? 'bg-gradient-to-b from-primary to-red-600' : 'bg-gray-200'
                          }`} />
                        )}
                      </div>
                      <div className="flex-1 pb-12">
                        <p className={`font-semibold text-base ${
                          item.completed ? 'text-gray-900' : 'text-gray-400'
                        }`}>
                          {item.step}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Items */}
            <Card className="shadow-md slide-up" style={{ animationDelay: '0.3s' }}>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <div className="w-1 h-6 bg-secondary rounded-full" />
                  Order Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {trackingData.items.map((item, index) => (
                    <li key={index} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                      <div className="w-2 h-2 rounded-full bg-gradient-to-br from-primary to-red-600" />
                      <span className="text-sm font-medium">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Delivery Address */}
            <Card className="shadow-md slide-up" style={{ animationDelay: '0.4s' }}>
              <CardContent className="p-4">
                <div className="flex items-start gap-4">
                  <div className="bg-gradient-to-br from-primary/20 to-red-600/20 p-3 rounded-xl">
                    <MapPin className="w-6 h-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-gray-600 font-medium">Delivery Address</p>
                    <p className="font-semibold text-gray-900 mt-1">{trackingData.address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>

        {/* Fixed Footer */}
        <footer className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-2xl">
          <div className="px-4 py-4">
            <p className="text-center text-sm text-gray-600">
              Need help? Contact{' '}
              <a href="tel:12345678" className="text-primary font-bold hover:underline">
                1234-5678
              </a>
            </p>
          </div>
        </footer>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-white">
      {/* Sticky Header */}
      <header className="sticky top-0 z-50 bg-gradient-to-r from-primary to-red-600 text-white shadow-xl">
        <div className="px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="bg-white/20 p-3 rounded-full">
              <Package className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Track Order</h1>
              <p className="text-sm opacity-90">Check your order status</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 py-6 pb-32">
        <div className="max-w-md mx-auto">
          <Card className="shadow-xl border-2 slide-up">
            <CardHeader>
              <CardTitle className="text-xl">Find Your Order</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <Tabs value={searchTab} onValueChange={setSearchTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2 h-12">
                  <TabsTrigger value="mobile" className="text-sm font-semibold">
                    Mobile Number
                  </TabsTrigger>
                  <TabsTrigger value="orderId" className="text-sm font-semibold">
                    Order ID
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="mobile" className="space-y-4 mt-6">
                  {!showOTP ? (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="mobile" className="text-base font-semibold">
                          Enter Mobile Number
                        </Label>
                        <PhoneInput
                          id="mobile"
                          placeholder="9XX XXX XXXX"
                          value={mobileNumber}
                          onChange={(e) => setMobileNumber(e.target.value)}
                          maxLength={10}
                        />
                        <p className="text-xs text-gray-500">
                          We'll send you a 4-digit OTP to verify
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-4 fade-in">
                      <div>
                        <Label className="text-base font-semibold">
                          Enter OTP
                        </Label>
                        <p className="text-sm text-gray-600 mb-3">
                          Sent to +63 {mobileNumber}
                        </p>
                        <OTPInput value={otp} onChange={setOtp} length={4} />
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowOTP(false)}
                        className="w-full"
                      >
                        Change Number
                      </Button>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="orderId" className="space-y-4 mt-6">
                  <div className="space-y-2">
                    <Label htmlFor="orderId" className="text-base font-semibold">
                      Enter Order ID
                    </Label>
                    <Input
                      id="orderId"
                      type="text"
                      placeholder="ORD-XXXXX"
                      value={orderId}
                      onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                      className="h-12 text-base"
                    />
                    <p className="text-xs text-gray-500">
                      You can find this in your order confirmation
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </div>
      </main>

      {/* Fixed Footer with Main Button */}
      <footer className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-2xl">
        <div className="px-4 py-4">
          <Button
            onClick={
              searchTab === 'mobile'
                ? showOTP
                  ? handleVerifyOTP
                  : handleSendOTP
                : handleTrackByOrderId
            }
            disabled={
              loading ||
              (searchTab === 'mobile'
                ? showOTP
                  ? otp.length < 4
                  : mobileNumber.length < 10
                : !orderId)
            }
            className="w-full h-14 text-lg font-bold shadow-lg relative overflow-hidden group"
            size="lg"
          >
            <span className="absolute inset-0 metal-shine" />
            <span className="relative flex items-center justify-center gap-2">
              {loading ? (
                'Searching...'
              ) : searchTab === 'mobile' ? (
                showOTP ? (
                  <>
                    Verify & Track
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                ) : (
                  <>
                    Send OTP
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )
              ) : (
                <>
                  Track Order
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </span>
          </Button>
        </div>
      </footer>
    </div>
  )
}
