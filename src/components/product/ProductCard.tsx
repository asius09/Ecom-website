"use client";

import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Star } from "lucide-react";
import { useState } from "react";

interface ProductCardProps {
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  rating?: number;
  reviewCount?: number;
}

export function ProductCard({
  name,
  description,
  price,
  imageUrl,
  rating = 4.5,
  reviewCount = 120,
}: ProductCardProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = () => {
    // Add to cart logic
  };

  const handleBuyNow = () => {
    // Buy now logic
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div className="bg-card rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow w-full max-w-[350px] min-w-[280px]">
      {imageUrl && (
        <div className="relative aspect-square">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={toggleWishlist}
            className="absolute top-2 right-2 p-2 rounded-full bg-background/80 hover:bg-background transition-colors cursor-pointer"
            aria-label="Add to wishlist"
          >
            <Heart
              className={`h-5 w-5 ${
                isWishlisted ? "text-red-500 fill-red-500" : "text-foreground"
              }`}
            />
          </button>
        </div>
      )}
      <div className="p-4 flex flex-col">
        <h3 className="text-lg font-semibold text-card-foreground mb-2 truncate">
          {name}
        </h3>
        <div className="flex items-center gap-1 mb-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < Math.floor(rating)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-muted-foreground"
              }`}
            />
          ))}
          <span className="text-sm text-muted-foreground ml-1">
            ({reviewCount})
          </span>
        </div>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-grow">
          {description}
        </p>
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-bold text-primary">
            ${price.toFixed(2)}
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 min-w-0 cursor-pointer"
            onClick={handleAddToCart}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            Add to Cart
          </Button>
          <Button
            className="flex-1 min-w-0 cursor-pointer"
            onClick={handleBuyNow}
          >
            Buy Now
          </Button>
        </div>
      </div>
    </div>
  );
}
