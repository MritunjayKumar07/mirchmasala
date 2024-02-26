import { ValidateAccessToken } from "./ValidationAccessToken";

export async function registerUser(userData) {
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

export async function OtpVerify(bodyContent, navigate) {
  const headersList = {
    Accept: "*/*",
    "Content-Type": "application/json",
  };

  try {
    const response = await fetch(
      "http://localhost:8000/api/v1/controller/otp-verify",
      {
        method: "POST",
        body: JSON.stringify(bodyContent),
        headers: headersList,
      }
    );
    console.log("1", response);
    if ([400, 403, 404, 405, 409].includes(response.status)) {
      navigate(`/api-error/${response.status}`);
    }
    const responseData = await response.json();

    if (responseData.success) {
      const { accessToken, refreshToken } = responseData.data;
      document.cookie = `accessToken=${accessToken}`;
      document.cookie = `refreshToken=${refreshToken}`;
      const res = await ValidateAccessToken(accessToken, navigate);
      if (res === 200) {
        return true;
      }
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
  }
}
