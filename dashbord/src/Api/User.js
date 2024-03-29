import { ValidateAccessToken } from "./ValidationAccessToken";
import Cookies from "js-cookie";

function deleteCookie(cookieName) {
  document.cookie =
    cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

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
    if ([400, 401, 404, 405, 409].includes(response.status)) {
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

export async function AddUpdatePassword(password) {
  try {
    console.log(password);

    // Retrieve the authorization token from localStorage
    const accessToken = Cookies.get("accessToken");
    if (!accessToken) {
      throw new Error("Access token not found");
    }

    const headersList = {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };

    const bodyContent = JSON.stringify({
      password: password,
    });

    const response = await fetch(
      "http://localhost:8000/api/v1/controller/password-add-or-update",
      {
        method: "POST",
        body: bodyContent,
        headers: headersList,
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    return true;
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
}

export async function AddUpdateUserName(userName, navigate) {
  try {
    console.log(userName);

    // Retrieve the authorization token from localStorage
    const accessToken = Cookies.get("accessToken");
    if (!accessToken) {
      throw new Error("Access token not found");
    }

    const headersList = {
      Accept: "application/json",
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    };

    const bodyContent = JSON.stringify({
      userName: userName,
    });

    const response = await fetch(
      "http://localhost:8000/api/v1/controller/username-add-or-update",
      {
        method: "POST",
        body: bodyContent,
        headers: headersList,
      }
    );

    console.log(response);
    if ([400, 403, 404].includes(response.status)) {
      navigate(`/api-error/${response.status}`);
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(data);
    deleteCookie("accessToken");
    deleteCookie("refreshToken");
    return true;
  } catch (error) {
    console.error("Error:", error);
    return false;
  }
}

export async function LoginUser(data, navigate) {
  try {
    const headersList = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    const response = await fetch(
      "http://localhost:8000/api/v1/controller/login",
      {
        method: "POST",
        body: JSON.stringify(data),
        headers: headersList,
      }
    );

    console.log("1", response);
    if ([400, 401, 404].includes(response.status)) {
      navigate(`/api-error/${response.status}`);
    }
    const responseData = await response.json();

    if (responseData.success) {
      const { accessToken, refreshToken } = responseData.data;
      document.cookie = `accessToken=${accessToken}`;
      document.cookie = `refreshToken=${refreshToken}`;
      const res = await ValidateAccessToken(accessToken, navigate);
      if (res === 200) {
        localStorage.setItem("userInfo", JSON.stringify(responseData.data));
        return true;
      }
    }
  } catch (error) {
    console.error("Error Login:", error);
  }
}

export async function LogoutUser(navigate) {
  try {
    // Retrieve the authorization token from localStorage or cookies
    const accessToken = Cookies.get("accessToken");
    if (!accessToken) {
      throw new Error("Access token not found");
    }

    // Set headers with authorization token
    const headersList = {
      Authorization: `Bearer ${accessToken}`,
    };

    // Send a POST request to the logout endpoint
    const response = await fetch(
      "http://localhost:8000/api/v1/controller/logout",
      {
        method: "POST",
        headers: headersList,
      }
    );

    // Check if the request was successful
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Clear the access token from cookies or localStorage
    deleteCookie("accessToken");
    deleteCookie("refreshToken");
    localStorage.clear("userInfo");

    // Redirect or navigate to the desired page
    navigate("/logout-success");
  } catch (error) {
    console.error("Error:", error);
    // Handle errors as needed
  }
}

export async function UpdateAvatar(avatarFile) {
  try {
    const accessToken = Cookies.get("accessToken");
    if (!accessToken) {
      throw new Error("Access token not found");
    }

    // Set headers with authorization token
    let headersList = {
      Accept: "*/*",
      Authorization: `Bearer ${accessToken}`,
    };

    // Create a FormData object to send file data
    let bodyContent = new FormData();
    bodyContent.append("avatar", avatarFile); // Append the avatar file

    // Send a POST request to update avatar
    const response = await fetch(
      "http://localhost:8000/api/v1/controller/avatar-add-or-update",
      {
        method: "POST",
        body: bodyContent,
        headers: headersList,
      }
    );

    // Check if the request was successful
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Log the response data
    let data = await response.json();
    console.log(data);
    localStorage.setItem("userInfo", JSON.stringify(data.data));
    return true; // Return true indicating success
  } catch (error) {
    console.error("Error updating avatar:", error);
    return false; // Return false indicating failure
  }
}
