import { useEffect, useState } from "react";
import { FaTrashCan, FaRegHeart } from "react-icons/fa6";
import { apiProduct } from "../apiCall/Priduct";
import { useNavigate } from "react-router-dom";
import shoppingEmpty from "../assets/EmptyShopping.png";

export function ShoppingCart() {
  const [product, setProduct] = useState([]);
  const [totalAmount, setTotalAmount] = useState();
  const navigate = useNavigate();

  const updateCart = () => {
    const cart = JSON.parse(localStorage.getItem("cartItems")) || [];
    const cartProducts = cart
      .flatMap((cartItem) => {
        return apiProduct.flatMap((productItem) =>
          productItem.options.map((option) => {
            if (option.id === cartItem.id) {
              option.quantity = cartItem.quantity;
              return option;
            }
            return null;
          })
        );
      })
      .filter((item) => item !== null);
    setProduct(cartProducts);
    setTotalAmount(calculateTotalAmount(cartProducts));
  };

  const calculateTotalAmount = (cartProducts) => {
    return cartProducts.reduce((acc, item) => {
      const productValue =
        (item.discountedPrice || item.originalPrice) * item.quantity;
      return acc + productValue;
    }, 0);
  };

  const removeProductInLocalStorage = (productId) => {
    let cart = JSON.parse(localStorage.getItem("cartItems"));
    if (cart) {
      const updatedCart = cart.filter((item) => item.id !== productId);
      localStorage.setItem("cartItems", JSON.stringify(updatedCart));
      updateCart();
    }
  };

  useEffect(() => {
    updateCart();
  }, []);
  return (
    <div className="fixed top-14 flex justify-center w-screen h-[100%] bg-slate-300 py-10 opacity-95">
      <div className="mx-auto z-50 bg-white rounded-md flex max-w-3xl flex-col mt-2 space-y-4 p-12 px-2 sm:p-10 sm:px-2">
        <h2 className="text-3xl font-bold">Shopping cart</h2>
        <p className="mt-3 text-sm font-medium text-gray-700">
          Freshly Prepared Dishes with Mirch Masala Reach for Something
          Delicious.
        </p>
        {product.length > 0 ? (
          <ul className="flex flex-col divide-y divide-gray-200 overflow-x-auto max-h-96">
            {product.map((product) => (
              <li
                key={product.id}
                className="flex flex-col py-1 sm:flex-row sm:justify-between"
              >
                <div className="flex w-full space-x-2 sm:space-x-4">
                  <img
                    className="h-20 w-20 rounded-lg border border-gray-200 object-contain"
                    src={product.productImg}
                    alt={product.name}
                  />
                  <div className="flex w-full flex-col justify-between pb-4">
                    <div className="flex w-full justify-between space-x-2 pb-2">
                      <div className="space-y-1 flex flex-col text-left">
                        <h3 className="text-lg font-semibold leading-snug sm:pr-8 capitalize">
                          {product.name}
                        </h3>
                        <p className="text-base text-left">
                          Quantity : <strong>{product.quantity}</strong>
                        </p>
                      </div>
                      <br />
                      <div className="text-right">
                        <p className="text-lg font-semibold">
                          {product.quantity *
                            (product.discountedPrice
                              ? product.discountedPrice
                              : product.originalPrice)}
                          &nbsp; ₹
                        </p>
                      </div>
                    </div>
                    <div className="flex divide-x text-sm">
                      <button
                        type="button"
                        onClick={() => removeProductInLocalStorage(product.id)}
                        className="flex items-center space-x-2 px-2 py-1 pl-0"
                      >
                        <FaTrashCan size={16} />
                        <span>Remove</span>
                      </button>
                      <button
                        type="button"
                        className="flex items-center space-x-2 px-2 py-1"
                      >
                        <FaRegHeart size={16} />
                        <span>Add to favorites</span>
                      </button>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div>
            <img src={shoppingEmpty} alt="empty cart" width={270}/>
          </div>
        )}
        <div className="space-y-1 text-right">
          <p>
            Total amount:
            <span className="font-semibold"> ₹ {totalAmount}</span>
          </p>
        </div>
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-md border border-black px-3 py-2 text-sm font-semibold text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            Back to shop
          </button>
          <button
            type="button"
            onClick={() => navigate("/checkout")}
            className="rounded-md border border-black px-3 py-2 text-sm font-semibold text-black shadow-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
