import React, { useEffect, useState } from "react";
import Header from "../component/header";
import Footer from "../component/footer";
import axios from "axios";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);

  // Function to update quantity of a specific item in cart
  const updateQuantity = (itemId, newQuantity) => {
    const updatedCartItems = cartItems.map((item) => {
      if (item.id === itemId) {
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    setCartItems(updatedCartItems);
  };

  const fetchCartItems = async () => {
    try {
      const infoUser = JSON.parse(localStorage.getItem("user"));
      const userId = infoUser.id;
      const response = await axios.get(
        `http://localhost:8081/react/cart-items`,
        {
          params: { userId }, // Pass userId as a query parameter
        }
      );
      setCartItems(response.data);
      console.log(response.data); // Log the fetched data
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  useEffect(() => {
    fetchCartItems();
  }, []); // Empty dependency array ensures this effect runs only once

  const handleInputChange = (event, itemId) => {
    const value = event.target.value;
    if (!isNaN(value) && value >= 1) {
      updateQuantity(itemId, parseInt(value));
    }
  };

  const decreaseQuantity = (itemId) => {
    const currentItem = cartItems.find((item) => item.id === itemId);
    if (currentItem.quantity > 1) {
      updateQuantity(itemId, currentItem.quantity - 1);
    }
  };

  const increaseQuantity = (itemId) => {
    const currentItem = cartItems.find((item) => item.id === itemId);
    updateQuantity(itemId, currentItem.quantity + 1);
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
              Shopping Cart
            </h1>
            <div className="d-inline-flex">
              <p className="m-0">
                <a href="/">Home</a>
              </p>
              <p className="m-0 px-2">-</p>
              <p className="m-0">Shopping Cart</p>
            </div>
          </div>
        </div>
        {/* Page Header End */}
        {/* Cart Start */}
        <div className="container-fluid pt-5">
          <div className="row px-xl-5">
            <div className="col-lg-8 table-responsive mb-5">
              <table className="table table-bordered text-center mb-0">
                <thead className="bg-secondary text-dark">
                  <tr>
                    <th>Products</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Total</th>
                    <th>Remove</th>
                  </tr>
                </thead>
                <tbody className="align-middle">
                  {cartItems && cartItems.length > 0 ? (
                    cartItems.map((item, index) => (
                      <tr key={index}>
                        <td className="align-middle">
                          <img
                            src={`uploads/${item.product_image}`} // Assuming your item object has an 'image' property for the image source
                            alt={item.product_name}
                            style={{ width: 100 }}
                          />{" "}
                        </td>
                        <td className="align-middle">{item.product_name}</td>
                        <td className="align-middle">
                          ${item.product_price}
                        </td>{" "}
                        {/* Assuming your item object has a 'price' property */}
                        <td className="align-middle">
                          <div
                            className="input-group quantity mx-auto"
                            style={{ width: 100 }}
                          >
                            <div className="input-group-btn">
                              <button
                                className="btn btn-sm btn-primary btn-minus"
                                onClick={() => decreaseQuantity(item.id)}
                              >
                                <i className="fa fa-minus" />
                              </button>
                            </div>
                            <input
                              type="text"
                              className="form-control form-control-sm bg-secondary text-center"
                              value={item.quantity}
                              onChange={(event) =>
                                handleInputChange(event, item.id)
                              }
                            />
                            <div className="input-group-btn">
                              <button
                                className="btn btn-sm btn-primary btn-plus"
                                onClick={() => increaseQuantity(item.id)}
                              >
                                <i className="fa fa-plus" />
                              </button>
                            </div>
                          </div>
                        </td>
                        <td className="align-middle">
                          ${item.product_price * item.quantity}
                        </td>{" "}
                        {/* Assuming your item object has a 'totalPrice' property */}
                        <td className="align-middle">
                          <button className="btn btn-sm btn-primary">
                            <i className="fa fa-times" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="text-center">
                        <p>No items here</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <div className="col-lg-4">
              <form className="mb-5" action="">
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control p-4"
                    placeholder="Coupon Code"
                  />
                  <div className="input-group-append">
                    <button className="btn btn-primary">Apply Coupon</button>
                  </div>
                </div>
              </form>
              <div className="card border-secondary mb-5">
                <div className="card-header bg-secondary border-0">
                  <h4 className="font-weight-semi-bold m-0">Cart Summary</h4>
                </div>
                <div className="card-body">
                  <div className="d-flex justify-content-between mb-3 pt-1">
                    <h6 className="font-weight-medium">Subtotal</h6>
                    <h6 className="font-weight-medium">$150</h6>
                  </div>
                  <div className="d-flex justify-content-between">
                    <h6 className="font-weight-medium">Shipping</h6>
                    <h6 className="font-weight-medium">$10</h6>
                  </div>
                </div>
                <div className="card-footer border-secondary bg-transparent">
                  <div className="d-flex justify-content-between mt-2">
                    <h5 className="font-weight-bold">Total</h5>
                    <h5 className="font-weight-bold">$160</h5>
                  </div>
                  <button className="btn btn-block btn-primary my-3 py-3">
                    Proceed To Checkout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Cart End */}
      </>
      <Footer />
    </div>
  );
};

export default Cart;
