'use client';
import { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useUser } from '@clerk/nextjs';
import { toast } from 'react-hot-toast';

const UserContext = createContext();

export function UserProvider({ children }) {
  const { user: clerkUser, isLoaded: clerkLoaded, isSignedIn } = useUser();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserDetails = useCallback(async () => {
    if (!isSignedIn || !clerkUser || !clerkUser.primaryEmailAddress) {
      setUserDetails(null);
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: clerkUser.primaryEmailAddress.emailAddress,
          name: `${clerkUser.firstName || ''} ${clerkUser.lastName || ''}`.trim(),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to fetch user details');
      }

      const data = await response.json();
      setUserDetails(data);
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast.error('حدث خطأ أثناء تحميل بيانات المستخدم');
    } finally {
      setLoading(false);
    }
  }, [clerkUser, isSignedIn]);

  useEffect(() => {
    if (clerkLoaded && isSignedIn) {
      fetchUserDetails();
    } else if (clerkLoaded && !isSignedIn) {
      setUserDetails(null);
      setLoading(false);
    }
  }, [clerkLoaded, isSignedIn, fetchUserDetails]);

  const updateUserDetails = async (details) => {
    if (!isSignedIn) {
      toast.error('يجب تسجيل الدخول أولاً');
      throw new Error('User not authenticated');
    }

    try {
      const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to update user details');
      }

      const data = await response.json();
      setUserDetails(data);
      return data;
    } catch (error) {
      console.error('Error updating user details:', error);
      toast.error('حدث خطأ أثناء تحديث بيانات المستخدم');
      throw error;
    }
  };

  return (
    <UserContext.Provider value={{ 
      userDetails, 
      loading, 
      updateUserDetails,
      fetchUserDetails,
      isSignedIn 
    }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUserDetails = () => useContext(UserContext); 