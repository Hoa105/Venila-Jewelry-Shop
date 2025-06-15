const connection = require("../config/database");

const allUser = async () => {
  let [results, fields] = await connection.query("select * from Users");
  return results;
};

const userById = async (userId) => {
  const [results, fields] = await connection.query(
    "select * from Users where id = ? ",
    [userId]
  );

  let user = results && results.length > 0 ? results[0] : {};
  return user;
};

const userByEmail = async (email) => {
  const [results, fields] = await connection.query(
    "select * from Users where email = ? ",
    [email]
  );
  return results;
};
const createUser = async (name, username, phone, email, password, address) => {
  const [results, fields] = await connection.query(
    ` INSERT INTO Users (name, username, phone, email, password, address)
      VALUES(?, ?, ?, ?, ?, ?); `,
    [name, username, phone, email, password, address]
  );
  return results;
};

const updateUserId = async (name, username, phone, email, address, userId) => {
  let [results, fields] = await connection.query(
    `
        UPDATE Users u 
        SET name = ?, username = ?, phone = ?, email = ?, address = ?
        where id = ? `,
    [name, username, phone, email, address, userId]
  );
};

const updatePass = async (password, userId) => {
  let [results, fields] = await connection.query(
    `
        UPDATE Users
        SET password = ?, address = ?
        where id = ? `,
    [password, userId]
  );
};

module.exports = {
  allUser,
  userById,
  updateUserId,
  userByEmail,
  createUser,
  updatePass,
};
