import "./../assets/css/Footer.css";
import logo from "../assets/images/logo.png";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-hotline">
          <i className="fas fa-phone-alt"></i>
          <span>
            HOTLINE: <strong>19000000</strong>
          </span>
        </div>
        <div className="footer-logo">
          <img src={logo} alt="Logo" className="logo-image" />
          Venila Jewelry
        </div>
        <div className="footer-location">
          <i className="fas fa-map-marker-alt"></i>
          <span>Hệ thống cửa hàng</span>
        </div>
      </div>

      <div className="footer-main">
        <div className="footer-column">
          <h4>LIÊN HỆ</h4>
          <p>Trang sức Venila</p>
          <p>Địa chỉ: Km 10 Nguyễn trãi, Hà Đông, Hà Nội</p>
          <p>Điện thoại: 19000000</p>
          <p>Email: venila@gmail.com</p>
          <p>Mã số doanh nghiệp: 0123456789</p>
        </div>

        <div className="footer-column">
          <h4>VỀ CHÚNG TÔI</h4>
          <ul>
            <li>
              <p>Trang sức LUXURY</p>
            </li>
            <li>
              <p>Kinh doanh bán sỉ</p>
            </li>
            <li>
              <p>Kinh doanh bán lẻ</p>
            </li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>DỊCH VỤ KHÁCH HÀNG</h4>
          <ul>
            <li>
              <a href="/dich-vu-khach-hang">Điều khoản mua bán</a>
            </li>
            <li>
              <a href="/venila-elite-club">Venila Elite Club</a>
            </li>
            <li>
              <a href="/chinh-sach-bao-hanh">Chính sách & Bảo hành</a>
            </li>
          </ul>
        </div>

        <div className="footer-column">
          <h4>TIN TỨC</h4>
          <ul>
            <li>
              <a href="/blog">Blog</a>
            </li>
            <li>
              <a href="/tin-khuyen-mai">Tin khuyến mãi</a>
            </li>
            <li>
              <a href="/tin-trang-suc">Tin trang sức</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-connect">
        <button>KẾT NỐI VỚI CHÚNG TÔI</button>
        <div className="social-links">
          <a href="https://facebook.com">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="https://instagram.com">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="https://tiktok.com">
            <i className="fab fa-tiktok"></i>
          </a>
          <a href="https://youtube.com">
            <i className="fab fa-youtube"></i>
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© 2025 Venila Jewelry. Đã thông báo với Bộ Công Thương.</span>
      </div>
    </footer>
  );
};

export default Footer;
