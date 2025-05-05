import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { CartItem } from "@/types/cartItem";
import { supabaseTable } from "@/constants/subabase";


/**
 * GET endpoint for fetching user's cart items
 *
 * Returns:
 * - All cart items for the authenticated user
 * - Error response if fetching fails
 */
export async function GET(request: Request) {
  try {
    const supabase = await createClient();

    const { data, error } = await supabase.from(supabaseTable.CART_ITEMS).select("*");
    if (error) {
      return NextResponse.json({
        data: null,
        error: error,
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
  } catch (error) {
    return NextResponse.json({
      data: null,
      error: error,
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
 * - Updated cart item data if successful
 * - Error response if operation fails
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { product_id, user_id, quantity }: Omit<CartItem, "id"> =
      await request.json();

    // Check if product already exists in cart for this user
    const { data: existed } = await supabase
      .from(supabaseTable.CART_ITEMS)
      .select()
      .eq("product_id", product_id)
      .eq("user_id", user_id)
      .single();
    if (existed) {
      // Update the quantity by incrementing the existing quantity
      const { data, error } = await supabase
        .from(supabaseTable.CART_ITEMS)
        .update({ quantity: existed.quantity + quantity })
        .eq("id", existed.id)
        .select()
        .single();

      return NextResponse.json({
        data: data,
        error: null,
        status: 200,
        statusText: "success",
      });
    }
    const { data, error } = await supabase
      .from(supabaseTable.CART_ITEMS)
      .insert([{ product_id, user_id }])
      .select()
      .single();

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
  } catch (error) {
    return NextResponse.json({
      data: null,
      error: error,
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
 * - Updated cart item data if successful
 * - Error response if operation fails
 */
export async function PATCH(request: Request) {
  try {
    console.log("Starting PATCH request for cart item update");
    const supabase = await createClient();
    const { searchParams } = new URL(request.url);
    const cartId = searchParams.get("id");
    const quantity = Number(searchParams.get("quantity"));

    console.log(
      `Received parameters - cartId: ${cartId}, quantity: ${quantity}`
    );

    if (!cartId || !quantity) {
      console.error("Missing required parameters");
      return NextResponse.json({
        data: null,
        error: "Missing required parameters",
        status: 400,
        statusText: "failed",
      });
    }

    console.log("Attempting to update cart item in database");
    const { data, error } = await supabase
      .from(supabaseTable.CART_ITEMS)
      .update({ quantity })
      .eq("id", cartId)
      .single();

    if (error) {
      console.error("Error updating cart item:", error.message);
      return NextResponse.json({
        data: null,
        error: error.message,
        status: 500,
        statusText: "failed",
      });
    }

    console.log("Successfully updated cart item:", data);
    return NextResponse.json({
      data: data,
      error: null,
      status: 200,
      statusText: "success",
    });
  } catch (error) {
    console.error("Unexpected error in PATCH request:", error);
    return NextResponse.json({
      data: null,
      error: `Failed!: ${error}`,
      status: 500,
      statusText: "failed",
    });
  }
}
