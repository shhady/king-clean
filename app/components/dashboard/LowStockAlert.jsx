'use client';
import { useState, useEffect } from 'react';
import { FiAlertCircle, FiLoader } from 'react-icons/fi';
import Link from 'next/link';

export default function LowStockAlert() {
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLowStockProducts();
  }, []);

  const fetchLowStockProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch('/api/products/low-stock');
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      if (!Array.isArray(data)) {
        throw new Error('Invalid response format');
      }
      
      setLowStockProducts(data);
    } catch (error) {
      console.error('Error fetching low stock products:', error);
      setError('טעינת התראות המלאי נכשלה');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="bg-gray-50 p-4 rounded-lg flex items-center justify-center">
        <FiLoader className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-r-4 border-red-400 p-4" dir="rtl">
        <div className="flex items-center">
          <FiAlertCircle className="text-red-400 text-xl ml-3" />
          <p className="text-black font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (lowStockProducts.length === 0) {
    return null;
  }

  return (
    <div className="bg-yellow-50 border-r-4 border-yellow-400 p-4 mb-8" dir="rtl">
      <div className="flex items-center">
        <FiAlertCircle className="text-yellow-400 text-xl ml-3" />
        <h3 className="text-xl font-bold text-black">
          התראת מלאי נמוך
        </h3>
      </div>
      <div className="mt-4 space-y-2">
        {lowStockProducts.map((product) => (
          <div 
            key={product._id}
            className="flex items-center justify-between bg-white p-3 rounded-lg shadow-sm"
          >
            <div>
              <p className="font-bold text-black">{product.name}</p>
              <p className="text-sm text-black">
                מלאי נותר: <span className="font-medium">{product.stock}</span> יחידות
              </p>
            </div>
            <Link
              href={`/dashboard/products/${product._id}/edit`}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
            >
              עדכן מלאי
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
} 