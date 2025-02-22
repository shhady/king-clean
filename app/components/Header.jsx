'use client';
import { useState } from 'react';
import { FiSearch, FiHeart, FiUser, FiShoppingBag, FiMenu, FiX } from 'react-icons/fi';
import Link from 'next/link';
import CartButton from './CartButton';
import { useWishlist } from '../context/WishlistContext';
import SearchOverlay from './SearchOverlay';
import MenuOverlay from './MenuOverlay';
import Image from 'next/image';
import { UserButton, useUser } from '@clerk/nextjs';
import { FaUser } from 'react-icons/fa';
import { useCart } from '../context/CartContext';

export default function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { getWishlistCount, wishlist, isLoaded } = useWishlist();
    const { IsCartOpen,setIsCartOpen } = useCart();

  const { user } = useUser();
  const WishlistButton = () => {
    return (
      <Link href="/wishlist" className="relative py-2">
        <FiHeart className="w-6 h-6" />
        {isLoaded && wishlist.length > 0 && (
          <span className="absolute -top-1 -right-2 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {wishlist.length}
          </span>
        )}
      </Link>
    );
  };

  return (
    <>
      <header className="bg-white border-b flex justify-center items-center px-2 sticky top-0 z-50" dir="ltr">
        <div className="container">
          <div className="flex justify-between items-center h-24">
            {/* Left Section */}
            <div className="flex items-center gap-2 md:gap-4 space-x-reverse">
              <CartButton setIsCartOpen={setIsCartOpen} IsCartOpen={IsCartOpen} />
              <WishlistButton />
              {user ? <UserButton /> : <>
                  
                  <Link
                    href="/sign-in"
                    className="text-gray-600 hover:text-[#B78628]"
                  >
                    <FaUser/>
                  </Link>
                </>}
            </div>

            {/* Center Logo */}
            <Link href="/" className="absolute left-1/2 transform -translate-x-1/2">
             <h1 className='text-2xl font-bold'>LOGO</h1>
            </Link>

            {/* Right Section */}
            <div className="flex items-center gap-4 space-x-reverse">
              <button 
                onClick={() => setIsSearchOpen(true)}
                className="text-gray-700 hover:text-primary"
              >
                <FiSearch className="w-6 h-6" />
              </button>
              <button 
                onClick={() => setIsMenuOpen(true)}
                className="text-gray-700 hover:text-primary"
              >
                <FiMenu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Overlay */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Menu Overlay */}
      <MenuOverlay isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
} 