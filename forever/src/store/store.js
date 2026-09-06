import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import { baseApi } from "./api/baseApi";
import cartReducer from "../features/cart/cartSlice";
import { cartListenerMiddleware } from "../features/cart/cartListeners";
import productsReducer from "../features/products/productsSlice";
import ordersReducer from "../features/orders/ordersSlice";
import wishlistReducer from "../features/wishlist/wishlistSlice";
import { wishlistListenerMiddleware } from "../features/wishlist/wishlistListeners";

export const store = configureStore({
  reducer: {
    products: productsReducer,
    auth: authReducer,
    cart: cartReducer,
    orders: ordersReducer,
    wishlist: wishlistReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .prepend(cartListenerMiddleware.middleware)
      .prepend(wishlistListenerMiddleware.middleware)
      .concat(baseApi.middleware),
});

