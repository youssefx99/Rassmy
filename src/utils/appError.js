class AppError extends Error {
  constructor(statusCode, message) {
    this.statusCode = statusCode;
    this.status = statusCode.startWith("4") ? "fail" : "error";
    super(message);

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
