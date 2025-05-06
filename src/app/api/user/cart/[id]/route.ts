import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { supabaseTable } from "@/constants/subabase";

/**
 * DELETE endpoint for removing items from user's cart
 *
 * Takes in URL parameters:
 * - id: string (required) - ID of cart item to remove
 *
 * Returns:
 * - Deleted cart item data if successful
 * - Error response if operation fails
 */
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();
    const url = new URL(request.url);
    const pathParts = url.pathname.split("/");
    const cartId = pathParts[pathParts.length - 1];

    if (!cartId) {
      return NextResponse.json({
        data: null,
        error: "Cart item ID is required",
        status: 400,
        statusText: "failed",
      });
    }

    const { data, error } = await supabase
      .from(supabaseTable.CART_ITEMS)
      .delete()
      .eq("id", cartId)
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
