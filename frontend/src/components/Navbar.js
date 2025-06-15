import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import NavigationLinks from "./NavigationLinks";
import "./../assets/css/Nav.css";
import logo from "../assets/images/logo.png";

// 👉 import từ redux
import { useDispatch } from "react-redux";
import { setSearchQuery } from "../slices/productsSlice";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Theo dõi location để cập nhật user (tránh cache lỗi)
  useEffect(() => {
    const userData = localStorage.getItem("user");

    if (userData && userData !== "undefined") {
      try {
        const storedUser = JSON.parse(userData);
        setUser(storedUser || null);
      } catch (error) {
        console.error("Error parsing user from localStorage in Navbar:", error);
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [location.pathname]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    dispatch(setSearchQuery(value));

    if (value.trim() !== "") {
      navigate("/search");
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-top">
        <div className="logo-section">
          <h2 className="logo">
            <img src={logo} alt="Logo" className="logo-image" />
            Venila Jewelry
          </h2>
        </div>
        <div className="search-container">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          <button type="submit" className="search-button">
            <i className="fas fa-search"></i>
          </button>
        </div>
        <ul className="nav-links">
          <li>
            <Link to="/cart" className="cart-link">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="#222"
                style={{ verticalAlign: "middle", width: 22, height: 22 }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                />
              </svg>
            </Link>
          </li>
          <li>
            {user ? (
              <div className="user-section">
                <Link to="/acount/user" className="user-link">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="#222"
                    className="user-icon"
                    style={{
                      verticalAlign: "middle",
                      marginRight: 6,
                      width: 22,
                      height: 22,
                    }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                    />
                  </svg>
                  {user.username}
                </Link>
              </div>
            ) : (
              <Link to="/login" className="nav-links">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="#222"
                  className="user-icon"
                  style={{ verticalAlign: "middle", width: 22, height: 22 }}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
              </Link>
            )}
          </li>
        </ul>
      </div>

      <div className="navbar-bottom">
        <NavigationLinks />
      </div>
    </nav>
  );
};

export default Navbar;
