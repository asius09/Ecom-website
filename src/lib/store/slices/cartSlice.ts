import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "@/types/cartItem";
import { nanoid } from "@reduxjs/toolkit";

interface CartState {
  items: CartItem[];
  pendingUpdates: Record<string, boolean>;
  itemCount: number;
}

const initialState: CartState = {
  items: [],
  pendingUpdates: {},
  itemCount: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    setCartItems: (state, action: PayloadAction<CartItem[]>) => {
      state.items = action.payload;
      state.itemCount = action.payload.reduce(
        (acc, item) => acc + item.quantity,
        0
      );
    },
    updateQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        const oldQuantity = item.quantity;
        item.quantity = action.payload.quantity;
        state.itemCount += action.payload.quantity - oldQuantity;
      }
    },
    addToCart: (state, action: PayloadAction<CartItem>) => {
      state.items.push(action.payload);
      state.itemCount += action.payload.quantity;
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      const item = state.items.find((item) => item.id === action.payload);
      if (item) {
        state.itemCount -= item.quantity;
      }
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearCart: (state) => {
      state.items = [];
      state.itemCount = 0;
    },
    optimisticUpdateStart: (state, action: PayloadAction<string>) => {
      state.pendingUpdates[action.payload] = true;
    },
    optimisticUpdateEnd: (state, action: PayloadAction<string>) => {
      delete state.pendingUpdates[action.payload];
    },
  },
});

export const {
  setCartItems,
  updateQuantity,
  addToCart,
  removeFromCart,
  clearCart,
  optimisticUpdateStart,
  optimisticUpdateEnd,
} = cartSlice.actions;

export default cartSlice.reducer;
