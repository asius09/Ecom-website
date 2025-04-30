"use client";
// Import necessary components and utilities
import { ProductGrid } from "@/components/product/ProductGrid";
import { Footer } from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { Product } from "@/types/product";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  // State management for products and loading status
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch products from Supabase on component mount
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase.from("products").select("*");
        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Loading state UI with skeleton components
  if (loading) {
    return (
      <main className="container mx-auto px-4">
        {/* Hero section skeleton */}
        <div className="relative h-[400px] w-full mb-12 overflow-hidden">
          <Skeleton className="absolute inset-0 w-full h-full" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <Skeleton className="h-12 w-96 mb-4" />
            <Skeleton className="h-6 w-80 mb-8" />
            <Skeleton className="h-12 w-48 rounded-full" />
          </div>
        </div>

        {/* Products grid skeleton */}
        <section>
          <Skeleton className="h-10 w-64 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-6 w-1/2" />
              </div>
            ))}
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  // Main UI with actual content
  return (
    <main className="container mx-auto px-4">
      {/* Hero section with background image and call-to-action */}
      <div className="relative h-[400px] w-full mb-12 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Hero Banner"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center">
          <h1 className="text-5xl font-bold text-white mb-4">
            Discover Your Style
          </h1>
          <p className="text-xl text-white mb-8">
            Explore our latest collection of products
          </p>
          <Link
            href="/shop"
            className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-white/90 transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </div>

      {/* Featured products section */}
      <section className="pb-4">
        <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
        <ProductGrid products={products} variant={"slider"} />
      </section>
      <Footer />
    </main>
  );
}
