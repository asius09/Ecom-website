"use client";
import { AppDispatch } from "@/lib/store/store";
import {
  addProduct,
  removeProduct,
  setProducts,
} from "@/lib/store/features/productSlice";
import { Product } from "@/types/product";
import { removeImageFromStorage } from "../supabase/uploadImage";
import { toast } from "sonner";

export const createProduct = async ({
  product,
  dispatch,
}: {
  product: Omit<Product, "created_at" | "updated_at" | "id">;
  dispatch: AppDispatch;
}) => {
  const tempProduct: Product = {
    id: Date.now().toString(), // Temporary ID
    name: product.name,
    description: product.description,
    price: product.price,
    stock_quantity: product.stock_quantity,
    image_url: product.image_url,
    review: 0, // Default review
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  dispatch(addProduct(tempProduct));
  try {
    const response = await fetch("/api/admin/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });

    const data = await response.json();
    if (data.statusText !== "success") {
      toast.error("Failed to create product", {
        description: data.message || "Something went Wrong",
      });
      dispatch(removeProduct(tempProduct.id));
      throw new Error(data.message || "Failed to create product");
    }

    // Fetch updated products and dispatch to store
    const productsResponse = await fetch("/api/admin/products");
    const productsData = await productsResponse.json();
    if (productsData.statusText === "success") {
      dispatch(setProducts(productsData.data));
    }

    toast.success("Product created successfully!");
    return data;
  } catch (error) {
    console.error("Error creating product:", error);
    toast.error("Failed to create product", {
      description: error instanceof Error ? error.message : "An error occurred",
    });
    throw error;
  }
};

export const updateProduct = async (
  productId: string,
  product: Omit<Product, "id" | "updated_at">,
  dispatch: AppDispatch
) => {
  try {
    const response = await fetch(`/api/admin/products/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(product),
    });

    const data = await response.json();
    if (data.statusText !== "success") {
      toast.error("Failed to update product", {
        description: data.message || "Please try again later",
      });
      throw new Error(data.message || "Failed to update product");
    }

    // Fetch updated products and dispatch to store
    const productsResponse = await fetch("/api/admin/products");
    const productsData = await productsResponse.json();
    if (productsData.statusText === "success") {
      dispatch(setProducts(productsData.data));
    } else {
      toast.error("Failed to refresh products");
    }

    toast.success("Product updated successfully!");
    return data;
  } catch (error) {
    console.error("Error updating product:", error);
    toast.error("Failed to update product", {
      description: error instanceof Error ? error.message : "An error occurred",
    });
    throw error;
  }
};

export const deleteProduct = async (
  product: Product,
  dispatch: AppDispatch
) => {
  try {
    // Optimistically remove product from Redux store
    dispatch(removeProduct(product.id));

    const response = await fetch(`/api/admin/products`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ product_id: product.id }),
    });

    const data = await response.json();

    // If deletion fails, add product back to Redux store
    if (data.statusText !== "success") {
      toast.error("Failed to delete product", {
        description: data.message || "Please try again later",
      });
      throw new Error(data.message || "Failed to delete product");
    }

    // Only remove image if product deletion was successful
    await removeImageFromStorage(product.image_url);

    // Fetch updated products list
    const productsResponse = await fetch("/api/admin/products");
    const productsData = await productsResponse.json();

    // Update Redux store with fresh product list
    if (productsData.statusText === "success") {
      dispatch(setProducts(productsData.data));
    } else {
      toast.error("Failed to refresh products");
    }

    toast.success("Product deleted successfully!");
    return data;
  } catch (error) {
    // If any error occurs, add product back to Redux store
    dispatch(addProduct(product));
    console.error("Error deleting product:", error);
    toast.error("Failed to delete product", {
      description: error instanceof Error ? error.message : "An error occurred",
    });
    throw error;
  }
};

export const getProducts = async (dispatch: AppDispatch) => {
  try {
    const response = await fetch("/api/admin/products");
    const data = await response.json();

    if (data.statusText !== "success") {
      toast.error("Failed to fetch products", {
        description: data.message || "Please try again later",
      });
      throw new Error(data.message || "Failed to fetch products");
    }

    // Dispatch products to store
    dispatch(setProducts(data.data));
    return data.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    toast.error("Failed to fetch products", {
      description: error instanceof Error ? error.message : "An error occurred",
    });
    throw error;
  }
};
