const ApiErrorResponse = [
  {
    statuscode: 401,
    message: "Unauthorized",
    description: "Authorization failed Please check your token!",
  },
  {
    statuscode: 400,
    message: "Invalid or  missing parameters.",
    description: "Please provide all the required information in request body!",
  },
  {
    statuscode: 403,
    message: "Invalid email.",
    description: "Please provide all the required information in request body!",
  },
  {
    statuscode: 404,
    message: "Not Found.",
    description: "User not found with the provided email!",
  },
  {
    statuscode: 405,
    message: "Expired.",
    description: "OTP has expired!",
  },
  {
    statuscode: 409,
    message: "Already verified.",
    description: "Email is already verified!",
  },
];
export { ApiErrorResponse };
