'use client';
import { FiPackage, FiTruck, FiCheck, FiHome } from 'react-icons/fi';

export default function OrderDetails({ order }) {
  const getStatusSteps = () => {
    const steps = [
      { icon: FiCheck, label: 'تم تأكيد الطلب', description: 'تم استلام طلبك' },
      { icon: FiPackage, label: 'جاري المعالجة', description: 'يتم تجهيز طلبك' },
      { icon: FiTruck, label: 'تم الشحن', description: 'طلبك في الطريق' },
      { icon: FiHome, label: 'تم التوصيل', description: 'تم توصيل طلبك بنجاح' },
    ];

    const currentStepIndex = steps.findIndex((_, index) => {
      switch (order.status) {
        case 'processing':
          return index === 1;
        case 'completed':
          return index === 2;
        case 'delivered':
          return index === 3;
        default:
          return index === 0;
      }
    });

    return steps.map((step, index) => ({
      ...step,
      isCompleted: index <= currentStepIndex,
      isCurrent: index === currentStepIndex,
    }));
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-6">تفاصيل الطلب #{order.id}</h2>

      {/* Order Progress */}
      <div className="relative mb-12">
        <div className="absolute top-0 left-8 h-full w-0.5 bg-gray-200"></div>
        <div className="space-y-8 relative">
          {getStatusSteps().map((step, index) => (
            <div key={index} className="flex items-center gap-4">
              <div className={`w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 ${
                step.isCompleted ? 'bg-primary text-white' : 'bg-gray-200 text-gray-400'
              }`}>
                <step.icon className="text-2xl" />
              </div>
              <div>
                <h3 className={`font-bold ${step.isCompleted ? '' : 'text-gray-400'}`}>
                  {step.label}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Items */}
      <div className="space-y-4">
        <h3 className="font-bold">المنتجات</h3>
        {order.items.map((item, index) => (
          <div key={index} className="flex justify-between items-center py-2 border-b">
            <div>
              <h4 className="font-bold">{item.name}</h4>
              <p className="text-gray-600">الكمية: {item.quantity}</p>
            </div>
            <div className="text-primary font-bold">
              {item.price} شيكل
            </div>
          </div>
        ))}
      </div>

      {/* Order Summary */}
      <div className="mt-6 pt-6 border-t">
        <div className="flex justify-between items-center font-bold">
          <span>المجموع:</span>
          <span>{order.total.toLocaleString()} شيكل</span>
        </div>
      </div>
    </div>
  );
} 