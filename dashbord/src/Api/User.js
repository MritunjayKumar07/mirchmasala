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

async function ValidateAccessToken(accessToken) {
  console.log("object", accessToken);
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
      await ValidateAccessToken(accessToken);
    }
  } catch (error) {
    console.error("Error verifying OTP:", error);
  }
}
