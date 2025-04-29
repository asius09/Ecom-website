"use client";

import { Button } from "@/components/ui/button";
import {
  Heart,
  ShoppingCart,
  Star,
  Truck,
  CheckCircle,
  Info,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { QuantitySelector } from "@/components/cart/QuantitySelector";
import { Badge } from "@/components/ui/badge";

interface ProductDetailProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl: string;
    rating: number;
    reviewCount: number;
    stock: number;
    sku: string;
    brand: string;
    category: string;
  };
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [quantity, setQuantity] = useState<number>(1);

  const handleAddToWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div className="w-full px-2 sm:px-4 py-4 sm:py-8">
      <div className="flex flex-col lg:flex-row gap-4 sm:gap-8 max-w-7xl mx-auto">
        {/* Product Image */}
        <div className="w-full lg:w-1/2">
          <div className="relative aspect-[4/3] rounded-lg sm:rounded-xl overflow-hidden shadow-md sm:shadow-lg group">
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
            <Badge
              variant="secondary"
              className="absolute top-2 left-2 sm:top-4 sm:left-4 text-xs sm:text-sm"
            >
              {product.category}
            </Badge>
            <button
              onClick={handleAddToWishlist}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 p-1.5 sm:p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
            >
              <Heart
                className={`h-4 w-4 sm:h-5 sm:w-5 ${
                  isWishlisted ? "text-red-500 fill-red-500" : ""
                }`}
              />
            </button>
          </div>
        </div>

        {/* Product Details */}
        <div className="w-full lg:w-1/2 space-y-4 sm:space-y-6">
          <div className="space-y-2 sm:space-y-3">
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight">
              {product.name}
            </h1>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 sm:h-5 sm:w-5 ${
                      i < Math.floor(product.rating)
                        ? "text-yellow-400 fill-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs sm:text-sm text-muted-foreground">
                ({product.reviewCount} reviews)
              </span>
            </div>
          </div>

          <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary">
            ${product.price.toFixed(2)}
          </div>

          <div className="flex flex-col gap-3 sm:gap-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full items-center">
              <QuantitySelector
                initialQuantity={quantity}
                onQuantityChange={setQuantity}
                max={Number(product.stock)}
              />
              <Button
                className="w-full sm:flex-1 h-9 sm:h-10"
                disabled={product.stock === 0}
              >
                <ShoppingCart className="mr-2 h-3.5 w-3.5 sm:h-4 sm:w-4" />
                Add to Cart
              </Button>
              <Button
                className="w-full sm:flex-1 h-9 sm:h-10"
                variant="secondary"
              >
                Buy Now
              </Button>
            </div>
          </div>

          <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm bg-muted/50 p-3 sm:p-4 rounded-md sm:rounded-lg">
            <div className="flex items-center gap-2 sm:gap-3">
              <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-500" />
              <span>
                {product.stock > 0
                  ? `In Stock (${product.stock} available)`
                  : "Out of Stock"}
              </span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Truck className="h-4 w-4 sm:h-5 sm:w-5 text-blue-500" />
              <span>Free shipping on orders over $50</span>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <Info className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
              <span>30-day return policy</span>
            </div>
          </div>
        </div>
      </div>

      {/* Product Description and Details */}
      <div className="mt-6 sm:mt-12 space-y-6 sm:space-y-8 max-w-7xl mx-auto">
        <div className="space-y-3 sm:space-y-4">
          <h3 className="text-lg sm:text-xl font-semibold">
            Product Description
          </h3>
          <p className="text-muted-foreground leading-relaxed text-sm sm:text-base">
            {product.description}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 text-xs sm:text-sm bg-muted/50 p-4 sm:p-6 rounded-md sm:rounded-lg">
          <div className="space-y-1 sm:space-y-2">
            <span className="text-muted-foreground">SKU</span>
            <span className="font-medium">{product.sku}</span>
          </div>
          <div className="space-y-1 sm:space-y-2">
            <span className="text-muted-foreground">Brand</span>
            <span className="font-medium">{product.brand}</span>
          </div>
          <div className="space-y-1 sm:space-y-2">
            <span className="text-muted-foreground">Category</span>
            <span className="font-medium">{product.category}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
