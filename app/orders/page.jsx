'use client';
import { useState } from 'react';
import { FiPackage, FiSearch, FiChevronRight } from 'react-icons/fi';
import Link from 'next/link';

// This would normally come from an API
const mockOrders = [
  {
    id: 'ORD1234567890',
    date: '2024-03-15',
    status: 'delivered',
    total: 1850,
    items: [
      { name: 'طقم كريستال فاخر', quantity: 1, price: '1,200' },
      { name: 'حجر جارنت أحمر ملكي', quantity: 1, price: '650' },
    ]
  },
  {
    id: 'ORD9876543210',
    date: '2024-03-10',
    status: 'processing',
    total: 2400,
    items: [
      { name: 'ثريا كريستال كلاسيك', quantity: 1, price: '2,400' }
    ]
  }
];

export default function Orders() {
  const [searchQuery, setSearchQuery] = useState('');
  const [orders, setOrders] = useState(mockOrders);

  const getStatusText = (status) => {
    switch (status) {
      case 'delivered':
        return 'تم التوصيل';
      case 'processing':
        return 'قيد المعالجة';
      case 'shipped':
        return 'تم الشحن';
      default:
        return 'قيد المعالجة';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">طلباتي</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="البحث برقم الطلب..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 p-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        {/* Orders List */}
        {orders.length === 0 ? (
          <div className="text-center py-16">
            <FiPackage className="text-6xl text-gray-300 mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">لا توجد طلبات</h2>
            <p className="text-gray-600 mb-8">لم تقم بأي طلبات حتى الآن</p>
            <Link
              href="/shop"
              className="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-dark transition-colors"
            >
              تصفح المنتجات
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="block bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="font-bold mb-1">طلب #{order.id}</h3>
                    <p className="text-gray-600 text-sm">
                      {new Date(order.date).toLocaleDateString('ar-SA')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </span>
                    <FiChevronRight className="text-gray-400" />
                  </div>
                </div>
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center">
                    <div className="text-gray-600">
                      {order.items.length} {order.items.length === 1 ? 'منتج' : 'منتجات'}
                    </div>
                    <div className="font-bold">
                      {order.total.toLocaleString()} شيكل
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 