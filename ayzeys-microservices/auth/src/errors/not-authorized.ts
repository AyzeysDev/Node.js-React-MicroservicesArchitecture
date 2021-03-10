import { AbstractError } from './abstract-error';

export class NotAuthorizedError extends AbstractError {
  statusCode = 401;

  constructor() {
    super('Not Authorized');

    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  } 

  serializeErrors() {
    return [{ message: 'Not Authorized'}];
  }
}