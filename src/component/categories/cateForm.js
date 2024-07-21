import React, { useState } from "react";
import {
  TextField,
  Button,
  Grid,
  Paper,
  TextareaAutosize,
} from "@mui/material";
// import axios from "axios";

const CateForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    image: null,
  });
  const [error, setError] = useState({
    name: "",
    description: "",
    image: "",
  });
  const [success, setSuccess] = useState("");

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

    // Validation logic here
    let formIsValid = true;
    let errors = {};

    if (!formData.name) {
      formIsValid = false;
      errors.name = "Name is required";
    }

    if (!formData.description) {
      formIsValid = false;
      errors.description = "Description is required";
    }

    if (!formData.image) {
      formIsValid = false;
      errors.image = "Image is required";
    }

    setError(errors);

    if (!formIsValid) return;

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("image", formData.image);

    try {
      const response = await fetch("http://localhost:8081/react/add-category", {
        method: "POST",
        body: data,
      });

      if (!response.ok) {
        throw new Error("Failed to add category");
      }

      setSuccess("Add category successful!");
      // Reset form nếu muốn
      setFormData({
        name: "",
        quantity: "",
        price: "",
        description: "",
        category: "",
        image: null,
      });
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.error("Error adding category:", error);
      setError("Error adding category");
    }
  };

  return (
    <>
      <h1>Add New Category</h1>
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
                <input
                  accept="image/*"
                  id="image-upload"
                  type="file"
                  name="image"
                  onChange={handleChange}
                  style={{
                    display: "none",
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
              {success && <div className="alert alert-success">{success}</div>}
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

export default CateForm;
