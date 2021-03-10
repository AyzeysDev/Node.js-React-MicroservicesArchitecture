import { ValidationError } from 'express-validator';
import { AbstractError } from './abstract-error';


export class RequestValidationError extends AbstractError {
  statusCode = 400;

  constructor(public errors: ValidationError[]) {
    super('Validating Error');

    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }
  
  serializeErrors() {
    return this.errors.map(err => {
      return { message: err.msg, field: err.param };
    });
  }
}

