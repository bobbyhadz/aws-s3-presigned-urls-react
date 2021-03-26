import {CustomError} from './custom-error';

export class NotAuthorizedError extends CustomError {
  statusCode = 401;
  message = 'Not authorized';

  constructor() {
    super('Not authorized');

    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }

  serializeErrors(): {message: string}[] {
    return [{message: this.message}];
  }
}
