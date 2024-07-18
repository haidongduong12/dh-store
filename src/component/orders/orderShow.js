import { faEdit, faTrashAlt, faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const OrderShow = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/react/show-orders"
      );
      console.log(response.data);
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders", error);
    }
  };

  const handleEdit = async (orderId) => {
    navigate(`/edit-order/${orderId}`);
  };
  const handleView = async (orderId) => {
    navigate(`/view-order/${orderId}`);
  };
  const handleDelete = async (orderId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8081/react/delete-order/${orderId}`
      );
      console.log(response.data); // Log kết quả từ server
      fetchOrder();
      alert("Delete order successfully !");
    } catch (error) {
      console.error("Error deleting order:", error);
      alert("There was an error deleting the order. Please try again later.");
    }
  };

  const confirmAndDelete = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      handleDelete(productId);
    }
  };
  return (
    <>
      <div>
        <h1>Orders</h1>
        <table className="table table-bordered text-center">
          <thead className="thead-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">User</th>
              <th scope="col">Total</th>
              <th scope="col">Status</th>
              <th scope="col">Action</th>
              {/* <th scope="col">Product</th>
              <th scope="col">Qty</th> */}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <React.Fragment key={order.id}>
                {/* Chi tiết đơn hàng */}
                {order.orderDetails.map((detail, index) => (
                  <tr key={`${detail.product_id}-${index}`}>
                    {/* Thông tin chính của đơn hàng */}
                    {index === 0 && ( // chỉ hiển thị một lần cho mỗi đơn hàng
                      <React.Fragment>
                        <td
                          style={{ border: "2px black solid" }}
                          className="align-middle"
                          rowSpan={order.orderDetails.length}
                        >
                          {order.id}
                        </td>
                        <td
                          style={{ border: "2px black solid" }}
                          rowSpan={order.orderDetails.length}
                        >
                          {order.user.username}
                        </td>
                        <td
                          style={{ border: "2px black solid" }}
                          rowSpan={order.orderDetails.length}
                        >
                          {order.total_amount}
                        </td>
                        <td
                          style={{ border: "2px black solid" }}
                          rowSpan={order.orderDetails.length}
                        >
                          {order.status}
                        </td>
                        <td
                          style={{ border: "2px black solid" }}
                          rowSpan={order.orderDetails.length}
                        >
                          <div className="btn-group">
                            <button
                              className="btn btn-danger mr-2"
                              onClick={() => confirmAndDelete(order.id)}
                            >
                              <FontAwesomeIcon
                                icon={faTrashAlt}
                                className="mr-2"
                              />
                              Delete
                            </button>
                            <button
                              className="btn btn-primary mr-2"
                              onClick={() => handleEdit(order.id)}
                            >
                              <FontAwesomeIcon icon={faEdit} className="mr-2" />
                              Edit
                            </button>
                            <button
                              className="btn btn-success mr-2"
                              onClick={() => handleView(order.id)}
                            >
                              <FontAwesomeIcon icon={faEye} className="mr-2" />
                              View
                            </button>
                          </div>
                        </td>
                      </React.Fragment>
                    )}
                    {/* Chi tiết sản phẩm */}
                    {/* <td>{detail.product_name}</td>
                    <td>{detail.quantity}</td> */}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default OrderShow;
