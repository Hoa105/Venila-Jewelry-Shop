import React from "react";
import "../assets/css/RingSizeGuide.css";

const RingSizeGuide = () => {
  return (
    <div className="ring-size-guide">
      <h2>Hướng dẫn đo size nhẫn</h2>
      <div className="ring-guide-content">
        <div className="ring-guide-text">
          <section>
            <h3>1. Đo size nhẫn bằng thước dây và giấy</h3>
            <ul>
              <li>
                <strong>Chuẩn bị:</strong> Một sợi dây hoặc giấy, thước kẻ, bút
                và kéo (nếu cần).
              </li>
              <li>
                <strong>Quấn dây/giấy:</strong> Quấn quanh ngón tay, đảm bảo vừa
                vặn nhưng không quá chật.
              </li>
              <li>
                <strong>Đánh dấu:</strong> Đánh dấu điểm giao nhau của hai đầu
                dây/giấy.
              </li>
              <li>
                <strong>Đo chiều dài:</strong> Dùng thước đo từ điểm đầu đến
                điểm đánh dấu.
              </li>
              <li>
                <strong>Tính toán:</strong> Chia chiều dài đo được cho 3.14 để
                ra đường kính nhẫn.
              </li>
              <li>
                <strong>So sánh:</strong> So sánh với bảng size nhẫn để chọn
                kích thước phù hợp.
              </li>
            </ul>
          </section>

          <section>
            <h3>2. Đo size nhẫn bằng nhẫn có sẵn</h3>
            <ul>
              <li>
                <strong>Chuẩn bị:</strong> Một chiếc nhẫn vừa tay và thước kẻ.
              </li>
              <li>
                <strong>Đo đường kính:</strong> Đặt nhẫn trên mặt phẳng và đo
                đường kính bên trong nhẫn.
              </li>
              <li>
                <strong>So sánh:</strong> So với bảng size nhẫn để chọn kích
                thước phù hợp.
              </li>
            </ul>
          </section>

          <section>
            <h3>Lưu ý</h3>
            <ul>
              <li>
                Nên đo vào buổi sáng hoặc tối vì ngón tay có thể thay đổi kích
                thước.
              </li>
              <li>
                Nếu có khớp tay to, hãy đo chu vi gần khớp để nhẫn không bị chật
                hay tuột.
              </li>
              <li>
                Nếu không chắc size, hãy tham khảo thêm từ cửa hàng trang sức
                hoặc chuyên gia.
              </li>
            </ul>
          </section>
        </div>

        <div className="ring-guide-image">
          <img
            src="https://res.cloudinary.com/duf81iw49/image/upload/v1748597015/hrsgxjkbevxkn0nvr26g.jpg"
            alt="Hướng dẫn đo size nhẫn"
          />
        </div>
      </div>
    </div>
  );
};

export default RingSizeGuide;
