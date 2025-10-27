# Quick Start Guide

## Setup (One Time)

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure webhook URL:**

   Edit the `.env` file and add your webhook URL:
   ```
   NEXT_PUBLIC_WEBHOOK_URL=https://your-webhook-url.com/endpoint
   ```

## Run the Application

```bash
npm run dev
```

Visit: **http://localhost:3000**

## Pages Overview

### 🏠 Home Page (/)
Main navigation hub with three options

### 🍕 Order Food (/order)
**Flow:**
1. Select Pizza
2. Select Drink
3. Select Dessert
4. Enter Delivery Details
5. Submit Order → Webhook → Auto-close

**Features:**
- Progress indicator in header
- Sticky header & footer
- Mobile-optimized cards
- Form validation

### 📦 Track Order (/track)
**Features:**
- Search by mobile number or order ID
- Visual timeline of order status
- Estimated delivery time
- Delivery address display

### 💳 Card Offers (/cards)
**Two Options:**
- **Supercard Classic** - ₱699/year
- **Supercard Gold** - ₱999/year

**Features:**
- Expandable benefit lists
- Purchase form
- Submit → Webhook → Auto-close

## Mobile Testing

### Using Chrome DevTools:
1. Open **http://localhost:3000**
2. Press `F12` to open DevTools
3. Click device toolbar icon (or `Ctrl+Shift+M`)
4. Select mobile device (iPhone 12 Pro, etc.)

### Using Real Device:
1. Find your local IP: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)
2. On mobile browser: `http://YOUR_IP:3000`
3. Example: `http://192.168.1.100:3000`

## Build for Production

```bash
npm run build
npm start
```

Production server runs on **http://localhost:3000**

## Troubleshooting

### Port 3000 already in use?
```bash
# Kill the process using port 3000 (Mac/Linux)
lsof -ti:3000 | xargs kill -9

# Or use a different port
PORT=3001 npm run dev
```

### Menu items not showing?
- Ensure `menu.json` is in the root directory
- Check browser console for errors

### Webhook not working?
- Verify `.env` file has correct `NEXT_PUBLIC_WEBHOOK_URL`
- Restart dev server after changing `.env`
- Check browser network tab for webhook requests

## Customization

### Change Colors
Edit `tailwind.config.ts`:
- Primary: `#ef3842` (red)
- Secondary: `#FEDE04` (yellow)

### Update Menu
Edit `menu.json` - add/remove items

### Modify Card Benefits
Edit `app/cards/page.tsx` or reference `supercard.md`

---

**Support:** For issues, check the browser console and network tab for errors.
