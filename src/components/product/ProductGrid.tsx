import { ProductCard } from "./ProductCard";

interface ProductGridProps {
  products: {
    name: string;
    description: string;
    price: number;
    imageUrl?: string;
  }[];
}

export const sampleProducts = [
  {
    name: "Classic Leather Jacket",
    description: "Premium quality leather jacket with a timeless design",
    price: 199.99,
    imageUrl: "/images/jacket.jpg"
  },
  {
    name: "Wireless Noise-Cancelling Headphones",
    description: "High-fidelity sound with 30-hour battery life",
    price: 149.99,
    imageUrl: "/images/headphones.jpg"
  },
  {
    name: "Stainless Steel Water Bottle",
    description: "Eco-friendly, insulated, 1L capacity",
    price: 24.99,
    imageUrl: "/images/bottle.jpg"
  },
  {
    name: "Smart Watch Pro",
    description: "Fitness tracking and heart rate monitoring",
    price: 129.99,
    imageUrl: "/images/watch.jpg"
  },
  {
    name: "Organic Cotton T-Shirt",
    description: "Soft, breathable, and sustainable",
    price: 29.99,
    imageUrl: "/images/tshirt.jpg"
  },
  {
    name: "Wireless Charging Pad",
    description: "Fast charging for all Qi-enabled devices",
    price: 39.99,
    imageUrl: "/images/charger.jpg"
  }
];


export function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
      {products.map((product, index) => (
        <ProductCard
          key={index}
          name={product.name}
          description={product.description}
          price={product.price}
          imageUrl={product.imageUrl}
        />
      ))}
    </div>
  );
}
