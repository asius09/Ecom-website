"use client";
import { toast } from "sonner";
import { AppDispatch } from "@/lib/store/store";
import { addToCart, removeFromCart, setCartItems } from "@/lib/store/features/cartSlice";
import { CartItem } from "@/types/cartItem";
import { nanoid } from "nanoid";

export const handleAddToCart = async (
  productId: string,
  userId: string,
  dispatch: AppDispatch,
  quantity: number = 1
) => {
  const tempCartItem: CartItem = {
    id: `temp-${nanoid()}`,
    product_id: productId,
    user_id: userId,
    quantity,
  };

  try {
    // Optimistically update local state
    dispatch(addToCart(tempCartItem));

    const response = await fetch("/api/user/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        product_id: productId,
        user_id: userId,
        quantity,
      }),
    });

    const data = await response.json();
    if (data.statusText !== "success") {
      throw new Error("Failed to add to cart");
    }

    // Update store with actual data from server
    const cartResponse = await fetch("/api/user/cart");
    const cartData = await cartResponse.json();
    if (cartData.statusText === "success") {
      dispatch(setCartItems(cartData.data));
    }

    toast.success("Product added to cart successfully!");
  } catch (error) {
    // If API call fails, remove the temporary item
    dispatch(removeFromCart(tempCartItem.id));
    toast.error("Something went wrong while adding to cart");
    console.error("Error adding to cart:", error);
  }
};

export const handleRemoveFromCart = async (
  cartItemId: string,
  userId: string,
  dispatch: AppDispatch
) => {
  const storedId = cartItemId; // Store the id for potential rollback

  try {
    // Optimistically update local state
    dispatch(removeFromCart(cartItemId));

    const response = await fetch("/api/user/cart", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id: cartItemId, user_id: userId }),
    });

    const data = await response.json();
    if (data.statusText !== "success") {
      throw new Error("Failed to remove from cart");
    }

    // Update store with actual data from server
    const cartResponse = await fetch("/api/user/cart");
    const cartData = await cartResponse.json();
    if (cartData.statusText === "success") {
      dispatch(setCartItems(cartData.data));
    }

    toast.success("Product removed from cart successfully!");
  } catch (error) {
    // If API call fails, re-fetch the cart to restore state
    const cartResponse = await fetch("/api/user/cart");
    const cartData = await cartResponse.json();
    if (cartData.statusText === "success") {
      dispatch(setCartItems(cartData.data));
    }
    
    toast.error("Something went wrong while removing from cart");
    console.error("Error removing from cart:", error);
  }
};
