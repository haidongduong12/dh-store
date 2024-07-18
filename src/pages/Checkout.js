import React, { Fragment, useEffect, useState } from "react";
import Header from "../component/header";
import Footer from "../component/footer";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Checkout = () => {
  const [cartItems, setCartItems] = useState([]);
  const infoUser = JSON.parse(localStorage.getItem("user"));
  const userId = infoUser ? infoUser.id : null;
  const [userInfo, setUserInfo] = useState({
    fullname: "",
    email: "",
    phonenumber: "",
    address: "",
  });
  const [userInfoFetch, setUserInfoFetch] = useState({});
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserInfo({
      ...userInfo,
      [name]: value,
    });
  };

  const fetchCartItems = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/react/cart-items`,
        {
          params: { userId }, // Pass userId as a query parameter
        }
      );
      setCartItems(response.data);
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  const fetchInfo = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/react/show-user",
        {
          params: { userId },
        }
      );
      setUserInfoFetch(response.data);
      console.log(userInfoFetch);
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product_price * item.quantity,
    0
  );

  const validateForm = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9]+$/;

    if (!userInfo.fullname) {
      newErrors.fullname = "Full name is required";
    }
    if (!userInfo.email) {
      newErrors.email = "Email is required";
    } else if (!emailRegex.test(userInfo.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!userInfo.phonenumber) {
      newErrors.phonenumber = "Phone number is required";
    } else if (!phoneRegex.test(userInfo.phonenumber)) {
      newErrors.phonenumber = "Phone number must be numeric";
    } else if (userInfo.phonenumber.length !== 10) {
      newErrors.phonenumber = "Phone number must be exactly 10 digits";
    }
    if (!userInfo.address) {
      newErrors.address = "Address is required";
    }

    setErrors(newErrors);

    // Return true if there are no errors
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdate = async () => {
    if (validateForm()) {
      try {
        const response = await axios.put(
          "http://localhost:8081/react/update-user",
          {
            userId,
            ...userInfo,
          }
        );
        alert(response.data);
      } catch (error) {
        console.error("Error updating user info:", error);
        alert("Failed to update user info");
      }
    }
  };

  //order submit
  const handleSubmitOrder = async () => {
    try {
      const orderDetails = cartItems.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      }));

      const orderResponse = await axios.post(
        "http://localhost:8081/react/create-order",
        {
          userId,
          totalAmount: subtotal + 10,
          shipFee: 10,
          status: "Pending",
          payment: "Direct Check",
          orderDetails,
        }
      );
      alert("Order placed successfully !");
      navigate("/");
      console.log("Order placed successfully:", orderResponse.data);

      // Optionally clear cart or redirect to order confirmation page
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order. Please try again later.");
    }
  };

  useEffect(() => {
    fetchInfo();
    fetchCartItems();
  }, [userId]);

  return (
    <div>
      <Header></Header>
      <>
        {/* Page Header Start */}
        <div className="container-fluid bg-secondary mb-5">
          <div
            className="d-flex flex-column align-items-center justify-content-center"
            style={{ minHeight: 300 }}
          >
            <h1 className="font-weight-semi-bold text-uppercase mb-3">
              Checkout
            </h1>
            <div className="d-inline-flex">
              <p className="m-0">
                <a href="">Home</a>
              </p>
              <p className="m-0 px-2">-</p>
              <p className="m-0">Checkout</p>
            </div>
          </div>
        </div>
        {/* Page Header End */}
        {/* Checkout Start */}
        <div className="container-fluid pt-5">
          <div className="row px-xl-5">
            <div className="col-lg-8">
              <div className="mb-4">
                <h4 className="font-weight-semi-bold mb-4">Billing Address</h4>
                <div className="row">
                  {Object.keys(userInfoFetch).length > 0 ? ( // Kiểm tra xem userInfo có tồn tại không
                    <>
                      <div className="col-md-12 form-group">
                        <label>Full Name</label>
                        <input
                          className="form-control"
                          type="text"
                          placeholder="John 12"
                          name="fullname"
                          value={userInfoFetch.fullname}
                        />
                      </div>
                      <div className="col-md-6 form-group">
                        <label>E-mail</label>
                        <input
                          className="form-control"
                          type="text"
                          placeholder="example@email.com"
                          name="email"
                          value={userInfoFetch.email}
                        />
                      </div>
                      <div className="col-md-6 form-group">
                        <label>Mobile No</label>
                        <input
                          className="form-control"
                          type="text"
                          placeholder="123 456 2789"
                          name="phonenumber"
                          value={userInfoFetch.phonenumber}
                        />
                      </div>
                      <div className="col-md-12 form-group">
                        <label>Address</label>
                        <input
                          className="form-control"
                          type="text"
                          placeholder="122 ACB"
                          name="address"
                          value={userInfoFetch.shipping_address}
                        />
                      </div>
                      <div className="col-md-12 form-group d-flex justify-content-between">
                        <div className="custom-control custom-checkbox">
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            id="shipto"
                          />
                          <label
                            className="custom-control-label"
                            htmlFor="shipto"
                            data-toggle="collapse"
                            data-target="#shipping-address"
                          >
                            Ship to different address
                          </label>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="col-md-12 form-group">
                        <label>Full Name</label>
                        <input
                          className="form-control"
                          type="text"
                          placeholder="John"
                          name="fullname"
                          value={userInfo.fullname}
                          onChange={handleChange}
                        />
                        {errors.fullname && (
                          <p style={{ color: "red" }}>{errors.fullname}</p>
                        )}
                      </div>
                      <div className="col-md-6 form-group">
                        <label>E-mail</label>
                        <input
                          className="form-control"
                          type="text"
                          placeholder="example@email.com"
                          name="email"
                          value={userInfo.email}
                          onChange={handleChange}
                        />
                        {errors.email && (
                          <p style={{ color: "red" }}>{errors.email}</p>
                        )}
                      </div>
                      <div className="col-md-6 form-group">
                        <label>Mobile No</label>
                        <input
                          className="form-control"
                          type="text"
                          placeholder="123 456 2789"
                          name="phonenumber"
                          value={userInfo.phonenumber}
                          onChange={handleChange}
                        />
                        {errors.phonenumber && (
                          <p style={{ color: "red" }}>{errors.phonenumber}</p>
                        )}
                      </div>
                      <div className="col-md-12 form-group">
                        <label>Address</label>
                        <input
                          className="form-control"
                          type="text"
                          placeholder="122 ACB"
                          name="address"
                          value={userInfo.address}
                          onChange={handleChange}
                        />
                        {errors.address && (
                          <p style={{ color: "red" }}>{errors.address}</p>
                        )}
                      </div>
                      <div className="col-md-12 form-group d-flex justify-content-between">
                        {/* <div className="custom-control custom-checkbox">
                          <input
                            type="checkbox"
                            className="custom-control-input"
                            id="shipto"
                          />
                          <label
                            className="custom-control-label"
                            htmlFor="shipto"
                            data-toggle="collapse"
                            data-target="#shipping-address"
                          >
                            Ship to different address
                          </label>
                        </div> */}
                        <div>
                          <a
                            href="/login"
                            className="btn btn-primary btn-block py-3"
                            // onClick={handleUpdate}
                          >
                            Add Info
                          </a>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="collapse mb-4" id="shipping-address">
                <h4 className="font-weight-semi-bold mb-4">Shipping Address</h4>
                <div className="row">
                  <div className="col-md-12 form-group">
                    <label>Full Name</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="John "
                      name="fullname"
                      value={userInfo.fullname}
                      onChange={handleChange}
                    />
                    {errors.fullname && (
                      <p style={{ color: "red" }}>{errors.fullname}</p>
                    )}
                  </div>
                  <div className="col-md-6 form-group">
                    <label>E-mail</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="example@email.com"
                      name="email"
                      value={userInfo.email}
                      onChange={handleChange}
                    />
                    {errors.email && (
                      <p style={{ color: "red" }}>{errors.email}</p>
                    )}
                  </div>
                  <div className="col-md-6 form-group">
                    <label>Mobile No</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="123 456 2789"
                      name="phonenumber"
                      value={userInfo.phonenumber}
                      onChange={handleChange}
                    />
                    {errors.phonenumber && (
                      <p style={{ color: "red" }}>{errors.phonenumber}</p>
                    )}
                  </div>
                  <div className="col-md-12 form-group">
                    <label>Address</label>
                    <input
                      className="form-control"
                      type="text"
                      placeholder="122 ACB"
                      name="address"
                      value={userInfo.address}
                      onChange={handleChange}
                    />
                    {errors.address && (
                      <p style={{ color: "red" }}>{errors.address}</p>
                    )}
                  </div>
                  <div className="col-md-12 form-group d-flex justify-content-between">
                    <div>
                      <button
                        className="btn btn-primary btn-block py-3"
                        onClick={handleUpdate}
                      >
                        Update Info
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-lg-4">
              <div className="card border-secondary mb-5">
                <div className="card-header bg-secondary border-0">
                  <h4 className="font-weight-semi-bold m-0">Order Total</h4>
                </div>
                <div className="card-body">
                  <h5 className="font-weight-medium mb-3">Products</h5>

                  {cartItems && cartItems.length > 0 ? (
                    cartItems.map((item, index) => (
                      <Fragment key={item.id}>
                        <div className="d-flex justify-content-between">
                          <p>{item.product_name}</p>
                          <p>
                            ${item.product_price} x {item.quantity}
                          </p>
                        </div>
                      </Fragment>
                    ))
                  ) : (
                    <>
                      <p>No items here</p>
                    </>
                  )}

                  <hr className="mt-0" />
                  <div className="d-flex justify-content-between mb-3 pt-1">
                    <h6 className="font-weight-medium">Subtotal</h6>
                    <h6 className="font-weight-medium">
                      ${subtotal.toFixed(2)}
                    </h6>
                  </div>
                  <div className="d-flex justify-content-between">
                    <h6 className="font-weight-medium">Shipping</h6>
                    <h6 className="font-weight-medium">$10</h6>
                  </div>
                </div>
                <div className="card-footer border-secondary bg-transparent">
                  <div className="d-flex justify-content-between mt-2">
                    <h5 className="font-weight-bold">Total</h5>
                    <h5 className="font-weight-bold">
                      ${(subtotal + 10).toFixed(2)}
                    </h5>
                  </div>
                </div>
              </div>
              <div className="card border-secondary mb-5">
                <div className="card-header bg-secondary border-0">
                  <h4 className="font-weight-semi-bold m-0">Payment</h4>
                </div>
                <div className="card-body">
                  <div className="form-group">
                    <div className="custom-control custom-radio">
                      <input
                        type="radio"
                        className="custom-control-input"
                        name="payment"
                        id="paypal"
                      />
                      <label className="custom-control-label" htmlFor="paypal">
                        Paypal
                      </label>
                    </div>
                  </div>
                  <div className="form-group">
                    <div className="custom-control custom-radio">
                      <input
                        type="radio"
                        className="custom-control-input"
                        name="payment"
                        id="directcheck"
                        checked
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="directcheck"
                      >
                        Direct Check
                      </label>
                    </div>
                  </div>
                  <div className="">
                    <div className="custom-control custom-radio">
                      <input
                        type="radio"
                        className="custom-control-input"
                        name="payment"
                        id="banktransfer"
                      />
                      <label
                        className="custom-control-label"
                        htmlFor="banktransfer"
                      >
                        Bank Transfer
                      </label>
                    </div>
                  </div>
                </div>
                <div className="card-footer border-secondary bg-transparent">
                  <button
                    className="btn btn-lg btn-block btn-primary font-weight-bold my-3 py-3"
                    onClick={handleSubmitOrder}
                  >
                    Place Order
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Checkout End */}
      </>
      <Footer></Footer>
    </div>
  );
};

export default Checkout;
