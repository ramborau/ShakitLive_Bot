# ADD ENVIRONMENT VARIABLES TO VERCEL

## ✅ Preview Deployment Successful!

Your preview deployment is live at:
**https://shakit-live-2s8urg5vp-rahulpropbuyingcs-projects.vercel.app**

However, it needs environment variables to work properly.

---

## METHOD 1: Add via Vercel Dashboard (EASIEST - 2 MINUTES)

1. Go to: **https://vercel.com/rahulpropbuyingcs-projects/shakit-live-bot/settings/environment-variables**

2. Add these 7 environment variables (click "Add" for each):

### Variable 1: NODE_ENV
- **Name:** `NODE_ENV`
- **Value:** `production`
- **Environments:** ✅ Production, ✅ Preview, ✅ Development

### Variable 2: DATABASE_URL
- **Name:** `DATABASE_URL`
- **Value:** `postgresql://shakitlive_user:t7GRGpa07YGo89URfKEVkcP0UGSMuJtq@dpg-d3vip8bipnbc739mibag-a.singapore-postgres.render.com/shakitlive_bot`
- **Environments:** ✅ Production, ✅ Preview, ✅ Development

### Variable 3: FACEBOOK_PAGE_ID
- **Name:** `FACEBOOK_PAGE_ID`
- **Value:** `577449412108142`
- **Environments:** ✅ Production, ✅ Preview, ✅ Development

### Variable 4: FACEBOOK_PAGE_ACCESS_TOKEN
- **Name:** `FACEBOOK_PAGE_ACCESS_TOKEN`
- **Value:** `EAASnq7m5LikBP7DYZCcPdnLJ4JR0pG0TxzNpc9L4R9sqJfObi1LpgqZA7R4yJEscGkFgelxZC1jTEnceToqgCZBbRrZA9K41igJylSc3v4ZAlQleV9vCLpbvSHEZBJXyfYRljONzE2MK7PQ1qhsvWGOHkAV0JpIaABSF47igs3eRSF9DicLuixqZB4fZCkquRqIzBZAlHZC0QZDZD`
- **Environments:** ✅ Production, ✅ Preview, ✅ Development

### Variable 5: FACEBOOK_VERIFY_TOKEN
- **Name:** `FACEBOOK_VERIFY_TOKEN`
- **Value:** `ShakeyBot2025`
- **Environments:** ✅ Production, ✅ Preview, ✅ Development

### Variable 6: GEMINI_API_KEY
- **Name:** `GEMINI_API_KEY`
- **Value:** `AIzaSyBZKaIkDD5E-2rxluU7xVUb3IQCalVz-Yw`
- **Environments:** ✅ Production, ✅ Preview, ✅ Development

### Variable 7: TEST_RECIPIENT_ID
- **Name:** `TEST_RECIPIENT_ID`
- **Value:** `8485127078186699`
- **Environments:** ✅ Production, ✅ Preview, ✅ Development

3. After adding all variables, **click "Save"**

---

## METHOD 2: Redeploy to Production (AFTER ADDING ENV VARS)

Once you've added all environment variables via the dashboard:

```bash
cd "/Users/rahul/ShakitLive Bot"
vercel --prod
```

This will deploy to production at: **https://shakit-live-bot.vercel.app**

---

## NEXT STEPS AFTER PRODUCTION DEPLOYMENT

### 1. Update Facebook Webhook URL

Go to: https://developers.facebook.com/apps

1. Select your App → **Messenger** → **Settings**
2. Update Webhook:
   - **Callback URL:** `https://shakit-live-bot.vercel.app/api/generic-webhook`
   - **Verify Token:** `ShakeyBot2025`
   - Click **"Verify and Save"**
3. Subscribe to fields: messages, messaging_postbacks, message_deliveries, message_reads

### 2. Test Your Bot

Open Facebook Messenger and message your Shakey's Pizza page:

**Test messages:**
- `hi` - Test greeting
- `any promos?` - Should show 3 COMPLEX COUPONS
- `supercard` - Should show 2 COMPLEX COUPONS
- `location` - Test location flow
- `menu` - Test menu flow

---

## CURRENT STATUS

✅ Code deployed to Vercel preview
⏳ Environment variables need to be added via dashboard
⏳ Production deployment pending
⏳ Facebook webhook URL needs updating

---

## QUICK LINKS

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Project Settings:** https://vercel.com/rahulpropbuyingcs-projects/shakit-live-bot/settings
- **Environment Variables:** https://vercel.com/rahulpropbuyingcs-projects/shakit-live-bot/settings/environment-variables
- **Deployments:** https://vercel.com/rahulpropbuyingcs-projects/shakit-live-bot
- **Facebook Developer Console:** https://developers.facebook.com/apps

---

**Important:** The CLI method for adding environment variables requires interactive input, so it's easier to use the dashboard. Just copy-paste the values above!
