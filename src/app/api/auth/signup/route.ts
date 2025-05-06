import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";

type SignupRequest = {
  email: string;
  password: string;
  name: string;
};

type SignupResponse = {
  data: {
    id?: string;
    email?: string;
    [key: string]: unknown;
  } | null;
  error?: string;
  status: number;
  statusText: "success" | "failed";
};

/**
 * POST endpoint for user signup
 *
 * This endpoint handles user registration by:
 * 1. Checking if user already exists
 * 2. Creating auth user if not exists
 * 3. Creating corresponding user record in users table
 * 4. Returning appropriate responses
 *
 * Request Body Requirements:
 * - email: string (required) - User's email address
 * - password: string (required) - User's password (min 8 chars)
 * - name: string (required) - User's full name
 *
 * Response Structure:
 * - On Success (201 Created):
 *   {
 *     data: { id, email, ... }, // Created user object
 *     status: 201,
 *     statusText: "success"
 *   }
 * - On Error:
 *   {
 *     data: null,
 *     error: string, // Error message
 *     status: number, // HTTP status code
 *     statusText: "failed"
 *   }
 *
 * Error Scenarios:
 * - Missing required fields (400 Bad Request)
 * - User already exists (409 Conflict)
 * - Invalid email format (400 Bad Request)
 * - Weak password (400 Bad Request)
 * - Database operation failure (500 Internal Server Error)
 *
 * Client-side usage example:
 *
 * async function signup(email: string, password: string, name: string) {
 *   const response = await fetch('/api/auth/signup', {
 *     method: 'POST',
 *     headers: {
 *       'Content-Type': 'application/json',
 *     },
 *     body: JSON.stringify({ email, password, name })
 *   });
 *
 *   if (!response.ok) {
 *     const errorData = await response.json();
 *     throw new Error(errorData.error || 'Signup failed');
 *   }
 *
 *   return await response.json();
 * }
 */
export async function POST(
  request: Request
): Promise<NextResponse<SignupResponse>> {
  try {
    const supabase = await createClient();
    const { email, password, name }: SignupRequest = await request.json();

    // Validate required fields
    if (!email || !password || !name) {
      return NextResponse.json({
        data: null,
        error: "Email, password, and name are required",
        status: 400,
        statusText: "failed",
      });
    }

    // Check for existing user
    const { data: existingUser } = await supabase
      .from("users")
      .select("*")
      .eq("email", email)
      .single();

    if (existingUser) {
      return NextResponse.json({
        data: null,
        error: "User with this email already exists",
        status: 409,
        statusText: "failed",
      });
    }

    // Create auth user
    const { data, error: signupError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name,
          is_admin: false,
        },
      },
    });

    if (signupError) {
      return NextResponse.json({
        data: null,
        error: signupError.message,
        status: signupError.status || 400,
        statusText: "failed",
      });
    }

    // Create user record in database
    if (data.user) {
      const { error: insertError } = await supabase.from("users").insert({
        id: data.user.id,
        email: data.user.email,
        name,
        is_admin: false,
        created_at: new Date().toISOString(),
      });

      if (insertError) {
        return NextResponse.json({
          data: null,
          error: insertError.message,
          status: 500,
          statusText: "failed",
        });
      }
    }

    return NextResponse.json({
      data: {
        ...data.user,
        id: data.user?.id,
      },
      status: 201,
      statusText: "success",
    });
  } catch (error: unknown) {
    const errorMessage =
      error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({
      data: null,
      error: errorMessage,
      status: 500,
      statusText: "failed",
    });
  }
}
