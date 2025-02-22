'use client';
import { useState, useEffect } from 'react';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function WishlistPage() {
  const { wishlist } = useWishlist();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return (
      <div className="container mx-auto px-4 py-8" dir="rtl">
        <h1 className="text-3xl font-bold mb-8">רשימת מועדפים</h1>
        <div className="text-center py-8">טוען...</div>
      </div>
    );
  }

  if (wishlist.length === 0) {
    return (
      <div className="container mx-auto py-8" dir="rtl">
        <h1 className="text-3xl font-bold mb-8">רשימת מועדפים</h1>
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">אין מוצרים ברשימת המועדפים</p>
          <Link 
            href="/shop" 
            className="inline-block bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            המשך לקנות
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <h1 className="text-3xl font-bold mb-8">רשימת מועדפים</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {wishlist.map((product) => (
          <div key={product._id} className="h-full">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
} 