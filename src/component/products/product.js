import React from "react";
// import Dashboard from "../dashboard";
import Sidebar from "../sidebar";
import HeaderDash from "../headerDash";
import { Container } from "@mui/material";
import ProductForm from "./productForm";
import ProductShow from "./productShow";

const ProductPage = () => {
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
