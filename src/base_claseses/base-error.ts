class BaseError extends Error {
   public errorCode: string;
   public statusCode: string;

   constructor(errorCode: string, statusCode: string, message: string) {
      super(message);
      this.errorCode = errorCode;
      this.statusCode = statusCode;

      Object.setPrototypeOf(this, BaseError.prototype);
   }
}

export default BaseError;
