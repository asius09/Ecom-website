"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { handleToggleWishlist } from "@/utils/product/wishlist";

interface WishlistButtonProps {
  productId: string;
  className?: string;
}

export function WishlistButton({ productId, className }: WishlistButtonProps) {
  const dispatch = useAppDispatch();
  const { id: userId } = useAppSelector((state) => state.user);
  const { items: wishlistItems } = useAppSelector((state) => state.wishlist);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkWishlistStatus = () => {
      const status = wishlistItems.some(
        (item) => item.product_id === productId && item.user_id === userId
      );
      setIsInWishlist(status);
    };

    checkWishlistStatus();
  }, [wishlistItems, productId, userId]);

  const handleClick = async () => {
    setIsLoading(true);
    try {
      const success = await handleToggleWishlist(productId, userId!, dispatch);
      if (success !== undefined) {
        setIsInWishlist(success);
      }
    } catch (error) {
      console.error("Error toggling wishlist:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      disabled={isLoading}
      aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
      className={cn("hover:bg-transparent", className)}
    >
      <Heart
        className={cn(
          "h-5 w-5 transition-colors",
          isInWishlist
            ? "fill-red-500 stroke-red-500 hover:fill-red-600 hover:stroke-red-600"
            : "stroke-foreground hover:stroke-red-500"
        )}
      />
    </Button>
  );
}
