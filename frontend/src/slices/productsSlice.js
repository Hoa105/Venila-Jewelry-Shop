import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export const productsFetch = createAsyncThunk(
  "products/productsFetch",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("http://localhost:8081/products");
      if (!response.ok) {
        return rejectWithValue("Server Error!");
      }
      const data = await response.json();

      // Kiểm tra định dạng dữ liệu trả về
      if (!Array.isArray(data.results)) {
        return rejectWithValue("Invalid data format");
      }

      return data.results;
    } catch (error) {
      return rejectWithValue(error.message || "Lỗi khi fetch sản phẩm");
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    status: "idle",
    error: null,
    cart: JSON.parse(localStorage.getItem("cart")) || [],
    searchQuery: "",
    selectedCategory: "Tất cả",
    selectedFavorite: "Tất cả",
    selectedNew: "Tất cả",
    selectedSale: "Tất cả",
    selectedMaterial: "Tất cả",
    priceRange: [0, 200000000],
  },
  reducers: {
    setSelectedCategory: (state, action) => {
      state.selectedCategory = action.payload;
    },
    setSelectedFavorite: (state, action) => {
      state.selectedFavorite = action.payload;
    },
    setSelectedNew: (state, action) => {
      state.selectedNew = action.payload;
    },
    setSelectedSale: (state, action) => {
      state.selectedSale = action.payload;
    },
    // Cập nhật chất liệu lọc
    setMaterial: (state, action) => {
      state.selectedMaterial = action.payload;
    },
    // Cập nhật khoảng giá lọc
    setPriceRange: (state, action) => {
      state.priceRange = action.payload;
    },
    // Cập nhật từ khóa tìm kiếm
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(productsFetch.pending, (state) => {
        if (state.status === "idle") {
          state.status = "loading";
        }
      })
      .addCase(productsFetch.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(productsFetch.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Lỗi không xác định";
      });
  },
});

export const {
  setSelectedCategory,
  setSelectedFavorite,
  setSelectedNew,
  setSelectedSale,
  setMaterial,
  setPriceRange,
  setSearchQuery,
} = productsSlice.actions;

export default productsSlice.reducer;
