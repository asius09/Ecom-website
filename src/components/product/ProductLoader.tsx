"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/lib/hooks";
import { setProducts } from "@/lib/store/slices/productSlice";
import { fetchAllProducts } from "@/app/api/products/users/action";

export function ProductsLoader() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        console.debug("Fetching products...");
        const data = await fetchAllProducts();
        console.debug("Products fetched successfully:", data);

        dispatch(setProducts(data));
        console.debug("Products dispatched to store");
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        console.error("Failed to fetch products:", errorMessage);
        throw new Error(`Failed to fetch Products: ${errorMessage}`);
      }
    };

    fetchProducts();
  }, [dispatch]);

  return null;
}
