import React, { useEffect, useState } from "react";
import Footer from "../component/footer";
import Header from "../component/header";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Pagination } from "@mui/material";

const Shop = () => {
  const [productAll, setProductAll] = useState([]);
  const [currentProducts, setCurrentProducts] = useState([]);

  const infoUser = JSON.parse(localStorage.getItem("user"));
  const idUser = infoUser ? infoUser.id : null;

  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 9;
  const [priceRange, setPriceRange] = useState({ min: 0, max: Infinity });

  const [categories, setCategories] = useState([]);

  const [selectedCategories, setSelectedCategories] = useState([]);

  const calculatePriceCounts = (products) => {
    const counts = {
      all: products.length,
      "0-100": products.filter(
        (product) => product.product_price >= 0 && product.product_price < 100
      ).length,
      "100-200": products.filter(
        (product) => product.product_price >= 100 && product.product_price < 200
      ).length,
      "200-300": products.filter(
        (product) => product.product_price >= 200 && product.product_price < 300
      ).length,
      "300-400": products.filter(
        (product) => product.product_price >= 300 && product.product_price < 400
      ).length,
      "400-500": products.filter(
        (product) => product.product_price >= 400 && product.product_price < 500
      ).length,
    };
    return counts;
  };

  const [priceCounts, setPriceCounts] = useState({
    all: 0,
    "0-100": 0,
    "100-200": 0,
    "200-300": 0,
    "300-400": 0,
    "400-500": 0,
  });

  const [sortCriteria, setSortCriteria] = useState("High to Low");

  const sortProducts = (products, criteria) => {
    switch (criteria) {
      case "High to Low":
        return products.sort((a, b) => b.product_price - a.product_price);
      case "Low to High":
        return products.sort((a, b) => a.product_price - b.product_price);
      default:
        return products;
    }
  };

  const navigate = useNavigate();

  const fetchAllProduct = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/react/show-product"
      );
      setProductAll(response.data);
      setPriceCounts(calculatePriceCounts(response.data));
    } catch (error) {
      console.error("Error fetching product !");
    }
  };

  const fetchCategory = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/react/show-category"
      );
      setCategories(response.data);
      console.log(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const filterProductsByPrice = (products, range) => {
    return products.filter(
      (product) =>
        product.product_price >= range.min && product.product_price <= range.max
    );
  };

  const filterProductsByCategory = (products, range, categories) => {
    return products
      .filter(
        (product) =>
          product.product_price >= range.min &&
          product.product_price <= range.max
      )
      .filter(
        (product) =>
          categories.length === 0 || categories.includes(product.category_id)
      );
  };

  useEffect(() => {
    fetchAllProduct();
    fetchCategory();
  }, []);

  useEffect(() => {
    setCurrentProducts(filterProductsByPrice(productAll, priceRange));
  }, [productAll, priceRange]);

  useEffect(() => {
    const filteredProducts = filterProductsByCategory(
      productAll,
      priceRange,
      selectedCategories
    );
    const sortedProducts = sortProducts(filteredProducts, sortCriteria);
    setCurrentProducts(sortedProducts);
  }, [productAll, priceRange, sortCriteria, selectedCategories]);

  const handlePriceFilterChange = (min, max) => {
    setPriceRange({ min, max });
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const handleCategoryFilterChange = (categoryId) => {
    setSelectedCategories((prevCategories) => {
      if (prevCategories.includes(categoryId)) {
        // Remove category if already selected
        return prevCategories.filter((id) => id !== categoryId);
      } else {
        // Add category if not selected
        return [...prevCategories, categoryId];
      }
    });
  };

  const detailsPage = (productId) => {
    navigate(`/ProductDetails/${productId}`);
  };

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

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentDisplayProducts = currentProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(currentProducts.length / productsPerPage);
  return (
    <div>
      <Header />
      <>
        {/* Page Header Start */}
        <div className="container-fluid bg-secondary mb-5">
          <div
            className="d-flex flex-column align-items-center justify-content-center"
            style={{ minHeight: 300 }}
          >
            <h1 className="font-weight-semi-bold text-uppercase mb-3">
              Our Shop
            </h1>
            <div className="d-inline-flex">
              <p className="m-0">
                <a href="">Home</a>
              </p>
              <p className="m-0 px-2">-</p>
              <p className="m-0">Shop</p>
            </div>
          </div>
        </div>
        {/* Page Header End */}
        {/* Shop Start */}
        <div className="container-fluid pt-5">
          <div className="row px-xl-5">
            {/* Shop Sidebar Start */}
            <div className="col-lg-3 col-md-12">
              {/* Price Start */}
              <div className="border-bottom mb-4 pb-4">
                <h5 className="font-weight-semi-bold mb-4">Filter by price</h5>
                <form>
                  <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id="price-all"
                      onChange={() => handlePriceFilterChange(0, Infinity)}
                    />
                    <label className="custom-control-label" htmlFor="price-all">
                      All Price
                    </label>
                    <span className="badge border font-weight-normal">
                      {priceCounts.all}
                    </span>
                  </div>
                  <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id="price-1"
                      onChange={() => handlePriceFilterChange(0, 100)}
                    />
                    <label className="custom-control-label" htmlFor="price-1">
                      $0 - $100
                    </label>
                    <span className="badge border font-weight-normal">
                      {priceCounts["0-100"]}
                    </span>
                  </div>
                  <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id="price-2"
                      onChange={() => handlePriceFilterChange(100, 200)}
                    />
                    <label className="custom-control-label" htmlFor="price-2">
                      $100 - $200
                    </label>
                    <span className="badge border font-weight-normal">
                      {priceCounts["100-200"]}
                    </span>
                  </div>
                  <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id="price-3"
                      onChange={() => handlePriceFilterChange(200, 300)}
                    />
                    <label className="custom-control-label" htmlFor="price-3">
                      $200 - $300
                    </label>
                    <span className="badge border font-weight-normal">
                      {priceCounts["200-300"]}
                    </span>
                  </div>
                  <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id="price-4"
                      onChange={() => handlePriceFilterChange(300, 400)}
                    />
                    <label className="custom-control-label" htmlFor="price-4">
                      $300 - $400
                    </label>
                    <span className="badge border font-weight-normal">
                      {priceCounts["300-400"]}
                    </span>
                  </div>
                  <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id="price-5"
                      onChange={() => handlePriceFilterChange(400, 500)}
                    />
                    <label className="custom-control-label" htmlFor="price-5">
                      $400 - $500
                    </label>
                    <span className="badge border font-weight-normal">
                      {priceCounts["400-500"]}
                    </span>
                  </div>
                </form>
              </div>
              {/* Price End */}
              {/* Color Start */}
              <div className="border-bottom mb-4 pb-4">
                <h5 className="font-weight-semi-bold mb-4">
                  Filter by Categories
                </h5>
                <form>
                  <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      defaultChecked=""
                      id="color-all"
                    />
                    <label className="custom-control-label" htmlFor="price-all">
                      All Categories
                    </label>
                    <span className="badge border font-weight-normal">
                      {categories.length}
                    </span>
                  </div>
                  {categories && categories.length > 0 ? (
                    <>
                      {categories.map((item) => (
                        <div
                          key={item.id}
                          className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3"
                        >
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            id={`category-${item.id}`}
                            checked={selectedCategories.includes(item.id)}
                            onChange={() => handleCategoryFilterChange(item.id)}
                          />
                          <label
                            className="custom-control-label"
                            htmlFor={`category-${item.id}`}
                          >
                            {item.category_name}
                          </label>
                          <span className="badge border font-weight-normal">
                            {/* Assuming you have a count for each category */}
                          </span>
                        </div>
                      ))}
                    </>
                  ) : (
                    <></>
                  )}
                </form>
              </div>
              {/* Categories
               End */}
              {/* Size Start */}
              {/* <div className="mb-5">
                <h5 className="font-weight-semi-bold mb-4">Filter by size</h5>
                <form>
                  <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      defaultChecked=""
                      id="size-all"
                    />
                    <label className="custom-control-label" htmlFor="size-all">
                      All Size
                    </label>
                    <span className="badge border font-weight-normal">
                      1000
                    </span>
                  </div>
                  <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id="size-1"
                    />
                    <label className="custom-control-label" htmlFor="size-1">
                      XS
                    </label>
                    <span className="badge border font-weight-normal">150</span>
                  </div>
                  <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id="size-2"
                    />
                    <label className="custom-control-label" htmlFor="size-2">
                      S
                    </label>
                    <span className="badge border font-weight-normal">295</span>
                  </div>
                  <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id="size-3"
                    />
                    <label className="custom-control-label" htmlFor="size-3">
                      M
                    </label>
                    <span className="badge border font-weight-normal">246</span>
                  </div>
                  <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id="size-4"
                    />
                    <label className="custom-control-label" htmlFor="size-4">
                      L
                    </label>
                    <span className="badge border font-weight-normal">145</span>
                  </div>
                  <div className="custom-control custom-checkbox d-flex align-items-center justify-content-between">
                    <input
                      type="checkbox"
                      className="custom-control-input"
                      id="size-5"
                    />
                    <label className="custom-control-label" htmlFor="size-5">
                      XL
                    </label>
                    <span className="badge border font-weight-normal">168</span>
                  </div>
                </form>
              </div> */}
              {/* Size End */}
            </div>
            {/* Shop Sidebar End */}
            {/* Shop Product Start */}
            <div className="col-lg-9 col-md-12">
              <div className="row pb-3">
                <div className="col-12 pb-1">
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    {/* <form action="">
                      <div className="input-group">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Search by name"
                        />
                        <div className="input-group-append">
                          <span className="input-group-text bg-transparent text-primary">
                            <i className="fa fa-search" />
                          </span>
                        </div>
                      </div>
                    </form> */}
                    <div className="dropdown ml-4">
                      <button
                        className="btn border dropdown-toggle"
                        type="button"
                        id="triggerId"
                        data-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        Sort by
                      </button>
                      <div
                        className="dropdown-menu dropdown-menu-right"
                        aria-labelledby="triggerId"
                      >
                        <button
                          className="dropdown-item"
                          onClick={() => setSortCriteria("High to Low")}
                        >
                          High to Low
                        </button>
                        <button
                          className="dropdown-item"
                          onClick={() => setSortCriteria("Low to High")}
                        >
                          Low to High
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                {currentDisplayProducts.map((product, index) => (
                  <div key={index} className="col-lg-4 col-md-6 col-sm-12 pb-1">
                    <div className="card product-item border-0 mb-4">
                      <div className="card-header product-img position-relative overflow-hidden bg-transparent border p-0">
                        <img
                          className="img-fluid w-100"
                          src={`../uploads/${product.product_image}`}
                          alt=""
                        />
                      </div>
                      <div className="card-body border-left border-right text-center p-0 pt-4 pb-3">
                        <h6 className="text-truncate mb-3">
                          {product.product_name}
                        </h6>
                        <div className="d-flex justify-content-center">
                          <h6>${product.product_price}</h6>
                          <h6 className="text-muted ml-2">
                            <del>
                              $ {(product.product_price / 0.8).toFixed(2)}
                            </del>
                          </h6>
                        </div>
                      </div>
                      <div className="card-footer d-flex justify-content-between bg-light border">
                        <button
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
                <div className="col-12 pb-1">
                  <Pagination
                    className="pagination justify-content-center mb-3"
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                    color="primary"
                  />
                </div>
                {/* <div className="col-12 pb-1">
                  <nav aria-label="Page navigation">
                    <ul className="pagination justify-content-center mb-3">
                      <li className="page-item disabled">
                        <a className="page-link" href="#" aria-label="Previous">
                          <span aria-hidden="true">«</span>
                          <span className="sr-only">Previous</span>
                        </a>
                      </li>
                      <li className="page-item active">
                        <a className="page-link" href="#">
                          1
                        </a>
                      </li>
                      <li className="page-item">
                        <a className="page-link" href="#">
                          2
                        </a>
                      </li>
                      <li className="page-item">
                        <a className="page-link" href="#">
                          3
                        </a>
                      </li>
                      <li className="page-item">
                        <a className="page-link" href="#" aria-label="Next">
                          <span aria-hidden="true">»</span>
                          <span className="sr-only">Next</span>
                        </a>
                      </li>
                    </ul>
                  </nav>
                </div> */}
              </div>
            </div>
            {/* Shop Product End */}
          </div>
          <Footer />
        </div>
        {/* Shop End */}
      </>
    </div>
  );
};

export default Shop;
