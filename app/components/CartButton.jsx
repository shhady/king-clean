'use client';
import { FiShoppingCart } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

export default function CartButton() {
  const { cartItems, isCartOpen, setIsCartOpen } = useCart();

  const totalItems = Math.floor(cartItems.reduce((total, item) => total + item.quantity, 0));

  return (
    <button
      onClick={() => setIsCartOpen(prev => !prev)}
      className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
      aria-label="פתח עגלת קניות"
    >
      <FiShoppingCart className="w-6 h-6" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
          {totalItems}
        </span>
      )}
    </button>
  );
} 