import { Product } from "@/types/product";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import React from "react";
import { ProductCard } from "@/components/product/ProductCard";

interface NewArrivalSectionProps {
  products: Product[] | null;
}

export function NewArrivalSection({ products }: NewArrivalSectionProps) {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  );

  if (!products || products.length === 0) return null;

  return (
    <section className="w-full max-w-7xl mx-auto px-4 py-8 bg-background">
      <h2 className="text-2xl font-bold text-center mb-8 text-foreground">
        New Arrivals
      </h2>
      <div className="w-full overflow-hidden">
        <Carousel
          plugins={[plugin.current]}
          opts={{
            align: "start",
            dragFree: true,
            containScroll: "trimSnaps",
            slidesToScroll: 3,
            loop: true,
          }}
          className="w-full"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent className="ml-0 gap-2">
            {products.map((product) => (
              <CarouselItem
                key={product.id}
                className="pl-0 basis-full sm:basis-1/2 md:basis-1/3"
              >
                <ProductCard
                  id={product.id}
                  name={product.name}
                  description={product.description}
                  price={product.price}
                  image_url={product.image_url}
                  review={product.review}
                  stock_quantity={product.stock_quantity}
                  created_at={product.created_at}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
