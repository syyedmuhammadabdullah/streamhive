class ApiError<T> extends Error {
  statusCode: number;
    message: string;
    error?: T;
    /**
     * Custom error class for API errors.
     * @param {string} message - The error message.
     * @param {number} statusCode - The HTTP status code associated with the error.
     * @param {T} error - The error object containing additional error details.
     * @param {string} [stack] - Optional stack trace for the error.
     */

  constructor(message: string, statusCode: number,error?:T,stack?: string) {
    super(message);
    this.statusCode = statusCode;
    this.message = message; // Set the error message
    this.error= error; // Set the error object
    if (stack) {
      this.stack = stack; // Set the stack trace if provided
    }

    // Set the prototype explicitly to maintain the correct prototype chain
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

export default ApiError;