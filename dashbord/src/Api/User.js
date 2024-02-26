export async function registerUser(userData) {
  localStorage.setItem("SignInData", JSON.stringify(userData));
  const headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  const response = await fetch(
    "http://localhost:8000/api/v1/controller/register",
    {
      method: "POST",
      body: JSON.stringify(userData),
      headers: headersList,
    }
  );

  return response;
}

export async function OtpVerify(bodyContent) {
  bodyContent = bodyContent || JSON.parse(localStorage.getItem("SignInData"));
  if (!bodyContent) throw new Error("No User Data Found");

  const headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  const response = await fetch(
    "http://localhost:8000/api/v1/controller/otp-verify",
    {
      method: "POST",
      body: JSON.stringify(bodyContent),
      headers: headersList,
    }
  );

  const responseData = await response.json();

  if (responseData.success) {
    localStorage.clear("SignInData");
    const { accessToken, refreshToken } = responseData.data;
    document.cookie = `accessToken=${accessToken}`;
    document.cookie = `refreshToken=${refreshToken}`;
  }

  return responseData;
}

export async function ValidateAccessToken(accessToken) {
  try {
    const headersList = {
      Accept: "*/*",
      Authorization: `Bearer ${accessToken}`,
    };

    const response = await fetch(
      "http://localhost:8000/api/v1/controller/validate-access-token",
      {
        method: "POST",
        headers: headersList,
      }
    );

    return response;
  } catch (error) {
    console.error("Error validating access token:", error);
    throw error; // Rethrow the error to handle it in the calling function
  }
}
