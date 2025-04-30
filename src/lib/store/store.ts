import { configureStore } from "@reduxjs/toolkit";
import productReducer from "@/lib/store/slices/productSlice";
import userReducer from "@/lib/store/slices/userSlice";
import cartReducer from "@/lib/store/slices/cartSlice";
import wishlistReducer from "@/lib/store/slices/wishlistSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      products: productReducer,
      user: userReducer,
      cart: cartReducer,
      wishlist: wishlistReducer,
    },
  });
};

// Infer the type of makeStore
export type AppStore = ReturnType<typeof makeStore>;
// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
