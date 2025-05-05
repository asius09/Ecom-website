import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { Product } from "@/types/product";
import { supabaseTable } from "@/constants/subabase";

/**
 * GET endpoint for retrieving products
 *
 * This endpoint handles fetching products from the database. It performs the following operations:
 * 1. Accepts optional query parameters for filtering
 * 2. Retrieves products from the 'products' table
 * 3. Returns the product data or appropriate error messages
 *
 * Query Parameters:
 * - id: string (optional) - Specific product ID to retrieve
 *
 * Response Structure:
 * - On Success (200 OK):
 *   {
 *     data: Product[] | Product, // Array of products or single product
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
 * - Database operation failure (500 Internal Server Error)
 * - Unexpected server error (500 Internal Server Error)
 *
 * Client-side usage example:
 *
 * async function getProducts(productId?: string) {
 *   const url = '/api/admin/products' + (productId ? `?id=${productId}` : '');
 *   const response = await fetch(url);
 *
 *   const responseData = await response.json();
 *   if (responseData.statusText === "failed") {
 *     throw new Error(responseData.error || 'Failed to fetch products');
 *   }
 *
 *   return responseData.data;
 * }
 */
export async function GET(request: Request) {
  try {
    const supabase = await createClient({ isAdmin: true });
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    let query = supabase.from(supabaseTable.PRODUCTS).select("*");

    if (id) {
      query = query.eq("id", id);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({
        data: null,
        error: error.message,
        status: 500,
        statusText: "failed",
      });
    }

    return NextResponse.json({
      data,
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

/**
 * POST endpoint for creating new products
 *
 * This endpoint handles the creation of new products in the database. It performs the following operations:
 * 1. Validates the incoming request body for required fields
 * 2. Validates the data types and constraints of the provided values
 * 3. Creates a new product record in the 'products' table
 * 4. Returns the created product data or appropriate error messages
 *
 * Request Body Requirements:
 * - name: string (required) - Product name
 * - description: string (required) - Product description
 * - price: number (required) - Product price (must be a valid number)
 * - stock_quantity: number (required) - Available stock quantity (must be a positive integer)
 * - image_url: string (required) - URL of product image
 *
 * Response Structure:
 * - On Success (201 Created):
 *   {
 *     data: Product, // The created product object
 *     status: 201,
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
 * - Missing required fields (400 Bad Request)
 * - Invalid price format (400 Bad Request)
 * - Invalid stock quantity (400 Bad Request)
 * - Database operation failure (500 Internal Server Error)
 * - Unexpected server error (500 Internal Server Error)
 *
 * Client-side usage example:
 *
 * async function createProduct(productData: Omit<Product, 'id' | 'created_at' | 'updated_at'>) {
 *   const response = await fetch('/api/admin/products', {
 *     method: 'POST',
 *     headers: {
 *       'Content-Type': 'application/json',
 *     },
 *     body: JSON.stringify(productData)
 *   });
 *
 *   const responseData = await response.json();
 *   if (responseData.statusText === "failed") {
 *     throw new Error(responseData.error || 'Failed to create product');
 *   }
 *
 *   return responseData;
 * }
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient({ isAdmin: true });
    const product = await request.json();

    // Validate required fields for product creation
    const requiredFields = [
      "name",
      "description",
      "price",
      "stock_quantity",
      "image_url",
    ];
    const missingFields = requiredFields.filter((field) => !product[field]);

    if (missingFields.length > 0) {
      return NextResponse.json({
        data: null,
        error: `Missing required fields: ${missingFields.join(", ")}`,
        status: 400,
        statusText: "failed",
      });
    }

    // Validate price is a number
    if (isNaN(parseFloat(product.price))) {
      return NextResponse.json({
        data: null,
        error: "Price must be a valid number",
        status: 400,
        statusText: "failed",
      });
    }

    // Validate stock quantity is a positive integer
    if (
      !Number.isInteger(product.stock_quantity) ||
      product.stock_quantity < 0
    ) {
      return NextResponse.json({
        data: null,
        error: "Stock quantity must be a positive integer",
        status: 400,
        statusText: "failed",
      });
    }

    // Create new product
    const { data: createdProduct, error } = await supabase
      .from(supabaseTable.PRODUCTS)
      .insert({
        name: product.name,
        description: product.description,
        price: parseFloat(product.price),
        stock_quantity: product.stock_quantity,
        image_url: product.image_url,
        review: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
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
      data: createdProduct,
      status: 201,
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

/**
 * DELETE endpoint for removing a product
 *
 * This endpoint handles deleting a product from the database. It performs the following operations:
 * 1. Accepts a product ID as a query parameter
 * 2. Deletes the product from the 'products' table
 * 3. Returns success/error response
 *
 * Query Parameters:
 * - product_id: string (required) - Product ID to delete
 *
 * Response Structure:
 * - On Success (200 OK):
 *   {
 *     data: null,
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
 * - Missing product_id parameter (400 Bad Request)
 * - Database operation failure (500 Internal Server Error)
 * - Unexpected server error (500 Internal Server Error)
 *
 * Client-side Example with Debugging:
 *
 * async function deleteProduct(productId: string) {
 *   try {
 *     console.log('Attempting to delete product with ID:', productId);
 *
 *     const response = await fetch('/api/admin/products', {
 *       method: 'DELETE',
 *       headers: {
 *         'Content-Type': 'application/json',
 *       },
 *       body: JSON.stringify({ product_id: productId }),
 *     });
 *
 *     const result = await response.json();
 *     console.log('Delete API Response:', result);
 *
 *     if (result.statusText === 'success') {
 *       console.log('Product deleted successfully');
 *       // Update local state or refetch products
 *     } else {
 *       console.error('Delete failed with error:', result.error);
 *       throw new Error(result.error || 'Failed to delete product');
 *     }
 *   } catch (error) {
 *     console.error('Error deleting product:', error);
 *     // Handle error (show toast, etc.)
 *   }
 * }
 */
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient({ isAdmin: true });
    const { product_id } = await request.json();

    if (!product_id) {
      return NextResponse.json({
        data: null,
        error: "Product ID is required",
        status: 400,
        statusText: "failed",
      });
    }

    const { data, error } = await supabase
      .from(supabaseTable.PRODUCTS)
      .delete()
      .eq("id", product_id)
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

    return NextResponse.json({
      data: null,
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

