"use client";

import { ShoppingCart } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

interface CartItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

interface OrderCartData {
  items?: CartItem[];
  total?: number;
}

interface OrderCartSummaryProps {
  flowData: string | null;
}

export function OrderCartSummary({ flowData }: OrderCartSummaryProps) {
  // Parse flowData if it exists
  let cartData: OrderCartData = {};

  if (flowData) {
    try {
      cartData = JSON.parse(flowData);
    } catch (error) {
      console.error("Failed to parse cart data:", error);
    }
  }

  const items = cartData.items || [];
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  // Don't show if no items
  if (items.length === 0) {
    return null;
  }

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <ShoppingCart className="h-4 w-4" />
          Current Order
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex justify-between items-start text-sm">
            <div className="flex-1">
              <p className="font-medium">{item.name}</p>
              <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
            </div>
            <p className="font-medium">₱{(item.price * item.quantity).toFixed(2)}</p>
          </div>
        ))}

        <div className="pt-2 border-t mt-2">
          <div className="flex justify-between items-center font-semibold">
            <span>Total</span>
            <span className="text-primary">₱{total.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
