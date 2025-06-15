const express = require("express");
const router = express.Router();
const upload = require("../config/upload");
const {
  getProductpage,
  getProductId,
  PostCreaeteProduct,
  postChangeProduct,
  postUpdateProduct,
  postHandleDeleteProduct,
} = require("../controllers/productController");

router.get("/", getProductpage);

router.get("/:id", getProductId);

router.post("/create-product", upload.single("image"), PostCreaeteProduct);

router.post("/change-product/:id", postChangeProduct);

router.post("/update-product/:id", upload.single("image"), postUpdateProduct);

router.post("/delete-product/:id", postHandleDeleteProduct);

module.exports = router;
