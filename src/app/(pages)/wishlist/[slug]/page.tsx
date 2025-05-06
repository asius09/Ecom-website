"use client";
import { ProductList } from "@/components/product/ProductList";
import { useParams } from "next/navigation";
import { Heart } from "lucide-react";
import { useAppSelector } from "@/lib/hooks";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductListVarients } from "@/constants/productList";

export default function WishlistPage() {
  const { slug: userId } = useParams();
  const { items: wishlistItems } = useAppSelector((state) => state.wishlist);
  const { products } = useAppSelector((state) => state.products);
  // Ensure userId is a string
  const userIdString = Array.isArray(userId) ? userId[0] : userId;

  // Filter products that are in the wishlist
  const wishlistProducts = products.filter((product) =>
    wishlistItems.some((items) => items.product_id === product.id)
  );

  if (!userIdString) {
    return (
      <main className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Wishlist</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="bg-card rounded-lg shadow-sm overflow-hidden"
            >
              <Skeleton className="h-48 w-full" />
              <div className="p-3 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Wishlist</h1>
      {wishlistProducts.length > 0 ? (
        <ProductList
          products={wishlistProducts}
          variant={ProductListVarients.GRID}
        />
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
