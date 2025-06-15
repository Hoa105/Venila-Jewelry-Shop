import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import logo from "../../assets/images/logo.png";
import banner from "../../assets/images/Banner.jpg";

const Dashboard = () => {
  const auth = useSelector((state) => state.auth);
  const userFromStorage = JSON.parse(localStorage.getItem("user"));
  const isAdmin = auth?.isAdmin || userFromStorage?.isAdmin;
  const navigate = useNavigate();
  const location = useLocation();

  if (!isAdmin) return <p>Access denied. Not an Admin!</p>;

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-top">
          <NavLink
            to="/admin"
            className="logo"
            style={{ textDecoration: "none", color: "black" }}
          >
            <img src={logo} alt="Logo" className="logo-image" />
            Venila Jewelry
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? "link-active" : "link-inactive"
            }
            to="/admin/summary"
            style={styles.link}
          >
            Summary
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? "link-active" : "link-inactive"
            }
            to="/admin/products"
            style={styles.link}
          >
            Products
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? "link-active" : "link-inactive"
            }
            to="/admin/orders"
            style={styles.link}
          >
            Orders
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? "link-active" : "link-inactive"
            }
            to="/admin/users"
            style={styles.link}
          >
            Users
          </NavLink>
          <NavLink
            className={({ isActive }) =>
              isActive ? "link-active" : "link-inactive"
            }
            to="/admin/contacts"
            style={styles.link}
          >
            Contacts
          </NavLink>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </nav>
      {location.pathname === "/admin" && (
        <div>
          <h1>Chào mừng đến với trang quản trị Venila Jewelry</h1>
          <img src={banner} alt="Banner" className="img-banner" />
        </div>
      )}
      <div>
        <Outlet />
      </div>
    </div>
  );
};
const styles = {
  link: {
    textDecoration: "none",
    color: "black",
    fontSize: "20px",
  },
};

export default Dashboard;
