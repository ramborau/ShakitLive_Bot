# VERCEL DEPLOYMENT GUIDE - ShakitLive Bot

## ✅ CODE IS READY FOR VERCEL!

All TypeScript errors have been fixed and the code has been pushed to GitHub with Vercel configuration files.

---

## OPTION 1: DEPLOY VIA VERCEL DASHBOARD (RECOMMENDED - 5 MINUTES)

### Step 1: Go to Vercel Dashboard
1. Visit: https://vercel.com/
2. Sign in with your GitHub account
3. Click **"Add New Project"**

### Step 2: Import GitHub Repository
1. Select **"Import Git Repository"**
2. Find and select: **`ramborau/ShakitLive_Bot`**
3. Click **"Import"**

### Step 3: Configure Project Settings

**Framework Preset:** Next.js (auto-detected)

**Root Directory:** `./` (leave as default)

**Build Command:**
```
npx prisma generate && npm run build
```

**Install Command:**
```
npm install
```

**Output Directory:** `.next` (auto-detected)

### Step 4: Add Environment Variables

Click **"Environment Variables"** and add the following (one by one):

**NODE_ENV**
```
production
```

**DATABASE_URL** (Use your existing Render PostgreSQL database)
```
postgresql://shakitlive_user:t7GRGpa07YGo89URfKEVkcP0UGSMuJtq@dpg-d3vip8bipnbc739mibag-a.singapore-postgres.render.com/shakitlive_bot
```

**FACEBOOK_PAGE_ID**
```
577449412108142
```

**FACEBOOK_PAGE_ACCESS_TOKEN**
```
EAASnq7m5LikBP7DYZCcPdnLJ4JR0pG0TxzNpc9L4R9sqJfObi1LpgqZA7R4yJEscGkFgelxZC1jTEnceToqgCZBbRrZA9K41igJylSc3v4ZAlQleV9vCLpbvSHEZBJXyfYRljONzE2MK7PQ1qhsvWGOHkAV0JpIaABSF47igs3eRSF9DicLuixqZB4fZCkquRqIzBZAlHZC0QZDZD
```

**FACEBOOK_VERIFY_TOKEN**
```
ShakeyBot2025
```

**GEMINI_API_KEY**
```
AIzaSyBZKaIkDD5E-2rxluU7xVUb3IQCalVz-Yw
```

**TEST_RECIPIENT_ID**
```
8485127078186699
```

### Step 5: Deploy

1. Click **"Deploy"**
2. Wait 2-3 minutes for the build to complete
3. Vercel will automatically:
   - Clone your GitHub repository
   - Install dependencies
   - Generate Prisma client
   - Build the Next.js app
   - Deploy to production

### Step 6: Get Your Deployment URL

Once deployed, you'll see something like:
```
https://shakit-live-bot.vercel.app
```

Or you can use a custom domain if you have one.

---

## AFTER DEPLOYMENT COMPLETES

### 1. Update Facebook Webhook URL

1. Go to **Facebook Developer Console**: https://developers.facebook.com/apps
2. Select your App → **Messenger** → **Settings**
3. Update Webhook:
   - **Callback URL**: `https://your-vercel-url.vercel.app/api/generic-webhook`
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

**Test Promos (should show 3 COMPLEX COUPONS):**
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

Go to Vercel Dashboard → Your Project → **Functions** tab

Look for:
- `[PromoFlow]` - Confirms promo coupons are being sent
- `[SupercardFlow]` - Confirms supercard coupons are being sent
- `[GeminiService]` - Confirms AI intent detection
- No error messages

---

## OPTION 2: DEPLOY VIA VERCEL CLI (ALTERNATIVE)

If you prefer using the command line:

```bash
cd "/Users/rahul/ShakitLive Bot"
vercel
```

Follow the prompts:
1. Set up and deploy? **Y**
2. Which scope? Select your account
3. Link to existing project? **N**
4. Project name? `shakitlive-bot` (or your choice)
5. Directory? `./` (default)
6. Override settings? **N**

Then add environment variables:
```bash
vercel env add DATABASE_URL
vercel env add FACEBOOK_PAGE_ID
vercel env add FACEBOOK_PAGE_ACCESS_TOKEN
vercel env add FACEBOOK_VERIFY_TOKEN
vercel env add GEMINI_API_KEY
vercel env add TEST_RECIPIENT_ID
```

Deploy to production:
```bash
vercel --prod
```

---

## IMPORTANT NOTES

### Database Connection
- **Using Render PostgreSQL**: The DATABASE_URL points to your existing Render PostgreSQL database
- This means your data (promos, supercards, FAQs, etc.) is already there
- No migration needed!

### Auto-Deployments
- Vercel will automatically redeploy when you push to the `main` branch on GitHub
- Every push triggers a new build and deployment

### Region
- Configured to use Singapore region (sin1) for better performance in your area

### Free Tier Limits
Vercel Free Tier includes:
- Unlimited deployments
- 100GB bandwidth per month
- Serverless function execution time limits
- Should be sufficient for initial testing and moderate traffic

---

## TROUBLESHOOTING

### If Build Fails:
- Check Vercel build logs in the dashboard
- Verify all environment variables are set correctly
- Ensure DATABASE_URL is correct and accessible from Vercel

### If Bot Doesn't Respond:
- Verify Facebook webhook URL is correct
- Check Vercel function logs for webhook errors
- Ensure webhook verify token matches: `ShakeyBot2025`
- Test the webhook endpoint directly: `https://your-url.vercel.app/api/generic-webhook`

### If Coupons Don't Show:
- Check Vercel function logs for `[PromoFlow]` entries
- Verify database connection is working
- Check that Prisma migrations ran successfully

### Database Connection Issues:
- Render PostgreSQL must allow connections from Vercel's IP addresses
- The external connection URL should work (already configured)
- Test connection using: `npx prisma studio` with your DATABASE_URL

---

## WHAT'S DIFFERENT FROM RENDER?

**Vercel Advantages:**
- ✅ Faster builds (optimized for Next.js)
- ✅ Better Next.js integration
- ✅ Automatic edge optimization
- ✅ Better free tier for Next.js apps
- ✅ Simpler deployment process

**Vercel Considerations:**
- Functions have execution time limits (10s on free tier, 60s on pro)
- Serverless architecture (functions cold start)
- External database required (we're using Render PostgreSQL)

---

## SUMMARY

**Current Status:** Ready to deploy to Vercel!

**What You Need to Do:**
1. Go to https://vercel.com/
2. Import your GitHub repository `ramborau/ShakitLive_Bot`
3. Add all 7 environment variables
4. Click Deploy
5. Wait 2-3 minutes
6. Update Facebook webhook URL
7. Test the bot!

**Expected Result:**
- Bot responds with Zappy personality ✅
- Promo queries show 3 beautiful COMPLEX COUPONS ✅
- Supercard queries show 2 beautiful COMPLEX COUPONS ✅
- All flows work correctly ✅
- No bot getting stuck issues ✅

---

**Deployment Guide Created By**: Claude Code
**Date**: October 27, 2025
**Platform**: Vercel with Render PostgreSQL
**Status**: Ready to Deploy 🚀
