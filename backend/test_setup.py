"""
Test script to verify backend setup before deployment
Run this to check if everything is configured correctly
"""

import os
from dotenv import load_dotenv
import stripe

load_dotenv()

def test_environment_variables():
    """Check if all required environment variables are set"""
    print("🔍 Checking Environment Variables...\n")

    required_vars = {
        'STRIPE_SECRET_KEY': 'Stripe secret key',
        'DATABASE_URL': 'Database connection string'
    }

    optional_vars = {
        'STRIPE_WEBHOOK_SECRET': 'Stripe webhook secret (required for production)',
        'FRONTEND_URL': 'Frontend URL (required for production)'
    }

    all_good = True

    for var, description in required_vars.items():
        value = os.getenv(var)
        if value:
            # Mask sensitive data
            masked = value[:10] + '...' if len(value) > 10 else value
            print(f"✅ {var}: {masked}")
        else:
            print(f"❌ {var}: NOT SET ({description})")
            all_good = False

    print()
    for var, description in optional_vars.items():
        value = os.getenv(var)
        if value:
            masked = value[:10] + '...' if len(value) > 10 else value
            print(f"✅ {var}: {masked}")
        else:
            print(f"⚠️  {var}: NOT SET ({description})")

    return all_good

def test_stripe_connection():
    """Test Stripe API connection"""
    print("\n🔍 Testing Stripe Connection...\n")

    stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

    if not stripe.api_key:
        print("❌ Stripe API key not set")
        return False

    try:
        # Test API call - list payment methods
        balance = stripe.Balance.retrieve()
        print(f"✅ Stripe connection successful!")
        print(f"   Available balance: {balance.available[0].amount / 100} {balance.available[0].currency.upper()}")
        print(f"   Pending balance: {balance.pending[0].amount / 100} {balance.pending[0].currency.upper()}")
        return True
    except stripe.error.AuthenticationError:
        print("❌ Stripe authentication failed - check your API key")
        return False
    except Exception as e:
        print(f"❌ Stripe error: {str(e)}")
        return False

def test_database_connection():
    """Test database connection"""
    print("\n🔍 Testing Database Connection...\n")

    try:
        from database import engine
        from sqlalchemy import text

        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1"))
            print("✅ Database connection successful!")

            # Check if tables exist
            from models import Base
            Base.metadata.create_all(bind=engine)
            print("✅ Database tables created/verified")
            return True
    except Exception as e:
        print(f"❌ Database error: {str(e)}")
        return False

def test_imports():
    """Test if all required modules can be imported"""
    print("\n🔍 Testing Python Imports...\n")

    try:
        import fastapi
        print(f"✅ FastAPI: {fastapi.__version__}")

        import sqlalchemy
        print(f"✅ SQLAlchemy: {sqlalchemy.__version__}")

        import stripe
        # Handle both old and new Stripe versions
        stripe_version = getattr(stripe, '__version__', None) or getattr(stripe, '_version', 'unknown')
        if hasattr(stripe_version, 'VERSION'):
            stripe_version = stripe_version.VERSION
        print(f"✅ Stripe: {stripe_version}")

        import pydantic
        print(f"✅ Pydantic: {pydantic.__version__}")

        return True
    except ImportError as e:
        print(f"❌ Import error: {str(e)}")
        print("   Run: pip install -r requirements.txt")
        return False

def main():
    print("=" * 60)
    print("🚀 249 Kits Backend - Pre-Deployment Test")
    print("=" * 60)

    results = []

    results.append(("Imports", test_imports()))
    results.append(("Environment Variables", test_environment_variables()))
    results.append(("Database", test_database_connection()))
    results.append(("Stripe", test_stripe_connection()))

    print("\n" + "=" * 60)
    print("📊 Test Summary")
    print("=" * 60 + "\n")

    for test_name, passed in results:
        status = "✅ PASS" if passed else "❌ FAIL"
        print(f"{status} - {test_name}")

    all_passed = all(result[1] for result in results)

    print("\n" + "=" * 60)
    if all_passed:
        print("🎉 All tests passed! Ready for deployment!")
    else:
        print("⚠️  Some tests failed. Fix the issues before deploying.")
    print("=" * 60 + "\n")

if __name__ == "__main__":
    main()
