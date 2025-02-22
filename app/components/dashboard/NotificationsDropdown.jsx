'use client';
import { useState } from 'react';
import { FiBell, FiX } from 'react-icons/fi';

const notifications = [
  {
    id: 1,
    title: 'طلب جديد',
    message: 'تم استلام طلب جديد #ORD123456',
    time: '5 دقائق',
    type: 'order'
  },
  {
    id: 2,
    title: 'منتج نفذ من المخزون',
    message: 'طقم كريستال فاخر نفذ من المخزون',
    time: '30 دقيقة',
    type: 'inventory'
  },
  {
    id: 3,
    title: 'مراجعة جديدة',
    message: 'تم إضافة مراجعة جديدة على حجر جارنت',
    time: '1 ساعة',
    type: 'review'
  }
];

export default function NotificationsDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(notifications.length);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 hover:bg-gray-100 rounded-full relative"
      >
        <FiBell className="text-xl" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-red-500 text-white w-5 h-5 rounded-full flex items-center justify-center text-xs">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute left-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-50">
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <h3 className="font-bold">الإشعارات</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <FiX />
              </button>
            </div>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className="p-4 border-b hover:bg-gray-50 cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold">{notification.title}</h4>
                    <p className="text-gray-600 text-sm">{notification.message}</p>
                  </div>
                  <span className="text-xs text-gray-500">{notification.time}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 text-center">
            <button
              onClick={() => setUnreadCount(0)}
              className="text-primary hover:underline"
            >
              تحديد الكل كمقروء
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 