// Simple in-memory rate limiter
const rateLimit = new Map();

export function createRateLimiter() {
  const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
  const MAX_REQUESTS = 5; // Limit each IP to 5 requests per windowMs

  return {
    check: async (request) => {
      const ip = request.headers.get('x-forwarded-for') || 'unknown';
      const now = Date.now();
      const windowStart = now - WINDOW_MS;
      
      // Clean up old entries
      for (const [key, timestamp] of rateLimit.entries()) {
        if (timestamp < windowStart) {
          rateLimit.delete(key);
        }
      }
      
      // Count requests in current window
      const requestCount = Array.from(rateLimit.entries())
        .filter(([key, timestamp]) => key.startsWith(ip) && timestamp > windowStart)
        .length;
      
      if (requestCount >= MAX_REQUESTS) {
        return { success: false };
      }
      
      // Add current request
      rateLimit.set(`${ip}:${now}`, now);
      return { success: true };
    }
  };
} 