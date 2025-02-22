'use client';
import { useState, useEffect } from 'react';
import { FiPackage, FiClock } from 'react-icons/fi';
import Link from 'next/link';

export default function RecentOrders() {
  const [recentOrders, setRecentOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRecentOrders = async () => {
      try {
        const response = await fetch('/api/orders/recent');
        if (!response.ok) throw new Error('Failed to fetch recent orders');
        const data = await response.json();
        setRecentOrders(data.orders);
      } catch (error) {
        console.error('Error fetching recent orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecentOrders();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      // case 'shipped':
      //   return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-orange-100 text-orange-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'processing':
        return 'בטיפול';
      case 'completed':
        return 'הושלם';
      case 'pending':
        return 'ממתין';
      case 'cancelled':
        return 'בוטל';
      default:
        return 'בטיפול';
    }
  };

  const getTimeAgo = (date) => {
    const minutes = Math.floor((new Date() - new Date(date)) / 60000);
    if (minutes < 60) return `לפני ${minutes} דקות`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `לפני ${hours} שעות`;
    return `לפני ${Math.floor(hours / 24)} ימים`;
  };

  if (isLoading) {
    return <div className="animate-pulse space-y-4">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="bg-gray-50 p-4 rounded-lg">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-3 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="flex gap-2">
            <div className="h-3 bg-gray-200 rounded w-16"></div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
      ))}
    </div>;
  }

  return (
    <div className="space-y-4" dir="rtl">
      {recentOrders.map((order) => (
        <Link
          key={order._id}
          href={`/dashboard/orders/${order._id}`}
          className="block bg-gray-50 p-4 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-bold">#{order._id.slice(-6)}</h3>
              <p className="text-gray-600">{order.customerInfo.fullName}</p>
              <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                <FiPackage />
                <span>{order.items.length} מוצרים</span>
                <span className="mx-2">•</span>
                <FiClock />
                <span>{getTimeAgo(order.createdAt)}</span>
              </div>
            </div>
            <div className="text-left">
              <div className="font-bold text-primary mb-2">
                ₪{order.total.toLocaleString()}
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                {getStatusText(order.status)}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
} 