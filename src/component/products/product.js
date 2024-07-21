import React, { useEffect } from "react";
// import Dashboard from "../dashboard";
import Sidebar from "../sidebar";
import HeaderDash from "../headerDash";
import { Container } from "@mui/material";
import ProductForm from "./productForm";
import ProductShow from "./productShow";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProductPage = () => {
  const navigate = useNavigate();

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
  return (
    <>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <HeaderDash />
        <Sidebar />
        <ProductForm />
        <ProductShow />
      </Container>
    </>
  );
};

export default ProductPage;
