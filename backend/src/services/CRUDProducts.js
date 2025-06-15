const connection = require("../config/database");

const allProducts = async () => {
  const query = `
    SELECT
      p.*,
      COALESCE(
        JSON_ARRAYAGG(
          IF(ps.size IS NOT NULL AND ps.quantity IS NOT NULL, 
            JSON_OBJECT('size', ps.size, 'quantity', ps.quantity),
            NULL)
        ),
        JSON_ARRAY()
      ) AS variants_json
    FROM Products p
    LEFT JOIN Product_sizes ps ON p.id = ps.product_id
    GROUP BY p.id;

  `;
  let [results, fields] = await connection.query(query);

  const products = results.map((product) => {
    let parsedVariants = [];

    if (Array.isArray(product.variants_json)) {
      parsedVariants = product.variants_json.filter(
        (variant) => variant !== null
      );
    }

    delete product.variants_json;
    product.variants = parsedVariants;
    return product;
  });
  return products;
};

const productById = async (productId) => {
  const query = `
    SELECT
      p.*,
      COALESCE(
        JSON_ARRAYAGG(
          IF(ps.size IS NOT NULL AND ps.quantity IS NOT NULL,
            JSON_OBJECT('size', ps.size, 'quantity', ps.quantity),
            NULL)
        ),
        JSON_ARRAY()
      ) AS variants_json
    FROM Products p
    LEFT JOIN Product_sizes ps ON p.id = ps.product_id
    WHERE p.id = ?  -- Filter by the specific product ID
    GROUP BY p.id;  -- Group by product ID is still needed even for one product
  `;

  const [results, fields] = await connection.query(query, [productId]);

  if (!results || results.length === 0) {
    return {};
  }

  let product = results[0];
  let parsedVariants = [];

  let variantsData = product.variants_json;
  if (typeof variantsData === "string") {
    try {
      variantsData = JSON.parse(variantsData);
    } catch (e) {
      console.error("Error parsing variants JSON:", e);
      variantsData = [];
    }
  }

  if (Array.isArray(variantsData)) {
    parsedVariants = variantsData.filter((variant) => variant !== null);
  }

  delete product.variants_json;
  product.variants = parsedVariants;

  return product;
};

const createProduct = async (
  name,
  description,
  price,
  material,
  category,
  sizes,
  image
) => {
  const conn = await connection.getConnection();
  try {
    await conn.beginTransaction();

    if (typeof sizes === "string") {
      sizes = JSON.parse(sizes);
    }

    const [productResult] = await conn.query(
      `INSERT INTO Products (name, description, price, material, category, image)
       VALUES (?, ?, ?, ?, ?, ?);`,
      [name, description, price, material, category, image]
    );

    const productId = productResult.insertId;
    if (sizes && sizes.length > 0) {
      const sizeValues = sizes.map((size) => [
        productId,
        size.size,
        parseInt(size.quantity, 10),
      ]);
      await conn.query(
        `INSERT INTO Product_sizes (product_id, size, quantity)
         VALUES ?;`,
        [sizeValues]
      );
    }

    await conn.commit();
    return { success: true, productId };
  } catch (error) {
    await conn.rollback();
    console.error("Error creating product:", error);
    throw error;
  } finally {
    conn.release();
  }
};

const changeProduct = async (isNew, isFavorite, isSale, productId) => {
  let [results, fields] = await connection.query(
    `
        UPDATE Products
        SET isNew = ?, isFavorite = ?, isSale = ?
        where id = ? `,
    [isNew, isFavorite, isSale, productId]
  );
};

const updateProduct = async (
  name,
  description,
  price,
  material,
  category,
  sizes,
  image,
  productId
) => {
  const conn = await connection.getConnection();
  try {
    await conn.beginTransaction();

    await conn.query(
      `UPDATE Products
       SET name = ?, description = ?, price = ?, material = ?, category = ?, image = ?
       WHERE id = ?`,
      [name, description, price, material, category, image, productId]
    );

    await conn.query(`DELETE FROM Product_sizes WHERE product_id = ?`, [
      productId,
    ]);

    if (sizes && sizes.length > 0) {
      const sizeValues = sizes.map((size) => [
        productId,
        size.size,
        parseInt(size.quantity, 10),
      ]);
      await conn.query(
        `INSERT INTO Product_sizes (product_id, size, quantity)
         VALUES ?;`,
        [sizeValues]
      );
    }

    await conn.commit();
    return { success: true, productId };
  } catch (error) {
    await conn.rollback();
    console.error("Error updating product:", error);
    throw error;
  } finally {
    conn.release();
  }
};

const deleteProduct = async (userId) => {
  let [results, fields] = await connection.query(
    `DELETE FROM Products WHERE id = ?; `,
    [userId]
  );

  await connection.query(`DELETE FROM Product_sizes WHERE product_id = ?`, [
    userId,
  ]);
};
module.exports = {
  allProducts,
  productById,
  createProduct,
  changeProduct,
  updateProduct,
  deleteProduct,
};
