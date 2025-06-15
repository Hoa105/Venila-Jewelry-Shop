import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../slices/cartSlice";
import "./../assets/css/ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [product, setProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:8081/products/${id}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        const productData = data.results;
        setProduct(productData);
        if (
          productData?.variants &&
          productData.variants.length > 0 &&
          productData.variants[0] !== null
        ) {
          setSelectedVariant(productData.variants[0]);
        }
      } catch (err) {
        console.error("Failed to fetch product:", err);
        setProduct(null); // Đặt lại product thành null nếu có lỗi
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    if (!selectedVariant) {
      alert("Vui lòng chọn size sản phẩm.");
      return;
    }
    if (selectedVariant.quantity <= 0) {
      alert("Size này hiện đã hết hàng.");
      return;
    }

    const productToAdd = {
      ...product,
      selectedSize: selectedVariant.size,
      cartItemId: `${product.id}-${selectedVariant.size}`, // Tạo ID duy nhất cho item trong giỏ hàng theo size
      price: product.price, // Đảm bảo giá đúng
      maxQuantity: selectedVariant.quantity,
      quantity: 1, // Mặc định thêm 1 sản phẩm vào giỏ
    };
    dispatch(addToCart(productToAdd));
  };

  if (product === null) {
    return <p>Đang tải thông tin sản phẩm...</p>;
  }

  if (!product || !product.id) {
    return <p>Sản phẩm không tồn tại!</p>;
  }
  const renderVariants = () => {
    if (
      !Array.isArray(product.variants) ||
      product.variants.length === 0 ||
      product.variants[0] === null
    ) {
      return <p>Sản phẩm này hiện chưa có thông tin size.</p>;
    }

    return (
      <div className="product-variants">
        <p>
          <strong>Chọn Size:</strong>
        </p>
        {product.variants.map((variant) => (
          <input
            type="button"
            key={`${product.id}-${variant.size}`}
            className={`variant-button ${
              selectedVariant?.size === variant.size ? "selected" : ""
            } ${variant.quantity <= 0 ? "disabled" : ""}`}
            onClick={() => {
              if (variant.quantity > 0) {
                setSelectedVariant(variant);
              }
            }}
            disabled={variant.quantity <= 0} // Vô hiệu hóa nút nếu hết hàng
            title={
              variant.quantity <= 0
                ? "Hết hàng"
                : `Còn ${variant.quantity} sản phẩm`
            }
            value={`${variant.size}${
              variant.quantity <= 0 ? " (Hết hàng)" : ""
            }`}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="product-detail-container">
      <div className="product-image">
        {product.image ? (
          <img src={product.image} alt={product.name} />
        ) : (
          <div className="no-image">No Image Available</div>
        )}
      </div>

      <div className="product-info">
        <h1 className="product-name">{product.name}</h1>
        <p className="product-price">
          {product.price ? `${product.price.toLocaleString()} ₫` : "Liên hệ"}
        </p>
        <p className="product-description">{product.description}</p>
        <p className="product-material">Chất liệu: {product.material}</p>

        {renderVariants()}

        {selectedVariant && (
          <p className="variant-quantity-display">
            {" "}
            Số lượng còn lại: {selectedVariant.quantity}
          </p>
        )}

        <div>
          <Link to="/ring-size-guide">Hướng dẫn chọn size</Link>
        </div>

        {Array.isArray(product.variants) &&
          product.variants.length > 0 &&
          product.variants[0] !== null && (
            <button
              className="add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={!selectedVariant || selectedVariant.quantity <= 0} // Disable nếu chưa chọn size hoặc size đã chọn hết hàng
            >
              🛒 Thêm vào giỏ hàng
            </button>
          )}
        {(!Array.isArray(product.variants) ||
          product.variants.length === 0 ||
          product.variants[0] === null) && (
          <button
            className="add-to-cart-btn"
            onClick={() =>
              dispatch(
                addToCart({
                  ...product,
                  quantity: 1,
                  cartItemId: product.id,
                })
              )
            }
          >
            🛒 Thêm vào giỏ hàng
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
