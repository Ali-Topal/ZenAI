// Custom error handling middleware
export const errorHandler = (err, req, res, next) => {
  const timestamp = new Date().toISOString();
  
  // Log the error with timestamp and details
  console.error(`[${timestamp}] Error occurred:`);
  console.error('Stack:', err.stack);
  
  if (err.response?.data) {
    console.error('API Response Data:', err.response.data);
  }
  
  // Check for specific error types
  if (err.code === 'EADDRINUSE') {
    console.error(`[${timestamp}] Port ${err.port} is already in use`);
    console.error('Try using a different port with:');
    console.error(`vercel dev -l ${err.port + 1}`);
  }
  
  // Send error response
  res.status(err.status || 500).json({
    status: 'error',
    timestamp,
    message: process.env.NODE_ENV === 'development' 
      ? err.message 
      : 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && {
      stack: err.stack,
      details: err.response?.data
    })
  });
}; 