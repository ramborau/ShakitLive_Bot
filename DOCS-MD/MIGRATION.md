# API Migration: Sobot → Facebook Messenger API

**Migration Date**: 2025-01-27
**Rollback Point**: `sobot-api-rollback` (commit ab80975)

## Migration Objective

Replace Sobot API with official Facebook Messenger Send API for:
1. Sending all message types (text, templates, buttons, quick replies)
2. Fetching user profiles via Facebook Graph API
3. Personalizing messages with user first names

---

## Environment Variables

### Added
```env
FACEBOOK_PAGE_ACCESS_TOKEN=EAASnq7m5LikBPxeB2ZCENL4C0d8M23sZBgi0qZBBDRbd7QQL2rgNwZBSnSmIACD4800SFg4Dpoe8hGqFUKZBYC8omxjoZCS8HtaaJUSXCcn4DXog7PtjrRDYD0eCKJuyb8s7ldm8XWgapS5wXRufRbMQuKpE56LRntM6NwkkeRzTVAGJdPZAczcZAk308D3hEeGwlW2CXwZDZD
FACEBOOK_PAGE_ID=759563007234526
```

### Deprecated (kept for rollback)
- `SOBOT_API_URL`
- `SOBOT_APP_KEY`
- `SOBOT_CID`
- `SOBOT_ACCESS_TOKEN`
- `MESSENGERPEOPLE_API_URL`
- `MESSENGERPEOPLE_CHANNEL_UUID`
- `MESSENGERPEOPLE_BEARER_TOKEN`

---

## Files Created

### ✅ `/MIGRATION.md`
**Status**: Created
**Purpose**: Track all migration changes

### ⏳ `/lib/services/facebook-profile-service.ts`
**Status**: Pending
**Purpose**: Fetch user profiles from Facebook Graph API
**API Endpoint**: `https://graph.facebook.com/v24.0/{psid}?fields=first_name,last_name,profile_pic&access_token={token}`

### ⏳ `/lib/services/facebook-service.ts`
**Status**: Pending
**Purpose**: Send messages via Facebook Send API
**Supported Message Types**:
- TEXT - Basic text messages
- BUTTON Template - Buttons with postback/web_url actions
- COUPON Template - Promotional coupon codes
- GENERIC Template - Carousels with images and buttons
- QUICK REPLIES - Quick reply buttons

**API Endpoint**: `https://graph.facebook.com/v24.0/{PAGE_ID}/messages?access_token={token}`

---

## Files Modified

### ⏳ `/lib/db-operations.ts`
**Status**: Pending
**Changes**:
- [ ] Replace `MessengerPeopleService` import with `FacebookProfileService`
- [ ] Update `upsertUser()` to use Facebook Graph API
- [ ] Add `getUserByPsid(psid)` helper function
- [ ] Enrich user profile on every message (not just first)

### ⏳ `/app/api/webhook/route.ts`
**Status**: Pending
**Changes**:
- [ ] Replace `SobotService` with `FacebookService`
- [ ] Add profile enrichment on every incoming message
- [ ] Update "clear" command to use FacebookService

### ⏳ `/app/api/generic-webhook/route.ts`
**Status**: Pending
**Changes**:
- [ ] Replace `SobotService` with `FacebookService`
- [ ] Add profile enrichment on every incoming message

### ⏳ `/lib/flows/flow-handler.ts`
**Status**: Pending
**Changes**:
- [ ] Replace `SobotService` with `FacebookService`
- [ ] Update `sendBotMessage()` to personalize greetings
- [ ] Update `sendBotMessageWithButtons()` to personalize select messages
- [ ] Update `getLocalizedMessage()` to accept optional firstName parameter

### ⏳ `/lib/flows/order-flow.ts`
**Status**: Pending
**Changes**:
- [ ] Replace `SobotService` with `FacebookService`
- [ ] Add personalization to order confirmations

### ⏳ `/lib/flows/location-flow.ts`
**Status**: Pending
**Changes**:
- [ ] Replace `SobotService` with `FacebookService`

### ⏳ `/lib/flows/tracking-flow.ts`
**Status**: Pending
**Changes**:
- [ ] Replace `SobotService` with `FacebookService`

### ⏳ `/lib/flows/supercard-flow.ts`
**Status**: Pending
**Changes**:
- [ ] Replace `SobotService` with `FacebookService`

### ⏳ `/lib/flows/complaint-flow.ts`
**Status**: Pending
**Changes**:
- [ ] Replace `SobotService` with `FacebookService`

### ⏳ `/lib/flows/party-order-flow.ts`
**Status**: Pending
**Changes**:
- [ ] Replace `SobotService` with `FacebookService`

---

## Files Deprecated (Kept for Rollback)

### `/lib/services/sobot-service.ts`
**Status**: Deprecated
**Note**: Keep for rollback to commit ab80975

### `/lib/services/token-service.ts`
**Status**: Deprecated
**Note**: Keep for rollback to commit ab80975

### `/lib/services/messengerpeople-service.ts`
**Status**: Deprecated
**Note**: Keep for rollback to commit ab80975

---

## Personalization Rules

Messages that should be personalized with "Hey {firstName}":
- ✅ Welcome/Greeting messages
- ✅ Order confirmations ("Got it, {firstName}!")
- ✅ Cart summaries ("Perfect, {firstName}!")
- ❌ FAQ/Generic responses
- ❌ Error messages

---

## Testing Checklist

- [ ] User profile enrichment works on first message
- [ ] User profile refreshes on subsequent messages
- [ ] Text messages send successfully
- [ ] Button templates render correctly
- [ ] Coupon templates render correctly
- [ ] Generic templates (carousels) render correctly
- [ ] Quick replies work
- [ ] Postback buttons trigger correct flows
- [ ] Personalization shows correct first names
- [ ] All flows work (order, location, tracking, supercard, complaint, party)
- [ ] "Clear" command works with FacebookService

---

## Rollback Instructions

If migration fails, rollback using:

```bash
cd "/Users/rahul/ShakitLive Bot"
git reset --hard sobot-api-rollback
npm run dev
```

Then restore Sobot environment variables in `.env`.

---

## Migration Log

### 2025-01-27 - Migration Started
- Created MIGRATION.md
- Plan approved
- Beginning implementation...

### 2025-01-27 - Core Services Created
- ✅ Created `/lib/services/facebook-profile-service.ts` - Facebook Graph API profile fetching
- ✅ Created `/lib/services/facebook-service.ts` - All 5 working message types (TEXT, BUTTON, COUPON, GENERIC, QUICK REPLIES)

### 2025-01-27 - Database & Webhooks Updated
- ✅ Updated `/lib/db-operations.ts` - Now uses FacebookProfileService and refreshes profiles on every message
- ✅ Added `getUserByPsid()` helper function
- ✅ Updated `/app/api/webhook/route.ts` - Replaced SobotService with FacebookService
- ✅ Verified `/app/api/generic-webhook/route.ts` - No changes needed (doesn't use Sobot)

### 2025-01-27 - Flow System Updated
- ✅ Updated `/lib/flows/flow-handler.ts`:
  - Replaced SobotService with FacebookService
  - Added personalization support to `sendBotMessage()` with optional `personalize` parameter
  - Greeting messages now include "Hey {firstName}!" personalization
  - All button messages updated to use FacebookService

### 2025-01-27 - All Flow Files Updated (50 references replaced)
- ✅ `/lib/flows/order-flow.ts` - 18 SobotService → FacebookService replacements
- ✅ `/lib/flows/location-flow.ts` - 8 replacements
- ✅ `/lib/flows/tracking-flow.ts` - 8 replacements
- ✅ `/lib/flows/supercard-flow.ts` - 6 replacements
- ✅ `/lib/flows/complaint-flow.ts` - 4 replacements
- ✅ `/lib/flows/party-order-flow.ts` - 6 replacements

**Total Changes**: 50 SobotService method calls replaced across 6 flow files

### 2025-01-27 - Migration Code Complete! 🎉
- All code changes completed
- Zero SobotService references remaining
- Ready for environment variable setup and testing

---

**Next Steps**:
1. Add `FACEBOOK_PAGE_ACCESS_TOKEN` and `FACEBOOK_PAGE_ID` to `.env`
2. Test with real Facebook messages
3. Verify personalization works correctly
