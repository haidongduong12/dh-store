import React, { useState, useEffect } from "react";
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
} from "@mui/material";
import axios from "axios";
const ProductForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    quantity: "",
    price: "",
    description: "",
    category: "",
    image: null,
  });
  const [error, setError] = useState({
    name: "",
    quantity: "",
    price: "",
    description: "",
    category: "",
    image: null,
  });
  const [success, setSuccess] = useState("");
  const [category, setCategory] = useState([]);

  useEffect(() => {
    fetchCategory();
  }, []);

  const fetchCategory = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/react/show-category"
      );
      setCategory(response.data);
    } catch (error) {
      console.error("error fetching category", error);
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
      image: null,
    };

    // Name validation
    if (formData.name.trim() === "") {
      newErrors.name = "Name is required";
      valid = false;
    }

    // Quantity validation
    if (formData.quantity.trim() === "") {
      newErrors.quantity = "Quantity is required";
      valid = false;
    } else if (isNaN(formData.quantity)) {
      newErrors.quantity = "Quantity should be a number";
      valid = false;
    }

    // Price validation
    if (formData.price.trim() === "") {
      newErrors.price = "Price is required";
      valid = false;
    } else if (isNaN(formData.price)) {
      newErrors.price = "Price should be a number";
      valid = false;
    }

    // Description validation
    if (formData.description.trim() === "") {
      newErrors.description = "Description is required";
      valid = false;
    }

    // Category validation
    if (!formData.category) {
      newErrors.category = "Category is required";
      valid = false;
    }

    if (formData.image === null) {
      newErrors.image = "Image is required";
      valid = false;
    }
    setError(newErrors);
    return valid;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // Xử lý khi chọn file
    if (name === "image" && files && files.length > 0) {
      setFormData((prevState) => ({
        ...prevState,
        image: files[0], // Chỉ lấy file đầu tiên trong trường hợp này
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    // Tạo một đối tượng FormData để chứa dữ liệu sản phẩm
    const data = new FormData();
    data.append("name", formData.name);
    data.append("quantity", formData.quantity);
    data.append("price", formData.price);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("image", formData.image);

    try {
      const response = await fetch("http://localhost:8081/react/add-product", {
        method: "POST",
        body: data,
      });

      if (!response.ok) {
        throw new Error("Failed to add product");
      }

      setSuccess("Add product successful!");
      // Reset form nếu muốn
      setFormData({
        name: "",
        quantity: "",
        price: "",
        description: "",
        category: "",
        image: null,
      });
    } catch (error) {
      console.error("Error:", error);
      setError((prevError) => ({
        ...prevError,
        form: "Failed to add product",
      }));
    }
  };

  return (
    <>
      <h1>Add New Products</h1>

      <Grid container justifyContent="center">
        <Grid item xs={12} sm={12} md={12}>
          <Paper sx={{ p: 2 }}>
            <form onSubmit={handleSubmit}>
              <div>
                <TextField
                  fullWidth
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
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
                  value={formData.quantity}
                  onChange={handleChange}
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
                  value={formData.price}
                  onChange={handleChange}
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
                  value={formData.description}
                  onChange={handleChange}
                  style={{ width: "100%", marginTop: 16 }}
                />
                {error.description && (
                  <div className="alert alert-danger">{error.description}</div>
                )}
              </div>
              <div>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                  >
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
              <div>
                <input
                  fullWidth
                  accept="image/*"
                  id="image-upload"
                  type="file"
                  name="image"
                  onChange={handleChange}
                  style={{
                    display: "none",
                    width: "100%",
                    backgroundColor: "#d19c97",
                  }}
                />
                <label htmlFor="image-upload">
                  <Button
                    component="span"
                    variant="outlined"
                    sx={{ mt: 2, color: "#d19c97" }}
                  >
                    {formData.image ? formData.image.name : "Upload Image"}
                  </Button>
                </label>
                {error.image && (
                  <div className="alert alert-danger">{error.image}</div>
                )}
              </div>

              {/* {error && <div className="alert alert-danger">{error}</div>} */}
              {success && <div className="alert alert-success">{success}</div>}
              <br></br>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                sx={{ mt: 2, backgroundColor: "#d19c97" }}
              >
                Submit
              </Button>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default ProductForm;
