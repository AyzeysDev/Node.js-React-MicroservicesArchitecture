import { AbstractError } from './abstract-error';

export class DatabaseConnectionError extends AbstractError {
  statusCode = 500;
  reason = 'Error connecting to Database';

  constructor() {
    super('Error connecting to Database');

    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }  

  serializeErrors() {
    return [
      { message: this.reason }
    ];
  }
}

