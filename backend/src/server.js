require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const userRouters = require("./routes/userRouters");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const messageRoutes = require("./routes/messageRoutes");
const port = process.env.PORT;
const hostname = process.env.HOST_NAME;
const jwt = process.env.JWT_SECRET;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.options("*", cors());

app.use((req, res, next) => {
  console.log(`Request received: ${req.method} ${req.url}`);
  next();
});
app.use("/uploads", express.static("uploads"));
app.use("/users", userRouters);

app.use("/products", productRoutes);

app.use("/orders", orderRoutes);

app.use("/messages", messageRoutes);

app.listen(port, hostname, () => {
  console.log(`Example app listening on port ${port}`);
});
