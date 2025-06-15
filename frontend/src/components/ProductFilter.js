import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setMaterial, setPriceRange } from "../slices/productsSlice";

const ProductFilter = () => {
  const dispatch = useDispatch();
  const selectedMaterial = useSelector(
    (state) => state.products.selectedMaterial
  );

  const handleMaterialChange = (e) => {
    dispatch(setMaterial(e.target.value));
  };

  const handlePriceChange = (e) => {
    const [min, max] = e.target.value.split("-").map(Number);
    dispatch(setPriceRange([min, max]));
  };

  return (
    <div style={{ fontSize: "18px", lineHeight: "3.0" }}>
      <div style={{ display: "inline-block", marginRight: "60px" }}>
        <label> Chọn chất liệu: </label>
        <select value={selectedMaterial} onChange={handleMaterialChange}>
          <option value="Tất cả">Tất cả</option>
          <option value="vàng">Vàng</option>
          <option value="bạc">Bạc</option>
          <option value="kim cương">Kim cương</option>
        </select>
      </div>

      <div style={{ display: "inline-block" }}>
        <label> Khoảng giá: </label>
        <select onChange={handlePriceChange}>
          <option value="0-200000000">Tất cả</option>
          <option value="0-1000000">Dưới 1 triệu</option>
          <option value="1000000-10000000">1 triệu - 10 triệu</option>
          <option value="1000000-100000000">10 triệu - 100 triệu</option>
          <option value="100000000-200000000">100 triệu - 200 triệu</option>
        </select>
      </div>
    </div>
  );
};

export default ProductFilter;
