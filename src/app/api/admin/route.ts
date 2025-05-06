import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { User } from "@/types/user";

type ResourceType = "users" | "orders" | "products";
type UpdateType = "user" | "user_metadata";
type UserUpdates = Partial<User>;
type ErrorResponse = { error: string; status: number };
type SuccessResponse<T> = { data: T; status: number };

interface UserMetadataPayload {
  data: Partial<User>;
}

interface UserUpdatePayload extends Partial<User> {
  id: string;
}

/**
 * GET endpoint for fetching admin data
 *
 * @param {Request} request - The incoming request object
 * @returns {Promise<NextResponse<SuccessResponse<unknown> | ErrorResponse>>} - Response with data or error
 *
 * URL Parameters:
 * - resource: string (required) - The resource type to fetch (users, orders, products)
 * - id: string (optional) - Specific ID to filter by
 * - order_id: string (optional) - Specific order ID to filter by
 * - product_id: string (optional) - Specific product ID to filter by
 * - user_id: string (optional) - Specific user ID to filter by
 *
 * Returns:
 * - 200: Success response with requested data
 * - 400: Bad request if resource parameter is missing or invalid
 * - 500: Internal server error if database query fails
 */
export async function GET(
  request: Request
): Promise<NextResponse<SuccessResponse<unknown> | ErrorResponse>> {
  try {
    const supabase = await createClient({ isAdmin: true });
    const url = new URL(request.url);
    const resource = url.searchParams.get("resource") as ResourceType | null;
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
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({
      error: errorMessage,
      status: 500,
    });
  }
}

/**
 * PUT endpoint for updating user information
 *
 * @param {Request} request - The incoming request object
 * @returns {Promise<NextResponse<SuccessResponse<unknown> | ErrorResponse>>} - Response with updated data or error
 *
 * URL Parameters:
 * - user: string (required) - The ID of the user to update
 * - type: string (optional) - Specifies update type ('user' or 'user_metadata', defaults to 'user')
 *
 * Request Body:
 * - updates: object (required) - Fields to update as key-value pairs
 *
 * Returns:
 * - 200: Success response with updated user data
 * - 400: Bad request if parameters are missing or invalid
 * - 500: Internal server error if update operation fails
 */
export async function PUT(
  request: Request
): Promise<NextResponse<SuccessResponse<unknown> | ErrorResponse>> {
  try {
    const supabase = await createClient({ isAdmin: true });
    const url = new URL(request.url);
    const userId = url.searchParams.get("user");
    const type = (url.searchParams.get("type") || "user") as UpdateType;
    const updates = (await request.json()) as UserUpdates;

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

    let updatePayload: UserUpdatePayload | UserMetadataPayload = { id: userId };

    if (type === "user_metadata") {
      const { data: user, error: fetchError } = await supabase.auth.getUser();

      if (fetchError) {
        return NextResponse.json({
          error: fetchError.message,
          status: 500,
        });
      }

      updatePayload = {
        data: {
          ...(user.user.user_metadata || {}),
          ...updates,
        },
      };
    } else {
      updatePayload = { ...updatePayload, ...updates };
    }

    const { data: authUser, error: authError } =
      await supabase.auth.updateUser(updatePayload);

    if (authError) {
      return NextResponse.json({
        error: authError.message,
        status: 500,
      });
    }

    const usersTableFields = ["email", "phone", "full_name", "avatar_url"];
    const usersTableUpdates = Object.keys(updates).filter((key) =>
      usersTableFields.includes(key)
    );

    if (usersTableUpdates.length > 0) {
      const updateData = usersTableUpdates.reduce<Record<string, unknown>>(
        (acc, key) => {
          const typedKey = key as keyof UserUpdates;
          acc[key] = updates[typedKey];
          return acc;
        },
        {}
      );

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
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({
      error: errorMessage,
      status: 500,
    });
  }
}
