import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  addToCart,
  decreaseCart,
  removeFromCart,
  clearCart,
} from "../slices/cartSlice";

const CartPage = () => {
  const { cart, cartTotalAmount } = useSelector((state) => state.cart);

  const user = JSON.parse(localStorage.getItem("user"));
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const increaseQuantity = (item) => {
    dispatch(
      addToCart({
        ...item,
        quantity: 1,
      })
    );
  };

  const decreaseQuantity = (cartItemId) => {
    dispatch(decreaseCart({ cartItemId }));
  };

  const handleremoveFromCart = (cartItemId) => {
    dispatch(removeFromCart({ cartItemId }));
  };

  const handleclearCart = () => {
    dispatch(clearCart());
  };

  const handleCheckout = () => {
    if (user) {
      navigate("/checkout");
    } else {
      navigate("/login");
    }
  };

  const handleSizeChange = (item, newSize) => {
    // Khi thay đổi size, cập nhật sản phẩm với size mới và đặt số lượng về 1
    const updatedItem = {
      ...item,
      selectedSize: newSize,
      cartItemId: `${item.id}-${newSize}`, // Tạo ID mới dựa trên size mới
      quantity: 1, // Đặt số lượng về 1
    };
    dispatch(removeFromCart({ cartItemId: item.cartItemId })); // Xóa sản phẩm cũ
    dispatch(addToCart(updatedItem)); // Thêm sản phẩm mới với size mới
  };

  return (
    <div>
      <h1>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="#222"
          style={{ verticalAlign: "middle", width: 50, height: 50 }}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
          />
        </svg>{" "}
        Giỏ hàng
      </h1>
      {cart.length === 0 ? (
        <p>Giỏ hàng của bạn đang trống.</p>
      ) : (
        <div>
          {cart.map((item) => (
            <div
              key={item.cartItemId}
              style={{
                border: "1px solid #ccc",
                padding: "10px",
                marginBottom: "10px",
              }}
            >
              <img
                src={item.image}
                alt={item.name}
                style={{ width: "100px", marginRight: "20px" }}
                onClick={() => navigate(`/product/${item.id}`)}
              />
              <div>
                <span>{item.name}</span> - <b>{item.price.toLocaleString()}₫</b>
                <br />
                <div className="cart-actions">
                  {item.selectedSize && item.selectedSize !== "default" && (
                    <div>
                      <label htmlFor={`size-select-${item.cartItemId}`}>
                        Size:
                      </label>
                      <select
                        id={`size-select-${item.cartItemId}`}
                        value={item.selectedSize}
                        onChange={(e) => handleSizeChange(item, e.target.value)}
                        style={{
                          fontSize: "16px",
                          width: "50px",
                          marginLeft: "10px",
                          marginRight: "20px",
                        }}
                      >
                        {item.variants.map((variant) => (
                          <option
                            key={variant.size}
                            value={variant.size}
                            disabled={variant.quantity <= 0} // Vô hiệu hóa nếu hết hàng
                          >
                            {variant.size}{" "}
                            {variant.quantity <= 0 ? "(Hết hàng)" : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  <button
                    onClick={() => decreaseQuantity(item.cartItemId)}
                    className="reset-button"
                  >
                    -
                  </button>
                  <button className="reset-button">{item.quantity || 1}</button>

                  <button
                    onClick={() => increaseQuantity(item)}
                    className="reset-button"
                  >
                    +
                  </button>
                  <button
                    onClick={() => handleremoveFromCart(item.cartItemId)}
                    className="reset-button"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="size-6"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                      />
                    </svg>
                  </button>
                </div>
                <div>
                  <b>{(item.price * (item.quantity || 1)).toLocaleString()}₫</b>
                </div>
              </div>
            </div>
          ))}
          <h3>Tổng tiền: {cartTotalAmount.toLocaleString()}₫</h3>
          <button onClick={handleclearCart} style={{ marginRight: "10px" }}>
            🗑 Xóa tất cả
          </button>
          <button onClick={handleCheckout}>💳 Thanh toán</button>
        </div>
      )}
    </div>
  );
};

export default CartPage;
