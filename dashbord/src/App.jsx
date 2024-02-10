import "./App.css";
import { Product } from "./components/products/Product";
import SideNaveBar from "./components/sideNavebar/SideNaveBar";
import TopNaveBar from "./components/topNavebar/topNaveBar";

function App() {
  return (
    <div className="flex">
      <SideNaveBar />
      <div className="relative w-full bg-white">
        <TopNaveBar />
        <Product />
      </div>
    </div>
  );
}

export default App;
