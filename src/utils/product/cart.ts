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

/**
 * Handles adding a product to the user's cart
 *
 * @param {string} productId - The ID of the product to add
 * @param {string} userId - The ID of the user adding the product
 * @param {AppDispatch} dispatch - Redux dispatch function
 * @param {number} [quantity=1] - Quantity of the product to add
 * @returns {Promise<void>}
 *
 * This function performs the following operations:
 * 1. Creates a temporary cart item for optimistic UI update
 * 2. Dispatches the temporary item to Redux store
 * 3. Makes API call to add item to server cart
 * 4. On success, updates store with fresh cart data from server
 * 5. On failure, removes temporary item and shows error
 */
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
  }
};

/**
 * Handles updating the quantity of a product in the user's cart
 *
 * @param {CartItem} cartItem - The cart item to update
 * @param {number} quantity - New quantity for the item
 * @param {AppDispatch} dispatch - Redux dispatch function
 * @returns {Promise<void>}
 *
 * This function performs the following operations:
 * 1. Optimistically updates local state
 * 2. Makes API call to update quantity on server
 * 3. On success, remains with optimistic update
 * 4. On failure, reverts to initial quantity
 */
export const handleUpdateCartQuantity = async (
  cartItem: CartItem,
  quantity: number,
  dispatch: AppDispatch
) => {
  // Store initial quantity for potential rollback
  const initialQuantity = cartItem.quantity;

  try {
    // Optimistically update local state first
    dispatch(updateCartItemQuantity({ id: cartItem.id, quantity }));

    // Make API call to update quantity on server
    const response = await fetch(
      `/api/user/cart?id=${cartItem.id}&quantity=${quantity}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    if (data.statusText !== "success") {
      throw new Error("Failed to update cart quantity");
    }

    toast.success("Cart quantity updated successfully!");
  } catch (error) {
    // If API call fails, revert to initial quantity
    dispatch(
      updateCartItemQuantity({ id: cartItem.id, quantity: initialQuantity })
    );
    toast.error("Something went wrong while updating cart quantity");
  }
};

/**
 * Handles removing an item from the cart
 *
 * @param {CartItem} cartItem - The cart item to remove
 * @param {AppDispatch} dispatch - Redux dispatch function
 * @returns {Promise<void>}
 *
 * This function performs the following operations:
 * 1. Optimistically removes item from local state
 * 2. Makes API call to remove item from server
 * 3. On success, remains with optimistic removal
 * 4. On failure, reverts by adding item back to cart
 */
export const handleRemoveFromCart = async (
  cartItem: CartItem,
  dispatch: AppDispatch
) => {
  try {
    // Optimistically remove item from local state
    dispatch(removeFromCart(cartItem.id));

    // Make API call to remove item from server
    const response = await fetch(`/api/user/cart/${cartItem.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    if (data.statusText !== "success") {
      throw new Error("Failed to remove item from cart");
    }

    toast.success("Item removed from cart successfully!");
  } catch (error) {
    // If API call fails, revert by adding item back to cart
    dispatch(addToCart(cartItem));
    toast.error("Something went wrong while removing item from cart");
  }
};
