# Render Deployment - PostgreSQL Database Created

## DATABASE CREATED SUCCESSFULLY ✅

**Database ID**: `dpg-d3vip8bipnbc739mibag-a`
**Database Name**: `shakitlive_bot`
**Database User**: `shakitlive_user`
**Region**: Singapore
**Version**: PostgreSQL 16
**Status**: Available

**Dashboard URL**: https://dashboard.render.com/d/dpg-d3vip8bipnbc739mibag-a

---

## DATABASE CONNECTION INFO

### Internal Connection String (Use this for Render services):
```
postgresql://shakitlive_user:t7GRGpa07YGo89URfKEVkcP0UGSMuJtq@dpg-d3vip8bipnbc739mibag-a/shakitlive_bot
```

### External Connection String (For external access):
```
postgresql://shakitlive_user:t7GRGpa07YGo89URfKEVkcP0UGSMuJtq@dpg-d3vip8bipnbc739mibag-a.singapore-postgres.render.com:5432/shakitlive_bot
```

### Password:
```
t7GRGpa07YGo89URfKEVkcP0UGSMuJtq
```

---

## NEXT STEP: CREATE WEB SERVICE VIA DASHBOARD

The Render API has some limitations with complex JSON payloads. The easiest way to deploy now is via the Dashboard:

### Step-by-Step:

1. **Go to Render Dashboard**:
   ```
   https://dashboard.render.com
   ```

2. **Click "New +" → "Web Service"**

3. **Connect to GitHub**:
   - Authorize Render to access your repositories
   - Select repository: `ramborau/ShakitLive_Bot`

4. **Configure Service**:
   - **Name**: `shakitlive-bot`
   - **Region**: **Singapore** (same as database)
   - **Branch**: `main`
   - **Root Directory**: (leave empty)
   - **Environment**: `Node`

5. **Build Settings**:
   - **Build Command**:
     ```
     npm install && npx prisma generate && npm run build
     ```
   - **Start Command**:
     ```
     npx prisma migrate deploy && npm start
     ```

6. **Environment Variables** (Click "Advanced" → "Add Environment Variable"):

   Add these EXACT variables:

   ```
   NODE_ENV=production
   ```

   ```
   DATABASE_URL=postgresql://shakitlive_user:t7GRGpa07YGo89URfKEVkcP0UGSMuJtq@dpg-d3vip8bipnbc739mibag-a/shakitlive_bot
   ```

   ```
   FACEBOOK_PAGE_ID=759563007234526
   ```

   ```
   FACEBOOK_PAGE_ACCESS_TOKEN=EAASnq7m5LikBP7DYZCcPdnLJ4JR0pG0TxzNpc9L4R9sqJfObi1LpgqZA7R4yJEscGkFgelxZC1jTEnceToqgCZBbRrZA9K41igJylSc3v4ZAlQleV9vCLpbvSHEZBJXyfYRljONzE2MK7PQ1qhsvWGOHkAV0JpIaABSF47igs3eRSF9DicLuixqZB4fZCkquRqIzBZAlHZC0QZDZD
   ```

   ```
   FACEBOOK_VERIFY_TOKEN=ShakeyBot2025
   ```

   ```
   GEMINI_API_KEY=AIzaSyBZKaIkDD5E-2rxluU7xVUb3IQCalVz-Yw
   ```

   ```
   TEST_RECIPIENT_ID=24614877841461856
   ```

7. **Click "Create Web Service"**

8. **Wait for Deployment** (3-5 minutes):
   - Render will clone your GitHub repository
   - Install dependencies (`npm install`)
   - Generate Prisma client (`npx prisma generate`)
   - Build Next.js app (`npm run build`)
   - Run database migrations (`npx prisma migrate deploy`)
   - Start the server (`npm start`)

9. **Get Your Deployment URL**:
   - Once deployed, you'll see: `https://shakitlive-bot.onrender.com`
   - (Or whatever custom name you chose)

---

## AFTER DEPLOYMENT COMPLETES

### 1. Update Facebook Webhook URL

1. Go to **Facebook Developer Console**: https://developers.facebook.com/apps
2. Select your App → **Messenger** → **Settings**
3. Update Webhook:
   - **Callback URL**: `https://shakitlive-bot.onrender.com/api/generic-webhook`
   - **Verify Token**: `ShakeyBot2025`
   - Click "Verify and Save"
4. Subscribe to Webhook Fields:
   - ✅ messages
   - ✅ messaging_postbacks
   - ✅ message_deliveries
   - ✅ message_reads

### 2. Test Production Bot

1. Open **Facebook Messenger**
2. Search for your **Shakey's Pizza page**
3. Send test messages:
   - "hi" → Should greet with Zappy personality
   - "any promos?" → Should show **3 COMPLEX COUPONS**
   - "supercard" → Should show **2 COMPLEX COUPONS** (Gold & Classic)
   - "location" → Should handle location inquiry
   - "menu" → Should show menu options

### 3. Monitor Logs

- Go to Render dashboard → Your service → **Logs**
- Look for `[PromoFlow]` and `[SupercardFlow]` logs
- Verify no errors
- Check response times

---

## WHAT'S ALREADY DONE ✅

1. ✅ PostgreSQL database created on Render
2. ✅ Database connection string ready
3. ✅ All code pushed to GitHub (`ramborau/ShakitLive_Bot`)
4. ✅ Beautiful COMPLEX COUPON templates implemented
5. ✅ Gemini AI integration ready
6. ✅ Zappy personality implemented
7. ✅ TypeScript build error fixed
8. ✅ Prisma schema updated for PostgreSQL

---

## WHAT YOU NEED TO DO

1. **Create web service via Render Dashboard** (follow steps above)
2. **Update Facebook webhook URL** once deployed
3. **Test the bot on Messenger**

---

## TROUBLESHOOTING

### If Build Fails:
- Check Render build logs
- Verify all environment variables are set correctly
- Ensure DATABASE_URL matches the connection string above

### If Bot Doesn't Respond:
- Verify Facebook webhook URL is correct
- Check Render logs for errors
- Verify FACEBOOK_PAGE_ACCESS_TOKEN is valid
- Ensure webhook subscription fields are enabled

### If Coupons Don't Show:
- Check Render logs for `[PromoFlow]` entries
- Verify Facebook Send API is working
- Ensure COMPLEX COUPON template is being sent

---

## DEPLOYMENT STATUS

**Database**: ✅ Created and Ready
**Code**: ✅ Pushed to GitHub
**Web Service**: ⏳ Needs to be created via Dashboard
**Facebook Webhook**: ⏳ Needs to be updated after deployment

---

**Deployment Started**: October 27, 2025
**Database Created By**: Claude Code using Render API
**Next Action**: Create web service via Render Dashboard
