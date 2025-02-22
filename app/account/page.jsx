'use client';
import { useState, useEffect } from 'react';
import { useAuth, useUser } from '@clerk/nextjs';
import { FiPackage, FiClock, FiCheckCircle, FiX } from 'react-icons/fi';
import Image from 'next/image';
import Link from 'next/link';

const statusMap = {
  pending: { text: 'ממתין', color: 'bg-yellow-100 text-yellow-800', icon: FiClock },
  processing: { text: 'בטיפול', color: 'bg-blue-100 text-blue-800', icon: FiPackage },
  completed: { text: 'הושלם', color: 'bg-green-100 text-green-800', icon: FiCheckCircle },
  cancelled: { text: 'בוטל', color: 'bg-red-100 text-red-800', icon: FiX }
};

export default function AccountPage() {
  const { isSignedIn } = useAuth();
  const { user, isLoaded } = useUser();
  const [email, setEmail] = useState('');
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(true);

  useEffect(() => {
    if (isLoaded) {
      if (isSignedIn && user?.primaryEmailAddress?.emailAddress) {
        fetchOrders(user.primaryEmailAddress.emailAddress);
        setShowEmailForm(false);
      } else {
        setLoading(false);
      }
    }
  }, [isSignedIn, user, isLoaded]);

  const fetchOrders = async (emailToFetch) => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`/api/userOrders?email=${emailToFetch}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch orders');
      }

      if (data.user) {
        setOrders(data.user.orders || []);
      } else if (data.visitor) {
        setOrders(data.visitor.orders || []);
      } else {
        setOrders([]);
      }
      
      setShowEmailForm(false);
    } catch (error) {
      setError('אירעה שגיאה בטעינת ההזמנות');
      console.error('Error fetching orders:', error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('נא להזין כתובת דואר אלקטרוני');
      return;
    }
    await fetchOrders(email);
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8" dir="rtl">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-gray-100 p-4 rounded-lg">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (showEmailForm) {
    return (
      <div className="container mx-auto px-4 py-8" dir="rtl">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold mb-6 text-center">מעקב הזמנות</h1>
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-gray-700 mb-2">
                דואר אלקטרוני
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="הזן את כתובת הדואר האלקטרוני שלך"
                dir="ltr"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-primary-dark transition-colors"
            >
              הצג הזמנות
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8" dir="rtl">
      <h1 className="text-2xl font-bold mb-6">ההזמנות שלי</h1>
      
      {error && (
        <div className="bg-red-100 text-red-700 p-4 rounded-lg mb-6">
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500 mb-4">אין לך הזמנות קודמות</p>
          <Link 
            href="/" 
            className="inline-block bg-primary text-white px-6 py-2 rounded-md hover:bg-primary-dark"
          >
            לצפייה במוצרים
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {orders.map((order) => {
            const status = statusMap[order.status];
            const StatusIcon = status.icon;
            
            return (
              <div key={order._id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="font-semibold">#{order._id.slice(-6)}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('he-IL')}
                    </p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 ${status.color}`}>
                    <StatusIcon className="w-4 h-4" />
                    {status.text}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  {order.items.map((item) => (
                    <div key={`${order._id}-${item._id}`} className="flex items-center gap-2">
                      <div className="relative w-12 h-12 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">
                          {item.quantity} × ₪{Math.floor(item.price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between text-sm">
                    <span>סה"כ:</span>
                    <span className="font-bold">₪{Math.floor(order.total)}</span>
                  </div>
                </div>

                <Link
                  href={`/orders/${order._id}`}
                  className="mt-4 block text-center text-primary hover:underline"
                >
                  צפה בפרטים
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
} 