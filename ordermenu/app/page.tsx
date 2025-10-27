import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ShoppingCart, Package, CreditCard } from 'lucide-react'

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-primary text-white shadow-lg">
        <div className="px-4 py-8">
          <h1 className="text-3xl font-bold">Shakey's</h1>
          <p className="text-sm opacity-90 mt-1">Welcome! Choose an option below</p>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-4 py-8">
        <div className="max-w-md mx-auto space-y-4">
          {/* Order Food Card */}
          <Link href="/order">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-4 rounded-full">
                    <ShoppingCart className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Order Food</CardTitle>
                    <CardDescription>Browse menu and place your order</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button className="w-full" size="lg">
                  Start Ordering
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Track Order Card */}
          <Link href="/track">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-primary">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-4 rounded-full">
                    <Package className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Track Order</CardTitle>
                    <CardDescription>Check your order status</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button className="w-full" size="lg" variant="outline">
                  Track Now
                </Button>
              </CardContent>
            </Card>
          </Link>

          {/* Card Offers */}
          <Link href="/cards">
            <Card className="cursor-pointer hover:shadow-lg transition-shadow border-2 hover:border-secondary">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="bg-secondary/20 p-4 rounded-full">
                    <CreditCard className="w-8 h-8 text-secondary" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">Supercard Offers</CardTitle>
                    <CardDescription>Save thousands with our cards</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button className="w-full bg-secondary text-black hover:bg-secondary/90" size="lg">
                  View Offers
                </Button>
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="px-4 py-6 text-center">
          <p className="text-sm text-gray-600">
            © 2025 Shakey's Pizza. All rights reserved.
          </p>
          <p className="text-xs text-gray-500 mt-1">
            For support: 1234-5678
          </p>
        </div>
      </footer>
    </div>
  )
}
