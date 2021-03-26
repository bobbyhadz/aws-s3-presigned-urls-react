import {CustomError} from './custom-error';

export class RequestValidationError extends CustomError {
  statusCode = 400;

  constructor(private errors: {inner: {path: string; message: string}[]}) {
    super('Invalid request parameters');

    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors(): {field?: string; message: string}[] {
    return this.errors.inner.map(e => ({
      field: e.path,
      message: e.message,
    }));
  }
}
