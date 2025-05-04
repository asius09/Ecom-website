"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart, Star } from "lucide-react";
import { useAppSelector } from "@/lib/hooks";
import { Product } from "@/types/product";
import { handleAddToCart } from "@/utils/product/cart";
import { useRouter } from "next/navigation";
import { WishlistButton } from "../wishlist/WishlistButton";
import Link from "next/link";

interface ProductCardProps extends Product {}

export function ProductCard({
  id,
  name,
  description,
  price,
  image_url,
  review,
}: ProductCardProps) {
  const { id: userId } = useAppSelector((state) => state.user);
  const route = useRouter();

  const cardActionBtns = [
    {
      title: "Add to Cart",
      icon: <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />,
      onClick: async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        try {
          const success = await handleAddToCart(id, userId!);
        } catch (error) {
          console.error("Error adding to cart:", error);
        }
      },
      variant: "outline" as const,
    },
    {
      title: "Buy Now",
      onClick: async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        try {
          const success = await handleAddToCart(id, userId!);
          if (success) {
            route.push(`/cart/${userId}`);
          }
        } catch (error) {
          console.error("Error during Buy Now:", error);
        }
      },
      variant: "default" as const,
    },
  ];

  return (
    <div className="bg-card rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow w-full max-w-[240px] min-w-[120px] sm:min-w-[140px] md:max-w-[280px] flex-1">
      <Link href={`/product/${id}`} className="block">
        {image_url && (
          <div className="relative aspect-[4/3]">
            <img
              src={image_url}
              alt={name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div
              className="absolute top-1 right-1 sm:top-2 sm:right-2"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <WishlistButton
                productId={id}
                className="bg-background/50 backdrop-blur-sm rounded-full p-1 hover:bg-background/70 transition-colors cursor-pointer"
              />
            </div>
          </div>
        )}
        <div className="p-2 sm:p-3 flex flex-col w-full">
          <h3 className="text-xs sm:text-sm md:text-base font-semibold text-card-foreground mb-1 truncate max-w-[200px]">
            {name}
          </h3>
          <div className="flex items-center gap-0.5 mb-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(review)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-muted-foreground"
                }`}
              />
            ))}
            <span className="text-xs text-muted-foreground ml-1">
              ({review})
            </span>
          </div>
          <p className="text-[10px] sm:text-xs text-muted-foreground mb-2 line-clamp-2 flex-grow max-w-[200px]">
            {description}
          </p>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm sm:text-base font-bold text-primary truncate max-w-[100px]">
              ${price.toFixed(2)}
            </span>
          </div>
        </div>
      </Link>
      <div className="w-full flex flex-col gap-1 px-2 sm:px-3 pb-2 sm:pb-3">
        {cardActionBtns.map((btn, index) => (
          <Button
            key={index}
            variant={btn.variant}
            className="w-full cursor-pointer h-7 sm:h-8 text-xs px-2 whitespace-nowrap overflow-hidden text-ellipsis flex items-center justify-center gap-1"
            onClick={btn.onClick}
          >
            {btn.icon && btn.icon}
            <span className="truncate">{btn.title}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
