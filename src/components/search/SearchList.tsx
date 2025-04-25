"use client";

import { SearchItem } from "./SearchItem";
import { Product } from "@/types/product";

interface SearchListProps {
  products: Product[];
  onAddToCart: (product: Product) => void;
  onAddToWishlist: (product: Product) => void;
}

export function SearchList({
  products,
  onAddToCart,
  onAddToWishlist,
}: SearchListProps) {
  return (
    <div className="space-y-4 w-full">
      {products.map((product) => (
        <div key={product.id} className="w-full">
          <SearchItem
            product={product}
            onAddToCart={onAddToCart}
            onAddToWishlist={onAddToWishlist}
          />
        </div>
      ))}
    </div>
  );
}
