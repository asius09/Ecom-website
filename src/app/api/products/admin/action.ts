import { supabase } from "@/utils/supabase/client";
import { Product } from "@/types/product";

export const createProduct = async (
  product: Omit<Product, "id" | "createdAt" | "updatedAt">
) => {
  try {
    // Validate required fields
    if (
      !product.name ||
      !product.description ||
      !product.price ||
      !product.stock_quantity
    ) {
      throw new Error("Missing required product fields");
    }

    try {
      // Insert product into database
      const { data, error } = await supabase
        .from("products")
        .insert([product])
        .select()
        .single();

      // Handle errors
      if (error) {
        throw new Error(`Database error: ${error.message}`);
      }

      if (!data) {
        throw new Error("Product creation failed - no data returned");
      }

      // Return created product
      return {
        ...data,
        id: data.id,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      } as Product;
    } catch (error) {
      console.error(
        "Database operation failed:",
        error instanceof Error ? error.message : "Unknown error"
      );
      throw error;
    }
  } catch (error) {
    console.error(
      "Product creation failed:",
      error instanceof Error ? error.message : "Unknown error"
    );
    throw error; // Re-throw for error handling in calling code
  }
};
