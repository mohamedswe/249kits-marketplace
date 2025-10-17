# 249 Kits - Sudanese Heritage E-Commerce Platform

🇸🇩 Premium streetwear celebrating Sudanese culture and heritage.

## 📁 Project Structure

```
249 kits/
├── backend/                 # FastAPI backend (Python)
│   ├── main.py             # API routes and Stripe integration
│   ├── models.py           # Database models
│   ├── schemas.py          # Pydantic schemas
│   ├── crud.py             # Database operations
│   ├── database.py         # Database configuration
│   ├── shipping.py         # Shipping cost calculations
│   ├── requirements.txt    # Python dependencies
│   └── .env.example        # Environment variables template
│
├── 249-kits-marketplace/   # Next.js frontend (React/TypeScript)
│   ├── src/
│   │   ├── app/           # Next.js app router pages
│   │   └── context/       # React context (cart management)
│   └── .env.example       # Frontend environment variables template
│
└── DEPLOYMENT_GUIDE.md    # Step-by-step deployment instructions
```

## ✨ Features

### Customer Features
- 🎨 Custom product designer (shirts & shorts)
- 🛒 Shopping cart with quantity management
- 💳 Secure Stripe payment processing
- 🌍 International shipping support
- 📧 Order confirmation emails
- 📱 Fully responsive design
- 🇸🇩 Bilingual (English/Arabic)

### Business Features
- 💰 Automated payment processing via Stripe
- 🏦 Direct bank payouts
- 📊 Order tracking and management
- 🔒 Secure payment webhooks
- 🌐 Production-ready deployment
- 📈 PostgreSQL database for scalability

## 🚀 Quick Start

### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your Stripe keys
uvicorn main:app --reload
```

### Frontend Setup
```bash
cd 249-kits-marketplace
npm install
cp .env.example .env.local
# Edit .env.local with your Stripe publishable key
npm run dev
```

Visit: http://localhost:3000

## 🔐 Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://...        # PostgreSQL connection string
STRIPE_SECRET_KEY=sk_test_...       # Stripe secret key
STRIPE_WEBHOOK_SECRET=whsec_...     # Stripe webhook signing secret
FRONTEND_URL=https://...            # Your Vercel frontend URL
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...  # Stripe publishable key
NEXT_PUBLIC_API_URL=http://localhost:8000       # Backend API URL
```

## 📦 Tech Stack

### Backend
- **Framework**: FastAPI (Python 3.11+)
- **Database**: PostgreSQL + SQLAlchemy ORM
- **Payments**: Stripe API
- **Deployment**: Render.com

### Frontend
- **Framework**: Next.js 14 (React 18)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Payments**: Stripe.js + React Stripe.js
- **Deployment**: Vercel

## 💳 Payment Flow

1. Customer adds items to cart
2. Enters shipping information at checkout
3. Frontend creates Stripe Payment Intent
4. Customer enters card details (secured by Stripe)
5. Payment is processed
6. Webhook confirms payment to backend
7. Order is created and marked as "paid"
8. Business receives payout to bank account

## 🌐 Deployment

Follow the comprehensive [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) for step-by-step instructions to deploy to production.

**Quick Links:**
- Backend: Deploy to Render.com
- Frontend: Deploy to Vercel
- Database: PostgreSQL on Render
- Payments: Stripe webhooks

## 🛠️ Development Commands

### Backend
```bash
# Run development server
uvicorn main:app --reload

# Install dependencies
pip install -r requirements.txt

# Database migrations (when needed)
alembic upgrade head
```

### Frontend
```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## 📊 Database Schema

### Orders Table
- Customer information (name, email, phone)
- Shipping address
- Order items (product type, color, size, quantity)
- Payment tracking (payment_intent_id, payment_status)
- Order status (pending → paid → shipped → delivered)
- Pricing breakdown (subtotal, shipping, tax, total)

### Order Items Table
- Product details
- Quantity and pricing
- Associated order ID

## 🔒 Security Features

- ✅ Stripe-hosted payment processing (PCI compliant)
- ✅ Webhook signature verification
- ✅ Environment variable protection
- ✅ CORS configuration
- ✅ SQL injection protection (SQLAlchemy ORM)
- ✅ HTTPS enforcement in production

## 📈 Scaling Considerations

### Current Setup (Good for 0-1000 orders/month)
- Free tier: Render + Vercel
- SQLite (local dev) → PostgreSQL (production)
- Stripe standard processing

### Future Enhancements
- Add Redis for caching
- Implement CDN for images
- Add email notification service (SendGrid/Mailgun)
- Set up monitoring (Sentry, LogRocket)
- Add admin dashboard
- Implement inventory management
- Add customer accounts

## 🆘 Troubleshooting

### Backend won't start
- Check Python version (3.11+)
- Verify all environment variables are set
- Ensure PostgreSQL is running (production)

### Payment not processing
- Verify Stripe keys (test vs live mode)
- Check webhook configuration
- Review backend logs for errors

### CORS errors
- Ensure FRONTEND_URL is set correctly
- Check Vercel deployment URL matches

## 📞 Support

- **Stripe Issues**: https://support.stripe.com
- **Render Issues**: https://render.com/docs
- **Vercel Issues**: https://vercel.com/support

## 📝 License

All rights reserved - 249 Kits © 2024

---

**Made with ❤️ in Sudan 🇸🇩**
