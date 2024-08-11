class AppError extends Error {
  constructor(statusCode, message) {
    if (typeof statusCode !== "number" || typeof message !== "string") {
      let temp = statusCode;
      statusCode = message;
      message = temp.toString();
    }

    super(message);

    this.statusCode = statusCode;
    this.status = statusCode.toString().startsWith("4") ? "fail" : "error";

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
