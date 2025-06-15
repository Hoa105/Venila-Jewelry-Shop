import { createSlice } from "@reduxjs/toolkit";
import { toast } from "react-toastify";

function getUserId() {
  const userData = localStorage.getItem("user");
  if (!userData || userData === "undefined") return null;
  try {
    const user = JSON.parse(userData);
    return user?.id || null;
  } catch (e) {
    console.error("Error parsing user from localStorage:", e);
    return null;
  }
}

const getCartStorageKey = () => {
  const userId = getUserId();
  return userId ? `cart_${userId}` : "cart_guest";
};

const loadCartFromStorage = () => {
  const key = getCartStorageKey();
  try {
    const cartData = localStorage.getItem(key);
    const parsedCart = cartData ? JSON.parse(cartData) : [];
    return parsedCart.map((item) => ({
      ...item,
      // Thêm maxQuantity mặc định nếu thiếu (lý tưởng là luôn có)
      maxQuantity: item.maxQuantity || item.quantity || 1,
    }));
  } catch (error) {
    console.error("Error parsing cart from localStorage:", error);
    return [];
  }
};

const saveCartToStorage = (cart) => {
  try {
    const key = getCartStorageKey();
    localStorage.setItem(key, JSON.stringify(cart));
  } catch (error) {
    console.error("Error saving cart to localStorage:", error);
  }
};

const calculateTotals = (cart) => {
  let total = 0;
  let quantity = 0;
  cart.forEach((cartItem) => {
    const itemPrice = cartItem.price || 0;
    const itemQuantity = cartItem.quantity || 0;
    const itemTotal = itemPrice * itemQuantity;
    total += itemTotal;
    quantity += itemQuantity;
  });
  return { total: parseFloat(total.toFixed(2)), quantity };
};

const initialCart = loadCartFromStorage();
const initialTotals = calculateTotals(initialCart);

const initialState = {
  cart: initialCart,
  cartTotalQuantity: initialTotals.quantity,
  cartTotalAmount: initialTotals.total,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartItems(state, action) {
      state.cart = action.payload || [];
      const totals = calculateTotals(state.cart);
      state.cartTotalQuantity = totals.quantity;
      state.cartTotalAmount = totals.total;
      saveCartToStorage(state.cart);
    },
    addToCart(state, action) {
      const newItem = action.payload;

      // Tìm sản phẩm trong giỏ hàng dựa trên cartItemId
      const existingIndex = state.cart.findIndex(
        (item) => item.cartItemId === newItem.cartItemId
      );

      if (existingIndex >= 0) {
        // Nếu sản phẩm đã tồn tại, tăng số lượng
        state.cart[existingIndex].quantity += newItem.quantity;
        toast.info(`Đã tăng số lượng ${newItem.name} trong giỏ hàng`, {
          position: "bottom-left",
        });
      } else {
        // Nếu sản phẩm chưa tồn tại, thêm vào giỏ hàng
        state.cart.push(newItem);
        toast.success(`${newItem.name} đã được thêm vào giỏ hàng`, {
          position: "bottom-left",
        });
      }

      // Tính lại tổng số lượng và tổng tiền
      const totals = calculateTotals(state.cart);
      state.cartTotalQuantity = totals.quantity;
      state.cartTotalAmount = totals.total;
      saveCartToStorage(state.cart);
    },

    decreaseCart(state, action) {
      const { cartItemId } = action.payload;
      console.log("Giảm số lượng cho item:", cartItemId);
      const itemIndex = state.cart.findIndex(
        (item) => item.cartItemId === cartItemId
      );

      if (itemIndex >= 0) {
        const currentItem = state.cart[itemIndex];
        if (currentItem.quantity > 1) {
          currentItem.quantity -= 1;
          toast.info(
            `Đã giảm số lượng ${currentItem.name} (Size: ${currentItem.selectedSize})`,
            {
              position: "bottom-left",
            }
          );
        } else {
          // Số lượng là 1, xóa sản phẩm
          const removedItemName = currentItem.name;
          const removedItemSize = currentItem.selectedSize;
          state.cart = state.cart.filter(
            (item) => item.cartItemId !== cartItemId
          );
          toast.error(
            `${removedItemName} (Size: ${removedItemSize}) đã bị xóa khỏi giỏ`,
            {
              position: "bottom-left",
            }
          );
        }
        // Tính lại tổng và lưu
        const totals = calculateTotals(state.cart);
        state.cartTotalQuantity = totals.quantity;
        state.cartTotalAmount = totals.total;
        saveCartToStorage(state.cart);
      }
    },
    removeFromCart(state, action) {
      const { cartItemId } = action.payload;
      const initialLength = state.cart.length;
      let removedItemName = "";
      let removedItemSize = "";

      state.cart = state.cart.filter((item) => {
        if (item.cartItemId === cartItemId) {
          removedItemName = item.name;
          removedItemSize = item.selectedSize;
          return false; // Xóa item này
        }
        return true; // Giữ các item khác
      });

      if (state.cart.length < initialLength) {
        toast.error(
          `${removedItemName} (Size: ${removedItemSize}) đã bị xóa khỏi giỏ`,
          {
            position: "bottom-left",
          }
        );

        const totals = calculateTotals(state.cart);
        state.cartTotalQuantity = totals.quantity;
        state.cartTotalAmount = totals.total;
        saveCartToStorage(state.cart);
      }
    },
    getTotals(state, action) {
      const totals = calculateTotals(state.cart);
      state.cartTotalQuantity = totals.quantity;
      state.cartTotalAmount = totals.total;
    },
    clearCart(state) {
      state.cart = [];
      state.cartTotalQuantity = 0;
      state.cartTotalAmount = 0;
      saveCartToStorage(state.cart);
      toast.error("Giỏ hàng đã được xóa", { position: "bottom-left" });
    },
  },
});

export const {
  setCartItems,
  addToCart,
  decreaseCart,
  removeFromCart,
  getTotals,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
