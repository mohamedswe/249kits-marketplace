'use client';

import { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import { useCart } from '../../context/CartContext';

type ProductType = 'shirt' | 'shorts';
type Size = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL';
type Color = 'black' | 'white' | 'red' | 'blue' | 'gold' | 'green';

const PRODUCT_PRICES = {
  shirt: 35.00,      // Regular shirt
  custom_shirt: 55.00, // Custom shirt (we'll add this option)
  shorts: 20.00
};

const COLORS = {
  black: { name: 'أسود - Black', value: '#000000' },
  white: { name: 'أبيض - White', value: '#FFFFFF' },
  red: { name: 'أحمر - Red', value: '#dc2626' },
  blue: { name: 'أزرق - Blue', value: '#1e40af' },
  gold: { name: 'ذهبي - Gold', value: '#d97706' },
  green: { name: 'أخضر - Green', value: '#059669' }
};

// Product images with your actual files
const PRODUCT_IMAGES = {
  shirt: {
    black: [
      '/placeholder-black-shirt-1.jpg',
      '/placeholder-black-shirt-2.jpg', 
      '/placeholder-black-shirt-3.jpg'
    ],
    white: [
      '/WhiteShirt.jpeg',
      '/WhiteShirt model1.jpeg',
      '/WhiteShirt model2.jpeg'
    ],
    red: [
      '/Redshirt.jpeg',
      '/Redshirt model1.jpeg',
      '/Redshirt model2.jpeg'
    ],
    blue: [
      '/placeholder-blue-shirt-1.jpg',
      '/placeholder-blue-shirt-2.jpg',
      '/placeholder-blue-shirt-3.jpg'
    ],
    gold: [
      '/placeholder-gold-shirt-1.jpg',
      '/placeholder-gold-shirt-2.jpg',
      '/placeholder-gold-shirt-3.jpg'
    ],
    green: [
      '/placeholder-green-shirt-1.jpg',
      '/placeholder-green-shirt-2.jpg',
      '/placeholder-green-shirt-3.jpg'
    ]
  },
  shorts: {
    black: [
      '/placeholder-black-shorts-1.jpg',
      '/placeholder-black-shorts-2.jpg',
      '/placeholder-black-shorts-3.jpg'
    ],
    white: [
      '/placeholder-white-shorts-1.jpg',
      '/placeholder-white-shorts-2.jpg',
      '/placeholder-white-shorts-3.jpg'
    ],
    red: [
      '/placeholder-red-shorts-1.jpg',
      '/placeholder-red-shorts-2.jpg',
      '/placeholder-red-shorts-3.jpg'
    ],
    blue: [
      '/placeholder-blue-shorts-1.jpg',
      '/placeholder-blue-shorts-2.jpg',
      '/placeholder-blue-shorts-3.jpg'
    ],
    gold: [
      '/placeholder-gold-shorts-1.jpg',
      '/placeholder-gold-shorts-2.jpg',
      '/placeholder-gold-shorts-3.jpg'
    ],
    green: [
      '/placeholder-green-shorts-1.jpg',
      '/placeholder-green-shorts-2.jpg',
      '/placeholder-green-shorts-3.jpg'
    ]
  }
};

const SIZES: Size[] = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

export default function ProductCustomizer() {
  const { addToCart } = useCart();
  const [productType, setProductType] = useState<ProductType>('shirt');
  const [selectedSize, setSelectedSize] = useState<Size>('M');
  const [selectedColor, setSelectedColor] = useState<Color>('black');
  const [quantity, setQuantity] = useState(1);
  const [imageErrors, setImageErrors] = useState<{[key: string]: boolean}>({});

  const currentPrice = PRODUCT_PRICES[productType];
  const totalPrice = (currentPrice * quantity).toFixed(2);
  
  // Get current product images
  const currentImages = PRODUCT_IMAGES[productType][selectedColor];

  // Reset image errors when color or product type changes
  const handleColorChange = (color: Color) => {
    setSelectedColor(color);
    setImageErrors({}); // Reset image error states
  };

  const handleProductTypeChange = (type: ProductType) => {
    setProductType(type);
    setImageErrors({}); // Reset image error states
  };

  const handleImageError = (imageSrc: string) => {
    setImageErrors(prev => ({
      ...prev,
      [imageSrc]: true
    }));
  };

  const handleAddToCart = () => {
    const product = {
      type: productType,
      size: selectedSize,
      color: selectedColor,
      colorName: COLORS[selectedColor].name,
      quantity: quantity,
      price: currentPrice,
      totalPrice: parseFloat(totalPrice),
      images: currentImages
    };
    
    addToCart(product);
    
    alert(`تم اضافة ${quantity} ${COLORS[selectedColor].name} ${productType}(s) في مقاس ${selectedSize} للسلة! \n\nAdded ${quantity} ${COLORS[selectedColor].name} ${productType}(s) in size ${selectedSize} to cart!`);
  };

  return (
    <div className="max-w-4xl mx-auto bg-gradient-to-r from-black via-red-900 to-black rounded-2xl shadow-2xl overflow-hidden border-2 border-red-600">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Product Preview with Image Grid */}
        <div className="p-8 bg-gradient-to-r from-black via-red-900 to-black relative">
          {/* Geometric Pattern */}
          <div className="absolute top-4 right-4 w-12 h-12 border-2 border-red-400 transform rotate-45 opacity-30"></div>
          <div className="absolute bottom-4 left-4 w-8 h-8 border-2 border-red-500 transform rotate-12 opacity-30"></div>
          
          {/* Image Grid - 3 large images filling the space */}
          <div className="space-y-4 h-full min-h-[500px] flex flex-col">
            {currentImages.map((imageSrc, index) => (
              <div 
                key={index}
                className="relative flex-1 bg-gradient-to-r from-black via-red-900 to-black rounded-lg overflow-hidden shadow-lg border border-red-500"
              >
                {/* Fallback colored background */}
                <div 
                  className="absolute inset-0 flex items-center justify-center text-white font-bold text-4xl"
                  style={{ backgroundColor: COLORS[selectedColor].value }}
                >
                  {productType === 'shirt' ? '👕' : '🩳'}
                </div>
                
                {/* Actual product image */}
                <img 
                  key={`${selectedColor}-${productType}-${index}`} // Force re-render when color/type changes
                  src={imageSrc} 
                  alt={`${COLORS[selectedColor].name} ${productType} - View ${index + 1}`}
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ display: imageErrors[imageSrc] ? 'none' : 'block' }}
                  onError={() => handleImageError(imageSrc)}
                />
                
                {/* Image number indicator */}
                <div className="absolute top-2 right-2 bg-black/70 text-white text-sm px-3 py-1 rounded">
                  {index + 1}
                </div>
                
                {/* Sudanese flag pattern overlay on first image */}
                {index === 0 && (
                  <div className="absolute top-2 left-2 w-8 h-6 bg-gradient-to-r from-red-600 via-white to-black opacity-60 rounded"></div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Customization Form */}
        <div className="p-8 bg-gradient-to-r from-black via-red-900 to-black">
          <h2 className="text-2xl font-bold text-white mb-2">خصص منتجك</h2>
          <h3 className="text-xl font-semibold text-red-300 mb-6">Customize Your Product</h3>
          
          {/* Product Type Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-white mb-1">
              نوع المنتج
            </label>
            <label className="block text-sm font-medium text-red-300 mb-3">
              Product Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleProductTypeChange('shirt')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  productType === 'shirt'
                    ? 'border-red-400 bg-red-800 text-red-200'
                    : 'border-red-700 hover:border-red-500 text-red-300 hover:text-red-200'
                }`}
              >
                <div className="text-2xl mb-2">👕</div>
                <div className="font-semibold">قميص - Shirt</div>
                <div className="text-sm text-red-400">${PRODUCT_PRICES.shirt}</div>
              </button>
              <button
                onClick={() => handleProductTypeChange('shorts')}
                className={`p-4 rounded-lg border-2 transition-all ${
                  productType === 'shorts'
                    ? 'border-red-400 bg-red-800 text-red-200'
                    : 'border-red-700 hover:border-red-500 text-red-300 hover:text-red-200'
                }`}
              >
                <div className="text-2xl mb-2">🩳</div>
                <div className="font-semibold">شورت - Shorts</div>
                <div className="text-sm text-red-400">${PRODUCT_PRICES.shorts}</div>
              </button>
            </div>
          </div>

          {/* Color Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-white mb-1">
              اللون
            </label>
            <label className="block text-sm font-medium text-red-300 mb-3">
              Color
            </label>
            <div className="grid grid-cols-3 gap-3">
              {Object.entries(COLORS).map(([key, color]) => (
                <button
                  key={key}
                  onClick={() => handleColorChange(key as Color)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    selectedColor === key
                      ? 'border-red-400 bg-red-800'
                      : 'border-red-700 hover:border-red-500'
                  }`}
                >
                  <div 
                    className="w-8 h-8 rounded-full mx-auto mb-2 border-2 border-red-500"
                    style={{ backgroundColor: color.value }}
                  />
                  <div className="text-sm font-medium text-red-200">{color.name.split(' - ')[0]}</div>
                  <div className="text-xs text-red-400">{color.name.split(' - ')[1]}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-white mb-1">
              المقاس
            </label>
            <label className="block text-sm font-medium text-red-300 mb-3">
              Size
            </label>
            <div className="grid grid-cols-3 gap-3">
              {SIZES.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`p-3 rounded-lg border-2 transition-all font-semibold ${
                    selectedSize === size
                      ? 'border-red-400 bg-red-800 text-red-200'
                      : 'border-red-700 hover:border-red-500 text-red-300 hover:text-red-200'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity Selection */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-white mb-1">
              الكمية
            </label>
            <label className="block text-sm font-medium text-red-300 mb-3">
              Quantity
            </label>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 rounded-lg border border-red-600 hover:bg-red-800 text-red-300 hover:text-red-200"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="text-xl font-semibold w-8 text-center text-white">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-2 rounded-lg border border-red-600 hover:bg-red-800 text-red-300 hover:text-red-200"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-4 rounded-lg text-lg font-semibold hover:from-red-500 hover:to-red-600 transition-all transform hover:scale-105 shadow-lg border border-red-500"
          >
            أضف للسلة - Add to Cart - ${totalPrice}
          </button>
        </div>
      </div>
    </div>
  );
}