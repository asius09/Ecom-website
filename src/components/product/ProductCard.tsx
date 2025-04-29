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

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  const cardActionBtns = [
    {
      title: "Add to Cart",
      icon: <ShoppingCart className="mr-1 h-2.5 w-2.5 sm:h-3.5 sm:w-3.5" />,
      onClick: () => {},
      variant: "outline" as const,
    },
    {
      title: "Buy Now",
      onClick: () => {},
      variant: "default" as const,
    },
  ];

  return (
    <div className="bg-card rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow w-full max-w-[280px] min-w-[150px] sm:min-w-[180px]">
      {imageUrl && (
        <div className="relative aspect-[4/3]">
          <img
            src={imageUrl}
            alt={name}
            className="w-full h-full object-cover"
          />
          <button
            onClick={toggleWishlist}
            className="absolute top-1.5 right-1.5 p-1.5 rounded-full bg-background/80 hover:bg-background transition-colors cursor-pointer"
            aria-label="Add to wishlist"
          >
            <Heart
              className={`h-3 w-3 sm:h-4 sm:w-4 ${
                isWishlisted ? "text-red-500 fill-red-500" : "text-foreground"
              }`}
            />
          </button>
        </div>
      )}
      <div className="p-2 sm:p-3 flex flex-col">
        <h3 className="text-sm sm:text-base font-semibold text-card-foreground mb-1 truncate">
          {name}
        </h3>
        <div className="flex items-center gap-0.5 sm:gap-1 mb-1 sm:mb-1.5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 ${
                i < Math.floor(rating)
                  ? "text-yellow-400 fill-yellow-400"
                  : "text-muted-foreground"
              }`}
            />
          ))}
          <span className="text-[9px] sm:text-xs text-muted-foreground ml-0.5 sm:ml-1">
            ({reviewCount})
          </span>
        </div>
        <p className="text-[10px] sm:text-xs text-muted-foreground mb-2 sm:mb-3 line-clamp-2 flex-grow">
          {description}
        </p>
        <div className="flex items-center justify-between mb-2 sm:mb-3">
          <span className="text-sm sm:text-base font-bold text-primary">
            ${price.toFixed(2)}
          </span>
        </div>
        <div className="flex flex-col md:flex-row gap-3 md:gap-2">
          {cardActionBtns.map((btn, index) => (
            <Button
              key={index}
              variant={btn.variant}
              className="w-full md:w-1/2 cursor-pointer h-7 sm:h-8 text-[10px] sm:text-xs px-2 sm:px-4"
              onClick={btn.onClick}
            >
              {btn.icon && btn.icon}
              {btn.title}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
}
