"use client";
import { toast } from "sonner";
import { AppDispatch } from "@/lib/store/store";
import {
  addToWishlist,
  removeFromWishlist,
  setWishlist,
} from "@/lib/store/features/wishlistSlice";
import { nanoid } from "nanoid";

/**
 * Handles toggling a product in the user's wishlist
 *
 * @param {string} productId - The ID of the product to toggle
 * @param {string} userId - The ID of the user performing the action
 * @param {AppDispatch} dispatch - Redux dispatch function
 * @returns {Promise<boolean>} - Returns true if product was added, false if removed
 *
 * This function performs the following operations:
 * 1. Checks if the product exists in the user's wishlist
 * 2. If exists, removes it from wishlist
 * 3. If doesn't exist, adds it to wishlist
 * 4. Uses optimistic updates for better UX
 * 5. Syncs with server and updates Redux store
 * 6. Shows toast notifications for success/error states
 */
export const handleToggleWishlist = async (
  productId: string,
  userId: string,
  dispatch: AppDispatch
) => {
  const tempId = `temp-${nanoid()}`; // Generate temporary ID for optimistic update

  try {
    // Check if product exists in wishlist
    const checkResponse = await fetch(
      `/api/user/wishlist?user_id=${userId}&product_id=${productId}`
    );
    const checkData = await checkResponse.json();

    if (checkData.data && checkData.data.length > 0) {
      // Remove from wishlist if exists
      const existingId = checkData.data[0].id;
      // First dispatch the removal to store
      dispatch(removeFromWishlist({ wishlistId: existingId }));

      // Then make API request
      const deleteResponse = await fetch("/api/user/wishlist", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: existingId, user_id: userId }),
      });

      const deleteData = await deleteResponse.json();
      if (deleteData.statusText !== "success") {
        // If API fails, restore the item in store
        const wishlistResponse = await fetch("/api/user/wishlist");
        const wishlistData = await wishlistResponse.json();
        if (wishlistData.statusText === "success") {
          dispatch(setWishlist(wishlistData.data));
        }
        throw new Error("Failed to remove from wishlist");
      }

      toast.success("Removed from wishlist!");
      return false;
    } else {
      // Add to wishlist if doesn't exist
      const tempItem = {
        id: tempId,
        product_id: productId,
        user_id: userId,
      };
      // First dispatch the addition to store
      dispatch(addToWishlist(tempItem));

      // Then make API request
      const addResponse = await fetch("/api/user/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ product_id: productId, user_id: userId }),
      });

      const addData = await addResponse.json();
      if (addData.statusText !== "success") {
        // If API fails, remove the item from store
        dispatch(removeFromWishlist({ wishlistId: tempId }));
        throw new Error("Failed to add to wishlist");
      }

      toast.success("Added to wishlist!");
      return true;
    }
  } catch (error) {
    toast.error("Failed to update wishlist");
    throw new Error("Wishlist failed to add or remove item: " + error);
  }
};


