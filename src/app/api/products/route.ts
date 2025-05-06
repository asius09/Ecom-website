import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { supabaseTable } from "@/constants/subabase";

/**
 * GET endpoint for getting products with optional search functionality
 *
 * This endpoint handles fetching products from the database with the following features:
 * 1. Creates a Supabase client instance
 * 2. Accepts optional search parameter for filtering products
 * 3. Fetches products from the 'products' table
 * 4. Supports case-insensitive search on name and description fields
 * 5. Returns structured response with success/error handling
 *
 * Query Parameters:
 * - search: string (optional) - Search term to filter products by name or description
 *
 * Response Structure:
 * - On Success (200 OK):
 *   {
 *     data: Product[], // Array of product objects
 *     status: 200,
 *     statusText: "success"
 *   }
 * - On Error:
 *   {
 *     data: null,
 *     error: string, // Detailed error message
 *     status: number, // HTTP status code
 *     statusText: "failed"
 *   }
 *
 * Error Scenarios:
 * - Database connection failure (500 Internal Server Error)
 * - Invalid search query (400 Bad Request)
 * - Database query failure (500 Internal Server Error)
 * - Unexpected server error (500 Internal Server Error)
 *
 * Client-side Example with Debugging:
 *
 * async function fetchProducts() {
 *   try {
 *     console.log('Attempting to fetch products');
 *     const response = await fetch('/api/products', {
 *       method: 'GET'
 *     });
 *
 *     const result = await response.json();
 *     console.log('Products API Response:', result);
 *
 *     if (result.statusText === 'success') {
 *       console.log('Products fetched successfully');
 *       return result.data;
 *     } else {
 *       console.error('Fetch failed with error:', result.error);
 *       throw new Error(result.error || 'Failed to fetch products');
 *     }
 *   } catch (error) {
 *     console.error('Error fetching products:', error);
 *     throw error;
 *   }
 * }
 */

export async function GET(request: Request) {
  try {
    console.log("Initializing products API request");
    const supabase = await createClient();
    console.log("Supabase client created successfully");

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search")?.toLowerCase();
    console.log(`Received search parameter: ${search || "None"}`);

    let query = supabase.from(supabaseTable.PRODUCTS).select("*");
    console.log("Base query constructed");

    if (search) {
      console.log("Applying search filter");
      query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
    }

    console.log("Executing database query...");
    const { data, error } = await query;

    if (error) {
      console.error(`Database error: ${error.message}`);
      return NextResponse.json({
        data: null,
        error: `Database operation failed: ${error.message}`,
        status: 500,
        statusText: "failed",
      });
    }

    console.log(`Successfully fetched ${data?.length || 0} products`);
    return NextResponse.json({
      data: data,
      error: null,
      status: 200,
      statusText: "success",
    });
  } catch (error: any) {
    console.error(`Unexpected error in products API: ${error.message}`);
    console.error("Error stack:", error.stack);
    return NextResponse.json({
      data: null,
      error: `Internal server error: ${error.message}`,
      status: 500,
      statusText: "failed",
    });
  }
}
