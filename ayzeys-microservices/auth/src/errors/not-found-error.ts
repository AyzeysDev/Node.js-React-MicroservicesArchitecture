import { AbstractError } from './abstract-error';

export class NotFoundError extends AbstractError {
  statusCode = 404;

  constructor() {
    super('Route not found!!');

    Object.setPrototypeOf(this, NotFoundError.prototype);
  }

  serializeErrors() {
    return [
      { message: 'Page Not Found' }
    ];
  }
}