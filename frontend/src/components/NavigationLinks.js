import React from "react";
import { NavLink } from "react-router-dom";
import "./../assets/css/Nav.css";

const NavigationLinks = () => {
  return (
    <nav>
      <ul className="links">
        <li>
          <NavLink to="/" style={styles.link}>
            Trang chủ
          </NavLink>
        </li>
        <li>
          <NavLink to="/search?category=ring" style={styles.link}>
            Nhẫn
          </NavLink>
        </li>
        <li>
          <NavLink to="/search?category=bracelet" style={styles.link}>
            Lắc tay
          </NavLink>
        </li>
        <li>
          <NavLink to="/search?category=necklace" style={styles.link}>
            Dây chuyền
          </NavLink>
        </li>
        <li>
          <NavLink to="/search?category=earring" style={styles.link}>
            Bông tai
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};
const styles = {
  link: {
    textDecoration: "none",
    color: "#846947",
    fontSize: "23px",
  },
};

export default NavigationLinks;
