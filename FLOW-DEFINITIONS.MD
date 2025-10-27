# Flow Definitions - Enterprise Chatbot

## ORDER FLOW

### Steps:
1. **FLOW_START** - Initial order initiation
   - Display: "Order Now" or "start_order" button clicked
   - Actions: Show AI Order vs Order Online options
   - Next: CHOOSE_ORDER_METHOD

2. **CHOOSE_ORDER_METHOD** - User chooses ordering method
   - Options: "AI Order" (carousel) or "Order Online" (webview)
   - Next: AI_ORDER_START or WEBVIEW_REDIRECT

3. **AI_ORDER_START** - AI-powered ordering begins
   - Gemini analyzes user's food request
   - Next: SHOW_PRODUCT_CAROUSEL or SHOW_PRODUCT_LIST

4. **SHOW_PRODUCT_CAROUSEL** - Display ≤6 products as carousel
   - Images + prices + "Add to Cart" buttons
   - Next: PRODUCT_SELECTED

5. **SHOW_PRODUCT_LIST** - Display 7-10 products as numbered list
   - User types number to select
   - Next: PRODUCT_SELECTED

6. **PRODUCT_SELECTED** - Product added to cart
   - Display: Cart summary with total
   - Next: ASK_DRINKS

7. **ASK_DRINKS** - Offer drinks carousel
   - Buttons: "Add Drinks" / "Skip"
   - Next: SHOW_DRINKS_CAROUSEL or ASK_DESSERTS

8. **SHOW_DRINKS_CAROUSEL** - Drinks with images
   - Next: DRINK_SELECTED or ASK_DESSERTS

9. **ASK_DESSERTS** - Offer desserts carousel
   - Buttons: "Add Desserts" / "Skip" / "Checkout"
   - Next: SHOW_DESSERTS_CAROUSEL or COLLECT_LOCATION

10. **SHOW_DESSERTS_CAROUSEL** - Desserts with images
    - Next: DESSERT_SELECTED or COLLECT_LOCATION

11. **COLLECT_LOCATION** - Ask for delivery address
    - Next: GENERATE_PAYMENT

12. **GENERATE_PAYMENT** - Create payment link + push to webhook
    - Display: Payment link button
    - Next: FLOW_END

## LOCATION FLOW

### Steps:
1. **FLOW_START** - User asks for locations
   - Next: SHOW_LOCATION_CAROUSEL

2. **SHOW_LOCATION_CAROUSEL** - Display 5 locations
   - Images + addresses + "Get Directions" buttons
   - Next: LOCATION_SELECTED or FLOW_END

3. **LOCATION_SELECTED** - User clicks Get Directions
   - Opens Google Maps in webview
   - Next: FLOW_END

## SUPERCARD FLOW

### Steps:
1. **FLOW_START** - User asks about Supercard
   - Gemini searches FAQ/QA database
   - Next: SHOW_ANSWER

2. **SHOW_ANSWER** - Display FAQ answer
   - Next: OFFER_CARD

3. **OFFER_CARD** - Show "GET CARD" button with image
   - Webview: /cards page
   - Next: FLOW_END

## TRACKING FLOW

### Steps:
1. **FLOW_START** - User wants to track order
   - Random choice: Webview or Text input
   - Next: SHOW_WEBVIEW or ASK_TRACKING_ID

2. **SHOW_WEBVIEW** - Display /track page button
   - Next: FLOW_END

3. **ASK_TRACKING_ID** - Request tracking number
   - Next: SHOW_TRACKING_STATUS

4. **SHOW_TRACKING_STATUS** - Display "Getting delivered in 21 Mins"
   - Formatted nicely with emoji
   - Next: FLOW_END

## COMPLAINT FLOW

### Steps:
1. **FLOW_START** - User complains
   - Display: Warm apology message
   - Next: ESCALATE_HUMAN

2. **ESCALATE_HUMAN** - Transfer to live agent
   - Set needsHuman flag
   - Display: "Connecting you to our team..."
   - Next: FLOW_END

## Flow State Indicators

### Visual Representation:
- 🔴 **Red Circle** - Flow active (user mid-conversation)
- 🟢 **Green Circle** - Flow completed successfully
- ⚪ **Gray Circle** - No active flow
- 🔶 **Orange Circle** - Flow paused/waiting for user

### Database Tracking:
- `currentFlow`: order | location | supercard | tracking | complaint | faq | null
- `flowStep`: Exact step name from above (e.g., "ASK_DRINKS", "SHOW_PRODUCT_CAROUSEL")
- `flowData`: JSON object with cart, selections, etc.
