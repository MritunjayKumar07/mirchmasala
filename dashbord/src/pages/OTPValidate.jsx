import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { FaArrowRight } from "react-icons/fa";

const numberOfDigits = 6;

function OTPValidate() {
  /* `new Array(numberOfDigits).fill("")` is creating a new array with a
  length of `numberOfDigits` (which is 6 in this case) and filling it
  with empty strings. */
  const [otp, setOtp] = useState(new Array(numberOfDigits).fill(""));
  const [otpError, setOtpError] = useState(null);
  const otpBoxRefs = useRef([]);

  const handleChange = (value, index) => {
    /* `const newOtp = [...otp];` is creating a new array `newOtp` by using the spread operator (`...`)
    on the existing `otp` array.*/
    const newOtp = [...otp];
    newOtp[index] = value; // inslize valu in array
    setOtp(newOtp); // store
    /* value && index < numberOfDigits - 1 && otpBoxRefs.current[index + 1].focus(); it mins agar value ma value
    hy to index ma jo index agar (numberOfDigits -1) sa kam hy to next otp input box pa focus ke do*/
    value &&
      index < numberOfDigits - 1 &&
      otpBoxRefs.current[index + 1].focus();
  };

  const handleBackspaceAndEnter = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0)
      otpBoxRefs.current[index - 1].focus();
    if (e.key === "Enter" && e.target.value && index < numberOfDigits - 1)
      otpBoxRefs.current[index + 1].focus();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const enteredOTP = otp.join("");

    console.log(enteredOTP)

    // try {
    //   const response = await fetch("your_verification_api_url", {
    //     method: "POST",
    //     headers: { "Content-Type": "application/json" },
    //     body: JSON.stringify({ otp: enteredOTP }),
    //   });

    //   if (!response.ok) throw new Error("Failed to verify OTP");

    //   const data = await response.json();
    //   !data.success
    //     ? setOtpError("❌ Wrong OTP. Please check again.")
    //     : setOtpError(null);
    // } catch (error) {
    //   console.error("Error verifying OTP:", error);
    //   setOtpError("❌ Error verifying OTP. Please try again later.");
    // }
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
                  className="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80"
                >
                  Get started <FaArrowRight className="ml-2" size={16} />
                </button>
              </div>
              {otpError && <p className="text-red-500 text-sm">{otpError}</p>}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default OTPValidate;
