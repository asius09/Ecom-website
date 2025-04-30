import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WishlistItem } from "@/types/wishlistItem";
import { nanoid } from "@reduxjs/toolkit";

interface WishlistState {
  items: WishlistItem[];
}

const initialState: WishlistState = {
  items: [],
};

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    setWishlist: (state, action: PayloadAction<WishlistItem[]>) => {
      state.items = [...action.payload];
    },
    addToWishlist: (state, action: PayloadAction<WishlistItem>) => {
      const existingItem = state.items.find(
        (item) => item.id === action.payload.id
      );
      if (!existingItem) {
        state.items.push(action.payload);
      }
    },
    removeFromWishlist: (
      state,
      action: PayloadAction<{ wishlistId: string }>
    ) => {
      const { wishlistId } = action.payload;
      const existingItem = state.items.find((item) => item.id === wishlistId);

      if (existingItem) {
        state.items = state.items.filter((item) => item.id !== wishlistId);
      }
    },
    toggleWishlist: (
      state,
      action: PayloadAction<{ user_id: string; product_id: string }>
    ) => {
      const { user_id, product_id } = action.payload;
      const existingItem = state.items.find(
        (item) => item.user_id === user_id && item.product_id === product_id
      );

      if (existingItem) {
        state.items = state.items.filter(
          (item) =>
            !(item.user_id === user_id && item.product_id === product_id)
        );
      } else {
        state.items.push({
          id: nanoid(),
          user_id,
          product_id,
        });
      }
    },
    clearWishlist: (state) => {
      state.items = [];
    },
  },
});

export const {
  setWishlist,
  addToWishlist,
  toggleWishlist,
  removeFromWishlist,
  clearWishlist,
} = wishlistSlice.actions;
export default wishlistSlice.reducer;
