import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import Autoplay from "embla-carousel-autoplay";
import { BannerImage } from "@/types/BannerImages";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface BannerProps {
  images: BannerImage[];
}

export const HomeBanner: React.FC<BannerProps> = ({ images }) => {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  );

  if (!images || images.length === 0) return null;

  return (
    <div className="w-full h-[300px] md:h-[400px] lg:h-[500px] relative">
      <Carousel
        plugins={[plugin.current]}
        opts={{ loop: true }}
        className="w-full h-full"
      >
        <CarouselContent>
          {images.slice(0, 5).map((image, index) => (
            <CarouselItem key={index}>
              <Link href={image.link} passHref>
                <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] cursor-pointer">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    style={{ objectFit: "cover" }}
                    priority={index === 0}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute bottom-8 left-8 text-white">
                    <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold drop-shadow-lg">
                      {image.alt}
                    </h2>
                  </div>
                </div>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        {images.length > 1 && (
          <>
            <CarouselPrevious className="left-4" />
            <CarouselNext className="right-4" />
          </>
        )}
      </Carousel>
    </div>
  );
};

export default HomeBanner;
