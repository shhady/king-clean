'use client';
import { forwardRef } from 'react';

const OrderPDF = forwardRef(({ order }, ref) => {
  return (
    <div ref={ref} className="bg-white p-8" style={{ direction: 'rtl' }}>
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
  );
});

OrderPDF.displayName = 'OrderPDF';

export default OrderPDF; 