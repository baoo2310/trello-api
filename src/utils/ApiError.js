class ApiError extends Error {
    constructor(statusCode, message) {
        super(message);
        this.name = 'ApiError';
        this.statusCode = statusCode;
        // Capture stack trace
        Error.captureStackTrace(this, this.constructor)
    }
}

export default ApiError;
