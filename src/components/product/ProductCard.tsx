"use client";

import { Button } from "@/components/ui/button";
import { ShoppingCart, Star } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
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
  const dispatch = useAppDispatch();

  const handleCartAction = async (e: React.MouseEvent, isBuyNow = false) => {
    e.preventDefault();
    e.stopPropagation();

    if (!userId) {
      route.push("/login");
      return;
    }

    try {
      const res = await handleAddToCart(id, userId, dispatch);
      if (isBuyNow && res) {
        route.push(`/cart/${userId}`);
      }
    } catch (error) {
      console.error("Error during cart action:", error);
    }
  };

  const cardActionBtns = [
    {
      title: "Add to Cart",
      icon: <ShoppingCart className="h-3 w-3 sm:h-4 sm:w-4" />,
      onClick: (e: React.MouseEvent) => handleCartAction(e),
      variant: "outline" as const,
    },
    {
      title: "Buy Now",
      onClick: (e: React.MouseEvent) => handleCartAction(e, true),
      variant: "default" as const,
    },
  ];

  return (
    <div className="bg-card rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow w-[300px] h-[400px] flex flex-col">
      <Link href={`/product/${id}`} className="flex flex-col h-full">
        {image_url && (
          <div className="relative aspect-[4/3] flex-shrink-0">
            <img
              src={image_url}
              alt={name}
              className="w-full h-full object-cover"
              loading="lazy"
            />
            <div
              className="absolute top-2 right-2"
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
        <div className="p-3 flex flex-col flex-1 gap-1">
          <h3 className="text-base font-semibold text-card-foreground truncate">
            {name}
          </h3>
          <div className="flex items-center gap-1">
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
          <p className="text-xs text-muted-foreground line-clamp-2 flex-1">
            {description}
          </p>
          <div className="mt-2">
            <span className="text-base font-bold text-primary">
              ${price.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="w-full flex flex-row gap-x-2 px-3 pb-3">
          {cardActionBtns.map((btn, index) => (
            <Button
              key={index}
              variant={btn.variant}
              className="w-1/2 h-8 text-xs flex items-center justify-center gap-1 cursor-pointer"
              onClick={btn.onClick}
            >
              {btn.icon && btn.icon}
              <span>{btn.title}</span>
            </Button>
          ))}
        </div>
      </Link>
    </div>
  );
}
