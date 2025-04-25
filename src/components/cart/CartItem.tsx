"use client";

import { Button } from "@/components/ui/button";
import { Heart, Trash } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { QuantitySelector } from "./QuantitySelector";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";

interface CartItemProps {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
  onRemove: (id: string) => void;
  onQuantityChange: (id: string, quantity: number) => void;
}

export function CartItem({
  id,
  name,
  price,
  quantity,
  imageUrl,
  onRemove,
  onQuantityChange,
}: CartItemProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const isMobile = useIsMobile();

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0) {
      onQuantityChange(id, newQuantity);
    }
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div className="flex items-center gap-4 p-4 border rounded-lg hover:shadow-sm transition-shadow">
      <div className="relative w-24 h-24 flex-shrink-0">
        {isImageLoading && (
          <Skeleton className="absolute inset-0 rounded-md" />
        )}
        <Image
          src={imageUrl}
          alt={name}
          fill
          className={`object-cover rounded-md ${
            isImageLoading ? "opacity-0" : "opacity-100"
          }`}
          onLoadingComplete={() => setIsImageLoading(false)}
          sizes={isMobile ? "100vw" : "33vw"}
        />
      </div>
      <div className="flex-1 space-y-2">
        <h3 className="font-medium line-clamp-2">{name}</h3>
        <p className="text-muted-foreground">${price.toFixed(2)}</p>
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
        <p className="font-medium">${(price * quantity).toFixed(2)}</p>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleWishlist}
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
            onClick={() => onRemove(id)}
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
