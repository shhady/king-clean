'use client';
import { useState } from 'react';

export function useRetry(fetchFn, maxRetries = 3, delay = 1000) {
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  const executeWithRetry = async (...args) => {
    try {
      const result = await fetchFn(...args);
      setRetryCount(0);
      return result;
    } catch (error) {
      if (retryCount < maxRetries) {
        setIsRetrying(true);
        await new Promise(resolve => setTimeout(resolve, delay * (retryCount + 1)));
        setRetryCount(prev => prev + 1);
        setIsRetrying(false);
        return executeWithRetry(...args);
      }
      throw error;
    }
  };

  return { executeWithRetry, isRetrying, retryCount };
} 