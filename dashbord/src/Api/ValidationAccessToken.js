export async function ValidateAccessToken(accessToken, navigate) {
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
    console.log("response", response);
    if ([401, 404].includes(response.status)) {
      navigate(`/api-error/${response.status}`);
    }

    return response.status;
  } catch (error) {
    console.error("Error validating access token:", error);
    throw error; // Rethrow the error to handle it in the calling function
  }
}
