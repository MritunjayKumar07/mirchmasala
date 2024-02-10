import { apiProduct, homeCrousal } from "../apiCall/Priduct";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();
  return (
    <>
      {/* Crousal */}
      <div className="relative mt-24  flex m-8 gap-4 rounded-l overflow-x-auto scroll-smooth snap-x bg-white	">
        {homeCrousal.map((item) => (
          <img
            key={item.id}
            src={item.img}
            alt={item.name}
            className="object-cover snap-center max-h-56 cursor-pointer drop-shadow-2xl border rounded-xl scroll-ml-6  sm:h-72 bg-white	"
          />
        ))}
      </div>

      {/* <Brands /> */}
      <section className="relative overflow-hidden p-10 bg-white	">
        <div className="flex p-2 flex-col max-w-8xl justify-between items-start">
          <div className="flex flex-col items-start gap-3 shrink-0 py-12">
            <strong className="items-center text-center text-2xl font-bold leading-3">
              Category
            </strong>
            <p className="items-center text-base leading-6 font-medium">
              Order food from mirch masala
            </p>
          </div>
          <div className="flex items-center gap-5 content-center self-stretch flex-wrap">
            {apiProduct.map((item) => (
              <img
                key={item.id}
                src={item.img}
                alt="category banner"
                className="h-96 rounded cursor-pointer"
                onClick={() => navigate(`products/${item.catalogue}`)}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
