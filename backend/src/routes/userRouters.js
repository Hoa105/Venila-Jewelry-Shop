const express = require("express");
const {
  getUserpage,
  // ABC,
  // getCreat,
  // getUpdate,
  postUpdate,
  // postDelete,
  // postHandleDelete,
  postLogin,
  postRegister,
  postChangePass,
} = require("../controllers/userController");
const router = express.Router();

router.get("/", getUserpage);

router.post("/update-user/:id", postUpdate);

router.post("/change-password/:id", postChangePass);

router.post("/register", postRegister);

router.post("/login", postLogin);

module.exports = router;
