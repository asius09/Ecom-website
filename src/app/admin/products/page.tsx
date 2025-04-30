"use client";

import { useEffect, useState } from "react";
import ProductManagement from "@/components/admin/ProductManagement";
import { getAllProducts } from "@/app/api/products/users/action";
import { Product } from "@/types/product";
import { validAdmin } from "@/app/api/auth/action";

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getProducts = async () => {
      try {
        const isAdmin = await validAdmin();
        const data = await getAllProducts();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    getProducts();
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <ProductManagement products={products} loading={loading} />
    </div>
  );
}
