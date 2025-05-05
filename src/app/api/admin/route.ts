import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { User } from "@/types/user";

export async function GET(request: Request) {
  try {
    const supabase = await createClient({ isAdmin: true });
    const url = new URL(request.url);
    const resource = url.searchParams.get("resource");
    const id = url.searchParams.get("id");
    const orderId = url.searchParams.get("order_id");
    const productId = url.searchParams.get("product_id");
    const userId = url.searchParams.get("user_id");

    if (!resource) {
      return NextResponse.json({
        error: "Resource parameter is required",
        status: 400,
      });
    }

    let query;
    switch (resource) {
      case "users":
        query = supabase.from("users").select("*");
        if (id) query = query.eq("id", id);
        if (userId) query = query.eq("id", userId);
        break;
      case "orders":
        query = supabase.from("orders").select("*");
        if (id) query = query.eq("id", id);
        if (orderId) query = query.eq("id", orderId);
        if (userId) query = query.eq("user_id", userId);
        break;
      case "products":
        query = supabase.from("products").select("*");
        if (id) query = query.eq("id", id);
        if (productId) query = query.eq("id", productId);
        break;
      default:
        return NextResponse.json({
          error: "Invalid resource specified",
          status: 400,
        });
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({
        error: error.message,
        status: 500,
      });
    }

    return NextResponse.json({
      data,
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({
      error: "Internal server error",
      status: 500,
    });
  }
}

/**
 * PUT endpoint for updating user information
 *
 * Takes in URL parameters:
 * - user: string (required) - The ID of the user to update
 * - type: string (optional) - Specifies if updating 'user_metadata' (defaults to 'user')
 *
 * Takes in request body:
 * - updates: object (required) - Fields to update as key-value pairs
 *
 * Updates:
 * - The specified user's auth information using supabase.updateUser
 * - If type is 'user_metadata', updates user metadata
 * - If the update contains fields that exist in the users table, updates that table as well
 *
 * Client-side usage example:
 *
 * async function updateUser(userId: string, updates: Record<string, any>, type: 'user' | 'user_metadata' = 'user') {
 *   const response = await fetch(`/api/admin?user=${userId}&type=${type}`, {
 *     method: 'PUT',
 *     headers: {
 *       'Content-Type': 'application/json',
 *     },
 *     body: JSON.stringify(updates)
 *   });
 *
 *   if (!response.ok) {
 *     throw new Error('Failed to update user');
 *   }
 *
 *   return await response.json();
 * }
 *
 * // Example usage:
 * // Update user metadata
 * await updateUser('user-id', { is_admin: true }, 'user_metadata');
 *
 * // Update user profile
 * await updateUser('user-id', { full_name: 'John Doe', email: 'john@example.com' });
 */
export async function PUT(request: Request) {
  try {
    const supabase = await createClient({ isAdmin: true });
    const url = new URL(request.url);
    const userId = url.searchParams.get("user");
    const type = url.searchParams.get("type") || "user";
    const updates = await request.json();

    if (!userId) {
      return NextResponse.json({
        error: "User ID is required in URL parameters",
        status: 400,
      });
    }

    if (!updates || typeof updates !== "object") {
      return NextResponse.json({
        error: "Updates object is required in request body",
        status: 400,
      });
    }

    if (type !== "user" && type !== "user_metadata") {
      return NextResponse.json({
        error: "Type parameter must be either 'user' or 'user_metadata'",
        status: 400,
      });
    }

    let updatePayload: any = { id: userId };

    if (type === "user_metadata") {
      // Get current user metadata
      const { data: user, error: fetchError } = await supabase.auth.getUser();

      if (fetchError) {
        return NextResponse.json({
          error: fetchError.message,
          status: 500,
        });
      }

      // Merge new updates with existing metadata
      updatePayload.data = {
        ...(user.user.user_metadata || {}),
        ...updates,
      };
    } else {
      // For regular user updates
      updatePayload = { ...updatePayload, ...updates };
    }

    // Update auth user
    const { data: authUser, error: authError } =
      await supabase.auth.updateUser(updatePayload);

    if (authError) {
      return NextResponse.json({
        error: authError.message,
        status: 500,
      });
    }

    // Check if any updates should be applied to users table
    const usersTableFields = ["email", "phone", "full_name", "avatar_url"];
    const usersTableUpdates = Object.keys(updates).filter((key) =>
      usersTableFields.includes(key)
    );

    if (usersTableUpdates.length > 0) {
      const updateData = usersTableUpdates.reduce(
        (acc, key) => {
          acc[key] = updates[key];
          return acc;
        },
        {} as Record<string, any>
      );

      // Update users table
      const { data: dbUser, error: dbError } = await supabase
        .from("users")
        .update(updateData)
        .eq("id", userId)
        .select()
        .single();

      if (dbError) {
        return NextResponse.json({
          error: dbError.message,
          status: 500,
        });
      }

      return NextResponse.json({
        data: {
          auth: authUser,
          db: dbUser,
        },
        status: 200,
      });
    }

    return NextResponse.json({
      data: authUser,
      status: 200,
    });
  } catch (error) {
    return NextResponse.json({
      error: "Internal server error",
      status: 500,
    });
  }
}
