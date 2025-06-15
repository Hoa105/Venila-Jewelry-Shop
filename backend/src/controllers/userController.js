const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const {
  allUser,
  userById,
  updateUserId,
  userByEmail,
  createUser,
  updatePass,
} = require("../services/CRUDUser");

const getUserpage = async (req, res) => {
  try {
    const users = await allUser();
    res.status(200).json({ users });
  } catch {
    res.status(500).json({ message: "Lỗi khi lấy danh sách người dùng" });
  }
};

const postUpdate = async (req, res) => {
  let email = req.body.email;
  let name = req.body.name;
  let username = req.body.username;
  let phone = req.body.phone;
  let address = req.body.address;
  let userId = req.params.id;

  await updateUserId(name, username, phone, email, address, userId);

  const [rows] = await userById(userId);

  return res.status(200).json(rows[0]);
};

const postChangePass = async (req, res) => {
  let password = req.body.password;
  let userId = req.params.id;
  await updatePass(password, userId);
  res.redirect("/");
};

const postRegister = async (req, res) => {
  try {
    let users = {
      email: req.body.email,
      name: req.body.name,
      username: req.body.username,
      phone: req.body.phone,
      password: req.body.password,
      address: req.body.address,
    };
    const hashedPassword = await bcrypt.hash(users.password, 10);

    // Kiểm tra email đã tồn tại chưa
    const userResult = await userByEmail(users.email);

    if (userResult && userResult.length > 0) {
      return res.status(400).json({ message: "Email đã tồn tại!" });
    }

    await createUser(
      users.name,
      users.username,
      users.phone,
      users.email,
      hashedPassword,
      users.address
    );

    res.status(201).json({ message: "Đăng ký thành công!" });
  } catch (error) {
    res.status(500).json({ message: "Lỗi server!" });
  }
};

const postLogin = async (req, res) => {
  try {
    let email = req.body.email;
    let password = req.body.password;

    const userResult = await userByEmail(email);

    if (!userResult || userResult.length === 0) {
      return res.status(401).json({ message: "Tài khoản không tồn tại!" });
    }

    const user = userResult[0];

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Sai mật khẩu!" });
    }

    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi server!" });
  }
};

// // Xác thực OTP (sẽ cập nhật sau)
// exports.verifyOtp = async (req, res) => {
//     res.json({ message: "Chức năng xác thực OTP chưa triển khai!" });
// };

// // Quên mật khẩu (sẽ cập nhật sau)
// exports.forgotPassword = async (req, res) => {
//     res.json({ message: "Chức năng quên mật khẩu chưa triển khai!" });
// };

// // Refresh Token (sẽ cập nhật sau)
// exports.refreshToken = async (req, res) => {
//     res.json({ message: "Chức năng refresh token chưa triển khai!" });
// };

module.exports = {
  getUserpage,
  postUpdate,
  postLogin,
  postRegister,
  postChangePass,
};
