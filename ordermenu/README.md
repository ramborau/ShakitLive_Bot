# Shakey's Order Menu - Mobile-First UI

A mobile-first Next.js application for ordering food, tracking orders, and viewing Supercard offers.

## Features

### 📱 Three Main Pages (Standalone, No Inter-linking)

1. **Order Food** (`/order`)
   - Multi-step flow: Pizza → Drinks → Dessert → Address
   - Sticky header with progress indicator
   - Sticky footer with navigation buttons
   - Submit to webhook and auto-close browser

2. **Track Order** (`/track`)
   - Search by mobile number or order ID
   - Real-time order status timeline
   - Delivery address and estimated time
   - Mobile-optimized interface

3. **Card Offers** (`/cards`)
   - Display Supercard Classic (₱699) and Gold (₱999)
   - Expandable benefit details
   - Purchase form with validation
   - Submit to webhook and auto-close browser

## Design System

- **Primary Color:** #ef3842 (Red)
- **Secondary Color:** #FEDE04 (Yellow)
- **Font:** Inter, 16px body
- **Framework:** Next.js, React, TypeScript, ShadCN UI
- **Mobile-First:** Optimized for mobile devices
- **Sticky UI:** Headers and footers stay visible

## Tech Stack

- **Frontend:** Next.js 15, React 18, TypeScript
- **UI Components:** ShadCN UI (Radix UI primitives)
- **Styling:** Tailwind CSS
- **Icons:** Lucide React

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Update `.env` file with your webhook URL:

```env
NEXT_PUBLIC_WEBHOOK_URL=your_webhook_url_here
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Build for Production

```bash
npm run build
npm start
```

## Page URLs

- **Home:** `/`
- **Order Food:** `/order`
- **Track Order:** `/track`
- **Card Offers:** `/cards`

## Webhook Integration

All forms submit data to the webhook URL configured in `.env`:

### Order Submission
```json
{
  "type": "order",
  "data": {
    "pizza": {...},
    "drinks": {...},
    "dessert": {...},
    "name": "Customer Name",
    "phone": "Phone Number",
    "address": "Delivery Address",
    "notes": "Order notes"
  },
  "timestamp": "2025-10-27T..."
}
```

### Card Purchase
```json
{
  "type": "card_purchase",
  "data": {
    "selectedCard": "classic" | "gold",
    "name": "Customer Name",
    "phone": "Phone Number",
    "email": "Email Address"
  },
  "timestamp": "2025-10-27T..."
}
```

After successful submission, the browser will automatically close.

## Data Files

- `menu.json` - Menu items with categories (Pizza, Drinks, Desserts, etc.)
- `supercard.md` - Supercard benefits and pricing details

## Mobile-First Features

- Responsive design optimized for mobile screens
- Touch-friendly tap targets
- Sticky headers for navigation context
- Sticky footers for primary actions
- Smooth scrolling content areas
- Loading states and animations
- Form validation

## Project Structure

```
ordermenu/
├── app/
│   ├── order/
│   │   └── page.tsx          # Order food page
│   ├── track/
│   │   └── page.tsx          # Track order page
│   ├── cards/
│   │   └── page.tsx          # Card offers page
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Home page
│   └── globals.css           # Global styles
├── components/
│   └── ui/                   # ShadCN UI components
├── lib/
│   └── utils.ts              # Utility functions
├── menu.json                 # Menu data
├── supercard.md              # Supercard details
└── package.json              # Dependencies
```

## Notes

- Pages are designed to be standalone without inter-linking (as requested)
- Home page provides navigation to all three main pages
- All pages are 100% mobile-first optimized
- Drawers and modals have rounded tops as specified
- Auto-close functionality triggers after form submission
