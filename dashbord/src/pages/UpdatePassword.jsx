import logo from "../assets/logo.png";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowRightLong } from "react-icons/fa6";
import { AddUpdatePassword } from "../Api/User";
function UpdatePassword() {
  const [passwordError, setPasswordError] = useState(null);
  const [isAlphaUpper, setIsAlphaUpper] = useState(false);
  const [isAlphaLower, setIsAlphaLower] = useState(false);
  const [isNumber, setIsNumber] = useState(false);
  const [isSymbol, setIsSymbol] = useState(false);
  const [isLength, setIsLength] = useState(false);
  const navigate = useNavigate();

  const [data, setData] = useState({
    password: "",
    cpassword: "",
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (data.cpassword !== data.password) {
      setPasswordError("Password and Confirm Password do not match!");
      return;
    }

    if (!isAlphaUpper && !isAlphaLower && !isNumber && !isSymbol && !isLength) {
      setPasswordError("Please enter a strong password");
      return;
    }

    const res = await AddUpdatePassword(data.password);
    if (res) {
      navigate(`/update-username`);
    } else {
      setPasswordError("Failed to update password. Please try again.");
    }
  };

  const passAlphaUpper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const passAlphaLower = "abcdefghijklmnopqrstuvwxyz";
  const passNumbers = "0123456789";
  const passSymbol = "!@#$%^&*()_+{}:\"|<>?`~=-=[]\\;',./~";
  const passLength = 6;

  useEffect(() => {
    if ([...passAlphaUpper].some((char) => data.password.includes(char))) {
      setIsAlphaUpper(true);
    } else {
      setIsAlphaUpper(false);
    }
    if ([...passAlphaLower].some((char) => data.password.includes(char))) {
      setIsAlphaLower(true);
    } else {
      setIsAlphaLower(false);
    }
    if ([...passNumbers].some((char) => data.password.includes(char))) {
      setIsNumber(true);
    } else {
      setIsNumber(false);
    }
    if ([...passSymbol].some((char) => data.password.includes(char))) {
      setIsSymbol(true);
    } else {
      setIsSymbol(false);
    }
    if (data.password.length >= passLength) {
      setIsLength(true);
    } else {
      setIsLength(false);
    }
  }, [data]);
  return (
    <section>
      <div className="flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-12">
        <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
          <div className="mb-2 flex justify-center">
            <img src={logo} alt="mirch masala" className="w-24" />
          </div>
          <h2 className="text-center text-2xl font-bold leading-tight text-black">
            Update & Add password
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
                <label
                  htmlFor=""
                  className="text-base font-medium text-gray-900"
                >
                  Password
                </label>
                <div className="mt-2">
                  <input
                    name="password"
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    type="password"
                    onChange={handleChange}
                    placeholder="password"
                    required={true}
                  ></input>
                </div>
              </div>
              <div>
                <label
                  htmlFor=""
                  className="text-base font-medium text-gray-900"
                >
                  Confirm Password
                </label>
                <div className="mt-2">
                  <input
                    name="cpassword"
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    type="text"
                    onChange={handleChange}
                    placeholder="Confirm Password"
                    required={true}
                  ></input>
                </div>
              </div>
              <div>
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center rounded-md bg-black px-3.5 py-2.5 font-semibold leading-7 text-white hover:bg-black/80"
                >
                  Get started <FaArrowRightLong className="ml-2" size={16} />
                </button>
              </div>
              {passwordError && (
                <p className="text-red-500 text-sm">{passwordError}</p>
              )}
              <ul>
                <li
                  className={`${
                    isAlphaUpper ? "text-green-500" : "text-red-500"
                  }`}
                >
                  Include Alpha Upper (A-Z):
                </li>
                <li
                  className={`${
                    isAlphaLower ? "text-green-500" : "text-red-500"
                  }`}
                >
                  Include Alpha Lower (a-z):
                </li>
                <li
                  className={`${isNumber ? "text-green-500" : "text-red-500"}`}
                >
                  Include Number (0-9):
                </li>
                <li
                  className={`${isSymbol ? "text-green-500" : "text-red-500"}`}
                >
                  Include Symbol:
                </li>
                <li
                  className={`${isLength ? "text-green-500" : "text-red-500"}`}
                >
                  Length grater than 6
                </li>
              </ul>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default UpdatePassword;
