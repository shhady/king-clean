'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useOrders } from '@/app/context/OrderContext';
import { 
  FiHome, 
  FiBox, 
  FiGrid, 
  FiShoppingBag, 
  FiUsers, 
  FiSettings,
  FiBarChart2,
  FiMenu,
  FiX
} from 'react-icons/fi';

export default function DashboardSidebar() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { pendingOrdersCount } = useOrders();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const menuItems = [
    {
      href: '/dashboard',
      label: 'לוח בקרה',
      icon: FiHome,
    },
    {
      href: '/dashboard/products',
      label: 'מוצרים',
      icon: FiBox,
    },
    {
      href: '/dashboard/categories',
      label: 'קטגוריות',
      icon: FiGrid,
    },
    {
      href: '/dashboard/orders',
      label: 'הזמנות',
      icon: FiShoppingBag,
      notification: pendingOrdersCount
    },
    {
      href: '/dashboard/sales',
      label: 'מכירות',
      icon: FiBarChart2,
    },
    {
      href: '/dashboard/customers',
      label: 'לקוחות',
      icon: FiUsers,
    },
    // {
    //   href: '/dashboard/settings',
    //   label: 'הגדרות',
    //   icon: FiSettings,
    // },
  ];

  if (!mounted) {
    return null;
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`lg:hidden fixed top-26 ${isOpen ? 'left-4' : 'right-4'} z-45 bg-blue-500 text-white p-2 rounded-md`}
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          bg-white shadow-md h-screen 
          lg:w-64 lg:sticky lg:top-24 lg:block
          fixed top-24 right-0 w-64 z-40
          transition-transform duration-300
          ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        `}
      >
        <div className="p-4">
          <h2 className="text-xl font-bold text-gray-800 mb-6">לוח בקרה</h2>
          <nav className="space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`flex items-center p-2 rounded-lg transition-colors ${
                  pathname === item.href
                    ? 'bg-blue-500 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <div className="relative">
                  <item.icon className="w-5 h-5" />
                  {mounted && item.notification > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {item.notification}
                    </span>
                  )}
                </div>
                <span className="mr-2">{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      </aside>
    </>
  );
} 