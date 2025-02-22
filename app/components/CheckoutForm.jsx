'use client';
import { useState, useEffect } from 'react';
import { useUserDetails } from '../context/UserContext';
import { toast } from 'react-hot-toast';

const USER_DETAILS_STORAGE_KEY = 'prague_user_details';

export default function CheckoutForm({ onSubmit, isSubmitting }) {
  const { userDetails, isSignedIn } = useUserDetails();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: ''
  });

  // Load saved form data on mount
  useEffect(() => {
    // First try to get data from signed-in user
    if (isSignedIn && userDetails) {
      setFormData(prevData => ({
        ...prevData,
        fullName: userDetails.name || '',
        email: userDetails.email || '',
        phone: userDetails.phone || '',
        address: userDetails.address || '',
        city: userDetails.city || ''
      }));
    } else {
      // If no signed-in user, try to get from localStorage
      const savedDetails = localStorage.getItem(USER_DETAILS_STORAGE_KEY);
      if (savedDetails) {
        try {
          const parsedDetails = JSON.parse(savedDetails);
          setFormData(prevData => ({
            ...prevData,
            ...parsedDetails
          }));
        } catch (error) {
          console.error('Error parsing saved user details:', error);
          localStorage.removeItem(USER_DETAILS_STORAGE_KEY);
        }
      }
    }
  }, [isSignedIn, userDetails]);

  // Save form data to localStorage when it changes
  useEffect(() => {
    if (!isSignedIn) {
      localStorage.setItem(USER_DETAILS_STORAGE_KEY, JSON.stringify(formData));
    }
  }, [formData, isSignedIn]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.fullName || !formData.email || !formData.phone || !formData.address || !formData.city) {
      toast.error('يرجى تعبئة جميع الحقول المطلوبة');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('يرجى إدخال بريد إلكتروني صحيح');
      return;
    }

    // Phone validation (Palestinian format)
    const phoneRegex = /^(05[0-9]{8}|02[0-9]{7})$/;
    if (!phoneRegex.test(formData.phone)) {
      toast.error('يرجى إدخال رقم هاتف صحيح');
      return;
    }

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
          الاسم الكامل
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-ocean-500 focus:ring-ocean-500"
          required
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          البريد الإلكتروني *
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={isSignedIn}
          className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-ocean-500 focus:ring-ocean-500 ${
            isSignedIn ? 'bg-gray-100' : ''
          }`}
        />
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
          رقم الهاتف *
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-ocean-500 focus:ring-ocean-500"
        />
      </div>

      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          العنوان *
        </label>
        <input
          type="text"
          id="address"
          name="address"
          value={formData.address}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-ocean-500 focus:ring-ocean-500"
        />
      </div>

      <div>
        <label htmlFor="city" className="block text-sm font-medium text-gray-700">
          المدينة *
        </label>
        <input
          type="text"
          id="city"
          name="city"
          value={formData.city}
          onChange={handleChange}
          required
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-ocean-500 focus:ring-ocean-500"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-500 hover:bg-blue-500-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ocean-500 ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        {isSubmitting ? 'جارٍ إتمام الطلب...' : 'إتمام الطلب'}
      </button>
    </form>
  );
} 