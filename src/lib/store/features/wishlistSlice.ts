import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { WishlistItem } from "@/types/wishlistItem";

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
    clearWishlist: (state) => {
      state.items = [];
    },
    toggleWishlistItem: (
      state,
      action: PayloadAction<{ id: string; productId: string; userId: string }>
    ) => {
      const { id, productId, userId } = action.payload;
      const existingItemIndex = state.items.findIndex(
        (item) => item.product_id === productId && item.user_id === userId
      );

      if (existingItemIndex !== -1) {
        // Remove if exists
        state.items.splice(existingItemIndex, 1);
      } else {
        // Add if doesn't exist
        const newItem: WishlistItem = {
          id, // Use provided ID
          product_id: productId,
          user_id: userId,
        };
        state.items.push(newItem);
      }
    },
  },
});

export const {
  setWishlist,
  addToWishlist,
  removeFromWishlist,
  clearWishlist,
  toggleWishlistItem,
} = wishlistSlice.actions;
export default wishlistSlice.reducer;
