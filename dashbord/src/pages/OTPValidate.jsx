import { useRef, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import logo from "../assets/logo.png";
import { OtpVerify, ValidateAccessToken } from "../Api/User.js";
import Cookies from "js-cookie";

const numberOfDigits = 6;

function OTPValidate() {
  const [otp, setOtp] = useState(new Array(numberOfDigits).fill(""));
  const [otpError, setOtpError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [isSubmit, setIsSubmit] = useState(false);
  const otpBoxRefs = useRef([]);
  const navigate = useNavigate();

  const handleChange = (value, index) => {
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < numberOfDigits - 1) {
      otpBoxRefs.current[index + 1].focus();
    }
  };

  const handleBackspaceAndEnter = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      otpBoxRefs.current[index - 1].focus();
    }
    if (e.key === "Enter" && e.target.value && index < numberOfDigits - 1) {
      otpBoxRefs.current[index + 1].focus();
    }
  };

  const handleOtpVerification = async (enteredOTP) => {
    try {
      const bodyContent = {
        email: localStorage.getItem("email") || null,
        otp: enteredOTP,
      };

      const res = await OtpVerify(bodyContent);
      console.log(res);
      if ([400, 403, 404, 405, 409].includes(res.status)) {
        navigate(`/api-error/${res.status}`);
      }
      if (res.status === 200 || res.status === 201) {
        await validateAccessToken();
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setOtpError("❌ Error verifying OTP. Please try again later.");
    }
  };

  const validateAccessToken = async () => {
    try {
      const accessToken = Cookies.get("accessToken");
      console.log(accessToken);
      if (!accessToken) return;
      const res = await ValidateAccessToken(accessToken);
      console.log(res.statusCode);
      if (res.statusCode === 200) {
        navigate(`/api-error/${res.status}`);
      }
      if (res.statusCode === 400) {
        alert("Both email and OTP are required.");
        setOtpError("❌ Both email and OTP are required.");
      }
      if (res.statusCode === 403) {
        alert("Invalid email/OTP format.");
        setOtpError("❌ Invalid email/OTP format.");
      }
      if (res.statusCode === 404) {
        alert("User not found with the provided email address.");
        setOtpError("❌ User not found with the provided email address.");
      }
      if (res.statusCode === 405) {
        alert("OTP has expired.");
        setOtpError("❌ OTP has expired.");
      }
      //  else {
      //   console.log("Access token validation failed");
      //   setOtpError("❌ Access token validation failed.");
      // }
    } catch (error) {
      console.error("Error validating OTP:", error);
      setOtpError("❌ Error validating OTP.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);
    setTimeLeft("07:30");
    const enteredOTP = otp.join("");
    await handleOtpVerification(enteredOTP);
  };

  const resendOtpHandler = async () => {
    await handleOtpVerification();
  };

  return (
    <section>
      <div className="flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-12">
        <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
          <div className="mb-2 flex justify-center">
            <img src={logo} alt="mirch masala" className="w-24" />
          </div>
          <h2 className="text-center text-2xl font-bold leading-tight text-black">
            Validate your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 ">
            Don&apos;t have an account?{" "}
            <Link
              to="/"
              title=""
              className="font-semibold text-black transition-all duration-200 hover:underline"
            >
              Create a free account
            </Link>
          </p>
          <form onSubmit={handleSubmit} className="mt-8">
            <div className="space-y-5">
              <div>
                <label className="text-base font-medium text-gray-900">
                  Validation OTP
                </label>
                <div className="mt-2 flex gap-2">
                  {Array.from({ length: numberOfDigits }, (_, index) => (
                    <input
                      key={index}
                      className="flex h-10 w-10 rounded-md border border-gray-300 bg-transparent p-3 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                      type="text"
                      value={otp[index]}
                      maxLength={1}
                      onChange={(e) => handleChange(e.target.value, index)}
                      onKeyUp={(e) => handleBackspaceAndEnter(e, index)}
                      ref={(ref) => (otpBoxRefs.current[index] = ref)}
                    />
                  ))}
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  disabled={isSubmit ? true : false}
                  className={`inline-flex w-full items-center justify-center ${
                    isSubmit ? "bg-gray-600" : "bg-black"
                  } rounded-md px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-gray-600`}
                >
                  Get started <FaArrowRight className="ml-2" size={16} />
                </button>
              </div>
              {timeLeft ? (
                <p className="text-blue-500 text-lx">
                  Expired in: {timeLeft} seconds
                </p>
              ) : (
                <p
                  onClick={resendOtpHandler}
                  className="text-blue-500 text-lx cursor-pointer"
                >
                  Re-Generate Verification Code!
                </p>
              )}
              {otpError ? (
                <p className="text-red-500 text-sm">{otpError}</p>
              ) : (
                <p>
                  <b className="text-blue-500 text-lx">
                    Verification code sent to your email!
                  </b>
                  <br /> Please enter the verification code.
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default OTPValidate;
