# 🚀 249 Kits - Production Deployment Checklist

## Pre-Deployment

### Local Testing
- [ ] Backend runs without errors: `uvicorn main:app --reload`
- [ ] Frontend runs without errors: `npm run dev`
- [ ] Test payment flow with Stripe test card: `4242 4242 4242 4242`
- [ ] Verify order is created in database
- [ ] Run backend tests: `python test_setup.py`

### Stripe Setup
- [ ] Create Stripe account at https://stripe.com
- [ ] Copy Test API keys (publishable & secret)
- [ ] Add bank account for payouts
- [ ] Set payout schedule (daily recommended)
- [ ] Enable payment methods (cards, Apple Pay, Google Pay)

---

## Backend Deployment (Render)

### Repository Setup
- [ ] Create GitHub repository for backend
- [ ] Push backend code to GitHub
- [ ] Ensure `.env` is in `.gitignore`

### Render Configuration
- [ ] Sign up at https://render.com
- [ ] Create new Web Service
- [ ] Connect GitHub repository
- [ ] Set build command: `pip install -r requirements.txt`
- [ ] Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`

### Database Setup
- [ ] Create PostgreSQL database on Render
- [ ] Copy Internal Database URL
- [ ] Add to Web Service environment variables

### Environment Variables
Add these in Render dashboard:
```
- [ ] DATABASE_URL = [from PostgreSQL]
- [ ] STRIPE_SECRET_KEY = sk_test_...
- [ ] STRIPE_WEBHOOK_SECRET = [leave empty for now]
- [ ] FRONTEND_URL = [leave empty for now]
```

### Deploy & Test
- [ ] Click "Create Web Service"
- [ ] Wait for deployment (~3-5 mins)
- [ ] Copy backend URL: `https://_____.onrender.com`
- [ ] Test health check: `https://_____.onrender.com/`

---

## Frontend Deployment (Vercel)

### Repository Setup
- [ ] Create GitHub repository for frontend
- [ ] Push frontend code to GitHub
- [ ] Ensure `.env.local` is in `.gitignore`

### Vercel Configuration
- [ ] Sign up at https://vercel.com
- [ ] Import GitHub repository
- [ ] Framework preset: Next.js (auto-detected)
- [ ] Click Deploy

### Environment Variables
Add these in Vercel project settings:
```
- [ ] NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_test_...
- [ ] NEXT_PUBLIC_API_URL = https://_____.onrender.com
```

### Redeploy & Test
- [ ] Trigger redeploy to apply env vars
- [ ] Copy frontend URL: `https://_____.vercel.app`
- [ ] Visit site and test browsing

---

## Connect Services

### Update Backend CORS
In Render dashboard:
- [ ] Add environment variable: `FRONTEND_URL = https://_____.vercel.app`
- [ ] Redeploy backend service

### Configure Stripe Webhook
- [ ] Go to https://dashboard.stripe.com/webhooks
- [ ] Click "Add endpoint"
- [ ] URL: `https://_____.onrender.com/api/stripe-webhook`
- [ ] Select events:
  - [ ] `payment_intent.succeeded`
  - [ ] `payment_intent.payment_failed`
- [ ] Copy Signing Secret: `whsec_...`
- [ ] Add to Render env vars: `STRIPE_WEBHOOK_SECRET = whsec_...`
- [ ] Redeploy backend

### End-to-End Test
- [ ] Visit your Vercel site
- [ ] Add items to cart
- [ ] Proceed to checkout
- [ ] Use test card: `4242 4242 4242 4242`
- [ ] Complete payment
- [ ] Verify order confirmation
- [ ] Check Stripe dashboard for payment
- [ ] Check Render logs for webhook event

---

## Go Live (Production)

### Switch to Live Stripe Keys
- [ ] Toggle Stripe dashboard to Live mode
- [ ] Copy Live publishable key: `pk_live_...`
- [ ] Copy Live secret key: `sk_live_...`

### Update Backend (Render)
- [ ] Update env var: `STRIPE_SECRET_KEY = sk_live_...`
- [ ] Redeploy

### Update Frontend (Vercel)
- [ ] Update env var: `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = pk_live_...`
- [ ] Redeploy

### Update Webhook (Live Mode)
- [ ] In Stripe Live mode, go to Webhooks
- [ ] Add endpoint: `https://_____.onrender.com/api/stripe-webhook`
- [ ] Select same events as before
- [ ] Copy Live Signing Secret: `whsec_...`
- [ ] Update Render env var: `STRIPE_WEBHOOK_SECRET = whsec_...`
- [ ] Redeploy backend

### Final Production Test
- [ ] Test with real card (small amount)
- [ ] Or use Stripe test cards in live mode
- [ ] Verify order creation
- [ ] Check payment in Stripe dashboard
- [ ] Verify webhook delivery

---

## Post-Launch

### Monitor First 24 Hours
- [ ] Check Stripe dashboard regularly
- [ ] Monitor Render logs for errors
- [ ] Test from multiple devices/browsers
- [ ] Check webhook delivery in Stripe

### Business Setup
- [ ] Verify bank account in Stripe
- [ ] Set automatic payouts
- [ ] Configure email notifications
- [ ] Set up customer support email

### Optional Enhancements
- [ ] Add custom domain to Vercel
- [ ] Set up SSL certificate (auto with Vercel)
- [ ] Configure email notifications
- [ ] Add analytics (Google Analytics, Plausible)
- [ ] Set up error monitoring (Sentry)

---

## Quick Reference

### Important URLs
```
Frontend (Vercel):   https://_____.vercel.app
Backend (Render):    https://_____.onrender.com
Stripe Dashboard:    https://dashboard.stripe.com
Render Dashboard:    https://dashboard.render.com
Vercel Dashboard:    https://vercel.com/dashboard
```

### Test Cards
```
Success:     4242 4242 4242 4242
Declined:    4000 0000 0000 0002
3D Secure:   4000 0025 0000 3155
```

### Support Links
```
Stripe:  https://support.stripe.com
Render:  https://render.com/docs
Vercel:  https://vercel.com/support
```

---

## Emergency Rollback

If something goes wrong:

### Rollback Backend
1. Go to Render dashboard
2. Find previous successful deployment
3. Click "Rollback"

### Rollback Frontend
1. Go to Vercel dashboard
2. Find previous deployment
3. Click "Promote to Production"

### Disable Payments
1. Go to Stripe dashboard
2. Temporarily disable API keys
3. Fix issue
4. Re-enable

---

## ✅ Launch Complete!

Once all checkboxes are ticked:
- 🎉 Your store is live!
- 💰 You can receive payments
- 🚀 Start marketing and selling

**Good luck with your 249 Kits business! 🇸🇩**
