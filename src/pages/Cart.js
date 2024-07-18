import React, { useEffect, useState } from "react";
import Header from "../component/header";
import Footer from "../component/footer";
import axios from "axios";
import "./css/Cart.css";
import { useNavigate } from "react-router-dom";
const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const infoUser = JSON.parse(localStorage.getItem("user"));
  const userId = infoUser ? infoUser.id : null;
  const navigate = useNavigate();

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
  // Function to save cart to the database
  const saveCart = async () => {
    try {
      const response = await axios.post(
        `http://localhost:8081/react/save-cart`,
        {
          userId,
          cartItems,
        }
      );
      console.log(response.data);
      alert("Update cart successfully !");
    } catch (error) {
      console.error("Error saving cart items:", error);
      alert("Update cart fails !");
    }
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.product_price * item.quantity,
    0
  );

  useEffect(() => {
    fetchCartItems();
  }, []); // Empty dependency array ensures this effect runs only once

  const handleInputChange = (event, itemId) => {
    const value = parseInt(event.target.value);
    const currentItem = cartItems.find((item) => item.id === itemId);
    if (!isNaN(value) && value >= 1 && value <= currentItem.product_quantity) {
      updateQuantity(itemId, value);
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
    if (currentItem.quantity < currentItem.product_quantity) {
      updateQuantity(itemId, currentItem.quantity + 1);
    }
  };

  const deleteCartItems = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this item?"
    );
    if (!confirmDelete) {
      return; // If the user cancels, do nothing
    }

    try {
      const response = await axios.post(
        `http://localhost:8081/react/delete-cart/${id}`
      );
      if (response.status === 200) {
        setCartItems(cartItems.filter((item) => item.id !== id));
        alert("Cart item deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting cart item:", error);
      alert("Failed to delete cart item.");
    }
  };
  // Function to clear all items in the cart
  const clearCart = async () => {
    if (window.confirm("Are you sure you want to clear the cart?")) {
      try {
        const response = await axios.post(
          `http://localhost:8081/react/clear-cart`,
          { userId }
        );
        setCartItems([]);
        console.log(response.data);
        alert("Cart cleared successfully!");
      } catch (error) {
        console.error("Error clearing cart:", error);
        alert("Failed to clear cart!");
      }
    }
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
                    {/* <th>#</th> */}
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
                        {/* <td className="align-middle">
                          <input type="checkbox" value={item.id}></input>
                        </td> */}
                        <td className="align-middle">
                          <img
                            src={`uploads/${item.product_image}`} // Assuming your item object has an 'image' property for the image source
                            alt={item.product_name}
                            style={{ width: 100 }}
                          />{" "}
                        </td>
                        <td className="align-middle">{item.product_name}</td>
                        <td className="align-middle">
                          ${item.product_price.toFixed(2)}
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
                              type="number"
                              className="form-control form-control-sm bg-secondary text-center"
                              value={item.quantity}
                              onChange={(event) =>
                                handleInputChange(event, item.id)
                              }
                              max={item.product_quantity}
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
                          ${(item.product_price * item.quantity).toFixed(2)}
                        </td>{" "}
                        {/* Assuming your item object has a 'totalPrice' property */}
                        <td className="align-middle">
                          <button
                            className="btn btn-sm btn-primary"
                            onClick={() => deleteCartItems(item.id)}
                          >
                            <i className="fa fa-times" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center">
                        <p>No items here</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>

              {cartItems && cartItems.length > 0 && (
                <div className="d-flex justify-content-end mb-3">
                  <div className="col-3">
                    <button
                      className="btn btn-primary btn-block py-3"
                      onClick={saveCart}
                    >
                      Update Cart
                    </button>
                  </div>
                  <div className="col-3">
                    <button
                      className="btn btn-danger btn-block py-3"
                      onClick={clearCart}
                    >
                      Clear Cart
                    </button>
                  </div>
                </div>
              )}
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
                  {infoUser ? (
                    <>
                      <a
                        href="/checkout"
                        className="btn btn-block btn-primary my-3 py-3"
                      >
                        Proceed To Checkout
                      </a>
                    </>
                  ) : (
                    <>
                      <a
                        href="/login"
                        className="btn btn-block btn-primary my-3 py-3"
                      >
                        Proceed To Checkout
                      </a>
                    </>
                  )}
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
