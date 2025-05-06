import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { Product } from "@/types/product";
import { supabaseTable } from "@/constants/subabase";

/**
 * PUT endpoint for updating a product
 *
 * This API route handles product updates in the database. It expects:
 * - productId in the URL params
 * - Update data in the request body
 *
 * The endpoint performs the following operations:
 * 1. Validates the product ID
 * 2. Validates the update data
 * 3. Updates the product in the database
 * 4. Returns the updated product or appropriate error
 *
 * @param request - The incoming HTTP request
 * @param params - Object containing route parameters
 * @returns NextResponse with either:
 *   - Success: Updated product data
 *   - Error: Appropriate error message and status code
 *
 * Error Scenarios:
 * - 400: Missing product ID or update data
 * - 404: Product not found
 * - 500: Database error or server error
 */

export async function PUT(request: Request) {
  try {
    // Initialize Supabase client with admin privileges
    const supabase = await createClient({ isAdmin: true });
    // Extract productId from the URL
    const url = new URL(request.url);
    const pathParts = url.pathname.split("/");
    const productId = pathParts[pathParts.length - 1];

    // Validate product ID
    if (!productId) {
      return NextResponse.json({
        data: null,
        error: "Product ID is required",
        status: 400,
        statusText: "failed",
      });
    }

    // Parse and validate update data
    const updateData: Partial<Product> = await request.json();
    if (!updateData || Object.keys(updateData).length === 0) {
      return NextResponse.json({
        data: null,
        error: "Update data is required",
        status: 400,
        statusText: "failed",
      });
    }

    // Perform database update
    const { data, error } = await supabase
      .from(supabaseTable.PRODUCTS)
      .update(updateData)
      .eq("id", productId)
      .select();

    // Handle database errors
    if (error) {
      return NextResponse.json({
        data: null,
        error: error.message,
        status: 500,
        statusText: "failed",
      });
    }

    // Handle case where product is not found
    if (!data || data.length === 0) {
      return NextResponse.json({
        data: null,
        error: "Product not found",
        status: 404,
        statusText: "failed",
      });
    }

    // Return success response with updated product
    const updatedProduct: Product = data[0];
    return NextResponse.json({
      data: updatedProduct,
      status: 200,
      statusText: "success",
    });
  } catch (error) {
    // Handle unexpected errors
    return NextResponse.json({
      data: null,
      error: "Internal server error: " + error,
      status: 500,
      statusText: "failed",
    });
  }
}
