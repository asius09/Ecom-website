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
    addToWishlist: (state, action: PayloadAction<WishlistItem[]>) => {
      state.items = [...state.items, ...action.payload];
    },
    toggleWishlist: (state, action: PayloadAction<{ user_id: string; product_id: string }>) => {
      const { user_id, product_id } = action.payload;
      const existingItem = state.items.find(
        (item) => item.user_id === user_id && item.product_id === product_id
      );

      if (existingItem) {
        state.items = state.items.filter(
          (item) => !(item.user_id === user_id && item.product_id === product_id)
        );
      } else {
        state.items.push({
          id: nanoid(),
          user_id,
          product_id,
        });
      }
    },
  },
});

export const { addToWishlist, toggleWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;
