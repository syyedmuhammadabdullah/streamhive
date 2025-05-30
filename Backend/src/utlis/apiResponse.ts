class ApiResponse<T> {
    data: T;
    message: string;
    statusCode: number;
    pages?: number; // Optional property for pagination
    total?: number; // Optional property for total count of items
    /**
     * Custom response class for API responses.
     * @param {T} data - The data to be included in the response.
     * @param {string} message - A message associated with the response.
     * @param {number} statusCode - The HTTP status code for the response.
     */
    constructor(message: string,data: T,  statusCode: number, pages?: number, total?: number) {
        this.data = data; // Set the data for the response
        this.message = message; // Set the message for the response
        this.statusCode = statusCode; // Set the HTTP status code
        this.pages = pages; // Set the number of pages for pagination, if provided
        this.total = total; // Set the total count of items, if provided

        // Set the prototype explicitly to maintain the correct prototype chain
        Object.setPrototypeOf(this, ApiResponse.prototype);
    }
}
export default ApiResponse;