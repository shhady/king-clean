'use client';
import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { 
  FiPackage, 
  FiClock, 
  FiUser, 
  FiPhone, 
  FiMail, 
  FiMapPin,
  FiCheck,
  FiX,
  FiTruck,
  FiCheckCircle,
  FiPrinter
} from 'react-icons/fi';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import OrderStatusUpdate from '@/app/components/OrderStatusUpdate';

export default function OrderDetailsPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const printRef = useRef(null);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/orders/${id}`);
      if (!response.ok) throw new Error('Failed to fetch order details');
      const data = await response.json();
      setOrder(data.order);
    } catch (error) {
      console.error('Error:', error);
      toast.error('אירעה שגיאה בטעינת פרטי ההזמנה');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = async () => {
    try {
      const content = printRef.current;
      if (!content) {
        throw new Error('Print content not found');
      }

      // Store the original body content
      const originalContent = document.body.innerHTML;

      // Replace body content with print content
      document.body.innerHTML = content.innerHTML;

      // Print
      window.print();

      // Restore original content
      document.body.innerHTML = originalContent;

      toast.success('מסמך נשלח להדפסה');
    } catch (error) {
      console.error('Error printing:', error);
      toast.error('אירעה שגיאה בהדפסה');
    }
  };
  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/orders/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      // Get the updated order data
      const updatedOrder = await response.json();
      setOrder(updatedOrder); // Update local state with new order data
      toast.success('סטטוס ההזמנה עודכן בהצלחה');
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('עדכון סטטוס ההזמנה נכשל');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-yellow-100 text-yellow-800';
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
      case 'delivered':
        return 'נמסר';
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

  const getTimelineSteps = () => {
    const defaultSteps = [
      { status: 'pending', label: 'התקבלה הזמנה', icon: FiPackage },
      { status: 'processing', label: 'בטיפול', icon: FiClock },
      { status: 'completed', label: 'ההזמנה הושלמה', icon: FiCheckCircle },
    ];

    if (order.status === 'cancelled') {
      return [
        { status: 'pending', label: 'התקבלה הזמנה', icon: FiPackage },
        { status: 'cancelled', label: 'ההזמנה בוטלה', icon: FiX },
      ];
    }

    return defaultSteps;
  };

  // First, let's define the order of statuses
  const statusOrder = ['pending', 'processing', 'completed'];

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 animate-pulse">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-center text-gray-500">לא נמצאה הזמנה</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        {/* Order Header */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
          >
            <FiPrinter className="w-4 h-4" />
            הדפס הזמנה
          </button>
        </div>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold mb-2">הזמנה מספר #{order._id.slice(-6)}</h1>
            <p className="text-gray-600">
              <FiClock className="inline-block mr-1" />
              {new Date(order.createdAt).toLocaleDateString('he-IL', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm ${getStatusColor(order.status)}`}>
            {getStatusText(order.status)}
          </span>
        </div>

        {/* Customer Information */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">פרטי לקוח</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center">
              <FiUser className="text-gray-400 mr-2" />
              <span>{order.customerInfo.fullName}</span>
            </div>
            <div className="flex items-center">
              <FiPhone className="text-gray-400 mr-2" />
              <span>{order.customerInfo.phone}</span>
            </div>
            <div className="flex items-center">
              <FiMail className="text-gray-400 mr-2" />
              <span>{order.customerInfo.email}</span>
            </div>
            <div className="flex items-center">
              <FiMapPin className="text-gray-400 mr-2" />
              <span>{order.customerInfo.address}, {order.customerInfo.city}</span>
            </div>
          </div>
        </div>

        {/* Order Timeline */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">סטטוס הזמנה</h2>
          <div className="relative">
            <div className="absolute top-0 left-8 h-full w-0.5 bg-gray-200"></div>
            <div className="relative lg:flex lg:flex-row lg:justify-between lg:items-center flex flex-col gap-2 justify-start items-start">
              {getTimelineSteps().map((step, index) => {
                const currentStatusIndex = statusOrder.indexOf(order.status);
                const stepIndex = statusOrder.indexOf(step.status);
                const isActive = stepIndex <= currentStatusIndex && order.status !== 'cancelled';
                
                const timelineEntry = order.timeline?.find(t => t.status === step.status);
                
                return (
                  <div key={step.status} className="flex items-center gap-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isActive ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'
                    }`}>
                      <step.icon className="text-2xl" />
                    </div>
                    <div>
                      <h3 className={`font-bold ${isActive ? '' : 'text-gray-400'}`}>
                        {step.label}
                      </h3>
                      {timelineEntry && (
                        <p className="text-sm text-gray-500">
                          {new Date(timelineEntry.date).toLocaleDateString('he-IL', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">מוצרים</h2>
          <div className="space-y-4">
            {order.items.map((item) => (
              <div key={item._id} className="flex items-center justify-between border-b pb-4">
                <div className="flex items-center">
                  <div className="relative w-16 h-16 mr-4">
                    <Image
                      src={item.image}
                      alt={item.nameHe || item.name}
                      fill
                      className="object-contain rounded-md"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium">{item.name}</h3>
                    <p className="text-sm text-gray-500">
                      {item.quantity} × {item.price} שקל
                    </p>
                  </div>
                </div>
                <div className="text-left">
                  <p className="font-bold">{(item.quantity * item.price).toLocaleString()} שקל</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="mb-8">
          {/* <h2 className="text-xl font-semibold mb-4">ملخص الطلب</h2> */}
          <div className="bg-gray-50 p-4 rounded-lg">
            {/* <div className="flex justify-between mb-2">
              <span>المجموع الفرعي</span>
              <span>{order.total.toLocaleString()} שקל</span>
            </div> */}
            <div className="flex justify-between font-bold text-lg">
              <span>סך הכל</span>
              <span>{order.total.toLocaleString()} שקל</span>
            </div>
          </div>

        </div>


        {/* Action Buttons */}
        <div className="mt-4">
          <OrderStatusUpdate 
            order={order} 
            onStatusChange={(updatedOrder) => {
              setOrder(updatedOrder);
            }} 
          />
        </div>

        {/* Hidden Print Content */}
        <div className="hidden">
          <div ref={printRef} className="p-8" style={{ direction: 'rtl' }}>
            {/* Header */}
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold">פרטי הזמנה #{order._id.slice(-6)}</h1>
              <p className="text-gray-600">
                {new Date(order.createdAt).toLocaleDateString('he-IL', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>

            {/* Customer Info */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">פרטי לקוח</h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p><strong>שם:</strong> {order.customerInfo.fullName}</p>
                  <p><strong>טלפון:</strong> {order.customerInfo.phone}</p>
                  <p><strong>אימייל:</strong> {order.customerInfo.email}</p>
                </div>
                <div>
                  <p><strong>כתובת:</strong> {order.customerInfo.address}</p>
                  <p><strong>עיר:</strong> {order.customerInfo.city}</p>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="mb-8">
              <h2 className="text-xl font-bold mb-4">פרטי הזמנה</h2>
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-right py-2">מוצר</th>
                    <th className="text-center py-2">כמות</th>
                    <th className="text-center py-2">מחיר ליחידה</th>
                    <th className="text-left py-2">סה"כ</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item) => (
                    <tr key={item._id} className="border-b">
                      <td className="py-2">{item.name}</td>
                      <td className="text-center py-2">{item.quantity}</td>
                      <td className="text-center py-2">₪{item.price}</td>
                      <td className="text-left py-2">₪{(item.quantity * item.price).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total */}
            <div className="text-left">
              <h2 className="text-xl font-bold mb-2">סיכום</h2>
              <p className="text-2xl font-bold">סה"כ לתשלום: ₪{order.total.toFixed(2)}</p>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-8 border-t text-center text-gray-500">
              <p>תודה שקנית ב-King Clean!</p>
              <p>לשאלות ובירורים: *5743</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 