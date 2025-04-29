"use client";
import { ProductCard } from "./ProductCard";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

interface ProductGridProps {
  products: {
    id: string;
    name: string;
    description: string;
    price: number;
    imageUrl?: string;
    rating?: number;
    reviewCount?: number;
  }[];
  variant?: "grid" | "slider";
}

export function ProductGrid({ products, variant = "grid" }: ProductGridProps) {
  const isMobile = useIsMobile();

  if (variant === "slider") {
    return (
      <Carousel
        opts={{
          align: "start",
          dragFree: true,
          containScroll: "trimSnaps",
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {products.map((product) => (
            <CarouselItem
              key={product.id}
              className={`pl-4 ${
                isMobile ? "basis-[80%]" : "basis-1/2 md:basis-1/3 lg:basis-1/4"
              }`}
            >
              <ProductCard
                name={product.name}
                description={product.description}
                price={product.price}
                imageUrl={product.imageUrl}
                rating={product.rating}
                reviewCount={product.reviewCount}
              />
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          name={product.name}
          description={product.description}
          price={product.price}
          imageUrl={product.imageUrl}
          rating={product.rating}
          reviewCount={product.reviewCount}
        />
      ))}
    </div>
  );
}
