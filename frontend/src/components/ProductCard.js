import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../slices/cartSlice";
import "./../assets/css/ProductCard.css";

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const [selectedSize, setSelectedSize] = useState(""); // Lưu size được chọn

  // Đặt size mặc định là size đầu tiên khi component được render
  useEffect(() => {
    if (product.variants && product.variants.length > 0) {
      setSelectedSize(product.variants[0].size);
    }
  }, [product.variants]);

  const handleAddToCart = () => {
    if (product.variants && product.variants.length > 0) {
      // Nếu sản phẩm có size, yêu cầu chọn size trước khi thêm vào giỏ hàng
      if (!selectedSize) {
        alert("Vui lòng chọn size trước khi thêm vào giỏ hàng.");
        return;
      }
    }

    // Tạo đối tượng sản phẩm để thêm vào giỏ hàng
    const productToAdd = {
      ...product,
      selectedSize: selectedSize || "default", // Nếu không có size, đặt giá trị mặc định
      cartItemId: `${product.id}-${selectedSize || "default"}`, // Tạo ID duy nhất
      quantity: 1,
    };

    dispatch(addToCart(productToAdd));
  };

  const handleSizeChange = (e) => {
    const size = e.target.value;
    setSelectedSize(size);
  };

  return (
    <div className="product-card">
      <Link
        to={`/product/${product.id}`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        <img src={product.image} alt={product.name} />
        <h3>{product.name}</h3>
      </Link>
      <p>Giá: {product.price.toLocaleString()} ₫</p>

      {/* Hiển thị bảng chọn size nếu sản phẩm có size */}
      {product.variants && product.variants.length > 0 && (
        <div>
          <label htmlFor="size-select">Chọn size:</label>
          <select
            id="size-select"
            value={selectedSize}
            onChange={handleSizeChange} // Gọi hàm xử lý khi chọn size
            style={{
              fontSize: "16px",
              width: "50px",
            }}
          >
            {product.variants.map((variant) => (
              <option
                key={variant.size}
                value={variant.size}
                disabled={variant.quantity <= 0} // Vô hiệu hóa nếu hết hàng
              >
                {variant.size} {variant.quantity <= 0 ? "(Hết hàng)" : ""}
              </option>
            ))}
          </select>
        </div>
      )}

      <button className="button-card" onClick={handleAddToCart}>
        🛒 Thêm vào giỏ hàng
      </button>
    </div>
  );
};

export default ProductCard;
