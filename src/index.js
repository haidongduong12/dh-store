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

const root = ReactDOM.createRoot(document.getElementById("root"));

const routing = (
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/ProductDetails/:id" element={<ProductDetails />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/productPage" element={<ProductPage />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/edit-products/:id" element={<EditProductModal />} />
        <Route path="/categoryPage" element={<Categories />} />
        <Route path="/edit-category/:id" element={<EditCateModal />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

root.render(routing);

reportWebVitals();
