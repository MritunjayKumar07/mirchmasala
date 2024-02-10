/**
 * The asyncHandler function is a higher-order function that wraps an asynchronous request handler and
 * catches any errors that occur during its execution.
 * @param requestHandler - The requestHandler parameter is a function that handles the incoming request
 * and generates a response. It takes three parameters: req (the request object), res (the response
 * object), and next (a function to call the next middleware function in the chain).
 * @returns The asyncHandler function is returning a new function that takes in the req, res, and next
 * parameters.
 */
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};
export { asyncHandler };
