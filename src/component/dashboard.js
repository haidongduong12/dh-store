import React, { useEffect, useState } from "react";
import { Container, Grid, Paper } from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import Sidebar from "./sidebar";
import HeaderDash from "./headerDash";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const data = [
  { name: "Jan", uv: 4000, pv: 2400, amt: 2400 },
  { name: "Feb", uv: 3000, pv: 1398, amt: 2210 },
  { name: "Mar", uv: 2000, pv: 9800, amt: 2290 },
  { name: "Apr", uv: 2780, pv: 3908, amt: 2000 },
  { name: "May", uv: 1890, pv: 4800, amt: 2181 },
  { name: "Jun", uv: 2390, pv: 3800, amt: 2500 },
  { name: "Jul", uv: 3490, pv: 4300, amt: 2100 },
];
const Dashboard = () => {
  const navigate = useNavigate();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const infoUser = JSON.parse(localStorage.getItem("user"));
  const userId = infoUser ? infoUser.id : null;
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
        <Grid container spacing={3}>
          <Grid item xs={12} md={8} lg={9}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: 240,
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={data}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="pv" stroke="#8884d8" />
                  <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4} lg={3}>
            <Paper
              sx={{
                p: 2,
                display: "flex",
                flexDirection: "column",
                height: 240,
              }}
            >
              {/* Content here */}
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper sx={{ p: 2, display: "flex", flexDirection: "column" }}>
              {/* Content here */}
            </Paper>
          </Grid>
        </Grid>
        <Sidebar />
      </Container>
    </>
  );
};

export default Dashboard;
