import BaseError from './base-error';

class DamakuError extends BaseError {
  constructor(options) {
    super({
      ...options,
      cause: options.cause || 'DanmakuError',
    });
  }
}

export default DamakuError;
