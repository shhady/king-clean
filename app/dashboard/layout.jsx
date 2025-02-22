'use client';
import { useEffect, useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import DashboardSidebar from '@/app/components/DashboardSidebar';

export default function DashboardLayout({ children }) {
  const [isClient, setIsClient] = useState(false);
  const { user, isLoaded } = useUser();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isLoaded && (!user || user?.publicMetadata?.role !== 'admin')) {
      router.push('/');
    }
  }, [isLoaded, user, router]);

  if (!isClient || !isLoaded || !user || user?.publicMetadata?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      <DashboardSidebar />
      <main className="flex-1 p-4 lg:p-8 mt-20">
        {children}
      </main>
    </div>
  );
} 