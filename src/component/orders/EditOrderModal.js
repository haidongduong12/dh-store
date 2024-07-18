import {
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
  Paper,
} from "@mui/material";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const EditOrderModal = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const [status, setStatus] = useState("");
  const [order, setOrder] = useState([]);
  const [error, setError] = useState(""); // State to store error message

  const handleUpdateStatus = async () => {
    try {
      const response = await axios.put(
        `http://localhost:8081/react/update-order-status/${id}`,
        { status }
      );
      alert("Order status updated successfully");
      setStatus(response.data);
    } catch (error) {
      console.error("Error updating order status:", error);
      if (error.response && error.response.data && error.response.data.error) {
        setError(error.response.data.error);
        setTimeout(() => {
          window.location.reload();
        }, 3000); // Set error message from server
      } else {
        setError("Failed to update order status"); // Default error message
      }
    }
  };

  useEffect(() => {
    fetchOrderId();
  }, [id]);

  const fetchOrderId = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/react/show-order/${id}`
      );
      setOrder(response.data);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  return (
    <div>
      <h1>Edit Orders</h1>
      <Grid container justifyContent="center">
        <Grid item xs={12} sm={8} md={8}>
          <Paper sx={{ p: 2 }}>
            <form>
              <div>
                <FormControl fullWidth margin="normal">
                  <InputLabel>{order.status}</InputLabel>
                  <Select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    label="Status"
                  >
                    <MenuItem value="Pending">Pending</MenuItem>
                    <MenuItem value="Processing">Processing</MenuItem>
                    <MenuItem value="Shipped">Shipped</MenuItem>
                    <MenuItem value="Delivered">Delivered</MenuItem>
                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                  </Select>
                </FormControl>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpdateStatus}
                >
                  Submit
                </Button>
                {error && (
                  <div className="alert alert-danger mt-2">{error}</div>
                )}
              </div>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </div>
  );
};

export default EditOrderModal;
