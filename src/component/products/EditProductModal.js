import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

import {
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Grid,
  Paper,
  TextareaAutosize,
  Input,
} from "@mui/material";
const EditProductModal = () => {
  const { id } = useParams(); // Get the product ID from the URL
  const [productData, setProductData] = useState({});
  const [category, setCategory] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    price: "",
    description: "",
    category: "",
    // image: null,
  });
  const [error, setError] = useState({
    name: "",
    quantity: "",
    price: "",
    description: "",
    category: "",
    // image: null,
  });
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const infoUser = JSON.parse(localStorage.getItem("user"));
  const userId = infoUser ? infoUser.id : null;
  useEffect(() => {
    const infoUser = JSON.parse(localStorage.getItem("user"));
    const userId = infoUser ? infoUser.id : null;
    console.log(userId);
    const fetchUserRole = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8081/react/userRoles/${userId}`
        );
        const roles = response.data.roles;
        console.log(roles);
        if (roles.includes("admin")) {
        } else {
          navigate("/404");
        }
      } catch (error) {
        console.error("Error fetching user roles", error);
      }
    };

    fetchUserRole();
  }, [navigate]);

  useEffect(() => {
    fetchProductId();
    fetchCategory();
  }, [id]);

  const fetchProductId = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/react/show-product/${id}`
      );
      setProductData(response.data);
    } catch (error) {
      console.error("Error fetching product:", error);
    }
  };

  const fetchCategory = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/react/show-category"
      );
      setCategory(response.data);
    } catch (error) {
      console.error("Error fetching category:", error);
    }
  };

  const validateForm = () => {
    let valid = true;
    let newErrors = {
      name: "",
      quantity: "",
      price: "",
      description: "",
      category: "",
      // image: null,
    };

    // Name validation
    if (productData.product_name.trim() === "") {
      newErrors.name = "Name is required";
      valid = false;
    }

    if (isNaN(productData.product_quantity)) {
      newErrors.quantity = "Quantity should be a number";
      valid = false;
    } else if (productData.product_quantity === "") {
      newErrors.quantity = "Quantity is required";
      valid = false;
    }

    // Price validation
    if (isNaN(productData.product_price)) {
      newErrors.price = "Price should be a number";
      valid = false;
    } else if (productData.product_price === "") {
      newErrors.price = "Price is required";
      valid = false;
    }

    // Description validation
    if (productData.product_description.trim() === "") {
      newErrors.description = "Description is required";
      valid = false;
    }

    // Category validation
    if (!productData.category_id) {
      newErrors.category = "Category is required";
      valid = false;
    }

    // // Image validation (optional)
    // if (formData.image && formData.image.size > 5 * 1024 * 1024) {
    //   newErrors.image = "Image size should be less than 5MB";
    //   valid = false;
    // }

    setError(newErrors);
    return valid;
  };

  // const handleFileChange = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     setFormData((prevState) => ({
  //       ...prevState,
  //       image: file,
  //     }));
  //   }
  // };

  const handleUpdate = async (e) => {
    e.preventDefault();

    // Validate the form before sending the request
    if (!validateForm()) {
      return;
    }

    // Create an object to send the data
    const data = {
      name: productData.product_name,
      quantity: productData.product_quantity,
      price: productData.product_price,
      description: productData.product_description,
      category: productData.category_id,
    };

    try {
      const response = await axios.put(
        `http://localhost:8081/react/edit-product/${id}`,
        data
      );

      if (response.status === 200) {
        setSuccess("Product updated successfully!");
        setTimeout(() => {
          navigate(`/productPage`);
        }, 1500);
      } else {
        throw new Error("Failed to update product");
      }
    } catch (error) {
      console.error("Error updating product:", error);
      setError((prevError) => ({
        ...prevError,
        form: "Failed to update product",
      }));
    }
  };
  return (
    <div>
      <>
        <h1>Edit New Products</h1>

        <Grid container justifyContent="center">
          <Grid item xs={12} sm={8} md={8}>
            <Paper sx={{ p: 2 }}>
              <form>
                <div>
                  <TextField
                    fullWidth
                    label="Name"
                    name="name"
                    value={productData.product_name || ""}
                    onChange={(e) =>
                      setProductData({
                        ...productData,
                        product_name: e.target.value,
                      })
                    }
                    margin="normal"
                  />
                  {error.name && (
                    <div className="alert alert-danger">{error.name}</div>
                  )}
                </div>
                <div>
                  <TextField
                    fullWidth
                    label="Quantity"
                    name="quantity"
                    value={productData.product_quantity || ""}
                    onChange={(e) =>
                      setProductData({
                        ...productData,
                        product_quantity: e.target.value,
                      })
                    }
                    margin="normal"
                  />
                  {error.quantity && (
                    <div className="alert alert-danger">{error.quantity}</div>
                  )}
                </div>
                <div>
                  <TextField
                    fullWidth
                    label="Price"
                    name="price"
                    value={productData.product_price || ""}
                    onChange={(e) =>
                      setProductData({
                        ...productData,
                        product_price: e.target.value,
                      })
                    }
                    margin="normal"
                  />
                  {error.price && (
                    <div className="alert alert-danger">{error.price}</div>
                  )}
                </div>
                <div>
                  <TextareaAutosize
                    minRows={8}
                    maxRows={20}
                    aria-label="Description"
                    placeholder="Description"
                    name="description"
                    value={productData.product_description || ""}
                    onChange={(e) =>
                      setProductData({
                        ...productData,
                        product_description: e.target.value,
                      })
                    }
                    style={{ width: "100%", marginTop: 16 }}
                  />
                  {error.description && (
                    <div className="alert alert-danger">
                      {error.description}
                    </div>
                  )}
                </div>
                <div>
                  <FormControl fullWidth margin="normal">
                    <InputLabel>Category</InputLabel>
                    <Select name="category" label="Category">
                      {category.map((cat) => (
                        <MenuItem key={cat.id} value={cat.id}>
                          {cat.category_name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                  {error.category && (
                    <div className="alert alert-danger">{error.category}</div>
                  )}
                </div>
                {/* <div>
                  <input
                    fullWidth
                    accept="image/*"
                    id="image-upload"
                    type="file"
                    name="image"
                    onChange={handleFileChange}
                    style={{ display: "none", width: "100%" }}
                  />
                  <label htmlFor="image-upload">
                    <Button component="span" variant="outlined" sx={{ mt: 2 }}>
                      {formData.image ? formData.image.name : "Upload Image"}
                    </Button>
                  </label>
                  {error.image && (
                    <div className="alert alert-danger">{error.image}</div>
                  )}
                </div> */}

                {/* {error && <div className="alert alert-danger">{error}</div>} */}
                {success && (
                  <div className="alert alert-success">{success}</div>
                )}
                <br></br>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ mt: 2 }}
                  onClick={handleUpdate}
                >
                  Submit
                </Button>
              </form>
            </Paper>
          </Grid>
        </Grid>
      </>
    </div>
  );
};

export default EditProductModal;
