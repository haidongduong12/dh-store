import React from "react";
import {
  Drawer,
  Link,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AccountCircle from "@mui/icons-material/AccountCircle";
import NotificationsIcon from "@mui/icons-material/Notifications";
import SettingsIcon from "@mui/icons-material/Settings";
import DashboardIcon from "@mui/icons-material/Dashboard";
import CategoryIcon from "@mui/icons-material/Category"; // Import the category icon
import ProductionQuantityLimitsIcon from "@mui/icons-material/ProductionQuantityLimits";
const Sidebar = () => {
  return (
    <Drawer variant="permanent">
      <List>
        <a href="/" style={{ textDecoration: "none", color: "inherit" }}>
          <ListItem button key="Home">
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
          </ListItem>
        </a>
        <a
          href="/dashboard"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <ListItem button key="Dashboard">
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItem>
        </a>
        <a
          href="/ProductPage"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <ListItem button key="Product">
            <ListItemIcon>
              <ProductionQuantityLimitsIcon />
            </ListItemIcon>
            <ListItemText primary="Product" />
          </ListItem>
        </a>
        <a
          href="/categoryPage"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <ListItem button key="Category">
            <ListItemIcon>
              <CategoryIcon />
            </ListItemIcon>
            <ListItemText primary="Category" />
          </ListItem>
        </a>
        <a
          href="/userPage"
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <ListItem button key="User">
            <ListItemIcon>
              <AccountCircle />
            </ListItemIcon>
            <ListItemText primary="User" />
          </ListItem>
        </a>
        <ListItem button key="Notifications">
          <ListItemIcon>
            <NotificationsIcon />
          </ListItemIcon>
          <ListItemText primary="Notifications" />
        </ListItem>
        <ListItem button key="Settings">
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Settings" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default Sidebar;
