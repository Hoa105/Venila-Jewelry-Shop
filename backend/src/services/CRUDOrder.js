const connection = require("../config/database");
const { get } = require("../routes/orderRoutes");

const allOrders = async () => {
  let [results, fields] = await connection.query(
    `SELECT
      Orders.*,
      Users.name AS customer_name,
      Users.email AS customer_email
    FROM Orders
    JOIN Users ON Orders.user_id = Users.id; `
  );
  return results;
};

const ordersUser = async (userId) => {
  let [results, fields] = await connection.query(
    `SELECT 
      Orders.*,
      Users.name AS customer_name,
      Users.email AS customer_email
    FROM Orders
    JOIN Users ON Orders.user_id = Users.id
    WHERE Orders.user_id = ? ; `,
    [userId]
  );
  return results;
};

const ordersUserId = async (orderId) => {
  let [results, fields] = await connection.query(
    `SELECT 
      Orders.*,
      Users.name AS customer_name,
      Users.email AS customer_email
    FROM Orders
    JOIN Users ON Orders.user_id = Users.id
    WHERE Orders.id = ? ; `,
    [orderId]
  );
  return results;
};

const orderDetail = async (orderId) => {
  const [results, fields] = await connection.query(
    `SELECT 
      Order_items.*, 
      Products.name AS product_name,
      Products.image AS product_image
    FROM Order_items 
    JOIN Products ON Order_items.product_id = Products.id 
    WHERE Order_items.order_id = ?;
  `,
    [orderId]
  );

  return results;
};

const createOrder = async (
  user_id,
  status,
  total_price,
  shipping_address,
  phone,
  note,
  payment_method
) => {
  const [results, fields] = await connection.query(
    ` INSERT INTO Orders(user_id, order_date, status, total_price, shipping_address, phone, note, payment_method)
        VALUES(?, NOW(), ?, ?, ?, ?, ?, ?); `,
    [
      user_id,
      status,
      total_price,
      shipping_address,
      phone,
      note,
      payment_method,
    ]
  );
  return results;
};

const createOrderId = async (order_id, items) => {
  const insertValues = items.map((item) => [
    order_id,
    item.product_id,
    item.quantity,
    item.price,
    item.size,
  ]);

  // 1. Thêm vào Order_items
  const [results] = await connection.query(
    `INSERT INTO Order_items (order_id, product_id, quantity, price, size) VALUES ?`,
    [insertValues]
  );

  // 2. Giảm số lượng tồn kho
  for (const item of items) {
    await connection.query(
      `UPDATE Product_sizes
       SET quantity = quantity - ?
       WHERE product_id = ? AND size = ?`,
      [item.quantity, item.product_id, item.size]
    );
  }

  return results;
};

const updateOrder = async (status, order_id) => {
  let [results, fields] = await connection.query(
    `
          UPDATE Orders
          SET status = ?
          where id = ? `,
    [status, order_id]
  );
};

const deleteProduct = async (userId) => {
  let [results, fields] = await connection.query(
    `DELETE FROM Products WHERE id = ?; `,
    [userId]
  );
};

const stat = async (startDate, endDate) => {
  let [results] = await connection.query(
    `SELECT o.id AS order_id, o.order_date, u.email AS customer_email, u.name AS customer_name, p.id, p.name AS product_name, SUM(oi.quantity) AS total_quantity, SUM(oi.quantity * oi.price) AS total_revenue
     FROM Orders o
     JOIN Order_items oi ON o.id = oi.order_id
     JOIN Products p ON oi.product_id = p.id
      JOIN Users u ON o.user_id = u.id
     WHERE (o.status = 'Đã xác nhận' OR o.payment_method IN ('VNPAY', 'MOMO'))
       AND o.order_date BETWEEN ? AND ?
     GROUP BY p.id, p.name, o.id, u.name, o.order_date, u.email
     ORDER BY total_quantity DESC`,
    [startDate, endDate]
  );
  return results;
};

const totalRevenue = async (startDate, endDate) => {
  let [results] = await connection.query(
    `SELECT SUM(total_price) AS total_revenue
     FROM Orders
     WHERE (status = 'Đã xác nhận' OR payment_method IN ('VNPAY', 'MOMO'))
       AND order_date BETWEEN ? AND ?`,
    [startDate, endDate]
  );
  return results[0].total_revenue || 0;
};

module.exports = {
  allOrders,
  ordersUser,
  ordersUserId,
  orderDetail,
  createOrder,
  createOrderId,
  updateOrder,
  deleteProduct,
  stat,
  totalRevenue,
};
