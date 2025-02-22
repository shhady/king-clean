'use client';
import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import Link from 'next/link';

export default function RelatedProducts({ categoryId, currentProductId }) {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (categoryId) {
      fetchRelatedProducts();
    }
  }, [categoryId, currentProductId]);

  const fetchRelatedProducts = async () => {
    try {
      const response = await fetch(`/api/products?category=${categoryId}&limit=4&exclude=${currentProductId}`);
      if (!response.ok) throw new Error('Failed to fetch related products');
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error fetching related products:', error);
      setProducts([]);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="mt-16" dir="rtl">
        <h2 className="text-2xl font-bold mb-8">מוצרים דומים</h2>
        <div className="text-center">טוען...</div>
      </div>
    );
  }

  if (!products || products.length === 0) {
    console.log('No related products found');
    return null;
  }

  return (
    <div className="mt-16 border-t pt-16" dir="rtl">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold">מוצרים דומים</h2>
        <Link 
          href={`/shop?category=${categoryId}`}
          className="text-primary hover:text-primary-dark transition-colors"
        >
          הצג עוד
        </Link>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link 
            key={product._id} 
            href={`/shop/${product._id}`}
            className="block cursor-pointer h-full"
          >
            <ProductCard 
              key={product._id} 
              product={product}
              shade={products.indexOf(product) % 2 === 0 ? 'light' : 'medium'}
            />
          </Link>
        ))}
      </div>
    </div>
  );
} 