import { useState } from "react";
import { AddProduct } from "./AddProduct";
import AllProduct from "./AllProduct";

export function Product() {
  const [isAddProduct, setIsAddProduct] = useState(false);
  return (
    <>
      <section className="mx-auto w-full max-w-7xl px-4 py-4">
        <div className="flex flex-col space-y-4  md:flex-row md:items-center md:justify-between md:space-y-0">
          <div>
            <h2 className="text-lg font-semibold">All Products</h2>
            <p className="mt-1 text-sm text-gray-700">
              This is a list of all products. You can add new products, edit or
              delete existing ones.
            </p>
          </div>
          <div>
            <button
              type="button"
              onClick={() => setIsAddProduct(!isAddProduct)}
              className="rounded-md bg-black px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-black/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
            >
              Add new products
            </button>
          </div>
        </div>
        {isAddProduct ? <AddProduct /> : <AllProduct />}
      </section>
    </>
  );
}
