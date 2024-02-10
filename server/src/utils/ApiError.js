class ApiError extends Error {
  constructor(
    statusCode,
    message = "Somthing went wrong !",
    error = [],
    stack = ""
  ) {
    /* The `super(message);` statement is calling the constructor of the parent class `Error` and
    passing the `message` parameter to it. This is necessary because `ApiError` extends the `Error`
    class and needs to initialize the `message` property of the `Error` class. */
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.error = error;
    this.data = null;
    this.success = false;

    /* The `if (stack) { ... } else { ... }` block is checking if a `stack` parameter is provided when
    creating an instance of the `ApiError` class. */
    if (stack) {
      /* The line `this.stack = stack;` is assigning the value of the `stack` parameter to the `stack`
      property of the `ApiError` instance. */
      this.stack = stack;
    } else {
      /* `Error.captureStackTrace(this, this.constructor);` is a method that captures the current stack
      trace and assigns it to the `stack` property of the `ApiError` instance. This allows for
      better debugging by providing information about the call stack leading up to the creation of
      the error. */
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };