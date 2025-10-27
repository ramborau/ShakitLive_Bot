# Rollback Instructions

## Rollback Point Created
**Date**: 2025-01-27
**Commit**: ab80975
**Tag**: `sobot-api-rollback`

This rollback point was created before switching from Sobot API to official Facebook Messenger API.

## Current State (Before Facebook API Migration)

### Working Features
- ✅ Text messages received via Facebook webhook
- ✅ Messages processed through FlowHandler  
- ✅ Bot responses sent via Sobot API
- ✅ Database persistence with Prisma
- ✅ Flow state management (tracking, supercard, order flows)
- ✅ Conversation context tracking
- ✅ Clear command working
- ✅ Multiple webhook endpoints ready

### Known Issues
- ❌ Postback events not received (Facebook subscription missing `messaging_postbacks`)

### Active Endpoints
1. `/api/webhook` - Facebook Messenger webhook (receives messages, sends via Sobot)
2. `/api/sobot-webhook` - Sobot API webhook (verification token: "BotPe2025!")
3. `/api/generic-webhook` - Generic webhook (verification token: "ShakeyBot2025")

### Environment Variables (from .env)
- `SOBOT_APP_KEY` - Sobot API key
- `SOBOT_CID` - Sobot customer ID  
- `SOBOT_ACCESS_TOKEN` - Sobot access token
- `GEMINI_API_KEY` - Gemini AI API key
- `DATABASE_URL` - SQLite database URL

## How to Rollback

### Option 1: Using Git Tag
```bash
cd "/Users/rahul/ShakitLive Bot"
git reset --hard sobot-api-rollback
```

### Option 2: Using Commit Hash
```bash
cd "/Users/rahul/ShakitLive Bot"
git reset --hard ab80975
```

### After Rollback
1. Restart the development server:
   ```bash
   npm run dev
   ```

2. Verify the Sobot service is working:
   - Check `/lib/services/sobot-service.ts` exists
   - Token refresh should be working
   - Messages should send via Sobot API

3. Test endpoints:
   - Facebook webhook: `https://YOUR-NGROK-URL/api/webhook`
   - Sobot webhook: `https://YOUR-NGROK-URL/api/sobot-webhook`

## What Changes After Migration

After switching to Facebook API, these will change:
- Message sending will use Facebook Send API instead of Sobot
- Access token will be Facebook Page Access Token
- No more Sobot token refresh needed
- Postback events should work natively
- Message templates will use Facebook template format

## Important Files in Sobot Implementation

- `/lib/services/sobot-service.ts` - Sobot API client
- `/lib/services/token-service.ts` - Sobot token refresh logic
- `/app/api/webhook/route.ts` - Main webhook (uses Sobot for sending)
- `/app/api/sobot-webhook/route.ts` - Sobot webhook endpoint
- `/message-templates.json` - Sobot message templates
- `/zappy-message-templates.json` - Additional templates

## Support

If you encounter issues after rollback:
1. Check that .env file has Sobot credentials
2. Verify Sobot token is not expired (check TOKEN.MD)
3. Clear .next cache: `rm -rf .next && npm run dev`
4. Check logs for token refresh errors

---

**Generated with Claude Code**
https://claude.com/claude-code

Co-Authored-By: Claude <noreply@anthropic.com>
