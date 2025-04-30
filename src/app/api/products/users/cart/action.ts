import { supabase } from "@/utils/supabase/client";

export const fetchCartProducts = async (userId: string) => {
  try {
    const { data, error } = await supabase
      .from("cart_items")
      .select("*")
      .eq("user_id", userId);

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error fetching cart products:", error);
    throw error;
  }
};

export const addToCart = async (
  productId: string,
  userId: string,
  quantity: number = 1
) => {
  try {
    // Check if product already exists in cart_items
    const { data: existingItem, error: fetchError } = await supabase
      .from("cart_items")
      .select("*")
      .eq("product_id", productId)
      .eq("user_id", userId)
      .single();

    //skip NOT FOUND error
    if (fetchError && fetchError.code !== "PGRST116") {
      throw fetchError;
    }

    //if Exist then update the quantity
    if (existingItem) {
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity: existingItem.quantity + quantity })
        .eq("id", existingItem.id);

      if (error) throw error;
      return true;
    }

    //Not found then add/insert to cart
    const { error } = await supabase.from("cart_items").insert([
      {
        product_id: productId,
        user_id: userId,
        quantity,
      },
    ]);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error adding to cart_items:", error);
    throw error;
  }
};

export const removeFromCart = async (cartItemId: string, userId: string) => {
  try {
    const { error } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", cartItemId)
      .eq("user_id", userId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error removing from cart_items:", error);
    throw error;
  }
};

//update the cart item quantity
export const updateCartQuantity = async (
  cartItemId: string,
  newQuantity: number
) => {
  try {
    if (newQuantity <= 0) {
      throw new Error("Quantity must be greater than 0");
    }

    const { error } = await supabase
      .from("cart_items")
      .update({ quantity: newQuantity })
      .eq("id", cartItemId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error("Error updating cart quantity:", error);
    throw error;
  }
};
