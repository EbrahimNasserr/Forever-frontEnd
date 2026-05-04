import { createSlice } from "@reduxjs/toolkit";
import { products as seedProducts } from "../assets/assets";

const initialState = {
  items: seedProducts,
};

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts(state, action) {
      state.items = action.payload;
    },
  },
});

export const { setProducts } = productsSlice.actions;
export default productsSlice.reducer;

