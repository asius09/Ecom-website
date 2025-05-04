import { Product } from "@/types/product";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

interface NewArrivalSectionProps {
  products: Product[];
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
                <Link href={`/product/${product.id}`} className="block group">
                  <div className="p-1">
                    <div className="bg-card rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col border border-border">
                      <div className="relative aspect-[3/2]">
                        <Image
                          src={product.image_url}
                          alt={product.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-black/10 to-transparent" />
                      </div>
                      <div className="p-3 flex-1 flex flex-col">
                        <h3 className="text-sm font-medium mb-1 truncate text-card-foreground">
                          {product.name}
                        </h3>
                        <div className="flex items-center gap-0.5 mb-1">
                          {Array.from({ length: 5 }).map((_, i) => (
                            <Star
                              key={i}
                              className={`w-3 h-3 ${
                                i < Math.floor(product.review)
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-muted-foreground"
                              }`}
                            />
                          ))}
                          <span className="text-xs text-muted-foreground ml-1">
                            ({product.review})
                          </span>
                        </div>
                        <p className="text-muted-foreground text-xs line-clamp-2 mb-2 flex-1">
                          {product.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-base font-bold text-primary">
                            ${product.price.toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );
}
