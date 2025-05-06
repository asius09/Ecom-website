import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { CartItem } from "@/types/cartItem";
import { supabaseTable } from "@/constants/subabase";

type SuccessResponse<T> = { data: T; status: number; statusText: string };
type ErrorResponse = { data: null; error: string; status: number; statusText: string };
type ResponseType<T> = NextResponse<SuccessResponse<T> | ErrorResponse>;

/**
 * GET endpoint for fetching user's cart items
 * 
 * Returns:
 * - SuccessResponse<CartItem[]> with all cart items for authenticated user
 * - ErrorResponse if fetching fails
 * 
 * Client-side usage example:
 * 
 * async function fetchCartItems() {
 *   const response = await fetch('/api/user/cart');
 *   if (!response.ok) {
 *     throw new Error('Failed to fetch cart items');
 *   }
 *   return await response.json();
 * }
 */
export async function GET(): Promise<ResponseType<CartItem[]>> {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from(supabaseTable.CART_ITEMS)
      .select("*");

    if (error) {
      return NextResponse.json({
        data: null,
        error: error.message,
        status: 500,
        statusText: "failed",
      });
    }

    return NextResponse.json({
      data: data,
      error: null,
      status: 200,
      statusText: "success",
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({
      data: null,
      error: errorMessage,
      status: 500,
      statusText: "failed",
    });
  }
}

/**
 * POST endpoint for adding items to user's cart
 * 
 * Takes in request body:
 * - product_id: string (required) - ID of product to add
 * - user_id: string (required) - ID of user adding product
 * - quantity: number (required) - Quantity to add
 * 
 * Returns:
 * - SuccessResponse<CartItem> with updated cart item data
 * - ErrorResponse if operation fails
 * 
 * Client-side usage example:
 * 
 * async function addToCart(productId: string, userId: string, quantity: number) {
 *   const response = await fetch('/api/user/cart', {
 *     method: 'POST',
 *     headers: { 'Content-Type': 'application/json' },
 *     body: JSON.stringify({ product_id: productId, user_id: userId, quantity })
 *   });
 *   if (!response.ok) {
 *     throw new Error('Failed to add item to cart');
 *   }
 *   return await response.json();
 * }
 */
export async function POST(request: Request): Promise<ResponseType<CartItem>> {
  try {
    const supabase = await createClient();
    const { product_id, user_id, quantity }: Omit<CartItem, "id"> = await request.json();

    if (!product_id || !user_id || !quantity) {
      return NextResponse.json({
        data: null,
        error: "Missing required fields",
        status: 400,
        statusText: "failed",
      });
    }

    // Check if product already exists in cart for this user
    const { data: existingItem } = await supabase
      .from(supabaseTable.CART_ITEMS)
      .select()
      .eq("product_id", product_id)
      .eq("user_id", user_id)
      .single();

    if (existingItem) {
      // Update quantity if item exists
      const { data, error } = await supabase
        .from(supabaseTable.CART_ITEMS)
        .update({ quantity: existingItem.quantity + quantity })
        .eq("id", existingItem.id)
        .select()
        .single();

      if (error) throw error;

      return NextResponse.json({
        data: data,
        error: null,
        status: 200,
        statusText: "success",
      });
    }

    // Insert new item if it doesn't exist
    const { data, error } = await supabase
      .from(supabaseTable.CART_ITEMS)
      .insert([{ product_id, user_id, quantity }])
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      data: data,
      error: null,
      status: 200,
      statusText: "success",
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({
      data: null,
      error: errorMessage,
      status: 500,
      statusText: "failed",
    });
  }
}

/**
 * PATCH endpoint for updating cart item quantity
 * 
 * Takes in URL parameters:
 * - id: string (required) - ID of cart item to update
 * - quantity: number (required) - New quantity for the item
 * 
 * Returns:
 * - SuccessResponse<CartItem> with updated cart item data
 * - ErrorResponse if operation fails
 * 
 * Client-side usage example:
 * 
 * async function updateCartItem(cartId: string, quantity: number) {
 *   const response = await fetch(`/api/user/cart?id=${cartId}&quantity=${quantity}`, {
 *     method: 'PATCH'
 *   });
 *   if (!response.ok) {
 *     throw new Error('Failed to update cart item');
 *   }
 *   return await response.json();
 * }
 */
export async function PATCH(request: Request): Promise<ResponseType<CartItem>> {
  try {
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const cartId = searchParams.get("id");
    const quantity = Number(searchParams.get("quantity"));

    if (!cartId || !quantity) {
      return NextResponse.json({
        data: null,
        error: "Missing required parameters",
        status: 400,
        statusText: "failed",
      });
    }

    const { data, error } = await supabase
      .from(supabaseTable.CART_ITEMS)
      .update({ quantity })
      .eq("id", cartId)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      data: data,
      error: null,
      status: 200,
      statusText: "success",
    });
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({
      data: null,
      error: errorMessage,
      status: 500,
      statusText: "failed",
    });
  }
}
