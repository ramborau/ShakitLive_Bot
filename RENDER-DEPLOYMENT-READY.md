# RENDER DEPLOYMENT - READY TO DEPLOY

**Status**: All code pushed to GitHub - Ready for production deployment on Render

**GitHub Repository**: https://github.com/ramborau/ShakitLive_Bot

**Latest Commits**:
- `032125b` - docs: Add deployment and GitHub setup documentation
- `d8095e0` - fix: Change React.Node to React.ReactNode in layout.tsx (TypeScript fix)
- `9730bdf` - feat: Add beautiful COMPLEX COUPON templates for PromoFlow and SupercardFlow

---

## What's Ready

1. **PromoFlow with COMPLEX COUPON Templates** - Shows 3 beautiful coupons when users ask about promos
2. **SupercardFlow with COMPLEX COUPON Templates** - Shows Gold and Classic card coupons
3. **All Messages Through Gemini AI** - Intent detection, language detection, Zappy personality
4. **Bot Getting Stuck Issue Fixed** - Cache issue resolved
5. **TypeScript Build Error Fixed** - React.ReactNode fix applied and pushed

---

## DEPLOY TO RENDER NOW

### Option 1: Via Render Dashboard (Recommended - Easiest)

1. **Go to Render Dashboard**:
   ```
   https://dashboard.render.com
   ```

2. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect to GitHub (authorize Render)
   - Select repository: `ramborau/ShakitLive_Bot`

3. **Configure Service**:
   - **Name**: `shakitlive-bot`
   - **Region**: Singapore (closest to Philippines)
   - **Branch**: `main`
   - **Root Directory**: (leave empty)
   - **Environment**: `Node`
   - **Build Command**:
     ```
     npm install && npx prisma generate && npm run build
     ```
   - **Start Command**:
     ```
     npm start
     ```

4. **Add Environment Variables** (Click "Advanced" → "Add Environment Variable"):

   You need to set these from your local `.env` file:

   ```
   DATABASE_URL=<your-postgresql-database-url>
   FACEBOOK_PAGE_ACCESS_TOKEN=<from-local-.env>
   FACEBOOK_VERIFY_TOKEN=<from-local-.env>
   GEMINI_API_KEY=<from-local-.env>
   GOOGLE_MAPS_API_KEY=<from-local-.env>
   GOOGLE_ANALYTICS_TRACKING_ID=<from-local-.env>
   NODE_ENV=production
   ```

   **To get these values**, run:
   ```bash
   cat .env
   ```

5. **Create Web Service** - Click "Create Web Service"

6. **Wait for Deployment** (3-5 minutes)
   - Render will clone your GitHub repo
   - Install dependencies
   - Generate Prisma client
   - Build Next.js app
   - Start the server

7. **Get Your Deployment URL**:
   ```
   https://shakitlive-bot.onrender.com
   ```
   (or whatever name you chose)

---

### Option 2: Via Render API (Using Your API Key)

**API Key**: `rnd_Yrxq57naJx6IbUxhRn3GyZiZYI1s`

First, get your Owner ID:
```bash
curl -H "Authorization: Bearer rnd_Yrxq57naJx6IbUxhRn3GyZiZYI1s" \
  https://api.render.com/v1/owners
```

Then create the service (replace `<OWNER_ID>` with result from above):
```bash
curl -X POST https://api.render.com/v1/services \
  -H "Authorization: Bearer rnd_Yrxq57naJx6IbUxhRn3GyZiZYI1s" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "web_service",
    "name": "shakitlive-bot",
    "ownerId": "<OWNER_ID>",
    "repo": "https://github.com/ramborau/ShakitLive_Bot",
    "branch": "main",
    "region": "singapore",
    "buildCommand": "npm install && npx prisma generate && npm run build",
    "startCommand": "npm start",
    "envVars": [
      {"key": "NODE_ENV", "value": "production"},
      {"key": "DATABASE_URL", "value": "<your-db-url>"},
      {"key": "FACEBOOK_PAGE_ACCESS_TOKEN", "value": "<your-token>"},
      {"key": "FACEBOOK_VERIFY_TOKEN", "value": "<your-verify-token>"},
      {"key": "GEMINI_API_KEY", "value": "<your-api-key>"},
      {"key": "GOOGLE_MAPS_API_KEY", "value": "<your-maps-key>"},
      {"key": "GOOGLE_ANALYTICS_TRACKING_ID", "value": "<your-ga-id>"}
    ]
  }'
```

---

## After Deployment Completes

### Step 1: Update Facebook Webhook URL

1. **Get your Render URL**: `https://shakitlive-bot.onrender.com`

2. **Go to Facebook Developer Console**:
   ```
   https://developers.facebook.com/apps
   ```

3. **Select your App** → **Messenger** → **Settings**

4. **Update Webhook**:
   - Callback URL: `https://shakitlive-bot.onrender.com/api/generic-webhook`
   - Verify Token: (use your `FACEBOOK_VERIFY_TOKEN` from .env)
   - Click "Verify and Save"

5. **Subscribe to Webhook Fields**:
   - ✅ messages
   - ✅ messaging_postbacks
   - ✅ message_deliveries
   - ✅ message_reads

### Step 2: Test Production Bot

1. **Open Facebook Messenger**
2. **Search for your Shakey's Pizza page**
3. **Send test messages**:
   - "hi" → Should greet with Zappy personality
   - "any promos?" → Should show **3 COMPLEX COUPONS**
   - "supercard" → Should show **2 COMPLEX COUPONS** (Gold & Classic)
   - "location" → Should handle location inquiry
   - "menu" → Should show menu options

4. **Check Render Logs**:
   - Go to Render dashboard → Your service → Logs
   - Look for `[PromoFlow]` and `[SupercardFlow]` logs
   - Verify no errors

### Step 3: Monitor Performance

- **Response Time**: Should be < 3 seconds
- **COMPLEX COUPONS**: Should display beautifully (not plain text)
- **Bot Stability**: Should not get stuck after 2-3 messages
- **Language Detection**: Should work for English/Tagalog/Taglish
- **First Name Personalization**: Should use user's first name

---

## Troubleshooting

### If Render Build Fails:
- Check build logs in Render dashboard
- Verify all environment variables are set correctly
- Verify DATABASE_URL is accessible from Render
- Check that PostgreSQL database is running

### If Bot Doesn't Respond:
- Verify Facebook webhook URL is correct
- Check Render logs for errors
- Verify FACEBOOK_PAGE_ACCESS_TOKEN is valid
- Check webhook subscription fields are enabled

### If Coupons Don't Show:
- Check Render logs for `[PromoFlow]` and `[SupercardFlow]` entries
- Verify Facebook Send API is working
- Check that COMPLEX COUPON template is being sent (not plain text)

---

## What Will Happen When Users Message the Bot

1. **User says "hi"**:
   - Gemini AI detects `greeting` intent
   - Bot responds with Zappy personality greeting
   - Quick replies for common actions

2. **User says "any promos?"**:
   - Gemini AI detects `promo` intent
   - PromoFlow activates
   - Sends **3 COMPLEX COUPON templates**:
     - Family Meal Deals (₱1,149-₱2,699)
     - Pizza 'N' Mojos Bundles
     - SuperCard Exclusive Deals

3. **User says "supercard"**:
   - Gemini AI detects `supercard` intent
   - SupercardFlow activates
   - Sends **2 COMPLEX COUPON templates**:
     - Gold Card (₱999)
     - Classic Card (₱699)

4. **User asks other questions**:
   - Gemini AI analyzes intent
   - Routes to appropriate flow
   - Responds with Zappy personality
   - Language detection works (en/tl/taglish)

---

## Summary

**Code Status**: ✅ All pushed to GitHub
**Build Error**: ✅ Fixed (React.ReactNode)
**COMPLEX COUPONS**: ✅ Implemented (PromoFlow + SupercardFlow)
**Bot Stability**: ✅ Fixed (cache issue resolved)
**Gemini AI**: ✅ All messages analyzed
**Zappy Personality**: ✅ Integrated

**Next Action**: Deploy to Render using one of the options above

---

**Deployment Prepared By**: Claude Code
**Date**: October 27, 2025
**Ready**: YES - Deploy Now! 🚀
