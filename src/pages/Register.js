import React, { useState } from "react";
import "./css/Login.css";

const Register = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validateForm = () => {
    if (!username || username.length < 5) {
      setError("Username must have at least 5 characters");
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setError("Invalid email");
      return false;
    }

    const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;
    if (!password || !passwordRegex.test(password)) {
      setError(
        "Password must have at least 8 characters, including at least one capital letter and one special character"
      );
      return false;
    }

    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!validateForm()) {
      return;
    }

    try {
      const response = await fetch("http://localhost:8081/react/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Registration successful!");
        alert("Login successfully !");
        window.location = "/login";
      } else {
        setError(data.error || "An error occurred.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div>
      <div className="center">
        <div className="container">
          <div className="heading">Register</div>
          <form className="form" onSubmit={handleSubmit}>
            <label htmlFor="username">Username</label>
            <input
              className="input"
              type="text"
              name="username"
              id="username"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <label htmlFor="email">Email</label>
            <input
              className="input"
              type="text"
              name="email"
              id="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label htmlFor="password">Password</label>
            <input
              className="input"
              type="password"
              name="password"
              id="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}
            <input className="login-button" type="submit" value="Register" />
          </form>
          <span className="agreement">
            <p className="text">
              You have accounts.{" "}
              <a href="/login">
                <strong>LOGIN NOW</strong>
              </a>
            </p>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Register;
