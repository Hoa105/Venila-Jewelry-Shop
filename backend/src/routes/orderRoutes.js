const express = require("express");
const router = express.Router();
const {
  getOrderpage,
  getOrderUser,
  getOrderId,
  PostCreaeteOrder,
  PostCreaeteOrderId,
  postUpdateOrder,
  getStat,
  getTotalRevenue,
} = require("../controllers/orderController");

router.get("/", getOrderpage);

router.get("/orders-user/:id", getOrderUser);

router.get("/total-revenue", getTotalRevenue);

router.get("/stat", getStat);

router.get("/:id", getOrderId);

router.post("/create-order", PostCreaeteOrder);

router.post("/create-order-id", PostCreaeteOrderId);

router.post("/update-order/:id", postUpdateOrder);

module.exports = router;
