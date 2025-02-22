'use client';
import { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const USER_DETAILS_STORAGE_KEY = 'prague_checkout_details';

const validatePhone = (phone) => {
  // Israeli phone number format
  const phoneRegex = /^(05[0-9]{8}|02[0-9]{7})$/;
  return phoneRegex.test(phone);
};

const validateExpiryDate = (date) => {
  // MM/YY format
  const dateRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
  if (!dateRegex.test(date)) return false;

  const [month, year] = date.split('/');
  const expiry = new Date(2000 + parseInt(year), parseInt(month) - 1);
  const today = new Date();
  
  return expiry > today;
};

export default function CheckoutPage() {
  const { cartItems, getSubtotal, clearCart } = useCart();
  const { user, isLoaded } = useUser();
  const [paymentMethod, setPaymentMethod] = useState('cash'); // 'cash' or 'card'
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    creditCard: '',
    expiryDate: '',
    cvv: ''
  });

  // Load saved form data on mount
  useEffect(() => {
    if (isLoaded) {
      if (user) {
        // First try to get data from signed-in user
        setFormData(prev => ({
          ...prev,
          fullName: user?.firstName + " " + user?.lastName || '',
          email: user?.primaryEmailAddress?.emailAddress || '',
        }));
        
        // Then fetch additional user details from API
        fetchUserDetails();
      } else {
        // If no signed-in user, try to get from localStorage
        const savedDetails = localStorage.getItem(USER_DETAILS_STORAGE_KEY);
        if (savedDetails) {
          try {
            const parsedDetails = JSON.parse(savedDetails);
            setFormData(prev => ({
              ...prev,
              ...parsedDetails
            }));
          } catch (error) {
            console.error('Error parsing saved user details:', error);
            localStorage.removeItem(USER_DETAILS_STORAGE_KEY);
          }
        }
      }
    }
  }, [user, isLoaded]);

  // Save form data to localStorage when it changes
  useEffect(() => {
    if (!user && isLoaded) {
      localStorage.setItem(USER_DETAILS_STORAGE_KEY, JSON.stringify({
        fullName: formData.fullName,
        phone: formData.phone,
        address: formData.address,
        city: formData.city
      }));
    }
  }, [formData, user, isLoaded]);

  const fetchUserDetails = async () => {
    try {
      const response = await fetch('/api/users');
      const userData = await response.json();
      if (userData.lastOrderDetails) {
        setFormData(prev => ({
          ...prev,
          phone: userData.lastOrderDetails.phone || '',
          address: userData.lastOrderDetails.address || '',
          city: userData.lastOrderDetails.city || ''
        }));
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const [isProcessing, setIsProcessing] = useState(false);
  const router = useRouter();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    switch (name) {
      case 'creditCard':
        const cleanedCard = value.replace(/\D/g, '');
        if (cleanedCard.length <= 16) {
          setFormData(prev => ({ ...prev, [name]: cleanedCard }));
        }
        break;

      case 'cvv':
        const cleanedCvv = value.replace(/\D/g, '');
        if (cleanedCvv.length <= 3) {
          setFormData(prev => ({ ...prev, [name]: cleanedCvv }));
        }
        break;

      case 'phone':
        const cleanedPhone = value.replace(/[^\d]/g, '');
        setFormData(prev => ({ ...prev, [name]: cleanedPhone }));
        break;

      case 'expiryDate':
        // Allow only MM/YY format
        const cleaned = value.replace(/[^\d/]/g, '');
        if (cleaned.length <= 5) {
          let formatted = cleaned;
          if (cleaned.length === 2 && !value.includes('/')) {
            formatted = cleaned + '/';
          }
          setFormData(prev => ({ ...prev, [name]: formatted }));
        }
        break;

      case 'email':
        setFormData(prev => ({ ...prev, email: value.toLowerCase() }));
        break;

      default:
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!cartItems.length) {
      toast.error('העגלה ריקה');
      return;
    }

    // Validate email
    if (!formData.email || !formData.email.includes('@')) {
      toast.error('כתובת אימייל לא תקינה');
      return;
    }

    if (!validatePhone(formData.phone)) {
      toast.error('מספר טלפון לא תקין');
      return;
    }

    // Validate card details only if payment method is card
    if (paymentMethod === 'card') {
      if (formData.creditCard.length !== 16) {
        toast.error('מספר כרטיס חייב להכיל 16 ספרות');
        return;
      }

      if (!validateExpiryDate(formData.expiryDate)) {
        toast.error('תאריך תפוגה לא תקין');
        return;
      }

      if (formData.cvv.length !== 3) {
        toast.error('קוד CVV חייב להכיל 3 ספרות');
        return;
      }
    }

    setIsProcessing(true);

    try {
      let customerId;
      let customerType;

      if (user) {
        // Handle registered user
        const userRes = await fetch('/api/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user.primaryEmailAddress?.emailAddress,
            lastOrderDetails: {
              fullName: formData.fullName,
              phone: formData.phone,
              address: formData.address,
              city: formData.city
            }
          })
        });
        const userData = await userRes.json();
        customerId = userData._id;
        customerType = 'user';
      } else {
        // Check if visitor exists
        const visitorRes = await fetch(`/api/visitors/check?email=${encodeURIComponent(formData.email)}`);
        const visitorData = await visitorRes.json();

        if (visitorData.visitor) {
          // Update existing visitor
          const updateRes = await fetch(`/api/visitors/${visitorData.visitor._id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              lastOrderDetails: {
                fullName: formData.fullName,
                phone: formData.phone,
                address: formData.address,
                city: formData.city
              }
            })
          });
          const updatedVisitor = await updateRes.json();
          customerId = updatedVisitor._id;
        } else {
          // Create new visitor
          const createRes = await fetch('/api/visitors', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              fullName: formData.fullName,
              email: formData.email.toLowerCase(),
              phone: formData.phone,
              address: formData.address,
              city: formData.city
            })
          });
          const newVisitor = await createRes.json();
          customerId = newVisitor._id;
        }
        customerType = 'visitor';
      }

      const orderData = {
        items: cartItems,
        total: getSubtotal(),
        customerInfo: {
          fullName: formData.fullName,
          email: formData.email.toLowerCase().trim(),
          phone: formData.phone,
          address: formData.address,
          city: formData.city
        },
        customerId,
        customerType,
        paymentMethod,
        ...(paymentMethod === 'card' && {
          paymentInfo: {
            creditCard: formData.creditCard,
            expiryDate: formData.expiryDate,
            cvv: formData.cvv
          }
        })
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      toast.success('ההזמנה נוצרה בהצלחה');
      clearCart();
      router.push(`/orders/${data.orderId}`);
    } catch (error) {
      console.error('Checkout error:', error);
      toast.error('אירעה שגיאה ביצירת ההזמנה');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">השלמת הזמנה</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Cart Summary */}
        <div className="bg-gray-50 p-6 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">סיכום הזמנה</h2>
          <div className="space-y-4">
            {cartItems.map(item => (
              <div key={item._id} className="flex items-center gap-4">
                <div className="relative w-20 h-20">
                  {item.images && item.images[0] ? (
                    <Image
                      src={item.images[0]}
                      alt={item.name}
                      fill
                      className="object-cover rounded"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 rounded flex items-center justify-center">
                      <span className="text-gray-400">אין תמונה</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-gray-600">
                    ₪{item.salePercentage > 0 
                      ? Math.floor(item.price * (1 - item.salePercentage / 100))
                      : Math.floor(item.price)} × {item.quantity}
                  </p>
                </div>
                <p className="font-medium">
                  ₪{Math.floor((item.salePercentage > 0 
                    ? item.price * (1 - item.salePercentage / 100)
                    : item.price) * item.quantity)}
                </p>
              </div>
            ))}
            <div className="border-t pt-4 mt-4">
              <div className="flex justify-between font-bold">
                <span>סה"כ</span>
                <span>₪{Math.floor(getSubtotal())}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Checkout Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Information */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">פרטי לקוח</h2>
            <div>
              <label className="block text-sm font-medium mb-2">שם מלא</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName || ''}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">אימייל</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={!!user}
                className={`w-full p-2 border rounded-md ${user ? 'bg-gray-100' : ''}`}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">טלפון</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">כתובת</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded-md"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">עיר</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
                className="w-full p-2 border rounded-md"
              />
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">אמצעי תשלום</h2>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cash"
                  checked={paymentMethod === 'cash'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="ml-2"
                />
                <span>תשלום במזומן בעת המסירה</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="paymentMethod"
                  value="card"
                  checked={paymentMethod === 'card'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className="ml-2"
                />
                <span>כרטיס אשראי</span>
              </label>
            </div>
          </div>

          {/* Credit Card Information */}
          {paymentMethod === 'card' && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">פרטי כרטיס אשראי</h2>
              <div>
                <label className="block text-sm font-medium mb-2">מספר כרטיס</label>
                <input
                  type="text"
                  name="creditCard"
                  value={formData.creditCard}
                  onChange={handleInputChange}
                  required
                  maxLength="16"
                  placeholder="1234 5678 9012 3456"
                  className="w-full p-2 border rounded-md"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">תוקף</label>
                  <input
                    type="text"
                    name="expiryDate"
                    value={formData.expiryDate}
                    onChange={handleInputChange}
                    required
                    placeholder="MM/YY"
                    className="w-full p-2 border rounded-md"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">CVV</label>
                  <input
                    type="text"
                    name="cvv"
                    value={formData.cvv}
                    onChange={handleInputChange}
                    required
                    maxLength="3"
                    placeholder="123"
                    className="w-full p-2 border rounded-md"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isProcessing}
            className="w-full bg-blue-500 text-white py-3 rounded-md hover:opacity-90 disabled:opacity-50"
          >
            {isProcessing ? 'מעבד...' : 'סיום הזמנה'}
          </button>
        </form>
      </div>
    </div>
  );
} 