import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import ErrorPage from "./pages/Errorspage";
import ProductDetails from "./pages/productDetails";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./component/dashboard";
import ProductPage from "./component/products/product";
import EditProductModal from "./component/products/EditProductModal";
import Categories from "./component/categories/categories";
import EditCateModal from "./component/categories/EditCateModal";
import Checkout from "./pages/Checkout";
import Orders from "./component/orders/order";
import EditOrderModal from "./component/orders/EditOrderModal";
import ViewOrder from "./component/orders/viewOrder";
import InfoPage from "./pages/InfoPage";
import HistoryOrder from "./pages/HistoryOrder";
import HistoryOrderDetails from "./pages/HistoryOrderDetails";

const root = ReactDOM.createRoot(document.getElementById("root"));

const routing = (
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/ProductDetails/:id" element={<ProductDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/info" element={<InfoPage />} />
        <Route path="/history-order" element={<HistoryOrder />} />
        <Route
          path="/history-order-details/:id"
          element={<HistoryOrderDetails />}
        />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/productPage" element={<ProductPage />} />
        <Route path="/edit-products/:id" element={<EditProductModal />} />
        <Route path="/categoryPage" element={<Categories />} />
        <Route path="/edit-category/:id" element={<EditCateModal />} />
        <Route path="/orderPage" element={<Orders />} />
        <Route path="/view-order/:id" element={<ViewOrder />} />
        <Route path="/edit-order/:id" element={<EditOrderModal />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

root.render(routing);

reportWebVitals();
