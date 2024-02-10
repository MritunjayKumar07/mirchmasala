import React, { useEffect, useState } from "react";
import {
  RiMenu3Line,
  RiApps2Fill,
  RiArrowDownSLine,
  RiArrowRightSLine,
} from "react-icons/ri";
import { IoMdCart } from "react-icons/io";

import { useNavigate } from "react-router-dom";
import { LocationItems } from "../apiCall/Priduct";

import Logo from "../assets/logo.png";
import { Link } from "react-router-dom";
import { menuItems } from "../Constant";

export function Navebar() {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isLocationOpen, setIsLocationOpen] = React.useState(false);
  const [cart, setCart] = useState();
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  useEffect(() => {
    setInterval(() => {
      let cartItem = localStorage.getItem("cartItems");
      cartItem = JSON.parse(cartItem);
      const totalQuantity = cartItem
        ? cartItem.reduce((acc, item) => acc + item.quantity, 0)
        : 0;
      setCart(totalQuantity);
    }, 500);
  }, [cart]);

  return (
    <>
      <div className="fixed top-0 z-10 w-full mx-auto flex items-center max-w-8xl justify-between px-4 py-2 sm:px-6 lg:px-8 bg-white">
        <Link to={"/"} className="inline-flex items-center space-x-2">
          <span>
            <img src={Logo} alt="logo" width={65} />
          </span>
        </Link>
        {/* Location Picker Area */}
        <div className="hidden grow items-start lg:flex">
          <ul className="ml-12 inline-flex space-x-8">
            {LocationItems.map((item) => (
              <li
                key={item.name}
                onClick={() => setIsLocationOpen(!isLocationOpen)}
                className="absolute top-5  bg-white divide-y divide-gray-100 rounded-lg shadow  dark:bg-gray-700"
              >
                <Link
                  to={item.href}
                  className="rounded-md border border-black py-2 px-1 w-44 inline-flex items-center text-sm font-semibold text-gray-800 hover:text-gray-900"
                >
                  {item.name}
                  <span>
                    <RiArrowDownSLine className="ml-14 h-4 w-4" />
                  </span>
                </Link>
                {isLocationOpen ? (
                  <div className="z-10  bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700">
                    {item.subName.map((subItem) => (
                      <ul
                        key={subItem.city}
                        className="py-2 text-sm text-gray-700 dark:text-gray-200"
                        aria-labelledby="dropdownDefaultButton"
                      >
                        <li>
                          <a
                            href="#"
                            className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                          >
                            {subItem.city}/{subItem.state}
                          </a>
                        </li>
                      </ul>
                    ))}
                  </div>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
        {/* Desktop Menu */}
        {menuItems.map((item) => (
          <div className="hidden mr-2 space-x-2 lg:block" key={item.name}>
            <button
              onClick={() => navigate(item.href)}
              type="button"
              className={item.maxCss}
            >
              <span className="text-xl mr-1 flex relative">
                {item.icon}

                {item.name == "Cart" && cart > 0 ? (
                  <span className="absolute inline-flex items-center justify-center w-4 h-4 text-xs font-bold text-gray bg-green-500 rounded-full -top-2 -end-2 dark:border-gray-900">
                    {cart}
                  </span>
                ) : null}
              </span>
              {item.name}
            </button>
          </div>
        ))}
        <div className="lg:hidden space-x-4 inline-flex">
          {cart > 0 ? (
            <div onClick={() => navigate("shopping-cart")}>
              <IoMdCart className="h-6 w-6 cursor-pointer" />
              <span className="absolute -top-[-17px] px-1 py-0 rounded-full text-xs font-bold bg-green-500">
                {cart}
              </span>
            </div>
          ) : undefined}
          <RiMenu3Line
            onClick={toggleMenu}
            className="h-6 w-6 cursor-pointer"
          />
        </div>
        {/* Smoll screen */}
        {isMenuOpen && (
          <div className="absolute inset-x-0 top-0 z-50 origin-top-right transform p-2 transition lg:hidden">
            <div className="divide-y-2 divide-gray-50 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5">
              <div className="px-5 pb-6 pt-5">
                <div className="flex items-center justify-between">
                  <div
                    className="inline-flex items-center space-x-2"
                    onClick={() => navigate("/")}
                  >
                    <img src={Logo} alt="logo" width={65} />
                  </div>
                  <div className="-mr-2">
                    <button
                      type="button"
                      onClick={toggleMenu}
                      className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                    >
                      <span className="sr-only">Close menu</span>
                      <RiApps2Fill className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                </div>

                {menuItems.map((item) => (
                  <div className="mt-2 space-y-2" key={item.name}>
                    <button
                      type="button"
                      className={item.minCss}
                      onClick={() => navigate(item.href)}
                    >
                      {item.name}
                    </button>
                  </div>
                ))}

                <div className="mt-6">
                  <nav className="grid">
                    {LocationItems.map((item) => (
                      <>
                        <Link
                          key={item.name}
                          to={item.href}
                          onClick={() => setIsLocationOpen(!isLocationOpen)}
                          className="-m-3 flex items-center rounded-md p-3 text-sm font-semibold hover:bg-gray-50"
                        >
                          <span className="ml-3 text-base font-medium text-gray-900">
                            {item.name}
                          </span>
                          <span>
                            <RiArrowRightSLine className="ml-3 h-4 w-4" />
                          </span>
                        </Link>
                        {isLocationOpen
                          ? item.subName.map((loction) => (
                              <div
                                key={loction.city}
                                className="flex flex-nowrap "
                              >
                                <button type="button" className="m-1">
                                  {loction.city}/{loction.state}
                                </button>
                              </div>
                            ))
                          : undefined}
                      </>
                    ))}
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
