// Create a production-ready logging solution
export const logger = {
  error: (err, context = {}) => {
    console.error({
      timestamp: new Date().toISOString(),
      error: err.message,
      stack: err.stack,
      ...context
    });
    // Add your production logging service here (e.g., Sentry, LogRocket)
  },
  info: (message, context = {}) => {
    if (process.env.NODE_ENV === 'production') {
      // Log to your production service
    }
  }
}; 