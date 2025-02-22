'use client';
import { useEffect, useState } from 'react';

export default function SalesLayout({ children }) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="p-8 text-center">
        جاري التحميل...
      </div>
    );
  }

  return (
    <>
      <noscript>
        <div className="p-8 text-center">
          يجب تفعيل JavaScript لعرض هذه الصفحة
        </div>
      </noscript>
      {children}
    </>
  );
} 