const connection = require("../config/database");
const cloudinary = require("../config/cloudinary");

const {
  allProducts,
  productById,
  createProduct,
  changeProduct,
  updateProduct,
  deleteProduct,
} = require("../services/CRUDProducts");

const getProductpage = async (req, res) => {
  try {
    const results = await allProducts();
    res.status(200).json({ results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi lấy danh sách sản phẩm" });
  }
};

const getProductId = async (req, res) => {
  const productId = req.params.id;
  try {
    const results = await productById(productId);
    res.status(200).json({ results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Lỗi khi lấy sản phẩm theo ID" });
  }
};

const PostCreaeteProduct = async (req, res) => {
  const { name, description, price, material, category, sizes } = req.body;
  const image = req.file;

  try {
    let imageUrl = "";

    if (image) {
      const uploadedResponse = await cloudinary.uploader.upload(image.path, {
        upload_preset: "online-shop",
      });
      imageUrl = uploadedResponse.secure_url;
    }

    const validSizes =
      typeof sizes === "string"
        ? JSON.parse(sizes)
        : Array.isArray(sizes)
        ? sizes
        : [];

    await createProduct(
      name,
      description,
      price,
      material,
      category,
      validSizes,
      imageUrl
    );
    res.status(200).json({ message: "Product created successfully" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to create product", error: err.message });
  }
};

const postChangeProduct = async (req, res) => {
  const { isNew, isFavorite, isSale } = req.body;
  const productId = req.params.id;
  try {
    await changeProduct(isNew, isFavorite, isSale, productId);

    res.status(200).json({ message: "Product updated successfully" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to change product", error: err.message });
  }
};

const postUpdateProduct = async (req, res) => {
  const { name, description, price, material, category, sizes } = req.body;
  const productId = req.params.id;
  const image = req.file;

  try {
    let imageUrl = "";

    if (image) {
      const uploadedResponse = await cloudinary.uploader.upload(image.path, {
        upload_preset: "online-shop",
      });
      imageUrl = uploadedResponse.secure_url;
    } else {
      const [oldProduct] = await connection.query(
        "SELECT image FROM Products WHERE id = ?",
        [productId]
      );
      imageUrl = oldProduct[0]?.image || "";
    }

    const validSizes =
      typeof sizes === "string"
        ? JSON.parse(sizes)
        : Array.isArray(sizes)
        ? sizes
        : [];

    await updateProduct(
      name,
      description,
      price,
      material,
      category,
      validSizes,
      imageUrl,
      productId
    );

    res.status(200).json({ message: "Product updated successfully" });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to update product", error: err.message });
  }
};

const postHandleDeleteProduct = async (req, res) => {
  const productId = req.params.id;
  await deleteProduct(productId);
  res.redirect("/");
};

module.exports = {
  getProductpage,
  getProductId,
  PostCreaeteProduct,
  postChangeProduct,
  postUpdateProduct,
  postHandleDeleteProduct,
};
