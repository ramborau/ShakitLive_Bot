# FINAL DEPLOYMENT INSTRUCTIONS - RENDER.YAML APPROACH

## ✅ EVERYTHING IS READY!

I've completed all the setup work. Now you just need to connect Render to your GitHub repository and it will auto-deploy using the `render.yaml` file I created.

---

## WHAT I'VE COMPLETED

1. ✅ **Created PostgreSQL Database on Render**
   - Database ID: `dpg-d3vip8bipnbc739mibag-a`
   - Region: Singapore
   - Status: Available

2. ✅ **Pushed All Code to GitHub**
   - Repository: https://github.com/ramborau/ShakitLive_Bot
   - Latest commit includes `render.yaml` configuration file

3. ✅ **Created render.yaml**
   - Automatic deployment configuration
   - Database connection pre-configured
   - All build commands set up
   - Environment variables template ready

---

## YOUR ACTION: DEPLOY VIA RENDER DASHBOARD (2 MINUTES)

### Step 1: Go to Render Dashboard
```
https://dashboard.render.com
```

### Step 2: Create New Blueprint
1. Click **"New +"** → **"Blueprint"**
2. Connect to your GitHub repository: **`ramborau/ShakitLive_Bot`**
3. Render will automatically detect the `render.yaml` file

### Step 3: Configure Secret Environment Variables
The `render.yaml` file has `sync: false` for sensitive variables. You need to manually add these:

Click **"Add Environment Variable"** for each:

**FACEBOOK_PAGE_ACCESS_TOKEN**:
```
EAASnq7m5LikBP7DYZCcPdnLJ4JR0pG0TxzNpc9L4R9sqJfObi1LpgqZA7R4yJEscGkFgelxZC1jTEnceToqgCZBbRrZA9K41igJylSc3v4ZAlQleV9vCLpbvSHEZBJXyfYRljONzE2MK7PQ1qhsvWGOHkAV0JpIaABSF47igs3eRSF9DicLuixqZB4fZCkquRqIzBZAlHZC0QZDZD
```

**GEMINI_API_KEY**:
```
AIzaSyBZKaIkDD5E-2rxluU7xVUb3IQCalVz-Yw
```

### Step 4: Apply Blueprint
Click **"Apply"** and Render will:
- Create the web service
- Link it to the existing PostgreSQL database I created
- Set up all environment variables
- Start the build and deployment process

### Step 5: Wait for Deployment (3-5 minutes)
Render will:
1. Clone your GitHub repository
2. Install dependencies (`npm install`)
3. Generate Prisma client (`npx prisma generate`)
4. Build Next.js app (`npm run build`)
5. Run database migrations (`npx prisma migrate deploy`)
6. Start the server (`npm start`)

### Step 6: Get Your Deployment URL
Once deployed, you'll see something like:
```
https://shakitlive-bot.onrender.com
```

---

## AFTER DEPLOYMENT COMPLETES

### 1. Update Facebook Webhook URL

1. Go to **Facebook Developer Console**: https://developers.facebook.com/apps
2. Select your App → **Messenger** → **Settings**
3. Update Webhook:
   - **Callback URL**: `https://shakitlive-bot.onrender.com/api/generic-webhook`
   - **Verify Token**: `ShakeyBot2025`
   - Click **"Verify and Save"**
4. Subscribe to Webhook Fields:
   - ✅ messages
   - ✅ messaging_postbacks
   - ✅ message_deliveries
   - ✅ message_reads

### 2. Test Your Production Bot

1. Open **Facebook Messenger**
2. Search for your **Shakey's Pizza page**
3. Send test messages:

**Test Greetings:**
```
hi
```
Should respond with Zappy personality greeting

**Test Promos (CRITICAL - should show 3 COMPLEX COUPONS):**
```
any promos?
```
Should display:
- Family Meal Deals coupon (₱1,149-₱2,699)
- Pizza 'N' Mojos Bundles coupon
- SuperCard Exclusive Deals coupon

**Test Supercard (should show 2 COMPLEX COUPONS):**
```
supercard
```
Should display:
- Gold Card coupon (₱999)
- Classic Card coupon (₱699)

**Test Other Flows:**
```
location
menu
```

### 3. Monitor Logs

Go to Render dashboard → Your service → **Logs**

Look for:
- `[PromoFlow]` - Confirms promo coupons are being sent
- `[SupercardFlow]` - Confirms supercard coupons are being sent
- `[GeminiService]` - Confirms AI intent detection
- No error messages

---

## WHAT'S IN THE render.yaml FILE

The `render.yaml` file I created contains:

```yaml
databases:
  - name: shakitlive-bot-db
    # PostgreSQL database configuration

services:
  - type: web
    name: shakitlive-bot
    runtime: node
    plan: free
    region: singapore
    branch: main
    buildCommand: npm install && npx prisma generate && npm run build
    startCommand: npx prisma migrate deploy && npm start
    envVars:
      # All environment variables pre-configured
      # Database URL auto-linked
      # Sensitive keys require manual input (for security)
```

---

## TROUBLESHOOTING

### If Render Doesn't Detect render.yaml:
- Make sure you selected "Blueprint" (not "Web Service")
- Verify the file is in the root of your repository
- Check that the latest code is pushed to GitHub

### If Build Fails:
- Check Render build logs for specific errors
- Verify all environment variables are set
- Ensure `FACEBOOK_PAGE_ACCESS_TOKEN` and `GEMINI_API_KEY` are added

### If Bot Doesn't Respond:
- Verify Facebook webhook URL is correct
- Check Render logs for webhook errors
- Ensure webhook verify token matches: `ShakeyBot2025`

### If Coupons Don't Show:
- Check Render logs for `[PromoFlow]` entries
- Verify no errors in the logs
- Test locally first if needed

---

## ALTERNATIVE: MANUAL DEPLOYMENT

If you prefer not to use the Blueprint approach, you can still deploy manually:

1. Go to Render Dashboard
2. Click "New +" → "Web Service"
3. Connect to `ramborau/ShakitLive_Bot`
4. Configure manually using values from `RENDER-DEPLOYMENT-COMPLETE.md`

---

## DATABASE CREDENTIALS (FOR REFERENCE)

**Database Name**: `shakitlive_bot`
**Database ID**: `dpg-d3vip8bipnbc739mibag-a`
**Internal Connection String**:
```
postgresql://shakitlive_user:t7GRGpa07YGo89URfKEVkcP0UGSMuJtq@dpg-d3vip8bipnbc739mibag-a/shakitlive_bot
```

**Dashboard URL**: https://dashboard.render.com/d/dpg-d3vip8bipnbc739mibag-a

---

## SUMMARY

**Status**: Everything is ready for deployment!

**What You Need to Do**:
1. Go to Render Dashboard
2. Create Blueprint from GitHub repo
3. Add 2 secret environment variables (FACEBOOK_PAGE_ACCESS_TOKEN, GEMINI_API_KEY)
4. Click "Apply"
5. Wait 3-5 minutes
6. Update Facebook webhook URL
7. Test the bot!

**Expected Result**:
- Bot responds with Zappy personality
- Promo queries show 3 beautiful COMPLEX COUPONS
- Supercard queries show 2 beautiful COMPLEX COUPONS
- All flows work correctly
- No bot getting stuck issues

---

**Deployment Prepared By**: Claude Code
**Date**: October 27, 2025
**Method**: Render Blueprint with render.yaml
**Status**: Ready to Deploy 🚀
