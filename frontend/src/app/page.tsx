'use client';

import Link from 'next/link';
import { ShoppingCart, Star, Truck, Shield, Zap } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ProductCustomizer from './components/ProductCustomizer';

export default function HomePage() {
  const { itemCount } = useCart();

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-red-900 to-black">
      {/* Header */}
      <header className="bg-gradient-to-r from-black via-red-900 to-black shadow-lg border-b border-red-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <img 
                src="/249Logo.jpeg" 
                alt="249 Kits Logo" 
                className="h-12 w-auto mr-3"
              />
              <div className="hidden sm:block">
                <h1 className="text-xl font-bold text-white">249 KITS</h1>
                <p className="text-xs text-red-300 font-medium">السودان الجميل</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/cart" className="relative p-2 text-red-300 hover:text-white transition-colors">
                <ShoppingCart className="h-6 w-6" />
                {itemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold">
                    {itemCount}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-black via-red-900 to-black text-white py-20 relative overflow-hidden">
        {/* Geometric Pattern Overlay */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-10 left-10 w-20 h-20 border-2 border-red-400 transform rotate-45"></div>
          <div className="absolute top-32 right-20 w-16 h-16 border-2 border-red-300 transform rotate-12"></div>
          <div className="absolute bottom-20 left-32 w-24 h-24 border-2 border-red-400 transform -rotate-12"></div>
          <div className="absolute bottom-32 right-10 w-12 h-12 border-2 border-red-500 transform rotate-45"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h2 className="text-4xl md:text-6xl font-bold mb-6">
              تراث السودان
              <br />
              <span className="text-red-300">Sudanese Heritage</span>
              <br />
              <span className="text-2xl md:text-3xl text-red-400">في كل قطعة ملابس</span>
            </h2>
            <p className="text-xl md:text-2xl text-red-200 mb-8 max-w-3xl mx-auto">
              Celebrate the rich culture of Sudan with premium streetwear that tells your story. 
              From the Blue and White Nile to the streets of Khartoum - wear your heritage with pride.
            </p>
            <button 
              onClick={() => document.getElementById('shop')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-gradient-to-r from-red-600 to-red-700 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-red-500 hover:to-red-600 transition-all transform hover:scale-105 shadow-lg border border-red-500"
            >
              تسوق الآن - Shop Now
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gradient-to-r from-black via-red-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-white mb-4">لماذا 249 كيتس؟</h3>
            <p className="text-lg text-red-300">Why Choose 249 Kits?</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center bg-gradient-to-r from-black via-red-900 to-black p-6 rounded-lg shadow-lg border border-red-600">
              <div className="bg-red-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500">
                <Zap className="h-8 w-8 text-red-300" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">توصيل سريع</h3>
              <h4 className="text-lg font-medium mb-2 text-red-300">Fast Delivery</h4>
              <p className="text-red-200">From Khartoum to your door in 3-5 business days</p>
            </div>
            <div className="text-center bg-gradient-to-r from-black via-red-900 to-black p-6 rounded-lg shadow-lg border border-red-600">
              <div className="bg-red-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500">
                <Shield className="h-8 w-8 text-red-300" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">جودة مضمونة</h3>
              <h4 className="text-lg font-medium mb-2 text-red-300">Quality Guaranteed</h4>
              <p className="text-red-200">Premium materials with 100% satisfaction guarantee</p>
            </div>
            <div className="text-center bg-gradient-to-r from-black via-red-900 to-black p-6 rounded-lg shadow-lg border border-red-600">
              <div className="bg-red-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500">
                <Star className="h-8 w-8 text-red-300" />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">تصميم مخصص</h3>
              <h4 className="text-lg font-medium mb-2 text-red-300">Custom Heritage</h4>
              <p className="text-red-200">Designs inspired by Sudanese culture and traditions</p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Customizer Section */}
      <section id="shop" className="py-20 bg-gradient-to-r from-black via-red-900 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              اصنع طقمك المثالي
            </h2>
            <h3 className="text-2xl md:text-3xl font-bold text-red-300 mb-4">
              Build Your Perfect Kit
            </h3>
            <p className="text-xl text-red-200 max-w-2xl mx-auto">
              Customize your shirts and shorts with designs that honor Sudan's rich heritage. 
              من النيل الأزرق إلى النيل الأبيض - Express your Sudanese pride.
            </p>
          </div>
          
          <ProductCustomizer />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-black via-red-900 to-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <img 
                  src="/249Logo.jpeg" 
                  alt="249 Kits Logo" 
                  className="h-10 w-auto mr-3"
                />
                <h3 className="text-2xl font-bold">249 KITS</h3>
              </div>
              <p className="text-red-200 mb-2">
                السودان في كل تصميم
              </p>
              <p className="text-gray-300">
                Premium streetwear celebrating Sudanese heritage. 
                Quality, culture, and pride in every piece.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-red-300">روابط سريعة</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-red-300 transition-colors">معلومات عنا - About Us</a></li>
                <li><a href="#" className="hover:text-red-300 transition-colors">دليل المقاسات - Size Guide</a></li>
                <li><a href="#" className="hover:text-red-300 transition-colors">معلومات الشحن - Shipping</a></li>
                <li><a href="#" className="hover:text-red-300 transition-colors">الإرجاع - Returns</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4 text-blue-300">تواصل معنا</h4>
              <ul className="space-y-2 text-gray-300">
                <li>Email: hello@249kits.com</li>
                <li>WhatsApp: +249 XXX XXXX</li>
                <li>Instagram: @249kits_sudan</li>
                <li>الخرطوم، السودان</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-red-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">&copy; 2024 249 Kits. جميع الحقوق محفوظة - All rights reserved.</p>
            <p className="text-red-300 text-sm mt-2">🇸🇩 Made with love in Sudan</p>
          </div>
        </div>
      </footer>
    </div>
  );
}