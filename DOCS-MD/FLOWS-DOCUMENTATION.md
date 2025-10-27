# ShakitLive Bot - Complete Flow Documentation

## Flow Index

1. [Order Flow](#1-order-flow)
2. [Location Flow](#2-location-flow)
3. [Tracking Flow](#3-tracking-flow)
4. [Supercard Flow](#4-supercard-flow)
5. [Party Order Flow](#5-party-order-flow)
6. [Complaint Flow](#6-complaint-flow)
7. [Promo Flow](#7-promo-flow)
8. [FAQ Flow](#8-faq-flow)

---

## 1. ORDER FLOW

### Hot Keywords (Triggers)
```
Primary: order, buy, purchase, want, need, cart, checkout, delivery, carryout, pick up
Tagalog: gusto, kailangan, pabili, bili, pa-order
```

### Flow Steps

#### Step 1: FLOW_START
**Question Type**: Greeting + Method Selection
**Bot Asks**: "Great! Let's start your order. How would you like to order?"
**Expected User Response**: Button click
- "AI Order" → Proceeds to AI-assisted ordering
- "Browse Menu" → Shows product carousel

#### Step 2: AI_ORDER_START (if AI Order selected)
**Question Type**: Open-ended product request
**Bot Asks**: "What would you like to order? (e.g., 'Hawaiian Pizza', 'Chicken')"
**Expected User Response**: Text describing desired product
- Example: "hawaiian pizza"
- Example: "chicken and mojos"

#### Step 3: SHOW_PRODUCT_CAROUSEL
**Question Type**: Product selection
**Bot Asks**: Shows carousel of matched products
**Expected User Response**: Click "Add to Cart" on a product
- Payload: `add_product_{productId}`

#### Step 4: PRODUCT_SELECTED
**Question Type**: Quantity confirmation
**Bot Asks**: "How many would you like?"
**Expected User Response**: Number
- "1", "2", "3", etc.

#### Step 5: ASK_DRINKS
**Question Type**: Upsell with quick replies
**Bot Asks**: "🥤 How about some drinks to go with that?"
**Expected User Response**: Quick reply selection
- "🥤 Add Drinks" → Shows drinks carousel
- "⏭️ Skip" → Proceeds to desserts

#### Step 6: SHOW_DRINKS_CAROUSEL (if Add Drinks selected)
**Question Type**: Product selection
**Bot Asks**: Shows drinks carousel
**Expected User Response**: Click "Add to Cart" on a drink
- Payload: `add_drink_{drinkId}`

#### Step 7: ASK_DESSERTS
**Question Type**: Upsell with quick replies
**Bot Asks**: "🍰 And how about dessert?"
**Expected User Response**: Quick reply selection
- "🍰 Add Desserts" → Shows desserts carousel
- "⏭️ Skip" → Proceeds to location
- "✅ Checkout" → Proceeds to location

#### Step 8: SHOW_DESSERTS_CAROUSEL (if Add Desserts selected)
**Question Type**: Product selection
**Bot Asks**: Shows desserts carousel
**Expected User Response**: Click "Add to Cart" on a dessert
- Payload: `add_dessert_{dessertId}`

#### Step 9: COLLECT_LOCATION
**Question Type**: Delivery address
**Bot Asks**: "Where should we deliver your order?"
**Expected User Response**: Text address
- Example: "123 Main St, Makati"

#### Step 10: GENERATE_PAYMENT
**Question Type**: Payment link
**Bot Asks**: Shows order summary and payment link
**Expected User Response**: Click payment link or end conversation

### Expected Outcome
- User has successfully placed an order
- Cart contains all selected items
- Location/delivery address captured
- Payment link generated
- Flow ends

---

## 2. LOCATION FLOW

### Hot Keywords (Triggers)
```
Primary: location, branch, store, nearest, near me, where, address, deliver, delivery area, coverage
Tagalog: saan, malapit
```

### Flow Steps

#### Step 1: FLOW_START
**Question Type**: Confirmation with quick replies
**Bot Asks**: "📍 I can help you find the nearest Shakey's branch! Would you like me to show you branches near you?"
**Expected User Response**: Quick reply selection
- "✅ Yes, show me" → Shows location carousel
- "📞 Call instead" → Provides hotline number
- "🌐 Visit website" → Provides website link

#### Step 2: SHOW_LOCATION_CAROUSEL (if Yes selected)
**Question Type**: Location selection
**Bot Asks**: Shows carousel of Shakey's branches with images, addresses, phone numbers
**Expected User Response**: Click "Get Directions" on a location
- Opens Google Maps with directions

### Expected Outcome
- User finds nearest Shakey's branch
- User gets directions via Google Maps
- Flow ends

---

## 3. TRACKING FLOW

### Hot Keywords (Triggers)
```
Primary: track, tracking, order status, where is my order, order number, delivery status
Tagalog: saan na, nasaan, asan na
```

### Flow Steps

#### Step 1: FLOW_START
**Question Type**: Order number request
**Bot Asks**: "Please provide your order number to track your delivery."
**Expected User Response**: Text with order number
- Example: "ORD-12345"
- Example: "12345"

#### Step 2: SHOW_STATUS
**Question Type**: Information display
**Bot Asks**: Shows order status (mock data or real integration)
**Expected User Response**: No action needed, informational only

### Expected Outcome
- User receives order status information
- Flow ends

---

## 4. SUPERCARD FLOW

### Hot Keywords (Triggers)
```
Primary: supercard, super card, loyalty, loyalty card, rewards, points, membership, member, card
```

### Flow Steps

#### Step 1: FLOW_START
**Question Type**: FAQ search
**Bot Asks**: "🔍 Let me find information about Supercard for you..."
**Expected User Response**: None (bot searches FAQ database)

#### Step 2: SHOW_ANSWER
**Question Type**: Information display
**Bot Asks**: Displays FAQ answer about Supercard or generic info
**Expected User Response**: Read information

#### Step 3: OFFER_CARD
**Question Type**: Purchase option
**Bot Asks**: "🎴 Ready to unlock exclusive rewards?"
**Shows**: Carousel with Gold Card (₱999) and Classic Card (₱699)
**Expected User Response**: Click "BUY NOW" on a card
- Opens webview to purchase page

### Expected Outcome
- User learns about Supercard benefits
- User can purchase Supercard directly
- Flow ends

---

## 5. PARTY ORDER FLOW

### Hot Keywords (Triggers)
```
Primary: party, group order, birthday, celebration, event, buffet, package, plated, mascot
Tagalog: pista, kaarawan, handaan, grupo
```

### Flow Steps

#### Step 1: FLOW_START
**Question Type**: Package type selection
**Bot Asks**: "🎉 Let's plan your party! What type of package are you interested in?"
**Expected User Response**: Button click
- "Plated Meals"
- "Buffet Packages"
- "Custom Party"

#### Step 2: SHOW_PACKAGES
**Question Type**: Package selection
**Bot Asks**: Shows carousel of party packages
**Expected User Response**: Click on a package

#### Step 3: COLLECT_DETAILS
**Question Type**: Party information
**Bot Asks**: "How many guests?", "What date?", "Any special requests?"
**Expected User Response**: Text answers

### Expected Outcome
- User selects party package
- Party details collected
- Contact information for follow-up
- Flow ends

---

## 6. COMPLAINT FLOW

### Hot Keywords (Triggers)
```
Primary: complaint, complain, issue, problem, wrong order, late delivery, not delivered, cold food, late, wrong, missing, refund, cancel
Tagalog: reklamo
```

### Flow Steps

#### Step 1: FLOW_START
**Question Type**: Issue description
**Bot Asks**: "I'm sorry to hear you're having an issue. Please describe the problem."
**Expected User Response**: Text describing the issue

#### Step 2: COLLECT_ORDER_INFO
**Question Type**: Order number request
**Bot Asks**: "Could you provide your order number?"
**Expected User Response**: Order number text

#### Step 3: ESCALATE
**Question Type**: Escalation confirmation
**Bot Asks**: "I'm connecting you to our customer service team..."
**Expected User Response**: None (auto-escalates)

### Expected Outcome
- Issue details collected
- Thread marked for human escalation
- Customer service notified
- Flow ends

---

## 7. PROMO FLOW

### Hot Keywords (Triggers)
```
Primary: promo, promotion, discount, sale, offer, deal, voucher, coupon, off, 50%, buy one, bogo
```

### Flow Steps

#### Step 1: FLOW_START
**Question Type**: Information display
**Bot Asks**: Shows current promotions and deals
**Expected User Response**: Read information or ask follow-up

### Expected Outcome
- User learns about current promos
- Flow ends

---

## 8. FAQ FLOW

### Hot Keywords (Triggers)
```
Primary: how, what, when, why, open, close, hours, contact, hotline, payment, menu, price
Tagalog: paano, ano, kailan, bakit, magkano, bayad
```

### Flow Steps

#### Step 1: FLOW_START
**Question Type**: Information search
**Bot Asks**: Searches FAQ database or provides generic help
**Expected User Response**: Read answer or ask follow-up

### Expected Outcome
- User gets answer to FAQ question
- Flow ends or continues with follow-up questions

---

## Flow Priority (Intent Matching)

When multiple keywords match, flows are prioritized as follows:

1. **Human Request** (highest priority) - Immediate escalation
2. **Complaint** - Quick escalation needed
3. **Order Placement** - Primary business function
4. **Tracking** - Customer service
5. **Supercard** - Sales opportunity
6. **Party Order** - High-value sales
7. **Location** - Customer service
8. **Promo** - Marketing
9. **FAQ** - General information (lowest priority)

---

## Common Issues & Solutions

### Issue: Bot keeps showing generic FAQ instead of specific flow

**Root Cause**: Intent detection fallback or Gemini AI failure

**Solution**:
1. Check if hot keywords are present in user message
2. Verify intent-detector.ts keyword matching
3. Check Gemini API key and quota
4. Ensure flow-handler routes intents correctly

### Issue: Flow gets stuck at a step

**Root Cause**: Switch case routing to wrong handler or early return guard

**Solution**:
1. Ensure switch cases route to correct handlers
2. Remove guards that return early for user input
3. Test with both button payloads and text input

### Issue: Quick replies not showing

**Root Cause**: Using sendMixedButtonMessage instead of sendQuickReplies

**Solution**:
1. Replace button templates with quick replies
2. Use FacebookService.sendQuickReplies()
3. Ensure typing indicators are added before messages

---

## Testing Checklist

### Order Flow
- [ ] AI Order path works end-to-end
- [ ] Browse Menu path works end-to-end
- [ ] Skip drinks button works
- [ ] Skip desserts button works
- [ ] Add drinks works
- [ ] Add desserts works
- [ ] Checkout proceeds to location
- [ ] Payment link generated

### Location Flow
- [ ] Quick replies show on initial question
- [ ] "Yes, show me" displays carousel
- [ ] "Call instead" provides hotline
- [ ] "Visit website" provides link
- [ ] Carousel shows all locations
- [ ] "Get Directions" opens Google Maps

### Tracking Flow
- [ ] Bot asks for order number
- [ ] Valid order number shows status
- [ ] Invalid order number handled gracefully

### Supercard Flow
- [ ] Bot searches FAQ
- [ ] Shows Supercard information
- [ ] Displays Gold and Classic card carousel
- [ ] BUY NOW links work

### Party Flow
- [ ] Shows package options
- [ ] Carousel displays correctly
- [ ] Collects party details

### Complaint Flow
- [ ] Collects issue description
- [ ] Collects order number
- [ ] Escalates to human

---

**Last Updated**: 2025-10-27
**Version**: 1.0
