import React from "react";
import Sidebar from "../sidebar";
import HeaderDash from "../headerDash";
import { Container } from "@mui/material";
import CateForm from "./cateForm";
import CateShow from "./cateShow";

const Categories = () => {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <HeaderDash />
      <Sidebar />
      <CateForm />
      <CateShow />
    </Container>
  );
};

export default Categories;
