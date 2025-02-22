'use client';
import { useState } from 'react';
import { FiLock, FiCreditCard, FiCalendar, FiShield } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { useCart } from '../context/CartContext';

export default function PaymentForm({ onBack, shippingData }) {
  const router = useRouter();
  const { clearCart } = useCart();
  const [paymentData, setPaymentData] = useState({
    cardNumber: '',
    cardName: '',
    expiry: '',
    cvv: '',
  });
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // Here you would typically:
      // 1. Validate the card
      // 2. Process payment with a payment gateway
      // 3. Create order in your database
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call

      // Generate order number
      const orderNumber = `ORD${Date.now()}`;
      
      // Clear cart and redirect to confirmation
      clearCart();
      router.push(`/checkout/confirmation?order=${orderNumber}`);
    } catch (error) {
      console.error('Payment error:', error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">معلومات الدفع</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-700 mb-2">رقم البطاقة</label>
          <div className="relative">
            <input
              type="text"
              value={paymentData.cardNumber}
              onChange={e => setPaymentData({ ...paymentData, cardNumber: e.target.value })}
              className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
              placeholder="0000 0000 0000 0000"
              required
              maxLength="19"
            />
            <FiCreditCard className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
        </div>

        <div>
          <label className="block text-gray-700 mb-2">اسم حامل البطاقة</label>
          <input
            type="text"
            value={paymentData.cardName}
            onChange={e => setPaymentData({ ...paymentData, cardName: e.target.value })}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 mb-2">تاريخ الانتهاء</label>
            <div className="relative">
              <input
                type="text"
                value={paymentData.expiry}
                onChange={e => setPaymentData({ ...paymentData, expiry: e.target.value })}
                className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                placeholder="MM/YY"
                required
                maxLength="5"
              />
              <FiCalendar className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
          <div>
            <label className="block text-gray-700 mb-2">رمز الأمان</label>
            <div className="relative">
              <input
                type="text"
                value={paymentData.cvv}
                onChange={e => setPaymentData({ ...paymentData, cvv: e.target.value })}
                className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:border-primary"
                placeholder="CVV"
                required
                maxLength="4"
              />
              <FiShield className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="flex gap-4 mt-8">
          <button
            type="button"
            onClick={onBack}
            className="flex-1 border border-primary text-primary px-8 py-3 rounded-lg hover:bg-primary/5 transition-colors"
            disabled={isProcessing}
          >
            رجوع
          </button>
          <button
            type="submit"
            className="flex-1 bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            disabled={isProcessing}
          >
            <FiLock />
            {isProcessing ? 'جاري المعالجة...' : 'إتمام الطلب'}
          </button>
        </div>
      </form>
    </div>
  );
} 