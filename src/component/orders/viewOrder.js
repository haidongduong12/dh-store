import { faEdit, faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Container } from "@mui/material";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const ViewOrder = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();
  useEffect(() => {
    fetchOrder();
  }, []);

  const fetchOrder = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/react/view-order/${id}`
      );
      console.log(response.data);
      setOrders(response.data);
    } catch (error) {
      console.error("Error fetching orders", error);
      // Implement error handling or feedback to the user
    }
  };

  const handleEdit = async (orderId) => {
    navigate(`/edit-order/${orderId}`);
  };

  return (
    <>
      <div>
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <h1>Orders</h1>
          <table className="table table-bordered text-center">
            <thead className="thead-dark">
              <tr>
                <th scope="col">#</th>
                <th scope="col">Fullname</th>
                <th scope="col">Address</th>
                <th scope="col">Phonumber</th>
                <th scope="col">Total</th>
                <th scope="col">Product</th>
                <th scope="col">Qty</th>
                {/* <th scope="col">img</th> */}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <React.Fragment key={order.id}>
                  {order.orderDetails.map((detail, index) => (
                    <tr key={`${detail.product_id}-${index}`}>
                      {index === 0 && (
                        <React.Fragment>
                          <td
                            style={{ border: "2px black solid" }}
                            rowSpan={order.orderDetails.length}
                          >
                            {order.id}
                          </td>
                          <td
                            style={{ border: "2px black solid" }}
                            rowSpan={order.orderDetails.length}
                          >
                            {order.user.fullname}
                          </td>
                          <td
                            style={{ border: "2px black solid" }}
                            rowSpan={order.orderDetails.length}
                          >
                            {order.user.shipping_address}
                          </td>
                          <td
                            style={{ border: "2px black solid" }}
                            rowSpan={order.orderDetails.length}
                          >
                            {order.user.phonenumber}
                          </td>
                          <td
                            style={{ border: "2px black solid" }}
                            rowSpan={order.orderDetails.length}
                          >
                            {order.total_amount}
                          </td>
                        </React.Fragment>
                      )}
                      <td style={{ border: "2px black solid" }}>
                        {detail.product_name}
                      </td>
                      <td style={{ border: "2px black solid" }}>
                        {detail.quantity}
                      </td>
                      {/* <td>
                        <img
                          src={`../uploads/${detail.product_image}`}
                          alt={detail.product_name}
                          style={{ width: "200px", height: "200px" }} // Add styles as needed
                        />
                      </td> */}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </Container>
      </div>
    </>
  );
};

export default ViewOrder;
