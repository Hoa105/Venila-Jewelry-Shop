const {
  allMessages,
  messagesByUser,
  updatemessage,
  createMessage,
  replyMessage,
} = require("../services/CRUDMessage");

const getAllMessages = async (req, res) => {
  try {
    const results = await allMessages();
    res.status(200).json({ results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching messages" });
  }
};

const getMessagesByUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const results = await messagesByUser(userId);
    res.status(200).json({ results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching messages for user" });
  }
};

const getMessagesByAdmin = async (req, res) => {
  const userId = req.params.id;
  try {
    const results = await messagesByUser(userId);
    await updatemessage(userId);
    res.status(200).json({ results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching messages for user" });
  }
};

const postcreateMessage = async (req, res) => {
  const { user_id, content } = req.body;
  try {
    const results = await createMessage(user_id, content);
    res.status(201).json({ message: "Message created successfully", results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating message" });
  }
};

const postReplyMessage = async (req, res) => {
  const { user_id, content } = req.body;
  try {
    const results = await replyMessage(user_id, content);
    res.status(201).json({ message: "Reply created successfully", results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating reply" });
  }
};

module.exports = {
  getAllMessages,
  getMessagesByUser,
  getMessagesByAdmin,
  postcreateMessage,
  postReplyMessage,
};
