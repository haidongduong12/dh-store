import React, { Fragment, useEffect, useState } from "react";

import off1 from "../theme/bootstrap-shop-template/bootstrap-shop-template/img/offer-1.png";
import off2 from "../theme/bootstrap-shop-template/bootstrap-shop-template/img/offer-2.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Pagination } from "@mui/material";

const Main = () => {
  const [productAll, setProductAll] = useState([]);
  const infoUser = JSON.parse(localStorage.getItem("user"));
  const idUser = infoUser ? infoUser.id : null;

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 4;

  const [category, setCategory] = useState([]);

  const navigate = useNavigate();

  const fetchAllProduct = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/react/show-product"
      );
      setProductAll(response.data);
    } catch (error) {
      console.error("Error fetching product !");
    }
  };

  const fetchCategory = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/react/show-category"
      );
      setCategory(response.data);
      console.log(category);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchAllProduct();
    fetchCategory();
  }, []);

  const detailsPage = (productId) => {
    navigate(`/ProductDetails/${productId}`);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = productAll.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(productAll.length / productsPerPage);

  const addToCart = async (productId) => {
    try {
      const response = await axios.post(
        "http://localhost:8081/react/add-to-cart",
        {
          userId: idUser,
          productId: productId,
          quantity: 1,
        }
      );
      alert("Add to cart successfully !");
      navigate("/cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  return (
    <div>
      <>
        {/* Featured Start */}
        <div className="container-fluid pt-5">
          <div className="row px-xl-5 pb-3">
            <div className="col-lg-3 col-md-6 col-sm-12 pb-1">
              <div
                className="d-flex align-items-center border mb-4"
                style={{ padding: 30 }}
              >
                <h1 className="fa fa-check text-primary m-0 mr-3" />
                <h5 className="font-weight-semi-bold m-0">Quality Product</h5>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12 pb-1">
              <div
                className="d-flex align-items-center border mb-4"
                style={{ padding: 30 }}
              >
                <h1 className="fa fa-shipping-fast text-primary m-0 mr-2" />
                <h5 className="font-weight-semi-bold m-0">Free Shipping</h5>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12 pb-1">
              <div
                className="d-flex align-items-center border mb-4"
                style={{ padding: 30 }}
              >
                <h1 className="fas fa-exchange-alt text-primary m-0 mr-3" />
                <h5 className="font-weight-semi-bold m-0">14-Day Return</h5>
              </div>
            </div>
            <div className="col-lg-3 col-md-6 col-sm-12 pb-1">
              <div
                className="d-flex align-items-center border mb-4"
                style={{ padding: 30 }}
              >
                <h1 className="fa fa-phone-volume text-primary m-0 mr-3" />
                <h5 className="font-weight-semi-bold m-0">24/7 Support</h5>
              </div>
            </div>
          </div>
        </div>
        {/* Featured End */}
        {/* Categories Start */}
        <div className="container-fluid pt-5">
          <div className="row px-xl-5 pb-3">
            {category.map((item, index) => (
              <div className="col-lg-4 col-md-6 pb-1" key={index}>
                <div
                  className="cat-item d-flex flex-column border mb-4"
                  style={{ padding: 30 }}
                >
                  <p className="text-right">15 Products</p>
                  <a
                    href=""
                    className="cat-img position-relative overflow-hidden mb-3"
                  >
                    <img
                      className="img-fluid"
                      src={`../uploads/${item.category_image}`}
                      alt={item.category_name}
                    />
                  </a>
                  <h5 className="font-weight-semi-bold m-0">
                    {item.category_name}
                  </h5>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Categories End */}
        {/* Offer Start */}
        <div className="container-fluid offer pt-5">
          <div className="row px-xl-5">
            <div className="col-md-6 pb-4">
              <div className="position-relative bg-secondary text-center text-md-right text-white mb-2 py-5 px-5">
                <img src={off1} alt="ImageBanner" />
                <div className="position-relative" style={{ zIndex: 1 }}>
                  <h5 className="text-uppercase text-primary mb-3">
                    20% off the all order
                  </h5>
                  <h1 className="mb-4 font-weight-semi-bold">
                    Spring Collection
                  </h1>
                  <a
                    href=""
                    className="btn btn-outline-primary py-md-2 px-md-3"
                  >
                    Shop Now
                  </a>
                </div>
              </div>
            </div>
            <div className="col-md-6 pb-4">
              <div className="position-relative bg-secondary text-center text-md-left text-white mb-2 py-5 px-5">
                <img src={off2} alt="ImageBanner" />
                <div className="position-relative" style={{ zIndex: 1 }}>
                  <h5 className="text-uppercase text-primary mb-3">
                    20% off the all order
                  </h5>
                  <h1 className="mb-4 font-weight-semi-bold">
                    Winter Collection
                  </h1>
                  <a
                    href=""
                    className="btn btn-outline-primary py-md-2 px-md-3"
                  >
                    Shop Now
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Offer End */}
        {/* Products Start */}
        <div className="container-fluid pt-5">
          <div className="text-center mb-4">
            <h2 className="section-title px-5">
              <span className="px-2">Trandy Products</span>
            </h2>
          </div>
          <div className="row px-xl-5 pb-3">
            {currentProducts.map((product, index) => (
              <div
                key={product.id}
                className="col-lg-3 col-md-6 col-sm-12 pb-1"
              >
                <div className="card product-item border-0 mb-4">
                  <div className="card-header product-img position-relative overflow-hidden bg-transparent border p-0">
                    <a href={`ProductDetails/${product.id}`}>
                      <img
                        className="img-fluid w-100"
                        src={`../uploads/${product.product_image}`}
                        alt={product.product_name}
                      />
                    </a>
                  </div>
                  <div className="card-body border-left border-right text-center p-0 pt-4 pb-3">
                    <a href={`ProductDetails/${product.id}`}>
                      <h6 className="text-truncate mb-3">
                        {product.product_name}
                      </h6>
                    </a>
                    <div className="d-flex justify-content-center">
                      <h6>${product.product_price}</h6>
                      <h6 className="text-muted ml-2">
                        <del>$ {(product.product_price / 0.8).toFixed(2)}</del>
                      </h6>
                    </div>
                  </div>
                  <div className="card-footer d-flex justify-content-between bg-light border">
                    <button
                      href="#"
                      className="btn btn-sm text-dark p-0"
                      onClick={() => detailsPage(product.id)}
                    >
                      <i className="fas fa-eye text-primary mr-1"></i> View
                      Detail
                    </button>
                    <button
                      onClick={() => addToCart(product.id)}
                      className="btn btn-sm text-dark p-0"
                    >
                      <i className="fas fa-shopping-cart text-primary mr-1"></i>
                      Add To Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="d-flex justify-content-center">
            <Pagination
              count={totalPages}
              page={currentPage}
              onChange={handlePageChange}
              color="primary"
            />
          </div>
        </div>
        {/* Products End */}
      </>
    </div>
  );
};

export default Main;
