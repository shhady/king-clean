'use client';
import { useSearchParams } from 'next/navigation';
import { FiCheck, FiPackage, FiTruck, FiHome } from 'react-icons/fi';
import Link from 'next/link';

export default function OrderConfirmation() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams?.get('order') || '';

  if (!orderNumber) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">لم يتم العثور على الطلب</h1>
          <Link 
            href="/shop"
            className="text-primary hover:text-primary-dark"
          >
            العودة للتسوق
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <FiCheck className="text-4xl text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-4">تم تأكيد طلبك بنجاح</h1>
          <p className="text-gray-600 mb-2">شكراً لك على طلبك</p>
          <p className="text-gray-600">رقم الطلب: {orderNumber}</p>
        </div>

        {/* Order Status */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-bold mb-6">حالة الطلب</h2>
          <div className="relative">
            <div className="absolute top-0 left-8 h-full w-0.5 bg-gray-200"></div>
            <div className="space-y-8 relative">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary text-white rounded-full flex items-center justify-center flex-shrink-0">
                  <FiCheck className="text-2xl" />
                </div>
                <div>
                  <h3 className="font-bold">تم تأكيد الطلب</h3>
                  <p className="text-gray-600">تم استلام طلبك وجاري تجهيزه</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <FiPackage className="text-2xl" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-400">جاري المعالجة</h3>
                  <p className="text-gray-600">سيتم تجهيز طلبك قريباً</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <FiTruck className="text-2xl" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-400">في الطريق</h3>
                  <p className="text-gray-600">سيتم توصيل طلبك قريباً</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gray-200 text-gray-400 rounded-full flex items-center justify-center flex-shrink-0">
                  <FiHome className="text-2xl" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-400">تم التوصيل</h3>
                  <p className="text-gray-600">تم توصيل طلبك بنجاح</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <Link 
            href="/shop"
            className="flex-1 text-center bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-dark transition-colors"
          >
            العودة للتسوق
          </Link>
          <Link 
            href={`/orders/${orderNumber}`}
            className="flex-1 text-center border border-primary text-primary px-8 py-3 rounded-lg hover:bg-primary/5 transition-colors"
          >
            تتبع الطلب
          </Link>
        </div>
      </div>
    </div>
  );
} 