import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ChangeUser = () => {
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    phone: "",
    email: "",
    address: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      setFormData({
        name: storedUser.name || "",
        username: storedUser.username || "",
        phone: storedUser.phone || "",
        email: storedUser.email || "",
        address: storedUser.address || "",
      });
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:8081/users/update-user/${user.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.status === 200) {
        alert("Cập nhật thành công!");
        localStorage.setItem("user", JSON.stringify(data));
        navigate("/");
      } else {
        alert("Cập nhật thất bại!");
      }
    } catch (error) {
      console.error("Lỗi cập nhật:", error);
      alert("Có lỗi xảy ra. Vui lòng thử lại sau.");
    }
  };

  if (!user) {
    return <p>Vui lòng đăng nhập để xem thông tin cá nhân.</p>;
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <fieldset>
          <legend>Cập nhật thông tin</legend>

          <div className="input-group">
            <label>Họ tên:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <label>Tên tài khoản:</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <label>Số điện thoại:</label>
            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <label>Email:</label>
            <input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="input-group">
            <label>Địa chỉ:</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
            />
          </div>

          <div className="button-container">
            <button type="submit">Cập nhật</button>
            <button type="button" onClick={() => navigate("/acount/user")}>
              Quay lại
            </button>
          </div>
        </fieldset>
      </form>
    </div>
  );
};

export default ChangeUser;
