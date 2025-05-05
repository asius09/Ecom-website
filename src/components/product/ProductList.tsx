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
import { ProductListVarients } from "@/constants/productList";
import Autoplay from "embla-carousel-autoplay";
import React from "react";

interface ProductGridProps {
  products: Product[];
  variant?: ProductListVarients;
}

export function ProductList({
  products,
  variant = ProductListVarients.GRID,
}: ProductGridProps) {
  const isMobile = useIsMobile();
  const isTablet = window.innerWidth >= 640 && window.innerWidth < 1024;
  const canSlide = products.length > 3;
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: false })
  );

  const renderGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-1 p-4">
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

  const renderSlider = () => (
    <div className="relative w-full overflow-visible p-4">
      <Carousel
        plugins={[plugin.current]}
        opts={{
          align: "center",
          dragFree: true,
          containScroll: "trimSnaps",
          slidesToScroll: "auto",
        }}
        className="w-full"
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className="ml-0 gap-0.5">
          {products.map((product) => (
            <CarouselItem
              key={product.id}
              className={`pl-0 ${
                isMobile
                  ? "basis-[100%] sm:basis-[80%]"
                  : "basis-1 md:basis-1/3 lg:basis-1/4"
              }`}
            >
              <div className="flex justify-center px-4">
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
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {canSlide && !isMobile && (
          <>
            <CarouselPrevious
              className={`flex absolute ${
                isTablet ? "left-[-15px]" : "left-[-20px]"
              } top-1/2 -translate-y-1/2`}
            />
            <CarouselNext
              className={`flex absolute ${
                isTablet ? "right-[-15px]" : "right-[-20px]"
              } top-1/2 -translate-y-1/2`}
            />
          </>
        )}
      </Carousel>
    </div>
  );

  const renderFeature = () => {
    const featuredProducts = products.slice(0, 8);
    const featurePlugin = React.useRef(
      Autoplay({ delay: 3000, stopOnInteraction: false })
    );

    return (
      <div className="p-4">
        <h2 className="text-center text-2xl font-bold mb-4">
          Featured Products
        </h2>
        <Carousel
          plugins={[featurePlugin.current]}
          opts={{
            align: "center",
            dragFree: true,
            containScroll: "trimSnaps",
            slidesToScroll: "auto",
          }}
          className="w-full"
          onMouseEnter={featurePlugin.current.stop}
          onMouseLeave={featurePlugin.current.reset}
        >
          <CarouselContent className="ml-0 gap-0.5">
            {featuredProducts.map((product) => (
              <CarouselItem
                key={product.id}
                className="pl-0 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
              >
                <div className="flex justify-center px-0.5">
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
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    );
  };

  switch (variant) {
    case ProductListVarients.SLIDER:
      return renderSlider();
    case ProductListVarients.FEATURE:
      return renderFeature();
    case ProductListVarients.GRID:
    default:
      return renderGrid();
  }
}
