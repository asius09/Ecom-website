"use client";
import { SearchFilter } from "@/components/search/SearchFilter";
import { SearchList } from "@/components/search/SearchList";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Product } from "@/types/product";

// Example product data
const exampleProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Headphones",
    slug: "wireless-headphones",
    description: "Noise-cancelling wireless headphones",
    price: 199.99,
    currencyCode: "USD",
    featuredAsset: {
      preview:
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=3199&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  },
  {
    id: "2",
    name: "Smart Watch",
    slug: "smart-watch",
    description: "Fitness tracking smart watch",
    price: 149.99,
    currencyCode: "USD",
    featuredAsset: {
      preview:
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    },
  },
];

export default function CategoryPage() {
  const { category } = useParams();
  const [products, setProducts] = useState<Product[]>(exampleProducts);
  const [filters, setFilters] = useState({
    priceRange: [0, 1000] as [number, number],
  });

  useEffect(() => {
    // Simulate API call with example data
    const fetchProducts = async () => {
      if (!category) return;

      // Filter example products based on category
      const filteredProducts = exampleProducts.filter((product) =>
        product.name.toLowerCase().includes(category.toString().toLowerCase())
      );
      setProducts(filteredProducts);
    };

    fetchProducts();
  }, [category, filters]);

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
      <h1 className="text-3xl font-bold mb-8 capitalize">
        {category || "Category"} Products
      </h1>
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
