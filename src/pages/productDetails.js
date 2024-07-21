import React, { useState, useEffect, Fragment } from "react";
import Header from "../component/header";
import Footer from "../component/footer";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Pagination } from "@mui/material";
const ProductDetails = () => {
  const [product, setProduct] = useState();
  const [relatedProduct, setrelatedProduct] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const { id } = useParams();
  const infoUser = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const idUser = infoUser ? infoUser.id : null;
  const [errors, setErrors] = useState({});
  const [reviews, setReviews] = useState([]);
  const [formData, setFormData] = useState({
    reviewText: "",
    userId: idUser,
    product_id: id,
    reviewRating: 0,
  });

  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(4);

  const fetchProductId = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/react/show-product/${id}`
      );
      setProduct(response.data);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };
  //
  const fetchRelatedProduct = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/react/related-products/${id}`
      );
      setrelatedProduct(response.data);
      console.log(relatedProduct);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const fetchComment = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/react/comments/${id}`
      );
      setReviews(response.data);
      // console.log(reviews);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const handleInputChange = (event) => {
    const value = parseInt(event.target.value, 10);
    if (value <= product.product_quantity) {
      setQuantity(value);
    } else {
      setQuantity(product.product_quantity);
    }
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const increaseQuantity = () => {
    if (quantity < product.product_quantity) {
      setQuantity(quantity + 1);
    }
  };

  const addToCart = async () => {
    try {
      const response = await axios.post(
        "http://localhost:8081/react/add-to-cart",
        {
          userId: idUser,
          productId: product.id,
          quantity: quantity,
        }
      );
      alert("Add to cart successfully!");
      navigate("/cart");
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  useEffect(() => {
    fetchProductId();
    fetchRelatedProduct();
    fetchComment();
  }, [id]);

  // Pagination

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = relatedProduct.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(relatedProduct.length / productsPerPage);

  const handleReviewSubmit = async (event) => {
    event.preventDefault();

    if (formData.reviewRating === 0) {
      setErrors({ reviewRating: "Please select a rating" });
      return;
    }
    if (!formData.reviewText.trim()) {
      setErrors({ reviewText: "Review text is required" });
      return;
    }

    try {
      // Gửi request POST đến API để thêm đánh giá
      const response = await axios.post(
        `http://localhost:8081/react/add-review/${id}`,
        {
          product_id: formData.product_id,
          userId: formData.userId,
          rating: formData.reviewRating,
          review: formData.reviewText,
        }
      );

      // Xử lý khi gửi thành công
      alert("Review submitted successfully!");

      // In ra các giá trị trong formData để kiểm tra
      console.log("Submitted Review Data:", {
        product_id: formData.product_id,
        userId: formData.userId,
        rating: formData.reviewRating,
        review: formData.reviewText,
      });

      // Reset formData sau khi gửi thành công
      setFormData({
        reviewText: "",
        reviewRating: 0,
        userId: idUser, // Khôi phục userId nếu bạn muốn
        product_id: id, // Khôi phục product_id nếu bạn muốn
      });
      setErrors({});

      // Cập nhật danh sách reviews sau khi gửi thành công (nếu cần)
      // fetchReviews();
    } catch (error) {
      if (error.response && error.response.status === 403) {
        setErrors({ statusComments: "User has not purchased this product" });
        // alert("User has not purchased this product");
      } else {
        console.error("Error submitting review:", error);
        // Xử lý các lỗi khác nếu cần
      }
    }
  };
  const handleClick = (value) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      reviewRating: value,
    }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

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
              Shop Detail
            </h1>
            <div className="d-inline-flex">
              <p className="m-0">
                <a href="">Home</a>
              </p>
              <p className="m-0 px-2">-</p>
              <p className="m-0">Shop Detail</p>
            </div>
          </div>
        </div>
        {/* Page Header End */}
        {/* Shop Detail Start */}
        {product ? (
          <Fragment key={id}>
            <div className="container-fluid py-5">
              <div className="row px-xl-5">
                <div className="col-lg-5 pb-5">
                  <div
                    id="product-carousel"
                    className="carousel slide"
                    data-ride="carousel"
                  >
                    <div className="carousel-inner border">
                      <div className="carousel-item active">
                        <img
                          className="w-100 h-100"
                          src={`../uploads/${product.product_image}`}
                          alt={product.product_name}
                        />
                      </div>
                      {/* <div className="carousel-item">
                        <img
                          className="w-100 h-100"
                          src="fruit-store/public/logo192.png"
                          alt="logo"
                        />
                      </div> */}
                      {/* <div className="carousel-item">
                        <img
                          className="w-100 h-100"
                          src="img/product-3.jpg"
                          alt="Image"
                        />
                      </div>
                      <div className="carousel-item">
                        <img
                          className="w-100 h-100"
                          src="img/product-4.jpg"
                          alt="Image"
                        />
                      </div> */}
                    </div>
                    <a
                      className="carousel-control-prev"
                      href="#product-carousel"
                      data-slide="prev"
                    >
                      <i className="fa fa-2x fa-angle-left text-dark" />
                    </a>
                    <a
                      className="carousel-control-next"
                      href="#product-carousel"
                      data-slide="next"
                    >
                      <i className="fa fa-2x fa-angle-right text-dark" />
                    </a>
                  </div>
                </div>
                <div className="col-lg-7 pb-5">
                  <h3 className="font-weight-semi-bold">
                    {product.product_name}
                  </h3>
                  <div className="d-flex mb-3">
                    <div className="text-primary mr-2">
                      <small className="fas fa-star" />
                      <small className="fas fa-star" />
                      <small className="fas fa-star" />
                      <small className="fas fa-star-half-alt" />
                      <small className="far fa-star" />
                    </div>
                    <small className="pt-1">(50 Reviews)</small>
                  </div>
                  <h3 className="font-weight-semi-bold mb-4">
                    $ {product.product_price.toFixed(2)}
                  </h3>
                  <p className="mb-4">
                    Volup erat ipsum diam elitr rebum et dolor. Est nonumy elitr
                    erat diam stet sit clita ea. Sanc invidunt ipsum et, labore
                    clita lorem magna lorem ut. Erat lorem duo dolor no sea
                    nonumy. Accus labore stet, est lorem sit diam sea et justo,
                    amet at lorem et eirmod ipsum diam et rebum kasd rebum.
                  </p>
                  <div className="d-flex mb-3">
                    <p className="text-dark font-weight-medium mb-0 mr-3">
                      Sizes:
                    </p>
                    <form>
                      <div className="custom-control custom-radio custom-control-inline">
                        <input
                          type="radio"
                          className="custom-control-input"
                          id="size-1"
                          name="size"
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="size-1"
                        >
                          XS
                        </label>
                      </div>
                      <div className="custom-control custom-radio custom-control-inline">
                        <input
                          type="radio"
                          className="custom-control-input"
                          id="size-2"
                          name="size"
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="size-2"
                        >
                          S
                        </label>
                      </div>
                      <div className="custom-control custom-radio custom-control-inline">
                        <input
                          type="radio"
                          className="custom-control-input"
                          id="size-3"
                          name="size"
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="size-3"
                        >
                          M
                        </label>
                      </div>
                      <div className="custom-control custom-radio custom-control-inline">
                        <input
                          type="radio"
                          className="custom-control-input"
                          id="size-4"
                          name="size"
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="size-4"
                        >
                          L
                        </label>
                      </div>
                      <div className="custom-control custom-radio custom-control-inline">
                        <input
                          type="radio"
                          className="custom-control-input"
                          id="size-5"
                          name="size"
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="size-5"
                        >
                          XL
                        </label>
                      </div>
                    </form>
                  </div>
                  <div className="d-flex mb-4">
                    <p className="text-dark font-weight-medium mb-0 mr-3">
                      Colors:
                    </p>
                    <form>
                      <div className="custom-control custom-radio custom-control-inline">
                        <input
                          type="radio"
                          className="custom-control-input"
                          id="color-1"
                          name="color"
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="color-1"
                        >
                          Black
                        </label>
                      </div>
                      <div className="custom-control custom-radio custom-control-inline">
                        <input
                          type="radio"
                          className="custom-control-input"
                          id="color-2"
                          name="color"
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="color-2"
                        >
                          White
                        </label>
                      </div>
                      <div className="custom-control custom-radio custom-control-inline">
                        <input
                          type="radio"
                          className="custom-control-input"
                          id="color-3"
                          name="color"
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="color-3"
                        >
                          Red
                        </label>
                      </div>

                      <div className="custom-control custom-radio custom-control-inline">
                        <input
                          type="radio"
                          className="custom-control-input"
                          id="color-4"
                          name="color"
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="color-4"
                        >
                          Blue
                        </label>
                      </div>
                      <div className="custom-control custom-radio custom-control-inline">
                        <input
                          type="radio"
                          className="custom-control-input"
                          id="color-5"
                          name="color"
                        />
                        <label
                          className="custom-control-label"
                          htmlFor="color-5"
                        >
                          Green
                        </label>
                      </div>
                    </form>
                  </div>
                  <div className="d-flex mb-4">
                    <p className="text-dark font-weight-medium mb-0 mr-3">
                      Qty in stock:
                    </p>
                    <p> {product.product_quantity}</p>
                  </div>
                  <div className="d-flex align-items-center mb-4 pt-2">
                    <div
                      className="input-group quantity mr-3"
                      style={{ width: 130 }}
                    >
                      <div className="input-group-btn">
                        <button
                          className="btn btn-primary btn-minus"
                          onClick={decreaseQuantity}
                        >
                          <i className="fa fa-minus" />
                        </button>
                      </div>
                      <input
                        type="number"
                        className="form-control bg-secondary text-center"
                        defaultValue={1}
                        value={quantity}
                        onChange={handleInputChange}
                        max={product.product_quantity}
                      />
                      <div className="input-group-btn">
                        <button
                          className="btn btn-primary btn-plus"
                          onClick={increaseQuantity}
                        >
                          <i className="fa fa-plus" />
                        </button>
                      </div>
                    </div>
                    {infoUser ? (
                      <>
                        <button
                          className="btn btn-primary px-3"
                          onClick={() => addToCart()}
                        >
                          <i className="fa fa-shopping-cart mr-1" /> Add To Cart
                        </button>
                      </>
                    ) : (
                      <>
                        <a className="btn btn-primary px-3" href="/login">
                          <i className="fa fa-shopping-cart mr-1" /> Add To Cart
                        </a>
                      </>
                    )}
                  </div>
                  <div className="d-flex pt-2">
                    <p className="text-dark font-weight-medium mb-0 mr-2">
                      Share on:
                    </p>
                    <div className="d-inline-flex">
                      <a className="text-dark px-2" href="">
                        <i className="fab fa-facebook-f" />
                      </a>
                      <a className="text-dark px-2" href="">
                        <i className="fab fa-twitter" />
                      </a>
                      <a className="text-dark px-2" href="">
                        <i className="fab fa-linkedin-in" />
                      </a>
                      <a className="text-dark px-2" href="">
                        <i className="fab fa-pinterest" />
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row px-xl-5">
                <div className="col">
                  <div className="nav nav-tabs justify-content-center border-secondary mb-4">
                    <a
                      className="nav-item nav-link active"
                      data-toggle="tab"
                      href="#tab-pane-1"
                    >
                      Description
                    </a>
                    <a
                      className="nav-item nav-link"
                      data-toggle="tab"
                      href="#tab-pane-2"
                    >
                      Information
                    </a>
                    <a
                      className="nav-item nav-link"
                      data-toggle="tab"
                      href="#tab-pane-3"
                    >
                      Reviews ({reviews.length})
                    </a>
                  </div>
                  <div className="tab-content">
                    <div className="tab-pane fade show active" id="tab-pane-1">
                      <h4 className="mb-3">Product Description</h4>
                      <p>{product.product_description}</p>
                    </div>
                    <div className="tab-pane fade" id="tab-pane-2">
                      <h4 className="mb-3">Additional Information</h4>
                      <p>
                        Eos no lorem eirmod diam diam, eos elitr et gubergren
                        diam sea. Consetetur vero aliquyam invidunt duo dolores
                        et duo sit. Vero diam ea vero et dolore rebum, dolor
                        rebum eirmod consetetur invidunt sed sed et, lorem duo
                        et eos elitr, sadipscing kasd ipsum rebum diam. Dolore
                        diam stet rebum sed tempor kasd eirmod. Takimata kasd
                        ipsum accusam sadipscing, eos dolores sit no ut diam
                        consetetur duo justo est, sit sanctus diam tempor
                        aliquyam eirmod nonumy rebum dolor accusam, ipsum kasd
                        eos consetetur at sit rebum, diam kasd invidunt tempor
                        lorem, ipsum lorem elitr sanctus eirmod takimata dolor
                        ea invidunt.
                      </p>
                      <div className="row">
                        <div className="col-md-6">
                          <ul className="list-group list-group-flush">
                            <li className="list-group-item px-0">
                              Sit erat duo lorem duo ea consetetur, et eirmod
                              takimata.
                            </li>
                            <li className="list-group-item px-0">
                              Amet kasd gubergren sit sanctus et lorem eos
                              sadipscing at.
                            </li>
                            <li className="list-group-item px-0">
                              Duo amet accusam eirmod nonumy stet et et stet
                              eirmod.
                            </li>
                            <li className="list-group-item px-0">
                              Takimata ea clita labore amet ipsum erat justo
                              voluptua. Nonumy.
                            </li>
                          </ul>
                        </div>
                        <div className="col-md-6">
                          <ul className="list-group list-group-flush">
                            <li className="list-group-item px-0">
                              Sit erat duo lorem duo ea consetetur, et eirmod
                              takimata.
                            </li>
                            <li className="list-group-item px-0">
                              Amet kasd gubergren sit sanctus et lorem eos
                              sadipscing at.
                            </li>
                            <li className="list-group-item px-0">
                              Duo amet accusam eirmod nonumy stet et et stet
                              eirmod.
                            </li>
                            <li className="list-group-item px-0">
                              Takimata ea clita labore amet ipsum erat justo
                              voluptua. Nonumy.
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="tab-pane fade" id="tab-pane-3">
                      <div className="row">
                        <div className="col-md-6">
                          <h4 className="mb-4">
                            {reviews.length} review(s) for{" "}
                            {product.product_name}
                          </h4>
                          {reviews.map((review) => (
                            <div className="media mb-4" key={review.id}>
                              {/* <img
                                src="img/user.jpg"
                                alt="User"
                                className="img-fluid mr-3 mt-1"
                                style={{ width: 45 }}
                              /> */}
                              <div className="media-body">
                                <h6>
                                  {review.username}{" "}
                                  <small>
                                    {" "}
                                    - <i>{review.created_at}</i>
                                  </small>
                                </h6>
                                <div className="text-primary mb-2">
                                  {[...Array(review.rating)].map((_, index) => (
                                    <i
                                      key={index}
                                      className="fas fa-star text-warning"
                                    />
                                  ))}
                                  {[...Array(5 - review.rating)].map(
                                    (_, index) => (
                                      <i
                                        key={index + review.rating}
                                        className="far fa-star text-warning"
                                      />
                                    )
                                  )}
                                </div>
                                <p>{review.review}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="col-md-6">
                          <form onSubmit={handleReviewSubmit}>
                            <h4 className="mb-4">Leave a review</h4>

                            <div className="form-group">
                              <label>Your Rating *</label>
                              {errors.reviewRating && (
                                <div className="alert alert-danger">
                                  {errors.reviewRating}
                                </div>
                              )}

                              <div>
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <span
                                    key={star}
                                    onClick={() => handleClick(star)}
                                    style={{
                                      cursor: "pointer",
                                      color:
                                        formData.reviewRating >= star
                                          ? "gold"
                                          : "gray",
                                      fontSize: "32px",
                                    }}
                                  >
                                    ★
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="form-group">
                              {errors.reviewText && (
                                <div className="alert alert-danger">
                                  {errors.reviewText}
                                </div>
                              )}

                              <label htmlFor="reviewText">Your Review *</label>
                              <textarea
                                id="reviewText"
                                name="reviewText"
                                cols={30}
                                rows={5}
                                className="form-control"
                                value={formData.reviewText}
                                onChange={handleChange}
                              />
                            </div>
                            {/* <div className="form-group">
                              <label htmlFor="reviewName">Your Name *</label>
                              <input
                                type="text"
                                className="form-control"
                                id="reviewName"
                                name="reviewName"
                                value={formData.reviewName}
                                onChange={handleChange}
                              />
                            </div>
                            <div className="form-group">
                              <label htmlFor="reviewEmail">Your Email *</label>
                              <input
                                type="email"
                                className="form-control"
                                id="reviewEmail"
                                name="reviewEmail"
                                value={formData.reviewEmail}
                                onChange={handleChange}
                              />
                            </div> */}
                            {errors.statusComments && (
                              <p className="alert alert-danger">
                                {errors.statusComments}
                              </p>
                            )}

                            <div className="form-group mb-0">
                              <input
                                type="submit"
                                value="Leave Your Review"
                                className="btn btn-primary px-3"
                              />
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Fragment>
        ) : (
          <p>Loading...</p>
        )}

        {/* Shop Detail End */}
        {/* Products Start */}
        <div className="container-fluid py-5">
          <div className="text-center mb-4">
            <h2 className="section-title px-5">
              <span className="px-2">You May Also Like</span>
            </h2>
          </div>
          <div className="row row-cols-1 row-cols-md-4 px-xl-5">
            {" "}
            {/* Sử dụng row-cols-md-4 để sắp xếp 4 cột trên mỗi hàng cho màn hình lớn */}
            {currentProducts.map((item) => (
              <div key={item.id} className="col mb-4">
                <div className="card product-item border-0">
                  <div className="card-header product-img position-relative overflow-hidden bg-transparent border p-0">
                    <img
                      className="img-fluid w-100"
                      src={`../uploads/${item.product_image}`}
                      alt={item.product_name}
                    />
                  </div>
                  <div className="card-body border-left border-right text-center p-0 pt-4 pb-3">
                    <h6 className="text-truncate mb-3">{item.product_name}</h6>{" "}
                    {/* Thay đổi từ item.name sang item.product_name */}
                    <div className="d-flex justify-content-center">
                      <h6>${item.product_price}</h6>{" "}
                      {/* Thay đổi từ item.price sang item.product_price */}
                      <h6 className="text-muted ml-2">
                        <del>${item.product_price}</del>{" "}
                        {/* Thay đổi từ item.price sang item.product_price */}
                      </h6>
                    </div>
                  </div>
                  <div className="card-footer d-flex justify-content-between bg-light border">
                    <a
                      href={`/ProductDetails/${item.id}`}
                      className="btn btn-sm text-dark p-0"
                    >
                      <i className="fas fa-eye text-primary mr-1" /> View Detail
                    </a>
                    <button
                      onClick={() => addToCart(item.id)}
                      className="btn btn-sm text-dark p-0"
                    >
                      <i className="fas fa-shopping-cart text-primary mr-1" />{" "}
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
      <Footer />
    </div>
  );
};

export default ProductDetails;
