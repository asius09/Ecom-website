import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { WishlistItem } from "@/types/wishlistItem";

const WISHLIST_TABLE = "wishlist_items";

/**
 * GET endpoint for wishlist operations
 *
 * This endpoint handles fetching wishlist items with the following features:
 * 1. Creates a Supabase client instance
 * 2. Accepts optional user and product parameters for filtering
 * 3. Fetches data from the 'wishlist_items' table
 * 4. Supports filtering by user_id and/or product_id
 * 5. Returns structured response with success/error handling
 *
 * Query Parameters:
 * - user: string (optional) - Filter by user ID
 * - product: string (optional) - Filter by product ID
 *
 * Response Structure:
 * - On Success (200 OK):
 *   {
 *     data: WishlistItem[], // Array of wishlist items
 *     error: null,
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
 * Client-side Example:
 *
 * async function fetchWishlist(userId?: string, productId?: string) {
 *   try {
 *     const url = new URL('/api/user/wishlist', window.location.origin);
 *     if (userId) url.searchParams.set('user', userId);
 *     if (productId) url.searchParams.set('product', productId);
 *
 *     const response = await fetch(url.toString());
 *     const result = await response.json();
 *
 *     if (result.statusText === 'success') {
 *       return result.data;
 *     } else {
 *       throw new Error(result.error || 'Failed to fetch wishlist');
 *     }
 *   } catch (error) {
 *     console.error('Error fetching wishlist:', error);
 *     throw error;
 *   }
 * }
 */
export async function GET(request: Request) {
  try {
    const supabase = await createClient();
    const url = new URL(request.url);
    const userId = url.searchParams.get("user");
    const productId = url.searchParams.get("product");

    let query = supabase.from(WISHLIST_TABLE).select("*");

    if (userId) {
      query = query.eq("user_id", userId);
    }
    if (productId) {
      query = query.eq("product_id", productId);
    }

    const { data, error } = await query;

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
 * POST endpoint for adding items to wishlist
 *
 * This endpoint handles adding items to wishlist with the following features:
 * 1. Creates a Supabase client instance
 * 2. Accepts product_id and user_id in request body
 * 3. Inserts new record into 'wishlist_items' table
 * 4. Returns structured response with success/error handling
 *
 * Request Body:
 * {
 *   product_id: string,
 *   user_id: string
 * }
 *
 * Response Structure:
 * - On Success (201 Created):
 *   {
 *     data: WishlistItem, // The created wishlist item
 *     error: null,
 *     status: 201,
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
 * Client-side Example:
 *
 * async function addToWishlist(productId: string, userId: string) {
 *   try {
 *     const response = await fetch('/api/user/wishlist', {
 *       method: 'POST',
 *       headers: {
 *         'Content-Type': 'application/json',
 *       },
 *       body: JSON.stringify({ product_id: productId, user_id: userId })
 *     });
 *
 *     const result = await response.json();
 *
 *     if (result.statusText === 'success') {
 *       return result.data;
 *     } else {
 *       throw new Error(result.error || 'Failed to add to wishlist');
 *     }
 *   } catch (error) {
 *     console.error('Error adding to wishlist:', error);
 *     throw error;
 *   }
 * }
 */
export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { product_id, user_id }: Omit<WishlistItem, "id"> =
      await request.json();

    const { data, error } = await supabase
      .from(WISHLIST_TABLE)
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
      status: 201,
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
 * DELETE endpoint for removing items from wishlist
 *
 * This endpoint handles removing items from wishlist with the following features:
 * 1. Creates a Supabase client instance
 * 2. Accepts id and user_id in request body
 * 3. Deletes record from 'wishlist_items' table
 * 4. Returns structured response with success/error handling
 *
 * Request Body:
 * {
 *   id: string, // Wishlist item ID
 *   user_id: string // User ID for verification
 * }
 *
 * Response Structure:
 * - On Success (200 OK):
 *   {
 *     data: WishlistItem, // The deleted wishlist item
 *     error: null,
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
 * Client-side Example:
 *
 * async function removeFromWishlist(wishlistId: string, userId: string) {
 *   try {
 *     const response = await fetch('/api/user/wishlist', {
 *       method: 'DELETE',
 *       headers: {
 *         'Content-Type': 'application/json',
 *       },
 *       body: JSON.stringify({ id: wishlistId, user_id: userId })
 *     });
 *
 *     const result = await response.json();
 *
 *     if (result.statusText === 'success') {
 *       return result.data;
 *     } else {
 *       throw new Error(result.error || 'Failed to remove from wishlist');
 *     }
 *   } catch (error) {
 *     console.error('Error removing from wishlist:', error);
 *     throw error;
 *   }
 * }
 */
export async function DELETE(request: Request) {
  try {
    const supabase = await createClient();

    const { id, user_id } = await request.json();

    const { data, error } = await supabase
      .from(WISHLIST_TABLE)
      .delete()
      .eq("id", id)
      .eq("user_id", user_id)
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
