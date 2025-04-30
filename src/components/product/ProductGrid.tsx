"use client";
import { ProductCard } from "./ProductCard";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Product } from "@/types/product";

interface ProductGridProps {
  products: Product[];
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
                id={product.id}
                name={product.name}
                description={product.description}
                price={product.price}
                image_url={product.image_url}
                review={product.review}
                stock_quantity={product.stock_quantity}
                createdAt={product.createdAt}
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
          id={product.id}
          name={product.name}
          description={product.description}
          price={product.price}
          image_url={product.image_url}
          review={product.review}
          stock_quantity={product.stock_quantity}
          createdAt={product.createdAt}
        />
      ))}
    </div>
  );
}
