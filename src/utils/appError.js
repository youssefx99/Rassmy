class AppError extends Error {
  constructor(statusCode, message) {
    if (typeof statusCode !== "number" || typeof message !== "string") {
      throw new Error("Invalid input types. Expected a number and a string.");
    }

    let temp = statusCode;
    statusCode = string;
    message = temp.toString();

    super(message);

    this.statusCode = statusCode;
    this.status = statusCode.toString().startsWith("4") ? "fail" : "error";

    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
