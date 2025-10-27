# Intent Detection Test Guide

## Purpose
Test that all flows are correctly triggered by their hot keywords and don't fall back to generic FAQ.

## Test Matrix

### 1. SUPERCARD FLOW
**Should Trigger On:**
- "supercard"
- "super card"
- "what is supercard"
- "tell me about supercard"
- "loyalty card"
- "rewards card"
- "shakey's card"
- "membership card"
- "shakey's loyalty"
- "shakey's rewards"

**Should NOT Show:** Generic FAQ message
**Expected:** Supercard flow with Gold/Classic card carousel

---

### 2. TRACKING FLOW
**Should Trigger On:**
- "track order"
- "tracking"
- "order status"
- "where is my order"
- "saan na order ko"
- "nasaan order"
- "delivery status"

**Should NOT Show:** Generic FAQ message
**Expected:** Request for order number

---

### 3. ORDER FLOW
**Should Trigger On:**
- "order"
- "buy pizza"
- "want to order"
- "gusto bumili"
- "pa-order"
- "delivery"

**Should NOT Show:** Generic FAQ message
**Expected:** Order method selection (AI Order / Browse Menu)

---

### 4. LOCATION FLOW
**Should Trigger On:**
- "location"
- "branch"
- "nearest store"
- "saan branch"
- "where is shakey's"

**Should NOT Show:** Generic FAQ message
**Expected:** Quick replies with "Yes, show me" / "Call instead" / "Visit website"

---

### 5. PARTY FLOW
**Should Trigger On:**
- "party"
- "birthday"
- "group order"
- "party package"
- "handaan"

**Should NOT Show:** Generic FAQ message
**Expected:** Party package selection

---

### 6. COMPLAINT FLOW
**Should Trigger On:**
- "complaint"
- "problem"
- "wrong order"
- "late delivery"
- "refund"

**Should NOT Show:** Generic FAQ message
**Expected:** Issue description request

---

### 7. PROMO FLOW
**Should Trigger On:**
- "promo"
- "discount"
- "sale"
- "offers"

**Should NOT Show:** Generic FAQ message
**Expected:** Current promotions display

---

### 8. FAQ FLOW (Fallback)
**Should Trigger On:**
- "how to order" (generic how question)
- "when are you open" (generic when question)
- "payment methods" (generic FAQ)

**Expected:** Relevant FAQ answer or generic FAQ message

---

## Testing Protocol

1. **Clear Conversation**
   - Send "clear conversation" before each test
   - Verify fresh start

2. **Send Test Query**
   - Send one of the trigger phrases
   - Wait for bot response

3. **Verify Correct Flow**
   - Check that specific flow triggered
   - Confirm NO generic FAQ message appears
   - Verify flow steps match documentation

4. **Document Results**
   - Note any failures
   - Record actual vs expected behavior

---

## Common Issues & Fixes

### Issue: Still showing generic FAQ
**Possible Causes:**
1. Gemini AI detecting wrong intent
2. Keyword not in matchesX() function
3. Cache not cleared
4. Server not restarted

**Fix:**
1. Check console logs for detected intent
2. Add keyword to intent-detector.ts
3. Run: `rm -rf .next && restart server`
4. Test with fallback keywords (no Gemini)

### Issue: Flow starts but gets stuck
**Possible Causes:**
1. Switch case routing to wrong handler
2. Early return guard blocking user input
3. Missing quick reply handling

**Fix:**
1. Check switch/case in flow file
2. Remove guards that return for non-empty messages
3. Add quick reply payload handling

---

## Test Results Template

```
Date: [DATE]
Tester: [NAME]

SUPERCARD FLOW:
[ ] ✅ "supercard" → Supercard flow
[ ] ✅ "what is supercard" → Supercard flow
[ ] ❌ Generic FAQ shown

TRACKING FLOW:
[ ] ✅ "track order" → Tracking flow
[ ] ✅ "where is my order" → Tracking flow
[ ] ❌ Generic FAQ shown

ORDER FLOW:
[ ] ✅ "order" → Order flow
[ ] ✅ "want pizza" → Order flow
[ ] ❌ Generic FAQ shown

LOCATION FLOW:
[ ] ✅ "location" → Location flow with quick replies
[ ] ✅ "nearest branch" → Location flow
[ ] ❌ Generic FAQ shown

PARTY FLOW:
[ ] ✅ "party" → Party flow
[ ] ✅ "birthday package" → Party flow
[ ] ❌ Generic FAQ shown

COMPLAINT FLOW:
[ ] ✅ "complaint" → Complaint flow
[ ] ✅ "wrong order" → Complaint flow
[ ] ❌ Generic FAQ shown

PROMO FLOW:
[ ] ✅ "promo" → Promo flow
[ ] ✅ "discount" → Promo flow
[ ] ❌ Generic FAQ shown

NOTES:
[Add any observations or issues]
```

---

## Quick Test Commands

Use these exact messages to test each flow:

```
supercard
track order
order pizza
location
party
complaint
promo
```

Each should trigger its respective flow, NOT the generic FAQ.
