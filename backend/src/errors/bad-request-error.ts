import {CustomError} from './custom-error';

// usecase: Request has been validated, but the user provided values cannot be satisfied
// i.e. username already exists

export class BadRequestError extends CustomError {
  statusCode = 400;

  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, BadRequestError.prototype);
  }

  serializeErrors(): {message: string}[] {
    return [{message: this.message}];
  }
}

// usage: new BadRequestError('provided value for username already exists.')
