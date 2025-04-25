import { ProductCard } from "./ProductCard";

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
}

export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 py-4">
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
