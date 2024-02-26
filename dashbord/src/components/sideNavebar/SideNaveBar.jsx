import {
  MdBarChart,
  MdWallet,
  MdNewspaper,
  MdNotificationsActive,
  MdOutlineAddLink,
  MdBrush,
  MdSettings,
} from "react-icons/md";
import { FaProductHunt } from "react-icons/fa";
import Logo from "../../assets/logo.png";
import { IoMdLogOut } from "react-icons/io";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogoutUser } from "../../Api/User";

function SideNaveBar() {
  const navigate = useNavigate();
  const [isMenu, setIsMenu] = useState(true);

  const LogoutUserFromDashbord = async () => {
    await LogoutUser(navigate);
  };
  return (
    <aside
      className={`flex h-screen ${isMenu ? "w-52" : "w-20"} flex-col ${
        isMenu ? "sm:overflow-y-auto" : "overflow-hidden"
      } border-r bg-white px-5 py-8`}
    >
      <a
        href="#"
        onClick={() => setIsMenu(!isMenu)}
        className="inline-block mb-6"
      >
        <img src={Logo} alt="logo" width={isMenu ? 60 : 96} />
      </a>
      <div className="mt-6 flex flex-1 flex-col justify-between">
        <nav className="-mx-3 space-y-6 ">
          <div className="space-y-3 ">
            <label className="px-3 text-xs font-semibold uppercase text-gray-900">
              {isMenu ? "analytics" : "ana..."}
            </label>
            <a
              className="flex transform items-center rounded-lg px-3 py-2 text-gray-600 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700"
              href="#"
            >
              <MdBarChart className="h-5 w-5" aria-hidden="true" />
              {isMenu ? (
                <span className="mx-2 text-sm font-medium">Dashboard</span>
              ) : null}
            </a>
            <a
              className="flex transform items-center rounded-lg px-3 py-2 text-gray-600 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700"
              href="#"
            >
              <MdWallet className="h-5 w-5" aria-hidden="true" />
              {isMenu ? (
                <span className="mx-2 text-sm font-medium">Sales</span>
              ) : null}
            </a>
            <a
              className="flex transform items-center rounded-lg px-3 py-2 text-gray-600 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700"
              href="#"
            >
              <FaProductHunt className="h-5 w-5" aria-hidden="true" />
              {isMenu ? (
                <span className="mx-2 text-sm font-medium">Products</span>
              ) : null}
            </a>
          </div>
          <div className="space-y-3 ">
            <label className="px-3 text-xs font-semibold uppercase text-gray-900">
              {isMenu ? "content" : "con..."}
            </label>
            <a
              className="flex transform items-center rounded-lg px-3 py-2 text-gray-600 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700"
              href="#"
            >
              <MdNewspaper className="h-5 w-5" aria-hidden="true" />
              {isMenu ? (
                <span className="mx-2 text-sm font-medium">Blogs</span>
              ) : null}
            </a>
            <a
              className="flex transform items-center rounded-lg px-3 py-2 text-gray-600 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700"
              href="#"
            >
              <MdNotificationsActive className="h-5 w-5" aria-hidden="true" />
              {isMenu ? (
                <span className="mx-2 text-sm font-medium">Notifications</span>
              ) : null}
            </a>
            <a
              className="flex transform items-center rounded-lg px-3 py-2 text-gray-600 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700"
              href="#"
            >
              <MdOutlineAddLink className="h-5 w-5" aria-hidden="true" />
              {isMenu ? (
                <span className="mx-2 text-sm font-medium">Checklists</span>
              ) : null}
            </a>
          </div>

          <div className="space-y-3 ">
            <label className="px-3 text-xs font-semibold uppercase text-gray-900">
              {isMenu ? "Customization" : "cus..."}
            </label>
            <a
              className="flex transform items-center rounded-lg px-3 py-2 text-gray-600 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700"
              href="#"
            >
              <MdBrush className="h-5 w-5" aria-hidden="true" />
              {isMenu ? (
                <span className="mx-2 text-sm font-medium">Themes</span>
              ) : null}
            </a>
            <a
              className="flex transform items-center rounded-lg px-3 py-2 text-gray-600 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700"
              href="#"
            >
              <MdSettings className="h-5 w-5" aria-hidden="true" />
              {isMenu ? (
                <span className="mx-2 text-sm font-medium">Setting</span>
              ) : null}
            </a>
          </div>
          <div className="space-y-3 ">
            <button
              onClick={() => LogoutUserFromDashbord()}
              className="flex transform items-center rounded-lg px-3 py-2 text-white bg-red-500 transition-colors duration-300 hover:bg-gray-100 hover:text-gray-700"
              style={{ width: "100%" }}
              href="#"
            >
              <IoMdLogOut className="h-5 w-5" aria-hidden="true" />
              <span className="mx-2 text-sm font-medium">Logout</span>
            </button>
          </div>
        </nav>
      </div>
    </aside>
  );
}

export default SideNaveBar;
