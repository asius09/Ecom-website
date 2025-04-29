"use client";
import { ProductGrid } from "@/components/product/ProductGrid";
import { useParams } from "next/navigation";
import { Heart } from "lucide-react";


const wishlistProducts = [
  {
    id: "1",
    name: "Wireless Headphones",
    description:
      "Noise-cancelling wireless headphones with 30-hour battery life",
    price: 199.99,
    imageUrl:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.7,
    reviewCount: 235,
  },
  {
    id: "2",
    name: "Smart Watch",
    description: "Fitness tracking smart watch with heart rate monitoring",
    price: 149.99,
    imageUrl:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2899&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.5,
    reviewCount: 189,
  },
];

export default function WishlistPage() {
  const { slug } = useParams();


  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Wishlist</h1>
      {wishlistProducts.length > 0 ? (
        <ProductGrid products={wishlistProducts} />
      ) : (
        <div className="flex flex-col items-center justify-center py-16 space-y-6">
          <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center">
            <Heart className="w-12 h-12 text-muted-foreground" />
          </div>
          <h2 className="text-2xl font-semibold text-muted-foreground">
            Your wishlist is empty
          </h2>
          <p className="text-muted-foreground max-w-md text-center">
            Start exploring our products and click the{" "}
            <Heart className="inline w-4 h-4 text-primary" /> icon to add items
            to your wishlist.
          </p>
          <a
            href="/"
            className="mt-4 px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Browse Products
          </a>
        </div>
      )}
    </main>
  );
}
