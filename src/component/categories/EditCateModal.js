import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  TextField,
  Button,
  Grid,
  Paper,
  TextareaAutosize,
} from "@mui/material";
const EditCateModal = () => {
  const [categoryData, setCategoryData] = useState([]);
  const { id } = useParams(); // Get the product ID from the URL

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

  const fetchCategoryId = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/react/show-category/${id}`
      );
      setCategoryData(response.data);
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
    if (categoryData.category_name.trim() === "") {
      newErrors.name = "Name is required";
      valid = false;
    }

    // Description validation
    if (categoryData.category_description.trim() === "") {
      newErrors.description = "Description is required";
      valid = false;
    }
    // Description validation
    if (categoryData.category_image.trim() === "") {
      newErrors.description = "Description is required";
      valid = false;
    }

    setError(newErrors);
    return valid;
  };
  const handleUpdate = async (e) => {
    e.preventDefault();

    // Validate the form before sending the request
    if (!validateForm()) {
      return;
    }

    // Create an object to send the data
    const data = {
      name: categoryData.category_name,
      description: categoryData.category_description,
    };

    try {
      const response = await axios.put(
        `http://localhost:8081/react/edit-category/${id}`,
        data
      );

      if (response.status === 200) {
        setSuccess("Product updated successfully!");
        setTimeout(() => {
          navigate(`/categoryPage`);
        }, 1500);
      } else {
        throw new Error("Failed to update category");
      }
    } catch (error) {
      console.error("Error updating category:", error);
      setError((prevError) => ({
        ...prevError,
        form: "Failed to update category",
      }));
    }
  };

  useEffect(() => {
    fetchCategoryId();
  }, [id]);
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
                    value={categoryData.category_name || ""}
                    onChange={(e) =>
                      setCategoryData({
                        ...categoryData,
                        category_name: e.target.value,
                      })
                    }
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
                    value={categoryData.category_description || ""}
                    onChange={(e) =>
                      setCategoryData({
                        ...categoryData,
                        category_description: e.target.value,
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

export default EditCateModal;
