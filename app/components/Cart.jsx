'use client';
import { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { FiX, FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

export default function Cart() {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    getSubtotal,
    isCartOpen,
    setIsCartOpen
  } = useCart();

  const handleIncrement = (item) => {
    const newQuantity = item.quantity + 1;
    if (typeof item.stock === 'undefined') {
      console.error('Stock is undefined for item:', item);
      return;
    }

    if (newQuantity <= item.stock) {
      updateQuantity(item._id, newQuantity);
    } else {
      toast.error(`נשארו ${item.stock} יחידות במלאי`);
    }
  };

  const handleDecrement = (item) => {
    const newQuantity = item.quantity - 1;
    if (newQuantity >= 1) {
      updateQuantity(item._id, newQuantity);
    }
  };

  return (
    <Transition.Root show={isCartOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={setIsCartOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-in-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in-out duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 left-0 flex max-w-full">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-300"
                enterFrom="-translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-300"
                leaveFrom="translate-x-0"
                leaveTo="-translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col bg-white shadow-xl">
                    {/* Header */}
                    <div className="flex justify-between items-center p-4 border-b">
                      <h2 className="text-lg font-semibold">עגלת קניות</h2>
                      <button
                        onClick={() => setIsCartOpen(false)}
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                      >
                        <FiX className="w-6 h-6" />
                      </button>
                    </div>

                    {/* Cart Items */}
                    <div className="flex-1 overflow-y-auto p-4">
                      {!cartItems || cartItems.length === 0 ? (
                        <div className="text-center py-8">
                          <p className="text-gray-500 mb-4">העגלה שלך ריקה</p>
                          <Link
                            href="/shop"
                            onClick={() => setIsCartOpen(false)}
                            className="text-blue-600 hover:text-blue-700 font-medium"
                          >
                            המשך בקניות
                          </Link>
                        </div>
                      ) : (
                        <ul className="space-y-4">
                          {cartItems.map((item) => {
                            if (!item || !item._id) return null;
                            
                            const itemPrice = item.salePercentage > 0
                              ? Math.floor(item.price * (1 - item.salePercentage / 100))
                              : Math.floor(item.price);
                            
                            const itemTotal = Math.floor(itemPrice * item.quantity);
                            
                            return (
                              <li key={`cart-item-${item._id}`} className="flex gap-4 border rounded-lg p-3">
                                {/* Product Image */}
                                <div className="relative w-20 h-20 flex-shrink-0">
                                  {item.images && item.images[0] ? (
                                    <Image
                                      src={item.images[0]}
                                      alt={item.name}
                                      fill
                                      className="object-cover rounded-md"
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-gray-100 rounded-md flex items-center justify-center">
                                      <span className="text-gray-400">אין תמונה</span>
                                    </div>
                                  )}
                                </div>

                                {/* Product Info */}
                                <div className="flex-1">
                                  <h3 className="font-medium text-right">{item.name}</h3>
                                  <div className="flex justify-between items-center mt-2">
                                    <div className="flex items-center gap-2">
                                      <button
                                        onClick={() => handleDecrement(item)}
                                        disabled={item.quantity <= 1}
                                        className="p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                                      >
                                        <FiMinus className="w-4 h-4" />
                                      </button>
                                      <span className="w-8 text-center">{item.quantity}</span>
                                      <button
                                        onClick={() => handleIncrement(item)}
                                        disabled={item.quantity >= item.stock}
                                        className="p-1 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
                                      >
                                        <FiPlus className="w-4 h-4" />
                                      </button>
                                    </div>
                                    <div className="text-right">
                                      <p className="font-medium text-blue-600">
                                        ₪{itemTotal}
                                      </p>
                                      <p className="text-sm text-gray-500">
                                        {item.unitAmount} {item.unit}
                                      </p>
                                    </div>
                                  </div>
                                </div>

                                {/* Remove Button */}
                                <button
                                  onClick={() => removeFromCart(item._id)}
                                  className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                >
                                  <FiTrash2 className="w-5 h-5" />
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </div>

                    {/* Footer */}
                    {cartItems && cartItems.length > 0 && (
                      <div className="border-t p-4 space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">סה"כ:</span>
                          <span className="text-xl font-bold text-blue-600">
                            ₪{Math.floor(getSubtotal())}
                          </span>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => {
                              cartItems.forEach(item => removeFromCart(item._id));
                              toast.success('העגלה רוקנה בהצלחה');
                            }}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            רוקן עגלה
                          </button>
                          <Link
                            href="/checkout"
                            onClick={() => setIsCartOpen(false)}
                            className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-center"
                          >
                            לתשלום
                          </Link>
                        </div>
                      </div>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
} 