import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { supabaseTable } from "@/constants/subabase";

/**
 * GET endpoint for retrieving users
 *
 * This endpoint handles fetching users from the database. It performs the following operations:
 * 1. Accepts optional query parameters for filtering
 * 2. Retrieves users from the 'users' table
 * 3. Returns the user data or appropriate error messages
 *
 * Query Parameters:
 * - id: string (optional) - Specific user ID to retrieve
 *
 * Response Structure:
 * - On Success (200 OK):
 *   {
 *     data: User[] | User, // Array of users or single user
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
 * async function getUsers(userId?: string) {
 *   const url = '/api/admin/users' + (userId ? `?id=${userId}` : '');
 *   const response = await fetch(url);
 *
 *   const responseData = await response.json();
 *   if (responseData.statusText === "failed") {
 *     throw new Error(responseData.error || 'Failed to fetch users');
 *   }
 *
 *   return responseData.data;
 * }
 */
export async function GET(request: Request) {
  try {
    console.log("Initializing Supabase client for admin users endpoint");
    const supabase = await createClient({ isAdmin: true });
    const url = new URL(request.url);
    const id = url.searchParams.get("id");

    console.log(`Fetching users${id ? ` with ID: ${id}` : ""}`);
    let query = supabase.from(supabaseTable.USERS).select("*");

    if (id) {
      console.log("Adding ID filter to query");
      query = query.eq("id", id);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching users:", error);
      return NextResponse.json({
        data: null,
        error: error.message,
        status: 500,
        statusText: "failed",
      });
    }

    console.log(
      `Successfully fetched ${Array.isArray(data) ? data.length : 1} user(s)`
    );
    return NextResponse.json({
      data,
      status: 200,
      statusText: "success",
    });
  } catch (error) {
    console.error("Unexpected error in users endpoint:", error);
    return NextResponse.json({
      data: null,
      error: "Internal server error",
      status: 500,
      statusText: "failed",
    });
  }
}
