import AppStoreIcon from "../assets/appstore.png";
import PlayStoreIcon from "../assets/playstore.png";
function Promotion() {
  return (
    <div className="w-full bg-white z-0">
    {/* <div className="relative w-full bg-white z-0"> */}
      <div className="lg:flex justify-between px-4 py-8 sm:px-14">
        <div className="flex justify-center flex-col">
          <h2 className="text-4xl font-semibold items-center text-left">
            Start your free trial Join <br />
            Mirch Masala @ ₹0
          </h2>
          <div className="flex gap-4 py-8 sm:gap-12">
            <img src={PlayStoreIcon} alt="playstore icon" width={162} height={49} className="rounded cursor-pointer"/>
            <img src={AppStoreIcon} alt="appstore icon"  width={162} height={49} className="rounded cursor-pointer"/>
          </div>
        </div>
        <div>
          <img
            src="https://eatclub.in/assets/images/app_link.png"
            alt="Mobile Screen Add"
            width={500}
            height={374}
          />
        </div>
      </div>
    </div>
  );
}

export default Promotion;
