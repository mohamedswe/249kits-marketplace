'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';
import { Plus, Minus, Trash2, ArrowLeft, CreditCard, Truck } from 'lucide-react';

export default function CartPage() {
  const { items, itemCount, totalAmount, updateQuantity, removeFromCart, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const shipping = totalAmount > 100 ? 0 : 15; // Free shipping over $100
  const tax = totalAmount * 0.1; // 10% tax
  const finalTotal = totalAmount + shipping + tax;

  const handleQuickCheckout = async () => {
    setIsCheckingOut(true);
    
    // Simulate checkout process
    setTimeout(() => {
      alert('شكراً لطلبك! - Thank you for your order! \n\nسيتم التواصل معك قريباً \nWe will contact you soon');
      clearCart();
      setIsCheckingOut(false);
    }, 2000);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-black via-red-900 to-black">
        {/* Header */}
        <header className="bg-gradient-to-r from-black via-red-900 to-black shadow-lg border-b border-red-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center space-x-4">
                <Link href="/" className="flex items-center text-red-300 hover:text-white transition-colors">
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  <span className="font-medium">Back to Shop</span>
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
            </div>
          </div>
        </header>

        {/* Empty Cart */}
        <div className="flex flex-col items-center justify-center min-h-[80vh] px-4">
          <div className="text-center">
            <div className="text-8xl mb-8">🛒</div>
            <h1 className="text-4xl font-bold text-white mb-4">سلة التسوق فارغة</h1>
            <h2 className="text-3xl font-bold text-red-300 mb-6">Your Cart is Empty</h2>
            <p className="text-xl text-red-200 mb-8 max-w-md">
              اضف بعض المنتجات الرائعة من مجموعتنا
              <br />
              Add some amazing products from our collection
            </p>
            <Link 
              href="/"
              className="inline-flex items-center bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-red-500 hover:to-red-600 transition-all transform hover:scale-105 shadow-lg border border-red-500"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              متابعة التسوق - Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-red-900 to-black">
      {/* Header */}
      <header className="bg-gradient-to-r from-black via-red-900 to-black shadow-lg border-b border-red-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center text-red-300 hover:text-white transition-colors">
                <ArrowLeft className="h-5 w-5 mr-2" />
                <span className="font-medium">Back to Shop</span>
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
            <div className="text-red-300">
              {itemCount} {itemCount === 1 ? 'item' : 'items'}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">سلة التسوق</h1>
          <h2 className="text-3xl font-bold text-red-300">Shopping Cart</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="bg-gradient-to-r from-black via-red-900 to-black rounded-lg border border-red-600 p-6">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Product Image */}
                  <div className="w-full sm:w-32 h-32 bg-gradient-to-r from-red-800 to-black rounded-lg overflow-hidden border border-red-500 flex-shrink-0">
                    <div 
                      className="w-full h-full flex items-center justify-center text-white font-bold text-2xl"
                      style={{ backgroundColor: item.color === 'black' ? '#000000' : item.color === 'white' ? '#FFFFFF' : item.color === 'red' ? '#dc2626' : item.color === 'blue' ? '#1e40af' : item.color === 'gold' ? '#d97706' : '#059669' }}
                    >
                      {item.images && item.images[0] ? (
                        <img 
                          src={item.images[0]} 
                          alt={`${item.colorName} ${item.type}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <span>{item.type === 'shirt' ? '👕' : '🩳'}</span>
                      )}
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-semibold text-white">
                          {item.colorName} {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                        </h3>
                        <p className="text-red-300">مقاس: {item.size} - Size: {item.size}</p>
                        <p className="text-red-400">${item.price.toFixed(2)} each</p>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-400 hover:text-red-300 p-2"
                        title="Remove item"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 rounded border border-red-600 hover:bg-red-800 text-red-300"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="text-white font-semibold w-8 text-center">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 rounded border border-red-600 hover:bg-red-800 text-red-300"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="text-xl font-bold text-red-400">
                        ${item.totalPrice.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-r from-black via-red-900 to-black rounded-lg border border-red-600 p-6 sticky top-8">
              <h3 className="text-2xl font-bold text-white mb-4">ملخص الطلب</h3>
              <h4 className="text-xl font-bold text-red-300 mb-6">Order Summary</h4>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-red-200">
                  <span>المجموع الفرعي - Subtotal:</span>
                  <span>${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-red-200">
                  <span className="flex items-center">
                    <Truck className="h-4 w-4 mr-2" />
                    الشحن - Shipping:
                  </span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-red-200">
                  <span>الضريبة - Tax (10%):</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t border-red-600 pt-3">
                  <div className="flex justify-between text-xl font-bold text-white">
                    <span>المجموع - Total:</span>
                    <span>${finalTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {shipping > 0 && (
                <div className="bg-red-800/50 border border-red-600 rounded p-3 mb-4">
                  <p className="text-sm text-red-200 text-center">
                    أضف ${(100 - totalAmount).toFixed(2)} للحصول على شحن مجاني
                    <br />
                    Add ${(100 - totalAmount).toFixed(2)} for free shipping
                  </p>
                </div>
              )}

              {/* Proceed to Checkout Button */}
              <Link
                href="/checkout"
                className="w-full block text-center bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-lg text-lg font-semibold hover:from-red-500 hover:to-red-600 transition-all transform hover:scale-105 shadow-lg border border-red-500 mb-4"
              >
                <CreditCard className="inline mr-2 h-5 w-5" />
                اطلب الآن - Proceed to Checkout
              </Link>

              <Link 
                href="/"
                className="w-full block text-center bg-transparent border-2 border-red-600 text-red-300 py-3 rounded-lg font-semibold hover:bg-red-800 transition-colors"
              >
                متابعة التسوق - Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}