import React from "react";
import ProductCard from "./ProductCard";

const ProductList = ({ products }) => {
  // Kiểm tra nếu products là mảng và có ít nhất 1 sản phẩm
  if (!Array.isArray(products) || products.length === 0) {
    return <p>Không có sản phẩm nào phù hợp.</p>;
  }

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductList;
