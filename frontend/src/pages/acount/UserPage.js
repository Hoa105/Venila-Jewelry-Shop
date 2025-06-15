import React, { useState, useEffect } from "react";
import "../../assets/css/Acount.css";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearCart, setCartItems } from "../../slices/cartSlice";

const UserPage = () => {
  const [activeTab, setActiveTab] = useState("info");
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (storedUser) {
      setUser(storedUser);
    }

    const fetchOrders = async () => {
      try {
        const response = await fetch(
          `http://localhost:8081/orders/orders-user/${storedUser.id}`
        );

        const data = await response.json();
        setOrders(data.results);
      } catch (err) {
        console.error("Lỗi khi lấy đơn hàng:", err);
      }
    };

    if (storedUser) {
      fetchOrders();
    }
  }, []);
  const HandleItems = async (id) => {
    try {
      const response = await fetch(`http://localhost:8081/orders/${id}`);

      const data = await response.json();
      setSelectedOrder(data.items);
    } catch (err) {
      console.error("Lỗi khi lấy chi tiết đơn hàng:", err);
      alert("Không thể tải dữ liệu đơn hàng");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    dispatch(clearCart()); // Xóa giỏ hàng trong Redux và localStorage (lưu mảng rỗng vào key user cũ)

    const guestCartData = localStorage.getItem("cart_guest");
    dispatch(setCartItems(guestCartData ? JSON.parse(guestCartData) : []));
    navigate("/");
  };

  if (!user) {
    return <p>Vui lòng đăng nhập để xem thông tin cá nhân.</p>;
  }

  return (
    <div className="account-container">
      <div className="tab-header">
        <button
          className={activeTab === "info" ? "active" : ""}
          onClick={() => {
            setActiveTab("info");
            setSelectedOrder(null);
          }}
        >
          Thông tin tài khoản
        </button>
        <button
          className={activeTab === "orders" ? "active" : ""}
          onClick={() => {
            setActiveTab("orders");
            setSelectedOrder(null);
          }}
        >
          Đơn hàng của tôi
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "info" && (
          <div className="info-tab">
            <p>
              <strong>Họ tên:</strong> {user.name}
            </p>
            <p>
              <strong>Tên đăng nhập:</strong> {user.username}
            </p>
            <p>
              <strong>Email:</strong> {user.email}
            </p>
            <p>
              <strong>Số điện thoại:</strong> {user.phone}
            </p>
            <p>
              <strong>Địa chỉ:</strong> {user.address}
            </p>

            <div className="button-container">
              <button onClick={() => navigate("/acount/change-user")}>
                Sửa thông tin
              </button>
              <button onClick={handleLogout}>Đăng xuất</button>
              <Link to="/acount/change-password">Đổi mật khẩu</Link>
            </div>
          </div>
        )}

        {activeTab === "orders" && (
          <div className="orders-tab">
            {orders.length === 0 ? (
              <p>Bạn chưa có đơn hàng nào.</p>
            ) : selectedOrder ? (
              <div className="order-details">
                <h3>Chi tiết đơn hàng </h3>
                <table border="1" cellPadding="8" cellSpacing="0">
                  <thead>
                    <tr>
                      <th>Hình ảnh</th>
                      <th>Tên sản phẩm</th>
                      <th>Số lượng</th>
                      <th>Giá cả</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder.map((item) => (
                      <tr key={item.id}>
                        <td>
                          <img
                            src={item.product_image}
                            alt={item.product_name}
                            width="80"
                          />
                        </td>
                        <td>{item.product_name}</td>
                        <td>{item.quantity}</td>
                        <td>{item.price.toLocaleString()} VND</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <button
                  onClick={() => setSelectedOrder(null)}
                  style={{ marginTop: "20px" }}
                >
                  Quay lại
                </button>
              </div>
            ) : (
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>Mã đơn</th>
                    <th>Ngày đặt</th>
                    <th>Trạng thái</th>
                    <th>Tổng tiền</th>
                    <th>Chi tiết</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.id}>
                      <td>{order.id}</td>
                      <td>{new Date(order.order_date).toLocaleDateString()}</td>
                      <td>{order.status}</td>
                      <td>{order.total_price.toLocaleString()} VND</td>
                      <td>
                        <button
                          onClick={() => HandleItems(order.id)}
                          style={{ width: "100%" }}
                        >
                          Xem chi tiết
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserPage;
