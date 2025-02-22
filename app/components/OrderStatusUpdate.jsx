'use client';
import { useState } from 'react';
import { FiPackage, FiX, FiCheckCircle } from 'react-icons/fi';
import { toast } from 'react-hot-toast';

export default function OrderStatusUpdate({ order, onStatusChange }) {
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/orders/${order._id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update status');
      }

      const updatedOrder = await response.json();
      onStatusChange(updatedOrder); // Callback to update parent state
      toast.success('סטטוס ההזמנה עודכן בהצלחה');
    } catch (error) {
      console.error('Error updating order status:', error);
      toast.error('עדכון סטטוס ההזמנה נכשל');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex gap-2">
      {order.status === 'pending' && (
        <>
          <button
            onClick={() => handleStatusChange('processing')}
            disabled={isUpdating}
            className="flex gap-1 items-center justify-center px-3 py-1 bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200 disabled:opacity-50 text-sm"
          >
            <FiPackage className="mr-1" />
            התחל טיפול
          </button>
          <button
            onClick={() => handleStatusChange('cancelled')}
            disabled={isUpdating}
            className="flex gap-1 items-center justify-center px-3 py-1 bg-red-100 text-red-800 rounded-md hover:bg-red-200 disabled:opacity-50 text-sm"
          >
            <FiX className="mr-1" />
            ביטול
          </button>
        </>
      )}
      {order.status === 'processing' && (
        <button
          onClick={() => handleStatusChange('completed')}
          disabled={isUpdating}
          className="flex gap-1 items-center justify-center px-3 py-1 bg-green-100 text-green-800 rounded-md hover:bg-green-200 disabled:opacity-50 text-sm"
        >
          <FiCheckCircle className="mr-1" />
          סיים
        </button>
      )}
    </div>
  );
} 