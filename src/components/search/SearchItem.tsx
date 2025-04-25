"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart, Star, Truck, CheckCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsMobile } from "@/hooks/use-mobile";
import { useState } from "react";
import { Product } from "@/types/product";

interface SearchItemProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
}

export function SearchItem({
  product,
  onAddToCart,
  onAddToWishlist,
}: SearchItemProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const isMobile = useIsMobile();

  const handleAddToWishlist = () => {
    setIsWishlisted(!isWishlisted);
    onAddToWishlist(product);
  };

  return (
    <div className="w-full flex items-center gap-8 p-8 border rounded-lg hover:shadow-sm transition-shadow">
      <div className="relative w-48 h-48 flex-shrink-0 rounded-lg overflow-hidden shadow-md">
        {isImageLoading && (
          <Skeleton className="absolute inset-0 rounded-lg" />
        )}
        <Image
          src={product.featuredAsset?.preview || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}
          alt={product.name}
          fill
          className={`object-cover transition-opacity duration-300 ${
            isImageLoading ? "opacity-0" : "opacity-100"
          }`}
          onLoadingComplete={() => setIsImageLoading(false)}
          sizes={isMobile ? "100vw" : "33vw"}
          priority
        />
        {!isImageLoading && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        )}
      </div>
      <div className="flex-1 flex flex-col gap-3">
        <h3 className="text-xl font-semibold">{product.name}</h3>
        <p className="text-muted-foreground">{product.description}</p>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className="h-4 w-4 text-yellow-400 fill-yellow-400"
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">(4.8)</span>
        </div>
        <p className="text-2xl font-bold text-primary">
          ${product.price.toFixed(2)}
        </p>
      </div>
      <div className="flex flex-col gap-4 w-72">
        <div className="flex flex-col gap-2">
          <Button
            size="sm"
            onClick={() => onAddToCart(product)}
            className="gap-2 h-10"
          >
            <ShoppingCart className="h-4 w-4" />
            Add to Cart
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => console.log('Buy Now:', product)}
            className="gap-2 h-10"
          >
            Buy Now
          </Button>
        </div>
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Truck className="h-4 w-4" />
            <p>Free shipping</p>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            <p>In stock: 25+ items</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleAddToWishlist}
          className="gap-2 h-10"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${
              isWishlisted ? "text-red-500 fill-red-500" : "text-foreground"
            }`}
          />
          {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        </Button>
      </div>
    </div>
  );
}
