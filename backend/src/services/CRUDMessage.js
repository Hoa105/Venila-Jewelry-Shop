const connection = require("../config/database");

const allMessages = async () => {
  const [results, fields] = await connection.query(`SELECT * FROM messages;`);
  return results;
};

const messagesByUser = async (userId) => {
  const [results, fields] = await connection.query(
    `SELECT * FROM messages WHERE user_id = ?;`,
    [userId]
  );
  return results;
};

const updatemessage = async (userId) => {
  const [results, fields] = await connection.query(
    `UPDATE messages SET is_read = 1 WHERE user_id = ? AND is_admin_reply = 0;`,
    [userId]
  );
};

const createMessage = async (user_id, content) => {
  const [results, fields] = await connection.query(
    `INSERT INTO messages(user_id, content, created_at) VALUES(?, ?, NOW());`,
    [user_id, content]
  );
  return results;
};

const replyMessage = async (user_id, content) => {
  const [results, fields] = await connection.query(
    `INSERT INTO messages(user_id, content, is_admin_reply, created_at) VALUES(?, ?, '1', NOW());`,
    [user_id, content]
  );
  return results;
};

module.exports = {
  allMessages,
  messagesByUser,
  updatemessage,
  createMessage,
  replyMessage,
};
