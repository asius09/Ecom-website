"use client";

import { ProductList } from "@/components/product/ProductList";
import { Footer } from "@/components/Footer";
import { useState } from "react";
import { Product } from "@/types/product";
import { Skeleton } from "@/components/ui/skeleton";
import { HomeBanner } from "@/components/home/HomeBanner";
import { CategoriesCollage } from "@/components/home/CategoriesCollage";
import { CategoryVariant } from "@/constants/category";
import { CategoryItem } from "@/types/category";
import { ProductListVarients } from "@/constants/productList";
import { NewArrivalSection } from "@/components/home/NewArrivalSection";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const categories: CategoryItem[] = [
  {
    src: "https://images.unsplash.com/photo-1523275335684-37898b极6baf30?q=80&w=2899&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Electronics",
    name: "Electronics",
    link: "/category/electronics",
  },
  {
    src: "https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Clothing",
    name: "Clothing",
    link: "/category/clothing",
  },
  {
    src: "https://images.unsplash.com/photo-1607083206968-13611e3d76db?q=80&w=2915&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Home & Kitchen",
    name: "Home & Kitchen",
    link: "/category/home-kitchen",
  },
  {
    src: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=2940&auto=format&fit=crop&ixlib=rb-极4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8f极A%3D%3D",
    alt: "Beauty",
    name: "Beauty",
    link: "/category/beauty",
  },
  {
    src: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3极fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Sports",
    name: "Sports",
    link: "/category/sports",
  },
];

const demoProducts: Product[] = [
  {
    id: "1",
    name: "Wireless Bluetooth Earbuds",
    description: "High-quality sound with noise cancellation",
    price: 99.99,
    image_url: "https://images.unsplash.com/photo-1590658006821-04f4008d5717",
    review: 4.5,
    stock_quantity: 100,
    createdAt: "2023-01-01",
  },
  {
    id: "2",
    name: "Smart Watch Pro",
    description: "Fitness tracking and heart rate monitoring",
    price: 199.99,
    image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
    review: 4.7,
    stock_quantity: 50,
    createdAt: "2023-02-15",
  },
  {
    id: "3",
    name: "Leather Jacket",
    description: "Premium quality genuine leather jacket",
    price: 299.99,
    image_url: "https://images.unsplash.com/photo-1543076447-215ad9ba6923",
    review: 4.8,
    stock_quantity: 25,
    createdAt: "2023-03-10",
  },
  {
    id: "4",
    name: "Blender Pro 2000",
    description: "High-power kitchen blender with multiple settings",
    price: 149.99,
    image_url: "https://images.unsplash.com/photo-1585238342024-78d90f141f0d",
    review: 4.6,
    stock_quantity: 75,
    createdAt: "2023-04-05",
  },
  {
    id: "5",
    name: "Anti-Aging Cream",
    description: "Advanced formula for youthful skin",
    price: 79.99,
    image_url: "https://images.unsplash.com/photo-1591348278997-2d9b8e6c9c8f",
    review: 4.4,
    stock_quantity: 200,
    createdAt: "2023-05-20",
  },
];

export default function Home() {
  const [products, setProducts] = useState<Product[]>(demoProducts);
  const [loading, setLoading] = useState(false);

  const bannerImages = [
    {
      src: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Fashion Collection",
      link: "/shop",
    },
    {
      src: "https://images.unsplash.com/photo-1523381294911-8d3cead13475?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      alt: "Summer Sale",
      link: "/sale",
    },
  ];

  if (loading) {
    return (
      <main className="w-full">
        <div className="h-[400px] w-full relative">
          <Skeleton className="h-full w-full" />
        </div>

        <section className="px-2 sm:px-4 md:px-6 pb-2 sm:pb-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="aspect-square">
                <Skeleton className="h-full w-full" />
              </div>
            ))}
          </div>

          <div className="mb-8">
            <Skeleton className="h-8 w-48 mx-auto mb-4" />
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i}>
                  <Skeleton className="aspect-square mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-1" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          </div>

          <div className="mb-8">
            <Skeleton className="h-8 w-48 mx-auto mb-4" />
            <div className="flex gap-4 overflow-hidden">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="min-w-[200px]">
                  <Skeleton className="aspect-square mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-1" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="flex justify-center py-8">
          <Skeleton className="h-12 w-48" />
        </div>

        <Footer />
      </main>
    );
  }

  return (
    <main className="w-full">
      <HomeBanner images={bannerImages} />
      <section className="px-2 sm:px-4 md:px-6 pb-2 sm:pb-4">
        <CategoriesCollage
          categories={categories}
          variant={CategoryVariant.GRID}
        />
        <NewArrivalSection products={products} />
        <ProductList products={products} variant={ProductListVarients.SLIDER} />
      </section>
      <div className="flex justify-center py-8">
        <Link href="/shop">
          <Button className="px-8 py-6 text-lg font-semibold">
            Explore More Products
          </Button>
        </Link>
      </div>
      <Footer />
    </main>
  );
}
