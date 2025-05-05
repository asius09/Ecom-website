import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { CartItem } from "@/types/cartItem";

interface CartState {
  items: CartItem[];
  itemCount: number;
}

const initialState: CartState = {
  items: [],
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
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find(
        (item) => item.product_id === action.payload.product_id
      );
      if (existingItem) {
        existingItem.quantity += action.payload.quantity;
      } else {
        state.items.push(action.payload);
      }
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
    updateCartItemQuantity: (
      state,
      action: PayloadAction<{ id: string; quantity: number }>
    ) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        const quantityDifference = action.payload.quantity - item.quantity;
        item.quantity = action.payload.quantity;
        state.itemCount += quantityDifference;
      }
    },
  },
});

export const {
  setCartItems,
  addToCart,
  removeFromCart,
  clearCart,
  updateCartItemQuantity,
} = cartSlice.actions;

export default cartSlice.reducer;
