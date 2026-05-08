import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import { baseApi } from "./api/baseApi";
import cartReducer from "../features/cart/cartSlice";
import { cartListenerMiddleware } from "../features/cart/cartListeners";
import productsReducer from "../features/products/productsSlice";
import ordersReducer from "../features/orders/ordersSlice";

export const store = configureStore({
  reducer: {
    products: productsReducer,
    auth: authReducer,
    cart: cartReducer,
    orders: ordersReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .prepend(cartListenerMiddleware.middleware)
      .concat(baseApi.middleware),
});

