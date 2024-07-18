import React from "react";
import Sidebar from "../sidebar";
import HeaderDash from "../headerDash";
import { Container } from "@mui/material";
import OrderShow from "./orderShow";
const Orders = () => {
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
