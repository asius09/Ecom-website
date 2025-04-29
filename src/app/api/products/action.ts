import { supabase } from "@/utils/supabase/client";
import { Product } from "@/types/product";

export const addToCart = async (
  productId: string,
  userId: string,
  quantity: number = 1
) => {
  try {
    // Check if product already exists in cart
    const { data: existingItem, error: fetchError } = await supabase
      .from("cart")
      .select("*")
      .eq("product_id", productId)
      .eq("user_id", userId)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      // Ignore "not found" error
      throw fetchError;
    }

    if (existingItem) {
      // Update quantity if product already in cart
      const { error } = await supabase
        .from("cart")
        .update({ quantity: existingItem.quantity + quantity })
        .eq("id", existingItem.id);

      if (error) throw error;
      return true;
    }

    // Add new item to cart
    const { error } = await supabase.from("cart").insert([
      {
        product_id: productId,
        user_id: userId,
        quantity,
      },
    ]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};

export const addToWishlist = async (productId: string, userId: string) => {
  try {
    // Check if product already exists in wishlist
    const { data: existingItem, error: fetchError } = await supabase
      .from("wishlist")
      .select("*")
      .eq("product_id", productId)
      .eq("user_id", userId)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      // Ignore "not found" error
      throw fetchError;
    }

    if (existingItem) {
      // Product already in wishlist
      return true;
    }

    // Add new item to wishlist
    const { error } = await supabase.from("wishlist").insert([
      {
        product_id: productId,
        user_id: userId,
      },
    ]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error adding to wishlist:", error);
    throw error;
  }
};
