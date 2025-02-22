'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

const CartContext = createContext();

const CART_STORAGE_KEY = 'prague_cart';

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error parsing cart from localStorage:', error);
        localStorage.removeItem(CART_STORAGE_KEY);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    }
  }, [cartItems, isLoaded]);

  const addToCart = (product, quantity = 1) => {
    // Ensure product has stock information
    if (!product || typeof product.stock === 'undefined') {
      console.error('Invalid product data:', product);
      return;
    }

    const stock = Number(product.stock);
    if (isNaN(stock) || stock < 0) {
      console.error('Invalid stock value:', stock);
      return;
    }

    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item._id === product._id);
      
      if (existingItem) {
        if (existingItem.quantity >= stock) {
          toast.error(`عذراً، الكمية المتوفرة ${stock} فقط`);
          return prevItems;
        }
        return prevItems.map(item =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      // Add new item with all necessary data
      return [...prevItems, { ...product, quantity }];
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    
    setCartItems(prevItems => {
      const item = prevItems.find(item => item._id === productId);
      if (!item) return prevItems;

      const stock = Number(item.stock);
      if (isNaN(stock)) {
        console.error('Invalid stock value:', item);
        return prevItems;
      }

      if (quantity > stock) {
        toast.error(`عذراً، الكمية المتوفرة ${stock} فقط`);
        return prevItems;
      }

      return prevItems.map(cartItem =>
        cartItem._id === productId
          ? { ...cartItem, quantity }
          : cartItem
      );
    });
  };

  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item._id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
  };

  const getSubtotal = () => {
    return Math.floor(cartItems.reduce((total, item) => {
      const price = item.salePercentage > 0
        ? Math.floor(item.price * (1 - item.salePercentage / 100))
        : Math.floor(item.price);
      return total + (price * item.quantity);
    }, 0));
  };

  const getCartCount = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
  };

  // Only render children once initial cart is loaded
  if (!isLoaded) {
    return null;
  }

  const value = {
    cartItems,
    isCartOpen,
    setIsCartOpen,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getSubtotal,
    getCartCount
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
} 