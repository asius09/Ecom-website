"use client";
import { SearchFilter } from "@/components/search/SearchFilter";
import { SearchList } from "@/components/search/SearchList";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Product } from "@/types/product";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const searchInput = searchParams.get("q") || "";
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState({
    priceRange: [0, 1000] as [number, number],
  });

  useEffect(() => {
    const fetchProducts = async () => {
      // TODO: Implement actual API call to fetch products
      const response = await fetch(`/api/search?q=${searchInput}`);
      const data = await response.json();
      setProducts(data.products);
    };

    fetchProducts();
  }, [searchInput, filters]);

  const handleFilterChange = (newFilters: { priceRange: [number, number] }) => {
    setFilters(newFilters);
  };

  const handleAddToCart = (product: Product) => {
    console.log("Added to cart:", product);
  };

  const handleAddToWishlist = (product: Product) => {
    console.log("Added to wishlist:", product);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-8">
        <aside>
          <SearchFilter onFilterChange={handleFilterChange} />
        </aside>
        <main>
          <SearchList
            products={products}
            onAddToCart={handleAddToCart}
            onAddToWishlist={handleAddToWishlist}
          />
        </main>
      </div>
    </div>
  );
}
