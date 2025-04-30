import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import productReducer from "@/lib/store/slices/productSlice";
import userReducer from "@/lib/store/slices/userSlice";
import cartReducer from "@/lib/store/slices/cartSlice";
import wishlistReducer from "@/lib/store/slices/wishlistSlice";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user", "cart", "wishlist"],
  version: 1,
};

const rootReducer = combineReducers({
  products: productReducer,
  user: userReducer,
  cart: cartReducer,
  wishlist: wishlistReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const makeStore = () => {
  const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
        },
      }),
  });

  const persistor = persistStore(store);
  return { store, persistor };
};
export const { store, persistor } = makeStore();

// Type definitions
export type AppStore = ReturnType<typeof makeStore>["store"];
export type AppDispatch = AppStore["dispatch"];
export type RootState = ReturnType<AppStore["getState"]>;
