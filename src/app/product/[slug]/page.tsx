"use client";
import ProductDetail from "@/components/product/ProductDetail";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  rating: number;
  reviewCount: number;
  stock: number;
  sku: string;
  brand: string;
  category: string;
}

const exampleProduct: Product = {
  id: "prod_123",
  name: "Premium Leather Office Chair",
  description:
    "Ergonomic executive chair with premium leather upholstery and adjustable features for maximum comfort.",
  price: 299.99,
  imageUrl:
    "https://images.unsplash.com/photo-1519947486511-46149fa0a254?q=80&w=2787&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  rating: 4.7,
  reviewCount: 342,
  stock: 25,
  sku: "CHAIR-LEATHER-001",
  brand: "OfficePro",
  category: "Furniture",
};

export default function ProductDetailsPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(exampleProduct);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`/api/products/${slug}`);
        if (!response.ok) {
          throw new Error("Product not found");
        }
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch product"
        );
      } finally {
        setLoading(false);
      }
    };

    // Uncomment to enable actual API fetching
    // fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="w-full min-h-screen p-8">
        <div className="max-w-7xl mx-auto animate-pulse space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="bg-gray-100 rounded-xl aspect-square" />
            <div className="space-y-8">
              <div className="h-10 bg-gray-100 rounded-xl w-3/4" />
              <div className="h-6 bg-gray-100 rounded-xl w-1/2" />
              <div className="h-4 bg-gray-100 rounded-xl w-full" />
              <div className="h-4 bg-gray-100 rounded-xl w-2/3" />
              <div className="h-14 bg-gray-100 rounded-xl w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center p-8">
        <div className="max-w-7xl mx-auto bg-red-50 border border-red-200 text-red-700 px-6 py-5 rounded-lg">
          Error: {error}
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="w-full min-h-screen flex items-center justify-center p-8">
        <div className="max-w-7xl mx-auto bg-yellow-50 border border-yellow-200 text-yellow-700 px-6 py-5 rounded-lg">
          Product not found
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        <ProductDetail product={product} />
      </div>
    </div>
  );
}
