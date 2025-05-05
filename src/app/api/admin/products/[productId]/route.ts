import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { Product } from "@/types/product";
import { supabaseTable } from "@/constants/subabase";

/**
 * PUT endpoint for updating a product
 *
 * This endpoint handles updating a product in the database. It performs the following operations:
 * 1. Accepts a product ID from the URL path
 * 2. Accepts update data in the request body
 * 3. Updates the product in the 'products' table
 * 4. Returns the updated product data
 *
 * URL Parameters:
 * - productId: string (required) - Product ID to update (from URL path)
 *
 * Request Body:
 * - name?: string - New product name
 * - description?: string - New product description
 * - price?: number - New product price
 * - stock_quantity?: number - New stock quantity
 * - image_url?: string - New image URL
 *
 * Response Structure:
 * - On Success (200 OK):
 *   {
 *     data: Product, // Updated product data
 *     status: 200,
 *     statusText: "success"
 *   }
 * - On Error:
 *   {
 *     data: null,
 *     error: string, // Error message describing the issue
 *     status: 500, // HTTP status code
 *     statusText: "failed"
 *   }
 *
 * Error Scenarios:
 * - Missing productId parameter (400 Bad Request)
 * - Missing update data (400 Bad Request)
 * - Database operation failure (500 Internal Server Error)
 * - Product not found (404 Not Found)
 * - Unexpected server error (500 Internal Server Error)
 *
 * Client-side Example with Debugging:
 *
 * async function updateProduct(productId: string, updateData: Partial<Product>) {
 *   try {
 *     console.log('Attempting to update product with ID:', productId);
 *     console.log('Update data:', updateData);
 *
 *     const response = await fetch(`/api/admin/products/${productId}`, {
 *       method: 'PUT',
 *       headers: {
 *         'Content-Type': 'application/json',
 *       },
 *       body: JSON.stringify(updateData),
 *     });
 *
 *     const result = await response.json();
 *     console.log('Update API Response:', result);
 *
 *     if (result.statusText === 'success') {
 *       console.log('Product updated successfully');
 *       // Update local state or refetch products
 *       return result.data;
 *     } else {
 *       console.error('Update failed with error:', result.error);
 *       throw new Error(result.error || 'Failed to update product');
 *     }
 *   } catch (error) {
 *     console.error('Error updating product:', error);
 *     // Handle error (show toast, etc.)
 *     throw error;
 *   }
 * }
 */

export async function PUT(
  request: Request,
  { params }: { params: { productId: string } }
) {
  try {
    const supabase = await createClient({ isAdmin: true });
    const { productId } = params;

    if (!productId) {
      return NextResponse.json({
        data: null,
        error: "Product ID is required",
        status: 400,
        statusText: "failed",
      });
    }

    const updateData: Partial<Product> = await request.json();

    if (!updateData || Object.keys(updateData).length === 0) {
      return NextResponse.json({
        data: null,
        error: "Update data is required",
        status: 400,
        statusText: "failed",
      });
    }

    const { data, error } = await supabase
      .from(supabaseTable.PRODUCTS)
      .update(updateData)
      .eq("id", productId)
      .select();

    if (error) {
      return NextResponse.json({
        data: null,
        error: error.message,
        status: 500,
        statusText: "failed",
      });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({
        data: null,
        error: "Product not found",
        status: 404,
        statusText: "failed",
      });
    }

    const updatedProduct: Product = data[0];
    return NextResponse.json({
      data: updatedProduct,
      status: 200,
      statusText: "success",
    });
  } catch (error) {
    return NextResponse.json({
      data: null,
      error: "Internal server error",
      status: 500,
      statusText: "failed",
    });
  }
}
