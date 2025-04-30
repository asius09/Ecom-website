import { toast } from "sonner";
import { supabase } from "@/utils/supabase/client";
import { AppDispatch } from "@/lib/store/store";
import {
  addToCart,
  removeFromCart,
} from "@/app/api/products/users/cart/action";
import {
  optimisticUpdateStart,
  optimisticUpdateEnd,
  updateQuantity,
} from "@/lib/store/slices/cartSlice";

export const handleAddToCart = async (
  productId: string,
  userId: string,
  quantity: number = 1
) => {
  try {
    const isAddedToCart = await addToCart(productId, userId, quantity);
    if (isAddedToCart) {
      toast.success("Product added to cart successfully!");
      return true;
    }
    return false;
  } catch (error) {
    toast.error("Failed to add product to cart");
    console.error("Error adding to cart:", error);
    return false;
  }
};

export const handleRemoveFromCart = async (
  cartItemId: string,
  userId: string
) => {
  try {
    const isRemoved = await removeFromCart(cartItemId, userId);
    if (isRemoved) {
      toast.success("Product removed from cart successfully!");
      return true;
    }
    return false;
  } catch (error) {
    toast.error("Failed to remove product from cart");
    console.error("Error removing from cart:", error);
    return false;
  }
};

export const handleUpdateCartQuantity = async (
  cartItemId: string,
  newQuantity: number,
  dispatch: AppDispatch
) => {
  try {
    // Start optimistic update
    dispatch(optimisticUpdateStart(cartItemId));

    // Local update first
    dispatch(updateQuantity({ id: cartItemId, quantity: newQuantity }));

    // Sync with database
    const { error } = await supabase
      .from("cart_items")
      .update({ quantity: newQuantity })
      .eq("id", cartItemId);

    if (error) throw error;
    return true;
  } catch (error) {
    // Revert on error
    const { data: originalItem } = await supabase
      .from("cart_items")
      .select("quantity")
      .eq("id", cartItemId)
      .single();

    if (originalItem) {
      dispatch(
        updateQuantity({ id: cartItemId, quantity: originalItem.quantity })
      );
    }
    throw error;
  } finally {
    dispatch(optimisticUpdateEnd(cartItemId));
  }
};
