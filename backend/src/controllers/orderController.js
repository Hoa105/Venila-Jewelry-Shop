const connection = require("../config/database");
const cloudinary = require("../config/cloudinary");

const {
  allOrders,
  ordersUser,
  ordersUserId,
  orderDetail,
  createOrder,
  createOrderId,
  updateOrder,
  stat,
  totalRevenue,
} = require("../services/CRUDOrder");

const getOrderpage = async (req, res) => {
  try {
    const results = await allOrders();
    res.status(200).json({ results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi lấy danh sách sản phẩm" });
  }
};

const getOrderUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const results = await ordersUser(userId);
    res.status(200).json({ results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi lấy danh sách sản phẩm" });
  }
};

const getOrderUserId = async (req, res) => {
  const orderId = req.params.id;
  try {
    const results = await ordersUserId(orderId);
    res.status(200).json({ results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi lấy thông tin sản phẩm" });
  }
};

const getOrderId = async (req, res) => {
  const orderId = req.params.id;

  try {
    const order = await ordersUser(orderId);
    const items = await orderDetail(orderId);
    res.json({ order: order[0], items });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Lỗi khi lấy chi tiết đơn hàng", error: err.message });
  }
};

const PostCreaeteOrder = async (req, res) => {
  const {
    user_id,
    status,
    total_price,
    shipping_address,
    phone,
    note,
    payment_method,
  } = req.body;

  try {
    const results = await createOrder(
      user_id,
      status,
      total_price,
      shipping_address,
      phone,
      note,
      payment_method
    );
    const order_id = results.insertId;
    res.status(200).json({ message: "Order created successfully", order_id });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to create product", error: err.message });
  }
};

const PostCreaeteOrderId = async (req, res) => {
  const { order_id, items } = req.body;

  if (!order_id || !Array.isArray(items)) {
    return res
      .status(400)
      .json({ message: "Thiếu order_id hoặc danh sách items không hợp lệ" });
  }

  try {
    await createOrderId(order_id, items);
    res.status(200).json({ message: "Thêm sản phẩm vào đơn hàng thành công!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Lỗi khi tạo order_items",
      error: err.message,
    });
  }
};

const postUpdateOrder = async (req, res) => {
  const { status } = req.body;
  const order_id = req.params.id;

  try {
    await updateOrder(status, order_id);

    res.status(200).json({ message: "Order updated successfully" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to update order", error: err.message });
  }
};

const getStat = async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const results = await stat(startDate, endDate);
    res.status(200).json({ results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi lấy danh sách sản phẩm!" });
  }
};

const getTotalRevenue = async (req, res) => {
  const { startDate, endDate } = req.query;
  try {
    const results = await totalRevenue(startDate, endDate);
    res.status(200).json({ results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi lấy danh sách sản phẩm!" });
  }
};

module.exports = {
  getOrderpage,
  getOrderUser,
  getOrderUserId,
  getOrderId,
  PostCreaeteOrder,
  PostCreaeteOrderId,
  postUpdateOrder,
  getStat,
  getTotalRevenue,
};
