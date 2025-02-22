'use client';
import Link from 'next/link';
import { FiMail, FiPhone } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-400">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-right ">
          {/* אודות Column */}
          <div>
            <h3 className="text-lg font-bold mb-4">אודות</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/terms" className="text-gray-600 hover:text-blue-600 transition-colors">
                  תנאי שימוש באתר
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-600 hover:text-blue-600 transition-colors">
                  הצהרת נגישות
                </Link>
              </li>
              <li>
                <Link href="mailto:online@sano.co.il" className="text-gray-600 hover:text-blue-600 transition-colors">
                  online@sano.co.il
                </Link>
              </li>
              <li>
                <Link href="tel:5743" className="text-gray-600 hover:text-blue-600 transition-colors">
                  *5743
                </Link>
              </li>
            </ul>
          </div>

          {/* שירות לקוחות Column */}
          <div>
            <h3 className="text-lg font-bold mb-4">שירות לקוחות</h3>
            <ul className="space-y-3">
              {/* <li>
                <Link href="/tracking" className="text-gray-600 hover:text-blue-600 transition-colors">
                  מעקב
                </Link>
              </li> */}
              {/* <li>
                <Link href="/shipping" className="text-gray-600 hover:text-blue-600 transition-colors">
                  ביטולים
                </Link>
              </li> */}
              <li>
                <Link href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">
                  צור קשר
                </Link>
              </li>
              {/* <li>
                <Link href="/faq" className="text-gray-600 hover:text-blue-600 transition-colors">
                  מפת האתר
                </Link>
              </li> */}
              <li>
                <Link href="/returns" className="text-gray-600 hover:text-blue-600 transition-colors">
                  מדיניות פרטיות
                </Link>
              </li>
              {/* <li>
                <Link href="/returns" className="text-gray-600 hover:text-blue-600 transition-colors">
                  מדיניות החזרות/החלפות
                </Link>
              </li> */}
              {/* <li>
                <Link href="/returns" className="text-gray-600 hover:text-blue-600 transition-colors">
                  משלוחים
                </Link>
              </li> */}
            </ul>
          </div>

          {/* החשבון שלי Column */}
          <div>
            <h3 className="text-lg font-bold mb-4">החשבון שלי</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/account" className="text-gray-600 hover:text-blue-600 transition-colors">
                  החשבון שלי
                </Link>
              </li>
              {/* <li>
                <Link href="/history" className="text-gray-600 hover:text-blue-600 transition-colors">
                  היסטוריית הזמנות
                </Link>
              </li> */}
              <li>
                <Link href="/wishlist" className="text-gray-600 hover:text-blue-600 transition-colors">
                  רשימת מועדפים
                </Link>
              </li>
            </ul>
          </div>

          {/* קטגוריות מובילות Column */}
          {/* <div>
            <h3 className="text-lg font-bold mb-4">קטגוריות מובילות</h3>
            <ul className="space-y-3">
              <li>
                <Link href="/category/cleaning" className="text-gray-600 hover:text-blue-600 transition-colors">
                  אבקת כביסה
                </Link>
              </li>
              <li>
                <Link href="/category/laundry" className="text-gray-600 hover:text-blue-600 transition-colors">
                  מרכך כביסה
                </Link>
              </li>
              <li>
                <Link href="/category/dishes" className="text-gray-600 hover:text-blue-600 transition-colors">
                  חומרי ניקוי לבית
                </Link>
              </li>
            </ul>
          </div> */}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t py-4 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} King Clean. כל הזכויות שמורות
          </div>
        </div>
      </div>
    </footer>
  );
}
