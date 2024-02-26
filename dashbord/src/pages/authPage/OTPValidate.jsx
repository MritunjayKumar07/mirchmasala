import { useRef, useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import logo from "../../assets/logo.png";
import { OtpVerify } from "../../Api/User.js";

const numberOfDigits = 6;

function OTPValidate() {
  const [otp, setOtp] = useState(new Array(numberOfDigits).fill(""));
  const [otpError, setOtpError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(450); // 7 minutes 30 seconds
  const [isSubmit, setIsSubmit] = useState(false);
  const otpBoxRefs = useRef([]);
  const { email } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      if (timeLeft > 0) {
        setTimeLeft(timeLeft - 1);
      }
    }, 1000);

    return () => clearTimeout(timer);
  }, [timeLeft]);

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
    if (!email) {
      alert("Not found email!");
    }
    try {
      const bodyContent = {
        email: email,
        otp: enteredOTP,
      };

      const res = await OtpVerify(bodyContent, navigate);
      if (res) {
        navigate(`/update-password`);
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setOtpError("❌ Error verifying OTP. Please try again later.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);
    const enteredOTP = otp.join("");
    await handleOtpVerification(enteredOTP);
    setIsSubmit(false);
  };

  const resendOtpHandler = async () => {
    setOtp(new Array(numberOfDigits).fill("")); // Clear OTP input
    setOtpError(null); // Clear error message
    setIsSubmit(false); // Reset submit state
    setTimeLeft(450); // Reset timeLeft
    await handleOtpVerification(); // Resend OTP
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
                  disabled={isSubmit}
                  className={`inline-flex w-full items-center justify-center ${
                    isSubmit ? "bg-gray-600" : "bg-black"
                  } rounded-md px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-gray-600`}
                >
                  Get started <FaArrowRight className="ml-2" size={16} />
                </button>
              </div>
              {timeLeft > 0 ? (
                <p className="text-blue-500 text-lx">
                  Expired in: {Math.floor(timeLeft / 60)}:{timeLeft % 60}{" "}
                  seconds
                </p>
              ) : (
                <p
                  onClick={resendOtpHandler}
                  className="text-blue-500 text-lx cursor-pointer"
                >
                  Re-Generate Verification Code!
                </p>
              )}
              {otpError && <p className="text-red-500 text-sm">{otpError}</p>}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default OTPValidate;
