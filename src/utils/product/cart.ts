"use client";
import { toast } from "sonner";
import { AppDispatch } from "@/lib/store/store";
import {
  addToCart,
  updateCartItemQuantity,
  setCartItems,
  removeFromCart,
} from "@/lib/store/features/cartSlice";
import { CartItem } from "@/types/cartItem";
import { nanoid } from "nanoid";

interface CartResponse {
  statusText: string;
  data?: CartItem[];
  error?: string;
}

/**
 * Handles adding a product to the user's cart
 *
 * @param {string} productId - The ID of the product to add
 * @param {string} userId - The ID of the user adding the product
 * @param {AppDispatch} dispatch - Redux dispatch function
 * @param {number} [quantity=1] - Quantity of the product to add
 * @returns {Promise<void>}
 */
export const handleAddToCart = async (
  productId: string,
  userId: string,
  dispatch: AppDispatch,
  quantity: number = 1
): Promise<void> => {
  const tempCartItem: CartItem = {
    id: `temp-${nanoid()}`,
    product_id: productId,
    user_id: userId,
    quantity,
  };

  try {
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

    const data: CartResponse = await response.json();
    if (data.statusText !== "success") {
      throw new Error(data.error || "Failed to add to cart");
    }

    const cartResponse = await fetch("/api/user/cart");
    const cartData: CartResponse = await cartResponse.json();
    if (cartData.statusText === "success" && cartData.data) {
      dispatch(setCartItems(cartData.data));
    }

    toast.success("Product added to cart successfully!");
  } catch (err: unknown) {
    dispatch(removeFromCart(tempCartItem.id));
    const error = err instanceof Error ? err : new Error("Unknown error");
    toast.error(error.message);
    console.error("Error adding to cart:", error);
  }
};

/**
 * Handles updating the quantity of a product in the user's cart
 *
 * @param {CartItem} cartItem - The cart item to update
 * @param {number} quantity - New quantity for the item
 * @param {AppDispatch} dispatch - Redux dispatch function
 * @returns {Promise<void>}
 */
export const handleUpdateCartQuantity = async (
  cartItem: CartItem,
  quantity: number,
  dispatch: AppDispatch
): Promise<void> => {
  const initialQuantity = cartItem.quantity;

  try {
    dispatch(updateCartItemQuantity({ id: cartItem.id, quantity }));

    const response = await fetch(
      `/api/user/cart?id=${cartItem.id}&quantity=${quantity}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data: CartResponse = await response.json();
    if (data.statusText !== "success") {
      throw new Error(data.error || "Failed to update cart quantity");
    }

    toast.success("Cart quantity updated successfully!");
  } catch (err: unknown) {
    dispatch(updateCartItemQuantity({ id: cartItem.id, quantity: initialQuantity }));
    const error = err instanceof Error ? err : new Error("Unknown error");
    toast.error(error.message);
  }
};

/**
 * Handles removing an item from the cart
 *
 * @param {CartItem} cartItem - The cart item to remove
 * @param {AppDispatch} dispatch - Redux dispatch function
 * @returns {Promise<void>}
 */
export const handleRemoveFromCart = async (
  cartItem: CartItem,
  dispatch: AppDispatch
): Promise<void> => {
  try {
    dispatch(removeFromCart(cartItem.id));

    const response = await fetch(`/api/user/cart/${cartItem.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data: CartResponse = await response.json();
    if (data.statusText !== "success") {
      throw new Error(data.error || "Failed to remove item from cart");
    }

    toast.success("Item removed from cart successfully!");
  } catch (err: unknown) {
    dispatch(addToCart(cartItem));
    const error = err instanceof Error ? err : new Error("Unknown error");
    toast.error(error.message);
  }
};
