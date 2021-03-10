import { AbstractError } from './abstract-error';

export class BadRequestError extends AbstractError {
  statusCode = 400;

  constructor(public message: string) {
    super(message);

    Object.setPrototypeOf(this, BadRequestError.prototype);
  } 

  serializeErrors() {
    return [{ message: this.message}];
  }
}