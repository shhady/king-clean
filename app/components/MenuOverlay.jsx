'use client';
import { FiX, FiUser } from 'react-icons/fi';
import Link from 'next/link';
import { useUser } from '@clerk/nextjs';

export default function MenuOverlay({ isOpen, onClose }) {
  const { user } = useUser();
  const menuItems = [
    { href: '/', label: 'דף הבית' },
    { href: '/shop', label: 'חנות' },
    { href: '/about', label: 'אודות' },
    { href: '/contact', label: 'צור קשר' }
  ];
 
  if (!isOpen) return null;

  return (
    <div onClick={onClose} className={`fixed inset-0 bg-black bg-opacity-50 z-50 transition-opacity ${
      isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
    }`}>
      <div className="fixed inset-y-0 right-0 max-w-sm w-full bg-white shadow-xl" dir="rtl">
        <div className="p-6">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 text-gray-500 hover:text-gray-700"
          >
            <FiX className="w-6 h-6" />
          </button>

          {/* Navigation Links */}
          <nav className="space-y-4 mt-8">
            <Link
              href="/"
              className="block text-lg hover:bg-gray-100 px-3 py-3 rounded-lg"
              onClick={onClose}
            >
              דף הבית
            </Link>
            <Link
              href="/shop"
              className="block text-lg hover:bg-gray-100 px-3 py-3 rounded-lg"
              onClick={onClose}
            >
              חנות
            </Link>
            <Link
              href="/about"
              className="block text-lg hover:bg-gray-100 px-3 py-3 rounded-lg"
              onClick={onClose}
            >
              אודות
            </Link>
            <Link 
              href="/contact" 
              className="flex items-center gap-3 py-2 text-gray-700 hover:bg-gray-100 px-3 py-3 rounded-lg"
              onClick={onClose}
            >
              <span>צור קשר</span>
            </Link>
            <div className="mb-8 pt-8">
              <Link 
                href="/account" 
                className="flex items-center gap-3 py-2 text-gray-700 hover:bg-gray-100 px-3 py-3 rounded-lg"
                onClick={onClose}
              >
                <FiUser className="w-6 h-6" />
                <span>החשבון שלי</span>
              </Link>
            </div>
            {user?.publicMetadata?.role === 'admin' && (
              <Link 
                href="/dashboard"
                className="flex items-center gap-3 text-gray-700 hover:bg-gray-100 px-3 py-3 rounded-lg mt-4"
                onClick={onClose}
              >
                לוח בקרה
              </Link>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
} 