import { useState } from "react";

const Summary = () => {
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [revenue, setRevenue] = useState(0);
  const [paidProducts, setPaidProducts] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await fetch(
        `http://localhost:8081/orders/total-revenue?startDate=${fromDate}&endDate=${toDate}`
      );
      const data = await response.json();
      setRevenue(data.results || 0);
    } catch (err) {
      alert("Lỗi khi tải dữ liệu!");
    }

    if (!fromDate || !toDate) {
      alert("Vui lòng chọn khoảng thời gian!");
      return;
    }
    if (new Date(fromDate) > new Date(toDate)) {
      alert("Ngày bắt đầu không thể lớn hơn ngày kết thúc!");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8081/orders/stat?startDate=${fromDate}&endDate=${toDate}`
      );
      const data = await response.json();
      setPaidProducts(data.results || []);
    } catch (err) {
      alert("Lỗi khi tải dữ liệu!");
    }
  };

  return (
    <div>
      <h2>Summary</h2>
      <div style={{ marginBottom: 16 }}>
        <label>
          Từ ngày:{" "}
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </label>
        <label style={{ marginLeft: 16 }}>
          Đến ngày:{" "}
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </label>
        <button style={{ marginLeft: 16 }} onClick={handleSearch}>
          Xem doanh thu
        </button>
      </div>

      <h3>Tổng doanh thu: {Number(revenue).toLocaleString() + " VND"}</h3>

      <h3>Danh sách sản phẩm đã thanh toán</h3>
      {paidProducts.length > 0 ? (
        <table
          border="1"
          cellPadding="8"
          cellSpacing="0"
          style={{ width: "100%", marginTop: 16 }}
        >
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>Email khách hàng</th>
              <th>Tên sản phẩm</th>
              <th>Số lượng</th>
              <th>Giá</th>
              <th>Ngày đặt đơn</th>
            </tr>
          </thead>
          <tbody>
            {paidProducts.map((item, idx) => (
              <tr key={idx}>
                <td>{item.order_id}</td>
                <td>{item.customer_name}</td>
                <td>{item.customer_email}</td>
                <td>{item.product_name}</td>
                <td>{item.total_quantity}</td>
                <td>{Number(item.total_revenue).toLocaleString()}</td>
                <td>
                  {item.order_date
                    ? new Date(item.order_date).toLocaleDateString()
                    : ""}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Không có sản phẩm nào đã thanh toán trong khoảng thời gian này.</p>
      )}
    </div>
  );
};

export default Summary;
