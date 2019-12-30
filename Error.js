class ResponseError extends Error {
  constructor(message, body) {
    super(message)

    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ResponseError)
    }

    this.name = 'ResponseError'
    this.body = body
  }
}

module.exports = {
  ResponseError
}
