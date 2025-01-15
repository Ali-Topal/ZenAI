function errorHandler(err, req, res, next) {
    console.error(err.stack);
    
    // Default error message
    let message = 'Internal Server Error';
    let statusCode = 500;

    // Handle specific error types
    if (err.name === 'ValidationError') {
        message = err.message;
        statusCode = 400;
    } else if (err.name === 'UnauthorizedError') {
        message = 'Unauthorized';
        statusCode = 401;
    }

    // Send error response
    res.status(statusCode).json({
        status: 'error',
        message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
}

module.exports = {
    errorHandler
}; 