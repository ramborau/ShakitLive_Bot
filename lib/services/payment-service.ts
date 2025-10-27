/**
 * Payment Service
 * Generates payment links for orders
 */

export interface CartItem {
  productId: number;
  name: string;
  price: string;
  quantity: number;
  category: string;
}

export interface PaymentLinkData {
  cart: CartItem[];
  total: number;
  address?: string;
  phone?: string;
}

export class PaymentService {
  /**
   * Generate a payment link for the order
   * In production, this would integrate with a real payment gateway
   */
  static generatePaymentLink(data: PaymentLinkData): string {
    // For now, return the order page with cart data encoded
    const cartParam = encodeURIComponent(JSON.stringify(data));
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://shakeys-app.vercel.app";

    return `${baseUrl}/order?cart=${cartParam}`;
  }

  /**
   * Calculate total from cart
   */
  static calculateTotal(cart: CartItem[]): number {
    return cart.reduce((sum, item) => {
      const price = parseFloat(item.price.replace(/[₱,]/g, ""));
      return sum + (price * item.quantity);
    }, 0);
  }

  /**
   * Format cart for display
   */
  static formatCart(cart: CartItem[]): string {
    if (cart.length === 0) return "Empty cart";

    const items = cart.map(item =>
      `• ${item.name} x${item.quantity} - ₱${(parseFloat(item.price.replace(/[₱,]/g, "")) * item.quantity).toFixed(2)}`
    ).join("\n");

    const total = this.calculateTotal(cart);

    return `${items}\n\n*Total: ₱${total.toFixed(2)}*`;
  }
}
