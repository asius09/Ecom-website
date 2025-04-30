"use client";

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
      <main className="container mx-auto">
        {/* Hero section skeleton */}
        <div className="relative h-[200px] sm:h-[300px] md:h-[400px] w-full mb-6 sm:mb-8 md:mb-12 overflow-hidden">
          <Skeleton className="absolute inset-0 w-full h-full" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-2">
            <Skeleton className="h-8 sm:h-10 md:h-12 w-48 sm:w-72 md:w-96 mb-2 sm:mb-3 md:mb-4" />
            <Skeleton className="h-4 sm:h-5 md:h-6 w-40 sm:w-60 md:w-80 mb-4 sm:mb-6 md:mb-8" />
            <Skeleton className="h-8 sm:h-10 md:h-12 w-32 sm:w-40 md:w-48 rounded-full" />
          </div>
        </div>

        {/* Products grid skeleton */}
        <section>
          <Skeleton className="h-8 sm:h-10 w-40 sm:w-56 md:w-64 mb-4 sm:mb-6 md:mb-8" />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2 sm:space-y-3 md:space-y-4">
                <Skeleton className="h-40 sm:h-48 md:h-64 w-full" />
                <Skeleton className="h-4 sm:h-5 md:h-6 w-3/4" />
                <Skeleton className="h-4 sm:h-5 md:h-6 w-1/2" />
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
    <main className="container mx-auto">
      {/* Hero section with background image and call-to-action */}
      <div className="relative h-[200px] sm:h-[300px] md:h-[400px] w-full mb-6 sm:mb-8 md:mb-12 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Hero Banner"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center px-2">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2 sm:mb-3 md:mb-4">
            Discover Your Style
          </h1>
          <p className="text-sm sm:text-base md:text-lg lg:text-xl text-white mb-4 sm:mb-6 md:mb-8">
            Explore our latest collection of products
          </p>
          <Link
            href="/shop"
            className="bg-white text-black px-4 sm:px-6 md:px-8 py-2 sm:py-3 rounded-full font-semibold text-sm sm:text-base hover:bg-white/90 transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </div>

      {/* Featured products section */}
      <section className="pb-2 sm:pb-4">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 md:mb-8">
          Featured Products
        </h2>
        <ProductGrid products={products} variant={"slider"} />
      </section>
      <Footer />
    </main>
  );
}
