import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

const OrderDetail = () => {
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:8081/orders/${id}`);

        const data = await response.json();

        setOrder(data.order);
        setItems(data.items);
      } catch (err) {
        console.error(err);
        alert("Error loading product data");
      }
    };

    fetchProduct();
  }, [id]);

  return (
    <div style={{ padding: "20px", position: "relative" }}>
      <h2>Quản lý đơn hàng</h2>
      {order && (
        <div style={{ marginTop: "20px" }}>
          <h4>Thông tin đơn hàng:</h4>
          <p>
            <strong>Khách hàng:</strong> {order.customer_name}
          </p>
          <p>
            <strong>Email:</strong> {order.customer_email}
          </p>
          <p>
            <strong>Ngày đặt:</strong>{" "}
            {new Date(order.order_date).toLocaleString()}
          </p>
          <p>
            <strong>Trạng thái:</strong> {order.status}
          </p>
        </div>
      )}
      {items.length === 0 ? (
        <p>Chưa có đơn hàng nào.</p>
      ) : (
        <table border="1" cellPadding="8" cellSpacing="0">
          <thead>
            <tr>
              <th>Hình ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Size</th>
              <th>Số lượng</th>
              <th>Giá cả</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>
                  <img
                    src={item.product_image}
                    alt={item.product_name}
                    width="80"
                  />
                </td>
                <td>{item.product_name}</td>
                <td>{item.size}</td>
                <td>{item.quantity}</td>
                <td>{item.price.toLocaleString()} VND</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button onClick={() => navigate(-1)} style={{ marginTop: "20px" }}>
        Quay lại
      </button>
    </div>
  );
};

export default OrderDetail;
