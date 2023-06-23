class HttpError extends Error {
  constructor(errorMessage, errorCode) {
    // super calls the constructor of the base class
    super(errorMessage);
    this.code = errorCode;
  }
}
module.exports = HttpError;
