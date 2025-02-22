'use client';
import { useState } from 'react';
import Header from './components/Header';
// import Footer from './components/Footer';
import { CartProvider } from './context/CartContext';
import Cart from './components/Cart';
import { WishlistProvider } from './context/WishlistContext';

export default function RootLayoutClient({ children }) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <CartProvider>
      <WishlistProvider>
        <Header setIsCartOpen={setIsCartOpen} />
        <main className="min-h-screen bg-secondary">
          {children}
        </main>
        {/* <Footer /> */}
        <Cart isOpen={isCartOpen} setIsOpen={setIsCartOpen} />
      </WishlistProvider>
    </CartProvider>
  );
} 