export abstract class AbstractError extends Error {
  abstract statusCode: number;

  constructor(message: string) {
    super(message);

     Object.setPrototypeOf(this, AbstractError.prototype);
  }

  abstract serializeErrors(): { message: string; field?: string }[];
}