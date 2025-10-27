# GitHub Setup & Push Instructions

## Step 1: Create GitHub Repository

1. **Go to GitHub**: https://github.com/new

2. **Fill in repository details**:
   - **Repository name**: `shakitlive-bot` (or your preferred name)
   - **Description**: "Shakey's Pizza Messenger Bot with beautiful coupon templates and Zappy AI personality"
   - **Visibility**: Choose **Private** (recommended - contains API keys and business logic)
   - **IMPORTANT**: Do NOT check any of these boxes:
     - ❌ Add a README file
     - ❌ Add .gitignore
     - ❌ Choose a license

   (We already have these files in the project)

3. **Click "Create repository"**

4. **Copy the repository URL** - You'll see something like:
   ```
   https://github.com/YOUR-USERNAME/shakitlive-bot.git
   ```

## Step 2: Connect Local Repository to GitHub

Once you have created the repository and copied the URL, run these commands:

```bash
cd "/Users/rahul/ShakitLive Bot"

# Add GitHub as remote (replace YOUR-USERNAME with your actual GitHub username)
git remote add origin https://github.com/YOUR-USERNAME/shakitlive-bot.git

# Verify the remote was added
git remote -v

# Push to GitHub
git push -u origin main
```

**If the push asks for authentication**:
- Username: Your GitHub username
- Password: Use a **Personal Access Token** (NOT your GitHub password)
  - Create token at: https://github.com/settings/tokens
  - Select scopes: `repo` (full control of private repositories)
  - Copy the token and use it as password

## Step 3: Verify Push

After pushing, go to your GitHub repository URL:
```
https://github.com/YOUR-USERNAME/shakitlive-bot
```

You should see all your code including:
- `lib/flows/promo-flow.ts` (new file with beautiful coupons)
- `lib/flows/supercard-flow.ts` (updated with coupons)
- `DEPLOYMENT-SUMMARY.md`
- All other project files

## Step 4: Deploy to Render

Once code is on GitHub, proceed with Render deployment:

### Option A: Via Render Dashboard (Easiest)

1. **Go to Render**: https://dashboard.render.com

2. **Create New Web Service**:
   - Click "New +" → "Web Service"
   - Connect to GitHub (authorize Render to access your repositories)
   - Select your `shakitlive-bot` repository

3. **Configure Service**:
   - **Name**: `shakitlive-bot` (or your preferred name)
   - **Region**: Singapore (closest to Philippines for best latency)
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
   ```
   DATABASE_URL=<your-postgresql-database-url>
   FACEBOOK_PAGE_ACCESS_TOKEN=<from .env>
   FACEBOOK_VERIFY_TOKEN=<from .env>
   GEMINI_API_KEY=<from .env>
   GOOGLE_MAPS_API_KEY=<from .env>
   GOOGLE_ANALYTICS_TRACKING_ID=<from .env>
   NODE_ENV=production
   ```

   **To get these values**, check your local `.env` file:
   ```bash
   cat .env
   ```

5. **Create Web Service** - Click "Create Web Service"

6. **Wait for Deployment** - Render will:
   - Clone your GitHub repository
   - Install dependencies
   - Generate Prisma client
   - Build Next.js app
   - Start the server

   This takes about 3-5 minutes.

7. **Get Deployment URL** - Once deployed, you'll see:
   ```
   https://shakitlive-bot.onrender.com
   ```

### Option B: Via Render API (Using provided API key)

If you prefer to use the Render API with key `rnd_Yrxq57naJx6IbUxhRn3GyZiZYI1s`:

```bash
# Create service via API
curl -X POST https://api.render.com/v1/services \
  -H "Authorization: Bearer rnd_Yrxq57naJx6IbUxhRn3GyZiZYI1s" \
  -H "Content-Type: application/json" \
  -d '{
    "type": "web_service",
    "name": "shakitlive-bot",
    "ownerId": "<your-owner-id>",
    "repo": "https://github.com/YOUR-USERNAME/shakitlive-bot",
    "branch": "main",
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

## Step 5: Update Facebook Webhook URL

After Render deployment is complete:

1. **Get your Render URL**: `https://shakitlive-bot.onrender.com`

2. **Go to Facebook Developer Console**: https://developers.facebook.com/apps

3. **Select your App** → **Messenger** → **Settings**

4. **Update Webhook URL**:
   - Callback URL: `https://shakitlive-bot.onrender.com/api/generic-webhook`
   - Verify Token: (use your `FACEBOOK_VERIFY_TOKEN` from .env)
   - Click "Verify and Save"

5. **Subscribe to Webhook Fields**:
   - ✅ messages
   - ✅ messaging_postbacks
   - ✅ message_deliveries
   - ✅ message_reads

## Step 6: Test Production Bot

1. **Open Facebook Messenger**
2. **Search for your Shakey's Pizza page**
3. **Send test messages**:
   - "hi" (greeting)
   - "any promos?" (should show 3 COMPLEX COUPONS)
   - "supercard" (should show 2 COMPLEX COUPONS)
   - "location" (location inquiry)

4. **Check Render Logs**:
   - Go to Render dashboard → Your service → Logs
   - Look for `[PromoFlow]` and `[SupercardFlow]` logs
   - Verify no errors

## Troubleshooting

### If push fails with authentication error:
```bash
# Use Personal Access Token instead of password
# Create token at: https://github.com/settings/tokens
# Select scope: repo
```

### If Render build fails:
- Check build logs in Render dashboard
- Verify all environment variables are set
- Check that DATABASE_URL is accessible from Render

### If bot doesn't respond:
- Verify Facebook webhook URL is correct
- Check Render logs for errors
- Verify environment variables in Render

## Summary

**After completing these steps, you will have**:
1. ✅ Code pushed to GitHub
2. ✅ Bot deployed on Render
3. ✅ Facebook webhook connected to Render
4. ✅ Bot responding with beautiful COMPLEX COUPONS
5. ✅ Production-ready deployment

---

**Need Help?**
- GitHub Docs: https://docs.github.com
- Render Docs: https://render.com/docs
- Check `DEPLOYMENT-SUMMARY.md` for more details
