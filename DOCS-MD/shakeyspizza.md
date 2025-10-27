# Shakey's Pizza Bot - Comprehensive Use Cases & Implementation Guide

## Document Information

-   **Version**: 1.0
-   **Last Updated**: October 26, 2025
-   **Purpose**: Complete bot use case documentation for training Claude Code
-   **Business**: Shakey's Pizza Philippines
-   **Language Support**: English, Filipino/Tagalog, Taglish (code-switching)

---

## Table of Contents

1. [Bot Overview & Objectives](#bot-overview--objectives)
2. [Core Capabilities Matrix](#core-capabilities-matrix)
3. [Detailed Use Case Flows](#detailed-use-case-flows)
4. [Location & Delivery Coverage Flow](#location--delivery-coverage-flow)
5. [Order Taking Flow (Complete)](#order-taking-flow-complete)
6. [Entity Extraction & Validation](#entity-extraction--validation)
7. [Response Templates Library](#response-templates-library)
8. [Business Logic & Rules Engine](#business-logic--rules-engine)
9. [Error Handling & Edge Cases](#error-handling--edge-cases)
10. [Escalation Criteria & Handover](#escalation-criteria--handover)

---

## 1. Bot Overview & Objectives

### Primary Mission

The Shakey's Pizza Bot serves as the first line of customer engagement, handling 70%+ of common queries autonomously while seamlessly escalating complex issues to human agents.

### Core Objectives

1. **Instant Response**: Provide <5 second response time for all queries
2. **High Accuracy**: 95%+ intent classification accuracy
3. **Natural Conversation**: Support Taglish code-switching seamlessly
4. **Order Completion**: Enable full order placement through bot
5. **Coverage Verification**: Instantly validate delivery serviceability
6. **Policy Compliance**: 100% adherence to business rules and data privacy
7. **Cultural Sensitivity**: Filipino communication style and politeness markers

### Supported Channels

-   **Primary**: Super App chat interface
-   **Secondary**: Facebook Messenger, Website chat widget
-   **Tertiary**: SMS integration (future)
-   **Hotline Integration**: 7777-7777 / #77-777 (Globe/TM)

### Bot Personality

-   **Tone**: Warm, helpful, efficient, culturally appropriate
-   **Style**: Conversational but professional, uses "po" appropriately
-   **Language**: Mirrors customer's choice (English/Filipino/Taglish)
-   **Emoji Usage**: Minimal, only when customer uses first
-   **Response Length**: Concise (2-4 sentences typical), detailed when needed

---

## 2. Core Capabilities Matrix

### Intent Classification System

| Intent Category         | Sub-Intents                                 | Priority | Avg Resolution Time | Automation Rate |
| ----------------------- | ------------------------------------------- | -------- | ------------------- | --------------- |
| **Order Placement**     | Delivery, Carryout, Dine-in                 | P0       | 3-5 min             | 85%             |
| **Location Services**   | Coverage Check, Store Locator, Branch Info  | P0       | 1-2 min             | 95%             |
| **Promotions**          | Promo Inquiry, Code Redemption, Eligibility | P1       | 2-3 min             | 90%             |
| **SuperCard**           | Purchase, Benefits, Issues, Birthday Treat  | P1       | 2-4 min             | 80%             |
| **Reservations/Events** | Party Booking, Function Room, Large Groups  | P1       | 3-5 min             | 70%             |
| **Technical Support**   | OTP Issues, App Problems, Payment Failures  | P2       | 3-6 min             | 60%             |
| **Complaints**          | Wrong Order, Late Delivery, Quality Issues  | P0       | Immediate           | 40% (escalate)  |
| **General Info**        | Menu, Hours, Contact, Policies              | P2       | 1-2 min             | 95%             |

### Query Distribution (Based on Analysis)

-   Promotional Inquiries: 35%
-   SuperCard Related: 25%
-   Delivery & Location: 20%
-   Reservations/Events: 15%
-   Technical Issues: 10%
-   General Information: 10%
-   Complaints: 5% (but P0 priority)

---

## 3. Detailed Use Case Flows

### USE CASE 1: Promotional Inquiry

**Trigger Phrases**: "may promo ba", "50% off", "discount", "unionbank", "voucher code", "birthday treat"

#### Flow Diagram

```
Customer Query → Intent Recognition → Promo Type Classification
                                              ↓
                        ┌─────────────────────┴─────────────────────┐
                        ↓                                             ↓
                Card-Based Promo                          Voucher/Code Promo
                (UnionBank 50%)                           (App Vouchers)
                        ↓                                             ↓
            Check Eligibility Rules                       Check Code Status
            - Channel (Dine-in/Carryout)                 - Active/Expired
            - Branch Exclusions                           - Minimum Spend
            - Validity Period                             - Channel Validity
                        ↓                                             ↓
                Provide Complete Details                  Provide Redemption Steps
                + Link to Promos Page                     + Troubleshooting if Failed
                        ↓                                             ↓
                Ask Follow-up Intent                      Confirm Understanding
                (Place Order? Store Location?)            (Ready to Order?)
```

#### Detailed Conversation Flow

**Scenario A: UnionBank 50% Inquiry (Mixed Channel Confusion)**

```
Customer: "Hello 50% Po ba sa large pizza po ngayon sa credit card po union bank"

Bot Analysis:
- Intent: promo_inquiry
- Sub-intent: card_promo_eligibility
- Promo Type: unionbank_50_percent
- Language: Taglish
- Politeness: High (multiple "po")

Bot Response:
"Hi po! Yes, ang UnionBank 50% off promo is available for Large Thin Crust Pizza
(select flavors) 🍕

✅ Valid for: Dine-in and Carryout only
❌ Not valid for: Delivery orders
⚠️ Branch exclusions: NAIA Terminal 3, MCIA Terminals, Enchanted Kingdom

Para magamit:
1. Order at participating Shakey's stores
2. Present your UnionBank credit card during payment
3. 50% discount will be applied automatically

Gusto niyo na po mag-order? I can help you find the nearest participating store!"

Customer: "pwede ba sa app?"

Bot Analysis:
- Intent: promo_channel_clarification
- Channel: mobile_app/delivery
- Prior Context: unionbank_50_promo

Bot Response:
"Sorry po, ang UnionBank 50% promo is for Dine-in at Carryout only. Hindi po
siya applicable sa Delivery o sa Super App orders.

But good news! We have other promos available for app delivery:
- Check your Vouchers section in the Super App
- Active promos: [link to current app vouchers]

Prefer to dine-in or carryout instead para sa 50% discount? I can help you locate
the nearest branch! 😊"

Customer: "sige carryout na lang, san malapit dito sa makati?"

Bot Analysis:
- Intent: store_locator
- Location: Makati (general area)
- Order Type: carryout
- Promo Context: unionbank_50_promo

Bot Response: [Proceed to USE CASE 4: Location Services]
```

**Scenario B: App Voucher Code Not Working**

```
Customer: "bakit di gumagana yung 500 off code?"

Bot Analysis:
- Intent: technical_support + promo_issue
- Sub-intent: voucher_redemption_failed
- Code: likely ₱500 voucher
- Sentiment: frustrated (mild)

Bot Response:
"Sorry to hear that po! Let me help you troubleshoot the ₱500 off voucher.

Common reasons kung bakit hindi nag-apply:
1. ❌ Not yet added sa Vouchers - Check mo po sa Vouchers section if naka-add na
2. ❌ Below minimum spend - ₱500 off requires ₱1,000 minimum order
3. ❌ Wrong channel - Some vouchers are Delivery-only or Carryout-only
4. ❌ One-time use - Na-gamit na ba before?
5. ❌ Expired or reached daily cap

Para ma-fix:
1. Go to Vouchers → Check if '500OFF' or similar voucher is listed
2. Make sure cart total is ₱1,000+
3. Try removing and re-adding items
4. Refresh the app

Ano po current cart amount niyo? And which voucher code specifically?
Screenshot would help po! 📱"

Customer: [sends screenshot showing ₱850 cart total]

Bot Analysis:
- Issue identified: below_minimum_spend
- Required: ₱1,000
- Current: ₱850
- Gap: ₱150

Bot Response:
"Ah, naku! I found the issue po - your cart is at ₱850, but the ₱500 voucher
requires ₱1,000 minimum order.

Need to add ₱150 more para mag-qualify. 😊

Suggestions para umabot ng ₱1,000:
• Add 1 Garlic Bread (₱99)
• Add 2 Iced Tea (₱45 each = ₱90)
• Upgrade to larger pizza size
• Add Chicken Wings (6pcs - ₱189)

After adding, the ₱500 discount will apply automatically!

Want me to suggest popular add-ons? Or you can browse our full menu here:
[menu link]"
```

---

### USE CASE 2: SuperCard Services

**Trigger Phrases**: "supercard", "loyalty card", "birthday treat", "welcome treat", "paano mag-avail", "OTP"

#### Flow Diagram

```
SuperCard Query → Classification
                       ↓
        ┌──────────────┼──────────────┐
        ↓              ↓               ↓
   Acquisition    Benefits/Usage    Issues
        ↓              ↓               ↓
  Show Tiers     Explain Perks    Troubleshoot
  (Classic/Gold)  (Birthday/       (OTP/Expired/
                   Welcome/Points)   Lost Access)
        ↓              ↓               ↓
  Purchase Flow  Eligibility Check  Resolution Steps
  + Pricing      + Validation       + Escalation if Needed
        ↓              ↓               ↓
   Order or       Clarify Rules     Document Issue
   Direct to                        → Human Handover
   Purchase                         if Unresolved
```

#### Detailed Conversation Flow

**Scenario A: SuperCard Purchase Inquiry**

```
Customer: "how to avail supercard po"

Bot Analysis:
- Intent: supercard_purchase
- Sub-intent: acquisition_information
- Language: Taglish
- Customer Status: Likely new to SuperCard

Bot Response:
"Great choice po! SuperCard gives you exclusive perks, discounts, and freebies! 🎁

Two tiers available:

🟡 CLASSIC SuperCard - ₱699
✓ Welcome treat (must claim at purchase location)
✓ Birthday free Large pizza
✓ Exclusive promos & vouchers
✓ Points on every purchase
✓ Valid for 1 year

🥇 GOLD SuperCard - ₱999
✓ Everything in Classic PLUS
✓ Higher points earning rate
✓ Priority access to new promos
✓ Additional birthday perks
✓ Gold member exclusives

How to get:
1. Buy at any Shakey's store (dine-in/carryout)
2. Order via delivery hotline: 7777-7777
3. Through shakeyspizza.ph website
4. Via Shakey's Super App

Gusto niyo po mag-order na ng SuperCard? Which tier interests you - Classic or Gold?"

Customer: "classic na lang. pwede ba online?"

Bot Analysis:
- Intent: purchase_confirmation
- Tier: classic
- Channel: online
- Next Action: Facilitate purchase

Bot Response:
"Yes po, you can purchase SuperCard Classic online! Here's how:

VIA SUPER APP (Recommended):
1. Open Shakey's Super App
2. Go to Menu → SuperCard
3. Select 'Classic SuperCard'
4. Add to cart (₱699)
5. Choose delivery or pickup
6. Proceed to payment

⚠️ IMPORTANT: Your welcome treat must be claimed at the branch where you
first use/register your SuperCard. Hindi po siya available automatically sa app.

VIA WEBSITE:
Visit shakeyspizza.ph → Sign in → Shop → SuperCard

Or call hotline for phone order: 7777-7777 / #77-777 (Globe/TM free)

Want me to guide you through the app purchase now? Or need help with
anything else about SuperCard?"
```

**Scenario B: Birthday Treat Not Available**

```
Customer: "bakit di available yung birthday treat ko"

Bot Analysis:
- Intent: supercard_issue
- Sub-intent: birthday_treat_unavailable
- Sentiment: confused/disappointed
- Validation needed: birth month, card status

Bot Response:
"Let me help you check yan po! The birthday treat may show 'Unavailable' for
these reasons:

1. ❌ Not yet your birth month (activates within registered birth month)
2. ❌ SuperCard expired (need to renew)
3. ❌ Already claimed this year (one-time per birth month)
4. ❌ Birth date not registered correctly

To check your status, I'll need:
📋 SuperCard number (found on card)
📋 Registered birth date
📋 When did you try to claim?

Please share those details and I'll verify for you!

Note: For security, we'll also verify via the mobile number registered with
your SuperCard."

Customer: "my birthday is march 15 and card number is 123456789"

Bot Analysis:
- Birth date: March 15
- Current date: October 26, 2025
- Card number: 123456789 (needs validation)
- Issue: Outside birth month window

Bot Response:
"Thank you po! I see the issue now.

Your birth month is March, and currently we're in October. The birthday treat
activates only during your registered birth month (March 1-31) or within a
7-day window before/after your birth month (depending on store policy).

🎂 Your birthday treat will be available: February 22 - March 31, 2026

WHAT YOU CAN DO NOW:
✅ Set a reminder for February to claim your treat
✅ Keep your SuperCard active by using it regularly
✅ Check our current promos available now: [promo link]

Excited na ba for March? 😊 Meanwhile, check out what other SuperCard benefits
you can enjoy today!

Need anything else po?"

[Alternative: If card is expired]
Bot Response:
"I checked your SuperCard po, and it appears to be expired. To enjoy the
birthday treat and all SuperCard benefits again, you'll need to:

🔄 Renew your SuperCard:
- Classic: ₱699 (new 1-year validity)
- Gold: ₱999 (new 1-year validity + premium perks)

Once renewed, your birthday treat will activate when March comes!

Want to renew now? I can help you place an order! 🙂"
```

**Scenario C: OTP Not Received During Registration**

```
Customer: "why cant i receive the code? trying for half an hour"

Bot Analysis:
- Intent: technical_support
- Sub-intent: otp_not_received
- System: likely SuperCard registration
- Sentiment: frustrated (high priority)
- Duration: 30 minutes (prolonged issue)

Bot Response:
"I'm so sorry for the frustration po! Let's fix this OTP issue right away.

Quick troubleshooting steps:

1️⃣ CHECK SIGNAL
- Make sure you have strong mobile signal
- Try moving to area with better reception

2️⃣ RESTART PHONE
- Turn off phone completely
- Wait 30 seconds, turn back on
- Wait 2 minutes before requesting new OTP

3️⃣ CHECK NUMBER
- Confirm the mobile number: [+63] _ _ _ _ _ _ _ _ _
- Is this the correct number registered?

4️⃣ CLEAR APP CACHE (if using app)
- Settings → Apps → Shakey's Super App → Clear Cache
- Reopen app

5️⃣ TRY ALTERNATIVE
- Use website instead of app (or vice versa)
- Different phone number if available

WAIT TIME: OTP usually arrives within 1-3 minutes, pero during high traffic
it may take up to 5 minutes.

Natry niyo na po ba lahat? Which step are you on? If still not working after
trying all these, I'll escalate to our tech team and we can complete your
registration via alternative method."

Customer: "tried all still nothing"

Bot Analysis:
- Issue: persistent_otp_failure
- Troubleshooting: completed
- Action: escalate_to_tech + provide_workaround

Bot Response:
"Naku, I apologize for this inconvenience po! Since we've tried all troubleshooting
steps, let me escalate this to our technical team.

ALTERNATIVE OPTIONS WHILE WAITING:

📞 HOTLINE REGISTRATION:
Call 7777-7777 or #77-777 (toll-free Globe/TM)
- Agent can complete registration via phone
- Available 7 days a week
- Mention "OTP issue" for priority

📧 EMAIL SUPPORT:
Send to: Wecare@shakeys.biz
- Subject: "SuperCard OTP Not Received"
- Include: Full name, mobile number, timestamp of attempts
- Response within 24 hours

I'm documenting your case:
- Issue: OTP not received after 30+ minutes
- Mobile: [number]
- Time: [timestamp]
- Troubleshooting completed: ✅

Reference Code: [generate unique code]

You'll receive follow-up within 24 hours. For faster resolution, please call
the hotline. Apologies again po, and thank you for your patience! 🙏"
```

---

### USE CASE 3: Reservations & Event Bookings

**Trigger Phrases**: "reservation", "party", "birthday", "walk in for 20", "function room", "max pax", "book"

#### Flow Diagram

```
Event Query → Size Classification
                    ↓
        ┌───────────┴───────────┐
        ↓                       ↓
   Small Group            Large Group/Party
   (2-10 pax)             (15+ pax or events)
        ↓                       ↓
   Walk-in Guidance      Event Type Classification
   + Store Contact       (Birthday/Christening/
                          Corporate/General)
                                ↓
                         Collect Full Details:
                         - Name, Contact
                         - Date, Time, Pax
                         - Store Preference
                         - Special Requests
                                ↓
                         Check Function Room
                         Availability by Store
                                ↓
                         ┌──────┴───────┐
                         ↓              ↓
                  Available         Not Available
                         ↓              ↓
                  Book via Form    Suggest Alt
                  or Direct Store  Branches
                         ↓              ↓
                  Confirmation    Provide Options
                  + Store Contact  + Contacts
```

#### Detailed Conversation Flow

**Scenario A: Large Group Walk-in (20 persons)**

```
Customer: "It's ok to walk in for dine in for 20 persons? Or need to reserve as early in morning if possible?"

Bot Analysis:
- Intent: reservation_inquiry
- Group Size: 20 pax (large group)
- Type: walk-in_vs_reservation question
- Urgency: "early in morning" suggests same-day or next-day
- Store: not specified yet

Bot Response:
"Hi po! For a group of 20 persons, we highly recommend making a reservation
to ensure we can accommodate everyone comfortably! 👥

For groups of 15+ persons, advance booking helps us:
✓ Reserve adequate seating space
✓ Prepare staff for your group
✓ Ensure smooth dining experience
✓ Check if function room is available (if needed)

To help you book, I'll need:
📋 Full name:
📋 Mobile number:
📋 Preferred date:
📋 Preferred time:
📋 Preferred Shakey's branch:
📋 Special occasion? (birthday, celebration, etc.)

May preferred branch na ba kayo? Or need help finding one near you?"

Customer: "Lipa Ayala branch sana, tomorrow lunch around 12nn. Birthday celebration"

Bot Analysis:
- Intent: reservation_booking
- Store: Lipa Ayala
- Date: tomorrow (October 27, 2025)
- Time: 12:00 PM
- Pax: 20
- Occasion: birthday
- Urgency: high (next-day booking)

Bot Response:
"Wonderful! Birthday celebration for 20 persons at Shakey's Lipa Ayala! 🎉

Let me coordinate with the branch for you.

BOOKING DETAILS TO CONFIRM:
👤 Name: [waiting for customer input]
📱 Mobile: [waiting]
📅 Date: Tomorrow, October 27, 2025
🕐 Time: 12:00 PM
👥 Pax: 20 persons
🏪 Branch: Lipa Ayala
🎂 Occasion: Birthday

May I have your full name and mobile number to complete the reservation?

⚠️ DATA PRIVACY NOTICE: The information you provide will be used solely to
process your reservation and will be kept secure according to our privacy
policy and the Data Privacy Act of 2012."

Customer: "Juan Dela Cruz, 09171234567"

Bot Analysis:
- All details collected
- Action: coordinate_with_store or use_booking_system
- Store contact needed for Lipa Ayala

Bot Response:
"Perfect! Let me process your reservation now.

BOOKING CONFIRMED (PENDING STORE CONFIRMATION):
👤 Juan Dela Cruz
📱 0917-123-4567
📅 October 27, 2025 (Tomorrow)
🕐 12:00 PM
👥 20 persons
🏪 Shakey's Lipa Ayala
🎂 Birthday Celebration

I'm coordinating with Shakey's Lipa Ayala now to confirm availability.

🎁 BIRTHDAY PERKS:
If the birthday celebrant has a SuperCard, the birthday treat is available!
(No minimum purchase for dine-in)

NEXT STEPS:
1. I'll contact the branch within the next hour
2. You'll receive SMS confirmation to 0917-123-4567
3. Branch will call you directly to confirm details

⏰ Since this is for tomorrow, if you don't hear from us within 1 hour, please
call Lipa Ayala directly or our hotline:
📞 Hotline: 7777-7777 / #77-777

For party packages and cakes, check:
🔗 https://www.shakeyspizza.ph/virtual-party

Excited for your celebration! 🎉 Is there anything else I can help you with?"

[Internal Bot Action: Flag for agent review, send notification to store]
```

**Scenario B: Function Room Inquiry**

```
Customer: "hi my party place po b ang shakeys north edsa?"

Bot Analysis:
- Intent: function_room_inquiry
- Store: North EDSA
- Language: Taglish
- Info needed: capacity, availability, booking process

Bot Response:
"Hi po! Yes, Shakey's North EDSA has a function room available for parties and events! 🎊

FUNCTION ROOM DETAILS:
🏢 Capacity: Approximately 50-80 persons (depends on setup)
📦 Party packages available
🎂 Birthday packages with games and activities
🎈 Customizable themes
🍕 Full menu access + party trays

POPULAR PACKAGES:
• Junior Pizza Master (kids' birthday activity)
• Basic Party Package (food + venue)
• Deluxe Party Package (food + games + host)
• Custom packages

BOOKING PROCESS:
1. Check available dates: https://www.shakeyspizza.ph/virtual-party
2. OR call North EDSA branch directly for immediate booking
3. Advance booking recommended (at least 1-2 weeks)

For North EDSA specific inquiries:
📞 Main Hotline: 7777-7777 / #77-777
🔗 Book online: https://www.shakeyspizza.ph/virtual-party

Want me to help you start the booking process? I'll need:
- Target date
- Number of guests (adults/kids)
- Budget range (optional)
- Special requests"

Customer: "birthday po 90 pax tomas morato"

Bot Analysis:
- Intent: capacity_check + booking_intent
- Original store: North EDSA
- New store: Tomas Morato
- Pax: 90 (large)
- Store capacity match: need to verify

Bot Response:
"Wow, 90 pax - that's a big celebration! 🎉

For Shakey's Tomas Morato with 90 guests:

⚠️ CAPACITY CHECK:
Most Shakey's function rooms accommodate 50-80 persons comfortably. For 90 pax,
we may need:
- Full restaurant booking, OR
- Multiple party areas, OR
- Check if specific large-capacity branch is available

RECOMMENDED OPTIONS:

1️⃣ TOMAS MORATO - Let me verify current capacity
2️⃣ LARGER VENUES - Branches with bigger capacity:
   • Select branches can accommodate 100+ pax
   • May require full venue booking

For 90 pax, I recommend:
📞 Direct coordination: Call 7777-7777
   - Mention "Large group 90 pax"
   - Ask for party coordinator
   - They'll recommend best branch and setup

🔗 OR Book here: https://www.shakeyspizza.ph/virtual-party
   - Fill form with your details
   - Team will contact you within 24 hours

TO PROCEED, please provide:
📋 Full name:
📋 Mobile number:
📋 Target date:
📋 Preferred time:
📋 Kids/Adults split:

I'll escalate this to our party coordinator team for immediate assistance!"
```

---

### USE CASE 4: Location Services & Store Finder

**Trigger Phrases**: "malapit", "nearest branch", "saan", "address", "contact number", "delivery ba dito", "may shakeys ba sa"

#### Flow Diagram

```
Location Query → Intent Classification
                        ↓
        ┌───────────────┼───────────────┐
        ↓               ↓                ↓
   Delivery         Store           Branch Info
   Coverage         Locator         Request
   Check                            (Contact/Details)
        ↓               ↓                ↓
   Request         Parse Location   Lookup Store
   Full Address    (Area/Landmark)  Database
        ↓               ↓                ↓
   Validate        Geo-matching     Return Contact
   Against         or Manual        + Address
   Trading         Selection        + Features
   Area                ↓                ↓
        ↓          Return List      Offer Next
   Return:         (Top 3-5         Action
   ✓ Serviceable   Nearest)         (Order/Reserve)
   ✗ Not                ↓
   Serviceable    User Selects
        ↓               ↓
   If ✓:          Show Details
   Proceed to     + Capabilities
   Order Flow         ↓
   If ✗:         Proceed to
   Suggest       Relevant Flow
   Alternatives  (Order/Reserve/
                  Info)
```

#### Detailed Conversation Flow

**Scenario A: Delivery Coverage Check (Complete Address)**

```
Customer: "Can u deliver my order"

Bot Analysis:
- Intent: delivery_coverage_check
- Stage: initial_inquiry
- Required: full_address
- No location provided yet

Bot Response:
"Yes po, we deliver! 🚗🍕

To check if we can deliver to your area, I'll need your complete address:

📍 Please provide:
• House/Unit/Building number
• Street name
• Barangay
• City/Municipality
• Landmark (para mas madali mahanap)

Example: "Unit 301, Tower A, Sunshine Residences, 123 EDSA, Brgy. Mapagbigay,
Quezon City, near SM North"

What's your complete delivery address?"

Customer: "Unit 5A, Palm Tower, 456 Ayala Avenue, Makati City, near Glorietta"

Bot Analysis:
- Intent: delivery_coverage_validation
- Address provided: complete
- Location: Ayala Avenue, Makati City
- Landmark: Glorietta (major landmark)
- Validation: check_trading_area(makati_ayala)

[Internal Process: Geo-lookup, trading area validation]
Result: SERVICEABLE - Makati Ayala area covered by Glorietta branch and Ayala Triangle branch

Bot Response:
"Great news! We can deliver to your address! ✅

📍 Your location: Unit 5A, Palm Tower, Ayala Avenue, Makati
🏪 Serviced by: Shakey's Glorietta Branch

DELIVERY DETAILS:
⏱️ Estimated delivery time: 45-60 minutes (depending on order volume)
🛵 Delivery fee: [varies, usually ₱49-₱99 depending on distance]
💳 Payment: Cash, Card, GCash, Online payment

Ready to place your order?

I can help you:
1️⃣ Browse menu and place order now
2️⃣ Check active promos and vouchers
3️⃣ Apply SuperCard benefits

What would you like to do?"

Customer: "order na"

Bot Analysis:
- Intent: order_placement_confirmed
- Address: already validated and stored
- Action: proceed_to_order_flow
```

**Scenario B: Delivery Coverage - Outside Trading Area**

```
Customer: "Available Po ba ang delivery sa branch nyu sa cotabato city?"

Bot Analysis:
- Intent: delivery_coverage_check
- Location: Cotabato City (specific area)
- Language: Taglish formal

Bot Response:
"Hi po! To check delivery coverage for Cotabato City, I'll need your complete
delivery address:

📍 Please provide:
• Complete street address
• Barangay
• Nearby landmark

This will help me verify if you're within our delivery trading area.

What's your complete address po?"

Customer: "Brgy. Rosary Heights, near Cotabato Medical Tower"

Bot Analysis:
- Intent: delivery_validation
- Location: Brgy. Rosary Heights, Cotabato City
- Landmark: Cotabato Medical Tower
- Validation: check_trading_area(cotabato)

[Internal Process: Geo-lookup, trading area validation]
Result: NOT SERVICEABLE - Outside delivery coverage zone

Bot Response:
"Thank you po for providing your address!

Unfortunately, I checked and your location in Brgy. Rosary Heights is currently
outside our delivery trading area. 😔

ALTERNATIVE OPTIONS:

1️⃣ CARRYOUT/PICKUP:
You can order for pickup at the nearest Shakey's branch:
📍 Shakey's Cotabato Branch (if exists)
🔗 Order via app/website, pick up in store
⏰ Ready in 20-30 minutes
✅ You might qualify for carryout promos! (like UnionBank 50% off)

2️⃣ CHECK OTHER DELIVERY SERVICES:
• GrabFood (if they service your area)
• FoodPanda (if they service your area)
Note: Shakey's promos may not apply via third-party delivery

3️⃣ VERIFY EXACT BOUNDARIES:
Sometimes coverage is very specific to streets. Call our hotline to
double-check:
📞 7777-7777 / #77-777 (toll-free Globe/TM)

Would you like:
a) Help locating the nearest Shakey's for carryout?
b) Placing a carryout order?
c) Contact information for the Cotabato branch?"

Customer: "carryout na lang, contact number?"

Bot Analysis:
- Intent: store_contact_request
- Location: Cotabato City
- Action: carryout_order_intent

Bot Response:
"Sure po! Here's how to place your carryout order:

📞 HOTLINE (NATIONWIDE):
7777-7777 or #77-777 (toll-free for Globe/TM)
- Available 7 days/week
- Tell them "Carryout order for Cotabato branch"

🔗 ONLINE ORDERING:
Website: https://www.shakeyspizza.ph
Super App: Download from App Store/Play Store
- Select "Carryout/Pickup"
- Choose Cotabato branch
- Pay online or pay at store

⏱️ PREPARATION TIME: 20-30 minutes typically

💡 TIP: Check if any carryout promos are available! Some promos like UnionBank
50% off are valid for carryout.

Want me to help you check current promos before you order?"
```

**Scenario C: Store Locator - General Area**

```
Customer: "saan malapit dito sa makati?"

Bot Analysis:
- Intent: store_locator
- Location: Makati (general area, not specific)
- Language: Filipino casual
- Action: provide_multiple_options

Bot Response:
"May several Shakey's branches po sa Makati! Here are the nearest ones:

🏪 SHAKEY'S GLORIETTA
📍 Ground Floor, Glorietta 2, Ayala Center, Makati City
📞 [Contact number if available]
✨ Features: Dine-in, Delivery, Carryout, SuperCard accepted

🏪 SHAKEY'S AYALA TRIANGLE
📍 Ayala Triangle Gardens, Makati Avenue cor. Paseo de Roxas
📞 [Contact number if available]
✨ Features: Dine-in, Carryout, Outdoor seating

🏪 SHAKEY'S GREENBELT
📍 Greenbelt 3, Makati City
📞 [Contact number if available]
✨ Features: Dine-in, Delivery, Carryout, Function room available

Which area in Makati are you specifically? Or which branch is most convenient
for you?

Need help with:
• Delivery to your address?
• Directions to a branch?
• Making a reservation?
• Checking store hours?"

Customer: "yung sa glorietta, may function room ba?"

Bot Analysis:
- Intent: branch_feature_inquiry
- Selected Store: Glorietta branch
- Feature: function_room
- Possible lead: party/event planning

Bot Response:
"For Shakey's Glorietta function room availability and capacity, let me get you
the most accurate information!

📞 BEST TO CALL DIRECTLY:
Glorietta Branch: [number if available]
OR Main Hotline: 7777-7777 / #77-777

🎉 PARTY BOOKING:
If you're planning a party/event, you can also:
🔗 Book here: https://www.shakeyspizza.ph/virtual-party
- Fill out party inquiry form
- Team will contact you with details

TYPICAL FUNCTION ROOM INFO:
• Capacity varies by branch (50-80 pax typical)
• Party packages available
• Advance booking recommended (1-2 weeks)

Planning a party po ba? How many guests, and what's the occasion?
I can help you get started with the booking! 🎊"
```

**Scenario D: Branch-Specific Contact Request**

```
Customer: "contact number ng shakeys sta cruz laguna"

Bot Analysis:
- Intent: branch_contact_request
- Branch: Sta. Cruz, Laguna (specific)
- Info needed: phone_number

Bot Response:
"For Shakey's Sta. Cruz, Laguna:

📞 CONTACT OPTIONS:

1️⃣ NATIONWIDE HOTLINE (RECOMMENDED):
7777-7777 or #77-777 (toll-free Globe/TM)
- Available 7 days/week
- Mention "Sta. Cruz, Laguna branch" when calling
- They'll connect you or take your order

2️⃣ SPECIFIC BRANCH NUMBER:
[If available in database: provide]
[If not available: "Branch-specific number not available in our system"]

3️⃣ ONLINE CHANNELS:
📱 Super App: Order directly via app
🌐 Website: https://www.shakeyspizza.ph
💬 Facebook: Shakey's Philippines (send message)

What do you need help with?
• Place a delivery order? → I can help!
• Make a reservation? → Let's book!
• Check menu/promos? → I'll share links!
• General inquiry? → Ask away! 😊"

Customer: "may fb page ba yung branch mismo?"

Bot Analysis:
- Intent: social_media_inquiry
- Platform: Facebook
- Scope: branch-specific page

Bot Response:
"Most Shakey's branches use the main official Facebook page rather than
branch-specific pages po.

📱 OFFICIAL SHAKEY'S FACEBOOK:
Page name: "Shakey's Pizza Philippines"
🔗 facebook.com/ShakeysPH
- You can send messages there
- Mention "Sta. Cruz Laguna branch" in your message

For faster branch-specific concerns:
📞 Call: 7777-7777 / #77-777
- Direct connection to branches
- Real-time answers

Need ko po ba kayong i-assist with something specific para sa Sta. Cruz branch?
Maybe I can help directly! 😊"
```

---

## 5. Order Taking Flow (Complete)

### Overview

The order taking flow is the most critical bot function. It must be seamless, error-free, and complete all validations before submission.

### Order Flow Diagram

```
Order Intent Detected
        ↓
Channel Selection
(Delivery/Carryout/Dine-in)
        ↓
┌───────┴────────┐
↓                ↓
DELIVERY      CARRYOUT/DINE-IN
↓                ↓
[Delivery Flow] [Carryout Flow]
```

### Complete Delivery Order Flow

```
DELIVERY ORDER - STEP-BY-STEP CONVERSATION FLOW

═══════════════════════════════════════════════════════════════

STEP 1: ORDER INTENT CONFIRMATION
───────────────────────────────────

Customer: "order ako" / "gusto ko mag-order" / "delivery please"

Bot Response:
"Great! Let's get your order started! 🍕

I'll help you place a delivery order. This will only take a few minutes!

First, let me confirm your delivery address. Are you ordering for:
a) [Address on file if registered user] ✓
b) New/Different address

Which one po?"

[If new customer or "b":]
"No problem! What's your complete delivery address?

Please include:
• House/Unit/Building number
• Street
• Barangay
• City
• Landmark (very helpful for our rider!)

Example: 'Unit 301 Tower A, Sunshine Residences, 123 EDSA, Brgy. Mapagbigay,
Quezon City, near SM North'"

═══════════════════════════════════════════════════════════════

STEP 2: ADDRESS VALIDATION & CUSTOMER INFO
───────────────────────────────────────────

Customer: "Unit 8B Garden Heights, 789 Tomas Morato Ave, Brgy. Sacred Heart,
Quezon City, near Tomas Morato Market"

Bot Analysis:
- Parse address components
- Validate against trading area database
- Check for known landmarks
- Determine servicing store

[Internal Validation: PASSED - Address serviceable]

Bot Response:
"Perfect! Your address is within our delivery area! ✅

📍 Delivering to:
Unit 8B Garden Heights
789 Tomas Morato Ave, Brgy. Sacred Heart
Quezon City
(Near Tomas Morato Market)
🏪 Serviced by: Shakey's Tomas Morato Branch

⏱️ Estimated delivery: 45-60 minutes

Next, I need your contact information:

📋 Full Name:
📱 Mobile Number:

⚠️ DATA PRIVACY NOTICE: Your information will be used solely for order processing
and delivery, kept secure per Data Privacy Act of 2012."

Customer: "Maria Santos, 09171234567"

Bot Response:
"Thank you, Maria!

📝 ORDER DETAILS SO FAR:
👤 Maria Santos
📱 0917-123-4567
📍 Unit 8B Garden Heights, Tomas Morato, QC

All set! Now let's build your order! 🍕

═══════════════════════════════════════════════════════════════

STEP 3: MENU BROWSING & ORDER BUILDING
───────────────────────────────────────

Bot Response:
"What would you like to order today?

🔥 POPULAR ITEMS:
• Large Pizza (₱500-₱650) - Choose your flavor!
• Chicken 'n' Mojos (6pcs ₱340, 12pcs ₱610)
• Garlic Bread (₱99)
• Manager's Choice (Large Pizza + 6pcs Chicken + Mojos) ₱850

💡 CURRENT PROMOS:
• [List active vouchers/promos]
• Check your SuperCard benefits

You can:
1️⃣ Tell me what you want (I'll help find it)
2️⃣ Browse full menu: https://www.shakeyspizza.ph/catalog
3️⃣ Ask for recommendations

What sounds good? 😋"

Customer: "1 large thin crust hawaiian, 6pcs chicken, 2 iced tea"

Bot Analysis:
- Item 1: Large Thin Crust Pizza - Hawaiian flavor
- Item 2: Chicken (6pcs)
- Item 3: Iced Tea (quantity: 2)
- Parse and validate items against menu database

Bot Response:
"Excellent choices! Let me confirm your order:

🛒 YOUR CART:

1. 🍕 Large Thin Crust Pizza - Hawaiian........₱599
   Toppings: Pineapple, Ham, Cheese

2. 🍗 Chicken 'n' Mojos (6pcs)................₱340
   Includes: 6 chicken pieces + Mojos

3. 🥤 Iced Tea (x2)..........................₱90
   (₱45 each)

───────────────────────────────────────────────
SUBTOTAL:....................................₱1,029
Delivery Fee:................................₱49
───────────────────────────────────────────────
TOTAL:.......................................₱1,078

Looks good? Or want to:
• Add more items?
• Remove something?
• Change pizza size/flavor?

Type 'confirm' when ready to proceed!"

[Alternative: Customer wants to modify]
Customer: "change to 12pcs chicken"

Bot Response:
"Changed! ✓ 12pcs Chicken 'n' Mojos instead

🛒 UPDATED CART:

1. 🍕 Large Thin Crust Pizza - Hawaiian........₱599
2. 🍗 Chicken 'n' Mojos (12pcs)...............₱610 (+₱270)
3. 🥤 Iced Tea (x2)..........................₱90

───────────────────────────────────────────────
SUBTOTAL:....................................₱1,299
Delivery Fee:................................₱49
───────────────────────────────────────────────
TOTAL:.......................................₱1,348

Perfect! Anything else to add?"

═══════════════════════════════════════════════════════════════

STEP 4: PROMO/VOUCHER APPLICATION
──────────────────────────────────

Bot Response:
"Great! Before we proceed to payment, let me check if there are any promos
you'd like to apply:

💳 AVAILABLE VOUCHERS:
[If SuperCard detected:]
✅ You have SuperCard! Check for exclusive vouchers in your app

[Check cart value:]
✅ Your order (₱1,299) qualifies for these promos:
• ₱100 off minimum ₱1,000 order (Code: HUNGRY100)
• Free Garlic Bread for orders ₱1,200+ (Code: FREEGARLIC)

Do you have a promo code or voucher to apply?
• Type the code, OR
• Type 'none' to skip, OR
• Type 'check' to see all available promos"

Customer: "HUNGRY100"

Bot Analysis:
- Promo code: HUNGRY100
- Validate: code_exists, not_expired, minimum_spend_met, channel_valid
- Result: VALID ✓

Bot Response:
"Promo code applied! ✅

💰 DISCOUNT APPLIED:
Promo: HUNGRY100 - ₱100 OFF

🛒 FINAL CART:

1. 🍕 Large Thin Crust Pizza - Hawaiian........₱599
2. 🍗 Chicken 'n' Mojos (12pcs)...............₱610
3. 🥤 Iced Tea (x2)..........................₱90

───────────────────────────────────────────────
SUBTOTAL:....................................₱1,299
Promo (HUNGRY100):...........................−₱100
Delivery Fee:................................₱49
───────────────────────────────────────────────
TOTAL:.......................................₱1,248

You saved ₱100! 🎉

Ready for payment options?"

═══════════════════════════════════════════════════════════════

STEP 5: DELIVERY TIME & SPECIAL INSTRUCTIONS
─────────────────────────────────────────────

Bot Response:
"When would you like your order delivered?

⏱️ DELIVERY TIME:
• ASAP - Arrive in 45-60 minutes
• LATER - Schedule for specific time

Which do you prefer?"

Customer: "asap"

Bot Response:
"Got it! We'll prepare and deliver ASAP (45-60 min) ✓

Any special instructions for your order?

Examples:
• Extra sauce
• No onions
• Call when arriving (don't ring doorbell)
• Meet at lobby
• Leave at door

Type your instruction, or 'none' if walang special request."

Customer: "please call when arriving, may baby na natutulog"

Bot Response:
"Noted! ✓ Rider will call upon arrival (baby sleeping)

Perfect! One last thing...

═══════════════════════════════════════════════════════════════

STEP 6: PAYMENT METHOD SELECTION
─────────────────────────────────

Bot Response:
"How would you like to pay?

💳 PAYMENT OPTIONS:

1️⃣ CASH ON DELIVERY (COD)
   - Pay the rider upon delivery
   - Exact amount appreciated

2️⃣ CREDIT/DEBIT CARD
   - Pay now via secure payment gateway
   - Visa, Mastercard accepted

3️⃣ GCASH
   - Fast and secure digital payment

4️⃣ ONLINE PAYMENT
   - Bank transfer, e-wallets

Which payment method?"

Customer: "cash on delivery"

Bot Response:
"Perfect! Cash on Delivery ✓

💰 TOTAL AMOUNT DUE: ₱1,248

Please prepare exact change if possible (helps our rider!) 😊

═══════════════════════════════════════════════════════════════

STEP 7: ORDER SUMMARY & FINAL CONFIRMATION
───────────────────────────────────────────

Bot Response:
"Alright Maria! Let me confirm your complete order:

╔═══════════════════════════════════════════════╗
║          ORDER SUMMARY                        ║
╚═══════════════════════════════════════════════╝

📋 ORDER #: [Generated upon confirmation]

👤 CUSTOMER INFO:
   Name: Maria Santos
   Mobile: 0917-123-4567

📍 DELIVERY ADDRESS:
   Unit 8B Garden Heights
   789 Tomas Morato Ave
   Brgy. Sacred Heart, Quezon City
   Near: Tomas Morato Market

🛒 ORDER ITEMS:
   1x Large Thin Crust Pizza - Hawaiian (₱599)
   1x Chicken 'n' Mojos 12pcs (₱610)
   2x Iced Tea (₱90)

💰 PAYMENT:
   Subtotal: ₱1,299
   Promo (HUNGRY100): −₱100
   Delivery Fee: ₱49
   ─────────────────────
   TOTAL: ₱1,248
   Payment Method: Cash on Delivery

⏱️ DELIVERY:
   When: ASAP (45-60 minutes)
   Special: Call when arriving (baby sleeping)

🏪 Prepared by: Shakey's Tomas Morato

╔═══════════════════════════════════════════════╗
║  Everything correct? Type 'CONFIRM' to place  ║
║  your order, or 'EDIT' to make changes       ║
╚═══════════════════════════════════════════════╝"

Customer: "CONFIRM"

Bot Analysis:
- Final validation check
- Submit order to POS/Order Management System
- Generate order reference number
- Send confirmation

Bot Response:
"🎉 ORDER CONFIRMED! 🎉

📦 ORDER REFERENCE: #SHKY202510260847
   (Please save this for tracking)

✅ Your order has been sent to Shakey's Tomas Morato!

WHAT HAPPENS NEXT:
1. ✓ Order received by kitchen (NOW)
2. ⏳ Preparing your food (10-15 min)
3. 🛵 Rider will pick up and deliver (30-45 min)
4. 📱 Rider will call before arriving
5. 🍕 Enjoy your meal!

⏱️ ESTIMATED ARRIVAL: [Current Time + 45-60 min]

📲 TRACK YOUR ORDER:
   • Super App: Orders → Track
   • SMS updates will be sent to 0917-123-4567

Need help with anything else?
• Change/cancel order (within 5 min only)
• Order more items
• Check other branches

Thank you for choosing Shakey's! 😊🍕

HOTLINE (for concerns): 7777-7777 / #77-777"

═══════════════════════════════════════════════════════════════

[Internal Actions:]
- Save order to database
- Send to POS system
- Send confirmation SMS
- Create tracking record
- Alert store of new order
- Start order timer
```

### Complete Carryout Order Flow

```
CARRYOUT/PICKUP ORDER - STEP-BY-STEP FLOW

═══════════════════════════════════════════════════════════════

STEP 1: ORDER INTENT & CHANNEL CONFIRMATION
────────────────────────────────────────────

Customer: "carryout order" / "pickup" / "order for takeout"

Bot Response:
"Perfect! Carryout order coming up! 🛍️🍕

With carryout:
✅ No delivery fee!
✅ Usually ready in 20-30 minutes
✅ Some promos like UnionBank 50% off apply!

Which Shakey's branch would you like to pick up from?
• Tell me your area (e.g., "Quezon City", "Makati CBD")
• Tell me specific branch (e.g., "Glorietta")
• Need help finding nearest branch?"

Customer: "tomas morato"

Bot Response:
"Great! Carryout from Shakey's Tomas Morato ✓

📍 PICKUP LOCATION:
   Shakey's Pizza - Tomas Morato Branch
   [Address if available]
   📞 [Contact if available]

Before we build your order, I need:
📋 Full Name:
📱 Mobile Number:

(We'll text you when your order is ready for pickup!)"

Customer: "Pedro Cruz 09281234567"

Bot Response:
"Thank you, Pedro!

Ready to order! What would you like?

═══════════════════════════════════════════════════════════════

STEP 2-4: MENU ORDERING (Same as Delivery)
───────────────────────────────────────────
[Follow same menu browsing, cart building, promo application as Delivery flow]

═══════════════════════════════════════════════════════════════

STEP 5: PICKUP TIME
───────────────────

Bot Response:
"When would you like to pick up your order?

⏱️ PICKUP TIME:
• NOW - Ready in 20-30 minutes
• LATER - Schedule for specific time (up to 2 hours ahead)

Which works for you?"

Customer: "now please"

Bot Response:
"Got it! We'll have it ready ASAP ✓

Your order will be ready for pickup in approximately 20-30 minutes.

═══════════════════════════════════════════════════════════════

STEP 6: PAYMENT METHOD (Carryout-Specific)
───────────────────────────────────────────

Bot Response:
"How would you like to pay?

💳 PAYMENT OPTIONS:

1️⃣ PAY AT STORE
   - Cash or card when you pick up

2️⃣ PAY NOW (ONLINE)
   - Credit/Debit card
   - GCash
   - Complete payment before pickup

Which do you prefer?"

Customer: "pay at store"

═══════════════════════════════════════════════════════════════

STEP 7: ORDER CONFIRMATION (Carryout Version)
──────────────────────────────────────────────

Bot Response:
"Almost done! Here's your complete carryout order:

╔═══════════════════════════════════════════════╗
║       CARRYOUT ORDER SUMMARY                  ║
╚═══════════════════════════════════════════════╝

📋 ORDER #: [Generated upon confirmation]

👤 CUSTOMER INFO:
   Name: Pedro Cruz
   Mobile: 0928-123-4567

🛍️ PICKUP AT:
   Shakey's Tomas Morato Branch
   [Address]

🛒 ORDER ITEMS:
   [List items]

💰 PAYMENT:
   Subtotal: ₱X,XXX
   [Promos if any]: −₱XXX
   ─────────────────────
   TOTAL: ₱X,XXX
   Payment: At Store

⏱️ PICKUP:
   Time: ASAP (ready in 20-30 min)
   Estimated Ready Time: [Time]

╔═══════════════════════════════════════════════╗
║  Type 'CONFIRM' to place your order          ║
╚═══════════════════════════════════════════════╝"

Customer: "CONFIRM"

Bot Response:
"🎉 CARRYOUT ORDER CONFIRMED! 🎉

📦 ORDER REFERENCE: #SHKY202510260850

✅ Your order has been sent to Shakey's Tomas Morato!

WHAT HAPPENS NEXT:
1. ✓ Order received (NOW)
2. 👨‍🍳 Preparing your order (20-30 min)
3. 📱 We'll text when ready: 0928-123-4567
4. 🛍️ Pick up at counter (show this reference: #SHKY202510260850)

⏱️ ESTIMATED READY TIME: [Time]

📍 PICKUP ADDRESS:
   Shakey's Tomas Morato
   [Full Address]
   📞 [Contact Number]

⚠️ IMPORTANT:
• Bring this order reference number
• Orders held for 30 minutes after ready time
• Pay at counter (cash or card accepted)

Thank you for choosing Shakey's! See you soon! 😊🍕"
```

### Order Modification & Cancellation

```
POST-ORDER ACTIONS

Customer: "cancel my order"

Bot Analysis:
- Intent: order_cancellation
- Check: order_status, time_elapsed
- Recent order: #SHKY202510260847 (placed 3 minutes ago)

Bot Response:
"I can help you with that!

Your recent order: #SHKY202510260847
Placed: 3 minutes ago
Status: Preparing

⚠️ CANCELLATION POLICY:
• Orders can be cancelled within 5 minutes of placement
• Your order is still within cancellation window ✓
• No penalty for cancellation

Would you like to:
a) Cancel entire order
b) Modify order (change items)

Which one?"

Customer: "cancel"

Bot Response:
"Understood. Processing cancellation now...

✅ ORDER CANCELLED

📦 Order #SHKY202510260847 has been cancelled
💰 No charges applied
📧 Confirmation sent to your mobile: 0917-123-4567

The store has been notified to stop preparation.

Is there anything else I can help you with?
• Place a new order?
• Answer questions about our menu?
• Check promos?"

─────────────────────────────────────────────

[If > 5 minutes elapsed:]

Bot Response:
"I understand you'd like to cancel order #SHKY202510260847.

Unfortunately, your order was placed 8 minutes ago and is likely already in
preparation. Cancellation window (5 minutes) has passed. 😔

WHAT WE CAN DO:
1. ⚠️ I'll immediately contact the preparing store
2. If not yet started, we may be able to cancel
3. If already started, cancellation may not be possible

Let me check with the store now... ⏳

[Simulate store contact delay]

UPDATE: I've contacted Shakey's Tomas Morato. Your order is currently being
prepared and cannot be cancelled.

OPTIONS:
• Proceed with delivery as planned
• Refuse delivery (but may be charged)
• Contact hotline for special consideration: 7777-7777

I apologize for the inconvenience. Orders must be cancelled within 5 minutes
to avoid preparation.

What would you like to do?"
```

---

## 6. Entity Extraction & Validation

### Critical Entities to Extract

#### Customer Information Entities

```python
CUSTOMER_ENTITIES = {
    "name": {
        "pattern": r"(?:name is |ako si |I am )?([A-Z][a-z]+(?: [A-Z][a-z]+)+)",
        "validation": "minimum 2 words, proper capitalization",
        "required_for": ["all_orders", "reservations", "complaints"],
        "storage": "customer_profile"
    },
    "mobile_number": {
        "pattern": r"(?:09|\+639)\d{9}",
        "validation": "Philippine mobile format (09XX-XXX-XXXX or +639XX-XXX-XXXX)",
        "required_for": ["all_orders", "reservations", "OTP", "delivery"],
        "normalize": "convert to +639XXXXXXXXX format"
    },
    "email": {
        "pattern": r"[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}",
        "validation": "valid email format",
        "required_for": ["supercard_registration", "complaints"],
        "optional_for": ["orders"]
    }
}
```

#### Location Entities

```python
LOCATION_ENTITIES = {
    "full_address": {
        "components": [
            "unit_number",        # Unit 5A, Tower B
            "building_name",      # Palm Residences
            "house_number",       # 123
            "street_name",        # Ayala Avenue
            "barangay",          # Brgy. Poblacion
            "city_municipality", # Makati City
            "landmark"           # near Glorietta
        ],
        "validation_rules": {
            "minimum_components": 4,  # At least street, barangay, city, landmark
            "city_required": True,
            "landmark_strongly_recommended": True
        },
        "parsing_examples": [
            "Unit 5A Tower B, Palm Residences, 123 Ayala Ave, Brgy. Poblacion, Makati City, near Glorietta",
            "Blk 10 Lot 5, Sunshine Village, Brgy. San Antonio, Quezon City, malapit sa SM North"
        ]
    },
    "landmark": {
        "importance": "CRITICAL for delivery success",
        "examples": [
            "near SM Mall",
            "in front of 7-Eleven",
            "beside Mercury Drug",
            "across McDonald's",
            "tabi ng simbahan",
            "malapit sa palengke"
        ],
        "prompt_if_missing": "Para mas madali for our rider, may landmark po ba near you? (mall, store, church, etc.)"
    }
}
```

#### Order Entities

```python
ORDER_ENTITIES = {
    "menu_items": {
        "categories": {
            "pizza": {
                "sizes": ["Personal", "Medium", "Large", "Party Size"],
                "crusts": ["Thin Crust", "Thick Crust", "Hand-Tossed"],
                "flavors": [
                    "Manager's Choice",
                    "Hawaiian",
                    "Pepperoni",
                    "All Meat",
                    "Vegetarian",
                    "Seafood Marinara",
                    "Texas BBQ"
                ],
                "validation": "size + crust + flavor must all be specified"
            },
            "chicken": {
                "sizes": ["6 pieces", "12 pieces", "18 pieces"],
                "types": ["Chicken 'n' Mojos", "Chicken Only", "Buffalo Wings"],
                "validation": "piece count required"
            },
            "sides": {
                "items": ["Garlic Bread", "Mojos", "Salad Bar", "Fries"],
                "validation": "quantity required"
            },
            "beverages": {
                "items": ["Iced Tea", "Soft Drinks", "Bottled Water"],
                "sizes": ["Regular", "Large", "Pitcher"],
                "validation": "quantity required"
            }
        },
        "parsing_rules": {
            "quantity_extraction": r"(\d+)x?\s+(.+)",
            "size_extraction": r"(personal|medium|large|party)\s+(pizza|thin|thick)",
            "ambiguity_handling": "always confirm with customer if unclear"
        }
    },
    "order_timing": {
        "options": ["ASAP", "LATER"],
        "later_format": "HH:MM AM/PM or relative time (in 1 hour, 2pm, etc.)",
        "validation": "if LATER, must be within store hours and at least 30 min future"
    },
    "special_instructions": {
        "max_length": 200,
        "examples": [
            "extra sauce",
            "no onions",
            "well done pizza",
            "call before arriving",
            "leave at gate",
            "extra cheese"
        ],
        "storage": "attached to order"
    }
}
```

#### Promo/Voucher Entities

```python
PROMO_ENTITIES = {
    "promo_code": {
        "pattern": r"[A-Z0-9]{4,20}",
        "examples": ["HUNGRY100", "50thANNIV", "WELCOME500"],
        "validation": {
            "code_exists": "check against active promo database",
            "not_expired": "check validity dates",
            "min_spend_met": "validate cart value",
            "channel_valid": "check if delivery/carryout/dine-in eligible",
            "one_time_use": "check if already redeemed by user",
            "daily_cap": "check if promo quota reached"
        }
    },
    "card_based_promo": {
        "types": ["UnionBank 50%", "BDO Discount", "Metrobank Offer"],
        "validation": {
            "channel_restriction": "most are dine-in/carryout only",
            "branch_exclusions": "NAIA, MCIA, Enchanted Kingdom often excluded",
            "minimum_purchase": "varies by promo"
        }
    }
}
```

#### SuperCard Entities

```python
SUPERCARD_ENTITIES = {
    "card_number": {
        "pattern": r"\d{10,16}",
        "validation": "check luhn algorithm if applicable",
        "required_for": ["benefit_claims", "birthday_treat", "points_inquiry"]
    },
    "security_code": {
        "pattern": r"\d{3,4}",
        "validation": "matches card number",
        "required_for": ["sensitive_transactions"]
    },
    "date_of_birth": {
        "formats": ["MM/DD/YYYY", "DD/MM/YYYY", "YYYY-MM-DD"],
        "validation": "must be 18+ for some promos",
        "required_for": ["birthday_treat", "age_verification"]
    }
}
```

### Entity Validation Rules

```python
VALIDATION_RULES = {
    "address_serviceability": {
        "process": [
            "1. Parse complete address",
            "2. Extract city/municipality",
            "3. Check against trading_area_database",
            "4. If matched, assign to nearest store",
            "5. If not matched, check nearby areas (5km radius)",
            "6. Return serviceable=True/False + assigned_store"
        ],
        "trading_areas": {
            "quezon_city": ["stores": ["Tomas Morato", "Commonwealth", "Project 8", "North EDSA"]],
            "makati": ["stores": ["Glorietta", "Ayala Triangle", "Greenbelt"]],
            # etc.
        }
    },
    "mobile_number_validation": {
        "allowed_formats": [
            "09XX-XXX-XXXX",
            "09XXXXXXXXX",
            "+639XXXXXXXXX",
            "9XXXXXXXXX"
        ],
        "normalization": "always convert to +639XXXXXXXXX for storage",
        "verification": "send OTP for critical transactions"
    },
    "order_minimum": {
        "delivery": 0,  # No minimum typically, but varies by store
        "carryout": 0,
        "promo_specific": {
            "500_off_voucher": 1000,
            "unionbank_50": 0  # Based on pizza price
        }
    }
}
```

---

## 7. Response Templates Library

### Greeting Templates

```python
GREETINGS = {
    "first_interaction": {
        "english": "Hi! Welcome to Shakey's! 🍕 How can I help you today?",
        "filipino": "Hi po! Welcome sa Shakey's! 🍕 Paano po kita matutulungan?",
        "taglish": "Hi! Welcome to Shakey's! 🍕 Ano po ang maitutulong ko?"
    },
    "returning_customer": {
        "with_name": "Hi {name}! Welcome back to Shakey's! 🍕 Same order as last time, or something new today?",
        "generic": "Welcome back! 😊 Ready to order your Shakey's favorites?"
    },
    "time_based": {
        "morning": "Good morning! Perfect time for breakfast pizza! 🌅🍕",
        "lunch": "Hi! Lunch time na! Ready for your Shakey's meal? 🍕",
        "afternoon": "Good afternoon! Merienda time? 🍕☕",
        "evening": "Good evening! Dinner delivery or takeout? 🍕🌙"
    }
}
```

### Acknowledgment Templates

```python
ACKNOWLEDGMENTS = {
    "understanding": {
        "confirmed": [
            "Got it! ✓",
            "Okay, noted! ✓",
            "Understood po! ✓",
            "Alright! ✓",
            "Sige! ✓"
        ],
        "processing": [
            "Let me check that for you...",
            "One moment po, checking...",
            "Sandali lang, let me verify...",
            "Processing your request..."
        ]
    },
    "appreciation": {
        "for_info": [
            "Thank you for providing that!",
            "Salamat po sa info!",
            "Perfect, thank you!",
            "Great, noted!"
        ],
        "for_patience": [
            "Thank you for your patience!",
            "Salamat po sa patience!",
            "We appreciate your understanding!",
            "Thank you for waiting!"
        ]
    }
}
```

### Error & Apology Templates

```python
ERROR_TEMPLATES = {
    "system_error": {
        "general": "Oops! Something went wrong on our end. 😔 Let me try that again...",
        "persistent": "I apologize, I'm having technical difficulties. Please call our hotline for immediate assistance: 7777-7777",
        "order_failed": "Sorry, your order couldn't be processed right now. Would you like to try again, or shall I escalate to our team?"
    },
    "validation_error": {
        "incomplete_address": "I'll need your complete address to proceed. Please include: house/unit number, street, barangay, city, and landmark.",
        "invalid_phone": "Hmm, that mobile number doesn't look right. Philippine mobile numbers are 11 digits starting with 09. Can you double-check?",
        "item_not_found": "Sorry, I couldn't find '{item}' in our menu. Could you describe it differently, or would you like me to suggest similar items?"
    },
    "business_rule_error": {
        "out_of_area": "Unfortunately, we can't deliver to {area} as it's outside our trading area. The nearest serviceable area is {nearest_area}. Would you like carryout instead?",
        "promo_not_applicable": "Sorry, the {promo_name} promo is only valid for {valid_channels}, not for {attempted_channel}. But we have other promos available!",
        "store_closed": "Unfortunately, {store_name} is currently closed. Store hours: {hours}. Would you like to order from a different branch or schedule for later?"
    }
}
```

### Clarification Templates

```python
CLARIFICATION_TEMPLATES = {
    "ambiguous_item": {
        "pizza_size": "Which size pizza? (Personal / Medium / Large / Party Size)",
        "chicken_count": "How many pieces of chicken? (6 / 12 / 18 pieces)",
        "beverage_size": "What size? (Regular / Large / Pitcher)"
    },
    "channel_confusion": {
        "delivery_or_carryout": "Would you like this delivered or for carryout/pickup?",
        "dine_in_clarification": "Are you planning to dine in at the restaurant, or order for delivery/takeout?"
    },
    "missing_info": {
        "address_needed": "To proceed, I'll need your delivery address. What's your complete address?",
        "contact_needed": "I'll need your mobile number to send order updates. What's your number?",
        "store_preference": "Which Shakey's branch would you like to order from? Or should I suggest the nearest one?"
    }
}
```

### Confirmation Templates

```python
CONFIRMATION_TEMPLATES = {
    "action_confirmed": {
        "order_placed": "🎉 Order confirmed! Order #: {order_number}",
        "reservation_booked": "✅ Reservation confirmed for {date} at {time}, {pax} persons",
        "cancellation_done": "✅ Your order #{order_number} has been cancelled",
        "update_applied": "✓ Changes saved successfully!"
    },
    "status_updates": {
        "order_received": "✓ Order received by {store}",
        "preparing": "👨‍🍳 Your order is being prepared",
        "out_for_delivery": "🛵 Rider is on the way! ETA: {eta} minutes",
        "ready_for_pickup": "✅ Your order is ready for pickup at {store}!"
    }
}
```

### Escalation Templates

```python
ESCALATION_TEMPLATES = {
    "to_human_agent": {
        "standard": "Let me connect you with one of our team members who can better assist with this. One moment please...",
        "urgent": "I understand this is urgent. Connecting you to an agent right away...",
        "complex": "This requires special attention. Let me transfer you to our specialized team..."
    },
    "to_store_manager": {
        "complaint": "I apologize for this experience. I'm escalating your concern to the store manager. They'll contact you at {mobile} within {timeframe}.",
        "custom_request": "This special request needs approval from the store manager. I've noted all details and someone will call you shortly."
    },
    "to_hotline": {
        "fallback": "For faster resolution, please call our 24/7 hotline: 7777-7777 or #77-777 (toll-free for Globe/TM). Reference: {case_number}"
    }
}
```

---

## 8. Business Logic & Rules Engine

### Promo Validation Rules

```python
PROMO_BUSINESS_RULES = {
    "unionbank_50_percent": {
        "type": "card_based",
        "discount": "50% off",
        "applicable_items": ["Large Thin Crust Pizza - select flavors"],
        "channels": ["dine_in", "carryout"],
        "excluded_channels": ["delivery", "app_delivery"],
        "excluded_branches": ["NAIA Terminal 3", "MCIA Terminals", "Enchanted Kingdom"],
        "payment_method": "UnionBank Credit Card",
        "validity_check": "check expiry date",
        "terms": "Cannot be combined with other promos, one transaction per card per day"
    },
    "app_voucher_500_off": {
        "type": "voucher_code",
        "discount_amount": 500,
        "minimum_spend": 1000,
        "channels": ["app_delivery", "app_carryout"],
        "excluded_channels": ["dine_in", "grab", "foodpanda"],
        "one_time_use": True,
        "daily_cap": "Yes - may reach limit",
        "validity_period": "7 days from activation",
        "redemption_requirements": [
            "Must be added to Vouchers section",
            "Cart must meet minimum spend",
            "Must select eligible channel",
            "Account must be verified"
        ],
        "failure_reasons": {
            "below_minimum": "Cart value is ₱{cart_value}, needs ₱{minimum_spend}",
            "wrong_channel": "Voucher only valid for {valid_channels}",
            "already_used": "This voucher has already been redeemed",
            "expired": "Voucher expired on {expiry_date}",
            "daily_cap_reached": "Daily redemption limit reached, try again tomorrow"
        }
    },
    "birthday_treat": {
        "type": "supercard_benefit",
        "benefit": "Free Large Pizza",
        "eligibility": "Active SuperCard holder",
        "validity_window": "Birth month + 7 days before/after (store dependent)",
        "channels": {
            "dine_in": "No minimum purchase",
            "carryout": "No minimum purchase",
            "delivery": "₱300 minimum purchase",
            "pickup": "₱300 minimum purchase"
        },
        "frequency": "Once per birth month",
        "activation": "Appears in app during eligible period",
        "troubleshooting": {
            "not_showing": [
                "Check if current month is birth month",
                "Verify SuperCard is active (not expired)",
                "Confirm date of birth registered correctly"
            ]
        }
    }
}
```

### Delivery Rules

```python
DELIVERY_BUSINESS_RULES = {
    "serviceability": {
        "validation_process": [
            "Extract complete address",
            "Identify city/municipality",
            "Match against store trading areas",
            "Check distance from nearest store",
            "Validate against blocked/restricted areas"
        ],
        "trading_areas": {
            "format": "Each store has defined barangays/streets",
            "overlap": "Some areas served by multiple stores (assign nearest)",
            "updates": "Trading areas updated monthly"
        },
        "delivery_fee": {
            "standard": "₱49-₱99",
            "basis": "Distance from store",
            "minimum_order": "Varies by store (typically none, but some have ₱300 minimum)"
        }
    },
    "delivery_timing": {
        "asap": {
            "estimate": "45-60 minutes",
            "factors": ["Kitchen prep time (15-20 min)", "Distance (10-30 min)", "Traffic conditions", "Order volume"],
            "communication": "Provide range, not exact time"
        },
        "scheduled": {
            "advance_window": "30 minutes to 2 hours ahead",
            "cutoff": "Must be within store operating hours",
            "disclaimer": "Subject to availability, we'll call if not possible"
        }
    },
    "address_requirements": {
        "minimum_components": [
            "House/Unit/Building number",
            "Street name or Subdivision name",
            "Barangay",
            "City/Municipality",
            "Landmark (highly recommended)"
        ],
        "landmark_importance": "CRITICAL for delivery success",
        "examples": [
            "Unit 5A Tower B, Palm Residences, Ayala Ave, Brgy. Poblacion, Makati, near Glorietta",
            "Blk 10 Lot 5, Sunshine Village, Brgy. San Antonio, QC, tabi ng SM North"
        ]
    },
    "restricted_areas": {
        "types": ["Military bases", "Airport restricted zones", "Gated communities (case-by-case)", "Very remote rural areas"],
        "handling": "Verify with customer, offer alternative (meet-up point or carryout)"
    }
}
```

### SuperCard Rules

```python
SUPERCARD_BUSINESS_RULES = {
    "tiers": {
        "classic": {
            "price": 699,
            "benefits": [
                "Welcome treat (claimed at purchase location)",
                "Birthday free Large pizza",
                "Exclusive promos and vouchers",
                "Points earning (standard rate)",
                "Valid for 1 year"
            ]
        },
        "gold": {
            "price": 999,
            "benefits": [
                "All Classic benefits",
                "Higher points earning rate",
                "Priority access to new promos",
                "Additional birthday perks",
                "Gold member exclusive offers",
                "Valid for 1 year"
            ]
        }
    },
    "welcome_treat": {
        "policy": "MUST be claimed at purchase location at time of purchase",
        "cannot_claim_elsewhere": True,
        "no_retroactive_claims": True,
        "without_receipt": "Cannot recover, strict policy",
        "rationale": "Prevents fraud, ensures immediate benefit"
    },
    "birthday_treat": {
        "eligibility": {
            "active_card": "Card must not be expired",
            "birth_month": "Available during registered birth month",
            "window": "Some stores: +/- 7 days around birth month",
            "once_per_year": "Can only claim once per birth month/year"
        },
        "channels": {
            "dine_in": "No minimum purchase",
            "carryout": "No minimum purchase",
            "delivery": "₱300 minimum purchase",
            "pickup": "₱300 minimum purchase"
        },
        "app_display": {
            "shows_when": "Within eligible birth month window",
            "unavailable_message": "Displayed outside eligibility period",
            "troubleshooting": "Verify DOB correct, card active, in birth month"
        }
    },
    "registration_process": {
        "channels": ["In-store", "Hotline (7777-7777)", "Website", "Mobile app"],
        "required_info": ["Full name", "Mobile number", "Email", "Date of birth"],
        "verification": "OTP sent to mobile",
        "otp_issues": {
            "common_causes": ["Poor signal", "Wrong number", "Network delays", "System load"],
            "troubleshooting": ["Check signal", "Restart phone", "Wait 2-3 minutes", "Try alternative channel"],
            "escalation": "After 3 failed attempts, escalate to tech support"
        }
    },
    "card_expiry": {
        "validity": "1 year from purchase",
        "renewal": "Purchase new card (Classic ₱699 or Gold ₱999)",
        "benefits_after_expiry": "None - must renew to regain benefits",
        "grace_period": "None"
    }
}
```

### Reservation Rules

```python
RESERVATION_BUSINESS_RULES = {
    "group_size_handling": {
        "small_groups": {
            "definition": "2-10 persons",
            "policy": "Walk-in generally accepted",
            "recommendation": "Reservation helpful during peak hours (lunch 11am-2pm, dinner 6pm-9pm)",
            "advance_booking": "Not required, but available"
        },
        "medium_groups": {
            "definition": "11-20 persons",
            "policy": "Reservation recommended",
            "advance_booking": "At least 1 day ahead",
            "coordination": "Store should be notified"
        },
        "large_groups": {
            "definition": "21+ persons",
            "policy": "Reservation REQUIRED",
            "advance_booking": "At least 3-7 days ahead",
            "function_room": "Check availability",
            "coordinator": "Assign party coordinator"
        }
    },
    "function_rooms": {
        "availability": {
            "by_branch": "Not all branches have function rooms",
            "capacity_range": "50-220 persons depending on branch",
            "booking_channel": "https://www.shakeyspizza.ph/virtual-party or call 7777-7777"
        },
        "requirements": {
            "advance_booking": "1-2 weeks recommended (longer for weekends/holidays)",
            "deposit": "May be required for large bookings",
            "minimum_spend": "Varies by branch and package",
            "cancellation_policy": "Check with store (usually 48-72 hours notice)"
        },
        "party_packages": {
            "types": ["Junior Pizza Master (kids)", "Basic Party", "Deluxe Party", "Custom packages"],
            "includes": "Food, venue, sometimes games/host/decorations",
            "customization": "Discuss with party coordinator"
        }
    },
    "special_events": {
        "birthdays": {
            "celebrant_benefit": "If SuperCard holder, birthday treat applies",
            "party_options": "Function room packages, themed parties, cakes available",
            "advance_planning": "1-2 weeks recommended"
        },
        "christening_baptismal": {
            "considerations": "Larger capacity needed, special menu options",
            "coordination": "Direct store contact preferred",
            "timing": "Usually after church service (lunch/afternoon)"
        },
        "corporate_events": {
            "capacity": "Depends on branch",
            "amenities": "May need AV equipment, WiFi, projector",
            "coordination": "Corporate events team or store manager"
        }
    },
    "data_collection": {
        "required_fields": ["Full name", "Mobile number", "Date", "Time", "Number of guests", "Preferred store"],
        "optional_fields": ["Special requests", "Budget", "Theme", "Dietary restrictions"],
        "privacy_notice": "Must display Data Privacy Act compliance statement when collecting PII"
    }
}
```

---

## 9. Error Handling & Edge Cases

### Common Error Scenarios

```python
ERROR_SCENARIOS = {
    "incomplete_information": {
        "scenario": "Customer provides partial information",
        "examples": [
            "Customer: 'order please' (no items specified)",
            "Customer: 'delivery' (no address)",
            "Customer: '2 pizzas' (no size/flavor)"
        ],
        "handling": {
            "approach": "Progressive disclosure - ask for one piece of info at a time",
            "tone": "Helpful, not interrogative",
            "response_template": "Great! To [action], I'll need [specific info]. [Specific question]?"
        },
        "example_response": "Happy to help you order! What would you like? You can tell me specific items, or I can share our menu for you to browse."
    },
    "ambiguous_requests": {
        "scenario": "Request can be interpreted multiple ways",
        "examples": [
            "'chicken' - Chicken 'n' Mojos? Buffalo Wings? How many pieces?",
            "'large pizza' - Which flavor? Thin or thick crust?",
            "'near makati' - Multiple branches, which specific area?"
        ],
        "handling": {
            "approach": "Clarify before proceeding, offer common options",
            "tone": "Helpful, provide guidance",
            "response_template": "I can help with that! Just to clarify - [option A] or [option B]? Or something else?"
        }
    },
    "system_unavailable": {
        "scenario": "Backend system unreachable (POS, menu database, store system)",
        "handling": {
            "immediate": "Acknowledge issue, apologize, provide alternative",
            "response": "I'm having trouble connecting to our ordering system right now. Let me get you to our team who can help: Call 7777-7777 or I can have someone call you back. What works best?",
            "escalation": "Log error, alert tech team, provide manual alternative"
        }
    },
    "promo_code_failures": {
        "below_minimum_spend": {
            "detection": "Cart value < promo minimum",
            "response": "Your cart is ₱{current}, but {promo} requires ₱{minimum}. Need to add ₱{gap} more. Want suggestions?",
            "action": "Suggest items to reach minimum"
        },
        "wrong_channel": {
            "detection": "Delivery order with dine-in-only promo",
            "response": "The {promo} is only valid for {valid_channels}, not {current_channel}. But we have other promos available for {current_channel}! Want to see them?",
            "action": "Show alternative promos"
        },
        "expired_promo": {
            "detection": "Promo code expired",
            "response": "The {promo} promo expired on {date}. Check our current promos here: [link] or I can tell you what's active now!",
            "action": "Show current promos"
        },
        "already_used": {
            "detection": "One-time promo already redeemed",
            "response": "Looks like you've already used {promo}. It's one-time use only. Want to see other available promos?",
            "action": "Show alternative promos"
        }
    },
    "address_validation_failures": {
        "incomplete_address": {
            "detection": "Missing required components",
            "response": "To ensure successful delivery, I need your complete address. You provided: [parts received]. Still need: [missing parts].",
            "action": "Request missing components specifically"
        },
        "outside_coverage": {
            "detection": "Address not in trading area",
            "response": "Your address in {area} is outside our delivery coverage. Nearest serviceable area: {nearest}. Alternatives: 1) Carryout from {nearest_store}, 2) Check if Grab/FoodPanda services your area.",
            "action": "Provide alternatives"
        },
        "unverifiable_address": {
            "detection": "Address too vague or landmark unknown",
            "response": "I'm having trouble pinpointing your exact location. Can you provide a more specific landmark? (major street, mall, known establishment)",
            "action": "Request clarification"
        }
    },
    "payment_failures": {
        "online_payment_declined": {
            "detection": "Payment gateway returns error",
            "response": "Your payment didn't go through. Common reasons: insufficient funds, wrong card details, bank declined. Try again or use alternative payment? (COD, different card, GCash)",
            "action": "Offer alternatives"
        },
        "cod_high_value": {
            "detection": "COD order > ₱5000 (example threshold)",
            "response": "For orders over ₱5,000, we require online payment for security. You can pay via credit card, debit card, or GCash. Which works for you?",
            "action": "Redirect to online payment"
        }
    },
    "otp_not_received": {
        "detection": "Customer reports OTP not arriving",
        "handling": {
            "step_1": "Check signal strength",
            "step_2": "Verify mobile number correct",
            "step_3": "Wait 2-3 minutes (network delays)",
            "step_4": "Restart phone",
            "step_5": "Try alternative channel",
            "escalation": "After 3 attempts, escalate to tech + provide hotline alternative"
        },
        "response_template": "Let's troubleshoot the OTP issue: [step-by-step guidance]. Still not working? Call 7777-7777 and we'll complete registration by phone."
    }
}
```

### Edge Case Handling

```python
EDGE_CASES = {
    "multiple_concurrent_intents": {
        "scenario": "Customer asks multiple things in one message",
        "example": "I want to order pizza, check if you deliver to my area, and know about the 50% promo",
        "handling": {
            "approach": "Acknowledge all, prioritize logically",
            "sequence": [
                "1. Address each intent briefly",
                "2. Ask which to handle first",
                "3. OR handle in logical order (location → promo → order)"
            ],
            "response": "Got it! You want to: 1) Check delivery coverage, 2) Learn about 50% promo, 3) Order pizza. Let's start with your address to see if we deliver there, then I'll explain the promo, and we'll place your order. Sound good? What's your address?"
        }
    },
    "language_switching_mid_conversation": {
        "scenario": "Customer starts in English, switches to Filipino",
        "example": "Customer: 'Hello' → Bot: 'Hi!' → Customer: 'Pwede ba mag-deliver dito?'",
        "handling": {
            "approach": "Mirror the switch naturally",
            "response": "Match customer's new language going forward",
            "example_response": "Yes po, we deliver! Para ma-check kung saklaw ng delivery area, what's your complete address?"
        }
    },
    "angry_or_frustrated_customer": {
        "detection": [
            "CAPS LOCK usage",
            "Multiple exclamation marks",
            "Curse words or aggressive language",
            "Repeated complaints",
            "Phrases like 'ang tagal', 'ang bagal', 'terrible service'"
        ],
        "handling": {
            "priority": "P0 - Immediate attention",
            "approach": [
                "1. Acknowledge frustration immediately",
                "2. Apologize sincerely (don't over-apologize)",
                "3. Take ownership",
                "4. Provide immediate action/solution",
                "5. Escalate to human if needed"
            ],
            "response_template": "I sincerely apologize for [specific issue]. I understand your frustration. Let me [immediate action]. [Escalation offer if appropriate].",
            "escalation_threshold": "If issue unresolved after 2-3 bot exchanges, escalate to human agent immediately"
        }
    },
    "menu_item_not_in_database": {
        "scenario": "Customer requests item not recognized",
        "examples": ["'mojos with extra cheese'", "'that new burger'", "'gluten-free pizza'"],
        "handling": {
            "step_1": "Check for typos/variations",
            "step_2": "Ask for clarification",
            "step_3": "Suggest similar items",
            "step_4": "Offer to check with store",
            "response": "I'm not finding '{item}' in our menu. Did you mean [similar item]? Or can you describe it more? I can also check with the store if it's a special item."
        }
    },
    "store_closed_during_order": {
        "detection": "Order attempt outside store hours",
        "handling": {
            "immediate_response": "The {store} branch is currently closed. Store hours: {hours}. Reopens: {next_opening}.",
            "alternatives": [
                "Order from nearby open store",
                "Schedule order for when store opens",
                "Use 24/7 hotline for options: 7777-7777"
            ]
        }
    },
    "duplicate_order_detection": {
        "scenario": "Same customer, same items, within 30 minutes",
        "handling": {
            "approach": "Flag and verify intention",
            "response": "I notice this is very similar to order #{previous_order} from {time_ago}. Is this a new order, or did you mean to modify the previous one?",
            "action": "If duplicate, offer to cancel previous or confirm two separate orders"
        }
    },
    "dietary_restrictions_allergies": {
        "scenario": "Customer asks about ingredients, allergens",
        "examples": ["'does your pizza have pork?'", "'is there gluten-free option?'", "'allergic to dairy'"],
        "handling": {
            "approach": "NEVER guess - always escalate to store/human",
            "response": "For specific ingredient and allergen information, I want to make sure you get 100% accurate info. Let me connect you with our store team who have full ingredient details. Call 7777-7777 or I can have them call you. This is important!",
            "rationale": "Health/safety cannot be handled by bot alone"
        }
    },
    "refund_or_compensation_requests": {
        "scenario": "Customer wants money back or free food for issue",
        "handling": {
            "approach": "Empathize, document, escalate",
            "bot_cannot": "Bot cannot approve refunds or compensation",
            "response": "I completely understand your concern about [issue]. I'm documenting all details: [summary]. This will be reviewed by our team who can address compensation. They'll contact you at {mobile} within 24 hours. Reference: {case_number}.",
            "escalation": "Immediate flagging for human agent/manager review"
        }
    },
    "vip_or_special_requests": {
        "examples": [
            "'Can you write Happy Birthday on the box?'",
            "'Need delivery by exactly 7pm for party'",
            "'Can driver bring plates and utensils?'",
            "'Special arrangement for surprise delivery'"
        ],
        "handling": {
            "approach": "Acknowledge, note, set expectations, verify with store",
            "response": "I've noted your special request: '{request}'. I'll coordinate with the store to confirm if this is possible. If approved, it will be included. If not, the store will let you know. Sound good?",
            "documentation": "Tag order with special request flag for human review"
        }
    },
    "scam_or_suspicious_activity": {
        "detection": [
            "Requesting employee personal information",
            "Asking for system access or admin features",
            "Phishing attempts (asking for card details beyond payment)",
            "Attempting SQL injection or code injection",
            "Requesting information on other customers"
        ],
        "handling": {
            "response": "I can't assist with that request. If you have a legitimate concern, please contact our official channels: 7777-7777 or Wecare@shakeys.biz",
            "action": "Log and alert security team",
            "no_engagement": "Do not engage further with suspicious requests"
        }
    }
}
```

---

## 10. Escalation Criteria & Handover

### When to Escalate

```python
ESCALATION_CRITERIA = {
    "mandatory_immediate_escalation": {
        "complaint_severity_high": [
            "Food safety concerns (contamination, foreign object)",
            "Allergic reaction",
            "Injury or accident",
            "Theft or security issue",
            "Hostile or threatening behavior",
            "Harassment of staff or customer"
        ],
        "financial_disputes": [
            "Refund requests",
            "Duplicate charges",
            "Incorrect charges",
            "Payment reversals",
            "Billing disputes"
        ],
        "legal_or_regulatory": [
            "Data breach concerns",
            "Privacy violations",
            "Regulatory complaints",
            "Media inquiries",
            "Legal demands"
        ],
        "handling": "Immediately transfer to human agent with flag for management"
    },
    "escalation_after_bot_attempts": {
        "technical_failure": {
            "trigger": "Bot cannot resolve technical issue after 3 attempts",
            "examples": ["Persistent OTP failure", "Payment gateway errors", "App crashes"],
            "handover": "Transfer to tech support with full interaction log"
        },
        "complex_inquiry": {
            "trigger": "Question requires nuanced judgment or policy interpretation",
            "examples": [
                "Custom party packages beyond standard options",
                "Franchise inquiries",
                "Career applications requiring follow-up",
                "Special dietary needs verification"
            ],
            "handover": "Transfer to specialized team with context"
        },
        "customer_frustration": {
            "trigger": "Customer shows high frustration (caps, repeated complaints, demands human)",
            "examples": ["'Let me talk to a person!'", "'This bot is useless'", "'ang bagal naman'"],
            "handover": "Transfer immediately to agent with empathy note"
        },
        "unresolved_after_conversation": {
            "trigger": "5+ message exchanges without resolution",
            "handling": "Proactively offer human agent: 'Would you like me to connect you with a team member who can help further?'"
        }
    },
    "optional_escalation": {
        "high_value_orders": {
            "trigger": "Order exceeds ₱10,000",
            "handling": "Offer human verification: 'This is a large order. Would you like confirmation call from our team?'"
        },
        "vip_customers": {
            "trigger": "Identified VIP or corporate account",
            "handling": "Proactively offer dedicated support"
        }
    }
}
```

### Handover Process

```python
HANDOVER_PROCESS = {
    "information_package": {
        "required_data": [
            "Full conversation transcript",
            "Customer information (name, mobile, email if available)",
            "Intent classification and confidence scores",
            "Current state (order status, reservation details, etc.)",
            "Attempted solutions and results",
            "Urgency level (P0/P1/P2)",
            "Special flags (VIP, complaint, technical, etc.)"
        ],
        "format": "Structured JSON for agent dashboard"
    },
    "transition_message_to_customer": {
        "standard": "I'm connecting you with one of our team members who can help you better. Please hold for a moment... [Agent name] will be with you shortly!",
        "urgent": "I'm immediately connecting you to an agent. Please hold...",
        "after_hours": "Our live agents are available from {hours}. I'm logging your concern and someone will contact you at {mobile} when we open. Reference: {case_number}. Or call our 24/7 hotline: 7777-7777."
    },
    "agent_briefing": {
        "format": "Quick summary alert in agent dashboard",
        "example": "📞 NEW ESCALATION - Priority: HIGH\nCustomer: Maria Santos (0917-123-4567)\nIssue: Wrong order delivered - received Pepperoni instead of Hawaiian\nOrder #: SHKY202510260847\nSentiment: Frustrated (3/5)\nBot attempted: Verified order, offered redelivery - customer wants immediate resolution\nAction needed: Authorize immediate redelivery or refund",
        "sla": "Agent must acknowledge within 60 seconds"
    },
    "fallback_if_no_agent_available": {
        "message": "All our agents are currently assisting other customers. Your concern has been logged (Reference: {case_number}). Our team will contact you at {mobile} within {timeframe}. For urgent concerns, call 7777-7777.",
        "timeframe": {
            "peak_hours": "within 30 minutes",
            "off_peak": "within 15 minutes",
            "after_hours": "when we open at {time}"
        }
    }
}
```

### Post-Escalation Bot Behavior

```python
POST_ESCALATION_BEHAVIOR = {
    "during_human_conversation": {
        "bot_role": "Silent observer",
        "logging": "Continue logging for quality assurance",
        "intervention": "Only if human agent explicitly requests bot assistance"
    },
    "after_human_resolution": {
        "follow_up": "Bot can send automated follow-up 24 hours later",
        "message": "Hi {name}! Following up on your concern from yesterday. Was everything resolved to your satisfaction? We're always here to help! 😊",
        "feedback_request": "Rate your experience: [1-5 stars]"
    },
    "if_customer_returns_to_bot": {
        "context_awareness": "Bot should remember previous escalation",
        "message": "Hi again {name}! I see we helped you with {previous_issue} earlier. Is this about the same concern, or something new?",
        "avoid": "Do NOT make customer repeat information already provided"
    }
}
```

---

## 11. Multi-Language Support (English/Filipino/Taglish)

### Language Detection & Switching

```python
LANGUAGE_HANDLING = {
    "detection": {
        "method": "Analyze first customer message + ongoing messages",
        "signals": {
            "english": ["No Filipino words", "Formal English structure"],
            "filipino": ["Po/opo", "Mga/ng/sa articles", "Pure Filipino vocabulary"],
            "taglish": ["Mix of English and Filipino", "Code-switching mid-sentence"]
        },
        "default": "Mirror customer's language choice"
    },
    "response_language_rules": {
        "principle": "Always match customer's language preference",
        "taglish_approach": "Use English for technical terms, Filipino for conversational flow",
        "examples": {
            "customer_english": "Bot responds in English",
            "customer_filipino": "Bot responds in Filipino",
            "customer_taglish": "Bot responds in Taglish (same mix ratio)"
        }
    },
    "language_switching_mid_conversation": {
        "handling": "Switch immediately to new language",
        "example": [
            "Customer: 'Hi, I want to order'",
            "Bot: 'Hi! I can help you place an order!'",
            "Customer: 'Saan ba kayo nag-deliver?'",
            "Bot: 'We deliver to many areas po! Saan po kayo?'"
        ]
    }
}
```

### Common Filipino Phrases & Politeness Markers

```python
FILIPINO_LANGUAGE_ELEMENTS = {
    "politeness_markers": {
        "po": "Respect particle - use with elders, customers (always safe)",
        "opo": "Polite 'yes' - use in affirmative responses",
        "ho": "Informal version of 'po' - avoid in formal customer service",
        "usage": "Add 'po' to end of sentences when speaking to customers"
    },
    "common_phrases": {
        "greetings": {
            "Kumusta po": "How are you (formal)",
            "Magandang umaga/hapon/gabi po": "Good morning/afternoon/evening"
        },
        "acknowledgments": {
            "Sige po": "Okay/Alright",
            "Opo, naintindihan ko po": "Yes, I understand",
            "Noted po": "Noted",
            "Salamat po": "Thank you"
        },
        "requests": {
            "Pakiusap po": "Please",
            "Pwede po bang...": "Can I...",
            "Maaari po bang...": "May I...",
            "Paki-send po": "Please send"
        },
        "questions": {
            "Ano po ang...": "What is...",
            "Saan po...": "Where...",
            "Kailan po...": "When...",
            "Paano po...": "How..."
        },
        "confirmations": {
            "Tama po ba?": "Is this correct?",
            "Sigurado po ba kayo?": "Are you sure?",
            "Okay lang po ba?": "Is this okay?"
        },
        "apologies": {
            "Pasensya na po": "Sorry",
            "Paumanhin po": "Apologies",
            "Sorry po": "Sorry (Taglish)"
        }
    },
    "sentence_structure": {
        "typical_pattern": "[Statement] + po",
        "examples": [
            "Available po yung delivery",
            "May promo po kami",
            "Kailangan ko po ng address niyo",
            "Sandali lang po"
        ]
    },
    "casual_vs_formal": {
        "avoid_overly_casual": ["Pare", "Bro", "Dude", "Tol", "Tsong"],
        "maintain_professional": "Use po consistently, avoid slang",
        "warmth_without_informality": "Friendly but respectful tone"
    }
}
```

### Translation Examples for Key Phrases

```python
KEY_PHRASE_TRANSLATIONS = {
    "ordering": {
        "english": "What would you like to order?",
        "filipino": "Ano po ang gusto ninyong i-order?",
        "taglish": "Ano po ang gusto ninyong i-order?"
    },
    "address_request": {
        "english": "What's your complete delivery address?",
        "filipino": "Ano po ang kumpleto ninyong delivery address?",
        "taglish": "What's your complete delivery address po?"
    },
    "order_confirmation": {
        "english": "Your order has been confirmed!",
        "filipino": "Nakumpirma na po ang inyong order!",
        "taglish": "Your order has been confirmed na po!"
    },
    "promo_invalid": {
        "english": "Sorry, this promo is only valid for dine-in and carryout, not delivery.",
        "filipino": "Pasensya na po, ang promo na ito ay para sa dine-in at carryout lang, hindi para sa delivery.",
        "taglish": "Sorry po, ang promo na ito is valid for dine-in at carryout only, not for delivery."
    },
    "outside_coverage": {
        "english": "Unfortunately, your address is outside our delivery coverage area.",
        "filipino": "Pasensya na po, ang inyong address ay nasa labas ng aming delivery coverage area.",
        "taglish": "Sorry po, ang address niyo is outside our delivery coverage area."
    }
}
```

---

## 12. Performance Metrics & KPIs

### Success Metrics

```python
BOT_PERFORMANCE_METRICS = {
    "accuracy_metrics": {
        "intent_classification_accuracy": {
            "target": "≥95%",
            "measurement": "Correct intent identified / Total queries",
            "critical_intents": ["order_placement", "delivery_coverage", "promo_inquiry"]
        },
        "entity_extraction_accuracy": {
            "target": "≥95%",
            "measurement": "Correctly extracted entities / Total entities",
            "critical_entities": ["address", "mobile_number", "menu_items"]
        },
        "policy_compliance": {
            "target": "100%",
            "measurement": "Policy-compliant responses / Total policy-related responses",
            "zero_tolerance": ["Payment info requests", "Policy violations", "Unauthorized promises"]
        }
    },
    "efficiency_metrics": {
        "average_response_time": {
            "target": "<5 seconds",
            "measurement": "Time from customer message to bot response"
        },
        "conversation_length": {
            "target": "3-7 turns for simple queries, ≤15 for complex",
            "measurement": "Average number of back-and-forth exchanges"
        },
        "first_contact_resolution": {
            "target": "≥70%",
            "measurement": "Issues resolved without escalation / Total conversations"
        },
        "order_completion_rate": {
            "target": "≥80%",
            "measurement": "Orders successfully placed via bot / Order intents detected"
        }
    },
    "quality_metrics": {
        "customer_satisfaction": {
            "target": "≥4.0/5.0",
            "measurement": "Post-conversation ratings",
            "collection": "Automatic prompt after resolved queries"
        },
        "escalation_rate": {
            "target": "≤20%",
            "measurement": "Conversations escalated to human / Total conversations",
            "breakdown_by": ["Reason for escalation", "Time to escalation"]
        },
        "language_handling_accuracy": {
            "target": "≥90%",
            "measurement": "Appropriate language responses / Total multilingual interactions"
        }
    },
    "business_metrics": {
        "orders_placed": {
            "measurement": "Total orders successfully placed through bot"
        },
        "average_order_value": {
            "measurement": "Total order value / Number of orders",
            "target": "Maintain or increase vs human-agent orders"
        },
        "promo_redemption_rate": {
            "measurement": "Promos applied / Orders placed",
            "goal": "Increase promo awareness and usage"
        },
        "supercard_acquisitions": {
            "measurement": "SuperCard purchases initiated through bot"
        }
    }
}
```

### Quality Assurance Checkpoints

```python
QA_CHECKPOINTS = {
    "daily_monitoring": [
        "Review escalated conversations",
        "Check for incorrect policy statements",
        "Monitor unresolved queries",
        "Track response time anomalies"
    ],
    "weekly_analysis": [
        "Intent classification errors",
        "Entity extraction failures",
        "Common confusion patterns",
        "New query types not handled"
    ],
    "monthly_review": [
        "Overall performance vs targets",
        "Customer feedback themes",
        "Bot improvement opportunities",
        "New training data requirements"
    ],
    "continuous_improvement": [
        "Incorporate new menu items",
        "Update promo rules",
        "Add new conversational patterns",
        "Refine entity extraction",
        "Optimize response templates"
    ]
}
```

---

## 13. Training & Testing Guidelines

### Training Data Requirements

```python
TRAINING_DATA = {
    "minimum_examples_per_intent": {
        "critical_intents": "500+ examples each",
        "standard_intents": "200+ examples each",
        "rare_intents": "50+ examples each"
    },
    "data_diversity": {
        "language_variety": ["Pure English", "Pure Filipino", "Taglish (50/50)", "Taglish (70/30)", "Taglish (30/70)"],
        "formality_levels": ["Very formal", "Professional", "Casual", "Very casual"],
        "spelling_variations": ["Correct spelling", "Common typos", "Shorthand (u, ur, pls)", "Filipino spelling variations"]
    },
    "edge_case_coverage": {
        "include": [
            "Extremely long addresses",
            "Ambiguous menu item names",
            "Multiple intents in one message",
            "Nonsensical or gibberish input",
            "Hostile or abusive language",
            "Special characters and emojis"
        ]
    }
}
```

### Testing Protocols

```python
TESTING_PROTOCOLS = {
    "unit_testing": {
        "intent_classification": "Test each intent with 100+ diverse examples",
        "entity_extraction": "Test each entity type with edge cases",
        "response_templates": "Verify correct template selection for contexts"
    },
    "integration_testing": {
        "end_to_end_flows": [
            "Complete delivery order flow",
            "Complete carryout order flow",
            "Promo inquiry → order flow",
            "SuperCard issue resolution",
            "Reservation booking flow"
        ],
        "system_integrations": [
            "POS system connection",
            "Payment gateway",
            "SMS notification service",
            "Store database lookups"
        ]
    },
    "user_acceptance_testing": {
        "real_user_scenarios": "Beta test with real customers",
        "feedback_collection": "Gather qualitative feedback",
        "a_b_testing": "Test multiple response variations"
    },
    "stress_testing": {
        "high_volume": "Simulate peak hour traffic",
        "concurrent_users": "Test with 100+ simultaneous conversations",
        "response_time_under_load": "Ensure <5 second response maintained"
    }
}
```

---

## 14. Privacy & Compliance

### Data Privacy Act Compliance

```python
DATA_PRIVACY_COMPLIANCE = {
    "data_collection_notice": {
        "required_statement": "⚠️ DATA PRIVACY NOTICE: The information you provide will be used solely to process your [request type] and will be kept secure according to our privacy policy and the Data Privacy Act of 2012. Your data will not be shared with third parties except as required by law.",
        "when_to_display": [
            "First time collecting PII in a conversation",
            "When requesting sensitive information (address, full name, mobile, email)",
            "During order placement",
            "During reservation booking",
            "During SuperCard registration"
        ]
    },
    "data_minimization": {
        "principle": "Only collect data necessary for the specific transaction",
        "examples": {
            "delivery_order": ["Name", "Mobile", "Address", "Order items"],
            "store_locator": ["General area only - not full address"],
            "promo_inquiry": ["No personal data needed"]
        }
    },
    "data_retention": {
        "conversation_logs": "90 days for quality assurance, then anonymized",
        "order_data": "Retained as per business requirements",
        "pii_deletion": "Customer can request deletion via Wecare@shakeys.biz"
    },
    "sensitive_data_handling": {
        "never_collect": ["Government IDs", "SSS numbers", "Full credit card numbers", "Passwords"],
        "encrypted_storage": ["Mobile numbers", "Email addresses", "Physical addresses"],
        "access_controls": "PII accessible only to authorized personnel"
    },
    "customer_rights": {
        "right_to_access": "Customer can request copy of their data",
        "right_to_correction": "Customer can update incorrect information",
        "right_to_deletion": "Customer can request data deletion",
        "right_to_object": "Customer can opt-out of marketing communications"
    }
}
```

---

## 15. Integration Points

### System Integrations

```python
INTEGRATION_REQUIREMENTS = {
    "pos_system": {
        "purpose": "Submit orders, update inventory, process payments",
        "data_flow": "Bot → POS API → Store Kitchen",
        "required_endpoints": [
            "POST /orders (create new order)",
            "GET /menu (fetch current menu and prices)",
            "GET /stores (fetch store list and status)",
            "GET /promos (fetch active promotions)"
        ],
        "error_handling": "If POS unavailable, queue order and notify customer of delay"
    },
    "geo_lookup_service": {
        "purpose": "Validate addresses, check delivery coverage",
        "data_flow": "Bot → Geo API → Trading Area Database",
        "required_endpoints": [
            "POST /validate_address (parse and validate address)",
            "GET /coverage_check (check if address in trading area)",
            "GET /nearest_store (find closest serviceable store)"
        ]
    },
    "payment_gateway": {
        "purpose": "Process online payments",
        "supported_methods": ["Credit/Debit cards", "GCash", "Online banking"],
        "security": "PCI-DSS compliant, tokenization"
    },
    "sms_service": {
        "purpose": "Send OTPs, order confirmations, status updates",
        "required_capabilities": [
            "Send OTP",
            "Send order confirmation",
            "Send ready-for-pickup notification",
            "Send rider-on-the-way notification"
        ]
    },
    "crm_system": {
        "purpose": "Store customer profiles, order history, SuperCard data",
        "data_sync": "Real-time or near-real-time",
        "required_endpoints": [
            "GET /customer (fetch customer profile)",
            "POST /customer (create/update customer)",
            "GET /supercard (fetch SuperCard details)",
            "GET /order_history (fetch past orders)"
        ]
    },
    "analytics_platform": {
        "purpose": "Track bot performance, user behavior, business metrics",
        "events_to_track": [
            "Conversation started",
            "Intent detected",
            "Order placed",
            "Order cancelled",
            "Escalation to human",
            "Customer satisfaction rating"
        ]
    }
}
```

---

## 16. Deployment & Maintenance

### Deployment Checklist

```python
DEPLOYMENT_CHECKLIST = {
    "pre_launch": [
        "✓ Complete training data ingestion",
        "✓ Unit and integration testing passed",
        "✓ UAT completed with real users",
        "✓ All system integrations tested",
        "✓ Escalation workflows verified",
        "✓ Data privacy compliance reviewed",
        "✓ Agent dashboard operational",
        "✓ Monitoring and alerting configured",
        "✓ Rollback plan prepared"
    ],
    "soft_launch": [
        "✓ Deploy to 10% of users",
        "✓ Monitor performance closely",
        "✓ Collect feedback",
        "✓ Quick iteration on issues",
        "✓ Gradual increase to 50%, then 100%"
    ],
    "post_launch": [
        "✓ Daily performance review (first week)",
        "✓ Weekly optimization (first month)",
        "✓ Continuous training data addition",
        "✓ Regular model updates"
    ]
}
```

### Ongoing Maintenance

```python
MAINTENANCE_ACTIVITIES = {
    "daily": [
        "Monitor bot health (uptime, response time)",
        "Review escalated conversations",
        "Check for system errors",
        "Update any time-sensitive information"
    ],
    "weekly": [
        "Analyze performance metrics",
        "Review unresolved queries",
        "Update menu changes",
        "Add new promotional rules"
    ],
    "monthly": [
        "Full performance review",
        "Retrain models with new data",
        "Optimize underperforming intents",
        "Review and update response templates"
    ],
    "quarterly": [
        "Comprehensive system audit",
        "Major model updates",
        "Feature enhancements",
        "Stakeholder review and planning"
    ]
}
```

---

## CONCLUSION

This comprehensive use case document provides a complete blueprint for building and training the Shakey's Pizza Bot using Claude Code. The bot is designed to handle 70%+ of customer queries autonomously while providing seamless escalation for complex cases.

### Key Success Factors:

1. **Natural Conversation**: Taglish support and cultural sensitivity
2. **Complete Order Flows**: Detailed step-by-step guidance for all order types
3. **Accurate Location Services**: Robust address validation and coverage checking
4. **Business Rule Compliance**: 100% adherence to promotions, policies, and privacy laws
5. **Smart Escalation**: Know when to hand over to humans
6. **Continuous Improvement**: Built-in feedback loops and optimization

### Next Steps for Implementation:

1. Ingest this document into Claude Code training
2. Set up all required system integrations
3. Begin with soft launch (10% traffic)
4. Monitor, iterate, and scale
5. Maintain continuous improvement cycle

**Document Version**: 1.0
**For**: Shakey's Pizza Philippines Bot Development
**Purpose**: Complete training guide for Claude Code implementation
**Contact**: Development Team

---

_This document should be treated as a living document, updated regularly as the business evolves, new features are added, and customer needs change._
