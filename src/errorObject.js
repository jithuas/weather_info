/**
 * Error object to send error code
 */
class APIError {
    constructor(code, message) {
        this.code = code
        this.message = message
    }
}

/**
 * Export class
 */
module.exports = APIError