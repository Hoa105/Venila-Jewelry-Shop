import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import bannerNew from "../assets/images/Bannernew.jpg";
import bannerFavorite from "../assets/images/Bannerfavourite.jpg";
import bannerSale from "../assets/images/Bannersale.jpg";
import { productsFetch } from "../slices/productsSlice";
import ProductList from "./ProductList";
import "../assets/css/Banner.css";

const Banner = () => {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.products);

  useEffect(() => {
    if (status === "idle") {
      dispatch(productsFetch());
    }
  }, [dispatch, status]);

  const favoriteProducts = items.filter((product) => product.isFavorite); // Lọc sản phẩm yêu thích
  const newProducts = items.filter((product) => product.isNew); // Lọc sản phẩm mới
  const saleProducts = items.filter((product) => product.isSale); // Lọc sản phẩm khuyến mãi

  // Hàm render danh sách sản phẩm hoặc thông báo trạng thái
  const renderProductSection = (products) => {
    if (status === "loading") {
      return <p>Đang tải sản phẩm...</p>;
    }
    if (status === "failed") {
      return <p>Lỗi tải sản phẩm: {error}</p>;
    }
    if (status === "succeeded" && products.length > 0) {
      return <ProductList products={products} />;
    }
    if (status === "succeeded" && products.length === 0) {
      return <p>Không có sản phẩm phù hợp.</p>;
    }
    return null; // Trường hợp status là 'idle'
  };

  return (
    <div>
      {/* Banner Yêu thích */}
      <div>
        <h1> Sản phẩm yêu thích nhất</h1>
        <img
          src={bannerFavorite}
          alt="Banner Yêu thích"
          className="img-banner"
        ></img>
        {renderProductSection(favoriteProducts)}
      </div>

      {/* Banner Mới */}
      <div>
        <h1>Bộ Sưu Tập Trang Sức Mới Nhất</h1>
        <img src={bannerNew} alt="Banner Mới" className="img-banner"></img>
        {renderProductSection(newProducts)}
      </div>

      {/* Banner Khuyến mãi */}
      <div>
        <h1>Chương trình khuyến mãi</h1>
        <img
          src={bannerSale}
          alt="Banner Khuyến mãi"
          className="img-banner"
        ></img>
        {renderProductSection(saleProducts)}
      </div>
    </div>
  );
};

export default Banner;
