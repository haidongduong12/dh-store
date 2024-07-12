import React, { useState, useEffect } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faEdit } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const CateShow = () => {
  const [category, setCategory] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items per page
  const navigate = useNavigate();

  const confirmAndDelete = (categoryId) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      handleDelete(categoryId);
    }
  };

  const handleEdit = (categoryId) => {
    navigate(`/edit-category/${categoryId}`);
  };

  const handleDelete = async (categoryId) => {
    try {
      const response = await axios.delete(
        `http://localhost:8081/react/delete-category/${categoryId}`
      );
      console.log(response.data); // Log kết quả từ server
      fetchCategory(); // Cập nhật danh sách sản phẩm sau khi xóa thành công
    } catch (error) {
      console.error("Error deleting category:", error);
      // Xử lý khi gặp lỗi
    }
  };

  const fetchCategory = async () => {
    try {
      const response = await axios.get(
        "http://localhost:8081/react/show-category"
      );
      setCategory(response.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  // Calculate the current items to display
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = category.slice(indexOfFirstItem, indexOfLastItem);

  // Handle pagination
  const handleNextPage = () => {
    setCurrentPage((prev) =>
      Math.min(prev + 1, Math.ceil(category.length / itemsPerPage))
    );
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(prev - 1, 1));
  };

  return (
    <div>
      <h1>Categories</h1>
      <table className="table table-striped table-bordered table-hover">
        <thead className="thead-dark">
          <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Des</th>
            <th scope="col">Img</th>
            <th scope="col">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((categories) => (
            <tr key={categories.id}>
              <td>
                <input
                  defaultChecked=""
                  type="checkbox"
                  defaultValue={categories.id}
                />
              </td>
              <td>{categories.category_name}</td>
              <td>{categories.category_description}</td>
              <td>
                <img
                  src={`uploads/${categories.category_image}`}
                  alt={categories.category_name}
                  style={{ width: "100px", height: "100px" }} // Add styles as needed
                />
              </td>
              <td>
                <button
                  className="btn btn-danger mr-2"
                  onClick={() => confirmAndDelete(categories.id)}
                >
                  <FontAwesomeIcon icon={faTrashAlt} className="mr-2" />
                  Delete
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => handleEdit(categories.id)} // Gọi openModal với productId
                >
                  <FontAwesomeIcon icon={faEdit} className="mr-2" />
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={handlePrevPage} disabled={currentPage === 1}>
          Previous
        </button>
        <span>
          Page {currentPage} of {Math.ceil(category.length / itemsPerPage)}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === Math.ceil(category.length / itemsPerPage)}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default CateShow;
