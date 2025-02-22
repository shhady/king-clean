'use client';
import { useState } from 'react';
import { FaCreditCard, FaMoneyBill } from 'react-icons/fa';

export default function PaymentMethodSelector({ selected, onSelect, onPaymentInfoChange }) {
  const [creditCard, setCreditCard] = useState('');
  const [expiryDate, setExpiryDate] = useState('');

  const handleMethodChange = (method) => {
    onSelect(method);
    if (method === 'cash') {
      onPaymentInfoChange(null);
    }
  };

  const handleCardInfoChange = () => {
    if (creditCard && expiryDate) {
      onPaymentInfoChange({
        creditCard,
        expiryDate
      });
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">طريقة الدفع</h2>
      
      <div className="space-y-2">
        <label className="flex items-center space-x-reverse space-x-2 cursor-pointer">
          <input
            type="radio"
            name="paymentMethod"
            value="cash"
            checked={selected === 'cash'}
            onChange={() => handleMethodChange('cash')}
            className="form-radio text-ocean-500"
          />
          <FaMoneyBill className="text-gray-600" />
          <span>الدفع عند الاستلام</span>
        </label>

        <label className="flex items-center space-x-reverse space-x-2 cursor-pointer">
          <input
            type="radio"
            name="paymentMethod"
            value="card"
            checked={selected === 'card'}
            onChange={() => handleMethodChange('card')}
            className="form-radio text-ocean-500"
          />
          <FaCreditCard className="text-gray-600" />
          <span>بطاقة ائتمان</span>
        </label>
      </div>

      {selected === 'card' && (
        <div className="space-y-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              رقم البطاقة
            </label>
            <input
              type="text"
              value={creditCard}
              onChange={(e) => {
                setCreditCard(e.target.value);
                handleCardInfoChange();
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-ocean-500 focus:ring-ocean-500"
              placeholder="**** **** **** ****"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              تاريخ الانتهاء
            </label>
            <input
              type="text"
              value={expiryDate}
              onChange={(e) => {
                setExpiryDate(e.target.value);
                handleCardInfoChange();
              }}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-ocean-500 focus:ring-ocean-500"
              placeholder="MM/YY"
            />
          </div>
        </div>
      )}
    </div>
  );
} 