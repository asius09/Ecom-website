"use client";

import { Button } from "@/components/ui/button";
import { Heart, Trash } from "lucide-react";
import { useState } from "react";
import { QuantitySelector } from "./QuantitySelector";
import { Skeleton } from "@/components/ui/skeleton";
import { updateQuantity, removeFromCart } from "@/lib/store/slices/cartSlice";
import { toggleWishlist } from "@/lib/store/slices/wishlistSlice";
import { CartItem as CartItemProps } from "@/types/cartItem";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import {
  handleRemoveFromCart,
  handleUpdateCartQuantity,
} from "@/utils/product/cart";
import { handleToggleWishlist } from "@/utils/product/wishlist";

export function CartItem({ id, user_id, product_id, quantity }: CartItemProps) {
  const dispatch = useAppDispatch();
  const [isImageLoading, setIsImageLoading] = useState(true);

  // Get product details and wishlist status from store
  const product = useAppSelector((state) =>
    state.products.products.find((p) => p.id === product_id)
  );
  const isWishlisted = useAppSelector((state) =>
    state.wishlist.items.some(
      (item) => item.user_id === user_id && item.product_id === product_id
    )
  );

  const handleRemoveItem = async (id: string) => {
    try {
      await handleRemoveFromCart(id, user_id);
      dispatch(removeFromCart(id));
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  const handleQuantityChange = async (newQuantity: number) => {
    if (newQuantity >= 1) {
      try {
        const success = await handleUpdateCartQuantity(id, newQuantity);
        if (success) {
          dispatch(updateQuantity({ id, quantity: newQuantity }));
        }
      } catch (error) {
        console.error("Error updating quantity:", error);
      }
    }
  };

  const handleToggleWishlistItem = async () => {
    try {
      const success = await handleToggleWishlist(product_id, user_id);
      if (success !== undefined) {
        dispatch(toggleWishlist({ user_id, product_id }));
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    }
  };

  if (!product) {
    return null;
  }

  const calculateItemTotal = () => {
    return (product.price * quantity).toFixed(2);
  };

  return (
    <div className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-sm transition-shadow">
      <div className="relative w-24 h-24 flex-shrink-0">
        {isImageLoading && <Skeleton className="absolute inset-0 rounded-md" />}
        <img
          src={product.image_url}
          alt={product.name}
          className={`object-cover rounded-md w-full h-full ${
            isImageLoading ? "opacity-0" : "opacity-100"
          }`}
          onLoad={() => setIsImageLoading(false)}
        />
      </div>
      <div className="flex-1 space-y-2">
        <h3 className="font-medium line-clamp-2">{product.name}</h3>
        <p className="text-muted-foreground">
          ${product.price.toFixed(2)} x {quantity} = ${calculateItemTotal()}
        </p>
        <div className="mt-2">
          <QuantitySelector
            initialQuantity={quantity}
            onQuantityChange={handleQuantityChange}
            min={1}
            max={99}
          />
        </div>
      </div>
      <div className="flex flex-col items-end gap-2">
        <p className="font-medium">${calculateItemTotal()}</p>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleToggleWishlistItem}
            aria-label="Move to wishlist"
            className="hover:bg-accent/50"
          >
            <Heart
              className={`h-4 w-4 transition-colors ${
                isWishlisted ? "text-red-500 fill-red-500" : "text-foreground"
              }`}
            />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleRemoveItem(id)}
            aria-label="Remove item"
            className="hover:bg-destructive/10"
          >
            <Trash className="h-4 w-4 text-destructive" />
          </Button>
        </div>
      </div>
    </div>
  );
}
