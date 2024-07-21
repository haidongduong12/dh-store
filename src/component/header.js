import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AccountCircle from "@mui/icons-material/AccountCircle";

const Header = () => {
  const [infoUser, setInfoUser] = useState(null);
  const [logoutTimer, setLogoutTimer] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [cartItems, setCartItems] = useState([]);
  const [roles, setRoles] = useState([]); // State for roles
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser ? storedUser.id : null;
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
    if (storedUser) {
      setInfoUser(storedUser);
      setLogoutTimer(setTimeout(handleLogout, 60 * 60 * 1000));
    }

    return () => {
      clearTimeout(logoutTimer);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    alert("Logout successfully!");
    setTimeout(() => {
      window.location.reload();
    }, 500);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?query=${searchTerm}`);
  };

  // Fetch cart items
  const fetchCartItems = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/react/cart-items`,
        {
          params: { userId }, // Pass userId as a query parameter
        }
      );
      setCartItems(response.data);
      console.log(response.data); // Log the fetched data
    } catch (error) {
      console.error("Error fetching cart items:", error);
    }
  };

  // Fetch user roles
  const fetchUserRole = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8081/react/userRoles/${userId}`
      );
      const roles = response.data.roles;
      setRoles(roles); // Update roles state
      console.log(roles);
    } catch (error) {
      console.error("Error fetching user roles", error);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchUserRole();
    }
  }, [userId]);

  return (
    <>
      {/* Topbar Start */}
      <div className="container-fluid">
        <div className="row bg-secondary py-2 px-xl-5">
          <div className="col-lg-6 d-none d-lg-block">
            <div className="d-inline-flex align-items-center">
              <a className="text-dark" href="">
                FAQs
              </a>
              <span className="text-muted px-2">|</span>
              <a className="text-dark" href="">
                Help
              </a>
              <span className="text-muted px-2">|</span>
              <a className="text-dark" href="">
                Support
              </a>
            </div>
          </div>
          <div className="col-lg-6 text-center text-lg-right">
            <div className="d-inline-flex align-items-center">
              <a className="text-dark px-2" href="">
                <i className="fab fa-facebook-f" />
              </a>
              <a className="text-dark px-2" href="">
                <i className="fab fa-twitter" />
              </a>
              <a className="text-dark px-2" href="">
                <i className="fab fa-linkedin-in" />
              </a>
              <a className="text-dark px-2" href="">
                <i className="fab fa-instagram" />
              </a>
              <a className="text-dark pl-2" href="">
                <i className="fab fa-youtube" />
              </a>
            </div>
          </div>
        </div>
        <div className="row align-items-center py-3 px-xl-5">
          <div className="col-lg-3 d-none d-lg-block">
            <a href="/" className="text-decoration-none">
              <h1 className="m-0 display-5 font-weight-semi-bold">
                <span className="text-primary font-weight-bold border px-3 mr-1">
                  DH
                </span>
                Shopper
              </h1>
            </a>
          </div>
          <div className="col-lg-6 col-6 text-left">
            <form onSubmit={handleSearch}>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search for products"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="input-group-append">
                  <button
                    type="submit"
                    className="input-group-text bg-transparent text-primary"
                  >
                    <i className="fa fa-search" />
                  </button>
                </div>
              </div>
            </form>
          </div>
          <div className="col-lg-3 col-6 text-right">
            <a href="/" className="btn border">
              <i className="fas fa-heart text-primary" />
              <span className="badge">0</span>
            </a>
            <a href="/cart" className="btn border">
              <i className="fas fa-shopping-cart text-primary" />
              <span className="badge">{cartItems.length}</span>
            </a>
          </div>
        </div>
      </div>
      {/* Topbar End */}
      {/* Navbar Start */}
      <div className="container-fluid mb-5">
        <div className="row border-top px-xl-5">
          <div className="col-lg-12">
            <nav className="navbar navbar-expand-lg bg-light navbar-light py-3 py-lg-0 px-0">
              <a href="/" className="text-decoration-none d-block d-lg-none">
                <h1 className="m-0 display-5 font-weight-semi-bold">
                  <span className="text-primary font-weight-bold border px-3 mr-1">
                    DH
                  </span>
                  Shopper
                </h1>
              </a>
              <button
                type="button"
                className="navbar-toggler"
                data-toggle="collapse"
                data-target="#navbarCollapse"
              >
                <span className="navbar-toggler-icon" />
              </button>
              <div
                className="collapse navbar-collapse justify-content-between"
                id="navbarCollapse"
              >
                <div className="navbar-nav mr-auto py-0">
                  <a href="/" className="nav-item nav-link active">
                    Home
                  </a>
                  <a href="/shop" className="nav-item nav-link">
                    Shop
                  </a>

                  <div className="nav-item dropdown">
                    <a
                      href="/"
                      className="nav-link dropdown-toggle"
                      data-toggle="dropdown"
                    >
                      About Us
                    </a>
                    <div className="dropdown-menu rounded-0 m-0">
                      <a href="/cart" className="dropdown-item">
                        Instagram
                      </a>
                      <a href="/checkout" className="dropdown-item">
                        Facebook
                      </a>
                    </div>
                  </div>
                  <a href="/contact" className="nav-item nav-link">
                    Contact
                  </a>
                </div>
                <div
                  className="navbar-nav ml-auto py-0"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  {infoUser ? (
                    <div
                      className="nav-item dropdown"
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <a
                        href="/history-order"
                        className="nav-link dropdown-toggle"
                        data-toggle="dropdown"
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <AccountCircle
                          style={{ marginRight: "10px", color: "#d19c97" }}
                        />{" "}
                        {infoUser.username}
                      </a>
                      <div className="dropdown-menu rounded-0 m-0">
                        {roles.includes("admin") && (
                          <a href="/dashboard" className="dropdown-item">
                            Dashboard
                          </a>
                        )}
                        <a href="/info" className="dropdown-item">
                          Info
                        </a>
                        <a href="/history-order" className="dropdown-item">
                          Orders
                        </a>
                        <button
                          className="dropdown-item"
                          onClick={handleLogout}
                        >
                          Logout
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div
                        className="navbar-nav ml-auto py-0"
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <a href="/login" className="nav-item nav-link">
                          Login
                        </a>
                        <a href="/register" className="nav-item nav-link">
                          Register
                        </a>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </nav>
          </div>
        </div>
      </div>
      {/* Navbar End */}
    </>
  );
};

export default Header;
