'use client';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
export const dynamic = 'force-dynamic';

export default function TopProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopProducts();
  }, []);

  const fetchTopProducts = async () => {
    try {
      const response = await fetch('/api/products/top');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching top products:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="bg-gray-200 w-16 h-16 rounded-lg"></div>
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {products.map((product) => (
        <div key={product._id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="relative w-16 h-16 rounded-lg overflow-hidden">
            <Image
              src={product.images[0] || '/images/no-image.jpg'}
              alt={product.name || product.nameAr}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <h3 className="font-bold">{product.name || product.nameAr}</h3>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span>{product.sales || 0} מכירות</span>
              <span>{(product.price * (product.sales || 0)).toLocaleString()} שקל</span>
            </div>
            <div className="text-sm text-gray-500">
              {product.currentMonthSales} מכירות בחודש הזה
            </div>
          </div>
          <div className={`flex items-center gap-1 ${
            product.salesTrend > 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            {product.salesTrend > 0 ? <FiTrendingUp /> : <FiTrendingDown />}
            <span>{Math.abs(product.salesTrend)}%</span>
          </div>
        </div>
      ))}
    </div>
  );
} 