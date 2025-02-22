'use client';
import { FiShoppingCart } from 'react-icons/fi';
import { FiHeart } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { useState } from 'react';

export default function ProductCard({ product }) {
  const { addToCart, cartItems, updateQuantity, removeFromCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  if (!product) {
    console.error('No product data provided to ProductCard');
    return null;
  }

  const { _id, name, nameAr, price, images, stock, salePercentage, unitAmount, unit } = product;
  const image = images?.[0] || null;
  
  if (!image) {
    return null;
  }

  const finalPrice = salePercentage > 0 
    ? Math.floor(price * (1 - salePercentage / 100))
    : Math.floor(price);

  // Check if item is in cart
  const cartItem = cartItems.find(item => item._id === _id);

  const handleAddToCart = (e) => {
    e.preventDefault(); // Prevent navigation when clicking the button
    e.stopPropagation(); // Prevent event bubbling
    
    if (stock <= 0) {
      toast.error('המוצר אזל מהמלאי');
      return;
    }
    
    if (!cartItem) {
      addToCart({ ...product, quantity: 1 });
      toast.success('המוצר נוסף לסל');
    }
  };

  const handleQuantityChange = (e, change) => {
    e.preventDefault();
    e.stopPropagation();
    
    const currentQty = cartItem ? cartItem.quantity : 0;
    const newQuantity = currentQty + change;
    
    if (newQuantity === 0) {
      removeFromCart(_id);
      return;
    }
    
    if (newQuantity >= 1 && newQuantity <= stock) {
      updateQuantity(_id, newQuantity);
    }
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault(); // Prevent navigation
    e.stopPropagation(); // Prevent event bubbling

    if (isInWishlist(_id)) {
      removeFromWishlist(_id);
      toast.success('הוסר מהמועדפים');
    } else {
      addToWishlist(product);
      toast.success('נוסף למועדפים');
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group">
      <div className="relative">
        {/* Sale Badge */}
        {salePercentage > 0 && (
          <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded-full text-[12px] font-bold z-10">
            {salePercentage}% הנחה
          </div>
        )}
        
       

        
        
        {/* Product Image */}
        <div className="relative h-48 w-full bg-gray-50 p-4 group-hover:bg-gray-100 transition-colors">
          <Image
            src={image}
            alt={name || nameAr}
            fill
            className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
          />
          {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className="absolute top-2 left-2 z-20 p-1 rounded-full bg-white/80 hover:bg-white transition-colors duration-200 shadow-sm"
        >
          {isInWishlist(_id) ? (
            <FaHeart className="w-5 h-5 text-red-500" />
          ) : (
            <FiHeart className="w-5 h-5 text-gray-600 hover:text-red-500" />
          )}
        </button>
        </div>
         {/* Stock Badge */}
         {stock <= 10 && stock > 0 ? (
          <div className="w-[fit-content] h-8 bg-yellow-500 text-white px-3 flex justify-center items-center rounded-full text-sm font-bold z-10">
            נשארו {stock} יחידות!
          </div>) :  (<div className="h-8 text-white px-3 rounded-full text-sm font-bold z-10">
          </div>
        )}
        {/* Product Info */}
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2 text-right line-clamp-2 min-h-[3.5rem]">
            {name || nameAr}
          </h3>
          
          {/* Unit Information */}
          <p className="text-sm text-gray-600 mb-3 text-right">
            {unitAmount} {unit}
          </p>
          
          <div className="flex justify-between items-center mb-3">
            <div className="text-right">
              <div className="flex items-center gap-2">
                {salePercentage > 0 && (
                  <span className="text-sm text-gray-500 line-through">
                    ₪{Math.floor(price)}
                  </span>
                )}
                <span className="text-lg font-bold text-blue-600">
                  ₪{finalPrice}
                </span>
              </div>
            </div>
          </div>
          
          {cartItem ? (
            // Show quantity controls if item is in cart
            <div className="flex items-center justify-between h-[42px] border rounded-lg">
              <button
                onClick={(e) => handleQuantityChange(e, -1)}
                className="w-12 h-full flex items-center justify-center text-blue-600 hover:bg-blue-50 border-l"
              >
                -
              </button>
              <span className="font-medium flex-1 text-center">{cartItem.quantity}</span>
              <button
                onClick={(e) => handleQuantityChange(e, 1)}
                disabled={cartItem.quantity >= stock}
                className="w-12 h-full flex items-center justify-center text-blue-600 hover:bg-blue-50 disabled:opacity-50 border-r"
              >
                +
              </button>
            </div>
          ) : (
            // Show add to cart button if item is not in cart
            <button 
              onClick={handleAddToCart}
              disabled={stock <= 0}
              className={`w-full h-[42px] rounded-lg flex items-center justify-center gap-2 transition-all duration-300
                ${stock > 0 
                  ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                  : 'bg-gray-200 cursor-not-allowed text-gray-500'
                }`}
            >
              <FiShoppingCart className="w-5 h-5" />
              {stock > 0 ? 'הוסף לסל' : 'אזל מהמלאי'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}