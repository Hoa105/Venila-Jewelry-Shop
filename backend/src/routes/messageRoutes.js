const express = require("express");
const router = express.Router();
const {
  getAllMessages,
  getMessagesByUser,
  getMessagesByAdmin,
  postcreateMessage,
  postReplyMessage,
} = require("../controllers/messageController");

router.get("/", getAllMessages);

router.get("/:id", getMessagesByUser);

router.get("/admin/:id", getMessagesByAdmin);

router.post("/", postcreateMessage);

router.post("/reply", postReplyMessage);
module.exports = router;
