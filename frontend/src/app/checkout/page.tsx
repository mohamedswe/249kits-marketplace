'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';
import { ArrowLeft, CreditCard, Lock } from 'lucide-react';
import { loadStripe, StripeElementsOptions } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';

// Initialize Stripe with your publishable key
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_your_publishable_key_here');

// Card Element styling
const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#ffffff',
      backgroundColor: '#7f1d1d',
      '::placeholder': {
        color: '#fca5a5',
      },
    },
    invalid: {
      color: '#ef4444',
    },
  },
  hidePostalCode: false,
};

// Checkout Form Component (inside Elements wrapper)
function CheckoutForm() {
  const { items, totalAmount, clearCart } = useCart();
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'SD'  // ISO 2-letter code for Sudan
  });

  const getShippingCost = (country: string): number => {
    const countryCode = country.toUpperCase();

    if (countryCode === 'US') {
      return 10.00;
    } else if (countryCode === 'CA') {
      return 15.00;
    } else {
      return 20.00; // International
    }
  };

  const shipping = getShippingCost(formData.country);
  const tax = 0; // No tax for international orders
  const finalTotal = totalAmount + shipping + tax;

  // Create payment intent when component mounts
  useEffect(() => {
    if (items.length > 0) {
      createPaymentIntent();
    }
  }, [items, formData.country]);

  const createPaymentIntent = async () => {
    try {
      const orderData = {
        customer_name: formData.customerName || 'Guest',
        customer_email: formData.customerEmail || 'guest@example.com',
        customer_phone: formData.customerPhone || '',
        address_line1: formData.addressLine1 || 'TBD',
        address_line2: formData.addressLine2 || '',
        city: formData.city || 'TBD',
        state: formData.state || '',
        postal_code: formData.postalCode || '',
        country: formData.country,
        items: items.map(item => ({
          product_type: item.type,
          color: item.color,
          color_name: item.colorName,
          size: item.size,
          quantity: item.quantity,
          price: item.price
        }))
      };

      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

      const response = await fetch(`${API_URL}/api/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData)
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { client_secret } = await response.json();
      setClientSecret(client_secret);
    } catch (error) {
      console.error('Error creating payment intent:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setIsProcessing(true);

    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setIsProcessing(false);
      return;
    }

    try {
      // Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: formData.customerName,
            email: formData.customerEmail,
            phone: formData.customerPhone,
            address: {
              line1: formData.addressLine1,
              line2: formData.addressLine2,
              city: formData.city,
              state: formData.state,
              postal_code: formData.postalCode,
              country: formData.country.toUpperCase()
            }
          }
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      // Create order after successful payment
      if (paymentIntent && paymentIntent.status === 'succeeded') {
        const orderData = {
          customer_name: formData.customerName,
          customer_email: formData.customerEmail,
          customer_phone: formData.customerPhone || '',
          address_line1: formData.addressLine1,
          address_line2: formData.addressLine2 || '',
          city: formData.city,
          state: formData.state || '',
          postal_code: formData.postalCode || '',
          country: formData.country,
          payment_intent_id: paymentIntent.id,  // ✅ Send payment intent ID
          items: items.map(item => ({
            product_type: item.type,
            color: item.color,
            color_name: item.colorName,
            size: item.size,
            quantity: item.quantity,
            price: item.price
          }))
        };

        const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

        const orderResponse = await fetch(`${API_URL}/api/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderData)
        });

        if (orderResponse.ok) {
          const order = await orderResponse.json();
          
          // Clear cart and show success
          clearCart();
          
          alert(`الدفع تم بنجاح! \nPayment successful! \n\nOrder ID: ${order.id}\nPayment ID: ${paymentIntent.id}\n\nسيتم شحن طلبك قريباً\nYour order will be shipped soon!`);
          
          // Redirect to homepage
          window.location.href = '/';
        } else {
          throw new Error('Order creation failed after payment');
        }
      }

    } catch (error: any) {
      console.error('Payment error:', error);
      alert(`خطأ في الدفع: ${error.message}\nPayment error: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Checkout Form */}
      <div className="bg-gradient-to-r from-black via-red-900 to-black rounded-lg border border-red-600 p-6">
        <h2 className="text-2xl font-bold text-white mb-6">معلومات الشحن - Shipping Information</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-red-300 mb-2">
                الاسم الكامل - Full Name *
              </label>
              <input
                type="text"
                name="customerName"
                required
                value={formData.customerName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-red-800 border border-red-600 rounded-md text-white placeholder-red-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Enter your full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-red-300 mb-2">
                البريد الإلكتروني - Email *
              </label>
              <input
                type="email"
                name="customerEmail"
                required
                value={formData.customerEmail}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-red-800 border border-red-600 rounded-md text-white placeholder-red-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="your@email.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-red-300 mb-2">
              رقم الهاتف - Phone Number
            </label>
            <input
              type="tel"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-red-800 border border-red-600 rounded-md text-white placeholder-red-300 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="+249 XXX XXX XXXX"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-red-300 mb-2">
              العنوان - Address Line 1 *
            </label>
            <input
              type="text"
              name="addressLine1"
              required
              value={formData.addressLine1}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-red-800 border border-red-600 rounded-md text-white placeholder-red-300 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Street address"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-red-300 mb-2">
              العنوان التكميلي - Address Line 2
            </label>
            <input
              type="text"
              name="addressLine2"
              value={formData.addressLine2}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-red-800 border border-red-600 rounded-md text-white placeholder-red-300 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Apartment, suite, etc."
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-red-300 mb-2">
                المدينة - City *
              </label>
              <input
                type="text"
                name="city"
                required
                value={formData.city}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-red-800 border border-red-600 rounded-md text-white placeholder-red-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Khartoum"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-red-300 mb-2">
                الولاية - State
              </label>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-red-800 border border-red-600 rounded-md text-white placeholder-red-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Khartoum State"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-red-300 mb-2">
                الرمز البريدي - Postal Code
              </label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-red-800 border border-red-600 rounded-md text-white placeholder-red-300 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="11111"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-red-300 mb-2">
              البلد - Country
            </label>
            <select
              name="country"
              value={formData.country}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-red-800 border border-red-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="SD">Sudan - السودان</option>
              <option value="US">USA - الولايات المتحدة</option>
              <option value="CA">Canada - كندا</option>
              <option value="EG">Egypt - مصر</option>
              <option value="SA">Saudi Arabia - السعودية</option>
              <option value="AE">UAE - الإمارات</option>
              <option value="GB">UK - المملكة المتحدة</option>
            </select>
          </div>

          {/* Card Information Section */}
          <div className="bg-red-800/50 border border-red-600 rounded p-4">
            <h4 className="text-white font-semibold mb-4 flex items-center">
              <CreditCard className="mr-2 h-5 w-5" />
              معلومات البطاقة - Card Information
            </h4>
            <div className="bg-red-800 border border-red-600 rounded-md p-3">
              <CardElement options={cardElementOptions} />
            </div>
            <div className="flex items-center text-red-200 text-sm mt-2">
              <Lock className="h-4 w-4 mr-2" />
              <span>Secure payment powered by Stripe</span>
            </div>
            <p className="text-red-300 text-xs mt-1">
              Your payment information is encrypted and secure. We never store your card details.
            </p>
          </div>

          <button
            type="submit"
            disabled={!stripe || isProcessing || !clientSecret}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-lg text-lg font-semibold hover:from-red-500 hover:to-red-600 transition-all transform hover:scale-105 shadow-lg border border-red-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isProcessing ? (
              <span>جاري المعالجة... Processing Payment...</span>
            ) : !clientSecret ? (
              <span>تحضير الدفع... Preparing Payment...</span>
            ) : (
              <>
                <CreditCard className="mr-2 h-5 w-5" />
                ادفع الآن - Pay ${finalTotal.toFixed(2)}
              </>
            )}
          </button>
        </form>
      </div>

      {/* Order Summary */}
      <div className="bg-gradient-to-r from-black via-red-900 to-black rounded-lg border border-red-600 p-6 h-fit">
        <h3 className="text-2xl font-bold text-white mb-6">ملخص الطلب - Order Summary</h3>
        
        <div className="space-y-4 mb-6">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-center border-b border-red-700 pb-3">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-red-800 rounded border border-red-600 flex items-center justify-center">
                  <span className="text-white text-lg">
                    {item.type === 'shirt' ? '👕' : '🩳'}
                  </span>
                </div>
                <div>
                  <p className="text-white font-medium">
                    {item.colorName.split(' - ')[1]} {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                  </p>
                  <p className="text-red-300 text-sm">Size: {item.size} | Qty: {item.quantity}</p>
                </div>
              </div>
              <p className="text-white font-semibold">${item.totalPrice.toFixed(2)}</p>
            </div>
          ))}
        </div>

        <div className="space-y-3 mb-6 border-t border-red-700 pt-4">
          <div className="flex justify-between text-red-200">
            <span>المجموع الفرعي - Subtotal:</span>
            <span>${totalAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-red-200">
            <span>الشحن - Shipping:</span>
            <span>${shipping.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-red-200">
            <span>الضريبة - Tax:</span>
            <span>${tax.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-xl font-bold text-white border-t border-red-600 pt-3">
            <span>المجموع - Total:</span>
            <span>${finalTotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="text-center text-red-300 text-sm">
          <p>🔒 Payments secured by Stripe</p>
          <p className="mt-2">سيتم التواصل معك لتأكيد الطلب</p>
          <p>We will contact you to confirm your order</p>
        </div>
      </div>
    </div>
  );
}

// Main Checkout Page Component
export default function CheckoutPage() {
  const { items } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-red-900 to-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white mb-4">السلة فارغة</h1>
          <h2 className="text-2xl text-red-300 mb-6">Cart is Empty</h2>
          <Link href="/" className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700">
            العودة للتسوق - Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const elementsOptions: StripeElementsOptions = {
    appearance: {
      theme: 'night',
      variables: {
        colorPrimary: '#dc2626',
        colorBackground: '#7f1d1d',
        colorText: '#ffffff',
        colorDanger: '#ef4444',
        fontFamily: 'system-ui, sans-serif',
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-red-900 to-black">
      {/* Header */}
      <header className="bg-gradient-to-r from-black via-red-900 to-black shadow-lg border-b border-red-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/cart" className="flex items-center text-red-300 hover:text-white transition-colors">
                <ArrowLeft className="h-5 w-5 mr-2" />
                <span className="font-medium">Back to Cart</span>
              </Link>
              <div className="h-6 w-px bg-red-600"></div>
              <Link href="/" className="flex items-center">
                <img 
                  src="/249Logo.jpeg" 
                  alt="249 Kits Logo" 
                  className="h-12 w-auto mr-3"
                />
                <div className="hidden sm:block">
                  <h1 className="text-xl font-bold text-white">249 KITS</h1>
                  <p className="text-xs text-red-300 font-medium">السودان الجميل</p>
                </div>
              </Link>
            </div>
            <div className="flex items-center text-red-300">
              <Lock className="h-4 w-4 mr-2" />
              <span className="text-sm">Secure Stripe Payment</span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Elements stripe={stripePromise} options={elementsOptions}>
          <CheckoutForm />
        </Elements>
      </div>
    </div>
  );
}