"use client";
import { toast } from "sonner";
import { AppDispatch } from "@/lib/store/store";
import {
  addToWishlist,
  removeFromWishlist,
  setWishlist,
} from "@/lib/store/features/wishlistSlice";
import { nanoid } from "nanoid";

export const handleToggleWishlist = async (
  productId: string,
  userId: string,
  dispatch: AppDispatch
) => {
  console.log('Starting wishlist toggle for product:', productId, 'user:', userId);
  const tempId = `temp-${nanoid()}`; // Generate temporary ID for optimistic update
  console.log('Generated temporary ID:', tempId);

  try {
    console.log('Checking if item exists in wishlist...');
    const checkResponse = await fetch(
      `/api/user/wishlist?user_id=${userId}&product_id=${productId}`
    );
    const checkData = await checkResponse.json();
    console.log('Check response:', checkData);

    if (checkData.data && checkData.data.length > 0) {
      console.log('Item exists in wishlist, removing...');
      const existingId = checkData.data[0].id;
      console.log('Removing item with ID:', existingId);
      dispatch(removeFromWishlist({ wishlistId: existingId }));

      const deleteResponse = await fetch("/api/user/wishlist", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: existingId, user_id: userId }),
      });

      const deleteData = await deleteResponse.json();
      console.log('Delete response:', deleteData);
      if (deleteData.statusText !== "success") {
        throw new Error("Failed to remove from wishlist");
      }

      console.log('Fetching updated wishlist from server...');
      const wishlistResponse = await fetch("/api/user/wishlist");
      const wishlistData = await wishlistResponse.json();
      console.log('Updated wishlist data:', wishlistData);
      if (wishlistData.statusText === "success") {
        dispatch(setWishlist(wishlistData.data));
      }

      toast.success("Removed from wishlist!");
      console.log('Successfully removed from wishlist');
      return false;
    } else {
      console.log('Item does not exist in wishlist, adding...');
      const tempItem = {
        id: tempId,
        product_id: productId,
        user_id: userId,
      };
      console.log('Adding temporary item:', tempItem);
      dispatch(addToWishlist(tempItem));

      const addResponse = await fetch("/api/user/wishlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ product_id: productId, user_id: userId }),
      });

      const addData = await addResponse.json();
      console.log('Add response:', addData);
      if (addData.statusText !== "success") {
        throw new Error("Failed to add to wishlist");
      }

      console.log('Fetching updated wishlist from server...');
      const wishlistResponse = await fetch("/api/user/wishlist");
      const wishlistData = await wishlistResponse.json();
      console.log('Updated wishlist data:', wishlistData);
      if (wishlistData.statusText === "success") {
        dispatch(setWishlist(wishlistData.data));
      }

      toast.success("Added to wishlist!");
      console.log('Successfully added to wishlist');
      return true;
    }
  } catch (error) {
    console.error('Error in wishlist toggle:', error);
    console.log('Attempting to restore wishlist state...');
    const wishlistResponse = await fetch("/api/user/wishlist");
    const wishlistData = await wishlistResponse.json();
    console.log('Restored wishlist data:', wishlistData);
    if (wishlistData.statusText === "success") {
      dispatch(setWishlist(wishlistData.data));
    }

    toast.error("Failed to update wishlist");
    return false;
  }
};
