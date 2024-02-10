import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiProduct } from "../apiCall/Priduct";
import { FaCartShopping } from "react-icons/fa6";
import { BsFillCartPlusFill, BsFillCartXFill } from "react-icons/bs";

export function Products() {
  // Set up state to hold the filtered list of products
  const [filterProduct, setFilterProduct] = useState([]);
  const [cartProduct, setCartProduct] = useState([]);
  const urlId = useParams();

  // Define a function to show all products by default
  const byDefoultShowProduct = () => {
    const allProduct = apiProduct.flatMap((items) => items.options);
    setFilterProduct(allProduct);
  };

  // Define a function to add or remove a product from the filtered list based on whether it's already included
  const addProductInFilterProduct = (item) => {
    if (!filterProduct.includes(item)) {
      //Add item when click on cheakbox if not alwarady exist
      setFilterProduct([...filterProduct, item]);
    } else {
      //Check if the name not come from url if its come then not change
      if (!(urlId["name"] == item.name)) {
        //Remove another time click checkbox
        setFilterProduct(
          filterProduct.filter((currentItem) => currentItem !== item)
        );
      }
    }
  };

  //Manage CartProduct from LocalStorage
  //Add Product in LocalStorage
  const addProductInLocalStorage = (productId) => {
    let cart = localStorage.getItem("cartItems");

    if (!cart) {
      localStorage.setItem(
        "cartItems",
        JSON.stringify([{ id: productId, quantity: 1 }])
      );
      setCartProduct([productId]);
    } else {
      cart = JSON.parse(cart);

      const existingItem = cart.find((item) => item.id === productId);

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.push({ id: productId, quantity: 1 });
        setCartProduct(() => [...cartProduct, productId]);
      }

      localStorage.setItem("cartItems", JSON.stringify(cart));
    }
  };

  //Remove Product from LocalStorage
  const removeProductInLocalStorage = (productId) => {
    let cart = localStorage.getItem("cartItems");
    cart = JSON.parse(cart);
    const existingItem = cart.find((item) => item.id === productId);
    if (existingItem) {
      const index = cart.indexOf(existingItem);
      cart.splice(index, index + 1);
      localStorage.setItem("cartItems", JSON.stringify(cart));
      //Remove id from cartProduct
      const removeId = cartProduct.indexOf(productId);
      cartProduct.splice(removeId, removeId + 1);
      setCartProduct([cartProduct]);
    }
  };

  useEffect(() => {
    //Add id on cartProduct
    let cart = localStorage.getItem("cartItems");
    cart = JSON.parse(cart);
    if (cart) {
      cart.map((item) => {
        if (!cartProduct.includes(item.id)) {
          setCartProduct([...cartProduct, item.id]);
        }
      });
    }

    //Filter product by url
    if (urlId.id === (undefined || null)) {
      byDefoultShowProduct();
    } else if (urlId["short-by-catalogue"].length > 0) {
      //Catalogue Base Filter
      apiProduct.flatMap((items) => {
        if (items.catalogue == urlId["short-by-catalogue"]) {
          setFilterProduct(items.options);
          //Name Base Filter
          if (urlId["name"]) {
            items.options.flatMap((item) => {
              let name = urlId["name"].replace("%20", " ");
              if (item.name == name) {
                setFilterProduct([item]);
              }
            });
          }
        }
      });
    }
  }, [urlId, cartProduct]);

  return (
    <section className="w-full">
      <div className="mx-auto max-w-7xl px-2 py-10 lg:px-10">
        {/* Top */}
        <div className="md:flex md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-xl font-bold">Products</h1>
          </div>
          {/* Top SideBar */}
          <div className="mt-6 flex flex-wrap items-center pt-2 md:mt-0 md:space-x-4  md:pt-0">
            {apiProduct.map((filter) => (
              <Link
                key={filter.id}
                to={`/products/${filter.catalogue}`}
                className="inline-flex items-center rounded-md px-2 py-2 m-1 text-sm font-semibold text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black lg:hidden"
              >
                {filter.catalogue}
              </Link>
            ))}
          </div>
        </div>
        <hr className="my-8" />
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-6">
          {/* Left SideBar */}
          <div className="hidden space-y-6 divide-y lg:col-span-3 lg:block">
            {apiProduct.map((filter) => (
              <div key={filter.id} className="pt-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  {filter.catalogue}
                </h3>
                <ul className="mt-2">
                  {filter.options.map((option) => (
                    <li
                      key={option.name}
                      className="flex items-center justify-between py-2"
                    >
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          onClick={() => addProductInFilterProduct(option)}
                          className="h-4 w-4 rounded border-gray-300 text-black focus:ring-black"
                        />
                        <label
                          htmlFor={`${filter.id}-${option.value}`}
                          className="ml-3 text-sm font-medium text-gray-900"
                        >
                          {option.name}
                        </label>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          {/* Show Product Card */}
          <div className=" w-full rounded-lg border-2 border-dashed px-2 lg:col-span-9 lg:h-full">
            <div className="mx-auto grid w-full max-w-7xl items-center space-y-4 px-2 py-10 md:grid-cols-2 md:gap-6 md:space-y-0 lg:grid-cols-3">
              {filterProduct.map((option) => (
                <div key={option.id} className="rounded-md border">
                  <img
                    src={option.productImg}
                    alt="Laptop"
                    className="aspect-[16/9] w-full rounded-md md:aspect-auto md:h-[300px] lg:h-[200px]"
                  />
                  <div className="p-4">
                    <h1 className="inline-flex items-center text-lg font-semibold">
                      {option.name}
                    </h1>
                    <p className="mt-3 text-sm text-gray-600">
                      {option.discription}
                    </p>
                    <div className="mt-4 ">
                      {option.tag.map((tag) => (
                        <span
                          key={tag}
                          className="mb-2 mr-2 inline-block rounded-full bg-gray-100 px-3 py-1 text-[13px] font-semibold text-gray-900"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    {option.size ? (
                      <div className="mt-5 flex items-center space-x-2">
                        <span className="block text-sm font-semibold">
                          Size :{" "}
                        </span>
                        <span className="block cursor-pointer p-1 px-2 text-s font-medium">
                          {option.size}
                        </span>
                      </div>
                    ) : undefined}
                    <div className="mt-5 flex items-center space-x-2">
                      <span className="block text-xl font-semibold">
                        Price :
                      </span>
                      {option.originalPrice.trim().length > 0 ? (
                        <del className="block text-red-500 cursor-pointer p-1 px-2 text-l font-medium">
                          {option.originalPrice} ₹
                        </del>
                      ) : null}
                      <span className="block text-green-500 cursor-pointer p-1 px-2 text-l font-medium">
                        {option.discountedPrice} ₹
                      </span>
                    </div>
                    {cartProduct.includes(option.id) ? (
                      <div className="flex gap-5 justify-center">
                        <button
                          type="button"
                          onClick={() => removeProductInLocalStorage(option.id)}
                          className=" flex mt-4 w-full text-center rounded-sm bg-black px-2 py-1 font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                        >
                          <BsFillCartXFill className="mr-4 flex text-xl text-center" />
                          Sub
                        </button>
                        <button
                          type="button"
                          onClick={() => addProductInLocalStorage(option.id)}
                          className=" flex mt-4 w-full rounded-sm bg-black px-2 py-1 font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                        >
                          <BsFillCartPlusFill className="mr-4 flex text-xl" />
                          Add
                        </button>
                      </div>
                    ) : (
                      <button
                        type="button"
                        onClick={() => addProductInLocalStorage(option.id)}
                        className="flex justify-center mt-4 w-full rounded-sm bg-black px-2 py-1.5 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
                      >
                        <FaCartShopping className="mr-4 flex text-xl" />
                        Add to Cart
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
