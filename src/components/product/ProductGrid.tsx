"use client";
import { ProductCard } from "./ProductCard";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Product } from "@/types/product";

interface ProductGridProps {
  products: Product[];
  variant?: "grid" | "slider";
}

export function ProductGrid({ products, variant = "grid" }: ProductGridProps) {
  const isMobile = useIsMobile();
  const canSlide = products.length > 3; // Show arrows only if more than 3 products

  if (variant === "slider") {
    return (
      <div className="relative w-full overflow-visible">
        <Carousel
          opts={{
            align: "start", // Ensure alignment is flex-start
            dragFree: true, // Enable smooth finger sliding
            containScroll: "trimSnaps",
            slidesToScroll: "auto",
          }}
          className="w-full"
        >
          <CarouselContent className="ml-0 gap-3">
            {" "}
            {/* Added gap-3 */}
            {products.map((product) => (
              <CarouselItem
                key={product.id}
                className={`pl-0 ${
                  isMobile
                    ? "basis-[90%]" // 90% width on mobile
                    : "basis-1/2 md:basis-1/3 lg:basis-1/4"
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
          {canSlide && (
            <>
              <CarouselPrevious className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2" />
              <CarouselNext className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2" />
            </>
          )}
        </Carousel>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
      {" "}
      {/* Changed to gap-3 */}
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
