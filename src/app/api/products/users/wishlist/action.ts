import { supabase } from "@/utils/supabase/client";

export const fetchWishlistProducts = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("wishlist_items")
      .select("*")
      .eq("user_id", userId);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching wishlist products:", error);
    throw error;
  }
};

export const toggleWishlist = async (productId: string, userId: string) => {
  try {
    const { data: existingItem, error: fetchError } = await supabase
      .from("wishlist_items")
      .select("*")
      .eq("product_id", productId)
      .eq("user_id", userId)
      .single();

    if (fetchError && fetchError.code !== "PGRST116") {
      throw fetchError;
    }

    if (existingItem) {
      const { error } = await supabase
        .from("wishlist_items")
        .delete()
        .eq("id", existingItem.id);
      if (error) throw error;
      return false;
    }

    const { error } = await supabase.from("wishlist_items").insert([
      {
        product_id: productId,
        user_id: userId,
      },
    ]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error toggling wishlist item:", error);
    throw error;
  }
};
