import "./theme/bootstrap-shop-template/bootstrap-shop-template/css/style.css";
import "./theme/bootstrap-shop-template/bootstrap-shop-template/lib/owlcarousel/assets/owl.carousel.min.css";

import Header from "./component/header";
import Footer from "./component/footer";
import Main from "./component/main";
import Slider from "./component/slider";

function App() {
  return (
    <div className="App">
      <Header />
      <Slider />
      <Main />
      <Footer />
    </div>
  );
}

export default App;
