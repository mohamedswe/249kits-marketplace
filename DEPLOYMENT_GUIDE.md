# 249 Kits - Production Deployment Guide

## 🚀 Quick Deployment Checklist

### Prerequisites
- [ ] Stripe account (https://stripe.com)
- [ ] Render account (https://render.com)
- [ ] Vercel account (https://vercel.com)
- [ ] GitHub account (for deployment)

---

## Part 1: Stripe Setup (15 mins)

### 1.1 Get Stripe API Keys
1. Go to https://dashboard.stripe.com/apikeys
2. Copy your **Publishable key** (starts with `pk_test_` or `pk_live_`)
3. Copy your **Secret key** (starts with `sk_test_` or `sk_live_`)
4. Save these keys - you'll need them later

### 1.2 Set Up Bank Account (for receiving money)
1. Go to https://dashboard.stripe.com/settings/payouts
2. Click "Add bank account"
3. Enter your business bank details
4. Verify your business information
5. Set payout schedule (recommended: daily)

---

## Part 2: Backend Deployment on Render (20 mins)

### 2.1 Push Code to GitHub

**Repository Structure:**
```
249kits-marketplace/
├── backend/         (FastAPI backend)
├── frontend/        (Next.js frontend)
└── .gitignore       (Protects secrets)
```

**IMPORTANT: This is a monorepo - both backend and frontend are in ONE repository!**

```bash
# Navigate to the project root (NOT backend folder)
cd "c:\Users\mabde\OneDrive\Desktop\249 kits"

# Step 1: Initialize git repository in the ROOT
git init

# Step 2: CRITICAL - Verify .gitignore exists in ROOT and backend folders
cat .gitignore         # Root gitignore
cat backend/.gitignore # Backend gitignore
# Both should contain .env to prevent committing secrets

# Step 3: Preview what will be committed (dry run)
git add -n .

# Step 4: Verify NO secrets are being committed
# Make sure you DON'T see:
#   - backend/.env
#   - frontend/.env.local
#   - node_modules/

# Step 5: Stage ALL files (backend + frontend)
git add .

# Step 6: Double-check what's staged
git status
# Ensure .env files are "Untracked" NOT "Changes to be committed"

# Step 7: Create initial commit
git commit -m "Initial commit - 249 Kits (Backend + Frontend)"

# Step 8: Push to GitHub
git branch -M main
git remote add origin https://github.com/mohamedswe/249kits-marketplace.git
git push -u origin main
```

**🔒 Security Checklist:**
- [ ] `.gitignore` exists in ROOT and backend folders
- [ ] `.env` is listed in both `.gitignore` files
- [ ] `git status` shows `.env` files as untracked
- [ ] `node_modules/` is NOT being committed
- [ ] Only `.env.example` is committed, never `.env`

### 2.2 Deploy to Render
1. Go to https://render.com/dashboard
2. Click "New +" → "Web Service"
3. Connect your GitHub repository: **mohamedswe/249kits-marketplace**
4. Configure:
   - **Name**: `249-kits-api`
   - **Root Directory**: `backend` (IMPORTANT: Point to backend folder!)
   - **Environment**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### 2.3 Add PostgreSQL Database
1. In Render dashboard, click "New +" → "PostgreSQL"
2. **Name**: `249-kits-db`
3. Wait for database to provision
4. Copy the **Internal Database URL**

### 2.4 Configure Environment Variables
In your web service settings, add these environment variables:

```
DATABASE_URL = [Paste Internal Database URL from PostgreSQL]
STRIPE_SECRET_KEY = sk_test_YOUR_SECRET_KEY
STRIPE_WEBHOOK_SECRET = [Leave empty for now, we'll add this later]
FRONTEND_URL = [Leave empty for now, we'll add this after frontend deployment]
```

### 2.5 Deploy
1. Click "Create Web Service"
2. Wait for deployment to complete (~3-5 minutes)
3. Copy your backend URL: `https://249-kits-api.onrender.com`

---

## Part 3: Frontend Deployment on Vercel (15 mins)

### 3.1 Frontend is Already on GitHub!
✅ **No need to push separately** - the frontend is already in the same repository under the `frontend/` folder!

Your repository structure:
```
mohamedswe/249kits-marketplace
├── backend/   (deployed to Render)
└── frontend/  (deploying to Vercel)
```

### 3.2 Deploy to Vercel
1. Go to https://vercel.com/dashboard
2. Click "Add New" → "Project"
3. Import your GitHub repository: **mohamedswe/249kits-marketplace**
4. Configure:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `frontend` (IMPORTANT: Point to frontend folder!)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
5. Click "Deploy"

### 3.3 Configure Environment Variables
In Vercel project settings → Environment Variables, add:

```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_test_YOUR_PUBLISHABLE_KEY
NEXT_PUBLIC_API_URL = https://249-kits-api.onrender.com
```

6. Redeploy to apply changes

7. Copy your frontend URL: `https://your-project.vercel.app`

---

## Part 4: Connect Everything (15 mins)

### 4.1 Update Backend CORS
1. Go to Render dashboard → 249-kits-api → Environment
2. Add/Update:
   ```
   FRONTEND_URL = https://your-project.vercel.app
   ```
3. Redeploy backend

### 4.2 Configure Stripe Webhook
1. Go to https://dashboard.stripe.com/webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://249-kits-api.onrender.com/api/stripe-webhook`
4. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
5. Click "Add endpoint"
6. Copy the "Signing secret" (starts with `whsec_`)
7. Add to Render environment variables:
   ```
   STRIPE_WEBHOOK_SECRET = whsec_YOUR_WEBHOOK_SECRET
   ```
8. Redeploy backend

---

## Part 5: Go Live with Real Payments (10 mins)

### 5.1 Switch to Live Stripe Keys
1. In Stripe dashboard, toggle from "Test mode" to "Live mode"
2. Copy your **Live** publishable and secret keys
3. Update Render environment variables:
   ```
   STRIPE_SECRET_KEY = sk_live_YOUR_LIVE_SECRET_KEY
   ```
4. Update Vercel environment variables:
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_live_YOUR_LIVE_PUBLISHABLE_KEY
   ```
5. Update webhook URL in Stripe (repeat step 4.2 with live mode)

### 5.2 Test Production Payment
1. Visit your Vercel URL
2. Add items to cart
3. Go to checkout
4. Use a real card (or Stripe test cards: 4242 4242 4242 4242)
5. Complete payment
6. Verify order in backend logs
7. Check Stripe dashboard for payment

---

## Part 6: Verify Money Reception

### 6.1 Check Stripe Balance
1. Go to https://dashboard.stripe.com/balance
2. You should see payments in "Pending" or "Available" balance
3. Money will automatically transfer to your bank account based on payout schedule

### 6.2 Monitor Payments
- Dashboard: https://dashboard.stripe.com/payments
- See all customer payments
- Track refunds and disputes
- Export financial reports

---

## 🎉 You're Live!

### Your URLs:
- **Frontend (Customer Site)**: https://your-project.vercel.app
- **Backend API**: https://249-kits-api.onrender.com
- **Stripe Dashboard**: https://dashboard.stripe.com

### Next Steps:
1. Test the complete payment flow
2. Add your custom domain to Vercel
3. Set up email notifications (optional)
4. Monitor your first sales! 💰

---

## 🚨 If You Accidentally Commit Secrets

**If GitHub blocks your push due to secrets (Stripe keys, etc.):**

### Option 1: Fresh Start (Recommended for new repos)
```bash
cd backend
rm -rf .git
git init
git add .
git status  # Verify .env is NOT in "Changes to be committed"
git commit -m "Initial commit - 249 Kits Backend"
git branch -M main
git remote add origin https://github.com/mohamedswe/249kits-marketplace.git
git push -u origin main --force
```

### Option 2: Remove from history (for existing repos)
```bash
git rm --cached .env
git commit -m "Remove .env from repository"
# This only works if .env wasn't in previous commits
# If still blocked, use Option 1
```

### After fixing git:
1. **Rotate ALL exposed keys immediately** at https://dashboard.stripe.com/apikeys
2. Delete old keys that were committed
3. Update your local `.env` file with new keys
4. Update environment variables on Render/Vercel

---

## 🔧 Troubleshooting

### Payment not working?
- Check Stripe keys are correct (live vs test)
- Verify webhook is receiving events in Stripe dashboard
- Check backend logs in Render dashboard

### CORS errors?
- Ensure FRONTEND_URL is set correctly in Render
- Check Vercel deployment URL matches

### Database errors?
- Verify DATABASE_URL is set
- Check PostgreSQL is running in Render
- Run migrations if needed

### Webhook not receiving events?
- Verify STRIPE_WEBHOOK_SECRET is set
- Check webhook URL in Stripe dashboard
- Test webhook with Stripe CLI

---

## 📊 Monitoring Your Business

### Daily Tasks:
- [ ] Check Stripe dashboard for new orders
- [ ] Process and ship orders
- [ ] Respond to customer inquiries

### Weekly Tasks:
- [ ] Review sales analytics
- [ ] Check payout schedule
- [ ] Export financial reports

### Monthly Tasks:
- [ ] Reconcile bank statements
- [ ] Tax reporting (if applicable)
- [ ] Review and optimize pricing

---

## 💡 Tips for Success

1. **Start with Test Mode**: Always test thoroughly before going live
2. **Monitor Webhooks**: Check Stripe webhook logs regularly
3. **Keep Secrets Safe**: Never commit API keys to GitHub
4. **Backup Database**: Render provides automatic backups
5. **Scale as Needed**: Render free tier → paid tier when traffic grows

---

## 🆘 Support Resources

- **Stripe Support**: https://support.stripe.com
- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **FastAPI Docs**: https://fastapi.tiangolo.com
- **Next.js Docs**: https://nextjs.org/docs

---

**Good luck with your 249 Kits business! 🇸🇩 🎽**
