"use client";
import ProductDetail from "@/components/product/ProductDetail";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Product } from "@/types/product";
import { useAppSelector } from "@/lib/hooks";

export default function ProductDetailsPage() {
  const { slug: productId } = useParams();
  const { products } = useAppSelector((state) => state.products);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!productId) {
      setError("No Product Id or slug is present");
      setLoading(false);
      return;
    }

    const getProduct = async () => {
      try {
        setLoading(true);
        setError(null);

        // First try to find product in Redux store
        const detailProduct = products.find(
          (product) => product.id === productId
        );

        if (detailProduct) {
          setProduct(detailProduct);
          return;
        }

        // If not found in Redux, fetch from API
        const res = await fetch(`/api/products/${productId}`);
        const data = await res.json();

        if (!data || !data.id) {
          setError("Product not found");
          return;
        }

        setProduct(data);
      } catch (error) {
        console.error("Error fetching product details:", error);
        setError("Failed to fetch product details");
      } finally {
        setLoading(false);
      }
    };

    getProduct();
  }, [productId, products]);

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
      <div className="w-full min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-5 rounded-lg">
            Error: {error}
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="w-full min-h-screen p-8">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            Product not found
          </div>
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
