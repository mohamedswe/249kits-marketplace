from fastapi import FastAPI, Depends, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
import os
from dotenv import load_dotenv

# Load environment variables FIRST
load_dotenv()

from database import SessionLocal, engine, get_db
from models import Base, Order
from schemas import OrderCreate, OrderResponse
from crud import create_order, get_order, calculate_shipping_cost
import stripe

# Set Stripe API key AFTER loading environment variables
stripe.api_key = os.getenv("STRIPE_SECRET_KEY")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")

# Debug: Print to verify key is loaded (only first 10 chars for security)
if stripe.api_key:
    print(f"✅ Stripe API key loaded: {stripe.api_key[:10]}...")
else:
    print("❌ WARNING: Stripe API key NOT loaded!")

app = FastAPI(title="249 Kits API", version="1.0.0")
Base.metadata.create_all(bind=engine)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",      # Local development
        "http://localhost:3001",      # Alternative port
        "http://127.0.0.1:3000",      # Alternative localhost
        "http://127.0.0.1:3001",      # Alternative localhost + port
    ],
    allow_origin_regex=r'https://.*\.vercel\.app',  # Vercel deployments
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/api/create-payment-intent")
async def create_payment_intent(order_data: OrderCreate, db: Session = Depends(get_db)):
    try:
        # Debug: Check if Stripe key is loaded
        if not stripe.api_key:
            raise HTTPException(status_code=500, detail="Stripe API key not configured")

        # Calculate total (same as order creation)
        subtotal = sum(item.price * item.quantity for item in order_data.items)
        shipping_cost = calculate_shipping_cost(order_data.country)
        total_amount = subtotal + shipping_cost

        print(f"💰 Creating payment intent: subtotal=${subtotal}, shipping=${shipping_cost}, total=${total_amount}")

        # Create Stripe payment intent
        intent = stripe.PaymentIntent.create(
            amount=int(total_amount * 100),  # Stripe uses cents
            currency='usd',
            automatic_payment_methods={
                'enabled': True,
            },
            metadata={
                'customer_email': order_data.customer_email,
                'customer_name': order_data.customer_name
            }
        )

        print(f"✅ Payment intent created: {intent.id}")

        # The correct property name is 'client_secret' (lowercase)
        return {"client_secret": intent['client_secret']}

    except stripe.error.StripeError as e:
        print(f"❌ Stripe error: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Stripe error: {str(e)}")
    except Exception as e:
        print(f"❌ Error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))
        


@app.get("/")
async def root():
    return {"message": "249 Kits API is running successfully!"}

@app.post("/api/orders", response_model=OrderResponse)
async def create_order_endpoint(order_data: OrderCreate, db: Session = Depends(get_db)):
    try:
        print(f"📦 Creating order for {order_data.customer_email}")
        print(f"   Payment Intent ID: {order_data.payment_intent_id}")
        print(f"   Items: {len(order_data.items)}")
        order = create_order(db, order_data)
        print(f"✅ Order created: #{order.id}")
        return order
    except Exception as e:
        print(f"❌ Order creation error: {str(e)}")
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/orders/{order_id}", response_model=OrderResponse)
async def get_order_endpoint(order_id: int, db: Session = Depends(get_db)):
    order = get_order(db, order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@app.post("/api/stripe-webhook")
async def stripe_webhook(request: Request, db: Session = Depends(get_db)):
    """Handle Stripe webhook events for payment confirmations"""
    payload = await request.body()
    sig_header = request.headers.get('stripe-signature')

    try:
        # Verify webhook signature
        if STRIPE_WEBHOOK_SECRET:
            event = stripe.Webhook.construct_event(
                payload, sig_header, STRIPE_WEBHOOK_SECRET
            )
        else:
            # For development without webhook secret
            import json
            event = json.loads(payload)

        # Handle payment intent succeeded
        if event['type'] == 'payment_intent.succeeded':
            payment_intent = event['data']['object']
            payment_intent_id = payment_intent['id']

            # Find and update the order
            order = db.query(Order).filter(
                Order.payment_intent_id == payment_intent_id
            ).first()

            if order:
                order.payment_status = "paid"
                order.order_status = "paid"
                db.commit()
                print(f"✅ Order {order.id} marked as paid (Payment Intent: {payment_intent_id})")
            else:
                print(f"⚠️ No order found for payment intent: {payment_intent_id}")

        # Handle payment intent failed
        elif event['type'] == 'payment_intent.payment_failed':
            payment_intent = event['data']['object']
            payment_intent_id = payment_intent['id']

            order = db.query(Order).filter(
                Order.payment_intent_id == payment_intent_id
            ).first()

            if order:
                order.payment_status = "failed"
                db.commit()
                print(f"❌ Order {order.id} payment failed (Payment Intent: {payment_intent_id})")

        return {"status": "success"}

    except stripe.error.SignatureVerificationError as e:
        raise HTTPException(status_code=400, detail=f"Invalid signature: {str(e)}")
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))