import logo from "../assets/logo.png";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaArrowRightLong } from "react-icons/fa6";
import { AddUpdateUserName } from "../Api/User";

function UpdateUserName() {
  const [userNameError, setUserNameError] = useState(null);
  const navigate = useNavigate();

  const [data, setData] = useState({
    userName: "",
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
    console.log(data);
    const res = await AddUpdateUserName(data.userName, navigate);
    if (res) {
      navigate(`/login`);
    } else {
      setUserNameError("Failed to update userName. Please try again.");
    }
  };
  return (
    <section>
      <div className="flex items-center justify-center px-4 py-10 sm:px-6 sm:py-16 lg:px-8 lg:py-12">
        <div className="xl:mx-auto xl:w-full xl:max-w-sm 2xl:max-w-md">
          <div className="mb-2 flex justify-center">
            <img src={logo} alt="mirch masala" className="w-24" />
          </div>
          <h2 className="text-center text-2xl font-bold leading-tight text-black">
            Add & Update UserName
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
                  UserName
                </label>
                <div className="mt-2">
                  <input
                    name="userName"
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-transparent px-3 py-2 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-gray-400 focus:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
                    type="text"
                    onChange={handleChange}
                    placeholder="Enter userName"
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
              {userNameError && (
                <p className="text-red-500 text-sm">{userNameError}</p>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

export default UpdateUserName;
