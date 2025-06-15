import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { PrimaryButton } from "./CommonStyled";

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await fetch("http://localhost:8081/products");
      const data = await response.json();
      setProducts(data.results || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleFlagChange = async (id, field, value) => {
    try {
      const intValue = value === "true" ? 1 : 0; // <-- chuyển "true"/"false" thành 1/0

      const res = await fetch(
        `http://localhost:8081/products/change-product/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            [field]: intValue, // gửi số 1 hoặc 0
          }),
        }
      );

      if (!res.ok) throw new Error("Failed to update product");

      alert("Product updated successfully!");
      window.location.reload(); // hoặc fetch lại danh sách
    } catch (err) {
      console.error("Error:", err);
      alert("Failed to update product");
    }
  };

  const handleEdit = (id) => {
    navigate(`/admin/products/edit-product/${id}`);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmed) return;

    try {
      const response = await fetch(
        `http://localhost:8081/products/delete-product/${id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to delete product");
      }

      alert("Product deleted successfully!");
      fetchProducts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px", position: "relative" }}>
      <Outlet />
      <h2>Products</h2>

      {/* Nút Create ở góc phải */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "20px",
        }}
      >
        <PrimaryButton
          onClick={() => navigate("/admin/products/create-product")}
        >
          Create
        </PrimaryButton>
      </div>

      {products.length > 0 ? (
        <table border="1" cellPadding="8" cellSpacing="0">
          <thead>
            <tr>
              <th>Id</th>
              <th>Name</th>
              <th>Description</th>
              <th>Price</th>
              <th>Material</th>
              <th>Category</th>
              <th>Image</th>
              <th>Size </th>
              <th>Quantity</th>
              <th>Favorite</th>
              <th>New</th>
              <th>Sale</th>
              <th>Edit</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {products.map((prod) => (
              <tr key={prod.id}>
                <td>{prod.id}</td>
                <td>{prod.name}</td>
                <td>{prod.description}</td>
                <td>{prod.price.toLocaleString()}</td>
                <td>{prod.material}</td>
                <td>{prod.category}</td>
                <td>
                  <img src={prod.image} alt={prod.name} width="80" />
                </td>
                <td>
                  {Array.isArray(prod.variants) &&
                  prod.variants.length > 0 &&
                  prod.variants[0] !== null ? (
                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                      {prod.variants.map((variant, index) => (
                        <li
                          key={`${prod.id}-size-${variant.size}-${index}`}
                          style={{
                            lineHeight: "26px",
                          }}
                        >
                          {variant.size}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span style={{ color: "#888" }}>N/A</span>
                  )}
                </td>
                {/* Cột Quantity */}
                <td>
                  {Array.isArray(prod.variants) &&
                  prod.variants.length > 0 &&
                  prod.variants[0] !== null ? (
                    <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                      {prod.variants.map((variant, index) => (
                        <li
                          key={`${prod.id}-qty-${variant.size}-${index}`}
                          style={{ marginBottom: "3px" }}
                        >
                          <input
                            type="number"
                            defaultValue={variant.quantity}
                            readOnly
                            style={{
                              fontSize: "14px",
                              width: "90%",
                              textAlign: "right",
                              padding: "2px 5px",
                              boxSizing: "border-box", // Đảm bảo padding không làm tăng kích thước
                            }}
                          />
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span style={{ color: "#888" }}>N/A</span>
                  )}
                </td>

                <td>
                  <select
                    value={prod.isFavorite ? "true" : "false"}
                    onChange={(e) =>
                      handleFlagChange(prod.id, "isFavorite", e.target.value)
                    }
                    style={{ width: "100px" }}
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </td>
                <td>
                  <select
                    value={prod.isNew ? "true" : "false"}
                    onChange={(e) =>
                      handleFlagChange(prod.id, "isNew", e.target.value)
                    }
                    style={{ width: "100px" }}
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </td>
                <td>
                  <select
                    value={prod.isSale ? "true" : "false"}
                    onChange={(e) =>
                      handleFlagChange(prod.id, "isSale", e.target.value)
                    }
                    style={{ width: "100px" }}
                  >
                    <option value="false">No</option>
                    <option value="true">Yes</option>
                  </select>
                </td>
                <td>
                  <input
                    type="button"
                    value="Edit"
                    onClick={() => handleEdit(prod.id)}
                  />
                </td>
                <td>
                  <input
                    type="button"
                    value="Delete"
                    onClick={() => handleDelete(prod.id)}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
};
export default Products;
