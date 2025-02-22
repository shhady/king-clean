'use client';
import { useEffect, useState } from 'react';
import { use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

const statusMap = {
  pending: { text: 'ממתין', color: 'bg-yellow-100 text-yellow-800' },
  processing: { text: 'בטיפול', color: 'bg-blue-100 text-blue-800' },
  completed: { text: 'הושלם', color: 'bg-green-100 text-green-800' },
  cancelled: { text: 'בוטל', color: 'bg-red-100 text-red-800' }
};

export default function OrderConfirmationPage({ params }) {
  const { id } = use(params);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchOrder(id);
    }
  }, [id]);

  const fetchOrder = async (orderId) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/orders/${orderId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch order');
      }
      const data = await response.json();
      setOrder(data.order);
    } catch (error) {
      console.error('Error fetching order:', error);
      toast.error('אירעה שגיאה בטעינת ההזמנה');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8 text-center" dir="rtl">טוען...</div>;
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8 text-center" dir="rtl">
        <p className="text-red-500 mb-4">ההזמנה לא נמצאה</p>
        <Link href="/" className="text-primary hover:underline">
          חזרה לדף הבית
        </Link>
      </div>
    );
  }

  const status = statusMap[order.status] || statusMap.pending;

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">אישור הזמנה</h1>
            <span className={`px-3 py-1 rounded-full text-sm ${status.color}`}>
              {status.text}
            </span>
          </div>

          <div className="border-t border-b py-4 mb-4">
            <h2 className="font-semibold mb-2">פרטי לקוח</h2>
            <p key="customer-name">שם: {order?.customerInfo?.fullName}</p>
            <p key="customer-phone">טלפון: {order?.customerInfo?.phone}</p>
            <p key="customer-address">כתובת: {order?.customerInfo?.address}</p>
            <p key="customer-city">עיר: {order?.customerInfo?.city}</p>
            <p key="payment-method">אמצעי תשלום: {order?.paymentMethod === 'cash' ? 'מזומן בעת המסירה' : 'כרטיס אשראי'}</p>
          </div>

          <div className="mb-6">
            <h2 className="font-semibold mb-4">מוצרים</h2>
            <div className="space-y-4">
              {order?.items?.map((item) => (
                <div key={item._id} className="flex items-center gap-4">
                  <div className="relative w-20 h-20">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-gray-600">
                      ₪{Math.floor(item.price)} × {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium">₪{Math.floor(item.price * item.quantity)}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between text-lg font-bold">
              <span>סה"כ</span>
              <span>₪{Math.floor(order.total)}</span>
            </div>
          </div>

          <div className="mt-8 text-center">
            <Link 
              href="/shop" 
              className="inline-block bg-blue-500 text-white px-6 py-2 rounded-md hover:opacity-90"
            >
              המשך לקנות
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 