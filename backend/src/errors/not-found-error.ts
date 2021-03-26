import {CustomError} from './custom-error';

export class NotFoundError extends CustomError {
  statusCode = 404;

  constructor(public message: string) {
    super('Resource not found');

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors(): {message: string}[] {
    return [{message: this.message}];
  }
}
