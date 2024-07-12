import React, { useEffect, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faEdit } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
const ProductShow = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/react/show-product"
      );
      console.log(response.data); // Log the response data to check its structure
      if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        console.error("Response is not an array:", response.data);
      }
    } catch (error) {
      console.error("There was an error fetching the products!", error);
    }
  };

  const handleDelete = async (productId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8081/react/delete-product/${productId}`
      );
      console.log(response.data); // Log kết quả từ server
      fetchProducts(); // Cập nhật danh sách sản phẩm sau khi xóa thành công
    } catch (error) {
      console.error("Error deleting product:", error);
      // Xử lý khi gặp lỗi
    }
  };

  const confirmAndDelete = (productId) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      handleDelete(productId);
    }
  };
  const handleEdit = (productId) => {
    navigate(`/edit-products/${productId}`);
  };

  return (
    <>
      <div>
        <h1>Products</h1>
        <table className="table table-striped table-bordered table-hover">
          <thead className="thead-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Price</th>
              <th scope="col">Img</th>
              <th scope="col">Qty</th>

              <th scope="col">Action</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <input
                    defaultChecked=""
                    type="checkbox"
                    defaultValue={product.id}
                  />
                </td>
                <td>{product.product_name}</td>
                <td>{product.product_price}</td>
                <td>
                  <img
                    src={`uploads/${product.product_image}`}
                    alt={product.product_name}
                    style={{ width: "100px", height: "100px" }} // Add styles as needed
                  />
                </td>
                <td>{product.product_quantity}</td>
                <td>
                  <button
                    className="btn btn-danger mr-2"
                    onClick={() => confirmAndDelete(product.id)}
                  >
                    <FontAwesomeIcon icon={faTrashAlt} className="mr-2" />
                    Delete
                  </button>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleEdit(product.id)} // Gọi openModal với productId
                  >
                    <FontAwesomeIcon icon={faEdit} className="mr-2" />
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default ProductShow;
