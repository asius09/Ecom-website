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
      icon: <ShoppingCart className="mr-1 h-3 w-3 sm:h-4 sm:w-4" />,
      onClick: async () => {
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
      onClick: async () => {
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
    <div className="bg-card rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow w-full max-w-[240px] min-w-[140px] sm:min-w-[160px] md:max-w-[280px] flex-1">
      <Link href={`/product/${id}`}>
        {image_url && (
          <div className="relative aspect-[4/3]">
            <img
              src={image_url}
              alt={name}
              className="w-full h-full object-cover"
            />
            <WishlistButton
              productId={id}
              className="absolute top-2 right-2 bg-background/50 backdrop-blur-sm rounded-full p-1 hover:bg-background/70 transition-colors"
            />
          </div>
        )}
        <div className="p-3 flex flex-col w-full">
          <h3 className="text-xs sm:text-sm md:text-base font-semibold text-card-foreground mb-1 truncate">
            {name}
          </h3>
          <div className="flex items-center gap-0.5 sm:gap-1 mb-1 sm:mb-1.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 sm:h-4 sm:w-4 ${
                  i < Math.floor(review)
                    ? "text-yellow-400 fill-yellow-400"
                    : "text-muted-foreground"
                }`}
              />
            ))}
          </div>
          <p className="text-[10px] sm:text-xs md:text-sm text-muted-foreground mb-2 sm:mb-3 line-clamp-2 flex-grow">
            {description}
          </p>
          <div className="flex items-center justify-between mb-2 sm:mb-3">
            <span className="text-sm sm:text-base md:text-lg font-bold text-primary">
              ${price.toFixed(2)}
            </span>
          </div>
          <div className="w-full flex flex-row gap-1 sm:gap-2">
            {cardActionBtns.map((btn, index) => (
              <Button
                key={index}
                variant={btn.variant}
                className="w-1/2 cursor-pointer h-8 text-xs px-2 sm:px-3 whitespace-nowrap overflow-hidden text-ellipsis flex items-center gap-0.5"
                onClick={btn.onClick}
              >
                {btn.icon && btn.icon}
                {btn.title}
              </Button>
            ))}
          </div>
        </div>
      </Link>
    </div>
  );
}
