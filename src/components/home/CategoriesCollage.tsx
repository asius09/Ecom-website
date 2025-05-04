import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { CategoryVariant } from "@/constants/category";
import { CategoryItem } from "@/types/category";

interface CategoriesCollageProps {
  categories: CategoryItem[];
  variant?: CategoryVariant;
}

export const CategoriesCollage: React.FC<CategoriesCollageProps> = ({
  categories,
  variant = CategoryVariant.GRID,
}) => {
  if (!categories || categories.length === 0) return null;

  const renderGrid = () => (
    <div className="w-full grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 p-4">
      {categories.map((category, index) => (
        <Link href={category.link} key={index} passHref>
          <div className="relative w-full aspect-square rounded-xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 cursor-pointer group">
            <Image
              src={category.src}
              alt={category.alt}
              fill
              className="object-cover transform group-hover:scale-110 transition-transform duration-300"
              sizes="(max-width: 768px) 50vw, 25vw"
              quality={100}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
            <h3 className="absolute bottom-4 left-4 text-white text-xl font-bold drop-shadow-lg">
              {category.name}
            </h3>
          </div>
        </Link>
      ))}
    </div>
  );

  const renderCarousel = () => (
    <div className="w-full flex overflow-x-auto snap-x snap-mandatory gap-4 p-4 scrollbar-hide">
      {categories.map((category, index) => (
        <Link href={category.link} key={index} passHref>
          <div className="relative w-[80vw] sm:w-[60vw] md:w-[40vw] lg:w-[30vw] aspect-[16/9] rounded-xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 cursor-pointer group snap-center">
            <Image
              src={category.src}
              alt={category.alt}
              fill
              className="object-cover transform group-hover:scale-110 transition-transform duration-300"
              sizes="(max-width: 768px) 80vw, 60vw"
              quality={100}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
            <h3 className="absolute bottom-4 left-4 text-white text-xl font-bold drop-shadow-lg">
              {category.name}
            </h3>
          </div>
        </Link>
      ))}
    </div>
  );

  const renderMasonry = () => (
    <div className="w-full columns-2 sm:columns-3 lg:columns-4 gap-4 p-4">
      {categories.map((category, index) => (
        <Link href={category.link} key={index} passHref>
          <div className="relative w-full mb-4 rounded-xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 cursor-pointer group break-inside-avoid">
            <div className="aspect-[3/4]">
              <Image
                src={category.src}
                alt={category.alt}
                fill
                className="object-cover transform group-hover:scale-110 transition-transform duration-300"
                sizes="(max-width: 768px) 50vw, 33vw"
                quality={100}
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
            <h3 className="absolute bottom-4 left-4 text-white text-xl font-bold drop-shadow-lg">
              {category.name}
            </h3>
          </div>
        </Link>
      ))}
    </div>
  );

  return (
    <section className="w-full my-8">
      {variant === CategoryVariant.GRID && renderGrid()}
      {variant === CategoryVariant.CAROUSEL && renderCarousel()}
      {variant === CategoryVariant.MASONRY && renderMasonry()}
    </section>
  );
};

export default CategoriesCollage;
