import v4 from 'uuid/v4';

class BaseError extends Error {
  constructor(options) {
    super(options.message || 'Error');
    this.name = this.constructor.name;
    this.id = v4();
    this.cause = options.cause || 'Unknown Error';
    this.internalError = options.internalError;
    Error.captureStackTrace(this, 'Error');
  }
}

export default BaseError;
