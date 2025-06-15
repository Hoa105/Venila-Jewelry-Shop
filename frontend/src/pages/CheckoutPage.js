import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setCartItems } from "../slices/cartSlice";

const CheckoutPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cart, cartTotalAmount } = useSelector((state) => state.cart);

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    note: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("VNPAY");

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Tính tổng tiền
      const total_price = cartTotalAmount;
      const user = JSON.parse(localStorage.getItem("user"));
      // 1. Gửi thông tin đơn hàng
      const orderRes = await fetch(
        "http://localhost:8081/orders/create-order",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user?.id,
            status: "Chờ xử lý",
            total_price: total_price,
            shipping_address: formData.address,
            phone: formData.phone,
            note: formData.note,
            payment_method: paymentMethod,
          }),
        }
      );

      if (!orderRes.ok) throw new Error("Không thể tạo đơn hàng");

      const orderData = await orderRes.json();
      const createdOrderId = orderData.order_id;

      // 2. Gửi danh sách sản phẩm trong đơn hàng
      const itemsRes = await fetch(
        "http://localhost:8081/orders/create-order-id",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            order_id: createdOrderId,
            items: cart.map((item) => ({
              product_id: item.id,
              quantity: item.quantity,
              price: item.price,
              size: item.selectedSize,
            })),
          }),
        }
      );

      if (!itemsRes.ok) {
        const errorText = await itemsRes.text();
        console.error("Error adding items:", errorText);
        throw new Error("Không thể thêm sản phẩm vào đơn hàng");
      }

      // 3. Thông báo, reset cart, điều hướng
      alert(`Đặt hàng thành công! Phương thức thanh toán: ${paymentMethod}`);
      dispatch(setCartItems([]));
      localStorage.removeItem("cart_guest");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Có lỗi khi đặt hàng. Vui lòng thử lại.");
    }
  };

  return (
    <div>
      <h1>💳 Thanh toán</h1>
      <h3>Tổng tiền: {cartTotalAmount.toLocaleString()}₫</h3>
      <form onSubmit={handleSubmit} className="style">
        <div>
          <label>Họ và tên:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label>Địa chỉ giao hàng:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label>Số điện thoại:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
          />
        </div>

        <div>
          <label>Ghi chú:</label>
          <input
            type="text"
            name="note"
            value={formData.note}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label>Phương thức thanh toán:</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="VNPAY">VNPAY</option>
            <option value="MOMO">MOMO</option>
            <option value="COD">Thanh toán khi nhận hàng</option>
          </select>
        </div>

        <div className="button-container">
          <button type="submit">Xác nhận đơn hàng</button>
          <button type="button" onClick={() => navigate("/cart")}>
            Quay lại giỏ hàng
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;
