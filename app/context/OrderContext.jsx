'use client';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const OrderContext = createContext();

export function OrderProvider({ children }) {
  const [isClient, setIsClient] = useState(false);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [orders, setOrders] = useState([]);

  // Handle hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  const updatePendingOrdersCount = useCallback(async () => {
    if (!isClient) return;
    try {
      const response = await fetch('/api/orders?status=pending');
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setPendingOrdersCount(data?.orders?.length || 0);
    } catch (error) {
      console.error('Error fetching pending orders:', error);
      setPendingOrdersCount(0);
    }
  }, [isClient]);

  const fetchOrders = useCallback(async () => {
    if (!isClient) return;
    try {
      const response = await fetch('/api/orders');
      if (!response.ok) throw new Error('Failed to fetch orders');
      const data = await response.json();
      setOrders(data.orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast.error('حدث خطأ أثناء تحميل الطلبات');
    }
  }, [isClient]);

  // Set up polling
  useEffect(() => {
    if (!isClient) return;

    // Initial fetch
    updatePendingOrdersCount();
    fetchOrders();

    // Poll every 30 seconds
    const interval = setInterval(() => {
      updatePendingOrdersCount();
      fetchOrders();
    }, 30000);

    return () => clearInterval(interval);
  }, [isClient, updatePendingOrdersCount, fetchOrders]);

  const value = {
    pendingOrdersCount: isClient ? pendingOrdersCount : 0,
    orders: isClient ? orders : [],
    updatePendingOrdersCount,
    fetchOrders
  };

  return (
    <OrderContext.Provider value={value}>
      {children}
    </OrderContext.Provider>
  );
}

export const useOrders = () => useContext(OrderContext); 