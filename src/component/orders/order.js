import React, { useEffect } from "react";
import Sidebar from "../sidebar";
import HeaderDash from "../headerDash";
import { Container } from "@mui/material";
import OrderShow from "./orderShow";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const Orders = () => {
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
    <div>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <HeaderDash />
        <Sidebar />
        <OrderShow />
      </Container>
    </div>
  );
};

export default Orders;
