import { IoMdLogIn, IoMdCart } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { LuBadgePercent } from "react-icons/lu";
const menuItems = [
  {
    name: "Subscription",
    href: "subscription",
    icon: "",
    maxCss: "inline-flex px-3 py-2 mb-3 text-sm font-semibold text-black",
    minCss: "text-sm font-semibold text-gray-800 ",
  },
  {
    name: "Deals",
    href: "deals",
    icon: <LuBadgePercent />,
    maxCss: "inline-flex px-3 py-2 text-sm font-semibold text-black",
    minCss: "text-sm font-semibold text-gray-800 ",
  },
  {
    name: "Cart",
    href: "shopping-cart",
    icon: <IoMdCart />,
    maxCss: "inline-flex px-3 py-2 text-sm font-semibold text-black",
    minCss: "text-sm font-semibold text-gray-800 ",
  },
  {
    name: "Sign In",
    href: "#",
    icon: <FaUser />,
    maxCss: "inline-flex px-3 py-2 text-sm font-semibold text-black",
    minCss: "text-sm font-semibold text-gray-800 ",
  },
  {
    name: "Log In",
    href: "#",
    icon: <IoMdLogIn />,
    maxCss:
      "rounded-md border border-black inline-flex px-3 py-2 text-sm font-semibold text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black",
    minCss:
      "w-full rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black",
  },
];

export { menuItems };
