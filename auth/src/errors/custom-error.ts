//abstract class:
// - cannot be instantiated and only used to set up requirements for subclasses
// a subclass of this can use the instanceof property
export abstract class CustomError extends Error {
  abstract statusCode: number;

  constructor(message: string) {
    super(message);

    Object.setPrototypeOf(this, CustomError.prototype);
  }

  abstract serializeErrors(): { message: string; field?: string }[];
}
