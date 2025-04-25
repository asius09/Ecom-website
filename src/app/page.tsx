import { ProductGrid } from "@/components/product/ProductGrid";
import { Footer } from "@/components/Footer";
import Image from "next/image";
import Link from "next/link";

const products = [
  {
    id: "1",
    name: "Wireless Headphones",
    description:
      "Noise-cancelling wireless headphones with 30-hour battery life",
    price: 199.99,
    imageUrl:
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.7,
    reviewCount: 235,
  },
  {
    id: "2",
    name: "Smart Watch",
    description: "Fitness tracking smart watch with heart rate monitoring",
    price: 149.99,
    imageUrl:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=2899&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.5,
    reviewCount: 189,
  },
  {
    id: "3",
    name: "Bluetooth Speaker",
    description: "Portable waterproof Bluetooth speaker with 20-hour playtime",
    price: 79.99,
    imageUrl:
      "https://images.unsplash.com/photo-1543512214-318c7553f230?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.3,
    reviewCount: 142,
  },
  {
    id: "4",
    name: "Gaming Keyboard",
    description: "Mechanical RGB gaming keyboard with customizable keys",
    price: 129.99,
    imageUrl:
      "https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?q=80&w=2864&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    rating: 4.8,
    reviewCount: 312,
  },
];

const categories = [
  {
    name: "Electronics",
    href: "/categories/electronics",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Clothing",
    href: "/categories/clothing",
    image:
      "https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Home & Kitchen",
    href: "/categories/home-kitchen",
    image:
      "https://images.unsplash.com/photo-1616486029423-aaa4789e8c9a?q=80&w=2832&auto=format&fit=crop&ixlib=rb-4.0.3极ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    name: "Sports & Outdoors",
    href: "/categories/sports-outdoors",
    image:
      "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=3072&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

export default function Home() {
  return (
    <main className="container mx-auto px-4">
      {/* Hero Banner */}
      <div className="relative h-[400px] w-full mb-12 overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=2940&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Hero Banner"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center text-center">
          <h1 className="text-5xl font-bold text-white mb-4">
            Discover Your Style
          </h1>
          <p className="text-xl text-white mb-8">
            Explore our latest collection of products
          </p>
          <Link
            href="/shop"
            className="bg-white text-black px-8 py-3 rounded-full font-semibold hover:bg-white/90 transition-colors"
          >
            Shop Now
          </Link>
        </div>
      </div>

      {/* Categories Section */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold mb-8">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.href}
              href={category.href}
              className="group relative aspect-square rounded-lg overflow-hidden"
            >
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <h3 className="text-2xl font-bold text-white">
                  {category.name}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Section */}
      <section>
        <h2 className="text-3xl font-bold mb-8">Featured Products</h2>
        <ProductGrid products={products} />
      </section>
      <Footer></Footer>
    </main>
  );
}
