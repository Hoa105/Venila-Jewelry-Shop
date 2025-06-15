import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ChangePass = () => {
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (!oldPassword || !newPassword || !confirmPassword) {
      setError("Vui lòng điền đầy đủ thông tin!");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Mật khẩu nhập lại không khớp!");
      return;
    }

    if (newPassword.length < 6) {
      setError("Mật khẩu phải ít nhất 6 ký tự!");
      return;
    }

    setError("");
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Bạn chưa đăng nhập!");
        return;
      }

      const response = await fetch(
        "http://localhost:8081/users/change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Gửi token trong header
          },
          body: JSON.stringify({
            oldPassword,
            newPassword,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Mật khẩu đã được thay đổi thành công!");
        navigate("/");
      } else {
        setError(data.message || "Đổi mật khẩu thất bại!");
      }
    } catch (err) {
      setError("Có lỗi xảy ra. Vui lòng thử lại.");
    }
  };

  return (
    <div className="container">
      <h2>Đổi mật khẩu</h2>

      <form onSubmit={handleChangePassword} className="style">
        <div>
          <input
            type="password"
            placeholder="Mật khẩu cũ"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Mật khẩu mới"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Nhập lại mật khẩu"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <div className="button-container">
          <button type="submit">Đổi mật khẩu</button>
          <button onClick={() => navigate("/acount/user")}>Quay lại</button>
        </div>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default ChangePass;
