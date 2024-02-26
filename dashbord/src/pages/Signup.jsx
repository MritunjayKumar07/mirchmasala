import { FaArrowRightLong } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import { useState } from "react";
import { registerUser } from "../Api/User.js";

function Signup() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    fullName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    role: "",
    street: "",
    city: "",
    zipCode: "",
    state: "",
    country: "",
  });
  const [isSubmit, setIsSubmit] = useState(false);
  const [isError, setIsError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    const numberRegex = /^[0-9]+$/;

    if (name === "contactNumber") {
      if (!value || (value.match(numberRegex) && value.length <= 10)) {
        setData((prevData) => ({
          ...prevData,
          [name]: value,
        }));
      } else {
        setIsError("❌ Enter valid contact number !");
      }
    } else {
      setData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmit(true);
    try {
      const userData = {
        fullName: data.fullName,
        lastName: data.lastName,
        email: data.email,
        contactNumber: data.contactNumber,
        address: [
          {
            street: data.street,
            city: data.city,
            zipCode: data.zipCode,
            state: data.state,
            country: data.country,
          },
        ],
        role: data.role,
      };
      const res = await registerUser(userData);
      console.log(res);
      if (res.status === 201) {
        navigate(`/otp-validate/${data.email}`);
      }
      if (res.status === 401) {
        setIsSubmit(false);
        navigate(`/api-error/${res.status}`);
      }
      if (res.status === 400) {
        setIsSubmit(false);
        navigate(`/api-error/${res.status}`);
      }
    } catch (error) {
      setIsSubmit(false);
      console.error("Error:", error);
    }
  };

  return (
    <section>
      <div className="flex items-center justify-center px-4 py-6 sm:px-6 sm:py-16 lg:px-8 lg:py-12">
        <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
          <div className="mb-2 flex justify-center">
            <img src={logo} alt="mirch masala" className="w-24" />
          </div>
          <h2 className="text-center text-2xl font-bold leading-tight text-black">
            Sign Up to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600 ">
            Have an account?{" "}
            <Link
              to="login"
              title=""
              className="font-semibold text-black transition-all duration-200 hover:underline"
            >
              Login account
            </Link>
          </p>
          <form onSubmit={handleSubmit} className="mt-8">
            <div className="space-y-5">
              <div className="flex gap-2">
                <div>
                  <label
                    htmlFor=""
                    className="text-base font-medium text-gray-900"
                  >
                    {" "}
                    First Name{" "}
                  </label>
                  <div className="mt-2">
                    <input
                      name="fullName"
                      required={true}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                      type="text"
                      placeholder="first name"
                    ></input>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor=""
                    className="text-base font-medium text-gray-900"
                  >
                    {" "}
                    Last Name{" "}
                  </label>
                  <div className="mt-2">
                    <input
                      name="lastName"
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                      type="text"
                      placeholder="last name"
                    ></input>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <div>
                  <label
                    htmlFor=""
                    className="text-base font-medium text-gray-900"
                  >
                    {" "}
                    Email address{" "}
                  </label>
                  <div className="mt-2">
                    <input
                      name="email"
                      required={true}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                      type="email"
                      placeholder="email"
                    ></input>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor=""
                    className="text-base font-medium text-gray-900"
                  >
                    {" "}
                    Contact Number{" "}
                  </label>
                  <div className="mt-2">
                    <input
                      name="contactNumber"
                      required={true}
                      inputMode="numeric"
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                      type="tel"
                      placeholder="contact number"
                    ></input>
                  </div>
                </div>
              </div>
              <div>
                <label
                  htmlFor=""
                  className="text-base font-medium text-gray-900"
                >
                  {" "}
                  Position{" "}
                </label>
                <div className="mt-2">
                  <input
                    name="role" //Posible only ["admin", "viewer"]
                    required={true}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    type="text"
                    placeholder="Position"
                  ></input>
                </div>
              </div>
              <div className="flex gap-2">
                <div>
                  <label
                    htmlFor=""
                    className="text-base font-medium text-gray-900"
                  >
                    {" "}
                    Country{" "}
                  </label>
                  <div className="mt-2">
                    <input
                      name="country"
                      required={true}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                      type="text"
                      placeholder="country"
                    ></input>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor=""
                    className="text-base font-medium text-gray-900"
                  >
                    {" "}
                    state{" "}
                  </label>
                  <div className="mt-2">
                    <input
                      name="state"
                      required={true}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                      type="text"
                      placeholder="state"
                    ></input>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <div>
                  <label
                    htmlFor=""
                    className="text-base font-medium text-gray-900"
                  >
                    {" "}
                    City{" "}
                  </label>
                  <div className="mt-2">
                    <input
                      name="city"
                      required={true}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                      type="text"
                      placeholder="city"
                    ></input>
                  </div>
                </div>
                <div>
                  <label
                    htmlFor=""
                    className="text-base font-medium text-gray-900"
                  >
                    {" "}
                    ZipCode{" "}
                  </label>
                  <div className="mt-2">
                    <input
                      name="zipCode"
                      required={true}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                      type="text"
                      placeholder="zipCode"
                    ></input>
                  </div>
                </div>
              </div>
              <div>
                <label
                  htmlFor=""
                  className="text-base font-medium text-gray-900"
                >
                  {" "}
                  Street{" "}
                </label>
                <div className="mt-2">
                  <input
                    name="street"
                    required={true}
                    onChange={handleChange}
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    type="text"
                    placeholder="street"
                  ></input>
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
                  Next <FaArrowRightLong className="ml-2" size={16} />
                </button>
              </div>
              {isError && <p className="text-red-500 text-sm">{isError}</p>}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Signup;
