"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/lib/hooks";
import { setProducts } from "@/lib/store/features/productSlice";

export function ProductsLoader() {
  const dispatch = useAppDispatch();

  const fetchProducts = async () => {
    try {
      console.debug("Fetching products...");
      const response = await fetch("/api/products?search=new", {
        method: "GET",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.statusText === "success") {
        console.debug("Products fetched successfully:", result.data);
        dispatch(setProducts(result.data));
        console.debug("Products dispatched to store");
      } else {
        throw new Error(result.error || "Failed to fetch products");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      console.error("Failed to fetch products:", errorMessage);
      // Instead of throwing error, consider dispatching an error state
      dispatch(setProducts([])); // Clear products on error
    }
  };
  useEffect(() => {
    // Add a cleanup function to prevent memory leaks
    let isMounted = true;
    if (isMounted) {
      fetchProducts();
    }

    return () => {
      isMounted = false;
    };
  }, [dispatch]);

  return null;
}
