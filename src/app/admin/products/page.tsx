"use client";

import { ProductManagement } from "@/components/admin/ProductManagement";
import { useAppSelector } from "@/lib/hooks";

export default function ProductPage() {
  const { products } = useAppSelector((state) => state.products);
  return (
    <div className="min-h-screen bg-background">
      <ProductManagement products={products} />
    </div>
  );
}
