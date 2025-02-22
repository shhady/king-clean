'use client';
import { FiMapPin, FiPhone, FiMail, FiClock } from 'react-icons/fi';

export default function ContactInfo() {
  return (
    <div className="space-y-8">
      <div>
        <h3 className="text-xl font-bold mb-4">معلومات التواصل</h3>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <FiMapPin className="text-primary text-xl" />
            <span>الرياض، المملكة العربية السعودية</span>
          </div>
          <div className="flex items-center gap-3">
            <FiPhone className="text-primary text-xl" />
            <span>+966 50 000 0000</span>
          </div>
          <div className="flex items-center gap-3">
            <FiMail className="text-primary text-xl" />
            <span>info@crystal-shop.com</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4">ساعات العمل</h3>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <FiClock className="text-primary text-xl" />
            <div>
              <p>الأحد - الخميس: 9:00 صباحاً - 11:00 مساءً</p>
              <p>الجمعة - السبت: 2:00 مساءً - 11:00 مساءً</p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-xl font-bold mb-4">تابعنا على</h3>
        <div className="flex gap-4">
          <a 
            href="https://twitter.com/crystalshop" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:text-primary-dark transition-colors"
          >
            <span className="text-2xl">𝕏</span>
          </a>
          <a 
            href="https://instagram.com/crystalshop" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:text-primary-dark transition-colors"
          >
            <span className="text-2xl">📸</span>
          </a>
          <a 
            href="https://snapchat.com/crystalshop" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary hover:text-primary-dark transition-colors"
          >
            <span className="text-2xl">👻</span>
          </a>
        </div>
      </div>
    </div>
  );
} 